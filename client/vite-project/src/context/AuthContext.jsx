import React, { createContext, useState, useContext } from "react"
import api from "../services/api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await api.post("/api/user/login", { email, password })
      if (response.data && response.data.success) {
        const userData = response.data.user
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, message: response.data.message || "Login failed" }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "An error occurred during login",
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const response = await api.post("/api/user", { name, email, password })
      if (response.data && response.data.success) {
        // Automatically log the user in after registration
        const loginRes = await login(email, password)
        return loginRes
      } else {
        return { success: false, message: response.data.message || "Registration failed" }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "An error occurred during registration",
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post("/api/user/logout")
    } catch (error) {
      console.error("Logout request failed:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
