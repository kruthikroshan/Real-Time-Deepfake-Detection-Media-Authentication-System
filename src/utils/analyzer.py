import numpy as np
import cv2
import random
from pathlib import Path
from datetime import datetime

class DeepfakeAnalyzer:
    """
    Core Deepfake Detection Engine.
    Uses EfficientNet-based classifier (ONNX) for inference.
    For production: replace simulate_* methods with real ONNX model calls.
    """

    def __init__(self):
        self.model_loaded = True
        print("[DeepfakeAnalyzer] Model initialized (demo mode)")

    def analyze_image(self, file_path: str) -> dict:
        img = cv2.imread(file_path)
        if img is None:
            return {"error": "Cannot read image file"}

        h, w, c = img.shape
        # Simulate model inference
        authenticity_score = self._simulate_score()
        is_fake = authenticity_score < 50

        return {
            "type": "image",
            "timestamp": datetime.utcnow().isoformat(),
            "authenticity_score": authenticity_score,
            "is_fake": is_fake,
            "verdict": "DEEPFAKE DETECTED" if is_fake else "AUTHENTIC",
            "confidence": abs(authenticity_score - 50) * 2,
            "image_metadata": {
                "width": w,
                "height": h,
                "channels": c,
                "file_size_kb": round(Path(file_path).stat().st_size / 1024, 2)
            },
            "forensic_details": {
                "face_detected": random.choice([True, False]),
                "compression_artifacts": random.choice([True, False]),
                "noise_inconsistency": is_fake,
                "frequency_anomalies": is_fake,
                "gan_fingerprint_detected": is_fake,
            },
            "heatmap_available": True
        }

    def analyze_video(self, file_path: str) -> dict:
        cap = cv2.VideoCapture(file_path)
        if not cap.isOpened():
            return {"error": "Cannot open video file"}

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        duration = total_frames / fps if fps > 0 else 0
        cap.release()

        # Analyze sample frames
        frame_scores = [self._simulate_score() for _ in range(min(10, total_frames))]
        avg_score = sum(frame_scores) / len(frame_scores)
        is_fake = avg_score < 50

        return {
            "type": "video",
            "timestamp": datetime.utcnow().isoformat(),
            "authenticity_score": round(avg_score, 2),
            "is_fake": is_fake,
            "verdict": "DEEPFAKE DETECTED" if is_fake else "AUTHENTIC",
            "confidence": abs(avg_score - 50) * 2,
            "video_metadata": {
                "total_frames": total_frames,
                "fps": round(fps, 2),
                "duration_seconds": round(duration, 2),
                "file_size_kb": round(Path(file_path).stat().st_size / 1024, 2)
            },
            "frame_analysis": {
                "frames_analyzed": len(frame_scores),
                "fake_frames": sum(1 for s in frame_scores if s < 50),
                "authentic_frames": sum(1 for s in frame_scores if s >= 50),
                "per_frame_scores": [round(s, 2) for s in frame_scores]
            },
            "forensic_details": {
                "temporal_inconsistency": is_fake,
                "face_swap_detected": is_fake,
                "blending_artifacts": is_fake,
                "lip_sync_mismatch": random.choice([True, False])
            }
        }

    def analyze_audio(self, file_path: str) -> dict:
        score = self._simulate_score()
        is_fake = score < 50

        return {
            "type": "audio",
            "timestamp": datetime.utcnow().isoformat(),
            "authenticity_score": score,
            "is_fake": is_fake,
            "verdict": "SYNTHETIC AUDIO DETECTED" if is_fake else "AUTHENTIC",
            "confidence": abs(score - 50) * 2,
            "audio_metadata": {
                "file_size_kb": round(Path(file_path).stat().st_size / 1024, 2)
            },
            "forensic_details": {
                "voice_cloning_detected": is_fake,
                "spectral_anomalies": is_fake,
                "tts_artifacts": is_fake,
                "background_noise_inconsistency": random.choice([True, False])
            }
        }

    def _simulate_score(self) -> float:
        """Simulate model output. Replace with real ONNX inference."""
        return round(random.uniform(20, 95), 2)
