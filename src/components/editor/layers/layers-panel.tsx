"use client"

import { useState } from "react"
import { useEditorStore } from "@/stores/editor-store"
import type { ComponentNode } from "@/types"

export function LayersPanel() {
  const { getActivePage, selection, selectNode, toggleNodeVisibility, toggleNodeLock, duplicateNode, removeNode, renameNode } = useEditorStore()
  const page = getActivePage()

  if (!page) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-ghost)", fontSize: "13px" }}>
      No page selected
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
      <div style={{ padding: "4px 10px 8px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-ghost)" }}>
        {page.name}
      </div>
      {page.components.map((node) => (
        <LayerNode
          key={node.id}
          node={node as ComponentNode}
          depth={0}
          selectedIds={selection.nodeIds}
          onSelect={(id, multi) => selectNode(id, multi)}
          onToggleVisibility={toggleNodeVisibility}
          onToggleLock={toggleNodeLock}
          onDuplicate={duplicateNode}
          onRemove={removeNode}
          onRename={renameNode}
        />
      ))}
    </div>
  )
}

function LayerNode({
  node, depth, selectedIds, onSelect, onToggleVisibility, onToggleLock, onDuplicate, onRemove, onRename,
}: {
  node: ComponentNode
  depth: number
  selectedIds: string[]
  onSelect: (id: string, multi?: boolean) => void
  onToggleVisibility: (id: string) => void
  onToggleLock: (id: string) => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
  onRename: (id: string, name: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(node.name)
  const [hovered, setHovered] = useState(false)

  const isSelected = selectedIds.includes(node.id)
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div
        style={{
          display: "flex", alignItems: "center",
          paddingLeft: `${10 + depth * 16}px`, paddingRight: "6px",
          height: "30px", cursor: "pointer",
          background: isSelected ? "var(--editor-selection-bg)" : hovered ? "var(--bg-hover)" : "transparent",
          borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => onSelect(node.id, e.metaKey || e.ctrlKey)}
      >
        {/* Expand/collapse */}
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
          style={{
            width: "14px", height: "14px", border: "none", background: "none",
            cursor: hasChildren ? "pointer" : "default", color: "var(--fg-faint)", padding: 0,
            fontSize: "10px", flexShrink: 0, opacity: hasChildren ? 1 : 0,
          }}
        >
          {expanded ? "▾" : "▸"}
        </button>

        {/* Icon */}
        <span style={{ marginLeft: "4px", marginRight: "6px", fontSize: "12px", flexShrink: 0, opacity: 0.7 }}>
          {getNodeIcon(node.type)}
        </span>

        {/* Name */}
        {editing ? (
          <input
            value={editName}
            autoFocus
            onChange={(e) => setEditName(e.target.value)}
            onBlur={() => { onRename(node.id, editName); setEditing(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") { onRename(node.id, editName); setEditing(false) } if (e.key === "Escape") setEditing(false) }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--accent-muted)", border: "1px solid var(--accent-border)",
              borderRadius: "4px", color: "var(--fg)", fontSize: "12px", padding: "2px 6px",
              outline: "none", flex: 1, minWidth: 0,
            }}
          />
        ) : (
          <span
            onDoubleClick={(e) => { e.stopPropagation(); setEditing(true) }}
            style={{
              fontSize: "12px", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", color: isSelected ? "var(--fg-secondary)" : "var(--fg-muted)",
              opacity: node.hidden ? 0.4 : 1,
              textDecoration: node.hidden ? "line-through" : "none",
            }}
          >
            {node.name || node.type}
          </span>
        )}

        {/* Actions — shown on hover */}
        {(hovered || isSelected) && !editing && (
          <div style={{ display: "flex", gap: "2px", flexShrink: 0, marginLeft: "4px" }}>
            <LayerAction title={node.hidden ? "Show" : "Hide"} onClick={(e) => { e.stopPropagation(); onToggleVisibility(node.id) }}>
              {node.hidden ? "👁" : "👁"}
            </LayerAction>
            <LayerAction title={node.locked ? "Unlock" : "Lock"} onClick={(e) => { e.stopPropagation(); onToggleLock(node.id) }}>
              {node.locked ? "🔒" : "🔓"}
            </LayerAction>
            <LayerAction title="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate(node.id) }}>⊕</LayerAction>
            <LayerAction title="Delete" onClick={(e) => { e.stopPropagation(); onRemove(node.id) }}>✕</LayerAction>
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <LayerNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedIds={selectedIds}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onToggleLock={onToggleLock}
              onDuplicate={onDuplicate}
              onRemove={onRemove}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function LayerAction({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: "18px", height: "18px", border: "none", background: "none",
        cursor: "pointer", color: "var(--fg-faint)", fontSize: "11px", padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "3px",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-active)"; e.currentTarget.style.color = "var(--fg)" }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--fg-faint)" }}
    >
      {children}
    </button>
  )
}

function getNodeIcon(type: string): string {
  const m: Record<string, string> = {
    section: "▭", container: "□", flex: "↔", grid: "⊞", hero: "★",
    heading: "H", paragraph: "¶", button: "⬡", image: "🖼", video: "▶",
    features: "✦", testimonials: "💬", faq: "❓", pricing: "💎", footer: "⊟",
  }
  return m[type] ?? "◇"
}
