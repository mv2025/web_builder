"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Lenis from "lenis"

interface TextZoomScrollBlockProps {
  lines?: string[]
  line1?: string
  line2?: string
  line3?: string
  fontSize?: string
  bgColor?: string
  textColor?: string
  revealBg?: string
  revealTextColor?: string
  revealTitle?: string
  revealSubtitle?: string
  revealDescription?: string
  headerLeft?: string
  headerRight?: string
  footerLeft?: string
  footerRight?: string
  scrollHeight?: string
  viewportHeight?: string
  isPreview?: boolean
  [key: string]: unknown
}

export function TextZoomScrollBlock({
  lines: linesProp,
  line1 = "BUILT TO", line2 = "ENTER", line3 = "LENIS FLOW",
  fontSize = "13vw",
  bgColor = "#08080a",
  textColor = "#ffffff",
  revealBg = "#ffffff",
  revealTextColor = "#08080a",
  revealTitle = "Thank You.",
  revealSubtitle = "Project Sequence Terminal // Complete",
  revealDescription = "The core architecture handles all constraints smoothly. Your multi-section parallax system is now complete, fully responsive, and performance optimized.",
  headerLeft = "Ecosystem Module // 03",
  headerRight = "Web Scrolling Engine",
  footerLeft = "As It Should Be",
  footerRight = "Runtime Context // 2026",
  scrollHeight = "4000px",
  viewportHeight = "100vh",
  isPreview = false,
}: TextZoomScrollBlockProps) {
  const lines = linesProp ?? [line1, line2, line3].filter(Boolean)
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

    if (isPreview) {
      const wrapper = canvas || undefined
      const lenis = new Lenis({
        wrapper,
        content: wrapper?.firstElementChild as HTMLElement || undefined,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      let rafId: number
      function raf(time: number) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
      return () => {
        lenis.destroy()
        cancelAnimationFrame(rafId)
      }
    }
  }, [isPreview])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer ? scrollContainerRef : undefined,
  })

  // Highly dramatic exponential zoom feel
  const textScale = useTransform(scrollYProgress, [0, 0.35, 0.50, 0.65], [1, 12, 120, 480])
  const textX = useTransform(scrollYProgress, [0, 0.30, 0.48, 0.65], ["0vw", "-15vw", "-60vw", "-120vw"])
  const textY = useTransform(scrollYProgress, [0, 0.35, 0.50, 0.65], ["0vh", "2vh", "10vh", "25vh"])
  const mainOpacity = useTransform(scrollYProgress, [0.55, 0.62], [1, 0])
  
  // Smoothly reveal content behind
  const revealOpacity = useTransform(scrollYProgress, [0.52, 0.62, 1.00], [0, 1, 1])
  const revealScale = useTransform(scrollYProgress, [0.52, 0.65, 1.00], [0.94, 1, 1])
  const containerBgColor = useTransform(scrollYProgress, [0.55, 0.62], [bgColor, revealBg])

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: scrollHeight,
        backgroundColor: bgColor,
        color: textColor,
        width: "100%",
      }}
    >
      <motion.div
        style={{
          backgroundColor: containerBgColor,
          position: "sticky",
          top: 0,
          height: viewportHeight,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* Monospaced HUD background elements */}
        <motion.div
          style={{
            opacity: mainOpacity,
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <div style={{
            width: "100%", display: "flex", justifyContent: "space-between",
            fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
          }}>
            <span>{headerLeft}</span>
            <span>{headerRight}</span>
          </div>

          {/* Central Zooming Text Wrapper */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", perspective: "1200px" }}>
            <motion.div
              style={{
                scale: textScale,
                x: textX,
                y: textY,
                originX: 0.5,
                originY: 0.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                lineHeight: 0.8,
                textTransform: "uppercase",
                letterSpacing: "-0.05em",
                textAlign: "center",
                whiteSpace: "nowrap",
                width: "max-content",
              }}
            >
              {lines.map((line, i) => (
                <span key={i} style={{ fontSize, display: "block", color: textColor }}>{line}</span>
              ))}
            </motion.div>
          </div>

          <div style={{
            width: "100%", display: "flex", justifyContent: "space-between",
            fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
          }}>
            <span>{footerLeft}</span>
            <span>{footerRight}</span>
          </div>
        </motion.div>

        {/* Revealed Content Panel */}
        <motion.div
          style={{
            opacity: revealOpacity,
            scale: revealScale,
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
            textAlign: "center",
            backgroundColor: revealBg,
            color: revealTextColor,
            zIndex: 30,
          }}
        >
          <span style={{
            fontFamily: "monospace", fontSize: "13px", letterSpacing: "0.2em",
            textTransform: "uppercase", opacity: 0.6, marginBottom: "16px", fontWeight: 700,
          }}>
            {revealSubtitle}
          </span>
          <h3 style={{
            fontSize: "clamp(48px, 9vw, 120px)", fontWeight: 900,
            letterSpacing: "-0.04em", textTransform: "uppercase", lineHeight: 0.95,
          }}>
            {revealTitle}
          </h3>
          <p style={{
            marginTop: "24px", maxWidth: "480px", fontSize: "15px",
            opacity: 0.65, lineHeight: 1.7,
          }}>
            {revealDescription}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
