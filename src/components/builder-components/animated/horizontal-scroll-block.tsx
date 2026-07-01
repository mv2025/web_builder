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
  bgColor?: string
  isPreview?: boolean
  [key: string]: unknown
}

export function HorizontalScrollBlock({
  cards = [
    { title: "Project Alpha", category: "DESIGN", src: "", placeholder: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600" },
    { title: "Project Beta", category: "DEVELOPMENT", src: "", placeholder: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600" },
    { title: "Project Gamma", category: "BRANDING", src: "", placeholder: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600" },
    { title: "Project Delta", category: "ARCHITECTURE", src: "", placeholder: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600" },
  ],
  cardWidth = "420px",
  gap = "48px",
  aspectRatio = "16/10",
  showLabels = true,
  borderRadius = "20px",
  overlayColor = "rgba(0,0,0,0.25)",
  scrollHeight = "2400px",
  viewportHeight = "100vh",
  bgColor = "transparent",
  isPreview = false,
}: HorizontalScrollBlockProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const [scrollRange, setScrollRange] = useState(0)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return
    const canvas = el.closest("[data-canvas-scroll]") as HTMLElement | null
    if (canvas) {
      containerRef.current = canvas
      setScrollContainer(canvas)
    } else {
      containerRef.current = document.documentElement
      setScrollContainer(document.documentElement)
    }

    // Only instantiate Lenis in preview mode or standalone mode to prevent multi-instance conflicts in edit mode
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

  // Measure dynamic scroll range
  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current && targetRef.current) {
        const viewportWidth = targetRef.current.offsetWidth
        const contentWidth = scrollRef.current.scrollWidth
        // Adding safety padding for ends
        setScrollRange(Math.max(0, contentWidth - viewportWidth + 80))
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    const timer = setTimeout(handleResize, 200)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [cards, cardWidth, gap])

  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: scrollContainer ? containerRef : undefined,
  })

  // Dynamic X translation
  const xTransform = useTransform(scrollYProgress, [0, 1], [0, -scrollRange])

  return (
    <div
      ref={targetRef}
      style={{
        position: "relative",
        height: scrollHeight,
        width: "100%",
        backgroundColor: bgColor,
        color: "#0a0a0a",
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
        paddingLeft: "80px",
      }}>
        <motion.div
          ref={scrollRef}
          style={{
            x: xTransform,
            display: "flex",
            flexDirection: "row",
            gap,
            width: "max-content",
            paddingRight: "80px",
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              style={{
                width: cardWidth,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              whileHover="hover"
              initial="initial"
            >
              <div style={{
                width: "100%",
                aspectRatio,
                position: "relative",
                borderRadius,
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 30px 60px -15px rgba(0,0,0,0.1)",
              }}>
                {(card.src || card.placeholder) && (
                  card.src ? (
                    <motion.video
                      src={card.src}
                      poster={card.placeholder}
                      autoPlay loop muted playsInline
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      variants={{
                        hover: { scale: 1.06, filter: "brightness(0.9) contrast(1.05)" },
                        initial: { scale: 1, filter: "brightness(0.8) contrast(1)" }
                      }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : (
                    <motion.img
                      src={card.placeholder}
                      alt={card.title || ""}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      variants={{
                        hover: { scale: 1.06, filter: "brightness(0.9) contrast(1.05)" },
                        initial: { scale: 1, filter: "brightness(0.8) contrast(1)" }
                      }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )
                )}
                <div style={{ position: "absolute", inset: 0, background: overlayColor }} />
              </div>
              {showLabels && (
                <div style={{ marginTop: "20px", paddingLeft: "4px" }}>
                  <motion.div 
                    style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", textTransform: "uppercase" }}
                    variants={{
                      hover: { x: 4, color: "#000000" },
                      initial: { x: 0, color: "rgba(0,0,0,0.9)" }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.title}
                  </motion.div>
                  <motion.div 
                    style={{ fontSize: "11px", opacity: 0.5, marginTop: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}
                    variants={{
                      hover: { x: 4 },
                      initial: { x: 0 }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.category}
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
