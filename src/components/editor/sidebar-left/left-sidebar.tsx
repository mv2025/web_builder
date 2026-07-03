"use client"

import { useState } from "react"
import { useEditorStore } from "@/stores/editor-store"
import { getAllComponents } from "@/engine/registry/component-registry"
import { LayersPanel } from "../layers/layers-panel"
import type { ComponentCategory } from "@/types"
import { createNode, canHaveChildren, findNodeById } from "@/lib/utils"
import {
  LayoutPanelTop, Square, Rows3, LayoutGrid, Layers, MoveVertical,
  Heading, Type, AlignLeft, Quote, List,
  MousePointerClick, Zap, CircleDot,
  ImageIcon, Video, ImagePlus, PanelLeftClose,
  TextCursorInput, SquarePen, CheckSquare, ChevronDown,
  LayoutTemplate, Star, MessageSquareQuote, HelpCircle, BadgeDollarSign,
  Building2, BarChart2, Users, Megaphone, PanelBottom,
  ListCollapse, PanelTop, SquareArrowOutUpRight, PanelRightOpen, GalleryThumbnails,
  Hash, Loader,
  MoveRight, GitBranch, Grid3X3, LayoutDashboard,
  Minus, Tag, CreditCard, Sparkles,
  Box, Triangle, Layers3, Globe, BoxSelect,
  // New icons
  Volume2, Code2, MapPin, FileText, Upload, SlidersHorizontal, ToggleLeft,
  Calendar, ChevronsRight, MoreHorizontal, PanelLeft, ListOrdered,
  ExternalLink, Share2, UserCircle, MessageCircle, AlertTriangle,
  Tags, Table2, Terminal, Mail, Send, Flag, MessageSquare,
  Play, ArrowRightLeft, ArrowDownUp, ZoomIn, Waves,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const CATEGORIES: ComponentCategory[] = [
  "Layout", "Typography", "Buttons", "Media", "Forms",
  "Marketing", "Interactive", "Advanced", "3D", "Animated", "Waves",
]

const CATEGORY_LUCIDE: Record<ComponentCategory, LucideIcon> = {
  Layout: LayoutGrid, Typography: Type, Buttons: MousePointerClick, Media: ImageIcon,
  Forms: TextCursorInput, Marketing: Star, Interactive: Zap, Advanced: Sparkles, "3D": Globe, Animated: Play, Waves: Waves,
}

const ICON_MAP: Record<string, LucideIcon> = {
  "layout-panel-top": LayoutPanelTop, square: Square, "rows-3": Rows3,
  "layout-grid": LayoutGrid, layers: Layers, "move-vertical": MoveVertical,
  heading: Heading, text: AlignLeft, type: Type, quote: Quote, list: List,
  "mouse-pointer-click": MousePointerClick, zap: Zap, "circle-dot": CircleDot,
  image: ImageIcon, video: Video, "image-plus": ImagePlus, "panel-left-close": PanelLeftClose,
  "text-cursor-input": TextCursorInput, "square-pen": SquarePen,
  "check-square": CheckSquare, "chevron-down": ChevronDown,
  "layout-template": LayoutTemplate, star: Star,
  "message-square-quote": MessageSquareQuote, "help-circle": HelpCircle,
  "badge-dollar-sign": BadgeDollarSign, "building-2": Building2,
  "bar-chart-2": BarChart2, users: Users, megaphone: Megaphone,
  "layout-panel-bottom": PanelBottom,
  "list-collapse": ListCollapse, "panel-top": PanelTop,
  "square-arrow-out-up-right": SquareArrowOutUpRight,
  "panel-right-open": PanelRightOpen, "gallery-thumbnails": GalleryThumbnails,
  hash: Hash, loader: Loader,
  "move-right": MoveRight, "git-branch": GitBranch, "grid-3x3": Grid3X3,
  "layout-dashboard": LayoutDashboard,
  minus: Minus, tag: Tag, "credit-card": CreditCard, sparkles: Sparkles,
  box: Box, triangle: Triangle, "layers-3": Layers3, globe: Globe, "box-select": BoxSelect,
  // New icons
  "volume-2": Volume2, "code-2": Code2, "map-pin": MapPin, "file-text": FileText,
  upload: Upload, "sliders-horizontal": SlidersHorizontal, "toggle-left": ToggleLeft,
  calendar: Calendar, "chevrons-right": ChevronsRight, "more-horizontal": MoreHorizontal,
  "panel-left": PanelLeft, "list-ordered": ListOrdered, "external-link": ExternalLink,
  "share-2": Share2, "user-circle": UserCircle, "message-circle": MessageCircle,
  "alert-triangle": AlertTriangle, tags: Tags, "table-2": Table2, terminal: Terminal,
  mail: Mail, send: Send, flag: Flag, "message-square": MessageSquare,
  "arrow-right-left": ArrowRightLeft, "arrow-down-up": ArrowDownUp, "zoom-in": ZoomIn,
  waves: Waves,
}

export function LeftSidebar() {
  const { leftPanelTab, setLeftPanelTab, addNode, selection, getActivePage } = useEditorStore()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | "All">("All")

  const allComponents = getAllComponents()
  const filtered = allComponents.filter((c) => {
    const matchSearch = !search || c.label.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === "All" || c.category === activeCategory
    return matchSearch && matchCat
  })

  function handleDragStart(e: React.DragEvent, type: string) {
    e.dataTransfer.setData("component-type", type)
    e.dataTransfer.effectAllowed = "copy"
  }

  function handleAddComponent(type: string) {
    const node = createNode(type as Parameters<typeof createNode>[0])
    const state = useEditorStore.getState()
    const selectedId = state.selection.nodeIds[0]
    if (selectedId) {
      const page = state.getActivePage()
      const selectedNode = page ? findNodeById(page.components, selectedId) : null
      if (selectedNode && canHaveChildren(selectedNode.type)) {
        addNode(node, selectedId)
        return
      }
    }
    addNode(node, null)
  }

  return (
    <div style={{
      width: "var(--panel-width-left)", flexShrink: 0,
      background: "var(--editor-sidebar)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
    }}>
      {/* Tab switcher */}
      <div style={{
        display: "flex", borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        {(["components", "layers", "assets"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setLeftPanelTab(tab)}
            style={{
              flex: 1, padding: "10px 4px", border: "none", cursor: "pointer",
              fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
              background: leftPanelTab === tab ? "var(--accent-muted)" : "transparent",
              color: leftPanelTab === tab ? "var(--accent)" : "var(--fg-faint)",
              borderBottom: leftPanelTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {tab === "components" ? "⊞ Components" : tab === "layers" ? "≡ Layers" : "☁ Assets"}
          </button>
        ))}
      </div>

      {leftPanelTab === "components" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          {/* Search */}
          <div style={{ padding: "10px 10px 6px" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search components…"
              style={{
                width: "100%", padding: "7px 10px", borderRadius: "8px", fontSize: "13px",
                background: "var(--input-bg)", border: "1px solid var(--input-border)",
                color: "var(--input-fg)", outline: "none",
              }}
            />
          </div>

          {/* Category filter */}
          <div style={{ padding: "0 10px 8px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {(["All", ...CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "3px 8px", borderRadius: "4px", border: "none", cursor: "pointer",
                  fontSize: "11px", fontWeight: 500,
                  background: activeCategory === cat ? "var(--accent-muted)" : "var(--bg-hover)",
                  color: activeCategory === cat ? "var(--accent)" : "var(--fg-faint)",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Component list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 10px" }}>
            {/* Group by category */}
            {(activeCategory === "All" ? CATEGORIES : [activeCategory]).map((cat) => {
              const catComponents = filtered.filter((c) => c.category === cat)
              if (catComponents.length === 0) return null
              return (
                <div key={cat} style={{ marginBottom: "16px" }}>
                  <div style={{
                    fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.1em", color: "var(--fg-ghost)", marginBottom: "6px",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                    <span>{(() => { const CatIcon = CATEGORY_LUCIDE[cat]; return <CatIcon size={12} strokeWidth={1.5} /> })()}</span>
                    {cat}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                    {catComponents.map((comp) => (
                      <div
                        key={comp.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, comp.type)}
                        onClick={() => handleAddComponent(comp.type)}
                        title={`Add ${comp.label}`}
                        style={{
                          padding: "8px 6px", borderRadius: "6px", cursor: "grab",
                          background: "var(--card-bg)", border: "1px solid var(--border)",
                          textAlign: "center", fontSize: "11px", color: "var(--fg-muted)",
                          transition: "all 0.15s", userSelect: "none",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget
                          el.style.background = "var(--accent-muted)"
                          el.style.borderColor = "var(--accent-border)"
                          el.style.color = "var(--fg-secondary)"
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget
                          el.style.background = "var(--card-bg)"
                          el.style.borderColor = "var(--border)"
                          el.style.color = "var(--fg-muted)"
                        }}
                      >
                        <div style={{ marginBottom: "4px", display: "flex", justifyContent: "center" }}>
                          {(() => { const Icon = ICON_MAP[comp.icon] ?? Square; return <Icon size={18} strokeWidth={1.5} /> })()}
                        </div>
                        <div style={{ lineHeight: 1.2, fontSize: "10px" }}>{comp.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {leftPanelTab === "layers" && <LayersPanel />}

      {leftPanelTab === "assets" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-ghost)", fontSize: "13px" }}>
          Assets panel coming soon
        </div>
      )}
    </div>
  )
}

