import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import HeroLanding from "./components/HeroLanding";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  // Load user session on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("sentraflow_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("sentraflow_user");
      }
    }
    setInitializing(false);
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("sentraflow_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("sentraflow_user");
  };

  // Toast System
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  if (initializing) {
    return (
      <div className="loader-container" style={{ minHeight: "100vh" }}>
        <div className="loading-spinner"></div>
        <p style={{ color: "var(--text-secondary)" }}>Initializing SentraFlow...</p>
      </div>
    );
  }


  return (
    <>
      {currentUser ? (
        <Dashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          showToast={showToast}
        />
      ) : showAuth ? (
        <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          {/* Sleek back button above the Auth card */}
          <button 
            onClick={() => setShowAuth(false)}
            style={{
              position: "absolute",
              top: "2rem",
              left: "2rem",
              background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              zIndex: 10,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--accent-cyan)";
              e.currentTarget.style.background = "rgba(0, 242, 254, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            ← Back to Home
          </button>
          <Auth onAuthSuccess={handleAuthSuccess} showToast={showToast} />
        </div>
      ) : (
        <HeroLanding 
          onGetStarted={() => setShowAuth(true)} 
          onSignIn={() => setShowAuth(true)}
        />
      )}

      {/* Toast Notification Mount */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
