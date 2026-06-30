interface ParagraphBlockProps {
  text?: string
  size?: "sm" | "md" | "lg" | "xl"
  align?: "left" | "center" | "right"
  breakpoint?: "desktop" | "tablet" | "mobile"
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
}: ParagraphBlockProps) {
  const sizeMap = PARA_SIZES[breakpoint] ?? PARA_SIZES.desktop
  return (
    <p style={{ fontSize: sizeMap[size], color: "inherit", lineHeight: 1.7, textAlign: align ?? "inherit", margin: 0, opacity: 0.8 }}>
      {text}
    </p>
  )
}
