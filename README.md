# 🔍 Real-Time Deepfake Detection & Media Authentication System

> Next-Generation AI project for detecting AI-generated or manipulated media.

## 🚀 Quick Start

### Backend (FastAPI)
```bash
cd project5-deepfake-detection
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# API running at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:3000
```

## 📁 Project Structure
```
project5-deepfake-detection/
├── main.py                  # FastAPI entry point
├── requirements.txt
├── docs/PRD.md              # Product Requirements Document
├── src/
│   └── utils/
│       ├── analyzer.py      # Core deepfake detection engine
│       └── report_generator.py
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        └── App.jsx          # Full React dashboard
```

## 🧠 How It Works
1. User uploads image/video/audio via React dashboard
2. Frontend POSTs to FastAPI `/api/analyze/{type}`
3. `DeepfakeAnalyzer` processes the file using EfficientNet ONNX model
4. Returns authenticity score, forensic details, and verdict
5. Dashboard displays results with gauge, badges, and metadata

## 🔌 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze/image` | Analyze image file |
| POST | `/api/analyze/video` | Analyze video file |
| POST | `/api/analyze/audio` | Analyze audio file |
| GET  | `/api/report/{file_id}` | Get forensic report |

## 🔧 Production Upgrade
Replace `_simulate_score()` in `analyzer.py` with real ONNX model:
```python
import onnxruntime as ort
session = ort.InferenceSession("model/efficientnet_deepfake.onnx")
output = session.run(None, {"input": preprocessed_img})
```

## 📦 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Deepfake Detection System"
git remote add origin https://github.com/YOUR_USERNAME/deepfake-detection.git
git push -u origin main
```
