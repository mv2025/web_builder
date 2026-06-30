"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--fg)", overflow: "hidden", position: "relative" }}>
      {/* Top nav with theme toggle */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #0ea5e9, #d946ef)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#fff" }}>V</div>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)" }}>VisualCraft</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle variant="pill" size="sm" />
          <Link href="/dashboard" style={{ padding: "8px 16px", borderRadius: "8px", textDecoration: "none", color: "var(--fg-muted)", fontSize: "14px" }}>Dashboard</Link>
          <Link href="/editor" style={{ padding: "8px 16px", borderRadius: "8px", textDecoration: "none", background: "var(--accent-muted)", color: "var(--accent)", fontSize: "14px", fontWeight: 600, border: "1px solid var(--accent-border)" }}>
            Open Editor
          </Link>
        </div>
      </nav>

      {/* Background gradient orbs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, var(--hero-gradient-from) 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, var(--hero-gradient-to) 0%, transparent 70%)`, filter: "blur(40px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "800px", padding: "48px 24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", marginBottom: "32px", background: "var(--badge-bg)", border: "1px solid var(--badge-border)", fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>
          <span>🚀</span> Now in Public Beta
        </div>

        <h1 style={{ fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "24px", background: "var(--hero-heading)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Build Websites<br />
          <span style={{ background: "linear-gradient(135deg, #0ea5e9, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Without Code
          </span>
        </h1>

        <p style={{ fontSize: "20px", color: "var(--fg-faint)", lineHeight: 1.6, marginBottom: "48px", maxWidth: "600px", margin: "0 auto 48px" }}>
          The most powerful visual website builder. Drag, drop, animate, and publish — all in your browser. Framer meets Webflow meets Figma.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/editor" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", borderRadius: "9999px", textDecoration: "none", background: "linear-gradient(135deg, #0ea5e9, #0284c7)", color: "#fff", fontWeight: 700, fontSize: "16px", boxShadow: "0 0 30px var(--accent-glow)" }}>
            Open Editor →
          </Link>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", borderRadius: "9999px", textDecoration: "none", background: "var(--hero-secondary-bg)", border: "1px solid var(--hero-secondary-border)", color: "var(--fg)", fontWeight: 600, fontSize: "16px" }}>
            Dashboard
          </Link>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginTop: "64px" }}>
          {["Drag & Drop", "GSAP Animations", "Three.js 3D", "Responsive Design", "Code Export", "Real-time Preview", "Component Library", "AI-Ready"].map((f) => (
            <span key={f} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "13px", background: "var(--pill-bg)", border: "1px solid var(--pill-border)", color: "var(--fg-muted)" }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
