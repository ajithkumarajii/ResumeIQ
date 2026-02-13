import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/parse_resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError("Failed to parse resume.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>Resume Parser</h2>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !file} style={{ marginLeft: 10 }}>
        {loading ? "Parsing..." : "Upload & Parse"}
      </button>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {result && (
        <pre style={{ marginTop: 20, background: "#f6f8fa", padding: 10 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
