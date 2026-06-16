import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import api from "../services/api"
import { AnimatedSection, StaggerContainer, staggerItem } from "../components/ui/AnimatedSection"
import { AnimatedCounter } from "../components/ui/AnimatedCounter"
import { toast } from "sonner"
import {
  MessageSquare, Smile, Clock, CheckCircle2,
  ArrowUpRight, PenTool, Frown, Meh, HelpCircle, TrendingUp
} from "lucide-react"

/* ── tiny ui helpers ── */
const StatCard = ({ icon: Icon, label, value, sub, color, delay, suffix = "", animateTo }) => (
  <motion.div
    variants={staggerItem}
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 280, damping: 22 }}
    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 cursor-default"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color.blob}`} />
    <div className="flex items-start justify-between mb-4 relative">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color.bg}`}>
        <Icon className={`h-5 w-5 ${color.icon}`} />
      </div>
      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/40" />
    </div>
    <div className="relative">
      <p className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        {animateTo !== undefined ? <AnimatedCounter to={animateTo} suffix={suffix} /> : value}
      </p>
      <p className="text-xs font-semibold text-muted-foreground mt-1">{label}</p>
      {sub && <p className="text-[11px] text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
)

const EmotionRow = ({ label, count, pct, colorClass }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="font-semibold flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${colorClass}`} />
        {label}
      </span>
      <span className="text-muted-foreground">{count} · {pct}%</span>
    </div>
    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  </div>
)

const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase()
  const map = {
    resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    pending:  "bg-amber-100  text-amber-700  dark:bg-amber-950/40  dark:text-amber-300",
    failed:   "bg-rose-100   text-rose-700   dark:bg-rose-950/40   dark:text-rose-300",
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[s] || map.pending}`}>
      {s === "resolved" && <CheckCircle2 className="h-2.5 w-2.5" />}
      {s === "pending"  && <Clock className="h-2.5 w-2.5" />}
      {s}
    </span>
  )
}

const EmotionIcon = ({ emotion, score }) => {
  const e = (emotion || "").toLowerCase()
  if (e === "happy" || score < 30)  return <Smile className="h-4 w-4 text-emerald-500" />
  if (score > 60)                   return <Frown className="h-4 w-4 text-rose-500" />
  return <Meh className="h-4 w-4 text-amber-500" />
}

/* ── page ── */
export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => { fetchFeedbacks() }, [])

  const fetchFeedbacks = async () => {
    try {
      const res = await api.post("/api/feedback/user-feedback")
      if (res.data?.success) setFeedbacks(res.data.feedbacks || [])
      else toast.error("Failed to load feedbacks.")
    } catch { toast.error("Error connecting to server.") }
    finally { setLoading(false) }
  }

  const total    = feedbacks.length
  const resolved = feedbacks.filter(f => f.status?.toLowerCase() === "resolved").length
  const pending  = feedbacks.filter(f => f.status?.toLowerCase() === "pending").length
  const avgScore = total ? Math.round(feedbacks.reduce((s, f) => s + (f.emotionScore || 0), 0) / total) : 0
  const csat     = total ? 100 - avgScore : 0

  const cats = feedbacks.reduce((acc, f) => {
    const k = (f.emotion || "neutral").toLowerCase()
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  const recent = [...feedbacks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  /* chart data */
  const chartData = [...feedbacks]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-10)

  const buildPath = (pts) => {
    if (pts.length < 2) return null
    const W = 480, H = 120, px = 20
    const stepX = (W - px * 2) / (pts.length - 1)
    const mapped = pts.map((p, i) => ({
      x: px + i * stepX,
      y: H - px - ((100 - (p.emotionScore || 50)) / 100) * (H - px * 2),
    }))
    const line = mapped.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
    const area = `${line} L${mapped[mapped.length - 1].x},${H - px} L${mapped[0].x},${H - px} Z`
    return { line, area, pts: mapped }
  }

  const paths = buildPath(chartData)

  /* ── skeleton ── */
  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-44 bg-secondary rounded-xl" />
        <div className="h-9 w-36 bg-secondary rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[0,1,2,3].map(i => <div key={i} className="h-36 rounded-2xl bg-secondary" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-64 rounded-2xl bg-secondary" />
        <div className="h-64 rounded-2xl bg-secondary" />
      </div>
      <div className="h-72 rounded-2xl bg-secondary" />
    </div>
  )

  /* ── empty ── */
  if (total === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <div className="h-20 w-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <MessageSquare className="h-9 w-9" />
      </div>
      <div>
        <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>No feedback yet</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          Submit your first customer ticket and watch the AI resolve it in real time.
        </p>
      </div>
      <Link to="/generator">
        <button className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center gap-2">
          <PenTool className="h-4 w-4" /> Generate first ticket
        </button>
      </Link>
    </div>
  )

  return (
    <div className="space-y-8">

      {/* Header */}
      <AnimatedSection variant="fade-up" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time overview of your support pipeline.</p>
        </div>
        <Link to="/generator">
          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
          >
            <PenTool className="h-4 w-4" /> New ticket
          </motion.button>
        </Link>
      </AnimatedSection>

      {/* Stat cards */}
      <StaggerContainer staggerDelay={0.07} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={MessageSquare} label="Total Tickets"  animateTo={total}    color={{ bg: "bg-primary/10",    icon: "text-primary",      blob: "bg-primary/20" }} />
        <StatCard icon={Smile}         label="CSAT Score"     animateTo={csat}     suffix="%" color={{ bg: "bg-emerald-500/10", icon: "text-emerald-500", blob: "bg-emerald-500/15" }} />
        <StatCard icon={Clock}         label="Pending Queue"  animateTo={pending}  color={{ bg: "bg-amber-500/10",  icon: "text-amber-500",    blob: "bg-amber-500/15" }} />
        <StatCard icon={CheckCircle2}  label="Resolved"       animateTo={resolved} color={{ bg: "bg-violet-500/10", icon: "text-violet-500",   blob: "bg-violet-500/15" }} />
      </StaggerContainer>

      {/* Chart + breakout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Trend chart */}
        <AnimatedSection variant="fade-left" className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-bold">Satisfaction Trend</p>
              <p className="text-xs text-muted-foreground mt-0.5">Based on last {chartData.length} submissions</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1 rounded-lg bg-secondary">CSAT</span>
          </div>

          {paths ? (
            <svg viewBox="0 0 480 120" className="w-full" fill="none">
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--primary)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* grid */}
              {[20, 60, 100].map(y => (
                <line key={y} x1="20" y1={y} x2="460" y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" />
              ))}
              <motion.path
                d={paths.area} fill="url(#cg)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
              />
              <motion.path
                d={paths.line} stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
              />
              {paths.pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
                  <circle cx={p.x} cy={p.y} r="2" fill="var(--primary)" />
                </g>
              ))}
            </svg>
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
              Need at least 2 tickets to plot trend
            </div>
          )}
        </AnimatedSection>

        {/* Sentiment breakout */}
        <AnimatedSection variant="fade-right" className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div>
            <p className="text-sm font-bold">Sentiment Mix</p>
            <p className="text-xs text-muted-foreground mt-0.5">Emotion category frequencies</p>
          </div>
          {[
            { key: "happy",      label: "Happy",      cls: "bg-emerald-500" },
            { key: "neutral",    label: "Neutral",    cls: "bg-amber-500" },
            { key: "angry",      label: "Angry",      cls: "bg-rose-500" },
            { key: "frustrated", label: "Frustrated", cls: "bg-orange-500" },
            { key: "sad",        label: "Sad",        cls: "bg-blue-500" },
          ].map(e => (
            <EmotionRow
              key={e.key}
              label={e.label}
              count={cats[e.key] || 0}
              pct={total ? Math.round(((cats[e.key] || 0) / total) * 100) : 0}
              colorClass={e.cls}
            />
          ))}
        </AnimatedSection>
      </div>

      {/* Recent tickets */}
      <AnimatedSection variant="fade-up">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <p className="text-sm font-bold">Recent Tickets</p>
              <p className="text-xs text-muted-foreground mt-0.5">Last {recent.length} submissions</p>
            </div>
            <Link to="/history" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {recent.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <EmotionIcon emotion={f.emotion} score={f.emotionScore} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{f.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {new Date(f.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold tabular-nums text-muted-foreground w-12 text-right">{f.emotionScore}/100</span>
                  <StatusBadge status={f.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
