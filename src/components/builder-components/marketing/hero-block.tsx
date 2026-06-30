"use client"

interface HeroBlockProps {
  heading?: string
  subheading?: string
  ctaText?: string
  ctaHref?: string
  badge?: string
  variant?: "gradient" | "minimal" | "split" | "video"
  breakpoint?: string
  [key: string]: unknown
}

export function HeroBlock({
  heading = "Build Anything",
  subheading = "The ultimate platform for building beautiful websites without code.",
  ctaText = "Get Started Free",
  ctaHref = "#",
  badge,
  variant = "gradient",
}: HeroBlockProps) {
  return (
    <section style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      {variant === "gradient" && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "20%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(217,70,239,0.1) 0%, transparent 65%)", filter: "blur(60px)" }} />
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        {/* Badge */}
        {badge && (
          <div style={{ marginBottom: "24px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "6px 16px", borderRadius: "9999px",
              background: "rgba(128,128,128,0.1)", border: "1px solid rgba(128,128,128,0.2)",
              fontSize: "0.8em", fontWeight: 600,
            }}>
              {badge}
            </span>
          </div>
        )}

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.05,
          letterSpacing: "-0.03em", marginBottom: "20px",
          color: "inherit",
        }}>
          {heading}
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)", opacity: 0.6, lineHeight: 1.7,
          maxWidth: "600px", margin: "0 auto 40px",
        }}>
          {subheading}
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={ctaHref} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 32px", borderRadius: "9999px", textDecoration: "none",
            background: "currentColor",
            fontWeight: 700, fontSize: "inherit",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}>
            <span style={{ color: "#fff", mixBlendMode: "difference" }}>{ctaText} →</span>
          </a>
          <a href="#" style={{
            display: "inline-flex", alignItems: "center",
            padding: "14px 32px", borderRadius: "9999px", textDecoration: "none",
            background: "rgba(128,128,128,0.1)", border: "1px solid rgba(128,128,128,0.2)",
            color: "inherit", fontWeight: 600, fontSize: "inherit",
          }}>
            Watch Demo ▶
          </a>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop: "48px", display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", opacity: 0.5 }}>
          {["No credit card", "Free forever plan", "Cancel anytime"].map((t) => (
            <span key={t} style={{ fontSize: "0.8em", display: "flex", alignItems: "center", gap: "6px" }}>
              ✓ {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
