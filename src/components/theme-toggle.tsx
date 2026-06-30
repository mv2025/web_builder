"use client"

import { useThemeStore } from "@/stores/theme-store"

interface ThemeToggleProps {
  variant?: "icon" | "pill" | "switch"
  size?: "sm" | "md"
}

export function ThemeToggle({ variant = "icon", size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === "dark"

  if (variant === "switch") {
    return (
      <button
        onClick={toggleTheme}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: size === "sm" ? "3px" : "4px",
          borderRadius: "9999px", border: "none", cursor: "pointer",
          background: "var(--toggle-bg)",
          width: size === "sm" ? "44px" : "52px",
          height: size === "sm" ? "24px" : "28px",
          position: "relative",
          transition: "background 0.3s",
        }}
      >
        <div style={{
          width: size === "sm" ? "18px" : "20px",
          height: size === "sm" ? "18px" : "20px",
          borderRadius: "50%",
          background: "var(--toggle-knob)",
          position: "absolute",
          left: isDark ? (size === "sm" ? "23px" : "28px") : (size === "sm" ? "3px" : "4px"),
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size === "sm" ? "10px" : "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}>
          {isDark ? "🌙" : "☀️"}
        </div>
      </button>
    )
  }

  if (variant === "pill") {
    return (
      <button
        onClick={toggleTheme}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: size === "sm" ? "5px 10px" : "7px 14px",
          borderRadius: "9999px", border: "none", cursor: "pointer",
          background: "var(--toggle-bg)",
          color: "var(--fg)",
          fontSize: size === "sm" ? "12px" : "13px",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
      >
        <span style={{ fontSize: size === "sm" ? "12px" : "14px" }}>
          {isDark ? "🌙" : "☀️"}
        </span>
        {isDark ? "Dark" : "Light"}
      </button>
    )
  }

  // icon variant (default)
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size === "sm" ? "32px" : "36px",
        height: size === "sm" ? "32px" : "36px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: "var(--toggle-bg)",
        color: "var(--fg)",
        fontSize: size === "sm" ? "16px" : "18px",
        transition: "all 0.2s",
      }}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  )
}
