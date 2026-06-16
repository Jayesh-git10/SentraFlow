import React, { useState } from "react"
import { Outlet, Navigate, Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Dropdown, DropdownItem, DropdownSeparator } from "../components/ui/Dropdown"
import {
  LayoutDashboard, PenTool, History, Settings, Menu, X,
  Sun, Moon, LogOut, User, Sparkles, ChevronRight
} from "lucide-react"

const navItems = [
  { name: "Dashboard",          path: "/dashboard",  icon: LayoutDashboard },
  { name: "Feedback Generator", path: "/generator",  icon: PenTool },
  { name: "History",            path: "/history",    icon: History },
  { name: "Settings",           path: "/settings",   icon: Settings },
]

export default function DashboardLayout() {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const activeName = navItems.find(i => i.path === location.pathname)?.name || ""
  const initial = user?.name ? user.name[0].toUpperCase() : "U"

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ───────────────────────────────────── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-60 flex flex-col border-r border-border bg-card
          transition-transform duration-300 ease-[cubic-bezier(.25,.1,.25,1)]
          md:translate-x-0 md:static md:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 h-16 px-5 border-b border-border shrink-0">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-black text-base" style={{ fontFamily: "var(--font-display)" }}>SentraFlow</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-3">Navigation</p>
          {navItems.map(item => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl bg-primary -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User card at bottom */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-secondary/60">
            <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-5 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden h-9 w-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={sidebarOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {activeName && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">SentraFlow</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-semibold text-foreground">{activeName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* User dropdown */}
            <Dropdown
              align="right"
              trigger={
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm hover:bg-primary/20 transition-colors"
                >
                  {initial}
                </motion.button>
              }
            >
              <div className="px-3 py-2.5">
                <p className="text-xs font-semibold text-foreground">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{user?.email}</p>
              </div>
              <DropdownSeparator />
              <DropdownItem
                onClick={logout}
                className="text-destructive hover:bg-destructive/8 hover:text-destructive"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
              </DropdownItem>
            </Dropdown>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-9 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-4 px-8 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
          <span>© {new Date().getFullYear()} SentraFlow</span>
          <span>Built with Gemini 2.5 Flash</span>
        </footer>
      </div>
    </div>
  )
}
