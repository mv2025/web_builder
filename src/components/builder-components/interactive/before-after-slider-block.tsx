"use client"

import { useRef, useState, useCallback } from "react"

interface BeforeAfterSliderBlockProps {
  beforeImage?: string
  afterImage?: string
  beforeLabel?: string
  afterLabel?: string
  orientation?: "horizontal" | "vertical"
  initialPosition?: number
  sliderColor?: string
  borderRadius?: string
  height?: string
  breakpoint?: "desktop" | "tablet" | "mobile"
  [key: string]: unknown
}

export function BeforeAfterSliderBlock({
  beforeImage = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800",
  afterImage = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800",
  beforeLabel = "Before",
  afterLabel = "After",
  orientation = "horizontal",
  initialPosition = 50,
  sliderColor = "#ffffff",
  borderRadius = "16px",
  height = "400px",
  breakpoint = "desktop",
}: BeforeAfterSliderBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)

  const isMobile = breakpoint === "mobile"
  const effectiveHeight = isMobile ? "260px" : breakpoint === "tablet" ? "340px" : height
  const isHorizontal = orientation === "horizontal"

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let pct: number
    if (isHorizontal) {
      pct = ((clientX - rect.left) / rect.width) * 100
    } else {
      pct = ((clientY - rect.top) / rect.height) * 100
    }
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [isHorizontal])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updatePosition(e.clientX, e.clientY)
  }, [updatePosition])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    updatePosition(e.clientX, e.clientY)
  }, [isDragging, updatePosition])

  const onPointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const clipBefore = isHorizontal
    ? `inset(0 ${100 - position}% 0 0)`
    : `inset(0 0 ${100 - position}% 0)`

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "relative", width: "100%", height: effectiveHeight,
        borderRadius, overflow: "hidden", cursor: "ew-resize",
        userSelect: "none", touchAction: "none",
        background: "rgba(128,128,128,0.06)",
      }}
    >
      {/* After image (background) */}
      {afterImage && (
        <img
          src={afterImage}
          alt={afterLabel}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", pointerEvents: "none",
          }}
          draggable={false}
        />
      )}

      {/* Before image (clipped) */}
      {beforeImage && (
        <img
          src={beforeImage}
          alt={beforeLabel}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", pointerEvents: "none",
            clipPath: clipBefore,
          }}
          draggable={false}
        />
      )}

      {/* Slider line */}
      <div style={{
        position: "absolute",
        ...(isHorizontal
          ? { left: `${position}%`, top: 0, bottom: 0, width: "3px", transform: "translateX(-50%)" }
          : { top: `${position}%`, left: 0, right: 0, height: "3px", transform: "translateY(-50%)" }),
        background: sliderColor,
        zIndex: 2, pointerEvents: "none",
        boxShadow: "0 0 8px rgba(0,0,0,0.3)",
      }} />

      {/* Slider handle */}
      <div style={{
        position: "absolute",
        ...(isHorizontal
          ? { left: `${position}%`, top: "50%", transform: "translate(-50%, -50%)" }
          : { top: `${position}%`, left: "50%", transform: "translate(-50%, -50%)" }),
        width: "40px", height: "40px", borderRadius: "50%",
        background: sliderColor, zIndex: 3, pointerEvents: "none",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
          {isHorizontal ? (
            <>
              <polyline points="8 4 4 12 8 20" />
              <polyline points="16 4 20 12 16 20" />
            </>
          ) : (
            <>
              <polyline points="4 8 12 4 20 8" />
              <polyline points="4 16 12 20 20 16" />
            </>
          )}
        </svg>
      </div>

      {/* Labels */}
      {beforeLabel && (
        <div style={{
          position: "absolute", zIndex: 1, pointerEvents: "none",
          ...(isHorizontal
            ? { top: "12px", left: "12px" }
            : { top: "12px", left: "12px" }),
          background: "rgba(0,0,0,0.6)", color: "#fff",
          padding: "4px 12px", borderRadius: "6px",
          fontSize: isMobile ? "11px" : "12px", fontWeight: 600,
        }}>
          {beforeLabel}
        </div>
      )}
      {afterLabel && (
        <div style={{
          position: "absolute", zIndex: 1, pointerEvents: "none",
          ...(isHorizontal
            ? { top: "12px", right: "12px" }
            : { bottom: "12px", right: "12px" }),
          background: "rgba(0,0,0,0.6)", color: "#fff",
          padding: "4px 12px", borderRadius: "6px",
          fontSize: isMobile ? "11px" : "12px", fontWeight: 600,
        }}>
          {afterLabel}
        </div>
      )}
    </div>
  )
}
