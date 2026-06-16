import React, { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../utils/utils"

export const Dialog = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogPortal onClose={onClose}>
          {children}
        </DialogPortal>
      )}
    </AnimatePresence>
  )
}

const DialogPortal = ({ onClose, children }) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
      />
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 w-full max-w-lg border border-border bg-card p-6 shadow-lg rounded-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 opacity-70 transition-all hover:opacity-100 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </motion.div>
    </div>,
    document.body
  )
}

export const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props} />
)

export const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight font-display", className)} {...props} />
)

export const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

export const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 border-t border-border/10 pt-4", className)} {...props} />
)
