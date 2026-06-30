"use client"

import { useEffect } from "react"
import { useEditorStore } from "@/stores/editor-store"

export function useKeyboardShortcuts() {
  const {
    undo, redo, canUndo, canRedo,
    selection, removeNode, duplicateNode,
    deselectAll, setZoom, viewport,
    copyNodes, cutNodes, pasteNodes,
  } = useEditorStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      const tag = (e.target as HTMLElement).tagName

      // Don't fire shortcuts when typing in inputs
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return

      if (meta && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) undo()
      }
      if ((meta && e.key === "y") || (meta && e.shiftKey && e.key === "z")) {
        e.preventDefault()
        if (canRedo()) redo()
      }
      if (meta && e.key === "d") {
        e.preventDefault()
        selection.nodeIds.forEach((id) => duplicateNode(id))
      }
      if (meta && e.key === "c") {
        if (selection.nodeIds.length > 0) {
          e.preventDefault()
          copyNodes()
        }
      }
      if (meta && e.key === "x") {
        if (selection.nodeIds.length > 0) {
          e.preventDefault()
          cutNodes()
        }
      }
      if (meta && e.key === "v") {
        e.preventDefault()
        pasteNodes()
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        selection.nodeIds.forEach((id) => removeNode(id))
      }
      if (e.key === "Escape") {
        deselectAll()
      }
      if (meta && e.key === "=") {
        e.preventDefault()
        setZoom(viewport.zoom + 0.1)
      }
      if (meta && e.key === "-") {
        e.preventDefault()
        setZoom(viewport.zoom - 0.1)
      }
      if (meta && e.key === "0") {
        e.preventDefault()
        setZoom(1)
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selection.nodeIds, viewport.zoom]) // eslint-disable-line
}
