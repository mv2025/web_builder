"use client"

import { useRef, useEffect, useState } from "react"

interface LogoItem {
  name: string
  src?: string
}

interface LogoMarqueeBlockProps {
  heading?: string
  logos?: LogoItem[]
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  logoHeight?: string
  gap?: string
  grayscale?: boolean
  breakpoint?: "desktop" | "tablet" | "mobile"
  [key: string]: unknown
}

const DEFAULT_LOGOS: LogoItem[] = [
  { name: "Vercel" },
  { name: "Stripe" },
  { name: "Linear" },
  { name: "Notion" },
  { name: "Figma" },
  { name: "GitHub" },
  { name: "Slack" },
  { name: "Shopify" },
]

export function LogoMarqueeBlock({
  heading = "Trusted by the best teams",
  logos = DEFAULT_LOGOS,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  logoHeight = "28px",
  gap = "64px",
  grayscale = true,
  breakpoint = "desktop",
}: LogoMarqueeBlockProps) {
  const isMobile = breakpoint === "mobile"
  const trackRef = useRef<HTMLDivElement>(null)
  const [animId] = useState(() => `marquee-${Math.random().toString(36).slice(2, 8)}`)

  const effectiveGap = isMobile ? "40px" : gap
  const duration = `${Math.max(10, 80 - speed)}s`
  const dir = direction === "right" ? "reverse" : "normal"

  return (
    <section style={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}>
      {heading && (
        <p style={{
          textAlign: "center", fontSize: isMobile ? "12px" : "13px",
          textTransform: "uppercase", letterSpacing: "0.1em",
          marginBottom: isMobile ? "20px" : "32px", opacity: 0.4, fontWeight: 500,
        }}>
          {heading}
        </p>
      )}

      <div
        className={animId}
        style={{
          display: "flex", width: "max-content",
          animation: `${animId}-scroll ${duration} linear infinite`,
          animationDirection: dir,
        }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? trackRef : undefined}
            style={{
              display: "flex", alignItems: "center", gap: effectiveGap,
              paddingRight: effectiveGap,
              flexShrink: 0,
            }}
          >
            {logos.map((logo, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, height: logoHeight,
                  filter: grayscale ? "grayscale(100%)" : undefined,
                  opacity: grayscale ? 0.5 : 0.8,
                  transition: "filter 0.3s, opacity 0.3s",
                }}
              >
                {logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.name}
                    style={{ height: "100%", width: "auto", objectFit: "contain" }}
                  />
                ) : (
                  <span style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: 800, whiteSpace: "nowrap",
                    letterSpacing: "-0.01em",
                  }}>
                    {logo.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ${animId}-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        ${pauseOnHover ? `.${animId}:hover { animation-play-state: paused; }` : ""}
      `}</style>
    </section>
  )
}
