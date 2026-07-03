"use client"

interface MasonryImage {
  src: string
  alt?: string
  height?: number
}

interface MasonryGalleryBlockProps {
  images?: MasonryImage[]
  columns?: number
  gap?: string
  borderRadius?: string
  hoverEffect?: boolean
  breakpoint?: "desktop" | "tablet" | "mobile"
  [key: string]: unknown
}

const DEFAULT_IMAGES: MasonryImage[] = [
  { src: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600", alt: "Car", height: 280 },
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600", alt: "Abstract", height: 200 },
  { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600", alt: "Nature", height: 320 },
  { src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600", alt: "Workspace", height: 240 },
  { src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600", alt: "Cinema", height: 180 },
  { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600", alt: "Gaming", height: 260 },
]

export function MasonryGalleryBlock({
  images = DEFAULT_IMAGES,
  columns = 3,
  gap = "16px",
  borderRadius = "12px",
  hoverEffect = true,
  breakpoint = "desktop",
}: MasonryGalleryBlockProps) {
  const cols = breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : columns

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <div style={{
        columns: cols,
        columnGap: gap,
      }}>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              breakInside: "avoid" as never,
              marginBottom: gap,
              borderRadius,
              overflow: "hidden",
              position: "relative",
              background: "rgba(128,128,128,0.06)",
              border: "1px solid rgba(128,128,128,0.1)",
            }}
          >
            {img.src ? (
              <img
                src={img.src}
                alt={img.alt ?? `Image ${i + 1}`}
                style={{
                  width: "100%",
                  height: img.height ? `${img.height}px` : "auto",
                  objectFit: "cover",
                  display: "block",
                  transition: hoverEffect ? "transform 0.5s ease" : undefined,
                }}
              />
            ) : (
              <div style={{
                height: img.height ? `${img.height}px` : "200px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(128,128,128,0.4)", fontSize: "13px",
              }}>
                No image
              </div>
            )}
          </div>
        ))}
      </div>

      {hoverEffect && (
        <style>{`
          .masonry-gallery-item:hover img { transform: scale(1.05); }
        `}</style>
      )}
    </div>
  )
}
