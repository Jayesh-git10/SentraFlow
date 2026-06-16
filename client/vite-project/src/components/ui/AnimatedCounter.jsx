import React, { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"

export function AnimatedCounter({ to, duration = 1.5, suffix = "", prefix = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = to
    const stepTime = (duration * 1000) / end
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration * 60))
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [inView, to, duration])

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  )
}
