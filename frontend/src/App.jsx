import { useState, useRef } from "react";

const VERDICT_COLORS = {
  fake: "#ff4444",
  authentic: "#00e676",
  pending: "#ffd600"
};

function ScoreGauge({ score }) {
  const color = score >= 50 ? "#00e676" : "#ff4444";
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={radius} fill="none" stroke="#1a1a2e" strokeWidth="14" />
      <circle
        cx="90" cy="90" r={radius} fill="none"
        stroke={color} strokeWidth="14"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="90" y="85" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold" fontFamily="monospace">
        {score}%
      </text>
      <text x="90" y="108" textAnchor="middle" fill="#aaa" fontSize="11" fontFamily="monospace">
        AUTHENTICITY
      </text>
    </svg>
  );
}

function ForensicBadge({ label, detected }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "6px 12px", borderRadius: 6,
      background: detected ? "rgba(255,68,68,0.12)" : "rgba(0,230,118,0.08)",
      border: `1px solid ${detected ? "#ff444455" : "#00e67633"}`,
      marginBottom: 6
    }}>
      <span style={{ fontSize: 14 }}>{detected ? "🔴" : "🟢"}</span>
      <span style={{ color: "#ddd", fontSize: 13, fontFamily: "monospace" }}>{label}</span>
      <span style={{ marginLeft: "auto", color: detected ? "#ff4444" : "#00e676", fontSize: 12, fontWeight: "bold" }}>
        {detected ? "DETECTED" : "CLEAR"}
      </span>
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const API_BASE = "http://localhost:8000";

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    if (f.type.startsWith("image/")) {
      setFileType("image");
      setPreview(URL.createObjectURL(f));
    } else if (f.type.startsWith("video/")) {
      setFileType("video");
      setPreview(URL.createObjectURL(f));
    } else if (f.type.startsWith("audio/")) {
      setFileType("audio");
      setPreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/api/analyze/${fileType}`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Backend not running. Start with: uvicorn main:app --reload");
    } finally {
      setLoading(false);
    }
  };

  const forensicKeys = result?.forensic_details ? Object.entries(result.forensic_details) : [];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a16",
      fontFamily: "'Courier New', monospace", color: "#eee", padding: 24
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 13, color: "#555", letterSpacing: 4, marginBottom: 8 }}>NEXT-GEN AI FORENSICS</div>
        <h1 style={{ fontSize: 32, margin: 0, background: "linear-gradient(90deg,#7c3aed,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          DEEPFAKE DETECTION SYSTEM
        </h1>
        <p style={{ color: "#555", marginTop: 8, fontSize: 13 }}>Upload image · video · audio for AI-powered authenticity analysis</p>
      </div>

      {/* Upload Zone */}
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div
          onClick={() => inputRef.current.click()}
          style={{
            border: "2px dashed #2a2a4a", borderRadius: 16, padding: 40,
            textAlign: "center", cursor: "pointer", marginBottom: 20,
            background: "rgba(124,58,237,0.04)",
            transition: "border-color 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a4a"}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ color: "#aaa", fontSize: 14 }}>
            {file ? `✅ ${file.name}` : "Click to upload Image / Video / Audio"}
          </div>
          <div style={{ color: "#444", fontSize: 12, marginTop: 6 }}>JPG, PNG, MP4, MOV, MP3, WAV supported</div>
        </div>
        <input ref={inputRef} type="file" accept="image/*,video/*,audio/*" style={{ display: "none" }} onChange={handleFile} />

        {/* Preview */}
        {preview && fileType === "image" && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 10, border: "1px solid #222" }} />
          </div>
        )}
        {preview && fileType === "video" && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <video src={preview} controls style={{ maxHeight: 200, borderRadius: 10, border: "1px solid #222" }} />
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
            background: file && !loading ? "linear-gradient(90deg,#7c3aed,#06b6d4)" : "#1a1a2e",
            color: file && !loading ? "#fff" : "#444",
            fontSize: 15, fontWeight: "bold", cursor: file && !loading ? "pointer" : "not-allowed",
            letterSpacing: 2, transition: "all 0.2s", marginBottom: 24
          }}
        >
          {loading ? "⟳ ANALYZING..." : "▶ ANALYZE MEDIA"}
        </button>

        {error && (
          <div style={{ background: "rgba(255,68,68,0.1)", border: "1px solid #ff444433", borderRadius: 10, padding: 16, color: "#ff6666", fontSize: 13, marginBottom: 20 }}>
            ⚠ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ background: "#0f0f1e", border: "1px solid #1a1a3a", borderRadius: 16, padding: 28 }}>
            {/* Verdict Banner */}
            <div style={{
              textAlign: "center", padding: "16px 0", marginBottom: 24,
              borderRadius: 10,
              background: result.is_fake ? "rgba(255,68,68,0.08)" : "rgba(0,230,118,0.08)",
              border: `1px solid ${result.is_fake ? "#ff444433" : "#00e67633"}`
            }}>
              <div style={{ fontSize: 28 }}>{result.is_fake ? "⚠️" : "✅"}</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: result.is_fake ? "#ff4444" : "#00e676", letterSpacing: 3 }}>
                {result.verdict}
              </div>
              <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>Confidence: {result.confidence?.toFixed(1)}%</div>
            </div>

            {/* Score Gauge + Details */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
              <ScoreGauge score={result.authenticity_score} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: "#888", fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>FORENSIC ANALYSIS</div>
                {forensicKeys.map(([key, val]) => (
                  <ForensicBadge key={key} label={key.replace(/_/g, " ").toUpperCase()} detected={val} />
                ))}
              </div>
            </div>

            {/* Metadata */}
            {result.image_metadata || result.video_metadata || result.audio_metadata ? (
              <div style={{ borderTop: "1px solid #1a1a2e", paddingTop: 16 }}>
                <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>FILE METADATA</div>
                {Object.entries(result.image_metadata || result.video_metadata || result.audio_metadata || {}).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: 12, padding: "3px 0", borderBottom: "1px solid #111" }}>
                    <span>{k.replace(/_/g, " ")}</span><span style={{ color: "#aaa" }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
