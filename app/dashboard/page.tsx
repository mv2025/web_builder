"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

const TEMPLATES = [
  { name: "SaaS Landing", description: "Complete SaaS homepage with pricing, features, FAQ", gradient: "135deg, #0ea5e9, #0284c7", icon: "🚀" },
  { name: "Portfolio", description: "Clean portfolio with case studies and contact", gradient: "135deg, #d946ef, #a21caf", icon: "🎨" },
  { name: "Agency", description: "Modern agency site with team, services, and testimonials", gradient: "135deg, #f97316, #ea580c", icon: "💼" },
  { name: "Startup", description: "High-converting startup landing page with 3D hero", gradient: "135deg, #22c55e, #15803d", icon: "⚡" },
  { name: "Personal Brand", description: "Minimal personal branding site with blog", gradient: "135deg, #fbbf24, #d97706", icon: "✍" },
  { name: "E-commerce", description: "Product showcase landing page with bento grid", gradient: "135deg, #0ea5e9, #d946ef", icon: "🛍" },
]

export default function DashboardPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--divider)", padding: "0 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #0ea5e9, #d946ef)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#fff" }}>V</div>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)" }}>VisualCraft</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle variant="switch" size="sm" />
            <Link href="/" style={{ padding: "8px 16px", borderRadius: "8px", textDecoration: "none", color: "var(--fg-muted)", fontSize: "14px" }}>Home</Link>
            <Link href="/editor" style={{ padding: "8px 16px", borderRadius: "8px", textDecoration: "none", background: "var(--accent-muted)", color: "var(--accent)", fontSize: "14px", fontWeight: 600, border: "1px solid var(--accent-border)" }}>
              Open Editor
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 40px" }}>
        {/* Hero */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "8px", color: "var(--fg)" }}>Your Projects</h1>
          <p style={{ color: "var(--fg-faint)", fontSize: "16px" }}>Create, manage, and publish your websites.</p>
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          <Link href="/editor" style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "12px", padding: "32px 24px", borderRadius: "16px", textDecoration: "none",
            border: "2px dashed var(--accent-border)", background: "var(--accent-muted)",
            color: "var(--accent)", textAlign: "center", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: "36px" }}>+</div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>New Project</div>
              <div style={{ fontSize: "12px", color: "var(--fg-faint)" }}>Start from scratch</div>
            </div>
          </Link>
        </div>

        {/* Templates section */}
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px", color: "var(--fg)" }}>Templates</h2>
          <p style={{ color: "var(--fg-faint)", fontSize: "14px", marginBottom: "24px" }}>Start with a professionally designed template</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {TEMPLATES.map((template) => (
              <Link key={template.name} href="/editor" style={{ textDecoration: "none" }}>
                <div style={{
                  borderRadius: "16px", overflow: "hidden",
                  border: "1px solid var(--card-border)",
                  background: "var(--card-bg)",
                  transition: "transform 0.2s, border-color 0.2s",
                  cursor: "pointer",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.transform = "translateY(-2px)"; el.style.borderColor = "var(--card-hover-border)" }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.transform = "translateY(0)"; el.style.borderColor = "var(--card-border)" }}
                >
                  {/* Thumbnail */}
                  <div style={{ height: "160px", background: `linear-gradient(${template.gradient})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                    {template.icon}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "20px" }}>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)", marginBottom: "6px" }}>{template.name}</div>
                    <div style={{ fontSize: "13px", color: "var(--fg-faint)", lineHeight: 1.5, marginBottom: "16px" }}>{template.description}</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", background: "var(--accent-muted)", color: "var(--accent)", fontWeight: 600 }}>
                        Use Template
                      </span>
                      <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", background: "var(--pill-bg)", color: "var(--fg-muted)" }}>
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Feature highlights */}
        <div style={{ marginTop: "80px", padding: "40px", borderRadius: "24px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px", textAlign: "center", color: "var(--fg)" }}>Everything in one place</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {[
              { icon: "⚡", label: "GSAP Animations", desc: "60fps scroll & hover effects" },
              { icon: "🌐", label: "Three.js 3D", desc: "Interactive 3D components" },
              { icon: "📱", label: "Responsive", desc: "Perfect on every screen" },
              { icon: "📦", label: "Code Export", desc: "React, Next.js, or HTML" },
            ].map((f) => (
              <div key={f.label} style={{ textAlign: "center", padding: "16px" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{f.icon}</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "4px" }}>{f.label}</div>
                <div style={{ fontSize: "12px", color: "var(--fg-faint)" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
