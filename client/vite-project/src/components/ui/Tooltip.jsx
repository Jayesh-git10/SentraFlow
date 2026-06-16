import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

export const Tooltip = ({ children, content, position = "top", className }) => {
  const [active, setActive] = useState(false)

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute z-40 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-50 shadow-md dark:bg-slate-50 dark:text-slate-900",
              positions[position],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
