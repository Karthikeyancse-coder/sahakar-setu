import os

# 1. Define the folder structure
directories = [
    "ncct-digital-platform/backend/src/config",
    "ncct-digital-platform/backend/src/controllers",
    "ncct-digital-platform/backend/src/middleware",
    "ncct-digital-platform/backend/src/models",
    "ncct-digital-platform/backend/src/routes",
    "ncct-digital-platform/backend/src/utils",
    "ncct-digital-platform/backend/tests",
    "ncct-digital-platform/frontend/public",
    "ncct-digital-platform/frontend/src/assets",
    "ncct-digital-platform/frontend/src/components",
    "ncct-digital-platform/frontend/src/contexts",
    "ncct-digital-platform/frontend/src/pages",
    "ncct-digital-platform/frontend/src/services",
    "ncct-digital-platform/frontend/src/types",
    "ncct-digital-platform/postman"
]

# 2. Define the starting files and their contents
files = {
    "ncct-digital-platform/README.md": "# NCCT Digital Platform\n\nSmart India Hackathon 2026 Project Repository.",
    
    # Backend files
    "ncct-digital-platform/backend/requirements.txt": "fastapi\nuvicorn[standard]\nsqlalchemy\npsycopg2-binary\npydantic\npython-dotenv\nalembic\n",
    "ncct-digital-platform/backend/.env": "DATABASE_URL=postgresql://postgres:password@localhost:5432/ncctdb\nSECRET_KEY=your_super_secret_key_here\n",
    "ncct-digital-platform/backend/src/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NCCT Digital Platform API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "online", "message": "NCCT API is ready"}
""",

    # Frontend files (React/Vite boilerplate structure)
    "ncct-digital-platform/frontend/.env": "VITE_API_BASE_URL=http://localhost:8000\n",
    "ncct-digital-platform/frontend/package.json": """{
  "name": "ncct-frontend",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}"""
}

# 3. Execute the creation
print("Building NCCT Digital Platform structure...")

for d in directories:
    os.makedirs(d, exist_ok=True)

for file_path, content in files.items():
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("✅ Project successfully scaffolded!")
print("Navigate to the folder using: cd ncct-digital-platform")