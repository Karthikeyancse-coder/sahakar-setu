FROM python:3.11-slim

# Install system dependencies needed for OpenCV and InsightFace
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency definition and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download only detection & recognition models and clean up unused models to save memory
RUN python -c "from insightface.app import FaceAnalysis; app = FaceAnalysis(name='buffalo_l', allowed_modules=['detection', 'recognition'], providers=['CPUExecutionProvider']); app.prepare(ctx_id=-1, det_size=(320, 320))" \
    && rm -f /root/.insightface/models/buffalo_l/1k3d68.onnx \
             /root/.insightface/models/buffalo_l/2d106det.onnx \
             /root/.insightface/models/buffalo_l/genderage.onnx

# Invalidate cache for service code to ensure fresh build on Render
ARG CACHEBUST=20260912_v2
COPY service.py .
COPY enrolled.pkl .

ENV PORT=8000
ENV PYTHONUNBUFFERED=1
ENV WEB_CONCURRENCY=1
ENV OMP_NUM_THREADS=1
ENV OPENBLAS_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
EXPOSE 8000

CMD ["python", "service.py"]
