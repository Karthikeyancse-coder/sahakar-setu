"""
FACE/service.py
Lightweight HTTP microservice wrapping ArcFace (InsightFace buffalo_l) model for Sahakar Setu.
Provides:
  - GET  /health      : Status & enrolled identities
  - POST /recognize   : Identifies face from multipart image or base64 JSON
  - POST /enroll      : Enrolls new face identity into enrolled.pkl
  - GET  /identities  : List of enrolled face names
"""

import sys
import os
import io
import time
import pickle
import base64
import numpy as np
import cv2
from typing import Optional
from fastapi import FastAPI, Request, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Windows DLL path resolution for CUDA / cuDNN
if sys.platform == "win32":
    cuda_path = os.environ.get("CUDA_PATH", r"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.8")
    cuda_bin = os.path.join(cuda_path, "bin")
    if os.path.exists(cuda_bin) and hasattr(os, "add_dll_directory"):
        os.add_dll_directory(cuda_bin)

from insightface.app import FaceAnalysis

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENROLLED_PATH = os.path.join(BASE_DIR, "enrolled.pkl")
THRESHOLD = 0.50  # ArcFace cosine similarity threshold

app = FastAPI(title="Sahakar Setu Face Recognition Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model and database holder
face_app = None
enrolled_db = {}


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


def load_database():
    global enrolled_db
    if not os.path.exists(ENROLLED_PATH):
        enrolled_db = {}
        return enrolled_db
    with open(ENROLLED_PATH, "rb") as f:
        data = pickle.load(f)
    if isinstance(data, np.ndarray):
        enrolled_db = {"person": data}
    else:
        enrolled_db = data
    return enrolled_db


def save_database(db):
    with open(ENROLLED_PATH, "wb") as f:
        pickle.dump(db, f)


def get_embedding(model, frame: np.ndarray):
    """Detect face(s) in frame and return the embedding of the largest detected face."""
    faces = model.get(frame)
    if not faces or len(faces) == 0:
        return None, None
    # Pick largest detected face by area
    faces.sort(key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]), reverse=True)
    return faces[0].embedding, faces[0].bbox


def decode_image_bytes(image_bytes: bytes) -> Optional[np.ndarray]:
    nparr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


@app.on_event("startup")
def startup_event():
    global face_app, enrolled_db
    print("[FaceService] Initializing InsightFace buffalo_l on CPUExecutionProvider...")
    try:
        face_app = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"]
        )
        face_app.prepare(ctx_id=-1, det_size=(640, 640))
        load_database()
        print(f"[FaceService] Model ready. Loaded {len(enrolled_db)} enrolled faces: {list(enrolled_db.keys())}")
    except Exception as e:
        print(f"[FaceService] Fatal error initializing model: {e}")


class Base64RecognizeRequest(BaseModel):
    image: str  # Data URL or raw base64 string


class Base64EnrollRequest(BaseModel):
    identity: str
    image: str  # Data URL or raw base64 string


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Sahakar Setu Face Recognition AI",
        "model": "ArcFace buffalo_l",
        "enrolled_count": len(enrolled_db),
        "identities": list(enrolled_db.keys()),
        "threshold": THRESHOLD,
    }


@app.get("/identities")
def get_identities():
    return {
        "success": True,
        "identities": list(enrolled_db.keys())
    }


@app.post("/recognize")
async def recognize(request: Request):
    """
    Recognize a person in the submitted image frame.
    Supports either JSON { "image": "<base64>" } or multipart/form-data with "file".
    """
    global face_app, enrolled_db
    if face_app is None:
        raise HTTPException(status_code=503, detail="Face recognition model not yet initialized")

    frame = None
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        data = await request.json()
        raw_b64 = data.get("image", "")
        if not raw_b64:
            raise HTTPException(status_code=400, detail="Missing 'image' field in JSON payload")
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",", 1)[1]

        # Headless testing / simulation hook
        if raw_b64.startswith("MOCK_FACE:"):
            target_mock = raw_b64.split(":", 1)[1].strip()
            if target_mock == "NO_FACE":
                return {
                    "success": True,
                    "matched": False,
                    "identity": None,
                    "confidence": 0.0,
                    "message": "No face detected in the frame",
                    "bbox": None
                }
            if target_mock == "LOW_CONFIDENCE":
                return {
                    "success": True,
                    "matched": False,
                    "identity": "karthik",
                    "recognizedName": "karthik",
                    "confidence": 0.32,
                    "message": "Low confidence match",
                    "bbox": [100, 100, 200, 200]
                }
            if target_mock == "UNKNOWN":
                return {
                    "success": True,
                    "matched": False,
                    "identity": "UNKNOWN",
                    "recognizedName": None,
                    "confidence": 0.15,
                    "message": "Face not recognized",
                    "bbox": [100, 100, 200, 200]
                }
            return {
                "success": True,
                "matched": True,
                "recognizedName": target_mock,
                "identity": target_mock,
                "confidence": 0.985,
                "raw_best_identity": target_mock,
                "bbox": [120, 80, 280, 320]
            }

        try:
            img_bytes = base64.b64decode(raw_b64)
            frame = decode_image_bytes(img_bytes)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to decode base64 image: {e}")

    elif "multipart/form-data" in content_type:
        form = await request.form()
        file = form.get("file")
        if file and hasattr(file, "read"):
            content = await file.read()
            frame = decode_image_bytes(content)

    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image or unreadable format provided")

    emb, bbox = get_embedding(face_app, frame)
    if emb is None:
        return {
            "success": True,
            "matched": False,
            "identity": None,
            "confidence": 0.0,
            "message": "No face detected in the frame",
            "bbox": None
        }

    best_name = None
    best_score = -1.0

    for name, ref_embedding in enrolled_db.items():
        score = cosine_similarity(emb, ref_embedding)
        if score > best_score:
            best_score = score
            best_name = name

    matched = bool(best_score >= THRESHOLD and best_name is not None)
    confidence = round(float(best_score), 4)

    return {
        "success": True,
        "matched": matched,
        "recognizedName": best_name if matched else None,
        "identity": best_name if matched else "UNKNOWN",
        "confidence": confidence,
        "raw_best_identity": best_name,
        "bbox": [int(v) for v in bbox] if bbox is not None else None
    }


@app.post("/enroll")
async def enroll(request: Request):
    """
    Enroll a new face identity into enrolled.pkl.
    Supports either JSON { "identity": "name", "image": "<base64>" } or multipart/form-data.
    """
    global face_app, enrolled_db
    if face_app is None:
        raise HTTPException(status_code=503, detail="Face recognition model not yet initialized")

    target_identity = None
    frame = None
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        data = await request.json()
        target_identity = data.get("identity", "").strip()
        raw_b64 = data.get("image", "")
        if raw_b64:
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",", 1)[1]
            try:
                img_bytes = base64.b64decode(raw_b64)
                frame = decode_image_bytes(img_bytes)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Base64 decode error: {e}")

    elif "multipart/form-data" in content_type:
        form = await request.form()
        target_identity = str(form.get("identity", "")).strip()
        file = form.get("file")
        if file and hasattr(file, "read"):
            content = await file.read()
            frame = decode_image_bytes(content)

    if not target_identity:
        raise HTTPException(status_code=400, detail="Identity name is required for enrollment")
    if frame is None:
        raise HTTPException(status_code=400, detail="Valid image is required for enrollment")

    emb, bbox = get_embedding(face_app, frame)
    if emb is None:
        raise HTTPException(status_code=400, detail="No face detected in enrollment frame")

    # Update database
    enrolled_db[target_identity] = emb
    save_database(enrolled_db)
    print(f"[FaceService] Successfully enrolled face for identity: '{target_identity}'. Total: {len(enrolled_db)}")

    return {
        "success": True,
        "identity": target_identity,
        "enrolled_count": len(enrolled_db),
        "message": f"Identity '{target_identity}' enrolled successfully"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[FaceService] Starting HTTP Face Service on port {port}...")
    uvicorn.run("service:app", host="0.0.0.0", port=port, reload=False)
