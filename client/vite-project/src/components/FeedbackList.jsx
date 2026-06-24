import React, { useState, useEffect } from "react";
import { 
  Trash2, MessageSquare, Sparkles, Brain, Clock, 
  CheckCircle, XCircle, Search, Filter, RefreshCw 
} from "lucide-react";
import { API_BASE } from "../apiBase";

export default function FeedbackList({ isAdminView, currentUser, showToast, refreshTrigger }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [expandedReplies, setExpandedReplies] = useState({});

  const fetchFeedbacks = async (isPoll = false) => {
    if (!isPoll) setLoading(true);
    
    try {
      const endpoint = isAdminView ? `${API_BASE}/api/feedback` : `${API_BASE}/api/feedback/user-feedback`;
      const method = isAdminView ? "GET" : "POST";
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch feedbacks.");
      }

      const list = isAdminView ? data : data.feedbacks;
      
      // Sort: highest emotionScore (priority) first
      const sortedList = [...(list || [])].sort((a, b) => b.emotionScore - a.emotionScore);
      setFeedbacks(sortedList);
    } catch (err) {
      if (!isPoll) {
        showToast(err.message, "error");
      }
    } finally {
      if (!isPoll) setLoading(false);
    }
  };

  // Poll for changes if there are pending items
  useEffect(() => {
    fetchFeedbacks();
  }, [isAdminView, refreshTrigger]);

  useEffect(() => {
    const hasPending = feedbacks.some(item => item.status === "pending" || item.status === "Pending");
    if (!hasPending) return;

    const interval = setInterval(() => {
      fetchFeedbacks(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [feedbacks, isAdminView]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/feedback/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete feedback.");
      }

      showToast("Feedback deleted successfully.", "success");
      setFeedbacks(feedbacks.filter((item) => item.id !== id));
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const toggleReply = (id) => {
    setExpandedReplies(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === "resolved") return <CheckCircle size={14} style={{ color: "var(--color-resolved)" }} />;
    if (s === "failed") return <XCircle size={14} style={{ color: "var(--color-failed)" }} />;
    return <Clock size={14} className="loading-spinner" style={{ borderWidth: "1.5px", animationDuration: "2s" }} />;
  };

  // Filters
  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const itemStatus = item.status?.toLowerCase() || "pending";
    const matchesStatus = statusFilter === "all" || itemStatus === statusFilter;
    
    const itemEmotion = item.emotion?.toLowerCase() || "neutral";
    const matchesEmotion = emotionFilter === "all" || itemEmotion === emotionFilter;

    return matchesSearch && matchesStatus && matchesEmotion;
  });

  if (loading) {
    return (
      <div className="loader-container glass-card">
        <div className="loading-spinner"></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading feedbacks from pipeline...</p>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      {/* Filters Card */}
      <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          
          <div style={{ flex: "1 1 250px", position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "2.35rem", paddingRight: "1rem", paddingTop: "0.6rem", paddingBottom: "0.6rem" }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Filter size={14} style={{ color: "var(--text-muted)" }} />
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem", width: "130px" }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <select
              className="form-input"
              value={emotionFilter}
              onChange={(e) => setEmotionFilter(e.target.value)}
              style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem", width: "130px" }}
            >
              <option value="all">All Emotions</option>
              <option value="happy">Happy</option>
              <option value="neutral">Neutral</option>
              <option value="sad">Sad</option>
              <option value="frustrated">Frustrated</option>
              <option value="angry">Angry</option>
            </select>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => fetchFeedbacks()}
            style={{ padding: "0.55rem 0.85rem" }}
            title="Refresh Feed"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Feed Card Log */}
      {filteredFeedbacks.length === 0 ? (
        <div className="glass-card empty-state">
          <MessageSquare className="empty-icon" />
          <h3>No feedbacks found</h3>
          <p>
            {feedbacks.length === 0 
              ? "Submit some feedback to trigger the AI analysis pipeline."
              : "Try adjusting your search query or filter tags."}
          </p>
        </div>
      ) : (
        filteredFeedbacks.map((item) => {
          const lowerEmotion = item.emotion?.toLowerCase() || "neutral";
          const displayStatus = item.status || "Pending";
          const lowerStatus = displayStatus.toLowerCase();
          
          return (
            <div key={item.id} className={`glass-card feedback-card ${lowerEmotion}`}>
              <div className="feedback-header">
                <div className="feedback-title-group">
                  <span className="feedback-title">{item.title}</span>
                  <div className="feedback-meta">
                    <span className="feedback-tags">
                      <span className="badge badge-emotion">
                        {item.emotion ? `${item.emotion}` : "neutral"}
                      </span>
                      <span className={`badge badge-status ${lowerStatus}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        {getStatusIcon(displayStatus)}
                        {displayStatus}
                      </span>
                    </span>
                    <span>•</span>
                    <span style={{ fontSize: "0.75rem" }}>
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    {isAdminView && (
                      <>
                        <span>•</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          Author: {item.authorId ? item.authorId.substring(0, 8) : "System"}...
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="feedback-actions">
                  {/* Delete button (show to admin or the feedback author) */}
                  {(isAdminView || item.authorId === currentUser?.id) && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                      style={{ padding: "0.4rem 0.6rem" }}
                      title="Delete Feedback"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="feedback-content">
                {item.content}
              </div>

              {/* Priority Bar Indicator */}
              <div className="priority-indicator">
                <div className="priority-header">
                  <span>AI Sentiment Score (Negative Score)</span>
                  <span style={{ fontWeight: 600 }}>{item.emotionScore}% Priority</span>
                </div>
                <div className="priority-bar-wrap">
                  <div 
                    className="priority-bar" 
                    style={{ width: `${item.emotionScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Action buttons for AI reply */}
              {lowerStatus === "resolved" && item.aiReply && (
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => toggleReply(item.id)}
                    style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem", width: "100%", justifyContent: "space-between" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      <Brain size={14} style={{ color: "var(--accent-purple)" }} />
                      {expandedReplies[item.id] ? "Hide Agent Resolution" : "View AI Resolution Reply"}
                    </span>
                    <Sparkles size={12} style={{ color: "var(--accent-cyan)", opacity: 0.8 }} />
                  </button>

                  {expandedReplies[item.id] && (
                    <div className="ai-reply-box">
                      <div className="ai-reply-header">
                        <Sparkles size={14} />
                        <span>Gemini Autopilot Response</span>
                      </div>
                      <div className="ai-reply-text">
                        {item.aiReply}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {lowerStatus === "failed" && item.aiReply && (
                <div 
                  style={{ 
                    marginTop: "0.75rem", 
                    padding: "0.75rem", 
                    background: "rgba(239, 68, 68, 0.05)", 
                    border: "1px solid rgba(239, 68, 68, 0.15)", 
                    borderRadius: "8px", 
                    color: "var(--color-failed)",
                    fontSize: "0.85rem"
                  }}
                >
                  <strong>Pipeline Issue:</strong> {item.aiReply}
                </div>
              )}

              {lowerStatus === "pending" && (
                <div 
                  style={{ 
                    marginTop: "0.75rem", 
                    padding: "0.75rem", 
                    background: "rgba(245, 158, 11, 0.04)", 
                    border: "1px solid rgba(245, 158, 11, 0.15)", 
                    borderRadius: "8px", 
                    color: "var(--color-pending)",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <RefreshCw size={12} className="loading-spinner" style={{ animationDuration: "2.5s" }} />
                  <span>Agent is resolving this feedback based on severity score. Updates automatically...</span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
