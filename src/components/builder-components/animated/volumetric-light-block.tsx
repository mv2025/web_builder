"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

const GRAIN_NOISE = 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22g%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23g)%22/%3E%3C/svg%3E")'

interface StatItem {
  to: number
  suffix: string
  label: string
}

interface VolumetricLightBlockProps {
  label?: string
  stats?: StatItem[]
  lightColor?: string
  minHeight?: string
  bgColor?: string
  isPreview?: boolean
  breakpoint?: string
  [key: string]: unknown
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    if (to === 0) { setCount(0); return }
    let start = 0
    const duration = 1200
    const step = 16
    const increment = to / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [to])
  return <>{count}{suffix}</>
}

export function VolumetricLightBlock({
  label = "Let There Be Light",
  stats = [
    { to: 3,   suffix: "",    label: "Spot Fixtures"  },
    { to: 60,  suffix: "fps", label: "Smooth Render"  },
    { to: 100, suffix: "%",   label: "CSS Fallback"   },
    { to: 0,   suffix: "ms",  label: "JS Bundle Cost" },
  ],
  lightColor = "230,240,255",
  minHeight = "380px",
  bgColor = "#000000",
  isPreview = false,
  breakpoint = "desktop",
}: VolumetricLightBlockProps) {
  const [lit, setLit] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [beamOpacity, setBeamOpacity] = useState(0)
  const [statsOpacity, setStatsOpacity] = useState(0)
  const [counted, setCounted] = useState(false)
  const [lampGlow, setLampGlow] = useState(0)
  const [wasClicked, setWasClicked] = useState(false)

  async function runFlicker(on: boolean) {
    if (animating) return
    setAnimating(true)

    const flicker = on
      ? [0.7, 0.1, 0.8, 0.05, 1, 0.1, 0.7, 0.05, 1]
      : [0.6, 0.0, 0.5, 0.0, 0.3, 0.0, 0.1, 0.0, 0]
    const delays = on
      ? [70, 80, 60, 100, 70, 90, 60, 120, 550]
      : [60, 70, 55, 90, 60, 80, 55, 100, 200]

    for (let f = 0; f < flicker.length; f++) {
      setLampGlow(flicker[f])
      await new Promise(r => setTimeout(r, delays[f]))
    }

    if (on) {
      setWasClicked(true)
      setBeamOpacity(1)
      await new Promise(r => setTimeout(r, 280))
      setStatsOpacity(1)
      setCounted(true)
      setLit(true)
    } else {
      setBeamOpacity(0)
      setStatsOpacity(0)
      setLit(false)
      setCounted(false)
    }
    setAnimating(false)
  }

  const spots = [35, 50, 65]
  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"
  const isMobileOrTablet = isMobile || isTablet

  const rgbColor = React.useMemo(() => {
    if (!lightColor) return "230,240,255";
    if (lightColor.includes(",")) return lightColor;
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = lightColor.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
      : "230,240,255";
  }, [lightColor]);

  return (
    <section
      className="relative w-full"
      style={{ fontFamily: "var(--font-sans, sans-serif)", minHeight, backgroundColor: bgColor }}
    >
      {/* ── 3D Room Background (purely decorative, doesn't affect content flow) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {/* Back wall */}
        <div className="absolute inset-0" style={{ clipPath: "polygon(15% 15%, 85% 15%, 85% 85%, 15% 85%)", background: "linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.65) 100%)" }} />
        {/* Ceiling */}
        <div className="absolute inset-0" style={{ clipPath: "polygon(0% 0%, 100% 0%, 85% 15%, 15% 15%)", background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 100%)" }} />
        {/* Floor */}
        <div className="absolute inset-0" style={{ clipPath: "polygon(0% 100%, 100% 100%, 85% 85%, 15% 85%)", background: "linear-gradient(to top, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.75) 100%)" }} />
        {/* Left wall */}
        <div className="absolute inset-0" style={{ clipPath: "polygon(0% 0%, 15% 15%, 15% 85%, 0% 100%)", background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(255,255,255,0.04) 100%)" }} />
        {/* Right wall */}
        <div className="absolute inset-0" style={{ clipPath: "polygon(100% 0%, 85% 15%, 85% 85%, 100% 100%)", background: "linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(255,255,255,0.04) 100%)" }} />

        {/* Wireframe */}
        <svg className="absolute inset-0 w-full h-full">
          <line x1="15%" y1="15%" x2="85%" y2="15%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="15%" y1="85%" x2="85%" y2="85%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="15%" y1="15%" x2="15%" y2="85%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="85%" y1="15%" x2="85%" y2="85%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="0%" y1="0%" x2="15%" y2="15%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="100%" y1="0%" x2="85%" y2="15%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0%" y1="100%" x2="15%" y2="85%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="100%" y1="100%" x2="85%" y2="85%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </svg>

        {/* Light illumination */}
        <div className="absolute inset-0" style={{
          opacity: lit ? 1 : 0,
          transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)",
          mixBlendMode: "screen",
        }}>
          <div className="absolute inset-0" style={{
            clipPath: "polygon(15% 15%, 85% 15%, 85% 85%, 15% 85%)",
            background: spots.map(x => `radial-gradient(ellipse 40% 55% at ${x}% 72%, rgba(${rgbColor},0.45) 0%, rgba(${rgbColor},0.1) 50%, transparent 80%)`).join(", ")
          }} />
          <div className="absolute inset-0" style={{
            clipPath: "polygon(0% 0%, 15% 15%, 15% 85%, 0% 100%)",
            background: `radial-gradient(ellipse 60% 60% at 12% 72%, rgba(${rgbColor},0.18) 0%, transparent 65%)`
          }} />
          <div className="absolute inset-0" style={{
            clipPath: "polygon(100% 0%, 85% 15%, 85% 85%, 100% 100%)",
            background: `radial-gradient(ellipse 60% 60% at 88% 72%, rgba(${rgbColor},0.18) 0%, transparent 65%)`
          }} />
          <div className="absolute inset-0" style={{
            clipPath: "polygon(0% 100%, 100% 100%, 85% 85%, 15% 85%)",
            background: spots.map(x => `radial-gradient(ellipse 55% 90% at ${x}% 10%, rgba(${rgbColor},0.35) 0%, rgba(${rgbColor},0.08) 55%, transparent 85%)`).join(", ")
          }} />
        </div>

        {/* Right wall glow */}
        <div style={{
          position: "absolute", right: "15%", top: "50%", transform: "translateY(-50%)",
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 60%, transparent 80%)",
          opacity: beamOpacity, filter: "blur(20px)", transition: "opacity 0.6s ease",
        }} />

        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)`
        }} />

        {/* Film grain */}
        <div className="absolute inset-0" style={{
          opacity: 0.04, mixBlendMode: "screen",
          backgroundImage: GRAIN_NOISE, backgroundSize: "256px 256px"
        }} />
      </div>

      {/* ── Content (natural flow — drives the section height) ── */}
      <div
        className="relative flex justify-between max-w-6xl mx-auto"
        style={{
          zIndex: 10,
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: isMobile ? "32px" : isTablet ? "24px" : "48px",
          padding: isMobile ? "40px 24px" : isTablet ? "40px 32px" : "60px 48px",
          width: "100%",
        }}
      >
        {/* LEFT: label + lamp + buttons */}
        <div 
          className="flex flex-col flex-shrink-0"
          style={{
            alignItems: isMobile ? "center" : "flex-start",
            width: isMobile ? "100%" : isTablet ? "280px" : "320px",
          }}
        >
          {/* Label */}
          <div
            className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold italic mb-5 select-none transition-all duration-700"
            style={{
              color: lit ? "#ffffff" : "rgba(255,255,255,0.35)",
              textShadow: lit ? `0 0 12px rgba(${rgbColor},0.7), 0 0 24px rgba(${rgbColor},0.3)` : "none",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            {label}
          </div>

          {/* Lamp */}
          <div className="relative" style={{ width: 300, height: 80, marginLeft: isMobile ? "-24px" : isTablet ? "-12px" : "0px" }}>
            <div style={{ position: "absolute", top: 18, left: 0, width: 26, height: 4, background: "#222", borderRadius: 2 }} />
            <div style={{ position: "absolute", top: 18, left: 23, width: 4, height: 20, background: "#1a1a1a", borderRadius: 2 }} />
            <div style={{
              position: "absolute", top: 32, left: 10, width: 48, height: 28,
              background: "linear-gradient(90deg, #333 0%, #151515 100%)",
              borderRadius: "6px 20px 20px 6px",
              boxShadow: lampGlow > 0 ? `4px 0 ${16 * lampGlow}px ${4 * lampGlow}px rgba(${rgbColor},${0.4 * lampGlow})` : "none",
              display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 5,
              zIndex: 7,
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: "50%",
                background: lampGlow > 0
                  ? `radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(${rgbColor},0.7) 65%, transparent 100%)`
                  : "rgba(255,255,255,0.05)",
                boxShadow: lampGlow > 0 ? `0 0 10px rgba(${rgbColor},0.8)` : "none",
              }} />
            </div>
            {/* Beam */}
            <div style={{ position: "absolute", top: 46, left: 52, width: 800, height: 0, pointerEvents: "none", zIndex: 6 }}>
              <div style={{
                position: "absolute", top: -44, left: 0, width: "100%", height: 88,
                background: `linear-gradient(90deg, rgba(${rgbColor},0.18) 0%, rgba(${rgbColor},0.05) 45%, rgba(${rgbColor},0.01) 75%, transparent 100%)`,
                clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
                opacity: beamOpacity, transformOrigin: "left center", transition: "opacity 0.5s ease",
              }} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-3" style={{ position: "relative", zIndex: 100, width: "100%", justifyContent: isMobile ? "center" : "flex-start" }}>
            <button
              onClick={(e) => { e.stopPropagation(); if (!lit && !animating) runFlicker(true) }}
              className="px-5 py-2 text-xs uppercase tracking-widest border rounded-full transition-all duration-300"
              style={{
                borderColor: lit ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.25)",
                color: lit ? "rgba(255,255,255,0.2)" : "#fff",
                background: "transparent",
                cursor: lit ? "default" : "pointer",
              }}
            >Turn on</button>
            <button
              onClick={(e) => { e.stopPropagation(); if (lit && !animating) runFlicker(false) }}
              className="px-5 py-2 text-xs uppercase tracking-widest border rounded-full transition-all duration-300"
              style={{
                borderColor: lit ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                color: lit ? "#fff" : "rgba(255,255,255,0.2)",
                background: lit ? "rgba(255,255,255,0.05)" : "transparent",
                cursor: !lit ? "default" : "pointer",
              }}
            >Turn off</button>
          </div>
        </div>

        {/* RIGHT: Stats */}
        <div
          className="grid grid-cols-2 gap-x-6 gap-y-8 w-full min-w-0"
          style={{
            opacity: statsOpacity,
            transition: "opacity 0.8s ease",
            paddingLeft: isMobile ? "0px" : isTablet ? "32px" : "64px",
            paddingTop: isMobile ? "0px" : isTablet ? "24px" : "36px",
            flex: isMobile ? "none" : "1",
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="select-none" style={{ textAlign: isMobile ? "center" : "left" }}>
              <div
                className="font-extrabold text-white tabular-nums tracking-tighter"
                style={{
                  fontSize: isMobile ? "2rem" : isTablet ? "2.6rem" : "4.5rem",
                  lineHeight: 1.1,
                  textShadow: lit
                    ? `0 1px 0 #ccc, 0 2px 0 #c5c5c5, 0 3px 0 #bbb, 0 4px 0 #b0b0b0, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,0.1), 0 0 15px rgba(${rgbColor},0.5), 0 1px 3px rgba(0,0,0,0.3), 0 3px 5px rgba(0,0,0,0.2), 0 5px 10px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.2)`
                    : "none",
                  transition: "text-shadow 0.6s ease",
                }}
              >
                {counted ? <Counter to={stat.to} suffix={stat.suffix} /> : <>0{stat.suffix}</>}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2 font-semibold">{stat.label}</div>
              <div className="mt-2 h-[2px] bg-white/10 relative overflow-hidden max-w-[40px]" style={{ margin: isMobile ? "8px auto 0 auto" : "8px 0 0 0" }}>
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: 0 }}
                  animate={counted ? { width: "100%" } : { width: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
