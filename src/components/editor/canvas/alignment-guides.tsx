"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useEditorStore } from "@/stores/editor-store"

interface Guide {
  type: "vertical" | "horizontal"
  pos: number
  start: number
  end: number
}

interface DistLabel {
  x: number
  y: number
  value: number
  dir: "h" | "v"
}

const SNAP_THRESHOLD = 5
const GUIDE_COLOR = "#f43f5e"
const DIST_COLOR = "#0ea5e9"

interface Rect {
  left: number; top: number; right: number; bottom: number
  cx: number; cy: number; width: number; height: number
}

function domRectToLocal(r: DOMRect, canvasRect: DOMRect, zoom: number, pad: { x: number; y: number }): Rect {
  const left = (r.left - canvasRect.left) / zoom - pad.x
  const top = (r.top - canvasRect.top) / zoom - pad.y
  const w = r.width / zoom
  const h = r.height / zoom
  return { left, top, right: left + w, bottom: top + h, width: w, height: h, cx: left + w / 2, cy: top + h / 2 }
}

function getCanvasPad(canvas: HTMLElement): { x: number; y: number } {
  const cs = getComputedStyle(canvas)
  return { x: parseFloat(cs.paddingLeft) || 0, y: parseFloat(cs.paddingTop) || 0 }
}

function getSiblingRects(canvas: HTMLElement, draggedId: string, draggedEl: HTMLElement, canvasRect: DOMRect, zoom: number, pad: { x: number; y: number }): Rect[] {
  const rects: Rect[] = []
  canvas.querySelectorAll("[data-node-id]").forEach((el) => {
    const id = (el as HTMLElement).dataset.nodeId
    if (id === draggedId || draggedEl.contains(el) || el.contains(draggedEl)) return
    rects.push(domRectToLocal((el as HTMLElement).getBoundingClientRect(), canvasRect, zoom, pad))
  })
  // Canvas content area boundary
  const cw = canvasRect.width / zoom - pad.x * 2
  const ch = canvasRect.height / zoom - pad.y * 2
  rects.push({ left: 0, top: 0, right: cw, bottom: ch, width: cw, height: ch, cx: cw / 2, cy: ch / 2 })
  return rects
}

function computeGuides(dragged: Rect, others: Rect[]): { guides: Guide[]; distances: DistLabel[] } {
  const guides: Guide[] = []
  const dists: DistLabel[] = []

  for (const o of others) {
    // Vertical alignment (x-axis)
    const vPairs: [number, number][] = [
      [dragged.left, o.left], [dragged.right, o.right],
      [dragged.left, o.right], [dragged.right, o.left],
      [dragged.cx, o.cx],
    ]
    for (const [dEdge, oEdge] of vPairs) {
      if (Math.abs(dEdge - oEdge) < SNAP_THRESHOLD) {
        guides.push({
          type: "vertical", pos: oEdge,
          start: Math.min(dragged.top, o.top) - 20,
          end: Math.max(dragged.bottom, o.bottom) + 20,
        })
      }
    }

    // Horizontal alignment (y-axis)
    const hPairs: [number, number][] = [
      [dragged.top, o.top], [dragged.bottom, o.bottom],
      [dragged.top, o.bottom], [dragged.bottom, o.top],
      [dragged.cy, o.cy],
    ]
    for (const [dEdge, oEdge] of hPairs) {
      if (Math.abs(dEdge - oEdge) < SNAP_THRESHOLD) {
        guides.push({
          type: "horizontal", pos: oEdge,
          start: Math.min(dragged.left, o.left) - 20,
          end: Math.max(dragged.right, o.right) + 20,
        })
      }
    }

    // Distance labels for nearby non-overlapping elements
    const hBandOverlap = dragged.bottom > o.top && dragged.top < o.bottom
    const vBandOverlap = dragged.right > o.left && dragged.left < o.right

    if (hBandOverlap) {
      const midY = (Math.max(dragged.top, o.top) + Math.min(dragged.bottom, o.bottom)) / 2
      if (dragged.left > o.right) {
        const gap = Math.round(dragged.left - o.right)
        if (gap > 0 && gap < 300) dists.push({ x: o.right + gap / 2, y: midY, value: gap, dir: "h" })
      } else if (o.left > dragged.right) {
        const gap = Math.round(o.left - dragged.right)
        if (gap > 0 && gap < 300) dists.push({ x: dragged.right + gap / 2, y: midY, value: gap, dir: "h" })
      }
    }
    if (vBandOverlap) {
      const midX = (Math.max(dragged.left, o.left) + Math.min(dragged.right, o.right)) / 2
      if (dragged.top > o.bottom) {
        const gap = Math.round(dragged.top - o.bottom)
        if (gap > 0 && gap < 300) dists.push({ x: midX, y: o.bottom + gap / 2, value: gap, dir: "v" })
      } else if (o.top > dragged.bottom) {
        const gap = Math.round(o.top - dragged.bottom)
        if (gap > 0 && gap < 300) dists.push({ x: midX, y: dragged.bottom + gap / 2, value: gap, dir: "v" })
      }
    }
  }

  // Deduplicate
  const uGuides: Guide[] = []
  for (const g of guides) {
    if (!uGuides.some((u) => u.type === g.type && Math.abs(u.pos - g.pos) < 1)) uGuides.push(g)
  }
  const uDists: DistLabel[] = []
  for (const d of dists) {
    if (!uDists.some((u) => Math.abs(u.x - d.x) < 8 && Math.abs(u.y - d.y) < 8)) uDists.push(d)
  }

  return { guides: uGuides, distances: uDists }
}

export function AlignmentGuides({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement | null> }) {
  const [guides, setGuides] = useState<Guide[]>([])
  const [distances, setDistances] = useState<DistLabel[]>([])
  const [dimLabel, setDimLabel] = useState<{ w: number; h: number; x: number; y: number } | null>(null)
  const rafRef = useRef(0)
  const isDraggingRef = useRef(false)
  const { selection, viewport } = useEditorStore()
  const selectedId = selection.nodeIds[0]

  const update = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !selectedId || !isDraggingRef.current) return

    const draggedEl = canvas.querySelector(`[data-node-id="${selectedId}"]`) as HTMLElement
    if (!draggedEl) return

    const canvasRect = canvas.getBoundingClientRect()
    const zoom = viewport.zoom
    const pad = getCanvasPad(canvas)

    const dragged = domRectToLocal(draggedEl.getBoundingClientRect(), canvasRect, zoom, pad)
    const others = getSiblingRects(canvas, selectedId, draggedEl, canvasRect, zoom, pad)
    const result = computeGuides(dragged, others)

    setGuides(result.guides)
    setDistances(result.distances)
    setDimLabel({ w: Math.round(dragged.width), h: Math.round(dragged.height), x: Math.round(dragged.left), y: Math.round(dragged.top) })
  }, [canvasRef, selectedId, viewport.zoom])

  useEffect(() => {
    if (!selectedId) {
      setGuides([])
      setDistances([])
      setDimLabel(null)
      return
    }

    const onDown = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      // Only start if mousedown is within the canvas
      if (!canvas.contains(e.target as Node)) return
      isDraggingRef.current = true
    }

    const onUp = () => {
      isDraggingRef.current = false
      setGuides([])
      setDistances([])
      setDimLabel(null)
    }

    const onMove = () => {
      if (!isDraggingRef.current) return
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    document.addEventListener("mousedown", onDown, true)
    document.addEventListener("mouseup", onUp)
    document.addEventListener("mousemove", onMove)
    return () => {
      document.removeEventListener("mousedown", onDown, true)
      document.removeEventListener("mouseup", onUp)
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [selectedId, canvasRef, update])

  if (guides.length === 0 && distances.length === 0 && !dimLabel) return null

  const canvas = canvasRef.current
  const pad = canvas ? getCanvasPad(canvas) : { x: 0, y: 0 }

  return (
    <svg
      style={{
        position: "absolute", top: `${pad.y}px`, left: `${pad.x}px`,
        width: `calc(100% - ${pad.x * 2}px)`, height: `calc(100% - ${pad.y * 2}px)`,
        pointerEvents: "none", zIndex: 998,
        overflow: "visible",
      }}
    >
      {/* Alignment lines */}
      {guides.map((g, i) =>
        g.type === "vertical" ? (
          <line key={i} x1={g.pos} y1={g.start} x2={g.pos} y2={g.end}
            stroke={GUIDE_COLOR} strokeWidth={1} strokeDasharray="3 2" />
        ) : (
          <line key={i} x1={g.start} y1={g.pos} x2={g.end} y2={g.pos}
            stroke={GUIDE_COLOR} strokeWidth={1} strokeDasharray="3 2" />
        )
      )}

      {/* Distance markers */}
      {distances.map((d, i) => {
        const half = d.value / 2
        const labelW = String(d.value).length * 7 + 10
        return (
          <g key={`d${i}`}>
            {d.dir === "h" ? (
              <>
                <line x1={d.x - half} y1={d.y} x2={d.x + half} y2={d.y} stroke={DIST_COLOR} strokeWidth={1} />
                <line x1={d.x - half} y1={d.y - 3} x2={d.x - half} y2={d.y + 3} stroke={DIST_COLOR} strokeWidth={1.5} />
                <line x1={d.x + half} y1={d.y - 3} x2={d.x + half} y2={d.y + 3} stroke={DIST_COLOR} strokeWidth={1.5} />
              </>
            ) : (
              <>
                <line x1={d.x} y1={d.y - half} x2={d.x} y2={d.y + half} stroke={DIST_COLOR} strokeWidth={1} />
                <line x1={d.x - 3} y1={d.y - half} x2={d.x + 3} y2={d.y - half} stroke={DIST_COLOR} strokeWidth={1.5} />
                <line x1={d.x - 3} y1={d.y + half} x2={d.x + 3} y2={d.y + half} stroke={DIST_COLOR} strokeWidth={1.5} />
              </>
            )}
            <rect x={d.x - labelW / 2} y={d.y - 8} width={labelW} height={16} rx={3} fill={DIST_COLOR} />
            <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff" fontFamily="system-ui, sans-serif">
              {d.value}px
            </text>
          </g>
        )
      })}

      {/* Dimension label on dragged element */}
      {dimLabel && (
        <g>
          <rect x={dimLabel.x} y={dimLabel.y + dimLabel.h + 6} width={90} height={18} rx={3} fill="rgba(0,0,0,0.8)" />
          <text x={dimLabel.x + 45} y={dimLabel.y + dimLabel.h + 18} textAnchor="middle" fontSize={10} fontWeight={600}
            fill="#fff" fontFamily="JetBrains Mono, system-ui, monospace">
            {dimLabel.w} × {dimLabel.h}
          </text>
        </g>
      )}
    </svg>
  )
}

// ── Snap utility for selection-overlay ────────────────────────────────────────
export function getSnapOffset(
  draggedRect: DOMRect,
  canvasEl: HTMLElement,
  draggedId: string,
  zoom: number,
): { dx: number; dy: number } {
  const canvasRect = canvasEl.getBoundingClientRect()
  const pad = getCanvasPad(canvasEl)

  const dragged = domRectToLocal(draggedRect, canvasRect, zoom, pad)
  const draggedEl = canvasEl.querySelector(`[data-node-id="${draggedId}"]`) as HTMLElement
  const others = getSiblingRects(canvasEl, draggedId, draggedEl, canvasRect, zoom, pad)

  let dx = 0, dy = 0, fx = false, fy = false

  for (const o of others) {
    if (!fx) {
      for (const diff of [dragged.left - o.left, dragged.right - o.right, dragged.left - o.right, dragged.right - o.left, dragged.cx - o.cx]) {
        if (Math.abs(diff) < SNAP_THRESHOLD) { dx = -diff; fx = true; break }
      }
    }
    if (!fy) {
      for (const diff of [dragged.top - o.top, dragged.bottom - o.bottom, dragged.top - o.bottom, dragged.bottom - o.top, dragged.cy - o.cy]) {
        if (Math.abs(diff) < SNAP_THRESHOLD) { dy = -diff; fy = true; break }
      }
    }
    if (fx && fy) break
  }

  return { dx, dy }
}
