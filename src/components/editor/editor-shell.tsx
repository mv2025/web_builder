"use client";

import { useEffect } from "react";
import { EditorToolbar } from "./toolbar/editor-toolbar";
import { LeftSidebar } from "./sidebar-left/left-sidebar";
import { RightSidebar } from "./sidebar-right/right-sidebar";
import { EditorCanvas } from "./canvas/editor-canvas";
import { useEditorStore } from "@/stores/editor-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { loadProjectFromStorage } from "@/hooks/use-project-api";

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

export function EditorShell() {
  const { project, setProject, pushHistory, previewMode } = useEditorStore();
  useKeyboardShortcuts();

  // Load saved project from localStorage on mount
  useEffect(() => {
    const saved = loadProjectFromStorage();
    if (saved && saved.pages?.length) {
      setProject(saved);
    }
    pushHistory("Initial state");
  }, []); // eslint-disable-line

  // Load GSAP on mount so it's ready for preview
  useEffect(() => {
    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
      "gsap-core",
    )
      .then(() =>
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
          "gsap-scroll",
        ),
      )
      .then(() => {
        if (window.gsap && window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
        }
      });
  }, []);

  return (
    <div
      className="no-select"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "var(--editor-canvas)",
      }}
    >
      {/* Top Toolbar */}
      <EditorToolbar />

      {/* Main editor body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {!previewMode && <LeftSidebar />}
        <EditorCanvas />
        {!previewMode && <RightSidebar />}
      </div>
    </div>
  );
}
