"use client"

import React, { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"

interface WordProps {
  word: string
  progress: MotionValue<number>
  start: number
  end: number
}

function Word({ word, progress, start, end }: WordProps) {
  // Map scroll progress to opacity/color highlight
  const color = useTransform(
    progress,
    [start, end],
    ["rgba(10, 10, 10, 0.15)", "rgba(10, 10, 10, 1)"]
  )

  return (
    <motion.span 
      style={{ color }}
      className="mr-[0.25em] mb-2 select-none inline-block transition-colors duration-75"
    >
      {word}
    </motion.span>
  )
}

interface TextRevealBlockProps {
  text?: string
  scrollHeight?: string
  isPreview?: boolean
  [key: string]: unknown
}

export function TextRevealBlock({
  text = "We are a creative agency driven by the power of imagination and precision. We believe in designing digital products that not only look spectacular but work flawlessly. Every pixel we place, every line of code we write, and every interaction we design is crafted with deep intention and purpose. Our work spans branding, web development, photography, and interactive storytelling. Together, we push boundaries to craft experiences that inspire, engage, and connect with people globally.",
  scrollHeight = "150vh",
  isPreview = false,
}: TextRevealBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const canvas = el.closest("[data-canvas-scroll]") as HTMLElement | null
    if (canvas) {
      scrollContainerRef.current = canvas
      setScrollContainer(canvas)
    } else {
      scrollContainerRef.current = document.documentElement
      setScrollContainer(document.documentElement)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer ? scrollContainerRef : undefined,
    offset: ["start 0.33", "end 0.33"]
  })

  const words = text.split(" ")

  return (
    <div 
      ref={containerRef} 
      className="relative w-full py-32 flex flex-col justify-start items-center px-6 sm:px-12 md:px-24"
      style={{
        backgroundColor: "transparent",
        minHeight: scrollHeight,
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      <div className="sticky top-1/3 w-full max-w-5xl">
        <p className="flex flex-wrap text-3xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-tight text-neutral-400/35">
          {words.map((word, i) => {
            // Complete the entire reveal by 90% of the sticky duration so it finishes cleanly
            const start = (i / words.length) * 0.9
            const end = ((i + 1) / words.length) * 0.9
            
            return (
              <Word 
                key={i} 
                word={word} 
                progress={scrollYProgress} 
                start={start} 
                end={end} 
              />
            )
          })}
        </p>
      </div>
    </div>
  )
}
