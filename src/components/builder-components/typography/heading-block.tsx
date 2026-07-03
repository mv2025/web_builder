interface HeadingBlockProps {
  text?: string
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  gradient?: boolean
  gradientFrom?: string
  gradientTo?: string
  align?: "left" | "center" | "right"
  breakpoint?: "desktop" | "tablet" | "mobile"
  // Style overrides forwarded from the ComponentRenderer wrapper. When the
  // user edits fontSize / fontWeight / lineHeight / letterSpacing in the
  // Style panel, those values arrive here and take precedence over the
  // level-based defaults so the tag actually reflects the edit.
  userFontSize?: string
  userFontWeight?: string
  userLineHeight?: string
  userLetterSpacing?: string
  userColor?: string
  userTextAlign?: string
  [key: string]: unknown
}

const HEADING_SIZES: Record<string, Record<string, string>> = {
  desktop: { h1: "72px", h2: "52px", h3: "36px", h4: "28px", h5: "20px", h6: "18px" },
  tablet:  { h1: "48px", h2: "38px", h3: "28px", h4: "24px", h5: "18px", h6: "16px" },
  mobile:  { h1: "36px", h2: "28px", h3: "24px", h4: "20px", h5: "16px", h6: "14px" },
}

export function HeadingBlock({
  text = "Your Heading",
  level = "h2",
  gradient = false,
  gradientFrom = "#0ea5e9",
  gradientTo = "#d946ef",
  align,
  breakpoint = "desktop",
  userFontSize,
  userFontWeight,
  userLineHeight,
  userLetterSpacing,
  userColor,
  userTextAlign,
}: HeadingBlockProps) {
  const Tag = level
  const sizeMap = HEADING_SIZES[breakpoint] ?? HEADING_SIZES.desktop

  return (
    <Tag style={{
      fontSize: userFontSize ?? sizeMap[level],
      fontWeight: userFontWeight ?? 800,
      lineHeight: userLineHeight ?? 1.1,
      letterSpacing: userLetterSpacing ?? "-0.02em",
      textAlign: (userTextAlign as React.CSSProperties["textAlign"]) ?? align ?? "inherit",
      margin: 0,
      ...(gradient ? {
        backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
      } : { color: userColor ?? "inherit" }),
    }}>
      {text}
    </Tag>
  )
}
