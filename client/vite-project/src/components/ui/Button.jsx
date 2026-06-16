import React from "react"
import { cn } from "../../utils/utils"

export const Button = React.forwardRef(({ className, variant = "default", size = "default", loading = false, children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
    ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    link: "text-primary underline-offset-4 hover:underline bg-transparent",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-lg px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
})
Button.displayName = "Button"
