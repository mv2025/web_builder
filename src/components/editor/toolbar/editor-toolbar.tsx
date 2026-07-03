"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { useProjectAPI } from "@/hooks/use-project-api";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Breakpoint } from "@/types";

const DEVICES: {
  id: Breakpoint;
  label: string;
  icon: string;
  width: number;
}[] = [
  { id: "desktop", label: "Desktop", icon: "🖥", width: 1440 },
  { id: "tablet", label: "Tablet", icon: "📱", width: 768 },
  { id: "mobile", label: "Mobile", icon: "📲", width: 390 },
];

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function EditorToolbar() {
  const {
    project,
    breakpoint,
    setBreakpoint,
    viewport,
    setZoom,
    previewMode,
    setPreviewMode,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorStore();

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showExport, setShowExport] = useState(false);
  const { saveProject, downloadExport } = useProjectAPI();

  async function handleSave() {
    setSaving(true);
    const result = await saveProject();
    setSaving(false);
    setSaveMsg(result.ok ? "Saved!" : "Error");
    setTimeout(() => setSaveMsg(""), 2000);
  }

  async function handleExport(format: "react" | "nextjs" | "html") {
    setShowExport(false);
    await downloadExport(format);
  }

  return (
    <div
      style={{
        height: "var(--toolbar-height)",
        background: "var(--editor-toolbar)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        paddingLeft: "12px",
        paddingRight: "12px",
        gap: "8px",
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginRight: "8px",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #0ea5e9, #d946ef)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          V
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--fg)",
            whiteSpace: "nowrap",
          }}
        >
          VisualCraft
        </span>
      </div>

      {/* Project name */}
      <div
        style={{
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "13px",
          color: "var(--fg-muted)",
          background: "var(--bg-hover)",
          border: "1px solid transparent",
          cursor: "text",
          whiteSpace: "nowrap",
          maxWidth: "160px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {project?.name ?? "Untitled"}
      </div>

      <div
        style={{
          width: "1px",
          height: "24px",
          background: "var(--border)",
          margin: "0 4px",
        }}
      />

      {/* Undo / Redo */}
      <ToolbarButton onClick={undo} disabled={!canUndo()} title="Undo (Ctrl+Z)">
        ↩
      </ToolbarButton>
      <ToolbarButton onClick={redo} disabled={!canRedo()} title="Redo (Ctrl+Y)">
        ↪
      </ToolbarButton>

      <div style={{ flex: 1 }} />

      {/* Device breakpoints */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "var(--bg-hover)",
          borderRadius: "8px",
          padding: "2px",
          border: "1px solid var(--border)",
        }}
      >
        {DEVICES.map((d) => (
          <button
            key={d.id}
            onClick={() => setBreakpoint(d.id)}
            title={`${d.label} (${d.width}px)`}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              lineHeight: 1,
              background:
                breakpoint === d.id ? "var(--accent-muted)" : "transparent",
              color: breakpoint === d.id ? "var(--accent)" : "var(--fg-faint)",
              transition: "all 0.15s",
            }}
          >
            {d.icon}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Zoom control */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <ToolbarButton
          onClick={() => setZoom(viewport.zoom - 0.25)}
          disabled={viewport.zoom <= 0.1}
        >
          −
        </ToolbarButton>
        <select
          value={viewport.zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{
            background: "var(--bg-hover)",
            border: "1px solid var(--border)",
            color: "var(--fg)",
            borderRadius: "6px",
            padding: "4px 6px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          {ZOOM_LEVELS.map((z) => (
            <option key={z} value={z}>
              {Math.round(z * 100)}%
            </option>
          ))}
        </select>
        <ToolbarButton
          onClick={() => setZoom(viewport.zoom + 0.25)}
          disabled={viewport.zoom >= 3}
        >
          +
        </ToolbarButton>
      </div>

      <div
        style={{
          width: "1px",
          height: "24px",
          background: "var(--border)",
          margin: "0 4px",
        }}
      />

      {/* Theme toggle */}
      <ThemeToggle variant="icon" size="sm" />

      <div
        style={{
          width: "1px",
          height: "24px",
          background: "var(--border)",
          margin: "0 4px",
        }}
      />

      {/* Preview */}
      <ToolbarButton
        onClick={() => setPreviewMode(!previewMode)}
        active={previewMode}
        title="Preview"
        style={{ fontSize: "12px", padding: "5px 12px" }}
      >
        {previewMode ? "✕ Exit Preview" : "▶ Preview"}
      </ToolbarButton>

      {/* Save */}
      <ToolbarButton
        onClick={handleSave}
        disabled={saving}
        style={{
          fontSize: "12px",
          padding: "5px 12px",
          background:
            saveMsg === "Saved!"
              ? "rgba(34,197,94,0.15)"
              : "var(--accent-muted)",
          color: saveMsg === "Saved!" ? "var(--success)" : "var(--accent)",
        }}
      >
        {saving ? "Saving…" : saveMsg || "Save"}
      </ToolbarButton>

      {/* Export */}
      <div style={{ position: "relative" }}>
        <ToolbarButton
          onClick={() => setShowExport(!showExport)}
          style={{
            fontSize: "12px",
            padding: "5px 12px",
            background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
            color: "#fff",
            border: "none",
          }}
        >
          Export ▾
        </ToolbarButton>

        {showExport && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              zIndex: 200,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "6px",
              minWidth: "180px",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {[
              {
                format: "react" as const,
                label: "⚛ React Project",
                desc: "src/ components/ pages/",
              },
              {
                format: "nextjs" as const,
                label: "▲ Next.js Project",
                desc: "app/ with TypeScript",
              },
              {
                format: "html" as const,
                label: "🌐 HTML + CSS + JS",
                desc: "Pure static files",
              },
            ].map((opt) => (
              <button
                key={opt.format}
                onClick={() => handleExport(opt.format)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  background: "transparent",
                  color: "var(--fg)",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600 }}>
                  {opt.label}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--fg-faint)",
                    marginTop: "2px",
                  }}
                >
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  title,
  active,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  active?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: "5px 8px",
        borderRadius: "6px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "13px",
        lineHeight: 1,
        background: active ? "var(--accent-muted)" : "var(--bg-hover)",
        color: disabled
          ? "var(--fg-ghost)"
          : active
            ? "var(--accent)"
            : "var(--fg-muted)",
        outline: active
          ? "1px solid var(--accent-border)"
          : "1px solid transparent",
        border: "none",
        transition: "all 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
