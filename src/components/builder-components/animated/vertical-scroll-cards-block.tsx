"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Lenis from "lenis"

interface ContentCard {
  title?: string
  description?: string
}

interface VerticalScrollCardsBlockProps {
  heading?: string
  headingSize?: string
  accentColor?: string
  accentWidth?: string
  cards?: ContentCard[]
  scrollHeight?: string
  viewportHeight?: string
  bgColor?: string
  isPreview?: boolean
  [key: string]: unknown
}

export function VerticalScrollCardsBlock({
  heading = "Why\nSmooth\nScroll?",
  headingSize = "clamp(48px, 8vw, 96px)",
  accentColor = "#f43f5e",
  accentWidth = "5px",
  cards = [
    { title: "CREATE MORE IMMERSIVE INTERFACES", description: "Unlock the creative potential and impact of your web experiences. Smoothing the scroll pulls users into the flow of the experience that feels so substantial that they forget they're navigating a web page." },
    { title: "FLAWLESS KINETIC ALIGNMENT", description: "Synchronize your visual elements with scroll movement. Real-time translation coupled with custom easing curves creates a cinematic feeling that regular page jumps simply cannot replicate." },
    { title: "OPTIMIZE MOBILE PERFORMANCE", description: "Ensure a lightweight experience on touch-sensitive devices. High frame-rate transitions and fluid layout shifts keep your site performing beautifully across modern viewports and devices." },
  ],
  scrollHeight = "2000px",
  viewportHeight = "100vh",
  bgColor = "#0a0a0a",
  isPreview = false,
}: VerticalScrollCardsBlockProps) {
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
    offset: ["start start", "end end"],
  })

  const rightPanelY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(cards.length - 1) * 100}%`]
  )

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: scrollHeight,
        backgroundColor: bgColor,
        color: "#f5f5f5",
        width: "100%",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(circle at 60% 50%, ${accentColor}10 0%, transparent 50%)` }} />

      <div style={{
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "row",
        height: viewportHeight,
        width: "100%",
        overflow: "hidden",
        padding: "0 48px",
        alignItems: "center",
      }}>
        {/* Left column (sticky heading) */}
        <div style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: "20px" }}>
            <div style={{
              width: accentWidth,
              background: accentColor,
              borderRadius: "4px",
              flexShrink: 0,
            }} />
            <h2 style={{
              fontSize: headingSize,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              whiteSpace: "pre-line",
            }}>
              {heading}
            </h2>
          </div>
        </div>

        {/* Right column (scroll content cards) */}
        <div style={{
          width: "50%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}>
          <motion.div
            style={{
              y: rightPanelY,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                style={{
                  width: "100%",
                  height: viewportHeight,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexShrink: 0,
                  padding: "0 24px",
                }}
              >
                <div style={{ maxWidth: "500px" }}>
                  <h3 style={{
                    fontSize: "clamp(20px, 3vw, 36px)",
                    fontWeight: 900,
                    color: accentColor,
                    letterSpacing: "-0.03em",
                    textTransform: "uppercase",
                    lineHeight: 1.1,
                    marginBottom: "16px",
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "#a3a3a3",
                    fontWeight: 400,
                  }}>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
