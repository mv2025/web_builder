interface StatItem { value: string; label: string; description?: string }

interface StatisticsBlockProps {
  items?: StatItem[]
  heading?: string
  breakpoint?: "desktop" | "tablet" | "mobile"
  [key: string]: unknown
}

const DEFAULT_ITEMS: StatItem[] = [
  { value: "50K+", label: "Websites Built" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "3x", label: "Faster Launch" },
  { value: "4.9★", label: "Rating" },
]

export function StatisticsBlock({
  items = DEFAULT_ITEMS,
  heading,
  breakpoint = "desktop",
}: StatisticsBlockProps) {
  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"
  // Grid columns: 1 on very-mobile-narrow-with-many-items would look bad, so
  // stick to 2 on mobile. Tablet uses 2. Desktop lays out all items in a row.
  const cols = isMobile ? 2 : isTablet ? Math.min(items.length, 2) : items.length

  // Breakpoint-driven fixed sizes (no `vw` — that's tied to the browser
  // viewport, not the editor's simulated canvas, so it always stayed huge on
  // the mobile canvas). Everything below scales cleanly across breakpoints.
  const valueSize = isMobile ? "28px" : isTablet ? "40px" : "56px"
  const labelSize = isMobile ? "12px" : isTablet ? "14px" : "16px"
  const descSize = isMobile ? "11px" : isTablet ? "12px" : "13px"
  const headingSize = isMobile ? "22px" : isTablet ? "32px" : "40px"
  const headingBottom = isMobile ? "20px" : isTablet ? "32px" : "48px"
  const cellPadding = isMobile ? "12px 8px" : isTablet ? "16px 12px" : "24px"
  const gap = isMobile ? "12px" : isTablet ? "20px" : "32px"

  return (
    <section
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center",
        padding: isMobile ? "0 8px" : "0",
        boxSizing: "border-box",
      }}
    >
      {heading && (
        <h2
          style={{
            fontSize: headingSize,
            fontWeight: 800,
            marginBottom: headingBottom,
            lineHeight: 1.15,
          }}
        >
          {heading}
        </h2>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap,
        }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ padding: cellPadding, minWidth: 0 }}>
            <div
              style={{
                fontSize: valueSize,
                fontWeight: 800,
                lineHeight: 1,
                marginBottom: isMobile ? "6px" : "8px",
                // Prevent long values (e.g. "10,000+") from overflowing the
                // narrow mobile cell — they shrink with the container instead.
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontSize: labelSize,
                opacity: 0.6,
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {item.label}
            </div>
            {item.description && (
              <div
                style={{
                  fontSize: descSize,
                  opacity: 0.4,
                  marginTop: "4px",
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
