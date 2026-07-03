"use client"

import { useState } from "react"

interface TestimonialItem {
  quote: string
  author: string
  role?: string
  avatar?: string
  rating?: number
}

interface TestimonialsBlockProps {
  heading?: string
  items?: TestimonialItem[]
  variant?: "grid" | "carousel"
  autoplay?: boolean
  autoplayInterval?: number
  breakpoint?: string
  [key: string]: unknown
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  { quote: "VisualCraft completely changed how we build websites. We shipped 3x faster.", author: "Sarah Chen", role: "CTO at Nexus", rating: 5 },
  { quote: "The animation builder is insane. Our landing page conversion went up 40%.", author: "Marcus Williams", role: "Head of Design, Stripe", rating: 5 },
  { quote: "Finally, a no-code tool that doesn't compromise on quality or flexibility.", author: "Priya Patel", role: "Founder, GrowthLab", rating: 5 },
  { quote: "The best web builder I've ever used. Period. Our team is hooked.", author: "James Lee", role: "Product Lead, Vercel", rating: 5 },
  { quote: "We replaced 3 different tools with VisualCraft. The ROI was immediate.", author: "Anna Kowalski", role: "VP Engineering, Linear", rating: 5 },
]

export function TestimonialsBlock({
  heading = "Loved by thousands of teams",
  items = DEFAULT_ITEMS,
  variant = "grid",
  breakpoint = "desktop",
}: TestimonialsBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"

  if (variant === "carousel") {
    const item = items[activeIndex] ?? items[0]
    if (!item) return null

    return (
      <section style={{ width: "100%", maxWidth: "700px", margin: "0 auto", boxSizing: "border-box" }}>
        {heading && (
          <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "48px" }}>
            <h2 style={{
              fontSize: isMobile ? "26px" : isTablet ? "34px" : "44px",
              fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15,
            }}>
              {heading}
            </h2>
          </div>
        )}

        <div style={{
          padding: isMobile ? "24px" : "40px", borderRadius: "inherit",
          background: "rgba(128,128,128,0.05)", border: "1px solid rgba(128,128,128,0.12)",
          textAlign: "center",
        }}>
          {item.rating && (
            <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginBottom: "16px" }}>
              {Array.from({ length: item.rating }).map((_, j) => (
                <span key={j} style={{ fontSize: "18px", color: "#f59e0b" }}>★</span>
              ))}
            </div>
          )}

          <p style={{
            fontSize: isMobile ? "16px" : "20px",
            lineHeight: 1.7, fontStyle: "italic", opacity: 0.85,
            marginBottom: "24px",
          }}>
            &ldquo;{item.quote}&rdquo;
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: item.avatar ? `url(${item.avatar}) center/cover` : "currentColor",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: 700, flexShrink: 0,
              overflow: "hidden",
            }}>
              {!item.avatar && (
                <span style={{ color: "#fff", mixBlendMode: "difference" }}>{item.author[0]}</span>
              )}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>{item.author}</div>
              {item.role && <div style={{ fontSize: "13px", opacity: 0.5 }}>{item.role}</div>}
            </div>
          </div>
        </div>

        {items.length > 1 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", marginTop: "24px",
          }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: activeIndex === i ? "28px" : "8px",
                  height: "8px", borderRadius: "9999px", border: "none",
                  cursor: "pointer", transition: "all 0.3s",
                  background: activeIndex === i ? "currentColor" : "rgba(128,128,128,0.3)",
                  padding: 0,
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    )
  }

  const cols = isMobile ? 1 : isTablet ? 2 : Math.min(items.length, 3)
  return (
    <section style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", boxSizing: "border-box" }}>
      {heading && (
        <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "48px" }}>
          <h2 style={{
            fontSize: isMobile ? "26px" : isTablet ? "34px" : "44px",
            fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>
            {heading}
          </h2>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: isMobile ? "16px" : "24px",
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: isMobile ? "20px" : "28px", borderRadius: "inherit",
            background: "rgba(128,128,128,0.05)", border: "1px solid rgba(128,128,128,0.12)",
            display: "flex", flexDirection: "column", gap: "20px",
          }}>
            {item.rating && (
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: item.rating }).map((_, j) => (
                  <span key={j} style={{ fontSize: "14px", color: "#f59e0b" }}>★</span>
                ))}
              </div>
            )}

            <p style={{
              fontSize: isMobile ? "13px" : "15px",
              opacity: 0.8, lineHeight: 1.7, flex: 1, fontStyle: "italic", margin: 0,
            }}>
              &ldquo;{item.quote}&rdquo;
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: item.avatar ? `url(${item.avatar}) center/cover` : "currentColor",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", fontWeight: 700, flexShrink: 0,
                overflow: "hidden",
              }}>
                {!item.avatar && (
                  <span style={{ color: "#fff", mixBlendMode: "difference" }}>{item.author[0]}</span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{item.author}</div>
                {item.role && <div style={{ fontSize: "12px", opacity: 0.5 }}>{item.role}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
