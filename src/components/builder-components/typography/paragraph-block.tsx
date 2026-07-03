import type * as React from "react"

interface ParagraphBlockProps {
  text?: string
  size?: "sm" | "md" | "lg" | "xl"
  align?: "left" | "center" | "right"
  breakpoint?: "desktop" | "tablet" | "mobile"
  // Style overrides forwarded from the ComponentRenderer wrapper so that
  // edits in the Style panel actually reach the <p> element instead of being
  // overridden by the hard-coded size prop.
  userFontSize?: string
  userFontWeight?: string
  userLineHeight?: string
  userLetterSpacing?: string
  userColor?: string
  userTextAlign?: string
  userOpacity?: string
  [key: string]: unknown
}

const PARA_SIZES: Record<string, Record<string, string>> = {
  desktop: { sm: "14px", md: "16px", lg: "18px", xl: "20px" },
  tablet:  { sm: "13px", md: "15px", lg: "16px", xl: "18px" },
  mobile:  { sm: "12px", md: "14px", lg: "15px", xl: "16px" },
}

export function ParagraphBlock({
  text = "Your paragraph text goes here. Double-click to edit.",
  size = "md",
  align,
  breakpoint = "desktop",
  userFontSize,
  userFontWeight,
  userLineHeight,
  userLetterSpacing,
  userColor,
  userTextAlign,
  userOpacity,
}: ParagraphBlockProps) {
  const sizeMap = PARA_SIZES[breakpoint] ?? PARA_SIZES.desktop
  return (
    <p style={{
      fontSize: userFontSize ?? sizeMap[size],
      fontWeight: userFontWeight,
      color: userColor ?? "inherit",
      lineHeight: userLineHeight ?? 1.7,
      letterSpacing: userLetterSpacing,
      textAlign: (userTextAlign as React.CSSProperties["textAlign"]) ?? align ?? "inherit",
      margin: 0,
      opacity: userOpacity !== undefined ? parseFloat(userOpacity) : 0.8,
    }}>
      {text}
    </p>
  )
}
