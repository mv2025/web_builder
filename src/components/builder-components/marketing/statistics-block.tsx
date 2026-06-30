interface StatItem { value: string; label: string; description?: string }

interface StatisticsBlockProps {
  items?: StatItem[]
  heading?: string
  breakpoint?: string
  [key: string]: unknown
}

const DEFAULT_ITEMS: StatItem[] = [
  { value: "50K+", label: "Websites Built" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "3x", label: "Faster Launch" },
  { value: "4.9★", label: "Rating" },
]

export function StatisticsBlock({ items = DEFAULT_ITEMS, heading, breakpoint = "desktop" }: StatisticsBlockProps) {
  const cols = breakpoint === "mobile" ? 2 : breakpoint === "tablet" ? Math.min(items.length, 2) : items.length
  return (
    <section style={{ width: "100%", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
      {heading && <h2 style={{ fontSize: breakpoint === "mobile" ? "1.75em" : "2.5em", fontWeight: 800, marginBottom: breakpoint === "mobile" ? "24px" : "48px" }}>{heading}</h2>}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: breakpoint === "mobile" ? "16px" : "32px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "24px" }}>
            <div style={{
              fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, lineHeight: 1,
              marginBottom: "8px",
            }}>
              {item.value}
            </div>
            <div style={{ fontSize: "0.95em", opacity: 0.6, fontWeight: 500 }}>{item.label}</div>
            {item.description && <div style={{ fontSize: "0.8em", opacity: 0.4, marginTop: "4px" }}>{item.description}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
