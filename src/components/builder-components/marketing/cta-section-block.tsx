interface CTASectionBlockProps {
  heading?: string
  subtext?: string
  ctaText?: string
  ctaHref?: string
  variant?: "gradient" | "border" | "minimal"
  breakpoint?: string
  [key: string]: unknown
}

export function CTASectionBlock({
  heading = "Ready to get started?",
  subtext = "Join 50,000+ teams already building with VisualCraft.",
  ctaText = "Start Building Free",
  ctaHref = "#",
  breakpoint = "desktop",
}: CTASectionBlockProps) {
  const isMobile = breakpoint === "mobile"
  return (
    <section style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "relative", maxWidth: "680px", margin: "0 auto",
        padding: isMobile ? "40px 16px" : "80px 32px", textAlign: "center",
        background: "rgba(128,128,128,0.04)", border: "1px solid rgba(128,128,128,0.15)",
        borderRadius: "inherit",
      }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          {heading}
        </h2>
        <p style={{ fontSize: "1.1em", opacity: 0.5, marginBottom: "40px" }}>{subtext}</p>
        <a href={ctaHref} style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "16px 40px", borderRadius: "9999px", textDecoration: "none",
          background: "currentColor",
          fontWeight: 700, fontSize: "inherit",
        }}>
          <span style={{ color: "#fff", mixBlendMode: "difference" }}>{ctaText} →</span>
        </a>
      </div>
    </section>
  )
}
