import React, { useState, useEffect } from "react";
import { 
  BarChart3, MessageSquarePlus, User, Library, 
  LogOut, ShieldAlert, Sparkles, Smile, Frown, Activity,
  Clock, CheckCircle
} from "lucide-react";
import FeedbackForm from "./FeedbackForm";
import FeedbackList from "./FeedbackList";

export default function Dashboard({ currentUser, onLogout, showToast }) {
  const [activeTab, setActiveTab] = useState("analytics");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    avgScore: 0,
    happyCount: 0,
    sadCount: 0,
    angryCount: 0,
    frustratedCount: 0,
    neutralCount: 0,
  });
  const [refreshListTrigger, setRefreshListTrigger] = useState(0);

  const fetchStats = async () => {
    try {
      // Fetch all feedbacks to compute global dashboard metrics
      const response = await fetch("/api/feedback", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      const list = data || [];

      let total = list.length;
      let pending = 0;
      let resolved = 0;
      let totalScore = 0;
      let happy = 0;
      let sad = 0;
      let angry = 0;
      let frustrated = 0;
      let neutral = 0;

      list.forEach((item) => {
        const status = item.status?.toLowerCase();
        if (status === "pending" || status === "Pending") pending++;
        if (status === "resolved") resolved++;
        totalScore += item.emotionScore || 0;

        const emotion = item.emotion?.toLowerCase() || "neutral";
        if (emotion === "happy") happy++;
        else if (emotion === "sad") sad++;
        else if (emotion === "angry") angry++;
        else if (emotion === "frustrated") frustrated++;
        else neutral++;
      });

      const avgScore = total > 0 ? Math.round(totalScore / total) : 0;

      setStats({
        total,
        pending,
        resolved,
        avgScore,
        happyCount: happy,
        sadCount: sad,
        angryCount: angry,
        frustratedCount: frustrated,
        neutralCount: neutral,
      });
    } catch (err) {
      console.error("Failed to compile dashboard stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats periodically
    const interval = setInterval(fetchStats, 6000);
    return () => clearInterval(interval);
  }, [refreshListTrigger]);

  const handleLogoutClick = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Logged out successfully.", "success");
        onLogout();
      } else {
        throw new Error(data.message || "Failed to log out.");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleFeedbackSubmitSuccess = () => {
    // Increment trigger to refresh feeds
    setRefreshListTrigger(prev => prev + 1);
    // Redirect to User Feedbacks tab
    setActiveTab("my-feedbacks");
  };

  // Helper for emotion score feedback colors
  const getSeverityLevel = (score) => {
    if (score >= 70) return { label: "High Urgency", color: "var(--accent-pink)" };
    if (score >= 40) return { label: "Moderate Priority", color: "var(--color-frustrated)" };
    return { label: "Normal Flow", color: "var(--color-happy)" };
  };

  const severityInfo = getSeverityLevel(stats.avgScore);

  return (
    <div className="container" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <header className="app-header" style={{ width: "100%", borderBottom: "1px solid var(--border-color)", margin: "0 auto 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.25rem 0" }}>
          <div className="logo-section">
            <Activity className="logo-icon" size={26} />
            <span className="logo-text">SentraFlow</span>
          </div>

          <div className="user-nav">
            <div className="user-info">
              <User size={16} style={{ color: "var(--accent-cyan)" }} />
              <span className="username">{currentUser?.name || "User"}</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogoutClick}
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", gap: "0.35rem" }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Sidebar Nav */}
        <aside className="sidebar">
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.95rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "1rem", textAlign: "left" }}>
              Navigation Menu
            </h3>
            <ul className="sidebar-menu">
              <li>
                <button
                  type="button"
                  className={`sidebar-link ${activeTab === "analytics" ? "active" : ""}`}
                  onClick={() => setActiveTab("analytics")}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none" }}
                >
                  <BarChart3 size={16} />
                  Pipeline Analytics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-link ${activeTab === "submit" ? "active" : ""}`}
                  onClick={() => setActiveTab("submit")}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none" }}
                >
                  <MessageSquarePlus size={16} />
                  Submit Feedback
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-link ${activeTab === "my-feedbacks" ? "active" : ""}`}
                  onClick={() => setActiveTab("my-feedbacks")}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none" }}
                >
                  <User size={16} />
                  My Submissions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-link ${activeTab === "system-feedbacks" ? "active" : ""}`}
                  onClick={() => setActiveTab("system-feedbacks")}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none" }}
                >
                  <Library size={16} />
                  System Feed (All)
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Info Box */}
          <div className="glass-card" style={{ padding: "1.25rem", textAlign: "left" }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Sparkles size={14} style={{ color: "var(--accent-cyan)" }} />
              Queue Status
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Worker Threads:</span>
                <span style={{ color: "var(--color-resolved)", fontWeight: 500 }}>Active (1)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Pending Tickets:</span>
                <span style={{ color: stats.pending > 0 ? "var(--color-pending)" : "var(--text-secondary)", fontWeight: 600 }}>
                  {stats.pending} items
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Average Gravity:</span>
                <span style={{ color: severityInfo.color, fontWeight: 600 }}>
                  {stats.avgScore}%
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="content-panel" style={{ minWidth: 0 }}>
          {activeTab === "analytics" && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h2 style={{ textAlign: "left", marginBottom: "1.5rem" }}>System Performance Analytics</h2>
              
              {/* Metrics cards row */}
              <div className="metrics-row">
                <div className="glass-card metric-card cyan">
                  <div className="metric-icon-wrap">
                    <Activity size={20} />
                  </div>
                  <div className="metric-info">
                    <span className="metric-title">Total Feedbacks</span>
                    <span className="metric-value">{stats.total}</span>
                  </div>
                </div>

                <div className="glass-card metric-card purple">
                  <div className="metric-icon-wrap">
                    <Clock size={20} />
                  </div>
                  <div className="metric-info">
                    <span className="metric-title">Queued / Pending</span>
                    <span className="metric-value">{stats.pending}</span>
                  </div>
                </div>

                <div className="glass-card metric-card green">
                  <div className="metric-icon-wrap">
                    <CheckCircle size={20} />
                  </div>
                  <div className="metric-info">
                    <span className="metric-title">AI Resolved</span>
                    <span className="metric-value">{stats.resolved}</span>
                  </div>
                </div>

                <div className="glass-card metric-card pink">
                  <div className="metric-icon-wrap">
                    <ShieldAlert size={20} />
                  </div>
                  <div className="metric-info">
                    <span className="metric-title">Avg Severity Score</span>
                    <span className="metric-value">{stats.avgScore}%</span>
                  </div>
                </div>
              </div>

              {/* Gravity & Sentiment Breakdowns */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
                
                {/* Sentiment Distribution */}
                <div className="glass-card" style={{ padding: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Smile size={18} style={{ color: "var(--accent-cyan)" }} />
                    Detected Emotions Distribution
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Happy */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span>Happy (Positive)</span>
                        <span style={{ fontWeight: 600 }}>{stats.happyCount} items</span>
                      </div>
                      <div className="priority-bar-wrap" style={{ height: "8px" }}>
                        <div className="priority-bar" style={{ width: `${stats.total > 0 ? (stats.happyCount/stats.total)*100 : 0}%`, background: "var(--color-happy)" }}></div>
                      </div>
                    </div>

                    {/* Neutral */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span>Neutral</span>
                        <span style={{ fontWeight: 600 }}>{stats.neutralCount} items</span>
                      </div>
                      <div className="priority-bar-wrap" style={{ height: "8px" }}>
                        <div className="priority-bar" style={{ width: `${stats.total > 0 ? (stats.neutralCount/stats.total)*100 : 0}%`, background: "var(--text-secondary)" }}></div>
                      </div>
                    </div>

                    {/* Sad */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span>Sad</span>
                        <span style={{ fontWeight: 600 }}>{stats.sadCount} items</span>
                      </div>
                      <div className="priority-bar-wrap" style={{ height: "8px" }}>
                        <div className="priority-bar" style={{ width: `${stats.total > 0 ? (stats.sadCount/stats.total)*100 : 0}%`, background: "var(--color-sad)" }}></div>
                      </div>
                    </div>

                    {/* Frustrated */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span>Frustrated</span>
                        <span style={{ fontWeight: 600 }}>{stats.frustratedCount} items</span>
                      </div>
                      <div className="priority-bar-wrap" style={{ height: "8px" }}>
                        <div className="priority-bar" style={{ width: `${stats.total > 0 ? (stats.frustratedCount/stats.total)*100 : 0}%`, background: "var(--color-frustrated)" }}></div>
                      </div>
                    </div>

                    {/* Angry */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span>Angry (High Severity)</span>
                        <span style={{ fontWeight: 600 }}>{stats.angryCount} items</span>
                      </div>
                      <div className="priority-bar-wrap" style={{ height: "8px" }}>
                        <div className="priority-bar" style={{ width: `${stats.total > 0 ? (stats.angryCount/stats.total)*100 : 0}%`, background: "var(--color-angry)" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Queue Priority explanation */}
                <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Frown size={18} style={{ color: "var(--accent-pink)" }} />
                      Severity Priority Logic
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem", lineHeight: 1.6 }}>
                      SentraFlow leverages a Redis-backed priority queue. The sentiment analyzer rates negative text higher (closer to 100). The background worker retrieves highest-priority items first.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "0.75rem", borderRadius: "8px" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent-pink)" }}></span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}><strong>Score 70-100:</strong> Critically urgent customer complaints.</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-frustrated)" }}></span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}><strong>Score 40-70:</strong> Moderate frustration or feature delays.</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-happy)" }}></span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}><strong>Score 0-40:</strong> Positive comments or regular inquiries.</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                      <span>Global Pipeline Severity Status:</span>
                      <span style={{ fontWeight: 600, color: severityInfo.color }}>{severityInfo.label}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "submit" && (
            <FeedbackForm 
              onSubmitSuccess={handleFeedbackSubmitSuccess} 
              showToast={showToast} 
            />
          )}

          {activeTab === "my-feedbacks" && (
            <div>
              <h2 style={{ textAlign: "left", marginBottom: "1.5rem" }}>My Submissions</h2>
              <FeedbackList 
                isAdminView={false} 
                currentUser={currentUser} 
                showToast={showToast} 
                refreshTrigger={refreshListTrigger}
              />
            </div>
          )}

          {activeTab === "system-feedbacks" && (
            <div>
              <h2 style={{ textAlign: "left", marginBottom: "1.5rem" }}>All System Feedbacks (Queue Log)</h2>
              <FeedbackList 
                isAdminView={true} 
                currentUser={currentUser} 
                showToast={showToast} 
                refreshTrigger={refreshListTrigger}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
