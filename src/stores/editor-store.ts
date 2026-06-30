"use client"

import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { subscribeWithSelector } from "zustand/middleware"
import type {
  ComponentNode, PageSchema, Project, EditorSelection,
  HistoryEntry, EditorViewport, Breakpoint, StyleProps,
  AnimationConfig, DesignTokens,
} from "@/types"
import {
  findNodeById, updateNodeById, removeNodeById,
  cloneNode, deepClone, createNode, generateId,
} from "@/lib/utils"
import { defaultDesignTokens } from "@/lib/design-tokens"

const MAX_HISTORY = 50

interface EditorState {
  // Project
  project: Project | null
  activePageId: string | null

  // Selection
  selection: EditorSelection
  hoveredNodeId: string | null

  // Viewport
  viewport: EditorViewport
  breakpoint: Breakpoint
  previewMode: boolean

  // Panels
  leftPanelTab: "components" | "layers" | "assets"
  rightPanelTab: "content" | "style" | "animation" | "responsive"
  showGrid: boolean
  showGuides: boolean

  // History
  history: HistoryEntry[]
  historyIndex: number

  // Actions — Project
  setProject: (project: Project) => void
  setActivePageId: (id: string) => void
  getActivePage: () => PageSchema | null
  updatePageMeta: (pageId: string, meta: Partial<PageSchema["metadata"]>) => void

  // Actions — Selection
  selectNode: (id: string, multi?: boolean) => void
  deselectAll: () => void
  setHoveredNode: (id: string | null) => void

  // Actions — Node CRUD
  addNode: (node: ComponentNode, parentId: string | null, index?: number) => void
  removeNode: (id: string) => void
  duplicateNode: (id: string) => void
  updateNodeProps: (id: string, props: Record<string, unknown>) => void
  updateNodeStyles: (id: string, styles: Partial<StyleProps>, breakpoint: Breakpoint) => void
  updateNodeAnimations: (id: string, animations: AnimationConfig[]) => void
  renameNode: (id: string, name: string) => void
  toggleNodeLock: (id: string) => void
  toggleNodeVisibility: (id: string) => void
  moveNode: (id: string, newParentId: string | null, index: number) => void

  // Actions — Viewport
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  setBreakpoint: (bp: Breakpoint) => void
  setPreviewMode: (on: boolean) => void

  // Actions — UI
  setLeftPanelTab: (tab: EditorState["leftPanelTab"]) => void
  setRightPanelTab: (tab: EditorState["rightPanelTab"]) => void
  toggleGrid: () => void
  toggleGuides: () => void

  // Actions — Design Tokens
  updateDesignTokens: (tokens: Partial<DesignTokens>) => void

  // Clipboard
  clipboard: ComponentNode[] | null

  // Actions — Clipboard
  copyNodes: () => void
  cutNodes: () => void
  pasteNodes: () => void

  // Actions — History
  undo: () => void
  redo: () => void
  pushHistory: (description?: string) => void
  canUndo: () => boolean
  canRedo: () => boolean
}

function makeDefaultProject(): Project {
  const pageId = generateId()

  const page: PageSchema = {
    id: pageId,
    name: "Home",
    slug: "/",
    components: [],
    metadata: { title: "My Website", description: "Built with VisualCraft" },
  }

  return {
    id: generateId(),
    name: "My Project",
    pages: [page],
    designTokens: defaultDesignTokens,
    settings: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      project: makeDefaultProject(),
      activePageId: null,
      selection: { nodeIds: [], pageId: null },
      hoveredNodeId: null,
      viewport: { zoom: 1, panX: 0, panY: 0 },
      breakpoint: "desktop",
      previewMode: false,
      leftPanelTab: "components",
      rightPanelTab: "style",
      showGrid: false,
      showGuides: true,
      history: [],
      historyIndex: -1,
      clipboard: null,

      // ── Project ──────────────────────────────────────────────────────────

      setProject: (project) => set((s) => { s.project = project }),

      setActivePageId: (id) => set((s) => { s.activePageId = id }),

      getActivePage: () => {
        const { project, activePageId } = get()
        if (!project) return null
        const id = activePageId ?? project.pages[0]?.id
        return project.pages.find((p) => p.id === id) ?? null
      },

      updatePageMeta: (pageId, meta) => set((s) => {
        const page = s.project?.pages.find((p) => p.id === pageId)
        if (page) Object.assign(page.metadata, meta)
      }),

      // ── Selection ─────────────────────────────────────────────────────────

      selectNode: (id, multi = false) => set((s) => {
        const page = get().getActivePage()
        if (!page) return
        if (multi) {
          const idx = s.selection.nodeIds.indexOf(id)
          if (idx === -1) s.selection.nodeIds.push(id)
          else s.selection.nodeIds.splice(idx, 1)
        } else {
          s.selection.nodeIds = [id]
        }
        s.selection.pageId = page.id
        s.rightPanelTab = "style"
      }),

      deselectAll: () => set((s) => { s.selection = { nodeIds: [], pageId: null } }),

      setHoveredNode: (id) => set((s) => { s.hoveredNodeId = id }),

      // ── Node CRUD ─────────────────────────────────────────────────────────

      addNode: (node, parentId, index) => {
        get().pushHistory("Add node")
        set((s) => {
          const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
          if (!page) return
          const newNode = { ...node, parentId }
          if (!parentId) {
            if (index !== undefined) page.components.splice(index, 0, newNode)
            else page.components.push(newNode)
          } else {
            page.components = updateNodeById(page.components as ComponentNode[], parentId, (parent) => {
              const children = [...parent.children]
              if (index !== undefined) children.splice(index, 0, newNode)
              else children.push(newNode)
              return { ...parent, children }
            }) as typeof page.components
          }
          s.selection.nodeIds = [newNode.id]
        })
      },

      removeNode: (id) => {
        get().pushHistory("Remove node")
        set((s) => {
          const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
          if (!page) return
          page.components = removeNodeById(page.components as ComponentNode[], id) as typeof page.components
          s.selection.nodeIds = s.selection.nodeIds.filter((nid) => nid !== id)
        })
      },

      duplicateNode: (id) => {
        get().pushHistory("Duplicate node")
        set((s) => {
          const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
          if (!page) return
          const original = findNodeById(page.components as ComponentNode[], id)
          if (!original) return
          const clone = cloneNode(original as ComponentNode)
          if (!original.parentId) {
            const idx = page.components.findIndex((c) => c.id === id)
            page.components.splice(idx + 1, 0, clone as typeof page.components[0])
          } else {
            page.components = updateNodeById(page.components as ComponentNode[], original.parentId, (parent) => {
              const idx = parent.children.findIndex((c) => c.id === id)
              const children = [...parent.children]
              children.splice(idx + 1, 0, clone)
              return { ...parent, children }
            }) as typeof page.components
          }
          s.selection.nodeIds = [clone.id]
        })
      },

      copyNodes: () => {
        const page = get().getActivePage()
        if (!page) return
        const ids = get().selection.nodeIds
        const nodes: ComponentNode[] = []
        for (const id of ids) {
          const node = findNodeById(page.components as ComponentNode[], id)
          if (node) nodes.push(deepClone(node) as ComponentNode)
        }
        if (nodes.length > 0) set((s) => { s.clipboard = nodes as typeof s.clipboard })
      },

      cutNodes: () => {
        get().copyNodes()
        get().pushHistory("Cut nodes")
        const ids = [...get().selection.nodeIds]
        set((s) => {
          const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
          if (!page) return
          for (const id of ids) {
            page.components = removeNodeById(page.components as ComponentNode[], id) as typeof page.components
          }
          s.selection.nodeIds = []
        })
      },

      pasteNodes: () => {
        const clipboard = get().clipboard
        if (!clipboard || clipboard.length === 0) return
        get().pushHistory("Paste nodes")
        set((s) => {
          const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
          if (!page) return
          const newIds: string[] = []
          for (const original of clipboard) {
            const clone = cloneNode(original as ComponentNode)
            clone.parentId = null
            page.components.push(clone as typeof page.components[0])
            newIds.push(clone.id)
          }
          s.selection.nodeIds = newIds
        })
      },

      updateNodeProps: (id, props) => set((s) => {
        const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
        if (!page) return
        page.components = updateNodeById(page.components as ComponentNode[], id, (n) => {
          const updated = { ...n, props: { ...n.props, ...props } }
          if (n.type === "pagination" && props.totalPages !== undefined) {
            const newTotal = Number(props.totalPages) || 1
            const current = n.children.length
            if (newTotal > current) {
              for (let i = current; i < newTotal; i++) {
                updated.children = [...updated.children, {
                  id: generateId(), type: "container" as ComponentNode["type"],
                  name: `Page ${i + 1}`, props: {},
                  styles: { desktop: { width: "100%", minHeight: "200px", display: "flex", flexDirection: "column" as const }, tablet: {}, mobile: {} },
                  animations: [], children: [], locked: false, hidden: false, parentId: n.id,
                }]
              }
            }
          }
          return updated
        }) as typeof page.components
      }),

      updateNodeStyles: (id, styles, breakpoint) => set((s) => {
        const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
        if (!page) return
        page.components = updateNodeById(page.components as ComponentNode[], id, (n) => ({
          ...n,
          styles: {
            ...n.styles,
            [breakpoint]: { ...(n.styles[breakpoint] || {}), ...styles },
          },
        })) as typeof page.components
      }),

      updateNodeAnimations: (id, animations) => set((s) => {
        const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
        if (!page) return
        page.components = updateNodeById(page.components as ComponentNode[], id, (n) => ({
          ...n, animations,
        })) as typeof page.components
      }),

      renameNode: (id, name) => set((s) => {
        const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
        if (!page) return
        page.components = updateNodeById(page.components as ComponentNode[], id, (n) => ({
          ...n, name,
        })) as typeof page.components
      }),

      toggleNodeLock: (id) => set((s) => {
        const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
        if (!page) return
        page.components = updateNodeById(page.components as ComponentNode[], id, (n) => ({
          ...n, locked: !n.locked,
        })) as typeof page.components
      }),

      toggleNodeVisibility: (id) => set((s) => {
        const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
        if (!page) return
        page.components = updateNodeById(page.components as ComponentNode[], id, (n) => ({
          ...n, hidden: !n.hidden,
        })) as typeof page.components
      }),

      moveNode: (id, newParentId, index) => {
        get().pushHistory("Move node")
        set((s) => {
          const page = s.project?.pages.find((p) => p.id === (s.activePageId ?? s.project!.pages[0]?.id))
          if (!page) return
          const node = findNodeById(page.components as ComponentNode[], id)
          if (!node) return
          const nodeClone = { ...deepClone(node), parentId: newParentId }
          // Remove from current location
          page.components = removeNodeById(page.components as ComponentNode[], id) as typeof page.components
          // Insert at new location
          if (!newParentId) {
            page.components.splice(index, 0, nodeClone as typeof page.components[0])
          } else {
            page.components = updateNodeById(page.components as ComponentNode[], newParentId, (parent) => {
              const children = [...parent.children]
              children.splice(index, 0, nodeClone)
              return { ...parent, children }
            }) as typeof page.components
          }
        })
      },

      // ── Viewport ──────────────────────────────────────────────────────────

      setZoom: (zoom) => set((s) => { s.viewport.zoom = Math.max(0.1, Math.min(3, zoom)) }),
      setPan: (x, y) => set((s) => { s.viewport.panX = x; s.viewport.panY = y }),
      setBreakpoint: (bp) => set((s) => { s.breakpoint = bp }),
      setPreviewMode: (on) => set((s) => {
        s.previewMode = on
        if (on) s.selection = { nodeIds: [], pageId: null }
      }),

      // ── UI ────────────────────────────────────────────────────────────────

      setLeftPanelTab: (tab) => set((s) => { s.leftPanelTab = tab }),
      setRightPanelTab: (tab) => set((s) => { s.rightPanelTab = tab }),
      toggleGrid: () => set((s) => { s.showGrid = !s.showGrid }),
      toggleGuides: () => set((s) => { s.showGuides = !s.showGuides }),

      // ── Design Tokens ─────────────────────────────────────────────────────

      updateDesignTokens: (tokens) => set((s) => {
        if (!s.project) return
        Object.assign(s.project.designTokens, tokens)
      }),

      // ── History ───────────────────────────────────────────────────────────

      pushHistory: (description = "Action") => set((s) => {
        const page = get().getActivePage()
        if (!page) return
        const entry: HistoryEntry = {
          pages: deepClone(get().project!.pages),
          timestamp: Date.now(),
          description,
        }
        // Discard any "future" history when a new action is taken
        s.history = s.history.slice(0, s.historyIndex + 1)
        s.history.push(entry)
        if (s.history.length > MAX_HISTORY) s.history.shift()
        s.historyIndex = s.history.length - 1
      }),

      undo: () => set((s) => {
        if (s.historyIndex <= 0) return
        s.historyIndex--
        const entry = s.history[s.historyIndex]
        if (s.project) s.project.pages = deepClone(entry.pages)
      }),

      redo: () => set((s) => {
        if (s.historyIndex >= s.history.length - 1) return
        s.historyIndex++
        const entry = s.history[s.historyIndex]
        if (s.project) s.project.pages = deepClone(entry.pages)
      }),

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
    }))
  )
)
