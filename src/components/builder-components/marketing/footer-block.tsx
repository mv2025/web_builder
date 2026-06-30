interface FooterLink { label: string; href: string }
interface FooterSection { title: string; links: FooterLink[] }

interface FooterBlockProps {
  brand?: string
  tagline?: string
  sections?: FooterSection[]
  copyright?: string
  socials?: { platform: string; href: string }[]
  breakpoint?: string
  [key: string]: unknown
}

const DEFAULT_SECTIONS: FooterSection[] = [
  { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "Templates", href: "#" }, { label: "Changelog", href: "#" }] },
  { title: "Resources", links: [{ label: "Documentation", href: "#" }, { label: "Tutorials", href: "#" }, { label: "Blog", href: "#" }, { label: "Community", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
]

export function FooterBlock({
  brand = "VisualCraft",
  tagline = "Build stunning websites without code.",
  sections = DEFAULT_SECTIONS,
  copyright = "© 2025 VisualCraft. All rights reserved.",
  breakpoint = "desktop",
}: FooterBlockProps) {
  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"
  return (
    <footer style={{ width: "100%", borderTop: "1px solid rgba(128,128,128,0.2)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? "32px" : "48px", marginBottom: isMobile ? "32px" : "48px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "currentColor", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800 }}>
                <span style={{ color: "#fff", mixBlendMode: "difference" }}>V</span>
              </div>
              <span style={{ fontWeight: 700 }}>{brand}</span>
            </div>
            <p style={{ fontSize: "0.875em", opacity: 0.5, lineHeight: 1.6, maxWidth: "220px" }}>{tagline}</p>
          </div>

          {/* Link sections */}
          {sections.map((section, i) => (
            <div key={i}>
              <h4 style={{ fontSize: "0.75em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.4, marginBottom: "16px" }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href} style={{ fontSize: "0.875em", color: "inherit", opacity: 0.6, textDecoration: "none", transition: "opacity 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "1" }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6" }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(128,128,128,0.2)", paddingTop: "24px", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "space-between", flexDirection: isMobile ? "column" as const : "row" as const, gap: isMobile ? "12px" : "0" }}>
          <span style={{ fontSize: "0.8em", opacity: 0.4 }}>{copyright}</span>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Twitter", "GitHub", "Discord"].map((s) => (
              <a key={s} href="#" style={{ fontSize: "0.8em", color: "inherit", opacity: 0.4, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8" }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.4" }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
