import React, { useState } from "react";
import { Send, AlertCircle, FileText, Info } from "lucide-react";
import { API_BASE } from "../apiBase";

export default function FeedbackForm({ onSubmitSuccess, showToast }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in both title and feedback description.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/feedback/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      showToast("Feedback submitted successfully!", "success");
      setFormData({ title: "", content: "" });
      
      // Notify parent to refresh list or switch tabs
      onSubmitSuccess();
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: "680px", margin: "0 auto", animation: "fadeInUp 0.4s ease" }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <FileText className="logo-icon" size={24} style={{ color: "var(--accent-cyan)" }} />
        Submit Feedback
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
        Report bugs, suggest features, or share issues. Our AI analyzes your feedback immediately and prioritizes negative or urgent issues.
      </p>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textAlign: "left",
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title / Subject</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            placeholder="e.g., App crashes when checking out"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Feedback Details</label>
          <textarea
            id="content"
            name="content"
            className="form-textarea"
            placeholder="Provide a detailed description of your experience or request..."
            value={formData.content}
            onChange={handleChange}
            maxLength={1000}
            required
            disabled={loading}
          ></textarea>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <span>Be descriptive for better AI analysis.</span>
            <span>{formData.content.length}/1000 chars</span>
          </div>
        </div>

        <div 
          style={{ 
            background: "rgba(102, 252, 241, 0.04)", 
            border: "1px solid rgba(102, 252, 241, 0.15)", 
            borderRadius: "10px", 
            padding: "1rem", 
            marginBottom: "2rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            textAlign: "left"
          }}
        >
          <Info size={18} style={{ color: "var(--accent-cyan)", flexShrink: 0, marginTop: "0.1rem" }} />
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>How prioritize queueing works:</span>
            <br />
            Our pipeline evaluates your input using Gemini AI. It computes an emotion score where a higher score indicates greater negative sentiment (e.g., anger, frustration). Urgent items are processed first by our background worker queue to ensure swift resolution.
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}
        >
          {loading ? (
            <>
              <span className="loading-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
              Analyzing and Queueing...
            </>
          ) : (
            <>
              <Send size={16} />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}
