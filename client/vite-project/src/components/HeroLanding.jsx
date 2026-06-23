import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Sparkles, 
  Layers, 
  Code2, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Terminal,
  Activity
} from "lucide-react";

const TELEMETRY_DATA = [
  {
    key: "request",
    title: "Request",
    status: "Ingested",
    desc: "Ingests client feedback from webforms, support portals, or REST webhooks.",
    console: `{\n  "event": "incoming_feedback",\n  "source": "client_portal_api",\n  "status": "ingested",\n  "payload_size": "2.4KB"\n}`
  },
  {
    key: "ai",
    title: "AI Analysis",
    status: "Analyzing",
    desc: "Applies Gemini AI semantic lookup for classification, sentiment categorization, and auto-reply drafting.",
    console: `{\n  "ai_agent": "Gemini-1.5-Pro",\n  "sentiment": "frustrated",\n  "urgency_score": 8.7,\n  "intent": "bug_report"\n}`
  },
  {
    key: "workflow",
    title: "Priority Workflow",
    status: "Queuing",
    desc: "Routes task into high, medium, or low-priority Redis messaging queues based on urgency scores.",
    console: `{\n  "queue_engine": "Redis Priority",\n  "queue_name": "high_priority_jobs",\n  "job_id": "job_941038",\n  "ttl": "600s"\n}`
  },
  {
    key: "apis",
    title: "Worker APIs",
    status: "Routing",
    desc: "Invokes secure internal microservices, CRM webhooks, and alert handlers with signed JWT credentials.",
    console: `{\n  "target_worker": "/api/worker/process",\n  "method": "POST",\n  "auth": "bearer_jwt",\n  "retry_count": 0\n}`
  },
  {
    key: "execution",
    title: "Execution",
    status: "Processing",
    desc: "Triggers system runners, logs event telemetry, and queues automated resolution jobs asynchronously.",
    console: `{\n  "runner": "Async Queue Worker #09",\n  "status": "executing",\n  "subtasks": ["slack_alert", "crm_sync"],\n  "cpu": "1.2%"\n}`
  },
  {
    key: "result",
    title: "Result",
    status: "Resolved",
    desc: "Saves resolution state in DB, syncs client analytics, and dispatches drafted auto-replies.",
    console: `{\n  "db_write": "success",\n  "reply_dispatched": true,\n  "satisfaction_prediction": 0.95,\n  "status": "resolved"\n}`
  }
];

export default function HeroLanding({ onGetStarted, onSignIn }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-cycle the active step
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % TELEMETRY_DATA.length);
      }, 2500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleNodeHover = (index) => {
    setIsPaused(true);
    setActiveStep(index);
  };

  const handleNodeLeave = () => {
    setIsPaused(false);
  };

  // Custom JSON tokenizer for telemetry console highlighting
  const renderJson = (jsonStr) => {
    const renderValue = (val) => {
      if (val.startsWith('"') && val.endsWith('"')) {
        return <span className="val-str">{val}</span>;
      }
      if (val === "true" || val === "false") {
        return <span className="val-bool">{val}</span>;
      }
      if (!isNaN(val)) {
        return <span className="val-num">{val}</span>;
      }
      return <span>{val}</span>;
    };

    return jsonStr.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed === "{" || trimmed === "}" || trimmed === "}," || trimmed === "}") {
        return <div key={idx} style={{ paddingLeft: line.startsWith("  ") ? "1.5rem" : "0" }}>{line}</div>;
      }
      
      const match = line.match(/^(\s*"[^"]+"\s*:\s*)(.*)$/);
      if (match) {
        const keyPart = match[1];
        const valPart = match[2];
        const hasComma = valPart.endsWith(",");
        const cleanVal = hasComma ? valPart.slice(0, -1).trim() : valPart.trim();
        
        return (
          <div key={idx} style={{ paddingLeft: "1.5rem" }}>
            <span className="key">{keyPart.split(":")[0]}</span>
            <span>: </span>
            {renderValue(cleanVal)}
            {hasComma && <span>,</span>}
          </div>
        );
      }
      return <div key={idx}>{line}</div>;
    });
  };

  const getStepIcon = (key, size = 20) => {
    switch (key) {
      case "request":
        return <MessageSquare size={size} />;
      case "ai":
        return <Sparkles size={size} />;
      case "workflow":
        return <Layers size={size} />;
      case "apis":
        return <Code2 size={size} />;
      case "execution":
        return <Cpu size={size} />;
      case "result":
        return <CheckCircle2 size={size} />;
      default:
        return <MessageSquare size={size} />;
    }
  };

  // Calculate vertical connector track progress percentage
  const trackProgress = `${(activeStep / (TELEMETRY_DATA.length - 1)) * 100}%`;

  return (
    <div className="hero-landing">
      {/* Navigation Header */}
      <nav className="hero-nav">
        <a href="/" className="hero-logo" onClick={(e) => e.preventDefault()}>
          <ShieldCheck className="hero-logo-icon" size={28} />
          <span className="hero-logo-text">SentraFlow</span>
        </a>
        <div className="hero-nav-actions">
          <button className="hero-btn-nav" onClick={onSignIn}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Landing Area */}
      <main className="hero-main">
        <div className="hero-grid">
          {/* Left panel info */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              SentraFlow Engine v1.2 Active
            </div>
            
            <h1 className="hero-title">
              Streamline Customer Feedback with <span>Intelligent Pipelines</span>
            </h1>
            
            <p className="hero-subtitle">
              An enterprise-grade orchestration pipeline that ingests user requests, 
              applies real-time Gemini AI sentiment analysis, schedules priority execution 
              queues, and integrates with background worker APIs to auto-resolve feedbacks.
            </p>

            <div className="hero-cta-group">
              <button className="hero-btn-primary" onClick={onGetStarted}>
                Get Started Free <ArrowRight size={18} />
              </button>
              <button 
                className="hero-btn-secondary" 
                onClick={() => {
                  const el = document.getElementById("centerpiece-visualization");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                Explore Workflow
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-value">99.8%</div>
                <div className="hero-stat-label">AI Accuracy</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">&lt; 2.5s</div>
                <div className="hero-stat-label">Response Time</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">12.4k+</div>
                <div className="hero-stat-label">Tasks Routed</div>
              </div>
            </div>
          </div>

          {/* Right centerpiece workflow visualization */}
          <div className="hero-right" id="centerpiece-visualization">
            <div 
              className="hero-viz-card"
              onMouseLeave={handleNodeLeave}
            >
              <div className="hero-viz-header">
                <div className="hero-viz-title">
                  Pipeline Centerpiece
                </div>
                <div className="hero-viz-status">
                  <span className="hero-viz-status-dot"></span>
                  Live Stream Sim
                </div>
              </div>

              {/* Workflow Pipeline timeline */}
              <div className="hero-pipeline">
                <div className="hero-pipeline-track">
                  <div 
                    className="hero-pipeline-progress" 
                    style={{ height: trackProgress }}
                  ></div>
                </div>

                {TELEMETRY_DATA.map((step, index) => {
                  const isActive = index === activeStep;
                  return (
                    <div 
                      key={step.key}
                      className={`hero-node-row ${isActive ? "active" : ""}`}
                      onMouseEnter={() => handleNodeHover(index)}
                    >
                      <div className="hero-node-icon-wrap">
                        {getStepIcon(step.key, 20)}
                      </div>
                      <div className="hero-node-card">
                        <div className="hero-node-title-group">
                          <span className="hero-node-title">{step.title}</span>
                          <span className="hero-node-status">{step.status}</span>
                        </div>
                        {isActive && (
                          <p className="hero-node-desc">
                            {step.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Telemetry output box */}
              <div className="hero-terminal">
                <div className="hero-terminal-header">
                  <div className="hero-terminal-dots">
                    <span className="hero-terminal-dot red"></span>
                    <span className="hero-terminal-dot yellow"></span>
                    <span className="hero-terminal-dot green"></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Terminal size={12} style={{ color: "var(--text-muted)" }} />
                    <span>telemetry_logs.json</span>
                  </div>
                </div>
                <div className="hero-terminal-body">
                  <div className="hero-terminal-text">
                    {renderJson(TELEMETRY_DATA[activeStep].console)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
