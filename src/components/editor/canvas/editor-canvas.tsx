"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { ComponentRenderer } from "@/components/renderer/component-renderer";
import { createNode } from "@/lib/utils";
import { AlignmentGuides } from "@/components/editor/canvas/alignment-guides";
import {
  findDropTarget,
  highlightContainer,
  clearContainerHighlight,
} from "@/components/editor/canvas/drop-utils";
import type { ComponentType, StyleProps } from "@/types";

const DEVICE_WIDTHS = { desktop: "1440px", tablet: "768px", mobile: "390px" };
const DEVICE_HEIGHTS = { desktop: "900px", tablet: "1024px", mobile: "844px" };

export function EditorCanvas() {
  const {
    getActivePage,
    selection,
    selectNode,
    deselectAll,
    addNode,
    moveNode,
    viewport,
    breakpoint,
    previewMode,
    showGrid,
    setHoveredNode,
  } = useEditorStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasRootRef = useRef<HTMLDivElement>(null);
  const page = getActivePage();
  const [canvasMinHeight, setCanvasMinHeight] = useState<string>(DEVICE_HEIGHTS[breakpoint]);

  const highlightedElRef = useRef<HTMLElement | null>(null);

  // Auto-expand canvas to fit absolutely positioned children
  useEffect(() => {
    const canvas = canvasRootRef.current;
    if (!canvas) return;

    const recalc = () => {
      const children = canvas.querySelectorAll<HTMLElement>(":scope > [data-node-id]");
      let maxBottom = parseInt(DEVICE_HEIGHTS[breakpoint]);
      children.forEach((child) => {
        const bottom = child.offsetTop + child.offsetHeight + 32;
        if (bottom > maxBottom) maxBottom = bottom;
      });
      setCanvasMinHeight(`${maxBottom}px`);
    };

    recalc();
    const observer = new MutationObserver(recalc);
    observer.observe(canvas, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, [breakpoint, page?.components]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    const canvasEl = canvasRootRef.current;
    if (!canvasEl) return;

    const target = findDropTarget(e.clientX, e.clientY, canvasEl);
    highlightedElRef.current = highlightContainer(
      canvasEl,
      target.parentId,
      highlightedElRef.current,
    );
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    clearContainerHighlight(highlightedElRef.current);
    highlightedElRef.current = null;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      clearContainerHighlight(highlightedElRef.current);
      highlightedElRef.current = null;

      const canvasEl = canvasRootRef.current;
      if (!canvasEl) return;

      const type = e.dataTransfer.getData("component-type") as ComponentType;
      const movingNodeId = e.dataTransfer.getData("move-node-id");

      if (movingNodeId) {
        const target = findDropTarget(e.clientX, e.clientY, canvasEl, movingNodeId);
        moveNode(movingNodeId, target.parentId, target.index);
        return;
      }

      if (!type) return;

      const target = findDropTarget(e.clientX, e.clientY, canvasEl);
      const containerEl = target.parentId
        ? (canvasEl.querySelector(`[data-node-id="${target.parentId}"]`) as HTMLElement)
        : canvasEl;

      const zoom = viewport.zoom;
      const containerRect = containerEl.getBoundingClientRect();
      const dropX = Math.round((e.clientX - containerRect.left) / zoom);
      const dropY = Math.round((e.clientY - containerRect.top) / zoom);

      const node = createNode(type);

      node.styles.desktop = {
        ...(node.styles.desktop as StyleProps),
        position: "absolute",
        top: `${dropY}px`,
        left: `${dropX}px`,
      } as StyleProps;

      addNode(node, target.parentId, target.index);
    },
    [addNode, moveNode, viewport.zoom],
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.target === canvasRef.current ||
        (e.target as HTMLElement).dataset.canvasRoot
      ) {
        deselectAll();
      }
    },
    [deselectAll],
  );

  return (
    <div
      data-canvas-scroll="true"
      style={{
        flex: 1,
        overflow: "auto",
        position: "relative",
        background: previewMode ? "#fff" : "var(--editor-canvas)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      {/* Canvas ruler / breadcrumb */}
      {!previewMode && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            width: "100%",
            background: "var(--editor-toolbar)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid var(--border)",
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--fg-faint)",
          }}
        >
          <span>📄 {page?.name ?? "Page"}</span>
          <span style={{ color: "var(--fg-dim)" }}>/</span>
          <span style={{ color: "var(--fg-ghost)" }}>
            {parseInt(DEVICE_WIDTHS[breakpoint])} ×{" "}
            {parseInt(DEVICE_HEIGHTS[breakpoint])}px
          </span>
          <span style={{ color: "var(--fg-dim)" }}>•</span>
          <span style={{ color: "var(--fg-ghost)" }}>
            {Math.round(viewport.zoom * 100)}%
          </span>
          {selection.nodeIds.length > 0 && (
            <>
              <span style={{ color: "var(--fg-dim)" }}>/</span>
              <span style={{ color: "var(--accent)" }}>
                {selection.nodeIds.length} selected
              </span>
            </>
          )}
        </div>
      )}

      {/* The actual canvas viewport */}
      <div
        ref={canvasRef}
        style={{
          padding: previewMode ? "0" : "40px 40px 120px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          ref={canvasRootRef}
          data-canvas-root="true"
          data-breakpoint={breakpoint}
          style={{
            width: DEVICE_WIDTHS[breakpoint],
            minHeight: canvasMinHeight,
            padding: previewMode ? "0" : "16px",
            background: "var(--canvas-node-bg)",
            boxSizing: "border-box",
            position: "relative",
            flexShrink: 0,
            transform: `scale(${viewport.zoom})`,
            transformOrigin: "top center",
            ...(showGrid && !previewMode
              ? {
                  backgroundImage: `linear-gradient(var(--editor-canvas-dot) 1px, transparent 1px), linear-gradient(90deg, var(--editor-canvas-dot) 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }
              : {}),
            boxShadow: previewMode ? "none" : "var(--shadow-panel)",
            borderRadius: previewMode
              ? "0"
              : breakpoint === "mobile"
                ? "16px"
                : "0",
            transition: "width 0.3s ease",
          }}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Empty state */}
          {(!page || page.components.length === 0) && <EmptyCanvasState />}

          {/* Render components */}
          {page?.components.map((node) => (
            <ComponentRenderer
              key={node.id}
              node={node}
              isPreview={previewMode}
              selectedIds={selection.nodeIds}
              onSelect={selectNode}
              onHover={setHoveredNode}
              breakpoint={breakpoint}
            />
          ))}

          {/* Alignment guides overlay */}
          {!previewMode && selection.nodeIds.length > 0 && (
            <AlignmentGuides canvasRef={canvasRootRef} />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyCanvasState() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "var(--fg-dim)",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: "48px", opacity: 0.3 }}>⊞</div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--fg-ghost)",
          }}
        >
          Drop components here
        </p>
        <p
          style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--fg-dim)" }}
        >
          Drag from the left panel or click a component to add it
        </p>
      </div>
    </div>
  );
}
