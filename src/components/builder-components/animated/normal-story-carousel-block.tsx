"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CarouselItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

interface NormalStoryCarouselBlockProps {
  heading?: string;
  items?: CarouselItem[];
  isPreview?: boolean;
  // Item container settings — everything below is expressed in units that
  // scale with the carousel container (not the viewport), so resizing the
  // carousel in the editor actually resizes the items too.
  itemWidth?: string; // e.g. "35%" or "400px"
  aspectRatio?: string; // e.g. "16/10"
  itemHeight?: string; // overrides aspectRatio when set (e.g. "300px")
  gap?: string; // spacing between items
  borderRadius?: string; // item card corner radius
  showTitle?: boolean;
  showCategory?: boolean;
  showDots?: boolean;
  overlayOnHover?: boolean; // hide title/category until hover
  padding?: string; // outer section padding
  breakpoint?: "desktop" | "tablet" | "mobile";
  [key: string]: unknown;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: "Jaipuria Convocation Film",
    category: "Production, Video Editing, Cinematography",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200",
  },
  {
    id: 2,
    title: "AdiDev Press",
    category: "Social Media, Graphic Design, Ecommerce",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
  },
  {
    id: 3,
    title: "Calendar Showcase",
    category: "Photography, Art Direction, Editorial",
    image:
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200",
  },
  {
    id: 4,
    title: "Corporate Identity",
    category: "Branding, Typography, Interactive",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200",
  },
  {
    id: 5,
    title: "Cinematic Narratives",
    category: "Film Production, Sound Design",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
  },
];

export function NormalStoryCarouselBlock({
  items = DEFAULT_ITEMS,
  itemWidth = "40%",
  aspectRatio = "16/10",
  itemHeight,
  gap = "32px",
  borderRadius = "24px",
  showTitle = true,
  showCategory = true,
  showDots = true,
  overlayOnHover = true,
  padding = "96px 24px",
  breakpoint = "desktop",
}: NormalStoryCarouselBlockProps) {
  // Scale item width up on smaller breakpoints so at least one full card is
  // visible with a hint of the next. Only applies to percentage values; if the
  // user has supplied an explicit px/rem/vw width, it passes through untouched.
  const scaleForBreakpoint = (val: string): string => {
    const trimmed = (val ?? "").trim();
    if (!trimmed.endsWith("%")) return trimmed;
    const pct = parseFloat(trimmed);
    if (isNaN(pct)) return trimmed;
    if (breakpoint === "mobile") {
      // Aim for ~1 to 1.5 cards visible: bump low percentages up towards 85%.
      return `${Math.min(90, Math.max(pct, 85))}%`;
    }
    if (breakpoint === "tablet") {
      // Aim for ~2 cards visible on tablet.
      return `${Math.min(80, Math.max(pct, 55))}%`;
    }
    return trimmed;
  };
  const effectiveItemWidth = scaleForBreakpoint(itemWidth);
  const effectivePadding = breakpoint === "mobile"
    ? "48px 16px"
    : breakpoint === "tablet"
      ? "64px 20px"
      : padding;
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [viewportW, setViewportW] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  // Percentage widths inside a `width: max-content` flex container fail to
  // resolve (circular size dependency), so we measure the viewport once and
  // convert any percentage itemWidth to a pixel value. Plain px/rem/vw values
  // pass through untouched.
  const resolveItemWidth = (val: string, containerWidth: number): string => {
    const trimmed = (val ?? "").trim();
    if (!trimmed) return "400px";
    if (trimmed.endsWith("%") && containerWidth > 0) {
      const pct = parseFloat(trimmed);
      if (!isNaN(pct)) return `${Math.round((containerWidth * pct) / 100)}px`;
    }
    return trimmed;
  };
  const computedItemWidth = resolveItemWidth(effectiveItemWidth, viewportW);

  const updateWidth = () => {
    if (carouselRef.current && viewportRef.current) {
      const scrollW = carouselRef.current.scrollWidth;
      const offsetW = viewportRef.current.offsetWidth;
      setViewportW(offsetW);
      setWidth(Math.max(0, scrollW - offsetW));
    }
  };

  useEffect(() => {
    updateWidth();
    const timer = setTimeout(updateWidth, 500);
    window.addEventListener("resize", updateWidth);

    let carouselObs: ResizeObserver | undefined;
    let viewportObs: ResizeObserver | undefined;
    if (carouselRef.current) {
      carouselObs = new ResizeObserver(updateWidth);
      carouselObs.observe(carouselRef.current);
    }
    if (viewportRef.current) {
      viewportObs = new ResizeObserver(updateWidth);
      viewportObs.observe(viewportRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
      if (carouselObs) carouselObs.disconnect();
      if (viewportObs) viewportObs.disconnect();
    };
    // Re-measure when the item sizing settings change so dragConstraints stay accurate.
  }, [itemWidth, itemHeight, aspectRatio, gap, items.length]);

  const handleDragStart = () => {
    updateWidth();
  };

  const handleDragEnd = () => {
    if (carouselRef.current && viewportRef.current) {
      const scrollOffset =
        -carouselRef.current.getBoundingClientRect().left +
        viewportRef.current.getBoundingClientRect().left;
      const cardWidth = carouselRef.current.scrollWidth / items.length;
      const index = Math.min(
        Math.max(Math.round(scrollOffset / cardWidth), 0),
        items.length - 1,
      );
      setActiveDot(index);
    }
  };

  // Item container size — width scales with the carousel (computed from the
  // measured viewport when the user supplies a %), height either uses an
  // explicit height or falls back to the aspect ratio.
  const itemStyle: React.CSSProperties = {
    width: computedItemWidth,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
  };
  const cardStyle: React.CSSProperties = {
    width: "100%",
    position: "relative",
    borderRadius,
    overflow: "hidden",
    background: "#f5f5f5",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    ...(itemHeight
      ? { height: itemHeight }
      : { aspectRatio: aspectRatio.replace("/", " / ") }),
  };

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        padding: effectivePadding,
        overflow: "hidden",
        userSelect: "none",
        backgroundColor: "transparent",
        fontFamily: "var(--font-sans, sans-serif)",
        boxSizing: "border-box",
      }}
    >
      <div ref={viewportRef} style={{ overflow: "visible", position: "relative", width: "100%" }}>
        <motion.div
          ref={carouselRef}
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{
            display: "flex",
            gap,
            cursor: "grab",
            width: "max-content",
            paddingRight: "64px",
          }}
        >
          {items.map((item) => (
            <motion.div key={item.id} style={itemStyle} className="story-carousel-item">
              <div style={cardStyle}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                    opacity: 0.95,
                    transition: "transform 0.7s ease-out",
                  }}
                />
                {overlayOnHover && (
                  <div
                    className="story-carousel-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2) 60%, transparent)",
                      opacity: 0,
                      transition: "opacity 0.5s ease",
                      pointerEvents: "none",
                    }}
                  />
                )}
                {(showTitle || showCategory) && (
                  <div
                    className="story-carousel-caption"
                    style={{
                      position: "absolute",
                      left: breakpoint === "mobile" ? "16px" : breakpoint === "tablet" ? "20px" : "32px",
                      right: breakpoint === "mobile" ? "16px" : breakpoint === "tablet" ? "20px" : "32px",
                      bottom: breakpoint === "mobile" ? "14px" : breakpoint === "tablet" ? "18px" : "28px",
                      zIndex: 2,
                      pointerEvents: "none",
                      opacity: overlayOnHover ? 0 : 1,
                      transform: overlayOnHover ? "translateY(16px)" : "none",
                      transition: "opacity 0.5s ease, transform 0.5s ease",
                      color: "#fff",
                    }}
                  >
                    {showTitle && (
                      <h3
                        style={{
                          fontSize:
                            breakpoint === "mobile"
                              ? "16px"
                              : breakpoint === "tablet"
                                ? "20px"
                                : "26px",
                          fontWeight: 600,
                          margin: 0,
                          marginBottom: breakpoint === "mobile" ? "4px" : "8px",
                          lineHeight: 1.25,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.title}
                      </h3>
                    )}
                    {showCategory && (
                      <p
                        style={{
                          fontSize:
                            breakpoint === "mobile"
                              ? "10px"
                              : breakpoint === "tablet"
                                ? "12px"
                                : "13px",
                          color: "#f59e0b",
                          margin: 0,
                          fontWeight: 500,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {item.category}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {showDots && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "64px",
          }}
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveDot(index)}
              style={{
                height: "6px",
                borderRadius: "999px",
                transition: "all 0.3s",
                width: activeDot === index ? "32px" : "8px",
                backgroundColor: activeDot === index ? "#000000" : "#d4d4d4",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hover interactions — reveal caption + gradient overlay */}
      <style>{`
        .story-carousel-item:hover .story-carousel-overlay { opacity: 1 !important; }
        .story-carousel-item:hover .story-carousel-caption { opacity: 1 !important; transform: translateY(0) !important; }
        .story-carousel-item:hover img { transform: scale(1.05); }
      `}</style>
    </section>
  );
}
