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

const DEVICE_WIDTHS = { desktop: 1440, tablet: 768, mobile: 390 };
const DEVICE_HEIGHTS = { desktop: "900px", tablet: "1024px", mobile: "844px" };
const CANVAS_PADDING = 40;

export function EditorCanvas() {
  const {
    getActivePage,
    selection,
    selectNode,
    deselectAll,
    addNode,
    moveNode,
    updateNodeStyles,
    viewport,
    breakpoint,
    previewMode,
    showGrid,
    setHoveredNode,
    setCanvasFitScale,
  } = useEditorStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasRootRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const page = getActivePage();
  const [canvasMinHeight, setCanvasMinHeight] = useState<string>(DEVICE_HEIGHTS[breakpoint]);
  const [availableWidth, setAvailableWidth] = useState<number>(0);

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

  // Track available width for auto-fit scaling
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setAvailableWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const deviceW = DEVICE_WIDTHS[breakpoint];
  const totalNeeded = deviceW + CANVAS_PADDING * 2;
  const fitScale = !previewMode && availableWidth > 0 && totalNeeded > availableWidth
    ? (availableWidth - 16) / deviceW
    : 1;
  const effectiveZoom = previewMode ? 1 : fitScale * viewport.zoom;

  useEffect(() => {
    setCanvasFitScale(fitScale);
  }, [fitScale, setCanvasFitScale]);

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

      const target = findDropTarget(e.clientX, e.clientY, canvasEl, movingNodeId || undefined);
      const containerEl = target.parentId
        ? (canvasEl.querySelector(`[data-node-id="${target.parentId}"]`) as HTMLElement)
        : canvasEl;

      const containerRect = containerEl.getBoundingClientRect();
      const dropX = Math.round((e.clientX - containerRect.left) / effectiveZoom);
      const dropY = Math.round((e.clientY - containerRect.top) / effectiveZoom);

      if (movingNodeId) {
        moveNode(movingNodeId, target.parentId, target.index);
        
        // Freeform placement: Automatically make absolute if dropped on root
        if (!target.parentId) {
          updateNodeStyles(
            movingNodeId,
            {
              position: "absolute",
              top: `${dropY}px`,
              left: `${dropX}px`,
              marginLeft: "0",
              marginRight: "0",
              marginTop: "0",
              marginBottom: "0",
            },
            breakpoint
          );
        }
        return;
      }

      if (!type) return;

      const node = createNode(type);

      // Freeform placement: Automatically make absolute if dropped on root
      const isWave = /^wave-\d+$/.test(type);
      if (!isWave && (!target.parentId || node.styles.desktop?.position === "absolute")) {
        let finalDropX = dropX;
        if (node.styles.desktop?.width === "100%") {
          node.styles.desktop.width = "400px";
          finalDropX = Math.max(0, dropX - 200);
        }
        
        node.styles.desktop = {
          ...(node.styles.desktop as StyleProps),
          position: "absolute",
          top: `${dropY}px`,
          left: `${finalDropX}px`,
          marginLeft: "0",
          marginRight: "0",
          marginTop: "0",
          marginBottom: "0",
        } as StyleProps;
      }

      addNode(node, target.parentId, target.index);
    },
    [addNode, moveNode, updateNodeStyles, effectiveZoom, breakpoint],
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
      ref={scrollContainerRef}
      data-canvas-scroll="true"
      style={{
        flex: 1,
        minWidth: 0,
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
            {deviceW} × {parseInt(DEVICE_HEIGHTS[breakpoint])}px
          </span>
          <span style={{ color: "var(--fg-dim)" }}>•</span>
          <span style={{ color: "var(--fg-ghost)" }}>
            {Math.round(effectiveZoom * 100)}%
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
          padding: previewMode ? "0" : `${CANVAS_PADDING}px 8px 120px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          ref={canvasRootRef}
          data-canvas-root="true"
          data-breakpoint={breakpoint}
          style={{
            width: `${deviceW}px`,
            minHeight: canvasMinHeight,
            padding: "0",
            background: "var(--canvas-node-bg)",
            boxSizing: "border-box",
            position: "relative",
            flexShrink: 0,
            transform: previewMode ? "none" : `scale(${viewport.zoom})`,
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
            transition: "width 0.3s ease, transform 0.2s ease",
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
