interface FeaturesItem {
  icon?: string
  title: string
  description: string
}

interface FeaturesBlockProps {
  heading?: string
  subheading?: string
  items?: FeaturesItem[]
  columns?: number
  variant?: "grid" | "alternating" | "list"
  breakpoint?: string
  [key: string]: unknown
}

const DEFAULT_ITEMS: FeaturesItem[] = [
  { icon: "⚡", title: "Blazing Fast", description: "Built with performance in mind. Every interaction is smooth and instant." },
  { icon: "🎨", title: "Beautiful Design", description: "Stunning components crafted by world-class designers, ready to use." },
  { icon: "📱", title: "Fully Responsive", description: "Your site looks perfect on every device, from desktop to mobile." },
  { icon: "🔒", title: "Secure by Default", description: "Enterprise-grade security baked in at every layer of the stack." },
  { icon: "🚀", title: "One-click Deploy", description: "Ship to production in seconds with our integrated deployment pipeline." },
  { icon: "🤖", title: "AI-Powered", description: "Let AI help you generate components, copy, and layouts instantly." },
]

export function FeaturesBlock({
  heading = "Everything you need to build",
  subheading = "A complete platform for modern web development.",
  items = DEFAULT_ITEMS,
  columns = 3,
  breakpoint = "desktop",
}: FeaturesBlockProps) {
  const cols = breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : Math.min(columns, 3)
  return (
    <section style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: breakpoint === "mobile" ? "32px" : "64px" }}>
        <h2 style={{
          fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em",
          marginBottom: "16px",
        }}>
          {heading}
        </h2>
        <p style={{ fontSize: "1.1em", opacity: 0.5, maxWidth: "500px", margin: "0 auto" }}>
          {subheading}
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: breakpoint === "mobile" ? "16px" : "24px",
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: "28px", borderRadius: "inherit",
            background: "rgba(128,128,128,0.05)", border: "1px solid rgba(128,128,128,0.12)",
            transition: "border-color 0.2s, transform 0.2s",
          }}>
            {item.icon && (
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px", marginBottom: "16px",
                background: "rgba(128,128,128,0.1)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "22px",
              }}>
                {item.icon}
              </div>
            )}
            <h3 style={{ fontSize: "1.15em", fontWeight: 700, marginBottom: "8px" }}>
              {item.title}
            </h3>
            <p style={{ fontSize: "0.875em", opacity: 0.6, lineHeight: 1.6 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
