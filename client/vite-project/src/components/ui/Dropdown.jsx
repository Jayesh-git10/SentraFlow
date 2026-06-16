import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

export const Dropdown = ({ trigger, children, align = "right", className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const alignments = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute z-30 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-lg focus:outline-none",
              alignments[align],
              className
            )}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const DropdownItem = ({ children, onClick, className, disabled = false }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150",
        className
      )}
    >
      {children}
    </button>
  )
}

export const DropdownSeparator = () => (
  <div className="-mx-1 my-1 h-px bg-border/50" />
)
