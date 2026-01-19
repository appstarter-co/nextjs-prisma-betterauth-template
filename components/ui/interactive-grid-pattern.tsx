"use client"

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  squares?: [number, number]
  className?: string
  squaresClassName?: string
  autoHover?: boolean
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  autoHover = false,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)
  const isManuallyHovered = useRef(false)

  useEffect(() => {
    if (!autoHover) return
    const total = (horizontal-5) * (vertical-5)
    const interval = setInterval(() => {
      // Only set random hover if not manually hovered
      if (!isManuallyHovered.current) {
        const randomIndex = Math.floor(Math.random() * total)
        setHoveredSquare(randomIndex)
      }
    }, 800)
    return () => clearInterval(interval)
  }, [autoHover, horizontal, vertical])

  // Handlers to track manual hover
  const handleMouseEnter = (index: number) => {
    isManuallyHovered.current = true
    setHoveredSquare(index)
  }
  const handleMouseLeave = () => {
    isManuallyHovered.current = false
    setHoveredSquare(null)
  }

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        "absolute inset-0 h-full w-full border border-gray-400/30",
        className
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width
        const y = Math.floor(index / horizontal) * height
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-gray-400/30 transition-all duration-300 ease-in-out",
              hoveredSquare === index ? "fill-primary/70" : "fill-transparent",
              squaresClassName
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        )
      })}
    </svg>
  )
}