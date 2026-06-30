"use client"

import { useState, useEffect, useCallback } from "react"

// ── Slider / Carousel ────────────────────────────────────────────────────────
interface SliderProps {
  slides?: { src: string; alt?: string; caption?: string }[]
  autoplay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
}

export function SliderBlock({ slides = [], autoplay = true, interval = 4000, showDots = true, showArrows = true }: SliderProps) {
  const [current, setCurrent] = useState(0)
  const total = slides.length

  const next = useCallback(() => setCurrent(i => (i + 1) % Math.max(total, 1)), [total])
  const prev = useCallback(() => setCurrent(i => (i - 1 + Math.max(total, 1)) % Math.max(total, 1)), [total])

  useEffect(() => {
    if (!autoplay || total <= 1) return
    const t = setInterval(next, interval)
    return () => clearInterval(t)
  }, [autoplay, interval, total, next])

  if (total === 0) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "200px", borderRadius: "inherit", overflow: "hidden", background: "rgba(128,128,128,0.06)", border: "1px solid rgba(128,128,128,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3}>
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
        </svg>
        <div style={{ opacity: 0.4, fontSize: "0.85em" }}>Add slides via content panel</div>
      </div>
    )
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "200px", borderRadius: "inherit", overflow: "hidden" }}>
      {/* Each slide is absolutely positioned; translateX slides them left/right */}
      {slides.map((slide, i) => (
        <div
          key={i}
          style={{
            position: i === 0 ? "relative" as const : "absolute" as const,
            top: 0, left: 0, width: "100%", height: i === 0 ? "auto" : "100%",
            transform: `translateX(${(i - current) * 100}%)`,
            transition: "transform 0.5s ease",
            zIndex: 1,
          }}
        >
          {slide.src ? (
            <img src={slide.src} alt={slide.alt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", minHeight: "200px", background: "rgba(128,128,128,0.06)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
              Slide {i + 1}
            </div>
          )}
          {slide.caption && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))", color: "#fff", fontSize: "0.9em", zIndex: 2 }}>
              {slide.caption}
            </div>
          )}
        </div>
      ))}

      {showArrows && total > 1 && (
        <>
          <button onClick={prev} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.4)", color: "#fff", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
            ‹
          </button>
          <button onClick={next} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.4)", color: "#fff", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
            ›
          </button>
        </>
      )}

      {showDots && total > 1 && (
        <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 3 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: "8px", height: "8px", borderRadius: "50%", border: "none", padding: 0, cursor: "pointer", background: i === current ? "#fff" : "rgba(255,255,255,0.4)", transition: "background 0.2s" }} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Carousel (image carousel) ────────────────────────────────────────────────
interface CarouselProps {
  items?: { src: string; alt?: string }[]
  autoplay?: boolean
  interval?: number
}

export function CarouselBlock({ items = [], autoplay = true, interval = 3000 }: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const total = items.length

  const next = useCallback(() => setCurrent(i => (i + 1) % Math.max(total, 1)), [total])
  const prev = useCallback(() => setCurrent(i => (i - 1 + Math.max(total, 1)) % Math.max(total, 1)), [total])

  useEffect(() => {
    if (!autoplay || total <= 1) return
    const t = setInterval(next, interval)
    return () => clearInterval(t)
  }, [autoplay, interval, total, next])

  if (total === 0) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "200px", borderRadius: "inherit", overflow: "hidden", background: "rgba(128,128,128,0.06)", border: "1px solid rgba(128,128,128,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3}>
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
        </svg>
        <div style={{ opacity: 0.4, fontSize: "0.85em" }}>Add items via content panel</div>
      </div>
    )
  }

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: "inherit", overflow: "hidden" }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            ...(i === 0
              ? { position: "relative" as const, width: "100%" }
              : { position: "absolute" as const, top: 0, left: 0, width: "100%", height: "100%" }),
            transform: `translateX(${(i - current) * 100}%)`,
            transition: "transform 0.5s ease",
            zIndex: 1,
          }}
        >
          {item.src ? (
            <img src={item.src} alt={item.alt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", aspectRatio: "16/9", background: "rgba(128,128,128,0.06)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
              Item {i + 1}
            </div>
          )}
        </div>
      ))}

      {total > 1 && (
        <>
          <button onClick={prev} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.4)", color: "#fff", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
            ‹
          </button>
          <button onClick={next} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.4)", color: "#fff", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
            ›
          </button>
          <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 3 }}>
            {items.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: "8px", height: "8px", borderRadius: "50%", border: "none", padding: 0, cursor: "pointer", background: i === current ? "#fff" : "rgba(255,255,255,0.4)", transition: "background 0.2s" }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Card Slider ─────────────────────────────────────────────────────────────
interface CardSliderCard {
  image?: string
  title?: string
  description?: string
  buttonText?: string
  buttonUrl?: string
}

interface CardSliderProps {
  cards?: CardSliderCard[]
  autoplay?: boolean
  interval?: number
  visibleCards?: number
  gap?: number
  cardBg?: string
  cardBorderRadius?: string
  accentColor?: string
  breakpoint?: string
  totalOverride?: number
  renderCard?: (index: number) => React.ReactNode
}

export function CardSliderBlock({
  cards = [],
  autoplay = false,
  interval = 4000,
  visibleCards = 3,
  gap = 16,
  cardBg = "rgba(255,255,255,0.08)",
  cardBorderRadius = "16px",
  accentColor = "#3b82f6",
  breakpoint = "desktop",
  totalOverride,
  renderCard,
}: CardSliderProps) {
  const [offset, setOffset] = useState(0)
  const total = totalOverride ?? cards.length
  const responsiveVisible = breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? Math.min(2, visibleCards) : visibleCards
  const visible = Math.min(responsiveVisible, total || 1)
  const maxOffset = Math.max(total - visible, 0)

  const next = useCallback(() => setOffset(o => Math.min(o + 1, maxOffset)), [maxOffset])
  const prev = useCallback(() => setOffset(o => Math.max(o - 1, 0)), [])

  useEffect(() => {
    setOffset(o => Math.min(o, maxOffset))
  }, [maxOffset])

  useEffect(() => {
    if (!autoplay || total <= visible) return
    const t = setInterval(() => {
      setOffset(o => o >= maxOffset ? 0 : o + 1)
    }, interval)
    return () => clearInterval(t)
  }, [autoplay, interval, total, visible, maxOffset])

  if (total === 0) {
    const placeholders: CardSliderCard[] = [
      { image: "", title: "David Doll", description: "The lorem text the section contains header having open and close functionality.", buttonText: "View More" },
      { image: "", title: "Rose Bush", description: "The lorem text the section contains header having open and close functionality.", buttonText: "View More" },
      { image: "", title: "Jones Goi", description: "The lorem text the section contains header having open and close functionality.", buttonText: "View More" },
    ]
    return (
      <CardSliderInner
        cards={placeholders}
        offset={0}
        visible={3}
        gap={gap}
        cardBg={cardBg}
        cardBorderRadius={cardBorderRadius}
        accentColor={accentColor}
        total={3}
        maxOffset={0}
        onPrev={() => {}}
        onNext={() => {}}
        showArrows={false}
        showDots={false}
      />
    )
  }

  return (
    <CardSliderInner
      cards={cards}
      offset={offset}
      visible={visible}
      gap={gap}
      cardBg={cardBg}
      cardBorderRadius={cardBorderRadius}
      accentColor={accentColor}
      total={total}
      maxOffset={maxOffset}
      onPrev={prev}
      onNext={next}
      showArrows={total > visible}
      showDots={total > visible}
      onDotClick={(i: number) => setOffset(i)}
      renderCard={renderCard}
    />
  )
}

function CardSliderInner({
  cards, offset, visible, gap, cardBg, cardBorderRadius, accentColor,
  total, maxOffset, onPrev, onNext, showArrows, showDots, onDotClick, renderCard,
}: {
  cards: CardSliderCard[]
  offset: number
  visible: number
  gap: number
  cardBg: string
  cardBorderRadius: string
  accentColor: string
  total: number
  maxOffset: number
  onPrev: () => void
  onNext: () => void
  showArrows: boolean
  showDots: boolean
  onDotClick?: (i: number) => void
  renderCard?: (index: number) => React.ReactNode
}) {
  const cardWidthPercent = 100 / visible
  const translateX = offset * cardWidthPercent

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", padding: "8px 0 40px" }}>
      {/* Arrows */}
      {showArrows && (
        <>
          <button
            onClick={onPrev}
            style={{
              position: "absolute", left: 0, top: "50%", transform: "translateY(-70%)", zIndex: 3,
              width: "36px", height: "36px", borderRadius: "50%", border: "none",
              background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer",
              fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
              opacity: offset === 0 ? 0.3 : 1, transition: "opacity 0.2s",
            }}
          >‹</button>
          <button
            onClick={onNext}
            style={{
              position: "absolute", right: 0, top: "50%", transform: "translateY(-70%)", zIndex: 3,
              width: "36px", height: "36px", borderRadius: "50%", border: "none",
              background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer",
              fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
              opacity: offset >= maxOffset ? 0.3 : 1, transition: "opacity 0.2s",
            }}
          >›</button>
        </>
      )}

      {/* Track */}
      <div
        style={{
          display: "flex",
          gap: `${gap}px`,
          transition: "transform 0.4s ease",
          transform: `translateX(calc(-${translateX}% - ${offset * gap}px))`,
        }}
      >
        {Array.from({ length: renderCard ? total : cards.length }, (_, i) => (
          <div
            key={i}
            style={{
              flex: `0 0 calc(${cardWidthPercent}% - ${gap * (visible - 1) / visible}px)`,
              ...(renderCard ? {
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
              } : {
                background: cardBg,
                borderRadius: cardBorderRadius,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid rgba(128,128,128,0.15)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }),
            }}
          >
            {renderCard ? renderCard(i) : (() => {
              const card = cards[i]
              return (
                <>
                  {/* Card image / avatar area */}
                  <div style={{
                    width: "100%", background: accentColor,
                    padding: "24px 0 32px", display: "flex", justifyContent: "center",
                    position: "relative",
                  }}>
                    <div style={{
                      width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden",
                      border: "3px solid #fff", background: "rgba(255,255,255,0.2)",
                      position: "absolute", bottom: "-40px",
                    }}>
                      {card.image ? (
                        <img src={card.image} alt={card.title ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.3)" }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card content */}
                  <div style={{ padding: "48px 20px 24px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <h4 style={{ margin: 0, fontSize: "1em", fontWeight: 700 }}>{card.title ?? "Name"}</h4>
                    <p style={{ margin: 0, fontSize: "0.8em", opacity: 0.6, lineHeight: 1.5 }}>{card.description ?? "Description text goes here."}</p>
                    {card.buttonText && (
                      <a
                        href={card.buttonUrl ?? "#"}
                        style={{
                          display: "inline-block", marginTop: "12px",
                          padding: "8px 24px", borderRadius: "20px",
                          background: accentColor, color: "#fff",
                          fontSize: "0.8em", fontWeight: 600,
                          textDecoration: "none", border: "none", cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                      >{card.buttonText}</a>
                    )}
                  </div>
                </>
              )
            })()}
          </div>
        ))}
      </div>

      {/* Dots */}
      {showDots && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "16px" }}>
          {Array.from({ length: maxOffset + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => onDotClick?.(i)}
              style={{
                width: "8px", height: "8px", borderRadius: "50%", border: "none", padding: 0, cursor: "pointer",
                background: i === offset ? accentColor : "rgba(128,128,128,0.3)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps {
  totalPages?: number
  currentPage?: number
  showPrevNext?: boolean
  showFirstLast?: boolean
  maxVisible?: number
  prevLabel?: string
  nextLabel?: string
  shape?: "square" | "rounded" | "circle"
  size?: "sm" | "md" | "lg"
  variant?: "outlined" | "filled" | "minimal"
  activeColor?: string
  align?: "left" | "center" | "right"
  onPageChange?: (page: number) => void
  [key: string]: unknown
}

export function PaginationBlock({
  totalPages = 5, currentPage = 1,
  showPrevNext = true, showFirstLast = false, maxVisible = 7,
  prevLabel = "←", nextLabel = "→", shape = "rounded", size = "md",
  variant = "outlined", activeColor = "", align = "center",
  onPageChange,
}: PaginationProps) {
  const page = currentPage

  const goTo = (p: number) => {
    if (onPageChange) onPageChange(p)
  }

  const sizeMap = { sm: { px: "4px 8px", fs: "12px", min: "28px" }, md: { px: "6px 10px", fs: "14px", min: "36px" }, lg: { px: "8px 14px", fs: "16px", min: "44px" } }
  const s = sizeMap[size]
  const radius = shape === "circle" ? "50%" : shape === "rounded" ? "6px" : "2px"
  const accentColor = activeColor || "currentColor"

  const getVisiblePages = (): (number | "...")[] => {
    if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "...")[] = [1]
    let start = Math.max(2, page - Math.floor((maxVisible - 4) / 2))
    let end = Math.min(totalPages - 1, start + maxVisible - 4)
    if (end >= totalPages - 1) start = Math.max(2, totalPages - maxVisible + 3)
    if (start > 2) pages.push("...")
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push("...")
    pages.push(totalPages)
    return pages
  }

  const btnBase: React.CSSProperties = {
    padding: s.px, borderRadius: radius, cursor: "pointer", fontSize: s.fs, fontFamily: "inherit",
    minWidth: s.min, minHeight: s.min, display: "inline-flex", alignItems: "center", justifyContent: "center",
    textDecoration: "none", transition: "all 0.15s",
    border: variant === "outlined" ? "1px solid currentColor" : "none",
    background: "none", color: "inherit", opacity: 0.6,
  }
  const activeStyle: React.CSSProperties = {
    ...btnBase,
    background: accentColor, color: accentColor === "currentColor" ? "inherit" : "#fff",
    opacity: 1, border: variant === "outlined" ? `1px solid ${accentColor}` : "none",
  }
  const disabledStyle: React.CSSProperties = { ...btnBase, opacity: 0.25, cursor: "default", pointerEvents: "none" }

  const navBtn = (label: string, target: number, disabled: boolean) => (
    <button onClick={() => { if (!disabled) goTo(target) }}
      style={disabled ? disabledStyle : btnBase} disabled={disabled}>{label}</button>
  )

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center", flexWrap: "wrap", padding: "12px 0" }}>
      {showFirstLast && navBtn("«", 1, page === 1)}
      {showPrevNext && navBtn(prevLabel, page - 1, page === 1)}
      {getVisiblePages().map((p, i) =>
        p === "..." ? <span key={`e${i}`} style={{ ...btnBase, border: "none", cursor: "default" }}>…</span> : (
          <button key={p} onClick={() => goTo(p)}
            style={p === page ? activeStyle : btnBase}>{p === page && accentColor === "currentColor"
              ? <span style={{ mixBlendMode: "difference", color: "#fff" }}>{p}</span> : p}</button>
        )
      )}
      {showPrevNext && navBtn(nextLabel, page + 1, page === totalPages)}
      {showFirstLast && navBtn("»", totalPages, page === totalPages)}
    </nav>
  )
}

// ── Sidebar Nav ──────────────────────────────────────────────────────────────
interface SidebarNavProps {
  title?: string
  links?: { text: string; href: string; active?: boolean }[]
}

export function SidebarNavBlock({ title, links = [] }: SidebarNavProps) {
  const initialActive = links.findIndex(l => l.active)
  const [active, setActive] = useState(initialActive >= 0 ? initialActive : 0)

  return (
    <div style={{ padding: "0 16px" }}>
      {title && <div style={{ fontSize: "0.7em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.4, marginBottom: "12px" }}>{title}</div>}
      {links.map((link, i) => (
        <a key={i} href="#" onClick={(e) => { e.preventDefault(); setActive(i) }} style={{
          display: "block", padding: "8px 12px", borderRadius: "inherit",
          textDecoration: "none", marginBottom: "2px", color: "inherit",
          background: i === active ? "rgba(128,128,128,0.15)" : "transparent",
          opacity: i === active ? 1 : 0.7,
          fontWeight: i === active ? 600 : "inherit",
          cursor: "pointer", transition: "all 0.15s",
        }}>{link.text}</a>
      ))}
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
interface TabsProps {
  tabs?: { label: string; content: string }[]
}

export function TabsBlock({ tabs = [] }: TabsProps) {
  const [active, setActive] = useState(0)

  if (tabs.length === 0) return null

  return (
    <div>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(128,128,128,0.2)", marginBottom: "16px" }}>
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "8px 16px", border: "none", background: "none", cursor: "pointer",
            color: "inherit", borderBottom: i === active ? "2px solid currentColor" : "2px solid transparent",
            fontSize: "inherit", fontFamily: "inherit", fontWeight: 500,
            opacity: i === active ? 1 : 0.5, transition: "all 0.15s",
          }}>
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ opacity: 0.8 }}>
        {tabs[active]?.content}
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  triggerText?: string
  title?: string
  content?: string
}

export function ModalBlock({ triggerText = "Open Modal", title = "Modal Title", content = "Modal content" }: ModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ padding: "10px 20px", borderRadius: "inherit", background: "currentColor", border: "none", fontSize: "inherit", fontFamily: "inherit", fontWeight: 600, cursor: "pointer" }}>
        <span style={{ color: "#fff", mixBlendMode: "difference" }}>{triggerText}</span>
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", color: "#111", borderRadius: "12px", padding: "24px", maxWidth: "480px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.2em", fontWeight: 700, margin: 0 }}>{title}</h3>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666", padding: "4px" }}>×</button>
            </div>
            <p style={{ fontSize: "0.9em", lineHeight: 1.6, opacity: 0.7, margin: 0 }}>{content}</p>
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setOpen(false)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ddd", background: "none", cursor: "pointer", fontSize: "0.9em", color: "#333" }}>Cancel</button>
              <button onClick={() => setOpen(false)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#111", color: "#fff", cursor: "pointer", fontSize: "0.9em", fontWeight: 600 }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Drawer ────────────────────────────────────────────────────────────────────
interface DrawerProps {
  triggerText?: string
  title?: string
  side?: "left" | "right"
  content?: string
}

export function DrawerBlock({ triggerText = "Open Drawer", title = "Drawer", side = "right", content = "" }: DrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ padding: "10px 20px", borderRadius: "inherit", background: "rgba(128,128,128,0.15)", border: "1px solid rgba(128,128,128,0.2)", fontSize: "inherit", fontFamily: "inherit", fontWeight: 600, cursor: "pointer", color: "inherit" }}>
        {triggerText}
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 9999 }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute", top: 0, bottom: 0,
              [side]: 0,
              width: "320px", background: "#fff", color: "#111",
              boxShadow: "0 0 40px rgba(0,0,0,0.2)", padding: "24px",
              display: "flex", flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.1em", fontWeight: 700, margin: 0 }}>{title}</h3>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" }}>×</button>
            </div>
            <p style={{ fontSize: "0.9em", lineHeight: 1.6, opacity: 0.6, margin: 0 }}>{content || "Drawer content goes here."}</p>
          </div>
        </div>
      )}
    </>
  )
}

// ── Switch ────────────────────────────────────────────────────────────────────
interface SwitchProps {
  label?: string
  checked?: boolean
}

export function SwitchBlock({ label = "Toggle", checked = false }: SwitchProps) {
  const [on, setOn] = useState(checked)

  return (
    <label onClick={() => setOn(!on)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "8px 0" }}>
      <div style={{
        width: "44px", height: "24px", borderRadius: "12px", position: "relative",
        background: on ? "currentColor" : "rgba(128,128,128,0.3)",
        transition: "background 0.2s",
      }}>
        <div style={{
          position: "absolute", top: "2px", left: on ? "22px" : "2px",
          width: "20px", height: "20px", borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </div>
      <span>{label}</span>
    </label>
  )
}

// ── Checkbox ─────────────────────────────────────────────────────────────────
interface CheckboxProps {
  label?: string
  checked?: boolean
}

export function CheckboxBlock({ label = "Checkbox", checked = false }: CheckboxProps) {
  const [on, setOn] = useState(checked)

  return (
    <label onClick={() => setOn(!on)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "8px 0" }}>
      <div style={{
        width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0,
        border: on ? "none" : "2px solid currentColor",
        background: on ? "currentColor" : "var(--input-bg)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: on ? 1 : 0.4, transition: "all 0.15s",
      }}>
        {on && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </label>
  )
}

// ── Range Slider ─────────────────────────────────────────────────────────────
interface RangeSliderProps {
  label?: string
  value?: number
  min?: number
  max?: number
  step?: number
}

export function RangeSliderBlock({ label, value = 50, min = 0, max = 100, step = 1 }: RangeSliderProps) {
  const [val, setVal] = useState(value)

  return (
    <div>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <label style={{ fontSize: "0.8em", fontWeight: 500, opacity: 0.7 }}>{label}</label>
          <span style={{ fontWeight: 600 }}>{val}</span>
        </div>
      )}
      <input type="range" min={min} max={max} value={val} step={step}
        onChange={(e) => setVal(Number(e.target.value))}
        style={{ width: "100%", accentColor: "currentColor", cursor: "pointer" }} />
    </div>
  )
}

// ── Rating ───────────────────────────────────────────────────────────────────
interface RatingProps {
  value?: number
  max?: number
  size?: number
}

export function RatingBlock({ value = 4, max = 5, size = 20 }: RatingProps) {
  const [rating, setRating] = useState(value)
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div style={{ display: "inline-flex", gap: "4px" }}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < (hover !== null ? hover + 1 : rating)
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"
            style={{ cursor: "pointer", transition: "transform 0.1s", transform: hover === i ? "scale(1.2)" : "scale(1)" }}
            onClick={() => setRating(i + 1)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )
      })}
    </div>
  )
}

// ── Popover ──────────────────────────────────────────────────────────────────
interface PopoverProps {
  triggerText?: string
  content?: string
}

export function PopoverBlock({ triggerText = "Click me", content = "Popover content goes here" }: PopoverProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: "8px", position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ padding: "10px 20px", borderRadius: "inherit", background: "rgba(128,128,128,0.15)", color: "inherit", border: "1px solid rgba(128,128,128,0.2)", fontSize: "inherit", fontFamily: "inherit", fontWeight: 600, cursor: "pointer" }}>
        {triggerText}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: "#fff", color: "#111", padding: "12px 16px", borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)", fontSize: "0.85em", lineHeight: 1.5,
          whiteSpace: "nowrap", zIndex: 10,
        }}>
          {content}
          <div style={{ position: "absolute", top: "-6px", left: "50%", transform: "translateX(-50%) rotate(45deg)", width: "12px", height: "12px", background: "#fff" }} />
        </div>
      )}
    </div>
  )
}
