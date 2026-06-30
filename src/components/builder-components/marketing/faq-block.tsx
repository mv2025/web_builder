"use client"

import { useState } from "react"

interface FAQItem { question: string; answer: string }

interface FAQBlockProps {
  heading?: string
  items?: FAQItem[]
  breakpoint?: string
  [key: string]: unknown
}

const DEFAULT_ITEMS: FAQItem[] = [
  { question: "Do I need to know how to code?", answer: "Not at all! VisualCraft is designed for everyone — designers, marketers, and founders — without any coding knowledge required." },
  { question: "Can I export my website?", answer: "Yes! Export as React, Next.js, or plain HTML. Your code is clean, readable, and production-ready." },
  { question: "Is it free to get started?", answer: "Yes, our Free plan includes 5 projects and access to all core features. Upgrade when you need more." },
  { question: "Can I use custom fonts and colors?", answer: "Absolutely. The design token system lets you set global fonts, colors, spacing, and more that apply across your entire project." },
]

export function FAQBlock({
  heading = "Frequently Asked Questions",
  items = DEFAULT_ITEMS,
}: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section style={{ width: "100%", maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
          {heading}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            borderRadius: "inherit",
            background: openIndex === i ? "rgba(128,128,128,0.06)" : "rgba(128,128,128,0.03)",
            border: openIndex === i ? "2px solid currentColor" : "1px solid rgba(128,128,128,0.15)",
            overflow: "hidden",
          }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px 24px", background: "none", border: "none", cursor: "pointer",
                fontSize: "inherit", fontFamily: "inherit", fontWeight: 600, color: "inherit",
                textAlign: "left", opacity: openIndex === i ? 1 : 0.8,
              }}
            >
              {item.question}
              <span style={{ opacity: 0.4, transition: "transform 0.2s", transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: "16px" }}>+</span>
            </button>
            {openIndex === i && (
              <div style={{ padding: "0 24px 20px", fontSize: "0.95em", opacity: 0.7, lineHeight: 1.7 }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
