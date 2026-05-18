# 🔍 Real-Time Deepfake Detection & Media Authentication System

Author: Kruthik Roshan

Next-Generation AI project for detecting AI-generated or manipulated media and producing forensic reports that help verify authenticity of images, audio, and video in real time.

## Project Overview

This repository implements a full-stack prototype that detects deepfakes and provides media authentication. The system includes a FastAPI backend that analyzes uploaded media with an ONNX model and a React + Vite frontend that allows users to upload files and view forensic reports and visualizations.

## Why This Project Is Useful

- Helps journalists, researchers, and platform moderators rapidly identify potentially manipulated media.
- Produces explainable forensic output (authenticity score, confidence bands, and metadata) so decisions can be audited.
- Serves as a foundation for integrating automated verification into content moderation pipelines and chain-of-custody systems.

## Roles and Responsibilities

- Maintainer: repository owner — overall project coordination and releases.
- Backend Engineer: implement and harden FastAPI endpoints, model serving, and report generation.
- ML Engineer: train and convert models to ONNX, design preprocessing and inference pipelines.
- Frontend Engineer: build the React dashboard and upload/visualization UX.
- QA / Security: test robustness against adversarial examples and validate model calibration.

## Key Features

- Real-time analysis for images, video clips, and audio samples.
- Forensic reports with authenticity score, per-frame diagnostics, and visual indicators.
- Extensible model integration using ONNX runtime for cross-platform deployment.

## Tech Stack

- Backend: Python, FastAPI, Uvicorn
- Inference: ONNX Runtime
- Frontend: React, Vite
- Dev & Packaging: pip, npm

## 🚀 Quick Start

### Backend (FastAPI)
```bash
cd project5-deepfake-detection
python -m venv venv
# Windows: venv\Scripts\activate
source venv/bin/activate
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
│       ├── analyzer.py      # Core detection engine (proof-of-concept)
│       └── report_generator.py
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        └── App.jsx          # React dashboard
```

## 🧠 How It Works (brief)
1. User uploads image/video/audio via React dashboard
2. Frontend POSTs file to FastAPI `/api/analyze/{type}`
3. `DeepfakeAnalyzer` preprocesses and runs ONNX inference (or simulation)
4. Service returns authenticity score, forensic metadata, and a downloadable report
5. Dashboard visualizes results and allows exporting reports

## 🔌 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze/image` | Analyze image file |
| POST | `/api/analyze/video` | Analyze video file |
| POST | `/api/analyze/audio` | Analyze audio file |
| GET  | `/api/report/{file_id}` | Get forensic report |

## 🔧 Production Upgrade
Replace `_simulate_score()` in `analyzer.py` with a real ONNX model to enable production-grade inference:
```python
import onnxruntime as ort
session = ort.InferenceSession("model/efficientnet_deepfake.onnx")
output = session.run(None, {"input": preprocessed_img})
```

## Contributing

Contributions are welcome. Please open issues for bugs or feature requests and submit pull requests for changes. Run linters and unit tests before submitting.

## License

This project is provided as-is for research and prototype purposes. Add a license file if you intend to publish or distribute it.
