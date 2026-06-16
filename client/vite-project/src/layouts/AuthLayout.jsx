import React from "react"
import { Outlet, Navigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Sparkles } from "lucide-react"

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background patterns and glows */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-4">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center space-x-2 text-primary font-extrabold text-3xl font-display hover:opacity-90 transition-opacity">
            <Sparkles className="h-7 w-7 animate-pulse text-primary" />
            <span>SentraFlow</span>
          </Link>
          <p className="text-muted-foreground text-xs mt-2 uppercase tracking-widest font-semibold">Automated Feedback Intelligence</p>
        </div>

        {/* Form Container */}
        <div className="w-full border border-border bg-card/75 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
