import { useState, useEffect, useRef } from 'react'

export function useCountUp(end: number, durationMs = 500) {
  const [count, setCount] = useState(end)
  const prevEndRef = useRef(end)
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || prevEndRef.current === end) {
      setCount(end)
      prevEndRef.current = end
      return
    }
    
    let startTime: number | null = null
    const startValue = prevEndRef.current
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      
      if (progress < durationMs) {
        // ease-out
        const t = progress / durationMs
        const easeOut = t * (2 - t)
        const current = Math.round(startValue + (end - startValue) * easeOut)
        setCount(current)
        window.requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }
    
    const rafId = window.requestAnimationFrame(step)
    prevEndRef.current = end
    
    return () => window.cancelAnimationFrame(rafId)
  }, [end, durationMs])

  return count
}
