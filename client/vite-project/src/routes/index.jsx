import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AuthLayout from "../layouts/AuthLayout"
import DashboardLayout from "../layouts/DashboardLayout"
import LandingPage from "../pages/LandingPage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import Dashboard from "../pages/Dashboard"
import FeedbackGenerator from "../pages/FeedbackGenerator"
import FeedbackHistory from "../pages/FeedbackHistory"
import Settings from "../pages/Settings"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Pages */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generator" element={<FeedbackGenerator />} />
        <Route path="/history" element={<FeedbackHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Redirect all unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
