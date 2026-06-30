import type { DesignTokens } from "@/types"

export const defaultDesignTokens: DesignTokens = {
  colors: {
    primary: {
      50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc",
      400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1",
      800: "#075985", 900: "#0c4a6e", 950: "#082f49",
    },
    secondary: {
      50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc",
      400: "#e879f9", 500: "#d946ef", 600: "#c026d3", 700: "#a21caf",
      800: "#86198f", 900: "#701a75", 950: "#4a044e",
    },
    accent: {
      50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74",
      400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c",
      800: "#9a3412", 900: "#7c2d12", 950: "#431407",
    },
    neutral: {
      50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8",
      400: "#a1a1aa", 500: "#71717a", 600: "#52525b", 700: "#3f3f46",
      800: "#27272a", 900: "#18181b", 950: "#09090b",
    },
    success: {
      50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac",
      400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d",
      800: "#166534", 900: "#14532d", 950: "#052e16",
    },
    warning: {
      50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047",
      400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207",
      800: "#854d0e", 900: "#713f12", 950: "#422006",
    },
    error: {
      50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af",
      400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c",
      800: "#9f1239", 900: "#881337", 950: "#4c0519",
    },
    background: "#09090b",
    foreground: "#fafafa",
    muted: "#27272a",
    mutedForeground: "#a1a1aa",
    border: "#27272a",
  },
  typography: {
    fontFamilySans: "Inter, system-ui, sans-serif",
    fontFamilyMono: "JetBrains Mono, monospace",
    fontFamilySerif: "Playfair Display, Georgia, serif",
    baseFontSize: "16px",
    scaleRatio: 1.25,
  },
  spacing: {
    "0": "0px", "1": "4px", "2": "8px", "3": "12px", "4": "16px",
    "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px",
    "16": "64px", "20": "80px", "24": "96px", "32": "128px",
  },
  radii: {
    none: "0px", sm: "4px", md: "8px", lg: "12px",
    xl: "16px", "2xl": "24px", full: "9999px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
    glow: "0 0 20px 4px rgb(14 165 233 / 0.4)",
    neon: "0 0 30px 6px rgb(217 70 239 / 0.5)",
    glass: "0 8px 32px 0 rgb(0 0 0 / 0.37)",
  },
  breakpoints: {
    tablet: 768,
    mobile: 480,
  },
}
