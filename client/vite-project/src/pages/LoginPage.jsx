import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const result = await login(data.email, data.password)
      if (result.success) {
        toast.success("Welcome back! Login successful.")
        navigate("/dashboard")
      } else {
        toast.error(result.message || "Invalid email or password.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold font-display tracking-tight text-foreground">Sign In</h2>
        <p className="text-xs text-muted-foreground">Enter your credentials below to access your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="name@example.com"
              className="pl-10"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive font-medium mt-0.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-muted-foreground block">Password</label>
            <a href="#" className="text-[11px] text-primary font-medium hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive font-medium mt-0.5">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" loading={submitting}>
          Sign In
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
