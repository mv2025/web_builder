"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const DynamicIcon = dynamic(
  () => import("lucide-react/dynamic").then((mod) => mod.DynamicIcon),
  { ssr: false },
)

export function LucideIcon({
  name,
  size = 16,
  strokeWidth = 2,
  color,
  style,
}: {
  name: string
  size?: number
  strokeWidth?: number
  color?: string
  style?: React.CSSProperties
}) {
  if (!name) return null
  return (
    <Suspense fallback={<span style={{ display: "inline-block", width: size, height: size }} />}>
      <DynamicIcon
        name={name as never}
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        style={style}
      />
    </Suspense>
  )
}

export const ICON_CATEGORIES: Record<string, string[]> = {
  Arrows: [
    "arrow-right", "arrow-left", "arrow-up", "arrow-down",
    "arrow-up-right", "arrow-down-left",
    "chevron-right", "chevron-left", "chevron-up", "chevron-down",
    "chevrons-right", "chevrons-left", "chevrons-up", "chevrons-down",
    "move-right", "move-left", "corner-up-right", "redo", "undo",
    "external-link", "arrow-up-from-line", "arrow-down-to-line",
  ],
  Actions: [
    "download", "upload", "share", "share-2", "copy", "clipboard",
    "save", "trash-2", "edit", "pencil",
    "plus", "minus", "x", "check", "refresh-cw", "rotate-cw",
    "maximize", "minimize", "log-in", "log-out", "send", "reply",
  ],
  Media: [
    "play", "pause", "square", "skip-forward", "skip-back",
    "volume-2", "volume-x", "mic", "mic-off", "camera",
    "video", "image", "film", "music", "headphones", "radio",
  ],
  Communication: [
    "mail", "message-square", "message-circle", "phone", "phone-call",
    "inbox", "bell", "bell-ring", "at-sign", "rss",
    "megaphone", "voicemail",
  ],
  Social: [
    "heart", "thumbs-up", "thumbs-down", "star", "bookmark",
    "flag", "award", "trophy", "gift", "cake",
    "sparkles", "flame", "zap",
  ],
  Interface: [
    "menu", "more-horizontal", "more-vertical", "grid-3x3",
    "list", "filter", "search", "settings", "sliders-horizontal",
    "eye", "eye-off", "lock", "unlock", "key",
    "shield", "info", "alert-triangle", "alert-circle", "help-circle",
    "loader", "circle", "square", "triangle",
  ],
  Navigation: [
    "home", "compass", "map", "map-pin", "navigation",
    "globe", "link", "link-2", "hash",
    "panel-left", "panel-right", "layout-grid",
  ],
  People: [
    "user", "users", "user-plus", "user-minus", "user-check",
    "contact", "accessibility",
  ],
  Commerce: [
    "shopping-cart", "shopping-bag", "credit-card", "wallet",
    "dollar-sign", "percent", "receipt", "tag", "tags",
    "package", "truck", "store", "badge-dollar-sign",
  ],
  Files: [
    "file", "file-text", "folder", "folder-open",
    "paperclip", "book", "book-open", "notebook", "newspaper",
  ],
  Tech: [
    "code", "code-2", "terminal", "database", "server",
    "cloud", "cloud-upload", "cloud-download", "wifi", "bluetooth",
    "cpu", "hard-drive", "monitor", "smartphone", "tablet",
    "mouse-pointer", "mouse-pointer-click", "command", "github",
  ],
  Weather: [
    "sun", "moon", "cloud", "cloud-rain", "cloud-snow",
    "cloud-lightning", "wind", "droplets", "thermometer", "umbrella",
  ],
}

export const ALL_ICON_NAMES: string[] = Object.values(ICON_CATEGORIES).flat()
