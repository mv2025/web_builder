import { LucideIcon } from "@/lib/lucide-icon"

interface ButtonBlockProps {
  text?: string
  href?: string
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient"
  size?: "sm" | "md" | "lg"
  type?: string
  subtext?: string
  icon?: string
  iconPosition?: "left" | "right"
  gradientFrom?: string
  gradientTo?: string
  gradientAngle?: string
  wrapperStyles?: React.CSSProperties
  [key: string]: unknown
}

export function ButtonBlock({
  text = "Click Me",
  href = "#",
  variant = "primary",
  size = "md",
  type,
  subtext,
  icon,
  iconPosition = "left",
  gradientFrom = "#0ea5e9",
  gradientTo = "#8b5cf6",
  gradientAngle = "135",
  wrapperStyles = {},
}: ButtonBlockProps) {
  const sizeMap = {
    sm: { padding: "8px 18px", fontSize: "0.85em", gap: "6px", iconSize: 14 },
    md: { padding: "11px 24px", fontSize: "inherit", gap: "8px", iconSize: 16 },
    lg: { padding: "14px 32px", fontSize: "1.1em", gap: "10px", iconSize: 18 },
  }

  const s = sizeMap[size]

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--accent, #0ea5e9)",
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: "rgba(128,128,128,0.15)",
      color: "inherit",
      border: "none",
    },
    outline: {
      background: "transparent",
      color: "inherit",
      border: "2px solid currentColor",
    },
    ghost: {
      background: "transparent",
      color: "inherit",
      border: "none",
    },
    gradient: {
      background: `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})`,
      color: "#fff",
      border: "none",
    },
  }

  const isCTA = type === "cta-button"
  const isIconBtn = type === "icon-button"

  const iconEl = icon ? <LucideIcon name={icon} size={isIconBtn ? s.iconSize + 4 : s.iconSize} /> : null

  if (isIconBtn) {
    return (
      <a
        href={href}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "100%", height: "100%", minWidth: "40px", minHeight: "40px",
          boxSizing: "border-box", textDecoration: "none", cursor: "pointer",
          borderRadius: "inherit", fontFamily: "inherit",
          ...variantStyles[variant],
          ...wrapperStyles,
        }}
      >
        {iconEl ?? <LucideIcon name="arrow-right" size={s.iconSize + 4} />}
      </a>
    )
  }

  if (isCTA && subtext) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "100%", height: "100%", borderRadius: "inherit" }}>
        <a
          href={href}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            gap: s.gap,
            width: "100%", boxSizing: "border-box",
            textDecoration: "none", fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", borderRadius: "inherit",
            transition: "opacity 0.2s, transform 0.15s",
            padding: "14px 36px",
            fontSize: "inherit",
            ...variantStyles[variant],
            ...wrapperStyles,
          }}
        >
          {iconPosition === "left" && iconEl}
          <span>{text}</span>
          {iconPosition === "right" && iconEl}
        </a>
        <span style={{ fontSize: "0.75em", opacity: 0.5 }}>{subtext}</span>
      </div>
    )
  }

  return (
    <a
      href={href}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: s.gap,
        width: "100%", height: "100%", boxSizing: "border-box",
        textDecoration: "none", fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", borderRadius: "inherit",
        transition: "opacity 0.2s, transform 0.15s",
        padding: isCTA ? "14px 36px" : s.padding,
        fontSize: isCTA ? "inherit" : s.fontSize,
        ...variantStyles[variant],
        ...wrapperStyles,
      }}
    >
      {iconPosition === "left" && iconEl}
      <span>{text}</span>
      {iconPosition === "right" && iconEl}
    </a>
  )
}
