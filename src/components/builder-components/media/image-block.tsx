interface ImageBlockProps {
  src?: string
  alt?: string
  objectFit?: "cover" | "contain" | "fill"
  caption?: string
  rounded?: boolean
  [key: string]: unknown
}

export function ImageBlock({
  src,
  alt = "Image",
  objectFit = "cover",
  caption,
  rounded = true,
}: ImageBlockProps) {
  return (
    <figure style={{ margin: 0, width: "100%", height: "auto" }}>
      <div style={{
        width: "100%", overflow: "hidden",
        borderRadius: rounded ? "inherit" : "0",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxSizing: "border-box",
        ...(src ? {} : { background: "rgba(128,128,128,0.06)", border: "1px solid rgba(128,128,128,0.15)", minHeight: "120px" }),
      }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            style={{ width: "100%", height: "auto", objectFit, display: "block" }}
          />
        ) : (
          <div style={{ textAlign: "center", opacity: 0.4 }}>
            <div style={{ fontSize: "2em", marginBottom: "8px" }}>&#128444;</div>
            <div style={{ fontSize: "0.85em" }}>Click to add image</div>
          </div>
        )}
      </div>
      {caption && (
        <figcaption style={{ fontSize: "0.8em", opacity: 0.5, textAlign: "center", marginTop: "8px" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
