"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import type { ComponentNode, ComponentType } from "@/types";
import { generateId } from "@/lib/utils";
import { SectionLabel } from "./right-sidebar";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  Search,
  X,
} from "lucide-react";
import { LucideIcon, ICON_CATEGORIES, ALL_ICON_NAMES } from "@/lib/lucide-icon";

interface ContentPanelProps {
  node: ComponentNode;
}

export function ContentPanel({ node }: ContentPanelProps) {
  const { updateNodeProps } = useEditorStore();
  const props = node.props as Record<string, unknown>;

  const update = (key: string, value: unknown) => {
    updateNodeProps(node.id, { [key]: value });
  };

  // Gallery gets a special image list UI
  if (node.type === "gallery") {
    return <GalleryContentPanel node={node} props={props} update={update} />;
  }

  // Slider gets slide management UI
  if (node.type === "slider") {
    return <SliderContentPanel props={props} update={update} />;
  }

  // Carousel gets item management UI
  if (node.type === "carousel") {
    return <CarouselContentPanel props={props} update={update} />;
  }

  // Card Slider gets card management UI
  if (node.type === "card-slider") {
    return <CardSliderContentPanel node={node} props={props} update={update} />;
  }

  // Table gets full table editor
  if (node.type === "table") {
    return <TableContentPanel props={props} update={update} />;
  }

  // Tabs gets a special panel that syncs children with tab labels
  if (node.type === "tabs") {
    return <TabsContentPanel node={node} props={props} update={update} />;
  }

  // Navbar gets a special panel with nested links support
  if (node.type === "navbar") {
    return <NavbarContentPanel props={props} update={update} />;
  }

  // List-based component editors
  if (
    [
      "timeline",
      "accordion",
      "steps",
      "breadcrumb",
      "sidebar-nav",
      "menu",
      "social-links",
      "tag-group",
      "list",
      "marquee",
      "statistics",
      "features",
      "testimonials",
      "faq",
      "pricing",
      "logos",
      "team",
      "bento-grid",
      "footer",
    ].includes(node.type)
  ) {
    return (
      <ListBasedContentPanel type={node.type} props={props} update={update} />
    );
  }

  // Map gets a special panel with iframe paste
  if (node.type === "map") {
    return <MapContentPanel props={props} update={update} />;
  }

  // Contact form gets full field management
  if (node.type === "contact-form") {
    return <ContactFormContentPanel props={props} update={update} />;
  }

  // Render different content fields based on node type
  const fields = getContentFields(node.type, props);

  if (fields.length === 0) {
    return (
      <div
        style={{
          padding: "24px 12px",
          textAlign: "center",
          color: "var(--fg-ghost)",
          fontSize: "13px",
        }}
      >
        No content properties for this component type.
      </div>
    );
  }

  return (
    <div style={{ padding: "12px" }}>
      <SectionLabel>Content</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {fields.map((field) => (
          <ContentField
            key={field.key}
            field={field}
            value={props[field.key]}
            onChange={(v) => update(field.key, v)}
          />
        ))}
      </div>
    </div>
  );
}

interface GalleryImage {
  src: string;
  alt: string;
}

function GalleryContentPanel({
  node,
  props,
  update,
}: {
  node: ComponentNode;
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const images = (props.images as GalleryImage[] | undefined) ?? [];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const addImage = () => {
    const updated = [...images, { src: "", alt: "" }];
    update("images", updated);
    setExpandedIdx(updated.length - 1);
  };

  const removeImage = (idx: number) => {
    update(
      "images",
      images.filter((_, i) => i !== idx),
    );
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const updateImage = (
    idx: number,
    field: keyof GalleryImage,
    value: string,
  ) => {
    const updated = images.map((img, i) =>
      i === idx ? { ...img, [field]: value } : img,
    );
    update("images", updated);
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[target];
    updated[target] = temp;
    update("images", updated);
    setExpandedIdx(target);
  };

  return (
    <div style={{ padding: "12px" }}>
      <SectionLabel>Gallery Images</SectionLabel>

      {/* Image list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {images.length === 0 && (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              color: "var(--fg-ghost)",
              fontSize: "12px",
            }}
          >
            <ImageIcon
              size={24}
              strokeWidth={1.2}
              style={{ marginBottom: "6px", opacity: 0.4 }}
            />
            <div>No images added yet</div>
            <div style={{ fontSize: "11px", marginTop: "2px" }}>
              Click &quot;Add Image&quot; below
            </div>
          </div>
        )}

        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              overflow: "hidden",
            }}
          >
            {/* Image header row */}
            <div
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 8px",
                cursor: "pointer",
                background:
                  expandedIdx === idx ? "var(--accent-muted)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  flexShrink: 0,
                  background: img.src
                    ? `url(${img.src}) center/cover`
                    : "var(--pill-bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!img.src && (
                  <ImageIcon
                    size={14}
                    strokeWidth={1.5}
                    style={{ color: "var(--fg-ghost)" }}
                  />
                )}
              </div>

              <span
                style={{
                  flex: 1,
                  fontSize: "12px",
                  color: "var(--fg-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {img.alt || img.src?.split("/").pop() || `Image ${idx + 1}`}
              </span>

              {/* Reorder buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveImage(idx, -1);
                }}
                disabled={idx === 0}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === 0 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveImage(idx, 1);
                }}
                disabled={idx === images.length - 1}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === images.length - 1 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronDown size={14} />
              </button>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Expanded edit fields */}
            {expandedIdx === idx && (
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={img.src}
                    onChange={(e) => updateImage(idx, "src", e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    style={baseInput}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => updateImage(idx, "alt", e.target.value)}
                    placeholder="Describe the image"
                    style={baseInput}
                  />
                </div>
                {/* Preview */}
                {img.src && (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      background: "var(--pill-bg)",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add image button */}
      <button
        onClick={addImage}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          transition: "all 0.15s",
        }}
      >
        <Plus size={14} /> Add Image
      </button>

      {/* Grid settings */}
      <div style={{ marginTop: "16px" }}>
        <SectionLabel>Grid Settings</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Columns
            </label>
            <input
              type="number"
              value={Number(props.columns ?? 3)}
              min={1}
              max={8}
              onChange={(e) => update("columns", Number(e.target.value))}
              style={baseInput}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Gap
            </label>
            <input
              type="text"
              value={String(props.gap ?? "16px")}
              onChange={(e) => update("gap", e.target.value)}
              placeholder="16px"
              style={baseInput}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Border Radius
            </label>
            <input
              type="text"
              value={String(props.borderRadius ?? "8px")}
              onChange={(e) => update("borderRadius", e.target.value)}
              placeholder="8px"
              style={baseInput}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Aspect Ratio
            </label>
            <select
              value={String(props.aspectRatio ?? "1")}
              onChange={(e) => update("aspectRatio", e.target.value)}
              style={{ ...baseInput, cursor: "pointer" }}
            >
              <option value="1">Square (1:1)</option>
              <option value="4/3">Landscape (4:3)</option>
              <option value="16/9">Widescreen (16:9)</option>
              <option value="3/4">Portrait (3:4)</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Slider Content Panel ──────────────────────────────────────────────────────
interface SlideItem {
  src: string;
  alt?: string;
  caption?: string;
}

function SliderContentPanel({
  props,
  update,
}: {
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const slides = (props.slides as SlideItem[] | undefined) ?? [];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const addSlide = () => {
    const updated = [...slides, { src: "", alt: "", caption: "" }];
    update("slides", updated);
    setExpandedIdx(updated.length - 1);
  };

  const removeSlide = (idx: number) => {
    update(
      "slides",
      slides.filter((_, i) => i !== idx),
    );
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const updateSlide = (idx: number, field: string, value: string) => {
    const updated = slides.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s,
    );
    update("slides", updated);
  };

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    const updated = [...slides];
    const temp = updated[idx];
    updated[idx] = updated[target];
    updated[target] = temp;
    update("slides", updated);
    setExpandedIdx(target);
  };

  return (
    <div style={{ padding: "12px" }}>
      <SectionLabel>Slides</SectionLabel>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {slides.length === 0 && (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              color: "var(--fg-ghost)",
              fontSize: "12px",
            }}
          >
            <ImageIcon
              size={24}
              strokeWidth={1.2}
              style={{ marginBottom: "6px", opacity: 0.4 }}
            />
            <div>No slides added yet</div>
            <div style={{ fontSize: "11px", marginTop: "2px" }}>
              Click &quot;Add Slide&quot; below
            </div>
          </div>
        )}

        {slides.map((slide, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 8px",
                cursor: "pointer",
                background:
                  expandedIdx === idx ? "var(--accent-muted)" : "transparent",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  flexShrink: 0,
                  background: slide.src
                    ? `url(${slide.src}) center/cover`
                    : "var(--pill-bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!slide.src && (
                  <ImageIcon
                    size={14}
                    strokeWidth={1.5}
                    style={{ color: "var(--fg-ghost)" }}
                  />
                )}
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: "12px",
                  color: "var(--fg-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {slide.caption || slide.alt || `Slide ${idx + 1}`}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveSlide(idx, -1);
                }}
                disabled={idx === 0}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === 0 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveSlide(idx, 1);
                }}
                disabled={idx === slides.length - 1}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === slides.length - 1 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSlide(idx);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {expandedIdx === idx && (
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={slide.src}
                    onChange={(e) => updateSlide(idx, "src", e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    style={baseInput}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={slide.alt ?? ""}
                    onChange={(e) => updateSlide(idx, "alt", e.target.value)}
                    placeholder="Describe the image"
                    style={baseInput}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Caption
                  </label>
                  <input
                    type="text"
                    value={slide.caption ?? ""}
                    onChange={(e) =>
                      updateSlide(idx, "caption", e.target.value)
                    }
                    placeholder="Optional caption"
                    style={baseInput}
                  />
                </div>
                {slide.src && (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addSlide}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        <Plus size={14} /> Add Slide
      </button>

      <div style={{ marginTop: "16px" }}>
        <SectionLabel>Slider Settings</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "var(--fg-secondary)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={(props.autoplay as boolean) ?? true}
              onChange={(e) => update("autoplay", e.target.checked)}
            />
            Autoplay
          </label>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Interval (ms)
            </label>
            <input
              type="number"
              value={Number(props.interval ?? 4000)}
              min={500}
              step={500}
              onChange={(e) => update("interval", Number(e.target.value))}
              style={baseInput}
            />
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "var(--fg-secondary)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={(props.showDots as boolean) ?? true}
              onChange={(e) => update("showDots", e.target.checked)}
            />
            Show Dots
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "var(--fg-secondary)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={(props.showArrows as boolean) ?? true}
              onChange={(e) => update("showArrows", e.target.checked)}
            />
            Show Arrows
          </label>
        </div>
      </div>
    </div>
  );
}

// ── Carousel Content Panel ───────────────────────────────────────────────────
function CarouselContentPanel({
  props,
  update,
}: {
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const items =
    (props.items as { src: string; alt?: string }[] | undefined) ?? [];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const addItem = () => {
    const updated = [...items, { src: "", alt: "" }];
    update("items", updated);
    setExpandedIdx(updated.length - 1);
  };

  const removeItem = (idx: number) => {
    update(
      "items",
      items.filter((_, i) => i !== idx),
    );
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const updateItem = (idx: number, field: string, value: string) => {
    const updated = items.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s,
    );
    update("items", updated);
  };

  return (
    <div style={{ padding: "12px" }}>
      <SectionLabel>Carousel Items</SectionLabel>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {items.length === 0 && (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              color: "var(--fg-ghost)",
              fontSize: "12px",
            }}
          >
            <ImageIcon
              size={24}
              strokeWidth={1.2}
              style={{ marginBottom: "6px", opacity: 0.4 }}
            />
            <div>No items added yet</div>
          </div>
        )}

        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 8px",
                cursor: "pointer",
                background:
                  expandedIdx === idx ? "var(--accent-muted)" : "transparent",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  flexShrink: 0,
                  background: item.src
                    ? `url(${item.src}) center/cover`
                    : "var(--pill-bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!item.src && (
                  <ImageIcon
                    size={14}
                    strokeWidth={1.5}
                    style={{ color: "var(--fg-ghost)" }}
                  />
                )}
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: "12px",
                  color: "var(--fg-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.alt || `Item ${idx + 1}`}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(idx);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {expandedIdx === idx && (
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={item.src}
                    onChange={(e) => updateItem(idx, "src", e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    style={baseInput}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={item.alt ?? ""}
                    onChange={(e) => updateItem(idx, "alt", e.target.value)}
                    placeholder="Describe the image"
                    style={baseInput}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        <Plus size={14} /> Add Item
      </button>

      <div style={{ marginTop: "16px" }}>
        <SectionLabel>Settings</SectionLabel>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={(props.autoplay as boolean) ?? true}
            onChange={(e) => update("autoplay", e.target.checked)}
          />
          Autoplay
        </label>
      </div>
    </div>
  );
}

// ── Card Slider Content Panel ───────────────────────────────────────────────
interface CardSliderCard {
  image?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

function CardSliderContentPanel({
  node,
  props,
  update,
}: {
  node: ComponentNode;
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const { addNode, removeNode, moveNode } = useEditorStore();
  const cards = (props.cards as CardSliderCard[] | undefined) ?? [];
  const hasChildren = node.children.length > 0;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const addCard = () => {
    const paneNode: ComponentNode = {
      id: generateId(),
      type: "container" as ComponentType,
      name: `Card ${node.children.length + 1}`,
      props: {},
      styles: {
        desktop: { width: "100%", minHeight: "80px" },
        tablet: {},
        mobile: {},
      },
      animations: [],
      children: [],
      locked: false,
      hidden: false,
      parentId: node.id,
    };
    addNode(paneNode, node.id);
    if (!hasChildren && cards.length === 0) {
      const paneNode2: ComponentNode = {
        id: generateId(),
        type: "container" as ComponentType,
        name: "Card 2",
        props: {},
        styles: {
          desktop: { width: "100%", minHeight: "80px" },
          tablet: {},
          mobile: {},
        },
        animations: [],
        children: [],
        locked: false,
        hidden: false,
        parentId: node.id,
      };
      const paneNode3: ComponentNode = {
        id: generateId(),
        type: "container" as ComponentType,
        name: "Card 3",
        props: {},
        styles: {
          desktop: { width: "100%", minHeight: "80px" },
          tablet: {},
          mobile: {},
        },
        animations: [],
        children: [],
        locked: false,
        hidden: false,
        parentId: node.id,
      };
      addNode(paneNode2, node.id);
      addNode(paneNode3, node.id);
    }
    setExpandedIdx(node.children.length);
  };

  const removeCard = (idx: number) => {
    if (hasChildren) {
      const child = node.children[idx];
      if (child) removeNode(child.id);
    } else {
      update(
        "cards",
        cards.filter((_, i) => i !== idx),
      );
    }
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const updateCard = (idx: number, field: string, value: string) => {
    const updated = cards.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c,
    );
    update("cards", updated);
  };

  const moveCard = (idx: number, dir: -1 | 1) => {
    const items = hasChildren ? node.children : cards;
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    if (hasChildren) {
      const movingChild = node.children[idx];
      if (movingChild) moveNode(movingChild.id, node.id, target);
    } else {
      const updated = [...cards];
      const temp = updated[idx];
      updated[idx] = updated[target];
      updated[target] = temp;
      update("cards", updated);
    }
    setExpandedIdx(target);
  };

  return (
    <div style={{ padding: "12px" }}>
      <SectionLabel>
        Cards ({hasChildren ? node.children.length : cards.length})
      </SectionLabel>

      {hasChildren && (
        <div
          style={{
            padding: "6px 8px",
            marginBottom: "8px",
            borderRadius: "6px",
            background: "var(--accent-muted)",
            fontSize: "11px",
            color: "var(--accent)",
          }}
        >
          Drag & drop mode — drop components into each card to design custom
          layouts
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {!hasChildren && cards.length === 0 && (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              color: "var(--fg-ghost)",
              fontSize: "12px",
            }}
          >
            <ImageIcon
              size={24}
              strokeWidth={1.2}
              style={{ marginBottom: "6px", opacity: 0.4 }}
            />
            <div>No cards added yet</div>
            <div style={{ fontSize: "11px", marginTop: "2px" }}>
              Click &quot;Add Card&quot; below
            </div>
          </div>
        )}

        {hasChildren
          ? node.children.map((child, idx) => (
              <div
                key={child.id}
                style={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 8px",
                  }}
                >
                  <GripVertical
                    size={12}
                    style={{ opacity: 0.3, flexShrink: 0 }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontSize: "12px",
                      color: "var(--fg-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {child.name || `Card ${idx + 1}`}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--fg-ghost)",
                      flexShrink: 0,
                    }}
                  >
                    {child.children.length} item
                    {child.children.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => moveCard(idx, -1)}
                    disabled={idx === 0}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      opacity: idx === 0 ? 0.3 : 0.7,
                      color: "var(--fg-faint)",
                    }}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => moveCard(idx, 1)}
                    disabled={idx === node.children.length - 1}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      opacity: idx === node.children.length - 1 ? 0.3 : 0.7,
                      color: "var(--fg-faint)",
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => removeCard(idx)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      color: "#ef4444",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          : cards.map((card, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  overflow: "hidden",
                }}
              >
                {/* Card header row */}
                <div
                  onClick={() =>
                    setExpandedIdx(expandedIdx === idx ? null : idx)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 8px",
                    cursor: "pointer",
                    background:
                      expandedIdx === idx
                        ? "var(--accent-muted)"
                        : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: card.image
                        ? `url(${card.image}) center/cover`
                        : "var(--accent-muted)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!card.image && (
                      <span
                        style={{ fontSize: "12px", color: "var(--fg-ghost)" }}
                      >
                        👤
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      flex: 1,
                      fontSize: "12px",
                      color: "var(--fg-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {card.title || `Card ${idx + 1}`}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveCard(idx, -1);
                    }}
                    disabled={idx === 0}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      opacity: idx === 0 ? 0.3 : 0.7,
                      color: "var(--fg-faint)",
                    }}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveCard(idx, 1);
                    }}
                    disabled={idx === cards.length - 1}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      opacity: idx === cards.length - 1 ? 0.3 : 0.7,
                      color: "var(--fg-faint)",
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCard(idx);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      color: "#ef4444",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Expanded edit fields */}
                {expandedIdx === idx && (
                  <div
                    style={{
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--fg-faint)",
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        Avatar / Image URL
                      </label>
                      <input
                        type="url"
                        value={card.image ?? ""}
                        onChange={(e) =>
                          updateCard(idx, "image", e.target.value)
                        }
                        placeholder="https://example.com/avatar.jpg"
                        style={baseInput}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--fg-faint)",
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        Name / Title
                      </label>
                      <input
                        type="text"
                        value={card.title ?? ""}
                        onChange={(e) =>
                          updateCard(idx, "title", e.target.value)
                        }
                        placeholder="Card title"
                        style={baseInput}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--fg-faint)",
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        Description
                      </label>
                      <textarea
                        value={card.description ?? ""}
                        onChange={(e) =>
                          updateCard(idx, "description", e.target.value)
                        }
                        placeholder="Card description..."
                        rows={3}
                        style={{ ...baseInput, resize: "vertical" }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--fg-faint)",
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={card.buttonText ?? ""}
                        onChange={(e) =>
                          updateCard(idx, "buttonText", e.target.value)
                        }
                        placeholder="View More"
                        style={baseInput}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--fg-faint)",
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        Button URL
                      </label>
                      <input
                        type="url"
                        value={card.buttonUrl ?? ""}
                        onChange={(e) =>
                          updateCard(idx, "buttonUrl", e.target.value)
                        }
                        placeholder="#"
                        style={baseInput}
                      />
                    </div>
                    {/* Preview */}
                    {card.image && (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "2px solid var(--border)",
                          margin: "0 auto",
                        }}
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* Add card button */}
      <button
        onClick={addCard}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          transition: "all 0.15s",
        }}
      >
        <Plus size={14} /> Add Card
      </button>

      {/* Slider Settings */}
      <div style={{ marginTop: "16px" }}>
        <SectionLabel>Slider Settings</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Visible Cards
            </label>
            <input
              type="number"
              value={Number(props.visibleCards ?? 3)}
              min={1}
              max={6}
              onChange={(e) => update("visibleCards", Number(e.target.value))}
              style={baseInput}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Gap (px)
            </label>
            <input
              type="number"
              value={Number(props.gap ?? 16)}
              min={0}
              max={48}
              onChange={(e) => update("gap", Number(e.target.value))}
              style={baseInput}
            />
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "var(--fg-secondary)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={(props.autoplay as boolean) ?? false}
              onChange={(e) => update("autoplay", e.target.checked)}
            />
            Autoplay
          </label>
          {Boolean(props.autoplay) && (
            <div>
              <label
                style={{
                  fontSize: "12px",
                  color: "var(--fg-faint)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Interval (ms)
              </label>
              <input
                type="number"
                value={Number(props.interval ?? 4000)}
                min={500}
                step={500}
                onChange={(e) => update("interval", Number(e.target.value))}
                style={baseInput}
              />
            </div>
          )}
        </div>
      </div>

      {/* Appearance */}
      <div style={{ marginTop: "16px" }}>
        <SectionLabel>Appearance</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Accent Color
            </label>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                type="color"
                value={String(props.accentColor ?? "#3b82f6")}
                onChange={(e) => update("accentColor", e.target.value)}
                style={{
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "none",
                }}
              />
              <input
                type="text"
                value={String(props.accentColor ?? "#3b82f6")}
                onChange={(e) => update("accentColor", e.target.value)}
                style={{ ...baseInput, flex: 1 }}
              />
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Card Background
            </label>
            <input
              type="text"
              value={String(props.cardBg ?? "rgba(255,255,255,0.08)")}
              onChange={(e) => update("cardBg", e.target.value)}
              placeholder="rgba(255,255,255,0.08)"
              style={baseInput}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--fg-faint)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Card Border Radius
            </label>
            <input
              type="text"
              value={String(props.cardBorderRadius ?? "16px")}
              onChange={(e) => update("cardBorderRadius", e.target.value)}
              placeholder="16px"
              style={baseInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Contact Form Content Panel ───────────────────────────────────────────────

interface ContactField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "date";
  placeholder: string;
  required: boolean;
  options?: string[];
}

const FIELD_TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "url", label: "URL" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
];

function ContactFormContentPanel({
  props,
  update,
}: {
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const rawFields = props.fields as (string | ContactField)[] | undefined;
  const fields: ContactField[] = (
    rawFields ?? ["name", "email", "message"]
  ).map((f) => {
    if (typeof f === "string") {
      return {
        name: f,
        label: f.charAt(0).toUpperCase() + f.slice(1),
        type:
          f === "email"
            ? ("email" as const)
            : f === "message"
              ? ("textarea" as const)
              : f === "phone"
                ? ("tel" as const)
                : ("text" as const),
        placeholder: `Your ${f}`,
        required: f === "name" || f === "email",
      };
    }
    return f;
  });

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const updateFields = (updated: ContactField[]) => update("fields", updated);

  const addField = () => {
    const idx = fields.length + 1;
    updateFields([
      ...fields,
      {
        name: `field_${idx}`,
        label: `Field ${idx}`,
        type: "text",
        placeholder: "",
        required: false,
      },
    ]);
    setExpandedIdx(fields.length);
  };

  const removeField = (idx: number) => {
    updateFields(fields.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const updateField = (
    idx: number,
    key: keyof ContactField,
    value: unknown,
  ) => {
    updateFields(
      fields.map((f, i) => (i === idx ? { ...f, [key]: value } : f)),
    );
  };

  const moveField = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= fields.length) return;
    const updated = [...fields];
    const temp = updated[idx];
    updated[idx] = updated[target];
    updated[target] = temp;
    updateFields(updated);
    setExpandedIdx(target);
  };

  const presetFields = [
    { name: "name", label: "Name", type: "text" as const },
    { name: "email", label: "Email", type: "email" as const },
    { name: "phone", label: "Phone", type: "tel" as const },
    { name: "subject", label: "Subject", type: "text" as const },
    { name: "message", label: "Message", type: "textarea" as const },
    { name: "company", label: "Company", type: "text" as const },
    { name: "website", label: "Website", type: "url" as const },
    { name: "date", label: "Date", type: "date" as const },
  ];

  const addPreset = (preset: (typeof presetFields)[0]) => {
    updateFields([
      ...fields,
      {
        ...preset,
        placeholder: `Your ${preset.label.toLowerCase()}`,
        required: false,
      },
    ]);
  };

  return (
    <div style={{ padding: "12px" }}>
      {/* Heading & Subtext */}
      <SectionLabel>Form Header</SectionLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Heading
          </label>
          <input
            type="text"
            value={String(props.heading ?? "Get in touch")}
            onChange={(e) => update("heading", e.target.value)}
            placeholder="Form heading"
            style={baseInput}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Subtext
          </label>
          <input
            type="text"
            value={String(props.subtext ?? "")}
            onChange={(e) => update("subtext", e.target.value)}
            placeholder="Optional subtitle"
            style={baseInput}
          />
        </div>
      </div>

      {/* Fields */}
      <SectionLabel>Fields ({fields.length})</SectionLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {fields.map((field, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 8px",
                cursor: "pointer",
                background:
                  expandedIdx === idx ? "var(--accent-muted)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              <GripVertical size={12} style={{ opacity: 0.3, flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  fontSize: "12px",
                  color: "var(--fg-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {field.label}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--fg-ghost)",
                  flexShrink: 0,
                  padding: "1px 6px",
                  borderRadius: "4px",
                  background: "var(--pill-bg)",
                }}
              >
                {field.type}
              </span>
              {field.required && (
                <span
                  style={{ fontSize: "10px", color: "#ef4444", flexShrink: 0 }}
                >
                  *
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveField(idx, -1);
                }}
                disabled={idx === 0}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === 0 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveField(idx, 1);
                }}
                disabled={idx === fields.length - 1}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === fields.length - 1 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeField(idx);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {expandedIdx === idx && (
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(idx, "label", e.target.value)}
                    style={baseInput}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(idx, "name", e.target.value)}
                    placeholder="field_name"
                    style={baseInput}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Type
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(idx, "type", e.target.value)}
                    style={{ ...baseInput, cursor: "pointer" }}
                  >
                    {FIELD_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={field.placeholder}
                    onChange={(e) =>
                      updateField(idx, "placeholder", e.target.value)
                    }
                    placeholder="Placeholder text"
                    style={baseInput}
                  />
                </div>
                {field.type === "select" && (
                  <div>
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--fg-faint)",
                        display: "block",
                        marginBottom: "3px",
                      }}
                    >
                      Options (one per line)
                    </label>
                    <textarea
                      value={(field.options ?? []).join("\n")}
                      onChange={(e) =>
                        updateField(idx, "options", e.target.value.split("\n"))
                      }
                      placeholder={"Option 1\nOption 2\nOption 3"}
                      rows={3}
                      style={{ ...baseInput, resize: "vertical" }}
                    />
                  </div>
                )}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "var(--fg-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(idx, "required", e.target.checked)
                    }
                  />
                  Required
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add field */}
      <button
        onClick={addField}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          transition: "all 0.15s",
          marginBottom: "8px",
        }}
      >
        <Plus size={14} /> Add Field
      </button>

      {/* Quick add presets */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          marginBottom: "16px",
        }}
      >
        {presetFields
          .filter((p) => !fields.some((f) => f.name === p.name))
          .map((p) => (
            <button
              key={p.name}
              onClick={() => addPreset(p)}
              style={{
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "11px",
                cursor: "pointer",
                background: "var(--pill-bg)",
                border: "1px solid var(--border)",
                color: "var(--fg-secondary)",
                transition: "all 0.15s",
              }}
            >
              + {p.label}
            </button>
          ))}
      </div>

      {/* Button Settings */}
      <SectionLabel>Button</SectionLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Button Text
          </label>
          <input
            type="text"
            value={String(props.buttonText ?? "Send Message")}
            onChange={(e) => update("buttonText", e.target.value)}
            style={baseInput}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Button Style
          </label>
          <select
            value={String(props.buttonStyle ?? "filled")}
            onChange={(e) => update("buttonStyle", e.target.value)}
            style={{ ...baseInput, cursor: "pointer" }}
          >
            <option value="filled">Filled</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={Boolean(props.buttonFullWidth)}
            onChange={(e) => update("buttonFullWidth", e.target.checked)}
          />
          Full-width button
        </label>
      </div>

      {/* Layout */}
      <SectionLabel>Layout</SectionLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Field Gap
          </label>
          <input
            type="number"
            value={Number(props.fieldGap ?? 16)}
            min={0}
            max={48}
            onChange={(e) => update("fieldGap", Number(e.target.value))}
            style={baseInput}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Label Position
          </label>
          <select
            value={String(props.labelPosition ?? "top")}
            onChange={(e) => update("labelPosition", e.target.value)}
            style={{ ...baseInput, cursor: "pointer" }}
          >
            <option value="top">Above field</option>
            <option value="inline">Inline (left)</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Input Border Radius
          </label>
          <input
            type="text"
            value={String(props.inputRadius ?? "8px")}
            onChange={(e) => update("inputRadius", e.target.value)}
            placeholder="8px"
            style={baseInput}
          />
        </div>
      </div>

      {/* Success Message */}
      <SectionLabel>After Submit</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Success Message
          </label>
          <input
            type="text"
            value={String(
              props.successMessage ?? "Thank you! We'll be in touch.",
            )}
            onChange={(e) => update("successMessage", e.target.value)}
            style={baseInput}
          />
        </div>
      </div>
    </div>
  );
}

// ── Map Content Panel ────────────────────────────────────────────────────────
function MapContentPanel({
  props,
  update,
}: {
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const [iframeInput, setIframeInput] = useState("");
  const [pasteError, setPasteError] = useState("");

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    fontSize: "13px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const extractSrcFromIframe = (code: string) => {
    const match = code.match(/src=["']([^"']+)["']/);
    if (!match) return null;
    return match[1].replace(/&amp;/g, "&");
  };

  const handleIframePaste = () => {
    const trimmed = iframeInput.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("http")) {
      update("src", trimmed);
      setIframeInput("");
      setPasteError("");
      return;
    }

    const src = extractSrcFromIframe(trimmed);
    if (src) {
      update("src", src);
      setIframeInput("");
      setPasteError("");
    } else {
      setPasteError("Could not find a valid src in the iframe code");
    }
  };

  return (
    <div style={{ padding: "12px" }}>
      <SectionLabel>Embed from Google Maps</SectionLabel>

      <div
        style={{
          padding: "12px",
          borderRadius: "10px",
          background: "var(--accent-muted)",
          border: "1px solid var(--accent-border)",
          marginBottom: "14px",
        }}
      >
        <label
          style={{
            fontSize: "12px",
            color: "var(--fg-secondary)",
            display: "block",
            marginBottom: "6px",
            fontWeight: 600,
          }}
        >
          Paste Google Maps Iframe
        </label>
        <textarea
          value={iframeInput}
          onChange={(e) => {
            setIframeInput(e.target.value);
            setPasteError("");
          }}
          placeholder={
            '<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
          }
          rows={3}
          style={{
            ...baseInput,
            resize: "vertical",
            fontSize: "11px",
            fontFamily: "monospace",
          }}
        />
        {pasteError && (
          <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>
            {pasteError}
          </div>
        )}
        <button
          onClick={handleIframePaste}
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "7px",
            borderRadius: "8px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            opacity: iframeInput.trim() ? 1 : 0.5,
            transition: "opacity 0.15s",
          }}
          disabled={!iframeInput.trim()}
        >
          Extract & Apply
        </button>
        <div
          style={{
            fontSize: "10px",
            color: "var(--fg-ghost)",
            marginTop: "6px",
            lineHeight: 1.4,
          }}
        >
          Go to Google Maps → Share → Embed a map → Copy the iframe code and
          paste it above
        </div>
      </div>

      <SectionLabel>Content</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label
            style={{
              fontSize: "12px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Map Embed URL
          </label>
          <input
            type="url"
            value={String(props.src ?? "")}
            onChange={(e) => update("src", e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
            style={baseInput}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "12px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Address
          </label>
          <input
            type="text"
            value={String(props.address ?? "")}
            onChange={(e) => update("address", e.target.value)}
            placeholder="New York, NY"
            style={baseInput}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "12px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Zoom Level
          </label>
          <input
            type="number"
            value={Number(props.zoom ?? 14)}
            onChange={(e) => update("zoom", Number(e.target.value))}
            min={1}
            max={21}
            style={baseInput}
          />
        </div>
      </div>

      {Boolean(props.src) && (
        <div style={{ marginTop: "14px" }}>
          <SectionLabel>Preview</SectionLabel>
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              height: "150px",
            }}
          >
            <iframe
              src={String(props.src)}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Map preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Table Content Panel ──────────────────────────────────────────────────────
function TableContentPanel({
  props,
  update,
}: {
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const headers = (props.headers as string[] | undefined) ?? [
    "Column 1",
    "Column 2",
    "Column 3",
  ];
  const rows = (props.rows as string[][] | undefined) ?? [];
  const [editingCell, setEditingCell] = useState<{
    r: number;
    c: number;
  } | null>(null);
  const [editingHeader, setEditingHeader] = useState<number | null>(null);

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "6px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map((row) => [...row, ""]);
    update("headers", newHeaders);
    update("rows", newRows);
  };

  const removeColumn = (ci: number) => {
    if (headers.length <= 1) return;
    update(
      "headers",
      headers.filter((_, i) => i !== ci),
    );
    update(
      "rows",
      rows.map((row) => row.filter((_, i) => i !== ci)),
    );
  };

  const addRow = () => {
    update("rows", [...rows, headers.map(() => "")]);
  };

  const removeRow = (ri: number) => {
    update(
      "rows",
      rows.filter((_, i) => i !== ri),
    );
  };

  const updateHeader = (ci: number, value: string) => {
    update(
      "headers",
      headers.map((h, i) => (i === ci ? value : h)),
    );
  };

  const updateCell = (ri: number, ci: number, value: string) => {
    update(
      "rows",
      rows.map((row, r) =>
        r === ri ? row.map((cell, c) => (c === ci ? value : cell)) : row,
      ),
    );
  };

  const duplicateRow = (ri: number) => {
    const newRows = [...rows];
    newRows.splice(ri + 1, 0, [...rows[ri]]);
    update("rows", newRows);
  };

  const moveRow = (ri: number, dir: -1 | 1) => {
    const target = ri + dir;
    if (target < 0 || target >= rows.length) return;
    const newRows = [...rows];
    const temp = newRows[ri];
    newRows[ri] = newRows[target];
    newRows[target] = temp;
    update("rows", newRows);
  };

  return (
    <div style={{ padding: "12px" }}>
      {/* Heading */}
      <SectionLabel>Table Heading</SectionLabel>
      <input
        type="text"
        value={(props.heading as string) ?? ""}
        onChange={(e) => update("heading", e.target.value)}
        placeholder="Optional table heading"
        style={{ ...baseInput, marginBottom: "12px" }}
      />

      {/* Caption */}
      <SectionLabel>Caption</SectionLabel>
      <input
        type="text"
        value={(props.caption as string) ?? ""}
        onChange={(e) => update("caption", e.target.value)}
        placeholder="Optional table caption"
        style={{ ...baseInput, marginBottom: "16px" }}
      />

      {/* Columns */}
      <SectionLabel>Columns ({headers.length})</SectionLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginBottom: "8px",
        }}
      >
        {headers.map((h, ci) => (
          <div
            key={ci}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            {editingHeader === ci ? (
              <input
                type="text"
                value={h}
                onChange={(e) => updateHeader(ci, e.target.value)}
                onBlur={() => setEditingHeader(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingHeader(null);
                }}
                autoFocus
                style={{ ...baseInput, flex: 1 }}
              />
            ) : (
              <div
                onClick={() => setEditingHeader(ci)}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  background: "var(--pill-bg)",
                  cursor: "text",
                  fontWeight: 600,
                  color: "var(--fg-secondary)",
                  border: "1px solid transparent",
                }}
              >
                {h || `Column ${ci + 1}`}
              </div>
            )}
            <button
              onClick={() => removeColumn(ci)}
              disabled={headers.length <= 1}
              style={{
                background: "none",
                border: "none",
                cursor: headers.length <= 1 ? "default" : "pointer",
                padding: "2px",
                color: "#ef4444",
                opacity: headers.length <= 1 ? 0.3 : 0.7,
                flexShrink: 0,
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addColumn}
        style={{
          width: "100%",
          padding: "6px",
          borderRadius: "6px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "11px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          marginBottom: "16px",
        }}
      >
        <Plus size={12} /> Add Column
      </button>

      {/* Rows */}
      <SectionLabel>Rows ({rows.length})</SectionLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "8px",
        }}
      >
        {rows.length === 0 && (
          <div
            style={{
              padding: "16px 12px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              color: "var(--fg-ghost)",
              fontSize: "12px",
            }}
          >
            No rows yet. Click &quot;Add Row&quot; below.
          </div>
        )}

        {rows.map((row, ri) => (
          <div
            key={ri}
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              overflow: "hidden",
            }}
          >
            {/* Row header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 6px",
                background: "var(--pill-bg)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--fg-faint)",
                }}
              >
                Row {ri + 1}
              </span>
              <button
                onClick={() => moveRow(ri, -1)}
                disabled={ri === 0}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "1px",
                  opacity: ri === 0 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronUp size={12} />
              </button>
              <button
                onClick={() => moveRow(ri, 1)}
                disabled={ri === rows.length - 1}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "1px",
                  opacity: ri === rows.length - 1 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronDown size={12} />
              </button>
              <button
                onClick={() => duplicateRow(ri)}
                title="Duplicate row"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "1px",
                  opacity: 0.7,
                  color: "var(--fg-faint)",
                  fontSize: "11px",
                }}
              >
                ⧉
              </button>
              <button
                onClick={() => removeRow(ri)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "1px",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>

            {/* Row cells */}
            <div
              style={{
                padding: "6px",
                display: "grid",
                gridTemplateColumns: `repeat(${headers.length}, 1fr)`,
                gap: "4px",
              }}
            >
              {row.map((cell, ci) => (
                <div key={ci}>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "var(--fg-ghost)",
                      marginBottom: "2px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    {headers[ci]}
                  </div>
                  {editingCell?.r === ri && editingCell?.c === ci ? (
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingCell(null);
                        if (e.key === "Tab") {
                          e.preventDefault();
                          setEditingCell(
                            ci < headers.length - 1
                              ? { r: ri, c: ci + 1 }
                              : ri < rows.length - 1
                                ? { r: ri + 1, c: 0 }
                                : null,
                          );
                        }
                      }}
                      autoFocus
                      style={{
                        ...baseInput,
                        fontSize: "11px",
                        padding: "4px 6px",
                      }}
                    />
                  ) : (
                    <div
                      onClick={() => setEditingCell({ r: ri, c: ci })}
                      style={{
                        padding: "4px 6px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        minHeight: "22px",
                        background: "var(--input-bg)",
                        border: "1px solid var(--input-border)",
                        cursor: "text",
                        color: cell ? "var(--input-fg)" : "var(--fg-ghost)",
                      }}
                    >
                      {cell || "—"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        style={{
          width: "100%",
          padding: "7px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginBottom: "16px",
        }}
      >
        <Plus size={14} /> Add Row
      </button>

      {/* Settings */}
      <SectionLabel>Table Settings</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={(props.striped as boolean) ?? true}
            onChange={(e) => update("striped", e.target.checked)}
          />
          Striped Rows
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={(props.bordered as boolean) ?? false}
            onChange={(e) => update("bordered", e.target.checked)}
          />
          Bordered Cells
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={(props.compact as boolean) ?? false}
            onChange={(e) => update("compact", e.target.checked)}
          />
          Compact
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={(props.hoverable as boolean) ?? false}
            onChange={(e) => update("hoverable", e.target.checked)}
          />
          Hover Highlight
        </label>
      </div>
    </div>
  );
}

// ── Tabs Content Panel (syncs tab labels with tab pane children) ─────────────
function TabsContentPanel({
  node,
  props,
  update,
}: {
  node: ComponentNode;
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const { addNode, removeNode, moveNode } = useEditorStore();
  const tabs = (props.tabs as { label: string }[] | undefined) ?? [];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const addTab = () => {
    const newTabs = [...tabs, { label: `Tab ${tabs.length + 1}` }];
    update("tabs", newTabs);
    const paneNode: ComponentNode = {
      id: generateId(),
      type: "container" as ComponentType,
      name: `Tab Pane ${newTabs.length}`,
      props: {},
      styles: {
        desktop: { width: "100%", minHeight: "60px" },
        tablet: {},
        mobile: {},
      },
      animations: [],
      children: [],
      locked: false,
      hidden: false,
      parentId: node.id,
    };
    addNode(paneNode, node.id);
  };

  const removeTab = (idx: number) => {
    const newTabs = tabs.filter((_, i) => i !== idx);
    update("tabs", newTabs);
    const paneChild = node.children[idx];
    if (paneChild) {
      removeNode(paneChild.id);
    }
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const updateTabLabel = (idx: number, label: string) => {
    const newTabs = tabs.map((t, i) => (i === idx ? { ...t, label } : t));
    update("tabs", newTabs);
  };

  const moveTab = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= tabs.length) return;
    const newTabs = [...tabs];
    const temp = newTabs[idx];
    newTabs[idx] = newTabs[target];
    newTabs[target] = temp;
    update("tabs", newTabs);
    const movingChild = node.children[idx];
    if (movingChild) {
      moveNode(movingChild.id, node.id, target);
    }
    setExpandedIdx(target);
  };

  return (
    <div style={{ padding: "12px" }}>
      <SectionLabel>Tabs ({tabs.length})</SectionLabel>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {tabs.length === 0 && (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              color: "var(--fg-ghost)",
              fontSize: "12px",
            }}
          >
            No tabs yet
          </div>
        )}

        {tabs.map((tab, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 8px",
                cursor: "pointer",
                background:
                  expandedIdx === idx ? "var(--accent-muted)" : "transparent",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: "12px",
                  color: "var(--fg-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label || `Tab ${idx + 1}`}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--fg-ghost)",
                  flexShrink: 0,
                }}
              >
                {node.children[idx]?.children.length ?? 0} items
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveTab(idx, -1);
                }}
                disabled={idx === 0}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === 0 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveTab(idx, 1);
                }}
                disabled={idx === tabs.length - 1}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === tabs.length - 1 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(idx);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {expandedIdx === idx && (
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--fg-faint)",
                      display: "block",
                      marginBottom: "3px",
                    }}
                  >
                    Tab Label
                  </label>
                  <input
                    type="text"
                    value={tab.label}
                    onChange={(e) => updateTabLabel(idx, e.target.value)}
                    style={baseInput}
                  />
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--fg-ghost)",
                    padding: "8px",
                    background: "var(--pill-bg)",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  Drop components into this tab on the canvas to add content
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addTab}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        <Plus size={14} /> Add Tab
      </button>
    </div>
  );
}

// ── Navbar Content Panel (nested links support) ──────────────────────────────

interface NavLinkItem {
  text: string;
  href: string;
  disabled?: boolean;
  children?: NavLinkItem[];
}

function NavbarContentPanel({
  props,
  update,
}: {
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const links = (props.links as NavLinkItem[] | undefined) ?? [];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [expandedSubIdx, setExpandedSubIdx] = useState<number | null>(null);

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const updateLinks = (newLinks: NavLinkItem[]) => update("links", newLinks);

  const addLink = () => {
    updateLinks([...links, { text: "New Link", href: "#" }]);
  };

  const removeLink = (idx: number) => {
    updateLinks(links.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const updateLink = (idx: number, field: string, value: unknown) => {
    updateLinks(
      links.map((l, i) => (i === idx ? { ...l, [field]: value } : l)),
    );
  };

  const moveLink = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= links.length) return;
    const newLinks = [...links];
    const temp = newLinks[idx];
    newLinks[idx] = newLinks[target];
    newLinks[target] = temp;
    updateLinks(newLinks);
    setExpandedIdx(target);
  };

  const addSubLink = (parentIdx: number) => {
    const newLinks = links.map((l, i) => {
      if (i !== parentIdx) return l;
      return {
        ...l,
        children: [...(l.children ?? []), { text: "Sub Link", href: "#" }],
      };
    });
    updateLinks(newLinks);
  };

  const removeSubLink = (parentIdx: number, subIdx: number) => {
    const newLinks = links.map((l, i) => {
      if (i !== parentIdx) return l;
      const newChildren = (l.children ?? []).filter((_, si) => si !== subIdx);
      return {
        ...l,
        children: newChildren.length > 0 ? newChildren : undefined,
      };
    });
    updateLinks(newLinks);
  };

  const updateSubLink = (
    parentIdx: number,
    subIdx: number,
    field: string,
    value: string,
  ) => {
    const newLinks = links.map((l, i) => {
      if (i !== parentIdx) return l;
      const newChildren = (l.children ?? []).map((c, si) =>
        si === subIdx ? { ...c, [field]: value } : c,
      );
      return { ...l, children: newChildren };
    });
    updateLinks(newLinks);
  };

  const moveSubLink = (parentIdx: number, subIdx: number, dir: -1 | 1) => {
    const parent = links[parentIdx];
    if (!parent.children) return;
    const target = subIdx + dir;
    if (target < 0 || target >= parent.children.length) return;
    const newChildren = [...parent.children];
    const temp = newChildren[subIdx];
    newChildren[subIdx] = newChildren[target];
    newChildren[target] = temp;
    const newLinks = links.map((l, i) =>
      i === parentIdx ? { ...l, children: newChildren } : l,
    );
    updateLinks(newLinks);
    setExpandedSubIdx(target);
  };

  return (
    <div style={{ padding: "12px" }}>
      {/* Settings */}
      <SectionLabel>Settings</SectionLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <div>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            Brand Name
          </label>
          <input
            type="text"
            value={String(props.brand ?? "")}
            onChange={(e) => update("brand", e.target.value)}
            style={baseInput}
          />
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={(props.sticky as boolean) ?? false}
            onChange={(e) => update("sticky", e.target.checked)}
          />
          Sticky
        </label>
      </div>

      {/* Nav Links */}
      <SectionLabel>Nav Links ({links.length})</SectionLabel>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {links.length === 0 && (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              color: "var(--fg-ghost)",
              fontSize: "12px",
            }}
          >
            No links yet
          </div>
        )}

        {links.map((link, idx) => {
          const hasChildren = link.children && link.children.length > 0;
          return (
            <div
              key={idx}
              style={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
                overflow: "hidden",
              }}
            >
              {/* Link header row */}
              <div
                onClick={() => {
                  setExpandedIdx(expandedIdx === idx ? null : idx);
                  setExpandedSubIdx(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 8px",
                  cursor: "pointer",
                  background:
                    expandedIdx === idx ? "var(--accent-muted)" : "transparent",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontSize: "12px",
                    color: "var(--fg-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {link.text || `Link ${idx + 1}`}
                  {hasChildren && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--fg-ghost)",
                        background: "var(--pill-bg)",
                        padding: "1px 5px",
                        borderRadius: "4px",
                      }}
                    >
                      {link.children!.length} sub
                    </span>
                  )}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLink(idx, -1);
                  }}
                  disabled={idx === 0}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    opacity: idx === 0 ? 0.3 : 0.7,
                    color: "var(--fg-faint)",
                  }}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLink(idx, 1);
                  }}
                  disabled={idx === links.length - 1}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    opacity: idx === links.length - 1 ? 0.3 : 0.7,
                    color: "var(--fg-faint)",
                  }}
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLink(idx);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    color: "#ef4444",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Expanded edit fields */}
              {expandedIdx === idx && (
                <div
                  style={{
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--fg-faint)",
                        display: "block",
                        marginBottom: "3px",
                      }}
                    >
                      Link Text
                    </label>
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) => updateLink(idx, "text", e.target.value)}
                      style={baseInput}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--fg-faint)",
                        display: "block",
                        marginBottom: "3px",
                      }}
                    >
                      URL
                    </label>
                    <input
                      type="url"
                      value={link.href ?? ""}
                      onChange={(e) => updateLink(idx, "href", e.target.value)}
                      placeholder="#"
                      style={{ ...baseInput, opacity: link.disabled ? 0.4 : 1 }}
                      disabled={!!link.disabled}
                    />
                  </div>

                  {/* Disable link toggle (useful when link is just a dropdown trigger) */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      color: "var(--fg-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!link.disabled}
                      onChange={(e) =>
                        updateLink(idx, "disabled", !e.target.checked)
                      }
                    />
                    Link is clickable
                  </label>

                  {/* Nested / Sub-links section */}
                  <div
                    style={{
                      marginTop: "4px",
                      paddingTop: "8px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--fg-faint)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Dropdown Items ({link.children?.length ?? 0})
                      </span>
                    </div>

                    {/* Sub-link list */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginBottom: "6px",
                      }}
                    >
                      {(link.children ?? []).map((child, si) => (
                        <div
                          key={si}
                          style={{
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            background: "var(--pill-bg)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            onClick={() =>
                              setExpandedSubIdx(
                                expandedSubIdx === si ? null : si,
                              )
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 6px",
                              cursor: "pointer",
                              background:
                                expandedSubIdx === si
                                  ? "var(--accent-muted)"
                                  : "transparent",
                            }}
                          >
                            <span
                              style={{
                                width: "12px",
                                textAlign: "center",
                                color: "var(--fg-ghost)",
                                fontSize: "10px",
                                flexShrink: 0,
                              }}
                            >
                              ↳
                            </span>
                            <span
                              style={{
                                flex: 1,
                                fontSize: "11px",
                                color: "var(--fg-secondary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {child.text || `Sub-link ${si + 1}`}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSubLink(idx, si, -1);
                              }}
                              disabled={si === 0}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "1px",
                                opacity: si === 0 ? 0.3 : 0.7,
                                color: "var(--fg-faint)",
                              }}
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSubLink(idx, si, 1);
                              }}
                              disabled={si === (link.children?.length ?? 0) - 1}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "1px",
                                opacity:
                                  si === (link.children?.length ?? 0) - 1
                                    ? 0.3
                                    : 0.7,
                                color: "var(--fg-faint)",
                              }}
                            >
                              <ChevronDown size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSubLink(idx, si);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "1px",
                                color: "#ef4444",
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {expandedSubIdx === si && (
                            <div
                              style={{
                                padding: "6px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                borderTop: "1px solid var(--border)",
                              }}
                            >
                              <div>
                                <label
                                  style={{
                                    fontSize: "10px",
                                    color: "var(--fg-ghost)",
                                    display: "block",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Text
                                </label>
                                <input
                                  type="text"
                                  value={child.text}
                                  onChange={(e) =>
                                    updateSubLink(
                                      idx,
                                      si,
                                      "text",
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    ...baseInput,
                                    fontSize: "11px",
                                    padding: "5px 8px",
                                  }}
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    fontSize: "10px",
                                    color: "var(--fg-ghost)",
                                    display: "block",
                                    marginBottom: "2px",
                                  }}
                                >
                                  URL
                                </label>
                                <input
                                  type="url"
                                  value={child.href ?? ""}
                                  onChange={(e) =>
                                    updateSubLink(
                                      idx,
                                      si,
                                      "href",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="#"
                                  style={{
                                    ...baseInput,
                                    fontSize: "11px",
                                    padding: "5px 8px",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => addSubLink(idx)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        background: "transparent",
                        border: "1px dashed var(--border)",
                        color: "var(--fg-faint)",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <Plus size={12} /> Add Dropdown Item
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={addLink}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        <Plus size={14} /> Add Link
      </button>
    </div>
  );
}

// ── List-Based Content Panel ─────────────────────────────────────────────────
interface ListFieldConfig {
  key: string;
  label: string;
  itemLabel: string;
  fields: {
    key: string;
    label: string;
    type: "text" | "textarea" | "url" | "select" | "boolean" | "number";
    options?: string[];
  }[];
  nameField: string;
  extraFields?: ContentFieldDef[];
}

function getListConfig(type: string): ListFieldConfig | null {
  switch (type) {
    case "timeline":
      return {
        key: "items",
        label: "Timeline Items",
        itemLabel: "Event",
        nameField: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "date", label: "Date", type: "text" },
        ],
      };
    case "tabs":
      return {
        key: "tabs",
        label: "Tabs",
        itemLabel: "Tab",
        nameField: "label",
        fields: [{ key: "label", label: "Tab Label", type: "text" }],
      };
    case "accordion":
      return null;
    case "accordion-item":
      return null;
    case "accordion-legacy":
      return {
        key: "items",
        label: "Accordion Items",
        itemLabel: "Item",
        nameField: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "content", label: "Content", type: "textarea" },
        ],
        extraFields: [
          {
            key: "allowMultiple",
            label: "Allow Multiple Open",
            type: "boolean",
          },
        ],
      };
    case "steps":
      return {
        key: "steps",
        label: "Steps",
        itemLabel: "Step",
        nameField: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
        extraFields: [
          { key: "currentStep", label: "Current Step", type: "number" },
        ],
      };
    case "breadcrumb":
      return {
        key: "items",
        label: "Breadcrumb Items",
        itemLabel: "Crumb",
        nameField: "text",
        fields: [
          { key: "text", label: "Text", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
      };
    case "sidebar-nav":
      return {
        key: "links",
        label: "Nav Links",
        itemLabel: "Link",
        nameField: "text",
        fields: [
          { key: "text", label: "Text", type: "text" },
          { key: "href", label: "URL", type: "url" },
          { key: "active", label: "Active", type: "boolean" },
        ],
        extraFields: [{ key: "title", label: "Title", type: "text" }],
      };
    case "menu":
      return {
        key: "links",
        label: "Menu Links",
        itemLabel: "Link",
        nameField: "text",
        fields: [
          { key: "text", label: "Text", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
        extraFields: [
          {
            key: "direction",
            label: "Direction",
            type: "select",
            options: ["horizontal", "vertical"],
          },
        ],
      };
    case "social-links":
      return {
        key: "links",
        label: "Social Links",
        itemLabel: "Link",
        nameField: "platform",
        fields: [
          {
            key: "platform",
            label: "Platform",
            type: "select",
            options: [
              "twitter",
              "github",
              "linkedin",
              "instagram",
              "facebook",
              "youtube",
              "tiktok",
              "dribbble",
              "behance",
            ],
          },
          { key: "url", label: "URL", type: "url" },
        ],
        extraFields: [{ key: "size", label: "Icon Size", type: "number" }],
      };
    case "tag-group":
      return {
        key: "tags",
        label: "Tags",
        itemLabel: "Tag",
        nameField: "_value",
        fields: [],
        extraFields: [
          {
            key: "variant",
            label: "Variant",
            type: "select",
            options: [
              "primary",
              "secondary",
              "success",
              "warning",
              "error",
              "neutral",
            ],
          },
        ],
      };
    case "list":
      return {
        key: "items",
        label: "List Items",
        itemLabel: "Item",
        nameField: "_value",
        fields: [],
        extraFields: [
          { key: "ordered", label: "Ordered (numbered)", type: "boolean" },
        ],
      };
    case "marquee":
      return {
        key: "items",
        label: "Marquee Items",
        itemLabel: "Item",
        nameField: "_value",
        fields: [],
        extraFields: [
          { key: "speed", label: "Speed (s)", type: "number" },
          {
            key: "direction",
            label: "Direction",
            type: "select",
            options: ["left", "right"],
          },
          { key: "separator", label: "Separator", type: "text" },
        ],
      };
    case "statistics":
      return {
        key: "items",
        label: "Stats",
        itemLabel: "Stat",
        nameField: "label",
        fields: [
          { key: "value", label: "Value", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      };
    case "features":
      return {
        key: "items",
        label: "Features",
        itemLabel: "Feature",
        nameField: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
        extraFields: [
          { key: "heading", label: "Section Heading", type: "textarea" },
        ],
      };
    case "testimonials":
      return {
        key: "items",
        label: "Testimonials",
        itemLabel: "Testimonial",
        nameField: "name",
        fields: [
          { key: "quote", label: "Quote", type: "textarea" },
          { key: "name", label: "Name", type: "text" },
          { key: "role", label: "Role", type: "text" },
        ],
        extraFields: [
          { key: "heading", label: "Section Heading", type: "textarea" },
        ],
      };
    case "faq":
      return {
        key: "items",
        label: "Questions",
        itemLabel: "Question",
        nameField: "question",
        fields: [
          { key: "question", label: "Question", type: "text" },
          { key: "answer", label: "Answer", type: "textarea" },
        ],
        extraFields: [
          { key: "heading", label: "Section Heading", type: "textarea" },
        ],
      };
    case "pricing":
      return {
        key: "plans",
        label: "Plans",
        itemLabel: "Plan",
        nameField: "name",
        fields: [
          { key: "name", label: "Plan Name", type: "text" },
          { key: "price", label: "Price", type: "text" },
          { key: "period", label: "Period", type: "text" },
          { key: "description", label: "Description", type: "text" },
          { key: "popular", label: "Popular", type: "boolean" },
        ],
        extraFields: [
          { key: "heading", label: "Section Heading", type: "textarea" },
        ],
      };
    case "logos":
      return {
        key: "logos",
        label: "Logos",
        itemLabel: "Logo",
        nameField: "name",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "src", label: "Image URL", type: "url" },
        ],
        extraFields: [{ key: "heading", label: "Heading", type: "text" }],
      };
    case "team":
      return {
        key: "members",
        label: "Team Members",
        itemLabel: "Member",
        nameField: "name",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "role", label: "Role", type: "text" },
          { key: "avatar", label: "Avatar URL", type: "url" },
        ],
        extraFields: [{ key: "heading", label: "Heading", type: "text" }],
      };
    case "bento-grid":
      return {
        key: "items",
        label: "Grid Items",
        itemLabel: "Item",
        nameField: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          {
            key: "span",
            label: "Column Span",
            type: "select",
            options: ["1", "2", "3"],
          },
          {
            key: "rowSpan",
            label: "Row Span",
            type: "select",
            options: ["1", "2"],
          },
        ],
      };
    case "footer":
      return {
        key: "links",
        label: "Footer Links",
        itemLabel: "Link",
        nameField: "text",
        fields: [
          { key: "text", label: "Text", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
        extraFields: [
          { key: "brand", label: "Brand Name", type: "text" },
          { key: "copyright", label: "Copyright", type: "text" },
        ],
      };
    case "horizontal-scroll":
      return {
        key: "cards",
        label: "Scroll Cards",
        itemLabel: "Card",
        nameField: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "category", label: "Category", type: "text" },
          { key: "src", label: "Video URL", type: "url" },
          { key: "placeholder", label: "Image URL", type: "url" },
        ],
      };
    case "vertical-scroll-cards":
      return {
        key: "cards",
        label: "Content Cards",
        itemLabel: "Card",
        nameField: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      };
    default:
      return null;
  }
}

function ListBasedContentPanel({
  type,
  props,
  update,
}: {
  type: string;
  props: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const config = getListConfig(type);
  if (!config) return null;

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const isStringArray = config.fields.length === 0;

  const rawItems = (props[config.key] as unknown[]) ?? [];
  const items: unknown[] = rawItems;

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
    boxSizing: "border-box",
  };

  const addItem = () => {
    if (isStringArray) {
      update(config.key, [...items, "New item"]);
    } else {
      const newItem: Record<string, unknown> = {};
      config.fields.forEach((f) => {
        newItem[f.key] = "";
      });
      update(config.key, [...items, newItem]);
      setExpandedIdx(items.length);
    }
  };

  const removeItem = (idx: number) => {
    update(
      config.key,
      items.filter((_, i) => i !== idx),
    );
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[target];
    updated[target] = temp;
    update(config.key, updated);
    setExpandedIdx(target);
  };

  const updateItem = (idx: number, field: string, value: unknown) => {
    if (isStringArray) {
      update(
        config.key,
        items.map((item, i) => (i === idx ? value : item)),
      );
    } else {
      update(
        config.key,
        items.map((item, i) =>
          i === idx
            ? { ...(item as Record<string, unknown>), [field]: value }
            : item,
        ),
      );
    }
  };

  const getItemName = (item: unknown, idx: number): string => {
    if (isStringArray) return String(item) || `${config.itemLabel} ${idx + 1}`;
    if (config.nameField === "_value")
      return String(item) || `${config.itemLabel} ${idx + 1}`;
    const obj = item as Record<string, unknown>;
    return (
      (obj[config.nameField] as string) || `${config.itemLabel} ${idx + 1}`
    );
  };

  const renderExtraField = (field: ContentFieldDef) => {
    const val = props[field.key];
    if (field.type === "boolean") {
      return (
        <label
          key={field.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={(val as boolean) ?? false}
            onChange={(e) => update(field.key, e.target.checked)}
          />
          {field.label}
        </label>
      );
    }
    if (field.type === "select" && field.options) {
      return (
        <div key={field.key}>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            {field.label}
          </label>
          <select
            value={String(val ?? "")}
            onChange={(e) => update(field.key, e.target.value)}
            style={{ ...baseInput, cursor: "pointer" }}
          >
            {field.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    }
    if (field.type === "textarea") {
      return (
        <div key={field.key}>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            {field.label}
          </label>
          <textarea
            value={String(val ?? "")}
            onChange={(e) => update(field.key, e.target.value)}
            rows={3}
            style={{ ...baseInput, resize: "vertical" }}
          />
        </div>
      );
    }
    if (field.type === "number") {
      return (
        <div key={field.key}>
          <label
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              display: "block",
              marginBottom: "3px",
            }}
          >
            {field.label}
          </label>
          <input
            type="number"
            value={Number(val ?? 0)}
            onChange={(e) => update(field.key, Number(e.target.value))}
            style={baseInput}
          />
        </div>
      );
    }
    return (
      <div key={field.key}>
        <label
          style={{
            fontSize: "11px",
            color: "var(--fg-faint)",
            display: "block",
            marginBottom: "3px",
          }}
        >
          {field.label}
        </label>
        <input
          type={field.type === "url" ? "url" : "text"}
          value={String(val ?? "")}
          onChange={(e) => update(field.key, e.target.value)}
          placeholder={field.placeholder}
          style={baseInput}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: "12px" }}>
      {/* Extra fields (heading, settings, etc.) */}
      {config.extraFields && config.extraFields.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionLabel>Settings</SectionLabel>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {config.extraFields.map(renderExtraField)}
          </div>
        </div>
      )}

      {/* Items list */}
      <SectionLabel>
        {config.label} ({items.length})
      </SectionLabel>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {items.length === 0 && (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              color: "var(--fg-ghost)",
              fontSize: "12px",
            }}
          >
            No {config.label.toLowerCase()} yet
          </div>
        )}

        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              overflow: "hidden",
            }}
          >
            {/* Item header */}
            <div
              onClick={() =>
                !isStringArray &&
                setExpandedIdx(expandedIdx === idx ? null : idx)
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 8px",
                cursor: isStringArray ? "default" : "pointer",
                background:
                  expandedIdx === idx ? "var(--accent-muted)" : "transparent",
              }}
            >
              {isStringArray ? (
                <input
                  type="text"
                  value={String(item)}
                  onChange={(e) => updateItem(idx, "_value", e.target.value)}
                  style={{ ...baseInput, flex: 1, margin: 0 }}
                />
              ) : (
                <span
                  style={{
                    flex: 1,
                    fontSize: "12px",
                    color: "var(--fg-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getItemName(item, idx)}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveItem(idx, -1);
                }}
                disabled={idx === 0}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === 0 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveItem(idx, 1);
                }}
                disabled={idx === items.length - 1}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  opacity: idx === items.length - 1 ? 0.3 : 0.7,
                  color: "var(--fg-faint)",
                }}
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(idx);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Expanded fields (for object items) */}
            {!isStringArray && expandedIdx === idx && (
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                {config.fields.map((field) => {
                  const obj = item as Record<string, unknown>;
                  if (field.type === "boolean") {
                    return (
                      <label
                        key={field.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "12px",
                          color: "var(--fg-secondary)",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={(obj[field.key] as boolean) ?? false}
                          onChange={(e) =>
                            updateItem(idx, field.key, e.target.checked)
                          }
                        />
                        {field.label}
                      </label>
                    );
                  }
                  if (field.type === "select" && field.options) {
                    return (
                      <div key={field.key}>
                        <label
                          style={{
                            fontSize: "11px",
                            color: "var(--fg-faint)",
                            display: "block",
                            marginBottom: "3px",
                          }}
                        >
                          {field.label}
                        </label>
                        <select
                          value={String(obj[field.key] ?? "")}
                          onChange={(e) =>
                            updateItem(idx, field.key, e.target.value)
                          }
                          style={{ ...baseInput, cursor: "pointer" }}
                        >
                          {field.options.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (field.type === "textarea") {
                    return (
                      <div key={field.key}>
                        <label
                          style={{
                            fontSize: "11px",
                            color: "var(--fg-faint)",
                            display: "block",
                            marginBottom: "3px",
                          }}
                        >
                          {field.label}
                        </label>
                        <textarea
                          value={String(obj[field.key] ?? "")}
                          onChange={(e) =>
                            updateItem(idx, field.key, e.target.value)
                          }
                          rows={3}
                          style={{ ...baseInput, resize: "vertical" }}
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={field.key}>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--fg-faint)",
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={
                          field.type === "url"
                            ? "url"
                            : field.type === "number"
                              ? "number"
                              : "text"
                        }
                        value={String(obj[field.key] ?? "")}
                        onChange={(e) =>
                          updateItem(
                            idx,
                            field.key,
                            field.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                          )
                        }
                        style={baseInput}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          background: "var(--accent-muted)",
          border: "1px dashed var(--accent-border)",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        <Plus size={14} /> Add {config.itemLabel}
      </button>
    </div>
  );
}

interface ContentFieldDef {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "boolean"
    | "select"
    | "color"
    | "url"
    | "icon"
    | "range";
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

// ── Icon Picker ──────────────────────────────────────────────────────────────
function IconPickerField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredIcons = search.trim()
    ? ALL_ICON_NAMES.filter((n) => n.includes(search.toLowerCase()))
    : activeCategory
      ? (ICON_CATEGORIES[activeCategory] ?? [])
      : ALL_ICON_NAMES;

  return (
    <div>
      <label
        style={{
          fontSize: "12px",
          color: "var(--fg-faint)",
          display: "block",
          marginBottom: "5px",
        }}
      >
        {label}
      </label>

      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px",
            borderRadius: "8px",
            fontSize: "13px",
            background: "var(--input-bg)",
            border: "1px solid var(--input-border)",
            color: "var(--input-fg)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {value ? (
            <>
              <LucideIcon name={value} size={16} />
              <span style={{ flex: 1 }}>{value}</span>
            </>
          ) : (
            <span style={{ flex: 1, opacity: 0.5 }}>Choose icon...</span>
          )}
        </button>
        {value && (
          <button
            onClick={() => onChange("")}
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              border: "1px solid var(--input-border)",
              background: "var(--input-bg)",
              cursor: "pointer",
              color: "var(--fg-faint)",
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          style={{
            marginTop: "8px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
            overflow: "hidden",
          }}
        >
          {/* Search bar */}
          <div
            style={{ padding: "8px", borderBottom: "1px solid var(--border)" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
              }}
            >
              <Search size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveCategory(null);
                }}
                placeholder="Search icons..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: "12px",
                  color: "var(--input-fg)",
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Category tabs */}
          {!search && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                padding: "6px 8px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => setActiveCategory(null)}
                style={{
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: !activeCategory
                    ? "var(--accent)"
                    : "var(--pill-bg)",
                  color: !activeCategory ? "#fff" : "var(--fg-faint)",
                }}
              >
                All
              </button>
              {Object.keys(ICON_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background:
                      activeCategory === cat
                        ? "var(--accent)"
                        : "var(--pill-bg)",
                    color: activeCategory === cat ? "#fff" : "var(--fg-faint)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Icon grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
              padding: "8px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {filteredIcons.slice(0, 105).map((name) => (
              <button
                key={name}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                  setSearch("");
                }}
                title={name}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: value === name ? "var(--accent)" : "transparent",
                  color: value === name ? "#fff" : "var(--fg-secondary)",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (value !== name)
                    e.currentTarget.style.background = "var(--pill-bg)";
                }}
                onMouseLeave={(e) => {
                  if (value !== name)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <LucideIcon name={name} size={16} />
              </button>
            ))}
            {filteredIcons.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  padding: "16px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "var(--fg-ghost)",
                }}
              >
                No icons found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getContentFields(
  type: string,
  props: Record<string, unknown>,
): ContentFieldDef[] {
  switch (type) {
    case "hero":
      return [
        {
          key: "badge",
          label: "Badge Text",
          type: "text",
          placeholder: "🚀 New Release",
        },
        {
          key: "heading",
          label: "Heading",
          type: "textarea",
          placeholder: "Your headline",
        },
        {
          key: "subheading",
          label: "Subheading",
          type: "textarea",
          placeholder: "Supporting text",
        },
        {
          key: "ctaText",
          label: "CTA Button Text",
          type: "text",
          placeholder: "Get Started",
        },
        { key: "ctaHref", label: "CTA Link", type: "url", placeholder: "#" },
        {
          key: "secondaryCtaText",
          label: "Secondary CTA Text",
          type: "text",
          placeholder: "Learn More",
        },
        {
          key: "secondaryCtaHref",
          label: "Secondary CTA Link",
          type: "url",
          placeholder: "#",
        },
        {
          key: "variant",
          label: "Variant",
          type: "select",
          options: ["gradient", "minimal", "split", "video"],
        },
      ];

    case "heading":
      return [
        {
          key: "text",
          label: "Text",
          type: "textarea",
          placeholder: "Your heading",
        },
        {
          key: "level",
          label: "Level",
          type: "select",
          options: ["h1", "h2", "h3", "h4", "h5", "h6"],
        },
        { key: "gradient", label: "Gradient Text", type: "boolean" },
        { key: "gradientFrom", label: "Gradient From", type: "color" },
        { key: "gradientTo", label: "Gradient To", type: "color" },
        {
          key: "align",
          label: "Align",
          type: "select",
          options: ["left", "center", "right"],
        },
      ];

    case "paragraph":
      return [
        {
          key: "text",
          label: "Text",
          type: "textarea",
          placeholder: "Your text",
        },
        {
          key: "size",
          label: "Size",
          type: "select",
          options: ["sm", "md", "lg", "xl"],
        },
        {
          key: "align",
          label: "Align",
          type: "select",
          options: ["left", "center", "right"],
        },
      ];

    case "button":
    case "cta-button":
      return [
        {
          key: "text",
          label: "Button Text",
          type: "text",
          placeholder: "Click Me",
        },
        { key: "href", label: "Link URL", type: "url", placeholder: "#" },
        {
          key: "variant",
          label: "Variant",
          type: "select",
          options: ["primary", "secondary", "outline", "ghost", "gradient"],
        },
        {
          key: "size",
          label: "Size",
          type: "select",
          options: ["sm", "md", "lg"],
        },
        { key: "icon", label: "Icon", type: "icon" },
        {
          key: "iconPosition",
          label: "Icon Position",
          type: "select",
          options: ["left", "right"],
        },
        ...(props.variant === "gradient"
          ? [
              { key: "gradientFrom", label: "Gradient From", type: "color" as const },
              { key: "gradientTo", label: "Gradient To", type: "color" as const },
              { key: "gradientAngle", label: "Gradient Angle", type: "text" as const },
            ]
          : []),
        ...(type === "cta-button"
          ? [
              {
                key: "subtext",
                label: "Sub Text",
                type: "text" as const,
                placeholder: "No credit card required",
              },
            ]
          : []),
      ];

    case "image":
      return [
        {
          key: "src",
          label: "Image URL",
          type: "url",
          placeholder: "https://...",
        },
        {
          key: "alt",
          label: "Alt Text",
          type: "text",
          placeholder: "Descriptive text",
        },
        {
          key: "caption",
          label: "Caption",
          type: "text",
          placeholder: "Optional caption",
        },
        {
          key: "objectFit",
          label: "Object Fit",
          type: "select",
          options: ["cover", "contain", "fill"],
        },
        { key: "rounded", label: "Rounded", type: "boolean" },
      ];

    case "badge":
      return [
        { key: "text", label: "Text", type: "text", placeholder: "New" },
        {
          key: "variant",
          label: "Variant",
          type: "select",
          options: ["primary", "secondary", "success", "warning", "error"],
        },
      ];

    case "spacer":
      return [
        { key: "height", label: "Height", type: "text", placeholder: "64px" },
      ];

    case "counter":
      return [
        { key: "from", label: "From", type: "number" },
        { key: "to", label: "To", type: "number" },
        { key: "suffix", label: "Suffix", type: "text", placeholder: "+" },
        { key: "label", label: "Label", type: "text", placeholder: "Users" },
        { key: "duration", label: "Duration (s)", type: "number" },
      ];

    case "progress-bar":
      return [
        { key: "label", label: "Label", type: "text", placeholder: "Progress" },
        { key: "value", label: "Value (%)", type: "number" },
        { key: "showValue", label: "Show Value", type: "boolean" },
        { key: "animated", label: "Animated", type: "boolean" },
      ];

    case "video":
      return [
        { key: "src", label: "Video URL", type: "url" },
        { key: "poster", label: "Poster Image", type: "url" },
        { key: "autoplay", label: "Autoplay", type: "boolean" },
        { key: "loop", label: "Loop", type: "boolean" },
        { key: "muted", label: "Muted", type: "boolean" },
      ];

    case "card":
      return [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "image", label: "Card Image", type: "url" },
        { key: "imageHeight", label: "Image Height", type: "text" },
        { key: "imageFit", label: "Image Fit", type: "select", options: ["cover", "contain", "fill", "none"] },
      ];

    case "blockquote":
      return [
        { key: "text", label: "Quote Text", type: "textarea" },
        { key: "author", label: "Author", type: "text" },
      ];

    case "cta-section":
      return [
        { key: "heading", label: "Heading", type: "textarea" },
        { key: "subtext", label: "Subtext", type: "text" },
        { key: "ctaText", label: "Button Text", type: "text" },
        { key: "ctaHref", label: "Button URL", type: "url" },
      ];

    case "marquee":
      return [];

    case "particle-system":
      return [
        { key: "count", label: "Particle Count", type: "number" },
        { key: "color", label: "Color", type: "color" },
        { key: "size", label: "Size", type: "number" },
        { key: "speed", label: "Speed", type: "number" },
      ];

    case "input":
      return [
        { key: "label", label: "Label", type: "text" },
        { key: "placeholder", label: "Placeholder", type: "text" },
        {
          key: "type",
          label: "Input Type",
          type: "select",
          options: ["text", "email", "password", "tel", "number", "url"],
        },
        { key: "required", label: "Required", type: "boolean" },
      ];

    case "textarea":
      return [
        { key: "label", label: "Label", type: "text" },
        { key: "placeholder", label: "Placeholder", type: "text" },
        { key: "rows", label: "Rows", type: "number" },
      ];

    case "checkbox":
      return [
        {
          key: "label",
          label: "Label",
          type: "text",
          placeholder: "I agree to the terms",
        },
        { key: "checked", label: "Checked", type: "boolean" },
      ];

    case "radio":
      return [
        { key: "label", label: "Label", type: "text", placeholder: "Option" },
        {
          key: "name",
          label: "Group Name",
          type: "text",
          placeholder: "group",
        },
        { key: "value", label: "Value", type: "text" },
        { key: "checked", label: "Default Checked", type: "boolean" },
      ];

    case "select-field":
      return [
        {
          key: "label",
          label: "Label",
          type: "text",
          placeholder: "Choose option",
        },
        {
          key: "placeholder",
          label: "Placeholder",
          type: "text",
          placeholder: "Select...",
        },
      ];

    case "list":
      return [];

    case "rich-text":
      return [
        {
          key: "html",
          label: "HTML Content",
          type: "textarea",
          placeholder: "<p>Your content</p>",
        },
      ];

    case "divider":
      return [
        {
          key: "style",
          label: "Style",
          type: "select",
          options: ["solid", "dashed", "dotted"],
        },
        { key: "label", label: "Label Text", type: "text" },
      ];

    case "icon":
      return [
        { key: "name", label: "Icon", type: "icon" },
        { key: "size", label: "Size (px)", type: "number" },
        { key: "color", label: "Color", type: "color" },
      ];

    case "icon-button":
      return [
        { key: "icon", label: "Icon", type: "icon" },
        { key: "href", label: "Link URL", type: "url" },
        {
          key: "variant",
          label: "Variant",
          type: "select",
          options: ["primary", "secondary", "outline", "ghost", "gradient"],
        },
        {
          key: "size",
          label: "Size",
          type: "select",
          options: ["sm", "md", "lg"],
        },
      ];

    case "gallery":
      return [
        { key: "columns", label: "Columns", type: "number" },
        { key: "gap", label: "Gap", type: "text", placeholder: "16px" },
      ];

    case "slider":
      return [
        { key: "autoplay", label: "Autoplay", type: "boolean" },
        { key: "interval", label: "Interval (ms)", type: "number" },
        { key: "showDots", label: "Show Dots", type: "boolean" },
        { key: "showArrows", label: "Show Arrows", type: "boolean" },
      ];

    case "team":
      return [];

    case "modal":
      return [
        { key: "triggerText", label: "Trigger Text", type: "text" },
        { key: "title", label: "Modal Title", type: "text" },
        { key: "content", label: "Content", type: "textarea" },
      ];

    case "drawer":
      return [
        { key: "triggerText", label: "Trigger Text", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "content", label: "Content", type: "textarea" },
        {
          key: "side",
          label: "Side",
          type: "select",
          options: ["left", "right"],
        },
      ];

    case "carousel":
      return [
        { key: "autoplay", label: "Autoplay", type: "boolean" },
        { key: "interval", label: "Interval (ms)", type: "number" },
      ];

    case "masonry-grid":
      return [
        { key: "columns", label: "Columns", type: "number" },
        { key: "gap", label: "Gap", type: "text" },
      ];

    case "accordion":
      return [
        { key: "allowMultiple", label: "Allow Multiple Open", type: "boolean" },
        { key: "gap", label: "Item Gap", type: "text" },
        { key: "iconStyle", label: "Icon Style", type: "select", options: ["plus", "arrow", "chevron", "none"] },
      ];

    case "accordion-item":
      return [
        { key: "title", label: "Title", type: "text" },
        { key: "defaultOpen", label: "Default Open", type: "boolean" },
      ];

    case "tabs":
      return [];

    case "timeline":
      return [];

    case "bento-grid":
      return [];

    case "features":
      return [];

    case "testimonials":
      return [];

    case "faq":
      return [];

    case "pricing":
      return [];

    case "logos":
      return [];

    case "statistics":
      return [];

    case "footer":
      return [];

    // ── Media (extra) ──────────────────────────────────────────────────────
    case "audio":
      return [
        {
          key: "src",
          label: "Audio URL",
          type: "url",
          placeholder: "https://...",
        },
        { key: "autoplay", label: "Autoplay", type: "boolean" },
        { key: "loop", label: "Loop", type: "boolean" },
        { key: "controls", label: "Show Controls", type: "boolean" },
      ];

    case "embed":
      return [
        {
          key: "src",
          label: "Embed URL",
          type: "url",
          placeholder: "https://www.youtube.com/embed/...",
        },
        {
          key: "title",
          label: "Title",
          type: "text",
          placeholder: "Embedded content",
        },
        {
          key: "aspectRatio",
          label: "Aspect Ratio",
          type: "select",
          options: ["16/9", "4/3", "1/1", "9/16"],
        },
      ];

    case "map":
      return [
        {
          key: "src",
          label: "Map Embed URL",
          type: "url",
          placeholder: "Google Maps embed URL",
        },
        {
          key: "address",
          label: "Address",
          type: "text",
          placeholder: "New York, NY",
        },
        { key: "zoom", label: "Zoom Level", type: "number" },
      ];

    // ── Forms (extra) ────────────────────────────────────────────────────────
    case "form":
      return [
        {
          key: "action",
          label: "Action URL",
          type: "url",
          placeholder: "/api/submit",
        },
        {
          key: "method",
          label: "Method",
          type: "select",
          options: ["POST", "GET"],
        },
      ];

    case "file-upload":
      return [
        {
          key: "label",
          label: "Label",
          type: "text",
          placeholder: "Upload file",
        },
        {
          key: "accept",
          label: "Accept",
          type: "text",
          placeholder: ".jpg,.png,.pdf",
        },
        { key: "multiple", label: "Multiple", type: "boolean" },
      ];

    case "range-slider":
      return [
        { key: "label", label: "Label", type: "text" },
        { key: "min", label: "Min", type: "number" },
        { key: "max", label: "Max", type: "number" },
        { key: "value", label: "Value", type: "number" },
        { key: "step", label: "Step", type: "number" },
      ];

    case "switch":
      return [
        { key: "label", label: "Label", type: "text" },
        { key: "checked", label: "Checked", type: "boolean" },
      ];

    case "date-picker":
      return [
        { key: "label", label: "Label", type: "text" },
        { key: "placeholder", label: "Placeholder", type: "text" },
      ];

    // ── Navigation ────────────────────────────────────────────────────────────
    case "navbar":
      return [];

    case "breadcrumb":
      return [];

    case "pagination":
      return [
        { key: "totalPages", label: "Total Pages", type: "number" },
        { key: "currentPage", label: "Current Page", type: "number" },
        { key: "maxVisible", label: "Max Visible Pages", type: "number" },
        { key: "showPrevNext", label: "Show Prev/Next", type: "boolean" },
        { key: "showFirstLast", label: "Show First/Last", type: "boolean" },
        { key: "prevLabel", label: "Prev Label", type: "text" },
        { key: "nextLabel", label: "Next Label", type: "text" },
        { key: "shape", label: "Shape", type: "select", options: ["rounded", "square", "circle"] },
        { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg"] },
        { key: "variant", label: "Variant", type: "select", options: ["outlined", "filled", "minimal"] },
        { key: "activeColor", label: "Active Color", type: "color" },
        { key: "align", label: "Alignment", type: "select", options: ["left", "center", "right"] },
      ];

    case "sidebar-nav":
      return [];

    case "menu":
      return [];

    // ── Content ──────────────────────────────────────────────────────────────
    case "link":
      return [
        {
          key: "text",
          label: "Link Text",
          type: "text",
          placeholder: "Click here",
        },
        { key: "href", label: "URL", type: "url", placeholder: "https://..." },
        {
          key: "target",
          label: "Target",
          type: "select",
          options: ["_self", "_blank"],
        },
        { key: "underline", label: "Underline", type: "boolean" },
        { key: "icon", label: "Icon", type: "icon" },
        {
          key: "iconPosition",
          label: "Icon Position",
          type: "select",
          options: ["left", "right"],
        },
      ];

    case "social-links":
      return [];

    case "rating":
      return [
        { key: "value", label: "Value", type: "number" },
        { key: "max", label: "Max Stars", type: "number" },
        { key: "size", label: "Size (px)", type: "number" },
        { key: "color", label: "Color", type: "color" },
      ];

    case "avatar":
      return [
        { key: "src", label: "Image URL", type: "url" },
        { key: "name", label: "Name", type: "text", placeholder: "John Doe" },
        {
          key: "size",
          label: "Size",
          type: "select",
          options: ["sm", "md", "lg"],
        },
      ];

    case "avatar-group":
      return [
        { key: "max", label: "Max Shown", type: "number" },
        {
          key: "size",
          label: "Size",
          type: "select",
          options: ["sm", "md", "lg"],
        },
      ];

    case "tooltip":
      return [
        { key: "text", label: "Text", type: "text", placeholder: "Hover me" },
        {
          key: "tooltip",
          label: "Tooltip",
          type: "text",
          placeholder: "Tooltip text",
        },
        {
          key: "position",
          label: "Position",
          type: "select",
          options: ["top", "bottom", "left", "right"],
        },
      ];

    case "alert":
      return [
        {
          key: "title",
          label: "Title",
          type: "text",
          placeholder: "Heads up!",
        },
        {
          key: "message",
          label: "Message",
          type: "textarea",
          placeholder: "Alert message",
        },
        {
          key: "variant",
          label: "Variant",
          type: "select",
          options: ["info", "success", "warning", "error"],
        },
        { key: "dismissible", label: "Dismissible", type: "boolean" },
      ];

    case "tag-group":
      return [];

    case "table":
      return [{ key: "striped", label: "Striped", type: "boolean" }];

    case "code-block":
      return [
        {
          key: "code",
          label: "Code",
          type: "textarea",
          placeholder: "// your code",
        },
        {
          key: "language",
          label: "Language",
          type: "text",
          placeholder: "javascript",
        },
      ];

    // ── Marketing (extra) ────────────────────────────────────────────────────
    case "newsletter":
      return [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subtext", label: "Subtext", type: "text" },
        {
          key: "buttonText",
          label: "Button Text",
          type: "text",
          placeholder: "Subscribe",
        },
        {
          key: "placeholder",
          label: "Placeholder",
          type: "text",
          placeholder: "your@email.com",
        },
      ];

    case "contact-form":
      return [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subtext", label: "Subtext", type: "text" },
        {
          key: "buttonText",
          label: "Button Text",
          type: "text",
          placeholder: "Send Message",
        },
      ];

    case "banner":
      return [
        { key: "text", label: "Text", type: "text" },
        { key: "linkText", label: "Link Text", type: "text" },
        { key: "href", label: "Link URL", type: "url" },
        {
          key: "variant",
          label: "Variant",
          type: "select",
          options: ["info", "success", "warning", "error"],
        },
        { key: "dismissible", label: "Dismissible", type: "boolean" },
      ];

    // ── Interactive (extra) ───────────────────────────────────────────────────
    case "popover":
      return [
        { key: "triggerText", label: "Trigger Text", type: "text" },
        { key: "content", label: "Content", type: "textarea" },
        {
          key: "position",
          label: "Position",
          type: "select",
          options: ["top", "bottom", "left", "right"],
        },
      ];

    case "steps":
      return [];

    case "floating-objects":
      return [
        { key: "count", label: "Object Count", type: "number" },
        {
          key: "shape",
          label: "Shape",
          type: "select",
          options: [
            "sphere",
            "cube",
            "torus",
            "blob",
            "ring",
            "pill",
            "crystal",
            "wave",
            "spiral",
          ],
        },
        { key: "mixShapes", label: "Mix Shapes", type: "boolean" },
        { key: "color", label: "Color", type: "color" },
        { key: "secondaryColor", label: "Light Accent Color", type: "color" },
        {
          key: "speed",
          label: "Rotation Speed",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "spread",
          label: "Spread Radius",
          type: "range",
          min: 0.5,
          max: 6,
          step: 0.1,
        },
        {
          key: "floatIntensity",
          label: "Float Intensity",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "metalness",
          label: "Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "roughness",
          label: "Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "opacity",
          label: "Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "lightColor", label: "Light Color", type: "color" },
        { key: "castShadows", label: "Cast Shadows", type: "boolean" },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "cameraFov",
          label: "Camera FOV",
          type: "range",
          min: 20,
          max: 100,
          step: 1,
        },
        {
          key: "cameraZoom",
          label: "Camera Distance",
          type: "range",
          min: 2,
          max: 15,
          step: 0.5,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "interactive-shapes":
      return [
        {
          key: "shape",
          label: "Shape",
          type: "select",
          options: [
            "sphere",
            "cube",
            "torus",
            "blob",
            "ring",
            "pill",
            "crystal",
            "wave",
            "spiral",
            "ribbon",
            "arch",
          ],
        },
        { key: "color", label: "Color", type: "color" },
        { key: "secondaryColor", label: "Light Accent Color", type: "color" },
        { key: "wireframe", label: "Wireframe", type: "boolean" },
        {
          key: "shapeScale",
          label: "Shape Scale",
          type: "range",
          min: 0.2,
          max: 3,
          step: 0.1,
        },
        {
          key: "metalness",
          label: "Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "roughness",
          label: "Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "distort",
          label: "Distortion (sphere)",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "distortSpeed",
          label: "Distort Speed",
          type: "range",
          min: 0,
          max: 10,
          step: 0.5,
        },
        { key: "emissive", label: "Glow Color", type: "color" },
        {
          key: "emissiveIntensity",
          label: "Glow Intensity",
          type: "range",
          min: 0,
          max: 2,
          step: 0.05,
        },
        { key: "autoRotate", label: "Auto Rotate", type: "boolean" },
        {
          key: "autoRotateSpeed",
          label: "Rotate Speed",
          type: "range",
          min: 0,
          max: 10,
          step: 0.5,
        },
        { key: "enableZoom", label: "Enable Zoom", type: "boolean" },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "lightColor", label: "Light Color", type: "color" },
        { key: "castShadows", label: "Cast Shadows", type: "boolean" },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "cameraFov",
          label: "Camera FOV",
          type: "range",
          min: 20,
          max: 100,
          step: 1,
        },
        {
          key: "cameraZoom",
          label: "Camera Distance",
          type: "range",
          min: 2,
          max: 12,
          step: 0.5,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "3d-hero":
      return [
        { key: "heading", label: "Heading", type: "textarea" },
        { key: "showSubheading", label: "Show Subheading", type: "boolean" },
        { key: "subheading", label: "Subheading", type: "textarea" },
        {
          key: "fontSize",
          label: "Font Size (em)",
          type: "range",
          min: 1,
          max: 8,
          step: 0.25,
        },
        { key: "textColor", label: "Text Color", type: "color" },
        { key: "primaryColor", label: "Sphere Color", type: "color" },
        { key: "secondaryColor", label: "Torus Color", type: "color" },
        { key: "accentColor", label: "Cone Color", type: "color" },
        {
          key: "shapeScale",
          label: "Shape Scale",
          type: "range",
          min: 0.2,
          max: 3,
          step: 0.1,
        },
        {
          key: "shapeOpacity",
          label: "Shape Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "animationSpeed",
          label: "Animation Speed",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "distort",
          label: "Sphere Distortion",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "lightColor", label: "Light Color", type: "color" },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "cameraFov",
          label: "Camera FOV",
          type: "range",
          min: 20,
          max: 100,
          step: 1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "globe":
      return [
        { key: "color", label: "Color", type: "color" },
        { key: "secondaryColor", label: "Light Accent Color", type: "color" },
        { key: "autoRotate", label: "Auto Rotate", type: "boolean" },
        {
          key: "rotateSpeed",
          label: "Rotate Speed",
          type: "range",
          min: 0,
          max: 2,
          step: 0.05,
        },
        { key: "showDots", label: "Show Dots", type: "boolean" },
        {
          key: "dotCount",
          label: "Dot Count",
          type: "range",
          min: 100,
          max: 5000,
          step: 100,
        },
        {
          key: "dotSize",
          label: "Dot Size",
          type: "range",
          min: 0.005,
          max: 0.1,
          step: 0.005,
        },
        {
          key: "dotOpacity",
          label: "Dot Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        { key: "showLines", label: "Show Grid Lines", type: "boolean" },
        {
          key: "lineOpacity",
          label: "Line Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "globeOpacity",
          label: "Globe Fill Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "globeMetalness",
          label: "Globe Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "globeRoughness",
          label: "Globe Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        { key: "glowColor", label: "Glow Color", type: "color" },
        {
          key: "glowIntensity",
          label: "Glow Intensity",
          type: "range",
          min: 0,
          max: 2,
          step: 0.05,
        },
        { key: "enableZoom", label: "Enable Zoom", type: "boolean" },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "lightColor", label: "Light Color", type: "color" },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "cameraFov",
          label: "Camera FOV",
          type: "range",
          min: 20,
          max: 100,
          step: 1,
        },
        {
          key: "cameraZoom",
          label: "Camera Distance",
          type: "range",
          min: 2,
          max: 10,
          step: 0.5,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "product-showcase":
      return [
        { key: "color", label: "Product Color", type: "color" },
        { key: "accentColor", label: "Accent Color", type: "color" },
        {
          key: "environment",
          label: "Environment",
          type: "select",
          options: [
            "studio",
            "apartment",
            "city",
            "dawn",
            "forest",
            "lobby",
            "night",
            "park",
            "sunset",
            "warehouse",
          ],
        },
        {
          key: "productScale",
          label: "Product Scale",
          type: "range",
          min: 0.3,
          max: 2,
          step: 0.1,
        },
        {
          key: "metalness",
          label: "Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "roughness",
          label: "Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "clearcoat",
          label: "Clearcoat",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "floatSpeed",
          label: "Float Speed",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "floatIntensity",
          label: "Float Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "autoRotate", label: "Auto Rotate", type: "boolean" },
        {
          key: "autoRotateSpeed",
          label: "Rotate Speed",
          type: "range",
          min: 0,
          max: 10,
          step: 0.5,
        },
        { key: "enableZoom", label: "Enable Zoom", type: "boolean" },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "lightColor", label: "Main Light Color", type: "color" },
        {
          key: "secondaryLightColor",
          label: "Accent Light Color",
          type: "color",
        },
        { key: "castShadows", label: "Cast Shadows", type: "boolean" },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "cameraFov",
          label: "Camera FOV",
          type: "range",
          min: 20,
          max: 100,
          step: 1,
        },
        {
          key: "cameraZoom",
          label: "Camera Distance",
          type: "range",
          min: 2,
          max: 12,
          step: 0.5,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "gradient-blob":
      return [
        { key: "color1", label: "Primary Color", type: "color" },
        { key: "color2", label: "Secondary Color", type: "color" },
        {
          key: "scale",
          label: "Blob Scale",
          type: "range",
          min: 0.5,
          max: 4,
          step: 0.1,
        },
        {
          key: "distort",
          label: "Distortion",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "speed",
          label: "Animation Speed",
          type: "range",
          min: 0,
          max: 8,
          step: 0.5,
        },
        {
          key: "opacity",
          label: "Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "metalness",
          label: "Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "roughness",
          label: "Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "wave-terrain":
      return [
        { key: "color", label: "Color", type: "color" },
        { key: "secondaryColor", label: "Light Accent Color", type: "color" },
        { key: "wireframe", label: "Wireframe", type: "boolean" },
        {
          key: "waveHeight",
          label: "Wave Height",
          type: "range",
          min: 0,
          max: 2,
          step: 0.05,
        },
        {
          key: "waveFrequency",
          label: "Wave Frequency",
          type: "range",
          min: 0.5,
          max: 8,
          step: 0.5,
        },
        {
          key: "speed",
          label: "Animation Speed",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "gridSize",
          label: "Grid Detail",
          type: "range",
          min: 20,
          max: 150,
          step: 10,
        },
        {
          key: "metalness",
          label: "Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "roughness",
          label: "Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "opacity",
          label: "Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "lightColor", label: "Light Color", type: "color" },
        { key: "enableZoom", label: "Enable Zoom", type: "boolean" },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "aurora":
      return [
        { key: "color1", label: "Color 1", type: "color" },
        { key: "color2", label: "Color 2", type: "color" },
        { key: "color3", label: "Color 3", type: "color" },
        {
          key: "ribbonCount",
          label: "Ribbon Count",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          key: "speed",
          label: "Animation Speed",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "waveAmplitude",
          label: "Wave Amplitude",
          type: "range",
          min: 0.1,
          max: 2,
          step: 0.1,
        },
        {
          key: "opacity",
          label: "Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "morph-sphere":
      return [
        { key: "color", label: "Color", type: "color" },
        { key: "secondaryColor", label: "Light Accent Color", type: "color" },
        { key: "wireframe", label: "Wireframe", type: "boolean" },
        {
          key: "noiseScale",
          label: "Noise Scale",
          type: "range",
          min: 0.5,
          max: 5,
          step: 0.1,
        },
        {
          key: "noiseStrength",
          label: "Noise Strength",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "speed",
          label: "Animation Speed",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "metalness",
          label: "Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "roughness",
          label: "Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        { key: "emissive", label: "Glow Color", type: "color" },
        {
          key: "emissiveIntensity",
          label: "Glow Intensity",
          type: "range",
          min: 0,
          max: 2,
          step: 0.05,
        },
        { key: "autoRotate", label: "Auto Rotate", type: "boolean" },
        { key: "enableZoom", label: "Enable Zoom", type: "boolean" },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "glass-layers":
      return [
        { key: "color1", label: "Layer Color 1", type: "color" },
        { key: "color2", label: "Layer Color 2", type: "color" },
        { key: "color3", label: "Layer Color 3", type: "color" },
        {
          key: "layerCount",
          label: "Layer Count",
          type: "range",
          min: 2,
          max: 10,
          step: 1,
        },
        {
          key: "gap",
          label: "Layer Gap",
          type: "range",
          min: 0.2,
          max: 2,
          step: 0.1,
        },
        {
          key: "rotateX",
          label: "Tilt X (deg)",
          type: "range",
          min: -45,
          max: 45,
          step: 5,
        },
        {
          key: "rotateY",
          label: "Tilt Y (deg)",
          type: "range",
          min: -45,
          max: 45,
          step: 5,
        },
        {
          key: "speed",
          label: "Float Speed",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "opacity",
          label: "Glass Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "metalness",
          label: "Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "roughness",
          label: "Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "perspective-grid":
      return [
        { key: "color", label: "Grid Color", type: "color" },
        { key: "dotColor", label: "Dot Color", type: "color" },
        { key: "showLines", label: "Show Lines", type: "boolean" },
        { key: "showDots", label: "Show Dots", type: "boolean" },
        {
          key: "lineOpacity",
          label: "Line Opacity",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          key: "dotSize",
          label: "Dot Size",
          type: "range",
          min: 0.01,
          max: 0.2,
          step: 0.01,
        },
        {
          key: "gridSize",
          label: "Grid Size",
          type: "range",
          min: 5,
          max: 40,
          step: 5,
        },
        {
          key: "waveHeight",
          label: "Wave Height",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        {
          key: "speed",
          label: "Animation Speed",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "glowColor", label: "Glow Color", type: "color" },
        {
          key: "glowIntensity",
          label: "Glow Intensity",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "tube-ring":
      return [
        { key: "color", label: "Color", type: "color" },
        { key: "secondaryColor", label: "Light Accent Color", type: "color" },
        { key: "wireframe", label: "Wireframe", type: "boolean" },
        {
          key: "ringRadius",
          label: "Ring Radius",
          type: "range",
          min: 0.5,
          max: 3,
          step: 0.1,
        },
        {
          key: "tubeRadius",
          label: "Tube Thickness",
          type: "range",
          min: 0.05,
          max: 0.8,
          step: 0.05,
        },
        {
          key: "speed",
          label: "Animation Speed",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "distort",
          label: "Distortion",
          type: "range",
          min: 0,
          max: 0.8,
          step: 0.05,
        },
        {
          key: "metalness",
          label: "Metalness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          key: "roughness",
          label: "Roughness",
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
        },
        { key: "emissive", label: "Glow Color", type: "color" },
        {
          key: "emissiveIntensity",
          label: "Glow Intensity",
          type: "range",
          min: 0,
          max: 2,
          step: 0.05,
        },
        { key: "autoRotate", label: "Auto Rotate", type: "boolean" },
        { key: "enableZoom", label: "Enable Zoom", type: "boolean" },
        {
          key: "lightAngleX",
          label: "Light Direction X",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightAngleY",
          label: "Light Direction Y",
          type: "range",
          min: -10,
          max: 10,
          step: 0.5,
        },
        {
          key: "lightIntensity",
          label: "Light Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    case "light-trails":
      return [
        { key: "color1", label: "Trail Color 1", type: "color" },
        { key: "color2", label: "Trail Color 2", type: "color" },
        { key: "color3", label: "Trail Color 3", type: "color" },
        {
          key: "trailCount",
          label: "Trail Count",
          type: "range",
          min: 1,
          max: 12,
          step: 1,
        },
        {
          key: "speed",
          label: "Animation Speed",
          type: "range",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          key: "trailLength",
          label: "Trail Length",
          type: "range",
          min: 0.5,
          max: 4,
          step: 0.1,
        },
        {
          key: "spread",
          label: "Spread",
          type: "range",
          min: 0.5,
          max: 5,
          step: 0.1,
        },
        {
          key: "glowIntensity",
          label: "Glow Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          key: "ambientIntensity",
          label: "Ambient Light",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
        },
        { key: "mouseParallax", label: "Mouse Parallax", type: "boolean" },
        {
          key: "mouseIntensity",
          label: "Mouse Intensity",
          type: "range",
          min: 0,
          max: 3,
          step: 0.1,
        },
        { key: "bgColor", label: "Background", type: "color" },
      ];

    // ── Animated ──────────────────────────────────────────────────────────────
    case "horizontal-scroll":
      return [
        { key: "cardWidth", label: "Card Width", type: "text" },
        { key: "gap", label: "Gap", type: "text" },
        { key: "aspectRatio", label: "Aspect Ratio", type: "text" },
        { key: "showLabels", label: "Show Labels", type: "boolean" },
        { key: "borderRadius", label: "Border Radius", type: "text" },
        { key: "overlayColor", label: "Overlay Color", type: "color" },
        { key: "bgColor", label: "Background", type: "color" },
        { key: "viewportHeight", label: "Viewport Height", type: "text" },
        { key: "scrollHeight", label: "Scroll Height", type: "text" },
      ];

    case "vertical-scroll-cards":
      return [
        { key: "heading", label: "Heading", type: "textarea" },
        { key: "headingSize", label: "Heading Size", type: "text" },
        { key: "accentColor", label: "Accent Color", type: "color" },
        { key: "accentWidth", label: "Accent Line Width", type: "text" },
        { key: "bgColor", label: "Background", type: "color" },
        { key: "viewportHeight", label: "Viewport Height", type: "text" },
        { key: "scrollHeight", label: "Scroll Height", type: "text" },
      ];

    case "text-zoom-scroll":
      return [
        { key: "line1", label: "Line 1", type: "text" },
        { key: "line2", label: "Line 2", type: "text" },
        { key: "line3", label: "Line 3", type: "text" },
        { key: "fontSize", label: "Font Size", type: "text" },
        { key: "bgColor", label: "Background", type: "color" },
        { key: "textColor", label: "Text Color", type: "color" },
        { key: "revealBg", label: "Reveal Background", type: "color" },
        { key: "revealTextColor", label: "Reveal Text Color", type: "color" },
        { key: "revealTitle", label: "Reveal Title", type: "text" },
        { key: "revealSubtitle", label: "Reveal Subtitle", type: "text" },
        { key: "revealDescription", label: "Reveal Description", type: "textarea" },
        { key: "headerLeft", label: "Header Left", type: "text" },
        { key: "headerRight", label: "Header Right", type: "text" },
        { key: "footerLeft", label: "Footer Left", type: "text" },
        { key: "footerRight", label: "Footer Right", type: "text" },
        { key: "viewportHeight", label: "Viewport Height", type: "text" },
        { key: "scrollHeight", label: "Scroll Height", type: "text" },
      ];

    default:
      return [];
  }
}

function ContentField({
  field,
  value,
  onChange,
}: {
  field: ContentFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    fontSize: "13px",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-fg)",
    outline: "none",
  };

  return (
    <div>
      {field.type !== "icon" && (
        <label
          style={{
            fontSize: "12px",
            color: "var(--fg-faint)",
            display: "block",
            marginBottom: "5px",
          }}
        >
          {field.label}
        </label>
      )}

      {field.type === "textarea" && (
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          style={{ ...baseInput, resize: "vertical" }}
        />
      )}

      {(field.type === "text" || field.type === "url") && (
        <input
          type={field.type === "url" ? "url" : "text"}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          style={baseInput}
        />
      )}

      {field.type === "number" && (
        <input
          type="number"
          value={Number(value ?? 0)}
          onChange={(e) => onChange(Number(e.target.value))}
          style={baseInput}
        />
      )}

      {field.type === "range" && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 1}
            step={field.step ?? 0.01}
            value={Number(value ?? field.min ?? 0)}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: "var(--accent)", cursor: "pointer" }}
          />
          <span
            style={{
              fontSize: "11px",
              color: "var(--fg-faint)",
              minWidth: "36px",
              textAlign: "right",
              fontFamily: "monospace",
            }}
          >
            {Number(value ?? field.min ?? 0).toFixed(
              field.step && field.step >= 1 ? 0 : 2,
            )}
          </span>
        </div>
      )}

      {field.type === "boolean" && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => onChange(!value)}
            style={{
              width: "40px",
              height: "22px",
              borderRadius: "11px",
              border: "none",
              cursor: "pointer",
              background: value ? "var(--accent)" : "var(--toggle-bg)",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: value ? "21px" : "3px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
              }}
            />
          </button>
          <span style={{ fontSize: "12px", color: "var(--fg-faint)" }}>
            {value ? "On" : "Off"}
          </span>
        </div>
      )}

      {field.type === "select" && field.options && (
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...baseInput, cursor: "pointer" }}
        >
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}

      {field.type === "color" && (
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <input
            type="color"
            value={
              /^#[0-9a-fA-F]{6}$/.test(String(value ?? ""))
                ? String(value)
                : "#0ea5e9"
            }
            onInput={(e) => onChange((e.target as HTMLInputElement).value)}
            onChange={() => {}}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "2px",
              background: "none",
              cursor: "pointer",
            }}
          />
          <input
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            style={{ ...baseInput, flex: 1, fontFamily: "monospace" }}
          />
        </div>
      )}

      {field.type === "icon" && (
        <IconPickerField
          value={String(value ?? "")}
          onChange={(v) => onChange(v)}
          label={field.label}
        />
      )}
    </div>
  );
}
