import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const result = await registerUser(data.name, data.email, data.password)
      if (result.success) {
        toast.success("Account created successfully! Welcome to SentraFlow.")
        navigate("/dashboard")
      } else {
        toast.error(result.message || "Registration failed. Try again.")
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
        <h2 className="text-2xl font-bold font-display tracking-tight text-foreground">Create Account</h2>
        <p className="text-xs text-muted-foreground">Sign up now to analyze and resolve feedback with AI</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground block">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="John Doe"
              className="pl-10"
              {...register("name", {
                required: "Full Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive font-medium mt-0.5">{errors.name.message}</p>
          )}
        </div>

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
          <label className="text-xs font-semibold text-muted-foreground block">Password</label>
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
          Sign Up
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
