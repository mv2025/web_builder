"use client"

interface MarqueeBlockProps {
  items?: string[]
  speed?: number
  direction?: "left" | "right"
  separator?: string
  [key: string]: unknown
}

export function MarqueeBlock({
  items = ["✦ Build", "✦ Design", "✦ Animate", "✦ Export", "✦ Launch", "✦ Grow"],
  speed = 30,
  direction = "left",
  separator = "  ",
}: MarqueeBlockProps) {
  const combined = [...items, ...items]

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      <div style={{
        display: "flex", width: "max-content",
        animation: `marquee ${speed}s linear infinite ${direction === "right" ? "reverse" : ""}`,
      }}>
        {combined.map((item, i) => (
          <span key={i} style={{
            fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, opacity: 0.3,
            paddingLeft: "32px", paddingRight: "32px", whiteSpace: "nowrap",
            transition: "opacity 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1" }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.3" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
