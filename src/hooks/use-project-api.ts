"use client"

import { useCallback } from "react"
import { useEditorStore } from "@/stores/editor-store"
import type { ExportFormat } from "@/types"

const STORAGE_KEY = "visualcraft-project"

export function useProjectAPI() {
  const { project } = useEditorStore()

  const saveProject = useCallback(async () => {
    if (!project) return { ok: false, error: "No project" }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
      return { ok: true, data: { saved: true } }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  }, [project])

  const exportProject = useCallback(async (format: ExportFormat) => {
    if (!project) return null
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, format }),
      })
      const data = await res.json()
      return data
    } catch (err) {
      console.error("Export failed:", err)
      return null
    }
  }, [project])

  const downloadExport = useCallback(async (format: ExportFormat) => {
    const result = await exportProject(format)
    if (!result?.files) return

    const fileCount = result.files.length
    console.log(`[Export] ${format.toUpperCase()} — ${fileCount} files ready:`)
    result.files.forEach((f: { path: string; content: string }) => {
      console.log(`  ${f.path} (${f.content.length} chars)`)
    })

    const firstPage = result.files.find((f: { path: string }) => f.path.includes("page"))
    if (firstPage) {
      const blob = new Blob([firstPage.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${result.projectName}-${firstPage.path.replace(/\//g, "-")}`
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [exportProject])

  return { saveProject, exportProject, downloadExport }
}

export function loadProjectFromStorage() {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
