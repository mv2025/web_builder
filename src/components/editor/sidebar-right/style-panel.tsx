"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useEditorStore } from "@/stores/editor-store";
import type { ComponentNode, StyleProps } from "@/types";
import { SectionLabel } from "./right-sidebar";

interface StylePanelProps {
  node: ComponentNode;
}

export function StylePanel({ node }: StylePanelProps) {
  const { updateNodeStyles, breakpoint } = useEditorStore();
  const styles = (node.styles[breakpoint] ||
    node.styles.desktop ||
    {}) as StyleProps;
  const [search, setSearch] = useState("");

  const update = (partial: Partial<StyleProps>) =>
    updateNodeStyles(node.id, partial, breakpoint);

  const q = search.toLowerCase().trim();

  const match = (...terms: string[]) =>
    !q || terms.some((t) => t.toLowerCase().includes(q));

  const showFlex =
    styles.display === "flex" || styles.display === "inline-flex";
  const showGrid = styles.display === "grid";

  const sections = useMemo(() => {
    const s: { label: string; visible: boolean }[] = [];

    // Layout
    const layoutRows = [
      match("display", "layout", "block", "flex", "grid", "inline", "none"),
      showFlex && match("direction", "flex-direction", "row", "column"),
      showFlex && match("wrap", "flex-wrap", "nowrap"),
      showFlex &&
        match("justify", "justify-content", "space-between", "center"),
      showFlex && match("align", "align-items", "stretch", "baseline"),
      showFlex && match("gap", "spacing"),
      showFlex && match("grow", "flex-grow"),
      showFlex && match("shrink", "flex-shrink"),
      showFlex && match("basis", "flex-basis"),
      showGrid && match("columns", "grid-template-columns", "grid"),
      showGrid && match("rows", "grid-template-rows", "grid"),
      showGrid && match("gap", "grid-gap"),
      showGrid && match("column gap", "col gap", "column-gap"),
      showGrid && match("row gap", "row-gap"),
      showGrid && match("place", "place-items"),
      match("align self", "align-self"),
      match("order"),
      match("overflow", "scroll", "hidden"),
      match("overflow-x", "x overflow"),
      match("overflow-y", "y overflow"),
    ];
    s.push({ label: "Layout", visible: layoutRows.some(Boolean) });

    // Size
    s.push({
      label: "Size",
      visible: [
        match("width", "size"),
        match("height", "size"),
        match("min-width", "min w"),
        match("max-width", "max w"),
        match("min-height", "min h"),
        match("max-height", "max h"),
        match("aspect", "ratio"),
        match("box-sizing", "box size"),
        match("object-fit", "obj fit", "cover", "contain"),
        match("object-position", "obj pos"),
      ].some(Boolean),
    });

    // Spacing
    s.push({
      label: "Spacing",
      visible: match("padding", "margin", "spacing", "space"),
    });

    // Typography
    s.push({
      label: "Typography",
      visible: [
        match("font", "family", "typography"),
        match("font-size", "size", "text"),
        match("font-weight", "weight", "bold"),
        match("font-style", "italic"),
        match("line-height", "line h"),
        match("letter-spacing", "letter"),
        match("word-spacing", "word"),
        match("text-align", "align", "center", "justify"),
        match("color", "text color"),
        match("text-transform", "uppercase", "lowercase", "capitalize"),
        match("text-decoration", "underline", "overline", "line-through"),
        match("decoration color", "dec clr"),
        match("decoration style", "dec sty"),
        match("text-shadow", "txt shadow"),
        match("text-overflow", "ellipsis"),
        match("white-space", "nowrap", "pre"),
        match("word-break"),
      ].some(Boolean),
    });

    // Background
    s.push({
      label: "Background",
      visible: [
        match("background", "bg"),
        match("background-image", "gradient", "url", "image"),
        match("background-size", "cover", "contain"),
        match("background-position"),
        match("background-repeat"),
        match("background-attachment", "fixed", "scroll", "parallax"),
        match("background-origin"),
        match("background-clip"),
        match("background-blend", "blend mode"),
        match("background-video", "video", "movie"),
        match("image-blur", "blur", "background-blur"),
        match("background-overlay", "overlay", "tint"),
      ].some(Boolean),
    });

    // Border
    s.push({
      label: "Border",
      visible: [
        match("border", "stroke"),
        match("border-color"),
        match("border-style", "dashed", "dotted"),
        match("border-radius", "radius", "rounded"),
        match("outline"),
        match("outline-offset"),
      ].some(Boolean),
    });

    // Effects
    s.push({
      label: "Effects",
      visible: [
        match("shadow", "box-shadow"),
        match("opacity", "transparent"),
        match("backdrop", "blur", "glass"),
        match("filter", "brightness", "contrast", "saturate"),
        match("blend", "mix-blend"),
        match("z-index", "z index", "layer"),
        match("transition", "animate"),
        match("cursor", "pointer"),
        match("pointer-events"),
        match("user-select", "select"),
        match("visibility", "visible", "hidden"),
      ].some(Boolean),
    });

    // Position
    s.push({
      label: "Position",
      visible: [
        match("position", "absolute", "relative", "fixed", "sticky"),
        match("top", "right", "bottom", "left", "inset"),
      ].some(Boolean),
    });

    // Transform
    s.push({
      label: "Transform",
      visible: [
        match("transform", "scale", "rotate", "translate", "skew"),
        match("transform-origin", "origin"),
      ].some(Boolean),
    });

    // Clip
    s.push({
      label: "Clip & Mask",
      visible: match("clip", "clip-path", "mask", "circle", "polygon"),
    });

    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, showFlex, showGrid]);

  const sectionVisible = (label: string) =>
    sections.find((s) => s.label === label)?.visible ?? true;

  return (
    <div style={{ padding: "12px" }}>
      {/* Search */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          paddingBottom: "10px",
          background: "var(--editor-sidebar)",
        }}
      >
        <div style={{ position: "relative" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--fg-ghost)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search CSS property..."
            style={{
              width: "100%",
              padding: "7px 8px 7px 28px",
              borderRadius: "8px",
              fontSize: "12px",
              background: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              color: "var(--input-fg)",
              outline: "none",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "6px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--fg-ghost)",
                fontSize: "14px",
                padding: "0 2px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Layout */}
      {sectionVisible("Layout") && (
        <Section label="Layout">
          {match(
            "display",
            "layout",
            "block",
            "flex",
            "grid",
            "inline",
            "none",
          ) && (
            <Row label="Display">
              <Select
                value={styles.display ?? "block"}
                onChange={(v) => update({ display: v })}
                options={[
                  "block",
                  "flex",
                  "grid",
                  "inline-flex",
                  "inline-block",
                  "inline",
                  "none",
                ]}
              />
            </Row>
          )}
          {showFlex && (
            <>
              {match("direction", "flex-direction", "row", "column") && (
                <Row label="Direction">
                  <Select
                    value={styles.flexDirection ?? "row"}
                    onChange={(v) => update({ flexDirection: v })}
                    options={["row", "column", "row-reverse", "column-reverse"]}
                  />
                </Row>
              )}
              {match("wrap", "flex-wrap", "nowrap") && (
                <Row label="Wrap">
                  <Select
                    value={styles.flexWrap ?? "nowrap"}
                    onChange={(v) => update({ flexWrap: v })}
                    options={["nowrap", "wrap", "wrap-reverse"]}
                  />
                </Row>
              )}
              {match(
                "justify",
                "justify-content",
                "space-between",
                "center",
              ) && (
                <Row label="Justify">
                  <Select
                    value={styles.justifyContent ?? "flex-start"}
                    onChange={(v) => update({ justifyContent: v })}
                    options={[
                      "flex-start",
                      "center",
                      "flex-end",
                      "space-between",
                      "space-around",
                      "space-evenly",
                    ]}
                  />
                </Row>
              )}
              {match("align", "align-items", "stretch", "baseline") && (
                <Row label="Align">
                  <Select
                    value={styles.alignItems ?? "stretch"}
                    onChange={(v) => update({ alignItems: v })}
                    options={[
                      "flex-start",
                      "center",
                      "flex-end",
                      "stretch",
                      "baseline",
                    ]}
                  />
                </Row>
              )}
              {match("gap", "spacing") && (
                <Row label="Gap">
                  <TextInput
                    value={styles.gap ?? ""}
                    onChange={(v) => update({ gap: v })}
                    placeholder="16px"
                  />
                </Row>
              )}
              {match("grow", "flex-grow") && (
                <Row label="Grow">
                  <TextInput
                    value={styles.flexGrow ?? ""}
                    onChange={(v) => update({ flexGrow: v })}
                    placeholder="0"
                  />
                </Row>
              )}
              {match("shrink", "flex-shrink") && (
                <Row label="Shrink">
                  <TextInput
                    value={styles.flexShrink ?? ""}
                    onChange={(v) => update({ flexShrink: v })}
                    placeholder="1"
                  />
                </Row>
              )}
              {match("basis", "flex-basis") && (
                <Row label="Basis">
                  <TextInput
                    value={styles.flexBasis ?? ""}
                    onChange={(v) => update({ flexBasis: v })}
                    placeholder="auto"
                  />
                </Row>
              )}
            </>
          )}
          {showGrid && (
            <>
              {match("columns", "grid-template-columns", "grid") && (
                <Row label="Columns">
                  <TextInput
                    value={styles.gridTemplateColumns ?? ""}
                    onChange={(v) => update({ gridTemplateColumns: v })}
                    placeholder="repeat(3, 1fr)"
                  />
                </Row>
              )}
              {match("rows", "grid-template-rows", "grid") && (
                <Row label="Rows">
                  <TextInput
                    value={styles.gridTemplateRows ?? ""}
                    onChange={(v) => update({ gridTemplateRows: v })}
                    placeholder="auto"
                  />
                </Row>
              )}
              {match("gap", "grid-gap") && (
                <Row label="Gap">
                  <TextInput
                    value={styles.gap ?? ""}
                    onChange={(v) => update({ gap: v })}
                    placeholder="24px"
                  />
                </Row>
              )}
              {match("column gap", "col gap", "column-gap") && (
                <Row label="Col Gap">
                  <TextInput
                    value={styles.columnGap ?? ""}
                    onChange={(v) => update({ columnGap: v })}
                    placeholder="16px"
                  />
                </Row>
              )}
              {match("row gap", "row-gap") && (
                <Row label="Row Gap">
                  <TextInput
                    value={styles.rowGap ?? ""}
                    onChange={(v) => update({ rowGap: v })}
                    placeholder="16px"
                  />
                </Row>
              )}
              {match("place", "place-items") && (
                <Row label="Place">
                  <Select
                    value={styles.placeItems ?? ""}
                    onChange={(v) => update({ placeItems: v })}
                    options={["", "center", "start", "end", "stretch"]}
                  />
                </Row>
              )}
            </>
          )}
          {match("align self", "align-self") && (
            <Row label="Align Self">
              <Select
                value={styles.alignSelf ?? ""}
                onChange={(v) => update({ alignSelf: v })}
                options={[
                  "",
                  "auto",
                  "flex-start",
                  "center",
                  "flex-end",
                  "stretch",
                  "baseline",
                ]}
              />
            </Row>
          )}
          {match("order") && (
            <Row label="Order">
              <TextInput
                value={styles.order ?? ""}
                onChange={(v) => update({ order: v })}
                placeholder="0"
              />
            </Row>
          )}
          {match("overflow", "scroll", "hidden") && (
            <Row label="Overflow">
              <Select
                value={styles.overflow ?? "visible"}
                onChange={(v) => update({ overflow: v })}
                options={["visible", "hidden", "auto", "scroll"]}
              />
            </Row>
          )}
          {match("overflow-x", "x overflow") && (
            <Row label="X Over.">
              <Select
                value={styles.overflowX ?? ""}
                onChange={(v) => update({ overflowX: v })}
                options={["", "visible", "hidden", "auto", "scroll"]}
              />
            </Row>
          )}
          {match("overflow-y", "y overflow") && (
            <Row label="Y Over.">
              <Select
                value={styles.overflowY ?? ""}
                onChange={(v) => update({ overflowY: v })}
                options={["", "visible", "hidden", "auto", "scroll"]}
              />
            </Row>
          )}
        </Section>
      )}

      {/* Size */}
      {sectionVisible("Size") && (
        <Section label="Size">
          {match("width", "size") && (
            <Row label="Width">
              <TextInput
                value={styles.width ?? ""}
                onChange={(v) => update({ width: v })}
                placeholder="100%"
              />
            </Row>
          )}
          {match("height", "size") && (
            <Row label="Height">
              <TextInput
                value={styles.height ?? ""}
                onChange={(v) => update({ height: v })}
                placeholder="auto"
              />
            </Row>
          )}
          {match("min-width", "min w") && (
            <Row label="Min W">
              <TextInput
                value={styles.minWidth ?? ""}
                onChange={(v) => update({ minWidth: v })}
                placeholder="auto"
              />
            </Row>
          )}
          {match("max-width", "max w") && (
            <Row label="Max W">
              <TextInput
                value={styles.maxWidth ?? ""}
                onChange={(v) => update({ maxWidth: v })}
                placeholder="1200px"
              />
            </Row>
          )}
          {match("min-height", "min h") && (
            <Row label="Min H">
              <TextInput
                value={styles.minHeight ?? ""}
                onChange={(v) => update({ minHeight: v })}
                placeholder="auto"
              />
            </Row>
          )}
          {match("max-height", "max h") && (
            <Row label="Max H">
              <TextInput
                value={styles.maxHeight ?? ""}
                onChange={(v) => update({ maxHeight: v })}
                placeholder="none"
              />
            </Row>
          )}
          {match("aspect", "ratio") && (
            <Row label="Aspect">
              <Select
                value={styles.aspectRatio ?? ""}
                onChange={(v) => update({ aspectRatio: v })}
                options={[
                  "",
                  "auto",
                  "1/1",
                  "4/3",
                  "16/9",
                  "3/4",
                  "9/16",
                  "3/2",
                  "2/1",
                ]}
              />
            </Row>
          )}
          {match("box-sizing", "box size") && (
            <Row label="Box Size">
              <Select
                value={styles.boxSizing ?? ""}
                onChange={(v) => update({ boxSizing: v })}
                options={["", "border-box", "content-box"]}
              />
            </Row>
          )}
          {match("object-fit", "obj fit", "cover", "contain") && (
            <Row label="Obj Fit">
              <Select
                value={styles.objectFit ?? ""}
                onChange={(v) => update({ objectFit: v })}
                options={["", "cover", "contain", "fill", "none", "scale-down"]}
              />
            </Row>
          )}
          {match("object-position", "obj pos") && (
            <Row label="Obj Pos">
              <Select
                value={styles.objectPosition ?? ""}
                onChange={(v) => update({ objectPosition: v })}
                options={[
                  "",
                  "center",
                  "top",
                  "bottom",
                  "left",
                  "right",
                  "top left",
                  "top right",
                  "bottom left",
                  "bottom right",
                ]}
              />
            </Row>
          )}
        </Section>
      )}

      {/* Spacing */}
      {sectionVisible("Spacing") && (
        <Section label="Spacing">
          <SpacingGrid
            label="Padding"
            styles={styles}
            keys={{
              top: "paddingTop",
              right: "paddingRight",
              bottom: "paddingBottom",
              left: "paddingLeft",
            }}
            update={update}
          />
          <SpacingGrid
            label="Margin"
            styles={styles}
            keys={{
              top: "marginTop",
              right: "marginRight",
              bottom: "marginBottom",
              left: "marginLeft",
            }}
            update={update}
          />
        </Section>
      )}

      {/* Typography */}
      {sectionVisible("Typography") && (
        <Section label="Typography">
          {match("font", "family", "typography") && (
            <Row label="Font">
              <Select
                value={styles.fontFamily ?? "inherit"}
                onChange={(v) => update({ fontFamily: v })}
                options={[
                  "inherit",
                  "Inter, sans-serif",
                  "Playfair Display, serif",
                  "JetBrains Mono, monospace",
                  "Georgia, serif",
                  "system-ui, sans-serif",
                ]}
              />
            </Row>
          )}
          {match("font-size", "size", "text") && (
            <Row label="Size">
              <TextInput
                value={styles.fontSize ?? ""}
                onChange={(v) => update({ fontSize: v })}
                placeholder="16px"
              />
            </Row>
          )}
          {match("font-weight", "weight", "bold") && (
            <Row label="Weight">
              <Select
                value={styles.fontWeight ?? "400"}
                onChange={(v) => update({ fontWeight: v })}
                options={[
                  "100",
                  "200",
                  "300",
                  "400",
                  "500",
                  "600",
                  "700",
                  "800",
                  "900",
                ]}
              />
            </Row>
          )}
          {match("font-style", "italic") && (
            <Row label="Style">
              <Select
                value={styles.fontStyle ?? ""}
                onChange={(v) => update({ fontStyle: v })}
                options={["", "normal", "italic", "oblique"]}
              />
            </Row>
          )}
          {match("line-height", "line h") && (
            <Row label="Line H">
              <TextInput
                value={styles.lineHeight ?? ""}
                onChange={(v) => update({ lineHeight: v })}
                placeholder="1.5"
              />
            </Row>
          )}
          {match("letter-spacing", "letter") && (
            <Row label="Letter">
              <TextInput
                value={styles.letterSpacing ?? ""}
                onChange={(v) => update({ letterSpacing: v })}
                placeholder="0px"
              />
            </Row>
          )}
          {match("word-spacing", "word") && (
            <Row label="Word Sp">
              <TextInput
                value={styles.wordSpacing ?? ""}
                onChange={(v) => update({ wordSpacing: v })}
                placeholder="normal"
              />
            </Row>
          )}
          {match("text-align", "align", "center", "justify") && (
            <Row label="Align">
              <Select
                value={styles.textAlign ?? "left"}
                onChange={(v) => update({ textAlign: v })}
                options={["left", "center", "right", "justify"]}
              />
            </Row>
          )}
          {match("color", "text color") && (
            <Row label="Color">
              <ColorInput
                value={styles.color ?? "#fafafa"}
                onChange={(v) => update({ color: v })}
              />
            </Row>
          )}
          {match("text-transform", "uppercase", "lowercase", "capitalize") && (
            <Row label="Xform">
              <Select
                value={styles.textTransform ?? "none"}
                onChange={(v) => update({ textTransform: v })}
                options={["none", "uppercase", "lowercase", "capitalize"]}
              />
            </Row>
          )}
          {match(
            "text-decoration",
            "underline",
            "overline",
            "line-through",
          ) && (
            <Row label="Decor">
              <Select
                value={styles.textDecoration ?? ""}
                onChange={(v) => update({ textDecoration: v })}
                options={["", "none", "underline", "overline", "line-through"]}
              />
            </Row>
          )}
          {match("decoration color", "dec clr") && (
            <Row label="Dec Clr">
              <ColorInput
                value={styles.textDecorationColor ?? ""}
                onChange={(v) => update({ textDecorationColor: v })}
              />
            </Row>
          )}
          {match("decoration style", "dec sty") && (
            <Row label="Dec Sty">
              <Select
                value={styles.textDecorationStyle ?? ""}
                onChange={(v) => update({ textDecorationStyle: v })}
                options={["", "solid", "double", "dotted", "dashed", "wavy"]}
              />
            </Row>
          )}
          {match("text-shadow", "txt shadow") && (
            <Row label="Txt Shd">
              <TextInput
                value={styles.textShadow ?? ""}
                onChange={(v) => update({ textShadow: v })}
                placeholder="0 2px 4px rgba(0,0,0,0.3)"
              />
            </Row>
          )}
          {match("text-overflow", "ellipsis") && (
            <Row label="Txt Over">
              <Select
                value={styles.textOverflow ?? ""}
                onChange={(v) => update({ textOverflow: v })}
                options={["", "clip", "ellipsis"]}
              />
            </Row>
          )}
          {match("white-space", "nowrap", "pre") && (
            <Row label="Wh Space">
              <Select
                value={styles.whiteSpace ?? ""}
                onChange={(v) => update({ whiteSpace: v })}
                options={[
                  "",
                  "normal",
                  "nowrap",
                  "pre",
                  "pre-wrap",
                  "pre-line",
                ]}
              />
            </Row>
          )}
          {match("word-break") && (
            <Row label="Wd Break">
              <Select
                value={styles.wordBreak ?? ""}
                onChange={(v) => update({ wordBreak: v })}
                options={["", "normal", "break-all", "break-word", "keep-all"]}
              />
            </Row>
          )}
        </Section>
      )}

      {/* Background */}
      {sectionVisible("Background") && (
        <Section label="Background">
          {match("background", "bg", "background-color") && (
            <Row label="Color">
              <ColorInput
                value={styles.backgroundColor ?? ""}
                onChange={(v) => update({ backgroundColor: v })}
              />
            </Row>
          )}
          {match("background-image", "gradient", "url", "image") && (
            <Row label="Image">
              <div style={{ display: "flex", gap: "4px", width: "100%" }}>
                <TextInput
                  value={styles.backgroundImage ?? ""}
                  onChange={(v) => {
                    const patch: Partial<StyleProps> = { backgroundImage: v };
                    if (
                      v &&
                      !v.startsWith("linear") &&
                      !v.startsWith("radial") &&
                      !v.startsWith("conic")
                    ) {
                      if (!styles.backgroundSize)
                        patch.backgroundSize = "cover";
                      if (!styles.backgroundPosition)
                        patch.backgroundPosition = "center";
                      if (!styles.backgroundRepeat)
                        patch.backgroundRepeat = "no-repeat";
                    }
                    update(patch);
                  }}
                  placeholder="Paste URL or pick a file →"
                />
                <FileUploadButton
                  accept="image/*"
                  mode="dataurl"
                  title="Upload image from your computer"
                  onPicked={(url) => {
                    const patch: Partial<StyleProps> = { backgroundImage: url };
                    if (!styles.backgroundSize) patch.backgroundSize = "cover";
                    if (!styles.backgroundPosition)
                      patch.backgroundPosition = "center";
                    if (!styles.backgroundRepeat)
                      patch.backgroundRepeat = "no-repeat";
                    update(patch);
                  }}
                />
                {styles.backgroundImage && (
                  <button
                    onClick={() =>
                      update({
                        backgroundImage: "",
                        backgroundSize: "",
                        backgroundPosition: "",
                        backgroundRepeat: "",
                      })
                    }
                    style={{
                      fontSize: "11px",
                      padding: "0 4px",
                      border: "1px solid var(--border)",
                      borderRadius: "3px",
                      background: "red",
                      color: "var(--fg-dim)",
                      cursor: "pointer",
                      flexShrink: 0,
                      lineHeight: "20px",
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>
            </Row>
          )}
          {match("background-size", "cover", "contain") && (
            <Row label="Size">
              <Select
                value={styles.backgroundSize ?? "auto"}
                onChange={(v) => update({ backgroundSize: v })}
                options={[
                  "auto",
                  "cover",
                  "contain",
                  "100% 100%",
                  "100% auto",
                  "auto 100%",
                ]}
              />
            </Row>
          )}
          {match("background-position") && (
            <Row label="Position">
              <Select
                value={styles.backgroundPosition ?? ""}
                onChange={(v) => update({ backgroundPosition: v })}
                options={[
                  "",
                  "center",
                  "top",
                  "bottom",
                  "left",
                  "right",
                  "top center",
                  "bottom center",
                  "center left",
                  "center right",
                  "top left",
                  "top right",
                  "bottom left",
                  "bottom right",
                ]}
              />
            </Row>
          )}
          {match("background-repeat") && (
            <Row label="Repeat">
              <Select
                value={styles.backgroundRepeat ?? ""}
                onChange={(v) => update({ backgroundRepeat: v })}
                options={[
                  "",
                  "no-repeat",
                  "repeat",
                  "repeat-x",
                  "repeat-y",
                  "round",
                  "space",
                ]}
              />
            </Row>
          )}
          {match("background-attachment", "fixed", "scroll", "parallax") && (
            <Row label="Attach">
              <Select
                value={styles.backgroundAttachment ?? ""}
                onChange={(v) => update({ backgroundAttachment: v })}
                options={["", "scroll", "fixed", "local"]}
              />
            </Row>
          )}
          {match("background-origin") && (
            <Row label="Origin">
              <Select
                value={styles.backgroundOrigin ?? ""}
                onChange={(v) => update({ backgroundOrigin: v })}
                options={["", "padding-box", "border-box", "content-box"]}
              />
            </Row>
          )}
          {match("background-clip") && (
            <Row label="Clip">
              <Select
                value={styles.backgroundClip ?? ""}
                onChange={(v) => update({ backgroundClip: v })}
                options={[
                  "",
                  "border-box",
                  "padding-box",
                  "content-box",
                  "text",
                ]}
              />
            </Row>
          )}
          {match("background-blend", "blend mode") && (
            <Row label="Blend">
              <Select
                value={styles.backgroundBlendMode ?? ""}
                onChange={(v) => update({ backgroundBlendMode: v })}
                options={[
                  "",
                  "normal",
                  "multiply",
                  "screen",
                  "overlay",
                  "darken",
                  "lighten",
                  "color-dodge",
                  "color-burn",
                  "hard-light",
                  "soft-light",
                  "difference",
                  "exclusion",
                  "hue",
                  "saturation",
                  "color",
                  "luminosity",
                ]}
              />
            </Row>
          )}
          {/* Video URL — sections can have a looping video bg */}
          {match("background-video", "video", "movie") && (
            <Row label="Video">
              <div style={{ display: "flex", gap: "4px", width: "100%" }}>
                <TextInput
                  value={styles.backgroundVideo ?? ""}
                  onChange={(v) => update({ backgroundVideo: v })}
                  placeholder="YouTube / Vimeo / URL or pick →"
                />
                <FileUploadButton
                  accept="video/*"
                  mode="objecturl"
                  title="Upload video from your computer"
                  onPicked={(url) => update({ backgroundVideo: url })}
                />
                {styles.backgroundVideo && (
                  <button
                    onClick={() => update({ backgroundVideo: "" })}
                    style={{
                      fontSize: "11px",
                      padding: "0 4px",
                      border: "1px solid var(--border)",
                      borderRadius: "3px",
                      background: "red",
                      color: "var(--fg-dim)",
                      cursor: "pointer",
                      flexShrink: 0,
                      lineHeight: "20px",
                    }}
                    title="Remove video"
                  >
                    ×
                  </button>
                )}
              </div>
            </Row>
          )}
          {/* Image / Video blur — applied to the bg layer */}
          {match("image-blur", "blur", "background-blur") &&
            (styles.backgroundImage || styles.backgroundVideo) && (
              <Row label="Blur">
                <TextInput
                  value={styles.imageBlur ?? ""}
                  onChange={(v) => update({ imageBlur: v })}
                  placeholder="0 — 20"
                />
              </Row>
            )}
          {/* Overlay tint — independent style prop, rendered as its own layer */}
          {match("background-overlay", "overlay", "tint") &&
            (styles.backgroundImage || styles.backgroundVideo) && (
              <Row label="Overlay">
                <ColorInput
                  value={styles.overlayColor ?? ""}
                  onChange={(v) => update({ overlayColor: v })}
                />
              </Row>
            )}
        </Section>
      )}

      {/* Border */}
      {sectionVisible("Border") && (
        <Section label="Border">
          {match("border", "border-width", "stroke") && (
            <Row label="Width">
              <TextInput
                value={styles.borderWidth ?? ""}
                onChange={(v) => update({ borderWidth: v })}
                placeholder="1px"
              />
            </Row>
          )}
          {match("border-color", "border") && (
            <Row label="Color">
              <ColorInput
                value={styles.borderColor ?? ""}
                onChange={(v) => update({ borderColor: v })}
              />
            </Row>
          )}
          {match("border-style", "dashed", "dotted", "border") && (
            <Row label="Style">
              <Select
                value={styles.borderStyle ?? "solid"}
                onChange={(v) => update({ borderStyle: v })}
                options={[
                  "solid",
                  "dashed",
                  "dotted",
                  "double",
                  "groove",
                  "ridge",
                  "inset",
                  "outset",
                  "none",
                ]}
              />
            </Row>
          )}
          {match("border-radius", "radius", "rounded") && (
            <Row label="Radius">
              <TextInput
                value={styles.borderRadius ?? ""}
                onChange={(v) => update({ borderRadius: v })}
                placeholder="8px"
              />
            </Row>
          )}
          {match("border-radius", "radius", "rounded", "individual") && (
            <SpacingGrid
              label="Individual Radius"
              styles={styles}
              keys={{
                top: "borderTopLeftRadius",
                right: "borderTopRightRadius",
                bottom: "borderBottomRightRadius",
                left: "borderBottomLeftRadius",
              }}
              update={update}
              labels={["TL", "TR", "BR", "BL"]}
            />
          )}
          {match("outline") && (
            <Row label="Outline">
              <TextInput
                value={styles.outline ?? ""}
                onChange={(v) => update({ outline: v })}
                placeholder="2px solid #0ea5e9"
              />
            </Row>
          )}
          {match("outline-offset", "outline") && (
            <Row label="Out Off">
              <TextInput
                value={styles.outlineOffset ?? ""}
                onChange={(v) => update({ outlineOffset: v })}
                placeholder="0px"
              />
            </Row>
          )}
        </Section>
      )}

      {/* Effects */}
      {sectionVisible("Effects") && (
        <Section label="Effects">
          {match("shadow", "box-shadow") && (
            <Row label="Shadow">
              <TextInput
                value={styles.boxShadow ?? ""}
                onChange={(v) => update({ boxShadow: v })}
                placeholder="0 4px 24px rgba(0,0,0,0.3)"
              />
            </Row>
          )}
          {match("opacity", "transparent") && (
            <Row label="Opacity">
              <TextInput
                value={styles.opacity ?? ""}
                onChange={(v) => update({ opacity: v })}
                placeholder="1"
              />
            </Row>
          )}
          {match("backdrop", "blur", "glass") && (
            <Row label="Backdrop">
              <TextInput
                value={styles.backdropFilter ?? ""}
                onChange={(v) => update({ backdropFilter: v })}
                placeholder="12px or blur(12px)"
              />
            </Row>
          )}
          {match("filter", "brightness", "contrast", "saturate") && (
            <Row label="Filter">
              <TextInput
                value={styles.filter ?? ""}
                onChange={(v) => update({ filter: v })}
                placeholder="blur(0) brightness(1)"
              />
            </Row>
          )}
          {match("blend", "mix-blend") && (
            <Row label="Blend">
              <Select
                value={styles.mixBlendMode ?? ""}
                onChange={(v) => update({ mixBlendMode: v })}
                options={[
                  "",
                  "normal",
                  "multiply",
                  "screen",
                  "overlay",
                  "darken",
                  "lighten",
                  "color-dodge",
                  "color-burn",
                  "hard-light",
                  "soft-light",
                  "difference",
                  "exclusion",
                ]}
              />
            </Row>
          )}
          {match("z-index", "z index", "layer") && (
            <Row label="Z-index">
              <TextInput
                value={styles.zIndex ?? ""}
                onChange={(v) => update({ zIndex: v })}
                placeholder="auto"
              />
            </Row>
          )}
          {match("transition", "animate") && (
            <Row label="Transit.">
              <TextInput
                value={styles.transition ?? ""}
                onChange={(v) => update({ transition: v })}
                placeholder="all 0.2s ease"
              />
            </Row>
          )}
          {match("cursor", "pointer") && (
            <Row label="Cursor">
              <Select
                value={styles.cursor ?? "default"}
                onChange={(v) => update({ cursor: v })}
                options={[
                  "default",
                  "pointer",
                  "grab",
                  "grabbing",
                  "crosshair",
                  "move",
                  "not-allowed",
                  "text",
                  "wait",
                  "help",
                  "none",
                ]}
              />
            </Row>
          )}
          {match("pointer-events") && (
            <Row label="Pointer">
              <Select
                value={styles.pointerEvents ?? ""}
                onChange={(v) => update({ pointerEvents: v })}
                options={["", "auto", "none"]}
              />
            </Row>
          )}
          {match("user-select", "select") && (
            <Row label="Select">
              <Select
                value={styles.userSelect ?? ""}
                onChange={(v) => update({ userSelect: v })}
                options={["", "auto", "none", "text", "all"]}
              />
            </Row>
          )}
          {match("visibility", "visible", "hidden") && (
            <Row label="Visible">
              <Select
                value={styles.visibility ?? ""}
                onChange={(v) => update({ visibility: v })}
                options={["", "visible", "hidden", "collapse"]}
              />
            </Row>
          )}
        </Section>
      )}

      {/* Position */}
      {sectionVisible("Position") && (
        <Section label="Position">
          {match("position", "absolute", "relative", "fixed", "sticky") && (
            <Row label="Type">
              <Select
                value={styles.position ?? "static"}
                onChange={(v) => update({ position: v })}
                options={["static", "relative", "absolute", "fixed", "sticky"]}
              />
            </Row>
          )}
          {styles.position && styles.position !== "static" && (
            <>
              {match("top", "position", "offset") && (
                <Row label="Top">
                  <TextInput
                    value={styles.top ?? ""}
                    onChange={(v) => update({ top: v })}
                    placeholder="auto"
                  />
                </Row>
              )}
              {match("right", "position", "offset") && (
                <Row label="Right">
                  <TextInput
                    value={styles.right ?? ""}
                    onChange={(v) => update({ right: v })}
                    placeholder="auto"
                  />
                </Row>
              )}
              {match("bottom", "position", "offset") && (
                <Row label="Bottom">
                  <TextInput
                    value={styles.bottom ?? ""}
                    onChange={(v) => update({ bottom: v })}
                    placeholder="auto"
                  />
                </Row>
              )}
              {match("left", "position", "offset") && (
                <Row label="Left">
                  <TextInput
                    value={styles.left ?? ""}
                    onChange={(v) => update({ left: v })}
                    placeholder="auto"
                  />
                </Row>
              )}
              {match("inset", "position") && (
                <Row label="Inset">
                  <TextInput
                    value={styles.inset ?? ""}
                    onChange={(v) => update({ inset: v })}
                    placeholder="auto"
                  />
                </Row>
              )}
            </>
          )}
        </Section>
      )}

      {/* Transform */}
      {sectionVisible("Transform") && (
        <Section label="Transform">
          {match("transform", "scale", "rotate", "translate", "skew") && (
            <Row label="Xform">
              <TextInput
                value={styles.transform ?? ""}
                onChange={(v) => update({ transform: v })}
                placeholder="scale(1) rotate(0deg)"
              />
            </Row>
          )}
          {match("transform-origin", "origin") && (
            <Row label="Origin">
              <Select
                value={styles.transformOrigin ?? ""}
                onChange={(v) => update({ transformOrigin: v })}
                options={[
                  "",
                  "center",
                  "top",
                  "bottom",
                  "left",
                  "right",
                  "top left",
                  "top right",
                  "bottom left",
                  "bottom right",
                ]}
              />
            </Row>
          )}
        </Section>
      )}

      {/* Clip & Mask */}
      {sectionVisible("Clip & Mask") && (
        <Section label="Clip & Mask">
          {match("clip", "clip-path", "mask", "circle", "polygon") && (
            <Row label="Clip">
              <TextInput
                value={styles.clipPath ?? ""}
                onChange={(v) => update({ clipPath: v })}
                placeholder="circle(50%)"
              />
            </Row>
          )}
        </Section>
      )}

      {/* No results */}
      {q && !sections.some((s) => s.visible) && (
        <div
          style={{
            textAlign: "center",
            padding: "24px 12px",
            color: "var(--fg-ghost)",
            fontSize: "12px",
          }}
        >
          No properties matching "{search}"
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <SectionLabel>{label}</SectionLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          fontSize: "11px",
          color: "var(--fg-faint)",
          width: "52px",
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "5px 8px",
        borderRadius: "6px",
        fontSize: "12px",
        background: "var(--input-bg)",
        border: "1px solid var(--input-border)",
        color: "var(--input-fg)",
        outline: "none",
        fontFamily: "monospace",
      }}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "5px 8px",
        borderRadius: "6px",
        fontSize: "12px",
        background: "var(--bg-tertiary)",
        border: "1px solid var(--input-border)",
        color: "var(--input-fg)",
        outline: "none",
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o || "—"}
        </option>
      ))}
    </select>
  );
}

// Small hidden-<input type=file> button. Reads the picked file as a data URL
// (persists in project state) or a blob object URL (session-only but instant
// for large files like video).
function FileUploadButton({
  accept,
  mode,
  title,
  onPicked,
}: {
  accept: string;
  mode: "dataurl" | "objecturl";
  title: string;
  onPicked: (url: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (mode === "dataurl") {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result;
              if (typeof result === "string") onPicked(result);
            };
            reader.readAsDataURL(file);
          } else {
            onPicked(URL.createObjectURL(file));
          }
          // Reset so re-picking the same file re-triggers change
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          fontSize: "11px",
          fontWeight: 600,
          padding: "0 10px",
          border: "1px solid var(--accent)",
          borderRadius: "4px",
          background: "var(--accent)",
          color: "#fff",
          cursor: "pointer",
          flexShrink: 0,
          lineHeight: "24px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          letterSpacing: "0.3px",
          whiteSpace: "nowrap",
        }}
        title={title}
      >
        <span style={{ fontSize: "13px", lineHeight: 1 }}>↑</span>
      </button>
    </>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Local text state — don't reset while user is typing.
  // Sync from upstream only when the input is NOT focused, so partial values
  // like "rgba(" survive even if the parent can't parse them yet.
  const [text, setText] = React.useState(value);
  const focusedRef = React.useRef(false);
  React.useEffect(() => {
    if (!focusedRef.current) setText(value);
  }, [value]);
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      <input
        type="color"
        value={
          text.startsWith("#") && /^#[0-9a-fA-F]{6}$/.test(text)
            ? text
            : "#0ea5e9"
        }
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          border: "1px solid var(--input-border)",
          padding: "2px",
          background: "none",
          cursor: "pointer",
          flexShrink: 0,
        }}
      />
      <input
        value={text}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onBlur={() => {
          focusedRef.current = false;
          setText(value);
        }}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="#000000 or rgba(...)"
        style={{
          flex: 1,
          padding: "5px 8px",
          borderRadius: "6px",
          fontSize: "12px",
          background: "var(--input-bg)",
          border: "1px solid var(--input-border)",
          color: "var(--input-fg)",
          outline: "none",
          fontFamily: "monospace",
        }}
      />
    </div>
  );
}

function SpacingGrid({
  label,
  styles,
  keys,
  update,
  labels,
}: {
  label: string;
  styles: StyleProps;
  keys: {
    top: keyof StyleProps;
    right: keyof StyleProps;
    bottom: keyof StyleProps;
    left: keyof StyleProps;
  };
  update: (v: Partial<StyleProps>) => void;
  labels?: [string, string, string, string];
}) {
  const sideLabels = labels ?? ["T", "R", "B", "L"];
  return (
    <div style={{ marginBottom: "6px" }}>
      <div
        style={{
          fontSize: "11px",
          color: "var(--fg-ghost)",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "4px",
        }}
      >
        {(["top", "right", "bottom", "left"] as const).map((side, i) => (
          <div key={side}>
            <div
              style={{
                fontSize: "10px",
                color: "var(--fg-dim)",
                textAlign: "center",
                marginBottom: "2px",
              }}
            >
              {sideLabels[i]}
            </div>
            <input
              value={String(styles[keys[side]] ?? "").replace("px", "")}
              onChange={(e) => {
                const v = e.target.value.trim();
                update({
                  [keys[side]]:
                    v === "" ? undefined : /^\d+$/.test(v) ? v + "px" : v,
                });
              }}
              placeholder="0"
              style={{
                width: "100%",
                padding: "4px 6px",
                borderRadius: "5px",
                fontSize: "11px",
                background: "var(--input-bg)",
                border: "1px solid var(--border-subtle)",
                color: "var(--input-fg)",
                outline: "none",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
