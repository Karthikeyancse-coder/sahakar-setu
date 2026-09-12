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

# Pre-download InsightFace buffalo_l models during build to ensure fast container start
RUN python -c "from insightface.app import FaceAnalysis; app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider']); app.prepare(ctx_id=-1)"

# Copy service code and enrolled faces
COPY service.py .
COPY enrolled.pkl .

ENV PORT=8000
EXPOSE 8000

CMD ["python", "service.py"]
