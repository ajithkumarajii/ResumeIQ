import React, { useState } from "react";
import axios from "axios";
import { AiOutlineCloudUpload, AiOutlineFilePdf, AiOutlineFileWord } from "react-icons/ai";
import { motion } from "framer-motion";
import Spinner from "./Spinner";
import "./App.css";

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
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="title"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AiOutlineCloudUpload style={{ marginRight: 12, fontSize: '3.5rem' }} /> Smart Resume Parsing
      </motion.h2>
      <motion.div
        className="explanation"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p>
          <strong style={{ fontSize: '1.3rem' }}>ResumeIQ - Your AI-Powered Resume Assistant</strong> <br />
          <span style={{ color: '#ff6b35', fontWeight: 600, fontSize: '1.15rem' }}>Extract. Analyze. Succeed.</span>
          <br /><br />
          Instantly parse your PDF or DOCX resumes with cutting-edge AI. Get structured data for name, email, phone, skills, education, experience, projects, and certifications in JSON format. Perfect for recruiters, HR teams, and job seekers looking to unlock resume insights.
        </p>
        <ul className="features">
          <li>⚡ Lightning-fast parsing powered by advanced AI</li>
          <li>🔒 100% secure - no data storage or tracking</li>
          <li>📄 Supports PDF & DOCX formats</li>
          <li>🎯 Precision extraction with AI accuracy</li>
          <li>🚀 Ready-to-use JSON output</li>
        </ul>
      </motion.div>
      <div className="upload-section">
        <label className="file-label">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <span className="file-icon">
            {file && file.name.endsWith(".pdf") ? <AiOutlineFilePdf /> : <AiOutlineFileWord />}
          </span>
          {file ? file.name : "Choose PDF or DOCX"}
        </label>
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? <Spinner /> : "Upload & Parse"}
        </button>
      </div>
      {error && (
        <motion.div
          className="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
      {result && (
        <motion.pre
          className="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {JSON.stringify(result, null, 2)}
        </motion.pre>
      )}
      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div style={{ marginBottom: '12px' }}>
        </div>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', fontSize: '0.95rem' }}>
          <span>Made by <strong style={{ color: '#ffffff' }}>Ajith Kumar</strong></span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <a href="https://github.com/ajithkumarajii" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b35', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#f7931e'} onMouseLeave={(e) => e.target.style.color = '#ff6b35'}>
            GitHub
          </a>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <a href="https://linkedin.com/in/ajithkumar-ai" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b35', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#f7931e'} onMouseLeave={(e) => e.target.style.color = '#ff6b35'}>
            LinkedIn
          </a>
        </div>
      </motion.footer>
    </motion.div>
  );
}

export default App;
