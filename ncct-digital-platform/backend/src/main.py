from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config.db import engine, Base
from src.models import user
from src.routes import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NCCT Digital Platform API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def health_check():
    return {"status": "online", "message": "NCCT Database and API are ready"}
