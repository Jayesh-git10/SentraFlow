import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"

const variants = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
}

export function AnimatedSection({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.55,
  className = "",
  once = true,
  amount = 0.15,
  as: Tag = "div",
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, amount })

  const MotionTag = motion[Tag] || motion.div

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionTag>
  )
}

export function StaggerContainer({ children, staggerDelay = 0.08, className = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}
