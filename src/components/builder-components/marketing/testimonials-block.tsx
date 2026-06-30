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
  breakpoint?: string
  [key: string]: unknown
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  { quote: "VisualCraft completely changed how we build websites. We shipped 3x faster.", author: "Sarah Chen", role: "CTO at Nexus", rating: 5 },
  { quote: "The animation builder is insane. Our landing page conversion went up 40%.", author: "Marcus Williams", role: "Head of Design, Stripe", rating: 5 },
  { quote: "Finally, a no-code tool that doesn't compromise on quality or flexibility.", author: "Priya Patel", role: "Founder, GrowthLab", rating: 5 },
]

export function TestimonialsBlock({
  heading = "Loved by thousands of teams",
  items = DEFAULT_ITEMS,
  breakpoint = "desktop",
}: TestimonialsBlockProps) {
  const cols = breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : 3
  return (
    <section style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: breakpoint === "mobile" ? "32px" : "64px" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
          {heading}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: breakpoint === "mobile" ? "16px" : "24px" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: "28px", borderRadius: "inherit",
            background: "rgba(128,128,128,0.05)", border: "1px solid rgba(128,128,128,0.12)",
            display: "flex", flexDirection: "column", gap: "20px",
          }}>
            {item.rating && (
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: item.rating }).map((_, j) => (
                  <span key={j} style={{ fontSize: "0.875em" }}>★</span>
                ))}
              </div>
            )}

            <p style={{ fontSize: "0.95em", opacity: 0.8, lineHeight: 1.7, flex: 1, fontStyle: "italic" }}>
              &ldquo;{item.quote}&rdquo;
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "currentColor", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, flexShrink: 0 }}>
                <span style={{ color: "#fff", mixBlendMode: "difference" }}>{item.author[0]}</span>
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{item.author}</div>
                {item.role && <div style={{ fontSize: "0.75em", opacity: 0.5 }}>{item.role}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
