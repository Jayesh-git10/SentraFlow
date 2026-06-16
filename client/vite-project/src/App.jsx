import React from "react"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import AppRoutes from "./routes/index.jsx"
import { Toaster } from "sonner"
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster 
            position="top-right"
            theme="auto"
            closeButton
            richColors
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
