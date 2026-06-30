"use client"

import { useState } from "react"

interface AccordionItem {
  title: string
  content: string
  headerBg?: string
  headerColor?: string
  contentBg?: string
  contentColor?: string
}

interface AccordionBlockProps {
  items?: AccordionItem[]
  allowMultiple?: boolean
  headerBg?: string
  headerColor?: string
  headerPadding?: string
  headerFontSize?: string
  contentBg?: string
  contentColor?: string
  contentPadding?: string
  contentFontSize?: string
  borderColor?: string
  borderRadius?: string
  gap?: string
  iconStyle?: "plus" | "arrow" | "chevron" | "none"
  [key: string]: unknown
}

export function AccordionBlock({
  items = [
    { title: "What is VisualCraft?", content: "A visual website builder that lets you create stunning websites without writing a single line of code." },
    { title: "How does it work?", content: "Drag and drop components from the library onto the canvas, customize everything visually, and publish with one click." },
  ],
  allowMultiple = false,
  headerBg = "", headerColor = "", headerPadding = "16px 20px", headerFontSize = "",
  contentBg = "", contentColor = "", contentPadding = "0 20px 16px", contentFontSize = "0.9em",
  borderColor = "rgba(128,128,128,0.15)", borderRadius = "",
  gap = "8px", iconStyle = "plus",
}: AccordionBlockProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggle = (i: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])
    } else {
      setOpenIndexes((prev) => prev.includes(i) ? [] : [i])
    }
  }

  const getIcon = (isOpen: boolean) => {
    if (iconStyle === "none") return null
    const style: React.CSSProperties = { transition: "transform 0.2s", opacity: 0.4, flexShrink: 0, marginLeft: "12px" }
    if (iconStyle === "arrow") return <span style={{ ...style, transform: isOpen ? "rotate(90deg)" : "rotate(0)" }}>▶</span>
    if (iconStyle === "chevron") return <span style={{ ...style, transform: isOpen ? "rotate(180deg)" : "rotate(0)", fontSize: "0.8em" }}>▼</span>
    return <span style={{ ...style, transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}>+</span>
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap, width: "100%" }}>
      {items.map((item, i) => {
        const isOpen = openIndexes.includes(i)
        const itemHeaderBg = item.headerBg || headerBg
        const itemHeaderColor = item.headerColor || headerColor
        const itemContentBg = item.contentBg || contentBg
        const itemContentColor = item.contentColor || contentColor

        return (
          <div key={i} style={{
            borderRadius: borderRadius || "inherit",
            border: `1px solid ${isOpen ? (itemHeaderColor || "currentColor") : borderColor}`,
            overflow: "hidden",
          }}>
            <button
              onClick={() => toggle(i)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: headerPadding, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontWeight: 600, textAlign: "left",
                background: itemHeaderBg || "none",
                color: itemHeaderColor || "inherit",
                fontSize: headerFontSize || "inherit",
                opacity: isOpen ? 1 : 0.8,
              }}
            >
              {item.title}
              {getIcon(isOpen)}
            </button>
            {isOpen && (
              <div style={{
                padding: contentPadding, lineHeight: 1.7,
                background: itemContentBg || "none",
                color: itemContentColor || "inherit",
                fontSize: contentFontSize || "0.9em",
                opacity: itemContentColor ? 1 : 0.7,
              }}>
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
