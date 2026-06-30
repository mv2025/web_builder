"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Lenis from "lenis"

interface CardItem {
  title?: string
  category?: string
  src?: string
  placeholder?: string
}

interface HorizontalScrollBlockProps {
  cards?: CardItem[]
  cardWidth?: string
  gap?: string
  aspectRatio?: string
  showLabels?: boolean
  borderRadius?: string
  overlayColor?: string
  scrollHeight?: string
  viewportHeight?: string
  xEnd?: string
  bgColor?: string
  [key: string]: unknown
}

export function HorizontalScrollBlock({
  cards = [
    { title: "Project Alpha", category: "DESIGN", src: "", placeholder: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600" },
    { title: "Project Beta", category: "DEVELOPMENT", src: "", placeholder: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600" },
    { title: "Project Gamma", category: "BRANDING", src: "", placeholder: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600" },
    { title: "Project Delta", category: "ARCHITECTURE", src: "", placeholder: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600" },
  ],
  cardWidth = "400px",
  gap = "24px",
  aspectRatio = "4/3",
  showLabels = true,
  borderRadius = "16px",
  overlayColor = "rgba(0,0,0,0.3)",
  scrollHeight = "2000px",
  viewportHeight = "500px",
  xEnd = "-65%",
  bgColor = "#0a0a0a",
}: HorizontalScrollBlockProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | undefined>(undefined)

  useEffect(() => {
    const el = targetRef.current
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
    target: targetRef,
    container: scrollContainer ? { current: scrollContainer } : undefined,
  })
  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", xEnd])

  return (
    <div
      ref={targetRef}
      style={{
        position: "relative",
        height: scrollHeight,
        width: "100%",
        backgroundColor: bgColor,
        color: "#ffffff",
      }}
    >
      <div style={{
        position: "sticky",
        top: 0,
        height: viewportHeight,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        paddingLeft: "40px",
      }}>
        <motion.div
          style={{
            x: xTransform,
            display: "flex",
            flexDirection: "row",
            gap,
            width: "max-content",
            paddingRight: "40px",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                width: cardWidth,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{
                width: "100%",
                aspectRatio,
                position: "relative",
                borderRadius,
                overflow: "hidden",
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
              }}>
                {(card.src || card.placeholder) && (
                  card.src ? (
                    <video
                      src={card.src}
                      poster={card.placeholder}
                      autoPlay loop muted playsInline
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
                    />
                  ) : (
                    <img
                      src={card.placeholder}
                      alt={card.title || ""}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
                    />
                  )
                )}
                <div style={{ position: "absolute", inset: 0, background: overlayColor }} />
              </div>
              {showLabels && (
                <div style={{ marginTop: "16px", paddingLeft: "4px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase" }}>{card.title}</div>
                  <div style={{ fontSize: "12px", opacity: 0.5, marginTop: "4px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.category}</div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
