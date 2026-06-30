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
  [key: string]: unknown
}

export function TextZoomScrollBlock({
  lines: linesProp,
  line1 = "BUILT TO", line2 = "ENTER", line3 = "LENIS FLOW",
  fontSize = "13vw",
  bgColor = "#0a0a0a",
  textColor = "#ffffff",
  revealBg = "#ffffff",
  revealTextColor = "#0a0a0a",
  revealTitle = "Thank You.",
  revealSubtitle = "Project Sequence Terminal // Complete",
  revealDescription = "The core architecture handles all constraints smoothly. Your multi-section parallax system is now complete, fully responsive, and performance optimized.",
  headerLeft = "Ecosystem Module // 03",
  headerRight = "Web Scrolling Engine",
  footerLeft = "As It Should Be",
  footerRight = "Runtime Context // 2026",
  scrollHeight = "4000px",
  viewportHeight = "500px",
}: TextZoomScrollBlockProps) {
  const lines = linesProp ?? [line1, line2, line3].filter(Boolean)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | undefined>(undefined)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const canvas = el.closest("[data-canvas-scroll]") as HTMLElement | null
    if (canvas) setScrollContainer(canvas)

    const wrapper = canvas || undefined
    const lenis = new Lenis({
      wrapper,
      content: wrapper?.firstElementChild as HTMLElement || undefined,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer ? { current: scrollContainer } : undefined,
    offset: ["start start", "end end"],
  })

  const textScale = useTransform(scrollYProgress, [0, 0.25, 0.40, 0.50], [1, 8, 95, 340])
  const textX = useTransform(scrollYProgress, [0, 0.20, 0.35, 0.50], ["0vw", "-12vw", "-42vw", "-78vw"])
  const textY = useTransform(scrollYProgress, [0, 0.25, 0.40, 0.50], ["0vh", "0.3vh", "4.1vh", "14.8vh"])
  const mainOpacity = useTransform(scrollYProgress, [0.47, 0.50], [1, 0])
  const revealOpacity = useTransform(scrollYProgress, [0.47, 0.50, 1.00], [0, 1, 1])
  const revealScale = useTransform(scrollYProgress, [0.47, 0.50, 1.00], [0.98, 1, 1])
  const containerBgColor = useTransform(scrollYProgress, [0.45, 0.48], [bgColor, revealBg])

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
        <motion.div
          style={{
            opacity: mainOpacity,
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <div style={{
            width: "100%", display: "flex", justifyContent: "space-between",
            fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em",
            color: "rgba(128,128,128,0.5)", textTransform: "uppercase",
          }}>
            <span>{headerLeft}</span>
            <span>{headerRight}</span>
          </div>

          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", perspective: "1000px" }}>
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
                lineHeight: 0.85,
                textTransform: "uppercase",
                letterSpacing: "-0.04em",
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
            fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em",
            color: "rgba(128,128,128,0.5)", textTransform: "uppercase",
          }}>
            <span>{footerLeft}</span>
            <span>{footerRight}</span>
          </div>
        </motion.div>

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
            padding: "24px",
            textAlign: "center",
            backgroundColor: revealBg,
            color: revealTextColor,
            zIndex: 30,
          }}
        >
          <span style={{
            fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.15em",
            textTransform: "uppercase", opacity: 0.5, marginBottom: "12px", fontWeight: 700,
          }}>
            {revealSubtitle}
          </span>
          <h3 style={{
            fontSize: "clamp(48px, 10vw, 144px)", fontWeight: 900,
            letterSpacing: "-0.04em", textTransform: "uppercase", lineHeight: 1,
          }}>
            {revealTitle}
          </h3>
          <p style={{
            marginTop: "16px", maxWidth: "400px", fontSize: "13px",
            opacity: 0.5, lineHeight: 1.6,
          }}>
            {revealDescription}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
