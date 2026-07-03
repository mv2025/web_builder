interface SplitSectionBlockProps {
  heading?: string
  text?: string
  image?: string
  ctaText?: string
  ctaHref?: string
  layout?: "50/50" | "60/40" | "40/60"
  reversed?: boolean
  verticalAlign?: "top" | "center" | "bottom"
  imageAspectRatio?: string
  imageBorderRadius?: string
  breakpoint?: "desktop" | "tablet" | "mobile"
  [key: string]: unknown
}

export function SplitSectionBlock({
  heading = "Build websites that convert",
  text = "Our platform gives you everything you need to create stunning, high-performance websites. No coding required — just drag, drop, and publish.",
  image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
  ctaText = "Get Started",
  ctaHref = "#",
  layout = "50/50",
  reversed = false,
  verticalAlign = "center",
  imageAspectRatio = "4/3",
  imageBorderRadius = "16px",
  breakpoint = "desktop",
}: SplitSectionBlockProps) {
  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"
  const isStacked = isMobile

  const splits: Record<string, [string, string]> = {
    "50/50": ["1fr", "1fr"],
    "60/40": ["3fr", "2fr"],
    "40/60": ["2fr", "3fr"],
  }
  const [left, right] = splits[layout] ?? ["1fr", "1fr"]
  const templateCols = isStacked ? "1fr" : reversed ? `${right} ${left}` : `${left} ${right}`

  const alignMap = { top: "flex-start", center: "center", bottom: "flex-end" }

  const contentBlock = (
    <div style={{
      display: "flex", flexDirection: "column",
      justifyContent: alignMap[verticalAlign] ?? "center",
      gap: isMobile ? "16px" : "24px",
      padding: isMobile ? "0" : isTablet ? "16px" : "32px",
    }}>
      {heading && (
        <h2 style={{
          fontSize: isMobile ? "28px" : isTablet ? "36px" : "44px",
          fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0,
        }}>
          {heading}
        </h2>
      )}
      {text && (
        <p style={{
          fontSize: isMobile ? "14px" : "16px",
          opacity: 0.6, lineHeight: 1.7, margin: 0, maxWidth: "520px",
        }}>
          {text}
        </p>
      )}
      {ctaText && (
        <div>
          <a
            href={ctaHref}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: isMobile ? "12px 24px" : "14px 32px",
              borderRadius: "9999px", textDecoration: "none",
              background: "currentColor", fontWeight: 700, fontSize: "inherit",
            }}
          >
            <span style={{ color: "#fff", mixBlendMode: "difference" }}>{ctaText} →</span>
          </a>
        </div>
      )}
    </div>
  )

  const imageBlock = (
    <div style={{
      borderRadius: imageBorderRadius,
      overflow: "hidden",
      background: "rgba(128,128,128,0.06)",
      border: "1px solid rgba(128,128,128,0.1)",
    }}>
      {image ? (
        <img
          src={image}
          alt={heading ?? "Split section image"}
          style={{
            width: "100%",
            aspectRatio: imageAspectRatio.replace("/", " / "),
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div style={{
          width: "100%",
          aspectRatio: imageAspectRatio.replace("/", " / "),
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(128,128,128,0.4)", fontSize: "13px",
        }}>
          Add an image
        </div>
      )}
    </div>
  )

  return (
    <section style={{
      width: "100%", maxWidth: "1100px", margin: "0 auto", boxSizing: "border-box",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: templateCols,
        gap: isMobile ? "24px" : isTablet ? "32px" : "48px",
        alignItems: alignMap[verticalAlign] ?? "center",
      }}>
        {reversed && !isStacked ? (
          <>{imageBlock}{contentBlock}</>
        ) : (
          <>{contentBlock}{imageBlock}</>
        )}
      </div>
    </section>
  )
}
