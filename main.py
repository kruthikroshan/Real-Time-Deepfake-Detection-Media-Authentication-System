from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import uuid
import os
import shutil
from pathlib import Path
from src.utils.analyzer import DeepfakeAnalyzer
from src.utils.report_generator import generate_report

app = FastAPI(
    title="Deepfake Detection API",
    description="Real-Time Deepfake Detection & Media Authentication System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

analyzer = DeepfakeAnalyzer()

@app.get("/")
def root():
    return {"message": "Deepfake Detection API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are supported")

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = analyzer.analyze_image(str(file_path))
        result["file_id"] = file_id
        result["filename"] = file.filename
        return JSONResponse(content=result)
    finally:
        os.remove(file_path)

@app.post("/api/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Only video files are supported")

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = analyzer.analyze_video(str(file_path))
        result["file_id"] = file_id
        result["filename"] = file.filename
        return JSONResponse(content=result)
    finally:
        os.remove(file_path)

@app.post("/api/analyze/audio")
async def analyze_audio(file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Only audio files are supported")

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = analyzer.analyze_audio(str(file_path))
        result["file_id"] = file_id
        result["filename"] = file.filename
        return JSONResponse(content=result)
    finally:
        os.remove(file_path)

@app.get("/api/report/{file_id}")
async def get_report(file_id: str):
    report = generate_report(file_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
