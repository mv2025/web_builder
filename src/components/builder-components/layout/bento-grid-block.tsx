"use client"

interface BentoItem {
  title: string
  description: string
  image?: string
  icon?: string
  span?: "1x1" | "2x1" | "1x2" | "2x2"
}

interface BentoGridBlockProps {
  heading?: string
  subheading?: string
  items?: BentoItem[]
  gap?: string
  borderRadius?: string
  cardBackground?: string
  cardBorderColor?: string
  breakpoint?: "desktop" | "tablet" | "mobile"
  [key: string]: unknown
}

const DEFAULT_ITEMS: BentoItem[] = [
  { title: "Lightning Fast", description: "Built for speed. Every interaction feels instant with our optimized engine.", icon: "⚡", span: "2x1" },
  { title: "AI-Powered", description: "Generate layouts, copy, and components with artificial intelligence.", icon: "🤖", span: "1x1" },
  { title: "Responsive", description: "Pixel-perfect on every screen size.", icon: "📱", span: "1x1" },
  { title: "Beautiful Design System", description: "A comprehensive library of professionally designed components ready for production. Customize everything from colors to typography.", icon: "🎨", span: "1x2" },
  { title: "One-Click Deploy", description: "Ship to production instantly with integrated hosting.", icon: "🚀", span: "1x1" },
  { title: "Collaboration", description: "Real-time editing with your team.", icon: "👥", span: "1x1" },
]

function getSpanStyle(span: string, breakpoint: string): React.CSSProperties {
  if (breakpoint === "mobile") return {}
  if (breakpoint === "tablet") {
    if (span === "2x1") return { gridColumn: "span 2" }
    return {}
  }
  switch (span) {
    case "2x1": return { gridColumn: "span 2" }
    case "1x2": return { gridRow: "span 2" }
    case "2x2": return { gridColumn: "span 2", gridRow: "span 2" }
    default: return {}
  }
}

export function BentoGridBlock({
  heading = "Why choose us",
  subheading = "Everything you need in one platform",
  items = DEFAULT_ITEMS,
  gap = "16px",
  borderRadius = "16px",
  cardBackground = "rgba(128,128,128,0.05)",
  cardBorderColor = "rgba(128,128,128,0.12)",
  breakpoint = "desktop",
}: BentoGridBlockProps) {
  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"
  const cols = isMobile ? 1 : isTablet ? 2 : 4

  return (
    <section style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", boxSizing: "border-box" }}>
      {(heading || subheading) && (
        <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "48px" }}>
          {heading && (
            <h2 style={{
              fontSize: isMobile ? "28px" : isTablet ? "36px" : "44px",
              fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "12px", lineHeight: 1.15,
            }}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p style={{ fontSize: isMobile ? "14px" : "16px", opacity: 0.5, maxWidth: "480px", margin: "0 auto" }}>
              {subheading}
            </p>
          )}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
      }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              ...getSpanStyle(item.span ?? "1x1", breakpoint),
              padding: isMobile ? "20px" : "28px",
              borderRadius,
              background: cardBackground,
              border: `1px solid ${cardBorderColor}`,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflow: "hidden",
              position: "relative",
              minHeight: item.span === "1x2" || item.span === "2x2" ? "220px" : "auto",
            }}
          >
            {item.image && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 0,
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover", backgroundPosition: "center",
                opacity: 0.15,
              }} />
            )}
            <div style={{ position: "relative", zIndex: 1 }}>
              {item.icon && (
                <div style={{
                  width: "44px", height: "44px", borderRadius: "10px",
                  background: "rgba(128,128,128,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", marginBottom: "4px",
                }}>
                  {item.icon}
                </div>
              )}
              <h3 style={{
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: 700, marginBottom: "6px", lineHeight: 1.3,
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: isMobile ? "13px" : "14px",
                opacity: 0.6, lineHeight: 1.6, margin: 0,
              }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
