"use client";

import { useRef, useState, useLayoutEffect } from "react";
import type { ComponentNode, Breakpoint } from "@/types";
import {
  resolveResponsiveStyles,
  stylePropsToCSS,
  canHaveChildren,
  isInlineComponent,
  createNode,
} from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import { SelectionOverlay } from "@/components/editor/canvas/selection-overlay";
import { useGSAPAnimation } from "@/hooks/use-gsap-animations";
import { LucideIcon } from "@/lib/lucide-icon";

// Component implementations
import { HeroBlock } from "@/components/builder-components/marketing/hero-block"
import { FeaturesBlock } from "@/components/builder-components/marketing/features-block"
import { TestimonialsBlock } from "@/components/builder-components/marketing/testimonials-block"
import { PricingBlock } from "@/components/builder-components/marketing/pricing-block"
import { FAQBlock } from "@/components/builder-components/marketing/faq-block"
import { StatisticsBlock } from "@/components/builder-components/marketing/statistics-block"
import { CTASectionBlock } from "@/components/builder-components/marketing/cta-section-block"
import { FooterBlock } from "@/components/builder-components/marketing/footer-block"
import { HeadingBlock } from "@/components/builder-components/typography/heading-block"
import { ParagraphBlock } from "@/components/builder-components/typography/paragraph-block"
import { ButtonBlock } from "@/components/builder-components/layout/button-block"
import { ImageBlock } from "@/components/builder-components/media/image-block"
import { MarqueeBlock } from "@/components/builder-components/interactive/marquee-block"
import { AccordionBlock } from "@/components/builder-components/interactive/accordion-block"
import { ParticleSystemBlock } from "@/components/builder-components/three-d/particle-system-block"
import { FloatingObjectsBlock } from "@/components/builder-components/three-d/floating-objects-block"
import { InteractiveShapesBlock } from "@/components/builder-components/three-d/interactive-shapes-block"
import { ThreeDHeroBlock } from "@/components/builder-components/three-d/three-d-hero-block"
import { GlobeBlock } from "@/components/builder-components/three-d/globe-block"
import { ProductShowcaseBlock } from "@/components/builder-components/three-d/product-showcase-block"
import { GradientBlobBlock } from "@/components/builder-components/three-d/gradient-blob-block"
import { WaveTerrainBlock } from "@/components/builder-components/three-d/wave-terrain-block"
import { AuroraBlock } from "@/components/builder-components/three-d/aurora-block"
import { MorphSphereBlock } from "@/components/builder-components/three-d/morph-sphere-block"
import { GlassLayersBlock } from "@/components/builder-components/three-d/glass-layers-block"
import { PerspectiveGridBlock } from "@/components/builder-components/three-d/perspective-grid-block"
import { TubeRingBlock } from "@/components/builder-components/three-d/tube-ring-block"
import { LightTrailsBlock } from "@/components/builder-components/three-d/light-trails-block"
import { HorizontalScrollBlock } from "@/components/builder-components/animated/horizontal-scroll-block"
import { VerticalScrollCardsBlock } from "@/components/builder-components/animated/vertical-scroll-cards-block"
import { TextZoomScrollBlock } from "@/components/builder-components/animated/text-zoom-scroll-block"
import { StoryScrollBlock } from "@/components/builder-components/animated/story-scroll-block"
import { NormalStoryCarouselBlock } from "@/components/builder-components/animated/normal-story-carousel-block"
import { TextRevealBlock } from "@/components/builder-components/animated/text-reveal-block"
import {
  SliderBlock,
  CarouselBlock,
  CardSliderBlock,
  PaginationBlock,
  SidebarNavBlock,
  ModalBlock,
  DrawerBlock,
  SwitchBlock,
  CheckboxBlock,
  RangeSliderBlock,
  RatingBlock,
  PopoverBlock,
} from "@/components/renderer/interactive-components";

interface Props {
  node: ComponentNode;
  isPreview: boolean;
  selectedIds: string[];
  onSelect: (id: string, multi?: boolean) => void;
  onHover: (id: string | null) => void;
  breakpoint: Breakpoint;
  depth?: number;
  parentAutoStacking?: boolean;
  parentLocked?: boolean;
  buttonPassthroughStyles?: React.CSSProperties;
}

const THREE_D_TYPES = new Set([
  "particle-system",
  "floating-objects",
  "interactive-shapes",
  "3d-hero",
  "globe",
  "product-showcase",
  "gradient-blob",
  "wave-terrain",
  "aurora",
  "morph-sphere",
  "glass-layers",
  "perspective-grid",
  "tube-ring",
  "light-trails",
]);

const ANIMATED_SCROLL_TYPES = new Set([
  "horizontal-scroll",
  "vertical-scroll-cards",
  "text-zoom-scroll",
]);

const CONTENT_PROP_TYPES = new Set(["card", "hero", "footer"]);
function hasPropsContent(node: ComponentNode): boolean {
  if (!CONTENT_PROP_TYPES.has(node.type)) return false;
  const p = node.props as Record<string, unknown>;
  return !!(p.title || p.description || p.image || p.heading || p.subheading);
}

export function ComponentRenderer({
  node,
  isPreview,
  selectedIds,
  onSelect,
  onHover,
  breakpoint,
  depth = 0,
  parentAutoStacking = false,
  parentLocked = false,
}: Props) {
  const { hoveredNodeId } = useEditorStore();
  const nodeRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedIds.includes(node.id);
  const isHovered = hoveredNodeId === node.id && !isSelected;

  useGSAPAnimation(nodeRef, node.animations, isPreview);

  if (node.hidden && !isPreview) {
    return (
      <div style={{ opacity: 0.2, pointerEvents: "none" }}>
        <ComponentContent
          node={node}
          isPreview={isPreview}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onHover={onHover}
          breakpoint={breakpoint}
          depth={depth}
          buttonPassthroughStyles={{}}
        />
      </div>
    );
  }
  if (node.hidden && isPreview) return null;

  const resolvedStyles = resolveResponsiveStyles(node.styles, breakpoint);
  const inlineStyles = stylePropsToCSS(resolvedStyles);
  const inline = isInlineComponent(node.type);
  const isButtonType =
    node.type === "button" ||
    node.type === "cta-button" ||
    node.type === "icon-button";
  const hasExplicitWidth = !!resolvedStyles.width;

  // For buttons: extract visual styles that should be on the <a> tag, not the wrapper div
  let buttonPassthroughStyles: React.CSSProperties = {};
  if (isButtonType) {
    const passKeys: (keyof React.CSSProperties)[] = [
      "boxShadow",
      "padding",
      "paddingTop",
      "paddingBottom",
      "paddingLeft",
      "paddingRight",
    ];
    for (const k of passKeys) {
      if (inlineStyles[k] !== undefined) {
        (buttonPassthroughStyles as Record<string, unknown>)[k] =
          inlineStyles[k];
        delete (inlineStyles as Record<string, unknown>)[k];
      }
    }
  }

  const isContainerType = canHaveChildren(node.type);
  const DYNAMIC_CONTENT_TYPES = new Set([
    "accordion",
    "faq",
    "tabs",
    "pagination",
    "modal",
    "drawer",
    "popover",
  ]);
  // Convert height to minHeight for containers and dynamic-content components so they auto-grow
  if (
    (isContainerType || DYNAMIC_CONTENT_TYPES.has(node.type)) &&
    inlineStyles.height
  ) {
    inlineStyles.minHeight = inlineStyles.height;
    delete inlineStyles.height;
  }

  // For sections: move background-image to a dedicated layer so blur/video work properly
  const isSection = node.type === "section";
  const sectionBgVideo = (resolvedStyles as Record<string, unknown>)
    .backgroundVideo as string | undefined;
  const sectionBgImageBlur = (resolvedStyles as Record<string, unknown>)
    .imageBlur as string | undefined;
  const sectionOverlayColor = (resolvedStyles as Record<string, unknown>)
    .overlayColor as string | undefined;
  const sectionBgImage = isSection ? inlineStyles.backgroundImage : undefined;
  const sectionBgSize = isSection ? inlineStyles.backgroundSize : undefined;
  const sectionBgPos = isSection ? inlineStyles.backgroundPosition : undefined;
  const sectionBgRepeat = isSection ? inlineStyles.backgroundRepeat : undefined;
  const sectionBgAttach = isSection
    ? inlineStyles.backgroundAttachment
    : undefined;
  const sectionBgBlend = isSection
    ? inlineStyles.backgroundBlendMode
    : undefined;
  const useSectionBgLayer =
    isSection &&
    (sectionBgImage ||
      sectionBgVideo ||
      sectionBgImageBlur ||
      sectionOverlayColor);
  if (useSectionBgLayer) {
    delete (inlineStyles as Record<string, unknown>).backgroundImage;
    delete (inlineStyles as Record<string, unknown>).backgroundSize;
    delete (inlineStyles as Record<string, unknown>).backgroundPosition;
    delete (inlineStyles as Record<string, unknown>).backgroundRepeat;
    delete (inlineStyles as Record<string, unknown>).backgroundAttachment;
    delete (inlineStyles as Record<string, unknown>).backgroundBlendMode;
    if (!inlineStyles.position) inlineStyles.position = "relative";
    if (!inlineStyles.overflow) inlineStyles.overflow = "hidden";
  }

  // ── Auto-responsive (JS-driven, applied to inlineStyles directly) ────────
  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";
  let childrenAutoStacking = false;

  const is3DType = THREE_D_TYPES.has(node.type);
  const isAnimatedScroll = ANIMATED_SCROLL_TYPES.has(node.type);
  // Responsive style references
  const tabletS = node.styles.tablet || {};
  const mobileS = node.styles.mobile || {};
  const hasOverride = (prop: string) =>
    isMobile
      ? (mobileS as Record<string, unknown>)[prop] !== undefined ||
        (tabletS as Record<string, unknown>)[prop] !== undefined
      : (tabletS as Record<string, unknown>)[prop] !== undefined;

  if (isMobile || isTablet) {
    const desktopS = node.styles.desktop || {};
    const canvasW = isMobile ? 390 : 768;

    {
      // 1. Cap to parent width
      inlineStyles.maxWidth = "100%";
      inlineStyles.boxSizing = "border-box";

      // 2. Pull absolutely-positioned elements into normal flow
      const wasAbsolute =
        resolvedStyles.position === "absolute" ||
        resolvedStyles.position === "fixed";
      if (wasAbsolute && !hasOverride("position")) {
        inlineStyles.position = "relative";
      }
      for (const p of ["top", "right", "bottom", "left"] as const) {
        if (
          !hasOverride(p) &&
          ((inlineStyles as Record<string, string>)[p] ||
            (desktopS as Record<string, unknown>)[p] !== undefined)
        ) {
          (inlineStyles as Record<string, unknown>)[p] = "auto";
        }
      }

      // 3. Reset desktop translate transforms
      if (
        typeof resolvedStyles.transform === "string" &&
        (resolvedStyles.transform as string).includes("translate") &&
        !hasOverride("transform")
      ) {
        delete inlineStyles.transform;
      }

      // 4. Clamp widths + force auto height
      if (
        typeof inlineStyles.width === "string" &&
        inlineStyles.width.endsWith("px") &&
        !hasOverride("width")
      ) {
        inlineStyles.width = "100%";
      }
      if (is3DType) {
        // 3D Canvas elements need explicit height — scale proportionally
        if (
          !hasOverride("height") &&
          typeof inlineStyles.height === "string" &&
          inlineStyles.height.endsWith("px")
        ) {
          const h = parseFloat(inlineStyles.height);
          const w =
            typeof inlineStyles.width === "string" &&
            inlineStyles.width.endsWith("px")
              ? parseFloat(inlineStyles.width)
              : canvasW;
          if (!isNaN(h) && !isNaN(w) && w > 0) {
            inlineStyles.height = Math.round(h * (canvasW / w)) + "px";
          }
        }
      } else {
        if (
          !hasOverride("height") &&
          inlineStyles.height &&
          inlineStyles.height !== "auto"
        ) {
          inlineStyles.height = "auto";
        }
        if (
          !hasOverride("minHeight") &&
          inlineStyles.minHeight &&
          inlineStyles.minHeight !== "auto"
        ) {
          inlineStyles.minHeight = "auto";
        }
      }

      // 5. Reset margin-based positioning
      for (const m of ["marginTop", "marginLeft"] as const) {
        const val = inlineStyles[m];
        if (
          typeof val === "string" &&
          val !== "0px" &&
          val !== "0" &&
          val !== "auto" &&
          !hasOverride(m)
        ) {
          const px = parseInt(val);
          if (!isNaN(px) && Math.abs(px) > 0) inlineStyles[m] = "0px";
        }
      }
      if (isMobile) {
        for (const m of ["marginRight", "marginBottom"] as const) {
          const val = inlineStyles[m];
          if (
            typeof val === "string" &&
            val.startsWith("-") &&
            !hasOverride(m)
          ) {
            inlineStyles[m] = "0px";
          }
        }
      }

      // 6. Containers: full width + auto height
      if (isContainerType) {
        if (!hasOverride("width")) inlineStyles.width = "100%";
        if (!hasOverride("height")) inlineStyles.height = "auto";
        if (!hasOverride("minHeight")) inlineStyles.minHeight = "auto";
      }

      // 7. Non-container elements: full width
      if (!isContainerType && !hasOverride("width")) {
        inlineStyles.width = "100%";
      }
    }

    // 8. Auto-stack flex-row / grid to column
    const isFlex = resolvedStyles.display === "flex" || node.type === "flex";
    const isGrid = resolvedStyles.display === "grid" || node.type === "grid";
    const dir = resolvedStyles.flexDirection as string | undefined;
    const isFlexRow =
      isFlex && (!dir || dir === "row" || dir === "row-reverse");

    if (isContainerType && (isFlexRow || isGrid)) {
      const bpHasLayoutOverride = isMobile
        ? !!(
            mobileS.flexDirection ||
            mobileS.gridTemplateColumns ||
            tabletS.flexDirection ||
            tabletS.gridTemplateColumns
          )
        : !!(tabletS.flexDirection || tabletS.gridTemplateColumns);

      if (!bpHasLayoutOverride) {
        childrenAutoStacking = true;
        if (isFlexRow) {
          inlineStyles.flexDirection = "column";
          inlineStyles.flexWrap = "nowrap";
        }
        if (isGrid) {
          inlineStyles.gridTemplateColumns = isMobile
            ? "1fr"
            : "repeat(2, 1fr)";
        }
      }
    }

    // 9. Children of auto-stacking parents: full width
    if (parentAutoStacking && !is3DType) {
      inlineStyles.width = "100%";
      inlineStyles.flex = "none";
      inlineStyles.minWidth = "unset";
    }

    // 10. Section padding reduction on mobile
    if (isMobile && node.type === "section") {
      if (!hasOverride("paddingTop")) inlineStyles.paddingTop = "40px";
      if (!hasOverride("paddingBottom")) inlineStyles.paddingBottom = "40px";
      if (!hasOverride("paddingLeft")) inlineStyles.paddingLeft = "16px";
      if (!hasOverride("paddingRight")) inlineStyles.paddingRight = "16px";
    }

    // 11. Mobile: shrink spacers
    if (isMobile && node.type === "spacer" && !hasOverride("height")) {
      inlineStyles.height = "32px";
      delete inlineStyles.minHeight;
    }

    // 12. Scale down oversized font on mobile
    if (
      isMobile &&
      typeof inlineStyles.fontSize === "string" &&
      inlineStyles.fontSize.endsWith("px") &&
      !hasOverride("fontSize")
    ) {
      const fs = parseInt(inlineStyles.fontSize);
      if (!isNaN(fs) && fs > 48)
        inlineStyles.fontSize = "clamp(28px, 8vw, " + fs + "px)";
    }
  }

  return (
    <div
      ref={nodeRef}
      data-node-id={node.id}
      data-node-type={node.type}
      onClick={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        onSelect(node.id, e.metaKey || e.ctrlKey);
      }}
      onMouseEnter={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        onHover(node.id);
      }}
      onMouseLeave={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        onHover(null);
      }}
      style={{
        // Base defaults (overridable by user styles in preview)
        ...(inline && !hasExplicitWidth ? { width: "fit-content" } : {}),
        // User styles (includes position from resolvedStyles + auto-responsive resets)
        ...inlineStyles,
        // Editor-only overrides (AFTER user styles so they always take effect)
        ...(!isPreview
          ? {
              ...(isMobile || isTablet
                ? {
                    position: "relative" as const,
                    top: "auto",
                    left: "auto",
                    right: "auto",
                    bottom: "auto",
                    ...(is3DType || isAnimatedScroll
                      ? {}
                      : { height: "auto", minHeight: "auto" }),
                    ...(isContainerType ? { width: "100%" } : {}),
                    ...(inline
                      ? {
                          width: "fit-content",
                          display: "inline-flex" as const,
                        }
                      : {}),
                  }
                : {
                    position:
                      resolvedStyles.position === "absolute" ||
                      resolvedStyles.position === "fixed"
                        ? (resolvedStyles.position as "absolute" | "fixed")
                        : ("relative" as const),
                  }),
              cursor: isSelected ? "grab" : "pointer",
              pointerEvents: "auto" as const,
            }
          : {
              // Preview: ensure elements default to relative if no position set
              ...(!inlineStyles.position
                ? { position: "relative" as const }
                : {}),
            }),
        // Default z-index: 3D shapes behind, regular content in front
        ...(!inlineStyles.zIndex
          ? { zIndex: THREE_D_TYPES.has(node.type) ? 0 : 1 }
          : {}),
        // Selection / hover indicator
        ...(isSelected && !isPreview
          ? {
              outline: "2px solid #0ea5e9",
              outlineOffset: "1px",
              overflow: "visible",
            }
          : isHovered && !isPreview
            ? {
                outline: "1px dashed var(--border-focus)",
                outlineOffset: "0px",
              }
            : {}),
      }}
    >
      {/* Selection label + resize handles + drag handle */}
      {isSelected && !isPreview && (
        <>
          <div
            style={{
              position: "absolute",
              top: "-22px",
              left: "-2px",
              zIndex: 1000,
              background: "var(--accent)",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: "4px 4px 0 0",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {node.name || node.type}
          </div>
          <SelectionOverlay
            nodeId={node.id}
            nodeRef={nodeRef}
            breakpoint={breakpoint}
          />
        </>
      )}

      {(() => {
        const hasBorderRadius = !!(
          inlineStyles.borderRadius ||
          inlineStyles.borderTopLeftRadius ||
          inlineStyles.borderTopRightRadius ||
          inlineStyles.borderBottomLeftRadius ||
          inlineStyles.borderBottomRightRadius
        );
        const innerClip =
          hasBorderRadius && !isButtonType
            ? {
                overflow: "hidden" as const,
                borderRadius: "inherit",
                height: "inherit",
                minHeight: "inherit",
              }
            : undefined;

        const is3D = THREE_D_TYPES.has(node.type);

        const content = (
          <>
            {useSectionBgLayer &&
              (() => {
                const blurFilter = sectionBgImageBlur
                  ? sectionBgImageBlur.includes("(")
                    ? sectionBgImageBlur
                    : `blur(${sectionBgImageBlur}${/^\d+$/.test(sectionBgImageBlur) ? "px" : ""})`
                  : undefined;
                return (
                  <>
                    {sectionBgVideo && (
                      <SectionVideoBg
                        src={sectionBgVideo}
                        blurFilter={blurFilter}
                      />
                    )}
                    {sectionBgImage && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: sectionBgImage,
                          backgroundSize: sectionBgSize ?? "cover",
                          backgroundPosition: sectionBgPos ?? "center",
                          backgroundRepeat: sectionBgRepeat ?? "no-repeat",
                          backgroundAttachment: sectionBgAttach,
                          backgroundBlendMode: sectionBgBlend,
                          zIndex: -2,
                          pointerEvents: "none",
                          filter: sectionBgVideo ? undefined : blurFilter,
                        }}
                      />
                    )}
                    {sectionOverlayColor && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: sectionOverlayColor,
                          zIndex: -1,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </>
                );
              })()}
            <ComponentContent
              node={node}
              isPreview={isPreview}
              selectedIds={selectedIds}
              onSelect={onSelect}
              onHover={onHover}
              breakpoint={breakpoint}
              depth={depth}
              buttonPassthroughStyles={buttonPassthroughStyles}
            />

            {/* Children (for container types — tabs, card-slider, pagination, accordion handle their own children) */}
            {node.children.length > 0 &&
              node.type !== "tabs" &&
              node.type !== "card-slider" &&
              node.type !== "pagination" &&
              node.type !== "accordion" && (
                <>
                  {node.children.map((child) => (
                    <ComponentRenderer
                      key={child.id}
                      node={child}
                      isPreview={isPreview}
                      selectedIds={selectedIds}
                      onSelect={onSelect}
                      onHover={onHover}
                      breakpoint={breakpoint}
                      depth={depth + 1}
                      parentAutoStacking={childrenAutoStacking}
                      parentLocked={false}
                    />
                  ))}
                </>
              )}

            {/* Drop zone indicator for empty containers (hide for tabs, card, etc.) */}
            {!isPreview &&
              node.children.length === 0 &&
              canHaveChildren(node.type) &&
              !hasPropsContent(node) &&
              node.type !== "tabs" &&
              node.type !== "card-slider" &&
              node.type !== "pagination" &&
              node.type !== "accordion" && (
                <div
                  style={{
                    padding: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed var(--border)",
                    borderRadius: "8px",
                    margin: "8px",
                    color: "var(--fg-dim)",
                    fontSize: "12px",
                    pointerEvents: "none",
                  }}
                >
                  Drop components here
                </div>
              )}
          </>
        );

        return innerClip ? <div style={innerClip}>{content}</div> : content;
      })()}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ComponentContent({
  node,
  isPreview,
  selectedIds,
  onSelect,
  onHover,
  breakpoint,
  depth,
  buttonPassthroughStyles = {},
}: Props) {
  const props = node.props as Record<string, any>; // any here lets us spread into React components

  switch (node.type) {
    // ── Marketing ─────────────────────────────────────────────────────────────
    case "hero":
      return <HeroBlock {...props} breakpoint={breakpoint} />;
    case "features":
      return <FeaturesBlock {...props} breakpoint={breakpoint} />;
    case "testimonials":
      return <TestimonialsBlock {...props} breakpoint={breakpoint} />;
    case "pricing":
      return <PricingBlock {...props} breakpoint={breakpoint} />;
    case "faq":
      return <FAQBlock {...props} breakpoint={breakpoint} />;
    case "statistics":
      return <StatisticsBlock {...props} breakpoint={breakpoint} />;
    case "cta-section":
      return <CTASectionBlock {...props} breakpoint={breakpoint} />;
    case "footer":
      return <FooterBlock {...props} breakpoint={breakpoint} />;

    // ── Typography ────────────────────────────────────────────────────────────
    case "heading":
      return <HeadingBlock {...props} breakpoint={breakpoint} />;
    case "paragraph":
      return <ParagraphBlock {...props} breakpoint={breakpoint} />;
    case "blockquote":
      return (
        <blockquote
          style={{
            borderLeft: "4px solid currentColor",
            paddingLeft: "20px",
            fontStyle: "italic",
            margin: 0,
            opacity: 0.9,
          }}
        >
          <p style={{ marginBottom: "8px" }}>{props.text as string}</p>
          {props.author && (
            <cite style={{ opacity: 0.6, fontSize: "0.75em" }}>
              — {props.author as string}
            </cite>
          )}
        </blockquote>
      );
    case "rich-text":
      return (
        <div
          dangerouslySetInnerHTML={{ __html: (props.html as string) ?? "" }}
        />
      );
    case "list":
      const items = (props.items as string[]) ?? [];
      return props.ordered ? (
        <ol style={{ paddingLeft: "20px" }}>
          {items.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ol>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {items.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      );

    // ── Buttons ───────────────────────────────────────────────────────────────
    case "button":
    case "cta-button":
    case "icon-button":
      return (
        <ButtonBlock
          {...props}
          type={node.type}
          wrapperStyles={buttonPassthroughStyles}
        />
      );

    // ── Media ─────────────────────────────────────────────────────────────────
    case "image":
      return <ImageBlock {...props} />;
    case "video":
      return (
        <video
          src={props.src as string}
          poster={props.poster as string}
          autoPlay={props.autoplay as boolean}
          loop={props.loop as boolean}
          muted={(props.muted as boolean) ?? true}
          controls={!props.autoplay}
          style={{ width: "100%", borderRadius: "inherit", display: "block" }}
        />
      );

    // ── Interactive ───────────────────────────────────────────────────────────
    case "marquee":
      return <MarqueeBlock {...props} />;
    case "accordion":
      return (
        <AccordionContainer
          accordionId={node.id}
          allowMultiple={props.allowMultiple as boolean}
          iconStyle={props.iconStyle as string}
          gap={props.gap as string}
          nodeChildren={node.children}
          isPreview={isPreview}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onHover={onHover}
          breakpoint={breakpoint}
          depth={depth}
        />
      );
    case "accordion-item":
      return null;
    case "counter":
      return (
        <div style={{ textAlign: "inherit" }}>
          <div style={{ fontSize: "3.5em", fontWeight: 800, lineHeight: 1 }}>
            {props.to as number}
            {props.suffix as string}
          </div>
          <div style={{ fontSize: "0.85em", opacity: 0.6, marginTop: "8px" }}>
            {props.label as string}
          </div>
        </div>
      );
    case "progress-bar":
      return (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <span style={{ opacity: 0.8 }}>{props.label as string}</span>
            {props.showValue && (
              <span style={{ fontWeight: 600 }}>{props.value as number}%</span>
            )}
          </div>
          <div
            style={{
              height: "8px",
              background: "rgba(128,128,128,0.2)",
              borderRadius: "inherit",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${props.value as number}%`,
                background: "currentColor",
                borderRadius: "inherit",
                transition: "width 1s ease",
                opacity: 0.8,
              }}
            />
          </div>
        </div>
      );
    case "tabs":
      return (
        <TabsContainer
          tabs={(props.tabs as { label: string }[]) ?? []}
          nodeChildren={node.children}
          isPreview={isPreview}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onHover={onHover}
          breakpoint={breakpoint}
          depth={depth}
        />
      );

    // ── Advanced ─────────────────────────────────────────────────────────────
    case "timeline":
      return <TimelineBlock {...props} />;
    case "bento-grid":
      return <BentoGridBlock {...props} breakpoint={breakpoint} />;

    // ── Layout primitives (no content, children handled by parent) ──────────
    case "section":
    case "container":
    case "flex":
    case "grid":
    case "stack":
      return null;

    case "spacer":
      return <div style={{ height: (props.height as string) ?? "64px" }} />;

    case "divider":
      return (
        <hr
          style={{
            border: "none",
            borderTop: `1px ${(props.style as string) ?? "solid"} var(--border)`,
            margin: "0",
          }}
        />
      );

    case "badge": {
      const badgeVariant = (props.variant as string) ?? "primary";
      const badgeColors: Record<
        string,
        { bg: string; fg: string; border: string }
      > = {
        primary: { bg: "#0ea5e920", fg: "#0ea5e9", border: "#0ea5e940" },
        secondary: { bg: "#8b5cf620", fg: "#8b5cf6", border: "#8b5cf640" },
        success: { bg: "#22c55e20", fg: "#22c55e", border: "#22c55e40" },
        warning: { bg: "#f59e0b20", fg: "#f59e0b", border: "#f59e0b40" },
        error: { bg: "#ef444420", fg: "#ef4444", border: "#ef444440" },
      };
      const bc = badgeColors[badgeVariant] ?? badgeColors.primary;
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            borderRadius: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            background: bc.bg,
            color: bc.fg,
            transition: "all 0.2s",
          }}
        >
          {props.text as string}
        </span>
      );
    }

    case "card": {
      const imgHeight = (props.imageHeight as string) || "auto";
      const imgFit = (props.imageFit as string) || "cover";
      return (
        <div
          style={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}
        >
          {props.image && (
            <div
              style={{
                width: "100%",
                height: imgHeight,
                borderRadius: "8px",
                marginBottom: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src={props.image as string}
                alt={(props.title as string) ?? "Card image"}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: imgFit as React.CSSProperties["objectFit"],
                }}
              />
            </div>
          )}
          {props.title && (
            <h3
              style={{
                fontSize: "1.15em",
                fontWeight: 700,
                marginBottom: "8px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {props.title as string}
            </h3>
          )}
          {props.description && (
            <p
              style={{
                fontSize: "0.875em",
                opacity: 0.7,
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {props.description as string}
            </p>
          )}
        </div>
      );
    }

    case "icon":
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <LucideIcon
            name={(props.name as string) ?? "star"}
            size={(props.size as number) ?? 24}
            color={(props.color as string) ?? "currentColor"}
          />
        </div>
      );

    // ── 3D ───────────────────────────────────────────────────────────────────
    case "particle-system":
      return <ParticleSystemBlock {...props} />;
    case "floating-objects":
      return <FloatingObjectsBlock {...props} />;
    case "interactive-shapes":
      return <InteractiveShapesBlock {...props} />;
    case "3d-hero":
      return <ThreeDHeroBlock {...props} />;
    case "globe":
      return <GlobeBlock {...props} />;
    case "product-showcase":
      return <ProductShowcaseBlock {...props} />;
    case "gradient-blob":
      return <GradientBlobBlock {...props} />;
    case "wave-terrain":
      return <WaveTerrainBlock {...props} />;
    case "aurora":
      return <AuroraBlock {...props} />;
    case "morph-sphere":
      return <MorphSphereBlock {...props} />;
    case "glass-layers":
      return <GlassLayersBlock {...props} />;
    case "perspective-grid":
      return <PerspectiveGridBlock {...props} />;
    case "tube-ring":
      return <TubeRingBlock {...props} />;
    case "light-trails":
      return <LightTrailsBlock {...props} />;

    // ── Forms ─────────────────────────────────────────────────────────────────
    case "input":
      return (
        <div>
          {props.label && (
            <label
              style={{
                display: "block",
                fontSize: "0.8em",
                fontWeight: 500,
                opacity: 0.7,
                marginBottom: "6px",
              }}
            >
              {props.label as string}
            </label>
          )}
          <input
            type={(props.type as string) ?? "text"}
            placeholder={props.placeholder as string}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "inherit",
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          {props.label && (
            <label
              style={{
                display: "block",
                fontSize: "0.8em",
                fontWeight: 500,
                opacity: 0.7,
                marginBottom: "6px",
              }}
            >
              {props.label as string}
            </label>
          )}
          <textarea
            placeholder={props.placeholder as string}
            rows={(props.rows as number) ?? 4}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "inherit",
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>
      );

    case "checkbox":
      return (
        <CheckboxBlock
          label={props.label as string}
          checked={props.checked as boolean}
        />
      );

    case "radio":
      return (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            padding: "8px 0",
          }}
        >
          <input
            type="radio"
            name={(props.name as string) ?? "radio-group"}
            value={(props.value as string) ?? ""}
            defaultChecked={(props.checked as boolean) ?? false}
            style={{
              width: "18px",
              height: "18px",
              flexShrink: 0,
              margin: 0,
              accentColor: "currentColor",
              cursor: "pointer",
            }}
          />
          <span
            style={{
              color: "inherit",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          >
            {(props.label as string) ?? "Option"}
          </span>
        </label>
      );

    case "select-field":
      return (
        <div>
          {props.label && (
            <label
              style={{
                display: "block",
                fontSize: "0.8em",
                fontWeight: 500,
                opacity: 0.7,
                marginBottom: "6px",
              }}
            >
              {props.label as string}
            </label>
          )}
          <select
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              color: "inherit",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            {(
              (props.options as string[]) ?? [
                "Option 1",
                "Option 2",
                "Option 3",
              ]
            ).map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case "gallery": {
      const galleryImages =
        (props.images as { src: string; alt: string }[] | undefined) ?? [];
      const galleryRadius = (props.borderRadius as string) ?? "8px";
      const galleryAspect = (props.aspectRatio as string) ?? "1";
      const galleryCols =
        breakpoint === "mobile"
          ? 1
          : breakpoint === "tablet"
            ? 2
            : ((props.columns as number) ?? 3);
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${galleryCols}, 1fr)`,
            gap: (props.gap as string) ?? "16px",
          }}
        >
          {galleryImages.length === 0
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio:
                      galleryAspect === "auto" ? undefined : galleryAspect,
                    borderRadius: galleryRadius,
                    background: "var(--pill-bg)",
                    border: "1px dashed var(--divider)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--fg-dim)",
                    fontSize: "12px",
                    gap: "4px",
                    padding: "16px",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  <span>Add images</span>
                </div>
              ))
            : galleryImages.map((img, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio:
                      galleryAspect === "auto" ? undefined : galleryAspect,
                    borderRadius: galleryRadius,
                    overflow: "hidden",
                    background: "var(--pill-bg)",
                    border: "1px solid var(--divider)",
                  }}
                >
                  {img.src ? (
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--fg-dim)",
                        fontSize: "12px",
                      }}
                    >
                      No URL
                    </div>
                  )}
                </div>
              ))}
        </div>
      );
    }

    case "slider":
      return (
        <SliderBlock
          slides={
            props.slides as { src: string; alt?: string; caption?: string }[]
          }
          autoplay={props.autoplay as boolean}
          interval={props.interval as number}
          showDots={props.showDots as boolean}
          showArrows={props.showArrows as boolean}
        />
      );

    case "team": {
      const teamCols =
        breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : 3;
      return (
        <div style={{ textAlign: "inherit" }}>
          <h2
            style={{
              fontSize: breakpoint === "mobile" ? "1.5em" : "2em",
              fontWeight: 800,
              marginBottom: breakpoint === "mobile" ? "24px" : "40px",
            }}
          >
            {(props.heading as string) ?? "Meet the Team"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${teamCols}, 1fr)`,
              gap: breakpoint === "mobile" ? "20px" : "32px",
            }}
          >
            {["Alice", "Bob", "Charlie"].map((name) => (
              <div key={name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(128,128,128,0.1)",
                    border: "1px solid rgba(128,128,128,0.2)",
                    margin: "0 auto 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.4"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div style={{ fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: "0.8em", opacity: 0.6 }}>Role</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "modal":
      return (
        <ModalBlock
          triggerText={props.triggerText as string}
          title={props.title as string}
          content={props.content as string}
        />
      );

    case "drawer":
      return (
        <DrawerBlock
          triggerText={props.triggerText as string}
          title={props.title as string}
          side={props.side as "left" | "right"}
          content={props.content as string}
        />
      );

    case "carousel":
      return (
        <CarouselBlock
          items={props.items as { src: string; alt?: string }[]}
          autoplay={props.autoplay as boolean}
          interval={props.interval as number}
        />
      );

    case "card-slider":
      return (
        <CardSliderContainer
          cards={
            props.cards as {
              image?: string;
              title?: string;
              description?: string;
              buttonText?: string;
              buttonUrl?: string;
            }[]
          }
          autoplay={props.autoplay as boolean}
          interval={props.interval as number}
          visibleCards={props.visibleCards as number}
          gap={props.gap as number}
          accentColor={props.accentColor as string}
          cardBg={props.cardBg as string}
          cardBorderRadius={props.cardBorderRadius as string}
          breakpoint={breakpoint}
          nodeChildren={node.children}
          isPreview={isPreview}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onHover={onHover}
          depth={depth}
        />
      );

    case "masonry-grid": {
      const masonryCols =
        breakpoint === "mobile"
          ? 1
          : breakpoint === "tablet"
            ? 2
            : ((props.columns as number) ?? 3);
      return (
        <div style={{ columns: masonryCols, gap: "16px" }}>
          {[120, 180, 140, 200, 160, 130].map((h, i) => (
            <div
              key={i}
              style={{
                height: `${h}px`,
                borderRadius: "inherit",
                background: "rgba(128,128,128,0.06)",
                border: "1px solid rgba(128,128,128,0.2)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.5,
                fontSize: "0.85em",
                breakInside: "avoid" as never,
              }}
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      );
    }
    // ── Logos strip ───────────────────────────────────────────────────────────
    case "logos":
      return (
        <div>
          {props.heading && (
            <p
              style={{
                textAlign: "center",
                fontSize: "0.8em",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "24px",
                opacity: 0.5,
              }}
            >
              {props.heading as string}
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: breakpoint === "mobile" ? "24px" : "48px",
              justifyContent: "center",
              flexWrap: "wrap",
              opacity: 0.4,
            }}
          >
            {["Vercel", "Stripe", "Linear", "Notion", "Figma", "GitHub"].map(
              (l) => (
                <span key={l} style={{ fontSize: "1.25em", fontWeight: 800 }}>
                  {l}
                </span>
              ),
            )}
          </div>
        </div>
      );

    // ── Media (extra) ──────────────────────────────────────────────────────────
    case "audio":
      return (
        <div>
          <audio
            controls={(props.controls as boolean) ?? true}
            src={props.src as string}
            autoPlay={props.autoplay as boolean}
            loop={props.loop as boolean}
            style={{ width: "100%" }}
          >
            Your browser does not support audio.
          </audio>
        </div>
      );

    case "embed":
      return (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: (props.aspectRatio as string) ?? "16/9",
          }}
        >
          {(props.src as string) ? (
            <>
              <iframe
                src={props.src as string}
                title={(props.title as string) ?? "Embed"}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "inherit",
                }}
              />
              {!isPreview && !selectedIds.includes(node.id) && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    cursor: "grab",
                  }}
                />
              )}
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "var(--pill-bg)",
                border: "1px dashed var(--divider)",
                borderRadius: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg-dim)",
                fontSize: "13px",
              }}
            >
              Paste embed URL
            </div>
          )}
        </div>
      );

    case "map": {
      const mapSrc = props.src as string | undefined;
      const mapAddress = props.address as string | undefined;
      const mapZoom = props.zoom as number | undefined;
      const mapUrl =
        mapSrc && mapSrc !== "https://www.google.com/maps/embed"
          ? mapSrc
          : mapAddress
            ? `https://www.google.com/maps/embed?pb=&q=${encodeURIComponent(mapAddress)}&z=${mapZoom ?? 14}&output=embed`
            : "";
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "250px",
            background: "var(--pill-bg)",
            border: "1px solid var(--divider)",
            borderRadius: "inherit",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {mapUrl ? (
            <>
              <iframe
                src={mapUrl}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                title="Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {!isPreview && !selectedIds.includes(node.id) && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    cursor: "grab",
                  }}
                />
              )}
            </>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg-dim)",
                gap: "8px",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: "13px" }}>
                Paste an iframe or enter an address
              </span>
            </div>
          )}
        </div>
      );
    }

    // ── Forms (extra) ────────────────────────────────────────────────────────
    case "form":
      return null;

    case "file-upload":
      return (
        <div>
          {props.label && (
            <label
              style={{
                display: "block",
                fontSize: "0.8em",
                fontWeight: 500,
                opacity: 0.7,
                marginBottom: "6px",
              }}
            >
              {props.label as string}
            </label>
          )}
          <div
            style={{
              border: "2px dashed currentColor",
              borderRadius: "inherit",
              padding: "24px",
              textAlign: "center",
              cursor: "pointer",
              opacity: 0.5,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ margin: "0 auto 8px" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div>Click or drag to upload</div>
            <div style={{ fontSize: "0.8em", marginTop: "4px" }}>
              Accepts: {(props.accept as string) ?? "*"}
            </div>
          </div>
        </div>
      );

    case "range-slider":
      return (
        <RangeSliderBlock
          label={props.label as string}
          value={props.value as number}
          min={props.min as number}
          max={props.max as number}
          step={props.step as number}
        />
      );

    case "switch":
      return (
        <SwitchBlock
          label={props.label as string}
          checked={props.checked as boolean}
        />
      );

    case "date-picker":
      return (
        <div>
          {props.label && (
            <label
              style={{
                display: "block",
                fontSize: "0.8em",
                fontWeight: 500,
                opacity: 0.7,
                marginBottom: "6px",
              }}
            >
              {props.label as string}
            </label>
          )}
          <input
            type="date"
            placeholder={props.placeholder as string}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "inherit",
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>
      );

    // ── Navigation ────────────────────────────────────────────────────────────
    case "navbar":
      return (
        <NavbarBlock
          brand={props.brand as string}
          links={props.links as NavLink[]}
          breakpoint={breakpoint}
        />
      );

    case "breadcrumb":
      return (
        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {((props.items as { text: string; href?: string }[]) ?? []).map(
            (item, i, arr) => (
              <span
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      opacity: 0.8,
                    }}
                  >
                    {item.text}
                  </a>
                ) : (
                  <span style={{ opacity: 0.6 }}>{item.text}</span>
                )}
                {i < arr.length - 1 && <span style={{ opacity: 0.4 }}>/</span>}
              </span>
            ),
          )}
        </nav>
      );

    case "pagination":
      return (
        <PaginationContainer
          totalPages={props.totalPages as number}
          currentPage={props.currentPage as number}
          paginationProps={props}
          nodeChildren={node.children}
          isPreview={isPreview}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onHover={onHover}
          breakpoint={breakpoint}
          depth={depth}
        />
      );

    case "sidebar-nav":
      return (
        <SidebarNavBlock
          title={props.title as string}
          links={
            props.links as { text: string; href: string; active?: boolean }[]
          }
        />
      );

    case "menu":
      return (
        <div
          style={{
            display: "flex",
            flexDirection:
              (props.direction as string) === "vertical" ? "column" : "row",
            gap: (props.direction as string) === "vertical" ? "4px" : "24px",
          }}
        >
          {((props.links as { text: string; href: string }[]) ?? []).map(
            (link, i) => (
              <a
                key={i}
                href={link.href}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  padding: "4px 0",
                  opacity: 0.7,
                }}
              >
                {link.text}
              </a>
            ),
          )}
        </div>
      );

    // ── Content ──────────────────────────────────────────────────────────────
    case "link":
      return (
        <a
          href={(props.href as string) ?? "#"}
          target={(props.target as string) ?? "_self"}
          style={{
            color: "inherit",
            fontSize: "inherit",
            textDecoration: props.underline ? "underline" : "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {props.icon && props.iconPosition !== "right" && (
            <LucideIcon name={props.icon as string} size={16} />
          )}
          {(props.text as string) ?? "Link"}
          {props.icon && props.iconPosition === "right" && (
            <LucideIcon name={props.icon as string} size={16} />
          )}
        </a>
      );

    case "social-links": {
      const socialIcons: Record<string, string> = {
        twitter:
          "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
        github:
          "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
        linkedin:
          "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
        instagram:
          "M17.5 6.5h.01 M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
        youtube:
          "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z",
      };
      const socialSize = (props.size as number) ?? 20;
      return (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {((props.links as { platform: string; url: string }[]) ?? []).map(
            (s, i) => (
              <a
                key={i}
                href={s.url}
                style={{ color: "inherit", display: "flex", opacity: 0.7 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width={socialSize}
                  height={socialSize}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={socialIcons[s.platform] ?? socialIcons.github} />
                </svg>
              </a>
            ),
          )}
        </div>
      );
    }

    case "rating":
      return (
        <RatingBlock
          value={props.value as number}
          max={props.max as number}
          size={props.size as number}
        />
      );

    case "avatar": {
      const avatarSizes = { sm: 32, md: 40, lg: 56 };
      const avatarSize =
        avatarSizes[(props.size as "sm" | "md" | "lg") ?? "md"];
      const initials = ((props.name as string) ?? "JD")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <div
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: "50%",
            overflow: "hidden",
            background: props.src ? "none" : "currentColor",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: avatarSize * 0.4,
            flexShrink: 0,
          }}
        >
          {(props.src as string) ? (
            <img
              src={props.src as string}
              alt={props.name as string}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ color: "#fff", mixBlendMode: "difference" }}>
              {initials}
            </span>
          )}
        </div>
      );
    }

    case "avatar-group": {
      const agSizes = { sm: 32, md: 40, lg: 56 };
      const agSize = agSizes[(props.size as "sm" | "md" | "lg") ?? "md"];
      const agAvatars =
        (props.avatars as { name: string; src?: string }[]) ?? [];
      const agMax = (props.max as number) ?? 3;
      const shown = agAvatars.slice(0, agMax);
      const extra = agAvatars.length - agMax;
      return (
        <div style={{ display: "flex" }}>
          {shown.map((av, i) => (
            <div
              key={i}
              style={{
                width: agSize,
                height: agSize,
                borderRadius: "50%",
                overflow: "hidden",
                background: av.src ? "none" : "currentColor",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: agSize * 0.4,
                border: "2px solid rgba(128,128,128,0.2)",
                marginLeft: i > 0 ? -agSize * 0.25 : 0,
              }}
            >
              {av.src ? (
                <img
                  src={av.src}
                  alt={av.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#fff", mixBlendMode: "difference" }}>
                  {av.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>
          ))}
          {extra > 0 && (
            <div
              style={{
                width: agSize,
                height: agSize,
                borderRadius: "50%",
                background: "rgba(128,128,128,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "inherit",
                fontWeight: 700,
                fontSize: agSize * 0.35,
                border: "2px solid rgba(128,128,128,0.2)",
                marginLeft: -agSize * 0.25,
              }}
            >
              +{extra}
            </div>
          )}
        </div>
      );
    }

    case "tooltip":
      return (
        <span
          style={{
            borderBottom: "1px dashed currentColor",
            cursor: "help",
            color: "inherit",
            fontSize: "inherit",
          }}
          title={props.tooltip as string}
        >
          {(props.text as string) ?? "Hover me"}
        </span>
      );

    case "alert": {
      const alertVariants: Record<string, { icon: string }> = {
        info: { icon: "ℹ" },
        success: { icon: "✓" },
        warning: { icon: "⚠" },
        error: { icon: "✕" },
      };
      const av =
        alertVariants[(props.variant as string) ?? "info"] ??
        alertVariants.info;
      return (
        <div
          style={{
            padding: "16px",
            borderRadius: "inherit",
            background: "rgba(128,128,128,0.08)",
            border: "1px solid rgba(128,128,128,0.2)",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontWeight: 700, flexShrink: 0 }}>{av.icon}</span>
          <div>
            {props.title && (
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                {props.title as string}
              </div>
            )}
            <div style={{ fontSize: "0.9em", opacity: 0.7 }}>
              {props.message as string}
            </div>
          </div>
        </div>
      );
    }

    case "tag-group":
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {((props.tags as string[]) ?? []).map((t, i) => (
            <span
              key={i}
              style={{
                padding: "4px 12px",
                borderRadius: "inherit",
                fontSize: "0.8em",
                fontWeight: 600,
                background: "rgba(128,128,128,0.12)",
                color: "inherit",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      );

    case "table": {
      const headers = (props.headers as string[]) ?? [];
      const rows = (props.rows as string[][]) ?? [];
      const cellPad = props.compact ? "6px 10px" : "10px 16px";
      const borderStyle = "1px solid rgba(128,128,128,0.2)";
      return (
        <div style={{ width: "100%" }}>
          {props.heading && (
            <div
              style={{
                fontSize: "1.1em",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              {props.heading as string}
            </div>
          )}
          <div
            style={{
              overflowX: "auto",
              borderRadius: "inherit",
              border: borderStyle,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "inherit",
                fontFamily: "inherit",
                color: "inherit",
              }}
            >
              <thead>
                <tr style={{ borderBottom: borderStyle }}>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: cellPad,
                        textAlign: "left",
                        fontWeight: 600,
                        background: "rgba(128,128,128,0.06)",
                        ...(props.bordered ? { border: borderStyle } : {}),
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={ri}
                    style={{
                      borderBottom: ri < rows.length - 1 ? borderStyle : "none",
                      background:
                        props.striped && ri % 2 === 1
                          ? "rgba(128,128,128,0.06)"
                          : "transparent",
                      transition: props.hoverable ? "background 0.15s" : "none",
                    }}
                    onMouseEnter={
                      props.hoverable
                        ? (e) => {
                            e.currentTarget.style.background =
                              "rgba(128,128,128,0.1)";
                          }
                        : undefined
                    }
                    onMouseLeave={
                      props.hoverable
                        ? (e) => {
                            e.currentTarget.style.background =
                              props.striped && ri % 2 === 1
                                ? "rgba(128,128,128,0.06)"
                                : "transparent";
                          }
                        : undefined
                    }
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: cellPad,
                          opacity: 0.8,
                          ...(props.bordered ? { border: borderStyle } : {}),
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {props.caption && (
            <div
              style={{
                fontSize: "0.8em",
                opacity: 0.5,
                marginTop: "6px",
                textAlign: "center",
              }}
            >
              {props.caption as string}
            </div>
          )}
        </div>
      );
    }

    case "code-block":
      return (
        <pre
          style={{
            padding: "16px",
            borderRadius: "inherit",
            overflow: "auto",
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(128,128,128,0.2)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.85em",
            lineHeight: 1.6,
            color: "#e4e4e7",
            margin: 0,
          }}
        >
          <code>{(props.code as string) ?? "// code here"}</code>
        </pre>
      );

    // ── Marketing (extra) ────────────────────────────────────────────────────
    case "newsletter":
      return (
        <div
          style={{ textAlign: "center", maxWidth: "480px", margin: "0 auto" }}
        >
          <h2
            style={{
              fontSize: breakpoint === "mobile" ? "1.35em" : "1.75em",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            {props.heading as string}
          </h2>
          <p
            style={{ fontSize: "0.875em", opacity: 0.6, marginBottom: "24px" }}
          >
            {props.subtext as string}
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexDirection:
                breakpoint === "mobile"
                  ? ("column" as const)
                  : ("row" as const),
            }}
          >
            <input
              type="email"
              placeholder={(props.placeholder as string) ?? "your@email.com"}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "inherit",
                border: "1px solid rgba(128,128,128,0.3)",
                background: "var(--input-bg)",
                color: "inherit",
                fontSize: "inherit",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            <button
              style={{
                padding: "12px 24px",
                borderRadius: "inherit",
                background: "currentColor",
                border: "none",
                fontWeight: 600,
                fontSize: "inherit",
                fontFamily: "inherit",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#fff", mixBlendMode: "difference" }}>
                {(props.buttonText as string) ?? "Subscribe"}
              </span>
            </button>
          </div>
        </div>
      );

    case "contact-form": {
      const cfFields = (
        (props.fields as (
          | string
          | {
              name: string;
              label: string;
              type: string;
              placeholder: string;
              required?: boolean;
              options?: string[];
            }
        )[]) ?? ["name", "email", "message"]
      ).map((f) => {
        if (typeof f === "string")
          return {
            name: f,
            label: f.charAt(0).toUpperCase() + f.slice(1),
            type:
              f === "email"
                ? "email"
                : f === "message"
                  ? "textarea"
                  : f === "phone"
                    ? "tel"
                    : "text",
            placeholder: `Your ${f}`,
            required: false,
          };
        return f;
      });
      const cfLabelPos = (props.labelPosition as string) ?? "top";
      const cfInputRadius = (props.inputRadius as string) ?? "8px";
      const cfGap = `${(props.fieldGap as number) ?? 16}px`;
      const cfBtnStyle = (props.buttonStyle as string) ?? "filled";
      const cfBtnFull = (props.buttonFullWidth as boolean) ?? false;
      const cfInputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: cfInputRadius,
        background: "var(--input-bg)",
        border: "1px solid rgba(128,128,128,0.3)",
        color: "inherit",
        fontSize: "inherit",
        fontFamily: "inherit",
        outline: "none",
      };
      const cfBtnBase: React.CSSProperties = {
        padding: "12px 24px",
        borderRadius: cfInputRadius,
        fontWeight: 600,
        fontSize: "inherit",
        fontFamily: "inherit",
        cursor: "pointer",
        alignSelf: cfBtnFull ? "stretch" : "flex-start",
        width: cfBtnFull ? "100%" : "auto",
      };
      const cfBtnStyles: Record<string, React.CSSProperties> = {
        filled: { ...cfBtnBase, background: "currentColor", border: "none" },
        outline: {
          ...cfBtnBase,
          background: "transparent",
          border: "2px solid currentColor",
          color: "inherit",
        },
        ghost: {
          ...cfBtnBase,
          background: "rgba(128,128,128,0.08)",
          border: "none",
          color: "inherit",
        },
      };

      return (
        <div>
          <h2
            style={{
              fontSize: breakpoint === "mobile" ? "1.35em" : "1.75em",
              fontWeight: 800,
              marginBottom: props.subtext
                ? "8px"
                : breakpoint === "mobile"
                  ? "16px"
                  : "24px",
            }}
          >
            {(props.heading as string) ?? "Get in touch"}
          </h2>
          {props.subtext && (
            <p
              style={{
                fontSize: "0.9em",
                opacity: 0.6,
                marginBottom: breakpoint === "mobile" ? "16px" : "24px",
                marginTop: 0,
              }}
            >
              {props.subtext as string}
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: cfGap }}>
            {cfFields.map((f) => (
              <div
                key={f.name}
                style={
                  cfLabelPos === "inline"
                    ? { display: "flex", alignItems: "center", gap: "12px" }
                    : {}
                }
              >
                {cfLabelPos !== "hidden" && (
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8em",
                      fontWeight: 500,
                      opacity: 0.7,
                      marginBottom: cfLabelPos === "top" ? "6px" : "0",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      minWidth: cfLabelPos === "inline" ? "80px" : undefined,
                    }}
                  >
                    {f.label}
                    {f.required && (
                      <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                        *
                      </span>
                    )}
                  </label>
                )}
                {f.type === "textarea" ? (
                  <textarea
                    rows={4}
                    placeholder={f.placeholder}
                    style={{ ...cfInputStyle, resize: "vertical" }}
                  />
                ) : f.type === "select" ? (
                  <select style={{ ...cfInputStyle, cursor: "pointer" }}>
                    <option value="">{f.placeholder || "Select..."}</option>
                    {(f.options ?? []).map((opt, oi) => (
                      <option key={oi} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : f.type === "checkbox" ? (
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "currentColor",
                      }}
                    />
                    <span style={{ fontSize: "0.85em" }}>
                      {f.placeholder || f.label}
                    </span>
                  </label>
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    style={cfInputStyle}
                  />
                )}
              </div>
            ))}
            <button style={cfBtnStyles[cfBtnStyle] ?? cfBtnStyles.filled}>
              {cfBtnStyle === "filled" ? (
                <span style={{ color: "#fff", mixBlendMode: "difference" }}>
                  {(props.buttonText as string) ?? "Send Message"}
                </span>
              ) : (
                <span>{(props.buttonText as string) ?? "Send Message"}</span>
              )}
            </button>
          </div>
        </div>
      );
    }

    case "banner":
      return (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "inherit",
            background: "rgba(128,128,128,0.08)",
            border: "1px solid rgba(128,128,128,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <span>{props.text as string}</span>
          {props.linkText && (
            <a
              href={(props.href as string) ?? "#"}
              style={{
                color: "inherit",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              {props.linkText as string}
            </a>
          )}
        </div>
      );

    // ── Interactive (extra) ───────────────────────────────────────────────────
    case "popover":
      return (
        <PopoverBlock
          triggerText={props.triggerText as string}
          content={props.content as string}
        />
      );

    case "steps": {
      const stepsData =
        (props.steps as { title: string; description: string }[]) ?? [];
      const currentStep = (props.currentStep as number) ?? 1;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {stepsData.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                paddingBottom: i < stepsData.length - 1 ? "24px" : "0",
                position: "relative",
              }}
            >
              {i < stepsData.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "32px",
                    bottom: "0",
                    width: "2px",
                    background:
                      i + 1 < currentStep
                        ? "currentColor"
                        : "rgba(128,128,128,0.3)",
                  }}
                />
              )}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8em",
                  fontWeight: 700,
                  background:
                    i + 1 <= currentStep
                      ? "currentColor"
                      : "rgba(128,128,128,0.2)",
                }}
              >
                <span
                  style={
                    i + 1 <= currentStep
                      ? { color: "#fff", mixBlendMode: "difference" }
                      : { opacity: 0.5 }
                  }
                >
                  {i + 1}
                </span>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                  {step.title}
                </div>
                <div style={{ fontSize: "0.85em", opacity: 0.5 }}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ── Animated ──────────────────────────────────────────────────────────────
    case "horizontal-scroll":
      return <HorizontalScrollBlock {...props} isPreview={isPreview} />
    case "vertical-scroll-cards":
      return <VerticalScrollCardsBlock {...props} isPreview={isPreview} />
    case "text-zoom-scroll":
      return <TextZoomScrollBlock {...props} isPreview={isPreview} />
    case "story-scroll":
      return <StoryScrollBlock {...props} isPreview={isPreview} />
    case "normal-story-carousel":
      return <NormalStoryCarouselBlock {...props} isPreview={isPreview} />
    case "text-reveal":
      return <TextRevealBlock {...props} isPreview={isPreview} />
    default:
      return (
        <div
          style={{
            padding: "16px",
            fontSize: "12px",
            color: "var(--fg-faint)",
            border: "1px dashed var(--border)",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {node.type}
        </div>
      );
  }
}

// ── Accordion Container (each child is an accordion-item, selectable & stylable) ──

function AccordionContainer({
  accordionId,
  allowMultiple = false,
  iconStyle = "plus",
  gap = "8px",
  nodeChildren,
  isPreview,
  selectedIds,
  onSelect,
  onHover,
  breakpoint,
  depth = 0,
}: {
  accordionId: string;
  allowMultiple?: boolean;
  iconStyle?: string;
  gap?: string;
  nodeChildren: ComponentNode[];
  isPreview: boolean;
  selectedIds: string[];
  onSelect: (id: string, multi?: boolean) => void;
  onHover: (id: string | null) => void;
  breakpoint: Breakpoint;
  depth?: number;
}) {
  const { addNode } = useEditorStore();
  const [openIndexes, setOpenIndexes] = useState<number[]>(() => {
    const defaults: number[] = [];
    nodeChildren.forEach((child, i) => {
      if ((child.props as Record<string, unknown>).defaultOpen)
        defaults.push(i);
    });
    return defaults;
  });

  const toggle = (i: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(i) ? [] : [i]));
    }
  };

  const getIcon = (isOpen: boolean) => {
    if (iconStyle === "none") return null;
    const style: React.CSSProperties = {
      transition: "transform 0.2s",
      opacity: 0.4,
      flexShrink: 0,
      marginLeft: "12px",
    };
    if (iconStyle === "arrow")
      return (
        <span
          style={{
            ...style,
            transform: isOpen ? "rotate(90deg)" : "rotate(0)",
          }}
        >
          ▶
        </span>
      );
    if (iconStyle === "chevron")
      return (
        <span
          style={{
            ...style,
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
            fontSize: "0.8em",
          }}
        >
          ▼
        </span>
      );
    return (
      <span
        style={{ ...style, transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
      >
        +
      </span>
    );
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap, width: "100%" }}
    >
      {nodeChildren.map((child, i) => {
        const isOpen = openIndexes.includes(i);
        const childProps = child.props as Record<string, unknown>;
        const title = (childProps.title as string) || `Item ${i + 1}`;
        const childStyles = resolveResponsiveStyles(child.styles, breakpoint);
        const childCSS = stylePropsToCSS(childStyles);
        const isItemSelected = selectedIds.includes(child.id);

        // Separate border/radius from childCSS so they apply to the wrapper properly
        const {
          borderRadius: itemRadius,
          background,
          backgroundColor,
          color,
          fontSize,
          fontWeight,
          fontFamily,
          padding,
          ...restCSS
        } = childCSS as Record<string, unknown>;

        return (
          <div
            key={child.id}
            data-node-id={child.id}
            data-node-type={child.type}
            onClick={(e) => {
              if (isPreview) return;
              e.stopPropagation();
              onSelect(child.id, e.metaKey || e.ctrlKey);
            }}
            onMouseEnter={(e) => {
              if (!isPreview) {
                e.stopPropagation();
                onHover(child.id);
              }
            }}
            onMouseLeave={(e) => {
              if (!isPreview) {
                e.stopPropagation();
                onHover(null);
              }
            }}
            style={{
              border: `1px solid ${isOpen ? "currentColor" : "rgba(128,128,128,0.15)"}`,
              overflow: "hidden",
              borderRadius: (itemRadius as string) || "8px",
              background:
                ((background || backgroundColor) as string) || undefined,
              color: (color as string) || undefined,
              ...restCSS,
              ...(isItemSelected && !isPreview
                ? { outline: "2px solid #0ea5e9", outlineOffset: "1px" }
                : {}),
            }}
          >
            {/* Accordion header — click selects the item, double-click toggles */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isPreview) {
                  toggle(i);
                } else {
                  onSelect(child.id, e.metaKey || e.ctrlKey);
                  toggle(i);
                }
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: (padding as string) || "16px 20px",
                border: "none",
                cursor: "pointer",
                fontFamily: (fontFamily as string) || "inherit",
                fontWeight: (fontWeight as string | number) || 600,
                textAlign: "left",
                background: "none",
                color: "inherit",
                fontSize: (fontSize as string) || "inherit",
                opacity: isOpen ? 1 : 0.8,
              }}
            >
              {title}
              {getIcon(isOpen)}
            </button>
            {/* Accordion body — shows children directly, no inner selection */}
            {isOpen && (
              <div style={{ padding: "0 20px 16px", width: "100%" }}>
                {child.children.map((grandchild) => (
                  <ComponentRenderer
                    key={grandchild.id}
                    node={grandchild}
                    isPreview={isPreview}
                    selectedIds={selectedIds}
                    onSelect={onSelect}
                    onHover={onHover}
                    breakpoint={breakpoint}
                    depth={depth + 2}
                  />
                ))}
                {child.children.length === 0 && !isPreview && (
                  <div
                    style={{
                      padding: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed var(--border)",
                      borderRadius: "8px",
                      color: "var(--fg-dim)",
                      fontSize: "12px",
                      pointerEvents: "none",
                    }}
                  >
                    Drop components here
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {/* Add Item button — editor only */}
      {!isPreview && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newItem = createNode("accordion-item");
            newItem.props = {
              title: `Question ${nodeChildren.length + 1}?`,
              defaultOpen: false,
            };
            newItem.name = `Question ${nodeChildren.length + 1}?`;
            addNode(newItem, accordionId);
          }}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px dashed var(--border)",
            borderRadius: "6px",
            background: "none",
            cursor: "pointer",
            color: "var(--fg-dim)",
            fontSize: "12px",
            fontFamily: "inherit",
            marginTop: "4px",
          }}
        >
          + Add Item
        </button>
      )}
    </div>
  );
}

// ── Tabs Container (renders children inside active tab pane) ───────────────

function TabsContainer({
  tabs,
  nodeChildren,
  isPreview,
  selectedIds,
  onSelect,
  onHover,
  breakpoint,
  depth = 0,
}: {
  tabs: { label: string }[];
  nodeChildren: ComponentNode[];
  isPreview: boolean;
  selectedIds: string[];
  onSelect: (id: string, multi?: boolean) => void;
  onHover: (id: string | null) => void;
  breakpoint: Breakpoint;
  depth?: number;
}) {
  const [active, setActive] = useState(0);

  if (tabs.length === 0) return null;

  const safeActive = Math.min(active, tabs.length - 1);

  return (
    <div>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(128,128,128,0.2)",
          marginBottom: "16px",
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: "8px 16px",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "inherit",
              borderBottom:
                i === safeActive
                  ? "2px solid currentColor"
                  : "2px solid transparent",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: 500,
              opacity: i === safeActive ? 1 : 0.5,
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Render tab panes — only active one is visible */}
      {nodeChildren.map((child, i) => (
        <div
          key={child.id}
          style={{
            display: i === safeActive ? "block" : "none",
            minHeight: "40px",
          }}
        >
          <ComponentRenderer
            node={child}
            isPreview={isPreview}
            selectedIds={selectedIds}
            onSelect={onSelect}
            onHover={onHover}
            breakpoint={breakpoint}
            depth={depth + 1}
          />
        </div>
      ))}
      {/* Drop zone when active tab pane has no children */}
      {nodeChildren[safeActive] &&
        nodeChildren[safeActive].children.length === 0 &&
        !isPreview && (
          <div
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed var(--border)",
              borderRadius: "8px",
              margin: "8px",
              color: "var(--fg-dim)",
              fontSize: "12px",
              pointerEvents: "none",
            }}
          >
            Drop components into this tab
          </div>
        )}
    </div>
  );
}

// ── Pagination Container (renders children as page panes, one visible at a time) ──

function PaginationContainer({
  totalPages,
  currentPage,
  paginationProps,
  nodeChildren,
  isPreview,
  selectedIds,
  onSelect,
  onHover,
  breakpoint,
  depth = 0,
}: {
  totalPages: number;
  currentPage: number;
  paginationProps: Record<string, unknown>;
  nodeChildren: ComponentNode[];
  isPreview: boolean;
  selectedIds: string[];
  onSelect: (id: string, multi?: boolean) => void;
  onHover: (id: string | null) => void;
  breakpoint: Breakpoint;
  depth?: number;
}) {
  const [activePage, setActivePage] = useState(currentPage);

  const safeActive = Math.max(1, Math.min(activePage, totalPages));
  const activeIndex = safeActive - 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Page content panes — fills all available space */}
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        {nodeChildren.map((child, i) => (
          <div
            key={child.id}
            style={{
              display: i === activeIndex ? "flex" : "none",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            <ComponentRenderer
              node={child}
              isPreview={isPreview}
              selectedIds={selectedIds}
              onSelect={onSelect}
              onHover={onHover}
              breakpoint={breakpoint}
              depth={depth + 1}
            />
          </div>
        ))}
        {/* Drop zone when active page pane is empty */}
        {nodeChildren[activeIndex] &&
          nodeChildren[activeIndex].children.length === 0 &&
          !isPreview && (
            <div
              style={{
                padding: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed var(--border)",
                borderRadius: "8px",
                margin: "8px",
                color: "var(--fg-dim)",
                fontSize: "12px",
                pointerEvents: "none",
                flexDirection: "column",
                gap: "4px",
                height: "100%",
              }}
            >
              <span>Page {safeActive} — Drop components here</span>
            </div>
          )}
      </div>
      {/* Pagination controls — always at bottom */}
      <PaginationBlock
        {...paginationProps}
        totalPages={totalPages}
        currentPage={safeActive}
        onPageChange={setActivePage}
      />
    </div>
  );
}

// ── Card Slider Container (renders children as individual card slots) ───────

interface CardSliderCard {
  image?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

function CardSliderContainer({
  cards = [],
  autoplay,
  interval,
  visibleCards = 3,
  gap = 16,
  accentColor = "#3b82f6",
  cardBg = "rgba(255,255,255,0.08)",
  cardBorderRadius = "16px",
  breakpoint = "desktop",
  nodeChildren,
  isPreview,
  selectedIds,
  onSelect,
  onHover,
  depth = 0,
}: {
  cards?: CardSliderCard[];
  autoplay?: boolean;
  interval?: number;
  visibleCards?: number;
  gap?: number;
  accentColor?: string;
  cardBg?: string;
  cardBorderRadius?: string;
  breakpoint?: string;
  nodeChildren: ComponentNode[];
  isPreview: boolean;
  selectedIds: string[];
  onSelect: (id: string, multi?: boolean) => void;
  onHover: (id: string | null) => void;
  depth?: number;
}) {
  const hasChildren = nodeChildren.length > 0;
  const totalCards = hasChildren ? nodeChildren.length : cards.length;

  if (hasChildren) {
    return (
      <CardSliderBlock
        cards={[]}
        autoplay={autoplay}
        interval={interval}
        visibleCards={visibleCards}
        gap={gap}
        accentColor={accentColor}
        cardBg={cardBg}
        cardBorderRadius={cardBorderRadius}
        breakpoint={breakpoint}
        totalOverride={totalCards}
        renderCard={(idx) => {
          const child = nodeChildren[idx];
          const isContainer =
            child.type === "container" ||
            child.type === "flex" ||
            child.type === "stack" ||
            child.type === "grid";
          const isEmpty = isContainer && child.children.length === 0;
          return (
            <div
              data-card-slot=""
              style={{
                minHeight: "80px",
                width: "100%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <ComponentRenderer
                node={child}
                isPreview={isPreview}
                selectedIds={selectedIds}
                onSelect={onSelect}
                onHover={onHover}
                breakpoint={breakpoint as "desktop" | "tablet" | "mobile"}
                depth={depth + 1}
              />
              {isEmpty && !isPreview && (
                <div
                  style={{
                    padding: "24px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed var(--border)",
                    borderRadius: "8px",
                    margin: "8px",
                    color: "var(--fg-dim)",
                    fontSize: "11px",
                    pointerEvents: "none",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Drop components here
                </div>
              )}
            </div>
          );
        }}
      />
    );
  }

  if (totalCards === 0 && !isPreview) {
    return (
      <div
        style={{
          width: "100%",
          padding: "40px 20px",
          textAlign: "center",
          border: "1px dashed var(--border)",
          borderRadius: "12px",
          color: "var(--fg-dim)",
          fontSize: "13px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.4"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>No cards — use the Content panel to add cards</span>
      </div>
    );
  }

  return (
    <CardSliderBlock
      cards={cards}
      autoplay={autoplay}
      interval={interval}
      visibleCards={visibleCards}
      gap={gap}
      accentColor={accentColor}
      cardBg={cardBg}
      cardBorderRadius={cardBorderRadius}
      breakpoint={breakpoint}
    />
  );
}

// ── Inline mini-implementations ────────────────────────────────────────────

// ── Navbar with nested dropdown links ──────────────────────────────────────

interface NavLink {
  text: string;
  href?: string;
  disabled?: boolean;
  children?: NavLink[];
}

function NavbarBlock({
  brand,
  links = [],
  breakpoint = "desktop",
}: {
  brand?: string;
  links?: NavLink[];
  breakpoint?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = breakpoint === "mobile" || breakpoint === "tablet";

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "relative",
      }}
    >
      <span style={{ fontSize: "1.15em", fontWeight: 800 }}>
        {brand ?? "Brand"}
      </span>

      {/* Hamburger button — mobile/tablet only */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "currentColor",
              borderRadius: "1px",
              transition: "transform 0.2s, opacity 0.2s",
              transform: mobileOpen ? "rotate(45deg) translateY(6px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "currentColor",
              borderRadius: "1px",
              transition: "opacity 0.2s",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "currentColor",
              borderRadius: "1px",
              transition: "transform 0.2s, opacity 0.2s",
              transform: mobileOpen
                ? "rotate(-45deg) translateY(-6px)"
                : "none",
            }}
          />
        </button>
      )}

      {/* Desktop links */}
      {!isMobile && (
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {links.map((link, i) => {
            const hasChildren = link.children && link.children.length > 0;
            return (
              <div
                key={i}
                style={{ position: "relative" }}
                onMouseEnter={() => hasChildren && setOpenIdx(i)}
                onMouseLeave={() => setOpenIdx(null)}
              >
                <a
                  href={link.disabled ? undefined : (link.href ?? "#")}
                  onClick={(e) => {
                    if (link.disabled || hasChildren) e.preventDefault();
                  }}
                  style={{
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background:
                      openIdx === i ? "rgba(128,128,128,0.08)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {link.text}
                  {hasChildren && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        opacity: 0.5,
                        transition: "transform 0.2s",
                        transform:
                          openIdx === i ? "rotate(180deg)" : "rotate(0)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </a>
                {hasChildren && openIdx === i && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      minWidth: "160px",
                      background: "var(--card-bg, #fff)",
                      border: "1px solid rgba(128,128,128,0.15)",
                      borderRadius: "8px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      padding: "4px",
                      zIndex: 100,
                      marginTop: "2px",
                    }}
                  >
                    {link.children!.map((child, ci) => (
                      <a
                        key={ci}
                        href={child.href ?? "#"}
                        style={{
                          display: "block",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          color: "inherit",
                          fontSize: "0.9em",
                          opacity: 0.8,
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(128,128,128,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {child.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile menu panel */}
      {isMobile && mobileOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 200,
            background: "inherit",
            borderTop: "1px solid rgba(128,128,128,0.15)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: "8px 0",
          }}
        >
          {links.map((link, i) => {
            const hasChildren = link.children && link.children.length > 0;
            return (
              <div key={i}>
                <a
                  href={link.disabled ? undefined : (link.href ?? "#")}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      setOpenIdx(openIdx === i ? null : i);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 24px",
                    textDecoration: "none",
                    color: "inherit",
                    opacity: 0.8,
                    fontSize: "0.95em",
                  }}
                >
                  {link.text}
                  {hasChildren && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        opacity: 0.4,
                        transition: "transform 0.2s",
                        transform:
                          openIdx === i ? "rotate(180deg)" : "rotate(0)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </a>
                {hasChildren && openIdx === i && (
                  <div style={{ paddingLeft: "16px", paddingBottom: "4px" }}>
                    {link.children!.map((child, ci) => (
                      <a
                        key={ci}
                        href={child.href ?? "#"}
                        style={{
                          display: "block",
                          padding: "8px 24px",
                          textDecoration: "none",
                          color: "inherit",
                          fontSize: "0.85em",
                          opacity: 0.6,
                        }}
                      >
                        {child.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function TimelineBlock({
  items = [],
}: {
  items?: { title: string; description: string; date: string }[];
}) {
  return (
    <div style={{ position: "relative", paddingLeft: "32px" }}>
      <div
        style={{
          position: "absolute",
          left: "10px",
          top: 0,
          bottom: 0,
          width: "2px",
          background: "currentColor",
          opacity: 0.3,
        }}
      />
      {(items as { title: string; description: string; date: string }[]).map(
        (item, i) => (
          <div key={i} style={{ position: "relative", marginBottom: "32px" }}>
            <div
              style={{
                position: "absolute",
                left: "-26px",
                top: "4px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "currentColor",
              }}
            />
            <div
              style={{ fontSize: "0.75em", opacity: 0.5, marginBottom: "4px" }}
            >
              {item.date}
            </div>
            <div
              style={{
                fontSize: "1.1em",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              {item.title}
            </div>
            <div style={{ fontSize: "0.9em", opacity: 0.7 }}>
              {item.description}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function BentoGridBlock({
  items = [],
  breakpoint = "desktop",
}: {
  items?: unknown[];
  breakpoint?: string;
}) {
  const placeholders =
    items.length > 0
      ? items
      : [
          { title: "Feature 1", description: "Description here", span: 2 },
          { title: "Feature 2", description: "Another one", span: 1 },
          { title: "Feature 3", description: "And another", span: 1 },
          { title: "Feature 4", description: "Last one", span: 2 },
        ];
  const cols = breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : 3;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "16px",
      }}
    >
      {(
        placeholders as { title: string; description: string; span?: number }[]
      ).map((item, i) => (
        <div
          key={i}
          style={{
            gridColumn:
              breakpoint === "mobile"
                ? "span 1"
                : `span ${Math.min(item.span ?? 1, cols)}`,
            padding: breakpoint === "mobile" ? "16px" : "24px",
            borderRadius: "inherit",
            background: "rgba(128,128,128,0.06)",
            border: "1px solid rgba(128,128,128,0.12)",
          }}
        >
          <h3
            style={{ fontSize: "1.15em", fontWeight: 700, marginBottom: "8px" }}
          >
            {item.title}
          </h3>
          <p style={{ fontSize: "0.875em", opacity: 0.5 }}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function ThreeDPlaceholder({ type }: { type: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "300px",
        background:
          "radial-gradient(circle at 50% 50%, rgba(128,128,128,0.08) 0%, transparent 70%)",
        border: "1px dashed rgba(128,128,128,0.2)",
        borderRadius: "inherit",
      }}
    >
      <div style={{ fontSize: "3em", marginBottom: "12px", opacity: 0.4 }}>
        &#127760;
      </div>
      <div style={{ textAlign: "center", opacity: 0.5 }}>
        <div style={{ fontWeight: 600, marginBottom: "4px" }}>{type}</div>
        <div style={{ fontSize: "0.85em" }}>
          3D component renders in preview mode
        </div>
      </div>
    </div>
  );
}

// ── Section background video ────────────────────────────────────────────────
// Supports YouTube, Vimeo, and direct video URLs (.mp4 / .webm / etc).
// Uses ResizeObserver + 16:9 cover math so the video actually fills the section.
function parseVideoSource(url: string): {
  kind: "youtube" | "vimeo" | "direct";
  embed: string;
  videoId?: string;
} {
  const u = url.trim();
  // youtu.be/<id>
  let m = u.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{6,})/i,
  );
  if (m) {
    const id = m[1];
    // NOTE: intentionally no `playlist=` / `loop=` — that param combo adds the
    // prev/next chrome. We loop manually via postMessage on 'ended'.
    const embed = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`;
    return { kind: "youtube", embed, videoId: id };
  }
  // vimeo.com/<id>
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (m) {
    const id = m[1];
    const embed = `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&controls=0`;
    return { kind: "vimeo", embed, videoId: id };
  }
  return { kind: "direct", embed: u };
}

// Load the YouTube IFrame API exactly once per page.
let ytApiPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as unknown as {
    YT?: { Player: unknown };
    onYouTubeIframeAPIReady?: () => void;
  };
  if (w.YT && w.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>((resolve) => {
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

let ytPlayerCounter = 0;

function SectionVideoBg({
  src,
  blurFilter,
}: {
  src: string;
  blurFilter: string | undefined;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerIdRef = useRef<string>(`__yt_bg_${++ytPlayerCounter}`);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const { kind, embed, videoId } = parseVideoSource(src);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ratio = 16 / 9;
    // For iframe embeds (YouTube/Vimeo), oversize so any player chrome at the
    // edges is cropped by the wrapper's overflow:hidden.
    const overscale = kind === "direct" ? 1 : 1.5;
    const compute = (w: number, h: number) => {
      if (w <= 0 || h <= 0) return;
      let vw: number;
      let vh: number;
      if (w / h > ratio) {
        vw = w;
        vh = w / ratio;
      } else {
        vw = h * ratio;
        vh = h;
      }
      setDims({ w: vw * overscale, h: vh * overscale });
    };
    const ro = new ResizeObserver(([entry]) => {
      compute(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    compute(r.width, r.height);
    return () => ro.disconnect();
  }, [kind]);

  // YouTube: use the official IFrame Player API. Loop via seekTo(0) on ENDED
  // (no playlist chrome). Reveal the video only after PLAYING + a small grace,
  // with a 3s wall-clock fallback if the API script is blocked.
  useLayoutEffect(() => {
    if (kind !== "youtube") {
      setReady(true);
      return;
    }
    setReady(false);
    const iframe = iframeRef.current;
    if (!iframe) return;
    let cancelled = false;
    let player: {
      destroy?: () => void;
      playVideo?: () => void;
      seekTo?: (t: number, allow: boolean) => void;
      mute?: () => void;
    } | null = null;
    let revealTimer: ReturnType<typeof setTimeout> | null = null;
    const reveal = (delay: number) => {
      if (revealTimer) clearTimeout(revealTimer);
      revealTimer = setTimeout(() => {
        if (!cancelled) setReady(true);
      }, delay);
    };
    // Hard fallback in case the API script is blocked.
    reveal(3000);
    loadYouTubeAPI().then(() => {
      if (cancelled) return;
      const w = window as unknown as {
        YT?: {
          Player: new (id: string, opts: unknown) => typeof player;
          PlayerState: { PLAYING: number; ENDED: number };
        };
      };
      if (!w.YT || !w.YT.Player) return;
      player = new w.YT.Player(playerIdRef.current, {
        events: {
          onReady: (e: {
            target: { mute: () => void; playVideo: () => void };
          }) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e: {
            data: number;
            target: {
              seekTo: (t: number, allow: boolean) => void;
              playVideo: () => void;
            };
          }) => {
            if (!w.YT) return;
            if (e.data === w.YT.PlayerState.PLAYING) {
              // 500ms grace covers YouTube's own UI fade-out.
              reveal(500);
            } else if (e.data === w.YT.PlayerState.ENDED) {
              e.target.seekTo(0, true);
              e.target.playVideo();
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      if (revealTimer) clearTimeout(revealTimer);
      try {
        player?.destroy?.();
      } catch {
        /* noop */
      }
    };
  }, [kind, videoId, embed]);

  const commonStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: dims.w || "100%",
    height: dims.h || "100%",
    transform: "translate(-50%, -50%)",
    border: 0,
    pointerEvents: "none",
  };

  return (
    <div
      ref={wrapRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: -3,
        pointerEvents: "none",
        filter: blurFilter,
        background: "#000",
      }}
    >
      {kind === "direct" ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          src={embed}
          style={{ ...commonStyle, objectFit: "cover" }}
        />
      ) : (
        <iframe
          ref={iframeRef}
          id={kind === "youtube" ? playerIdRef.current : undefined}
          src={embed}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          title="Background video"
          style={commonStyle}
        />
      )}
      {/* Black shield — hard cutover (no fade) so no frame of YouTube's UI can
          leak through. Lifted once player reports PLAYING + 400ms grace, or a
          2s wall-clock fallback. */}
      {!ready && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
