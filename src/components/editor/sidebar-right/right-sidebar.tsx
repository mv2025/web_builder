"use client"

import { useEditorStore } from "@/stores/editor-store"
import { findNodeById } from "@/lib/utils"
import { StylePanel } from "./style-panel"
import { AnimationPanel } from "./animation-panel"
import { ContentPanel } from "./content-panel"

export function RightSidebar() {
  const { selection, getActivePage, rightPanelTab, setRightPanelTab } = useEditorStore()
  const page = getActivePage()

  const selectedNode = page && selection.nodeIds.length === 1
    ? findNodeById(page.components, selection.nodeIds[0])
    : null

  const TABS = [
    { id: "content" as const, label: "Content" },
    { id: "style" as const, label: "Style" },
    { id: "animation" as const, label: "Animate" },
    { id: "responsive" as const, label: "Responsive" },
  ]

  return (
    <div style={{
      width: "var(--panel-width-right)", flexShrink: 0,
      background: "var(--editor-sidebar)", borderLeft: "1px solid var(--border)",
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
    }}>
      {/* No selection state */}
      {!selectedNode && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--fg-ghost)", gap: "8px", padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", opacity: 0.4 }}>◎</div>
          <div style={{ fontSize: "13px", fontWeight: 500 }}>Select a component</div>
          <div style={{ fontSize: "12px", color: "var(--fg-dim)" }}>Click any element on the canvas to inspect and edit its properties</div>
        </div>
      )}

      {/* Panel header */}
      {selectedNode && (
        <>
          <div style={{
            padding: "10px 12px 0", borderBottom: "1px solid var(--border)", flexShrink: 0,
          }}>
            {/* Node type badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span style={{
                fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                padding: "2px 8px", borderRadius: "4px", background: "var(--accent-muted)", color: "var(--accent)",
              }}>
                {selectedNode.type}
              </span>
              <span style={{ fontSize: "12px", color: "var(--fg-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedNode.name}
              </span>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "2px" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRightPanelTab(tab.id)}
                  style={{
                    flex: 1, padding: "6px 4px", border: "none", cursor: "pointer",
                    fontSize: "11px", fontWeight: 600,
                    background: rightPanelTab === tab.id ? "var(--accent-muted)" : "transparent",
                    color: rightPanelTab === tab.id ? "var(--accent)" : "var(--fg-faint)",
                    borderBottom: rightPanelTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
                    borderRadius: "4px 4px 0 0",
                    transition: "all 0.15s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {rightPanelTab === "content" && <ContentPanel node={selectedNode} />}
            {rightPanelTab === "style" && <StylePanel node={selectedNode} />}
            {rightPanelTab === "animation" && <AnimationPanel node={selectedNode} />}
            {rightPanelTab === "responsive" && <ResponsivePanel node={selectedNode} />}
          </div>
        </>
      )}
    </div>
  )
}

function ResponsivePanel({ node }: { node: { id: string } }) {
  const { breakpoint, setBreakpoint } = useEditorStore()
  const DEVICES = [
    { id: "desktop" as const, label: "Desktop", icon: "🖥", width: "1440px" },
    { id: "tablet" as const, label: "Tablet", icon: "📱", width: "768px" },
    { id: "mobile" as const, label: "Mobile", icon: "📲", width: "390px" },
  ]

  return (
    <div style={{ padding: "16px 12px" }}>
      <SectionLabel>Device Preview</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
        {DEVICES.map((d) => (
          <button key={d.id} onClick={() => setBreakpoint(d.id)} style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px",
            cursor: "pointer",
            background: breakpoint === d.id ? "var(--accent-muted)" : "var(--card-bg)",
            outline: breakpoint === d.id ? "1px solid var(--accent-border)" : "1px solid var(--border-subtle)",
            border: "none",
            color: breakpoint === d.id ? "var(--accent)" : "var(--fg-muted)", textAlign: "left",
          }}>
            <span style={{ fontSize: "20px" }}>{d.icon}</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600 }}>{d.label}</div>
              <div style={{ fontSize: "11px", opacity: 0.6 }}>{d.width}</div>
            </div>
            {breakpoint === d.id && <span style={{ marginLeft: "auto", fontSize: "10px", fontWeight: 700, background: "var(--accent-muted)", padding: "2px 6px", borderRadius: "4px" }}>ACTIVE</span>}
          </button>
        ))}
      </div>
      <div style={{ fontSize: "12px", color: "var(--fg-ghost)", lineHeight: 1.6, padding: "10px 12px", background: "var(--card-bg)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
        Style changes in the Style panel apply to the currently active breakpoint. Desktop styles cascade down to smaller screens unless overridden.
      </div>
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-ghost)", marginBottom: "10px", paddingBottom: "6px", borderBottom: "1px solid var(--border-subtle)" }}>
      {children}
    </div>
  )
}
