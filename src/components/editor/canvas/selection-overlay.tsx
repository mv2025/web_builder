"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useEditorStore } from "@/stores/editor-store"
import { canHaveChildren, findNodeById } from "@/lib/utils"
import { findDropTarget, highlightContainer, clearContainerHighlight } from "@/components/editor/canvas/drop-utils"
import type { Breakpoint } from "@/types"

interface SelectionOverlayProps {
  nodeId: string
  nodeRef: React.RefObject<HTMLDivElement | null>
  breakpoint: Breakpoint
}

type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

const HANDLE_SIZE = 8
const HANDLE_STYLE: React.CSSProperties = {
  position: "absolute",
  width: `${HANDLE_SIZE}px`,
  height: `${HANDLE_SIZE}px`,
  background: "#fff",
  border: "1.5px solid var(--accent)",
  borderRadius: "2px",
  zIndex: 1001,
}

const HANDLE_POSITIONS: Record<ResizeHandle, React.CSSProperties> = {
  n:  { top: -HANDLE_SIZE / 2, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
  s:  { bottom: -HANDLE_SIZE / 2, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
  e:  { right: -HANDLE_SIZE / 2, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" },
  w:  { left: -HANDLE_SIZE / 2, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" },
  ne: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: "nesw-resize" },
  nw: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: "nwse-resize" },
  se: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: "nwse-resize" },
  sw: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: "nesw-resize" },
}

const ACTION_BTN: React.CSSProperties = {
  position: "relative",
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "22px", height: "22px", borderRadius: "4px",
  border: "none", cursor: "pointer", pointerEvents: "auto",
  padding: 0,
}

export function SelectionOverlay({ nodeId, nodeRef, breakpoint }: SelectionOverlayProps) {
  const { updateNodeStyles, viewport, removeNode, toggleNodeLock, getActivePage, copyNodes, duplicateNode } = useEditorStore()

  const page = getActivePage()
  const node = page ? findNodeById(page.components, nodeId) : null
  const isContainer = node ? canHaveChildren(node.type) : false
  const isLocked = node?.locked ?? false

  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef<{
    type: "move" | "resize"
    handle?: ResizeHandle
    startX: number
    startY: number
    startWidth: number
    startHeight: number
    startLeft: number
    startTop: number
    hadPosition: boolean
  } | null>(null)

  const startResize = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation()
    e.preventDefault()
    const el = nodeRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const zoom = viewport.zoom

    dragState.current = {
      type: "resize",
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width / zoom,
      startHeight: rect.height / zoom,
      startLeft: parseFloat(el.style.left || "0") || 0,
      startTop: parseFloat(el.style.top || "0") || 0,
      hadPosition: false,
    }
    setIsDragging(true)

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragState.current || dragState.current.type !== "resize") return
      const dx = (ev.clientX - dragState.current.startX) / zoom
      const dy = (ev.clientY - dragState.current.startY) / zoom
      const h = dragState.current.handle!

      let newWidth = dragState.current.startWidth
      let newHeight = dragState.current.startHeight

      if (h.includes("e")) newWidth = Math.max(20, dragState.current.startWidth + dx)
      if (h.includes("w")) newWidth = Math.max(20, dragState.current.startWidth - dx)
      if (h.includes("s")) newHeight = Math.max(20, dragState.current.startHeight + dy)
      if (h.includes("n")) newHeight = Math.max(20, dragState.current.startHeight - dy)

      if (el) {
        el.style.width = `${Math.round(newWidth)}px`
        el.style.height = `${Math.round(newHeight)}px`
      }
    }

    const onMouseUp = (ev: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""

      if (!dragState.current || dragState.current.type !== "resize") return
      const dx = (ev.clientX - dragState.current.startX) / zoom
      const dy = (ev.clientY - dragState.current.startY) / zoom
      const h = dragState.current.handle!

      let newWidth = dragState.current.startWidth
      let newHeight = dragState.current.startHeight

      if (h.includes("e")) newWidth = Math.max(20, dragState.current.startWidth + dx)
      if (h.includes("w")) newWidth = Math.max(20, dragState.current.startWidth - dx)
      if (h.includes("s")) newHeight = Math.max(20, dragState.current.startHeight + dy)
      if (h.includes("n")) newHeight = Math.max(20, dragState.current.startHeight - dy)

      const resizeStyles: Record<string, string> = {
        width: `${Math.round(newWidth)}px`,
      }
      if (h.includes("n") || h.includes("s")) {
        resizeStyles.minHeight = `${Math.round(newHeight)}px`
      }
      updateNodeStyles(nodeId, resizeStyles, breakpoint)

      dragState.current = null
      setIsDragging(false)
    }

    document.body.style.cursor = HANDLE_POSITIONS[handle].cursor as string
    document.body.style.userSelect = "none"
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }, [nodeRef, nodeId, breakpoint, updateNodeStyles, viewport.zoom])

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    const el = nodeRef.current
    if (!el) return

    const zoom = viewport.zoom
    let highlightedEl: HTMLElement | null = null

    // Capture the element's current visual position relative to its parent
    const offsetParent = el.offsetParent as HTMLElement || el.parentElement as HTMLElement
    const elRect = el.getBoundingClientRect()
    const parentRect = offsetParent.getBoundingClientRect()
    const startTopPx = (elRect.top - parentRect.top) / zoom
    const startLeftPx = (elRect.left - parentRect.left) / zoom

    dragState.current = {
      type: "move",
      startX: e.clientX,
      startY: e.clientY,
      startWidth: 0,
      startHeight: 0,
      startLeft: startLeftPx,
      startTop: startTopPx,
      hadPosition: false,
    }
    setIsDragging(true)

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragState.current || dragState.current.type !== "move") return
      const dx = (ev.clientX - dragState.current.startX) / zoom
      const dy = (ev.clientY - dragState.current.startY) / zoom

      el.style.transform = `translate(${dx}px, ${dy}px)`
      el.style.zIndex = "1000"
      el.style.opacity = "0.6"
      el.style.pointerEvents = "none"

      const canvasEl = document.querySelector("[data-canvas-root]") as HTMLElement
      if (canvasEl) {
        const target = findDropTarget(ev.clientX, ev.clientY, canvasEl, nodeId)
        highlightedEl = highlightContainer(canvasEl, target.parentId, highlightedEl)
      }
    }

    const onMouseUp = (ev: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""

      el.style.transform = ""
      el.style.zIndex = ""
      el.style.opacity = ""
      el.style.pointerEvents = ""

      clearContainerHighlight(highlightedEl)
      highlightedEl = null

      if (!dragState.current || dragState.current.type !== "move") return
      const dx = (ev.clientX - dragState.current.startX) / zoom
      const dy = (ev.clientY - dragState.current.startY) / zoom

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        const newTop = Math.max(0, Math.round(dragState.current.startTop + dy))
        const newLeft = Math.max(0, Math.round(dragState.current.startLeft + dx))

        updateNodeStyles(nodeId, {
          position: "absolute",
          top: `${newTop}px`,
          left: `${newLeft}px`,
        }, breakpoint)
      }

      dragState.current = null
      setIsDragging(false)
    }

    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }, [nodeRef, nodeId, breakpoint, updateNodeStyles, viewport.zoom])

  useEffect(() => {
    const el = nodeRef.current
    if (!el) return

    const onWrapperMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement
      if (target.closest("button") || target.closest("input") || target.closest("select") || target.closest("textarea")) return
      if (target.closest("[style*='cursor: ns-resize'], [style*='cursor: ew-resize'], [style*='cursor: nesw-resize'], [style*='cursor: nwse-resize']")) return

      startDrag(e as unknown as React.MouseEvent)
    }

    el.addEventListener("mousedown", onWrapperMouseDown)
    return () => el.removeEventListener("mousedown", onWrapperMouseDown)
  }, [nodeRef, startDrag])

  return (
    <>
      {/* Action bar at top-right */}
      <div style={{
        position: "absolute", top: "-26px", right: "-2px", zIndex: 1001,
        display: "flex", alignItems: "center", gap: "3px",
        pointerEvents: "auto",
      }}>
        {isContainer && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleNodeLock(nodeId) }}
            style={{
              ...ACTION_BTN,
              background: isLocked ? "#f59e0b" : "var(--accent)",
            }}
            title={isLocked ? "Unlock" : "Lock"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isLocked ? (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </>
              ) : (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </>
              )}
            </svg>
          </button>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); copyNodes() }}
          style={{ ...ACTION_BTN, background: "var(--accent)" }}
          title="Copy (Ctrl+C)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); duplicateNode(nodeId) }}
          style={{ ...ACTION_BTN, background: "var(--accent)" }}
          title="Duplicate (Ctrl+D)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="8" width="14" height="14" rx="2" />
            <path d="M4 16H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
            <line x1="15" y1="12" x2="15" y2="18" />
            <line x1="12" y1="15" x2="18" y2="15" />
          </svg>
        </button>

        <div
          onMouseDown={startDrag}
          style={{
            ...ACTION_BTN,
            background: "var(--accent)",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          title="Drag to reorder"
        >
          <span style={{ color: "#fff", fontSize: "12px", lineHeight: 1 }}>⠿</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); removeNode(nodeId) }}
          style={{ ...ACTION_BTN, background: "#ef4444" }}
          title="Delete (Del)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>

      {/* Resize handles */}
      {(Object.keys(HANDLE_POSITIONS) as ResizeHandle[]).map((handle) => (
        <div
          key={handle}
          onMouseDown={(e) => startResize(e, handle)}
          style={{
            ...HANDLE_STYLE,
            ...HANDLE_POSITIONS[handle],
            pointerEvents: "auto",
          }}
        />
      ))}
    </>
  )
}
