import React, { useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { AnimatedSection, StaggerContainer, staggerItem } from "../components/ui/AnimatedSection"
import {
  Sparkles, ArrowRight, MessageSquare, Activity, Zap, ShieldCheck,
  ChevronRight, Star, CheckCircle2, Bot, BarChart3, Inbox, ArrowUpRight
} from "lucide-react"

/* ── tiny helpers ── */
const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 border border-primary/25 bg-primary/8 text-primary text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
    {children}
  </span>
)

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
  >
    {children}
  </a>
)

/* ── Floating orb ── */
const Orb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
)

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY      = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity= useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const features = [
    { icon: Bot,            label: "Gemini 2.5 Engine",    desc: "State-of-the-art LLM trained on millions of support interactions to generate empathetic, contextual replies in seconds." },
    { icon: Activity,       label: "Sentiment Telemetry",  desc: "Real-time emotion scoring from 0–100 across five sentiment vectors. Understand exactly how upset your customers are." },
    { icon: Zap,            label: "Redis Queue Workers",  desc: "Heavy AI inference is offloaded to background workers via Redis sorted sets, keeping your UI blazing fast at all times." },
    { icon: BarChart3,      label: "Analytics Dashboard",  desc: "CSAT tracking, sentiment trends, resolution rates, and breakout categories — all in one living dashboard." },
    { icon: Inbox,          label: "Ticket History",       desc: "Full audit trail with search, filters, sentiment sorting, and one-click deletion. Never lose context on a customer." },
    { icon: ShieldCheck,    label: "JWT Auth + Cookies",   desc: "HttpOnly cookie sessions backed by bcrypt password hashing and JWT. Security is not an afterthought." },
  ]

  const steps = [
    { n: "01", title: "Submit a Ticket",    desc: "Paste the raw customer text — email, review, chat transcript. Give it a title and hit generate." },
    { n: "02", title: "AI Analyses",        desc: "Gemini scores the sentiment, classifies the emotion, and queues a resolution draft via Redis." },
    { n: "03", title: "Draft is Ready",     desc: "Within seconds you receive a polished, empathetic reply you can copy, export, or print." },
  ]

  const testimonials = [
    { name: "Priya S.",    role: "Head of Support @ Helios",  quote: "SentraFlow cut our average reply time from 18 minutes to under 2. The sentiment scoring alone changed how we prioritise tickets.",   stars: 5 },
    { name: "Alex M.",     role: "Founder @ Kova",             quote: "I was sceptical of AI-generated replies, but the drafts are genuinely empathetic. Our CSAT went from 72 to 89 in six weeks.",        stars: 5 },
    { name: "Danielle R.", role: "CX Lead @ Stratum",          quote: "The Redis queue architecture means zero UI lag even when Gemini takes 10 seconds to respond. Thoughtful engineering.",              stars: 5 },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAVBAR ───────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-6 mt-3">
          <div className="glass rounded-2xl h-14 px-5 flex items-center justify-between shadow-sm">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              SentraFlow
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it works</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <button className="h-9 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                    Dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
                  <Link to="/register">
                    <button className="h-9 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                      Get started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* background */}
        <div className="absolute inset-0 dot-bg opacity-40" />
        <Orb className="w-[600px] h-[600px] -top-32 -left-32 bg-primary/10" />
        <Orb className="w-[500px] h-[500px] -bottom-24 -right-24 bg-violet-500/8" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto px-6 pb-24">
          <AnimatedSection variant="fade-up" delay={0.05}>
            <Pill><Sparkles className="h-3 w-3" /> Powered by Gemini 2.5 Flash</Pill>
          </AnimatedSection>

          <AnimatedSection variant="fade-up" delay={0.15} className="mt-7">
            <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              <span className="gradient-text">Turn Angry Customers</span>
              <br />Into Happy Ones.
            </h1>
          </AnimatedSection>

          <AnimatedSection variant="fade-up" delay={0.25} className="mt-6">
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Paste any customer complaint. SentraFlow scores its sentiment,
              queues it for AI resolution, and hands you a polished draft reply — in seconds.
            </p>
          </AnimatedSection>

          <AnimatedSection variant="fade-up" delay={0.35} className="mt-10">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <button className="h-12 px-8 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg glow-sm flex items-center gap-2">
                    Open Dashboard <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <button className="h-12 px-8 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg glow-sm flex items-center gap-2">
                      Start for free <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="h-12 px-8 rounded-2xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-secondary active:scale-[0.98] transition-all">
                      Sign in
                    </button>
                  </Link>
                </>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No credit card required · Free forever for small teams</p>
          </AnimatedSection>

          {/* ── Product mockup ── */}
          <AnimatedSection variant="fade-up" delay={0.5} className="mt-20">
            <div className="relative mx-auto max-w-4xl">
              {/* glow behind card */}
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-3xl scale-95" />
              <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                {/* window chrome */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-secondary/40">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-rose-400/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-5 rounded-md bg-border/60 w-48 mx-auto" />
                  </div>
                </div>

                {/* mock dashboard content */}
                <div className="p-6 grid grid-cols-12 gap-4 text-left">
                  {/* stat cards */}
                  {[
                    { label: "Total Tickets",   val: "284",  color: "text-foreground" },
                    { label: "Satisfaction",     val: "91%",  color: "text-emerald-500" },
                    { label: "Queue Backlog",    val: "3",    color: "text-amber-500" },
                    { label: "Resolved",         val: "281",  color: "text-primary" },
                  ].map((s, i) => (
                    <div key={i} className="col-span-3 rounded-xl border border-border bg-background p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                      <p className={`text-2xl font-black mt-1 ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
                    </div>
                  ))}

                  {/* fake table */}
                  <div className="col-span-8 rounded-xl border border-border bg-background overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground">Recent Tickets</p>
                      <div className="h-4 w-20 rounded bg-border/50" />
                    </div>
                    {[
                      { title: "Package never arrived",  emo: "Frustrated", score: 88, color: "rose" },
                      { title: "Wrong item delivered",   emo: "Angry",      score: 77, color: "orange" },
                      { title: "Love the new update!",   emo: "Happy",      score: 12, color: "emerald" },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border/50 last:border-0">
                        <p className="text-xs font-semibold truncate max-w-[160px]">{r.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${r.color}-100 text-${r.color}-700 dark:bg-${r.color}-950/40 dark:text-${r.color}-300`}>{r.emo}</span>
                        <span className="text-xs font-bold text-muted-foreground">{r.score}/100</span>
                      </div>
                    ))}
                  </div>

                  {/* fake score card */}
                  <div className="col-span-4 rounded-xl border border-border bg-background p-4 flex flex-col gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sentiment Breakout</p>
                    {[
                      { l: "Happy",      w: 48, c: "bg-emerald-500" },
                      { l: "Neutral",    w: 22, c: "bg-amber-500" },
                      { l: "Angry",      w: 18, c: "bg-rose-500" },
                      { l: "Frustrated", w: 12, c: "bg-orange-500" },
                    ].map((b, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                          <span>{b.l}</span><span>{b.w}%</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${b.c}`} style={{ width: `${b.w}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </motion.div>
      </section>

      {/* ── LOGOS / TRUST BAR ─────────────────────────── */}
      <AnimatedSection variant="fade-in" className="py-14 border-y border-border/50 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground/50">
            {["React", "Vite", "Tailwind CSS", "Framer Motion", "Prisma", "Redis", "Gemini AI", "PostgreSQL"].map(t => (
              <span key={t} className="text-sm font-semibold">{t}</span>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── FEATURES ──────────────────────────────────── */}
      <section id="features" className="py-32 relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] top-0 right-0 bg-primary/6" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection variant="fade-left">
              <Pill>Features</Pill>
              <h2 className="mt-5 text-4xl font-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Everything your support team needs, nothing it doesn't.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We spent months talking to support leads before writing a line of code.
                Every feature exists because real teams asked for it.
              </p>
              <div className="mt-8 space-y-3">
                {["No more copy-paste reply templates", "Real emotion data, not guesswork", "Queue handles thousands of tickets/day"].map(t => (
                  <div key={t} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <StaggerContainer staggerDelay={0.07} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    whileHover={{ y: -4, boxShadow: "0 12px 40px -8px color-mix(in srgb, var(--primary) 18%, transparent)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="group p-5 rounded-2xl border border-border bg-card cursor-default"
                  >
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-bold mb-1">{f.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </motion.div>
                )
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section id="how-it-works" className="py-32 bg-secondary/25 border-y border-border/50 relative overflow-hidden">
        <div className="dot-bg absolute inset-0 opacity-30" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <AnimatedSection variant="fade-up" className="text-center mb-20">
            <Pill>How it works</Pill>
            <h2 className="mt-5 text-4xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              From ticket to resolution<br />in three steps.
            </h2>
          </AnimatedSection>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* connector line */}
            <div className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {steps.map((s, i) => (
              <AnimatedSection key={i} variant="fade-up" delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="relative text-center px-6 py-8 rounded-2xl border border-border bg-card"
                >
                  <div className="mx-auto mb-5 h-11 w-11 rounded-2xl bg-primary flex items-center justify-center">
                    <span className="text-xs font-black text-white">{s.n}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section id="testimonials" className="py-32 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] -bottom-20 -left-20 bg-violet-500/8" />
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection variant="fade-up" className="text-center mb-16">
            <Pill>Testimonials</Pill>
            <h2 className="mt-5 text-4xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              Loved by support teams.
            </h2>
          </AnimatedSection>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className="p-7 rounded-2xl border border-border bg-card flex flex-col gap-5"
              >
                <div className="flex gap-0.5">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 flex-1">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <AnimatedSection variant="scale-up" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-14 text-center noise">
            <Orb className="w-64 h-64 -top-16 -left-16 bg-white/10" />
            <Orb className="w-64 h-64 -bottom-16 -right-16 bg-white/8" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Ready to automate your support queue?
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Sign up in 30 seconds. No credit card. No lock-in. Just faster, better customer support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <button className="h-12 px-8 rounded-2xl bg-white text-primary font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all flex items-center gap-2 mx-auto sm:mx-0">
                      Go to dashboard <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <button className="h-12 px-8 rounded-2xl bg-white text-primary font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all flex items-center gap-2 mx-auto sm:mx-0">
                      Create free account <ChevronRight className="h-4 w-4" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 font-bold text-base mb-3" style={{ fontFamily: "var(--font-display)" }}>
                <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                SentraFlow
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
                AI-powered feedback resolution for modern support teams.
              </p>
            </div>

            {[
              { title: "Product", links: [["Features", "#features"], ["How it works", "#how-it-works"], ["Feedback Generator", "/generator"], ["Dashboard", "/dashboard"]] },
              { title: "Resources", links: [["GitHub", "https://github.com"], ["Prisma Docs", "https://prisma.io/docs"], ["Tailwind CSS", "https://tailwindcss.com"], ["Framer Motion", "https://framer.com/motion"]] },
              { title: "Company",  links: [["About", "#"], ["Privacy Policy", "#"], ["Terms", "#"], ["Contact", "mailto:support@sentraflow.com"]] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SentraFlow. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Crafted with care and Gemini 2.5 Flash.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
