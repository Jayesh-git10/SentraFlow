import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [initializing, setInitializing] = useState(true);

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
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} showToast={showToast} />
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
