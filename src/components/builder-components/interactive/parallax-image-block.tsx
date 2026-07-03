"use client"

import { useRef, useState, useEffect } from "react"

interface ParallaxImageBlockProps {
  image?: string
  height?: string
  speed?: number
  overlayColor?: string
  overlayOpacity?: number
  heading?: string
  subheading?: string
  textAlign?: "left" | "center" | "right"
  breakpoint?: "desktop" | "tablet" | "mobile"
  [key: string]: unknown
}

export function ParallaxImageBlock({
  image = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200",
  height = "500px",
  speed = 0.5,
  overlayColor = "rgba(0,0,0,0.4)",
  overlayOpacity = 1,
  heading = "",
  subheading = "",
  textAlign = "center",
  breakpoint = "desktop",
}: ParallaxImageBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"
  const effectiveHeight = isMobile ? "300px" : isTablet ? "400px" : height

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const scrollParent = el.closest("[data-canvas-scroll]") as HTMLElement | null
    const scroller = scrollParent ?? window

    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const viewportH = scrollParent ? scrollParent.clientHeight : window.innerHeight
      const center = rect.top + rect.height / 2 - viewportH / 2
      setOffset(center * speed * -0.3)
    }

    scroller.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => scroller.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: effectiveHeight,
        overflow: "hidden",
        borderRadius: "inherit",
      }}
    >
      {/* Parallax image */}
      {image && (
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${offset}px)`,
            willChange: "transform",
          }}
        />
      )}

      {/* Overlay */}
      {overlayColor && (
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Content */}
      {(heading || subheading) && (
        <div style={{
          position: "relative", zIndex: 1,
          height: "100%", width: "100%",
          display: "flex", flexDirection: "column",
          alignItems: textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start",
          justifyContent: "center",
          padding: isMobile ? "24px" : "48px",
          boxSizing: "border-box",
          textAlign,
          color: "#ffffff",
        }}>
          {heading && (
            <h2 style={{
              fontSize: isMobile ? "32px" : isTablet ? "44px" : "56px",
              fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1,
              margin: 0, marginBottom: subheading ? "16px" : 0,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p style={{
              fontSize: isMobile ? "14px" : "18px",
              opacity: 0.85, maxWidth: "600px", margin: 0, lineHeight: 1.6,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}>
              {subheading}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
