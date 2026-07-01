import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from "nanoid"
import type { ComponentNode, ComponentType, StyleProps, ResponsiveValue } from "@/types"
import { getComponentMeta } from "@/engine/registry/component-registry"

const CONTAINER_TYPES: ComponentType[] = [
  "section", "container", "flex", "grid", "stack", "hero", "footer", "card", "form", "tabs", "card-slider",
]

export function canHaveChildren(type: ComponentType): boolean {
  return CONTAINER_TYPES.includes(type)
}

const INLINE_TYPES: ComponentType[] = [
  "button", "cta-button", "icon-button", "badge", "icon", "image",
]

export function isInlineComponent(type: ComponentType): boolean {
  return INLINE_TYPES.includes(type)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return nanoid(10)
}

export function createNode(
  type: ComponentType,
  overrides: Partial<ComponentNode> = {}
): ComponentNode {
  const meta = getComponentMeta(type)
  const nodeId = generateId()
  const node: ComponentNode = {
    id: nodeId,
    type,
    name: meta?.label ?? type,
    props: { ...(meta?.defaultProps ?? {}) },
    styles: { desktop: { ...(meta?.defaultStyles as StyleProps ?? {}) }, tablet: {}, mobile: {} },
    animations: [],
    children: [],
    locked: false,
    hidden: false,
    parentId: null,
    ...overrides,
  }
  if (type === "tabs" && node.children.length === 0) {
    const tabs = (node.props as Record<string, unknown>).tabs as { label: string }[] ?? []
    node.children = tabs.map((_, i) => ({
      id: generateId(),
      type: "container" as ComponentType,
      name: `Tab Pane ${i + 1}`,
      props: {},
      styles: { desktop: { width: "100%", minHeight: "60px" }, tablet: {}, mobile: {} },
      animations: [],
      children: [],
      locked: false,
      hidden: false,
      parentId: nodeId,
    }))
  }
  if (type === "accordion" && node.children.length === 0) {
    const defaultItems = [
      { title: "Question one?", content: "Answer goes here." },
      { title: "Question two?", content: "Answer goes here." },
    ]
    node.children = defaultItems.map((item, i) => {
      const itemId = generateId()
      const contentId = generateId()
      return {
        id: itemId,
        type: "accordion-item" as ComponentType,
        name: item.title,
        props: { title: item.title, defaultOpen: i === 0 },
        styles: { desktop: { width: "100%", borderRadius: "8px" }, tablet: {}, mobile: {} },
        animations: [],
        locked: false,
        hidden: false,
        parentId: nodeId,
        children: [{
          id: contentId,
          type: "paragraph" as ComponentType,
          name: "Content",
          props: { text: item.content },
          styles: { desktop: { fontSize: "14px", lineHeight: "1.7", color: "#71717a" }, tablet: {}, mobile: {} },
          animations: [],
          children: [],
          locked: false,
          hidden: false,
          parentId: itemId,
        }],
      }
    })
  }
  if (type === "accordion-item" && node.children.length === 0) {
    const contentId = generateId()
    node.children = [{
      id: contentId,
      type: "paragraph" as ComponentType,
      name: "Content",
      props: { text: "Answer goes here." },
      styles: { desktop: { fontSize: "14px", lineHeight: "1.7", color: "#71717a" }, tablet: {}, mobile: {} },
      animations: [],
      children: [],
      locked: false,
      hidden: false,
      parentId: nodeId,
    }]
  }
  if (type === "pagination" && node.children.length === 0) {
    const totalPages = (node.props as Record<string, unknown>).totalPages as number ?? 5
    node.children = Array.from({ length: totalPages }, (_, i) => ({
      id: generateId(),
      type: "container" as ComponentType,
      name: `Page ${i + 1}`,
      props: {},
      styles: { desktop: { width: "100%", minHeight: "200px", display: "flex", flexDirection: "column" as const }, tablet: {}, mobile: {} },
      animations: [],
      children: [],
      locked: false,
      hidden: false,
      parentId: nodeId,
    }))
  }
  return node
}

export function findNodeById(
  nodes: ComponentNode[],
  id: string
): ComponentNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNodeById(node.children, id)
    if (found) return found
  }
  return null
}

export function findNodePath(
  nodes: ComponentNode[],
  id: string,
  path: string[] = []
): string[] | null {
  for (const node of nodes) {
    if (node.id === id) return [...path, id]
    const found = findNodePath(node.children, id, [...path, node.id])
    if (found) return found
  }
  return null
}

export function removeNodeById(
  nodes: ComponentNode[],
  id: string
): ComponentNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: removeNodeById(n.children, id) }))
}

export function updateNodeById(
  nodes: ComponentNode[],
  id: string,
  updater: (node: ComponentNode) => ComponentNode
): ComponentNode[] {
  return nodes.map((n) => {
    if (n.id === id) return updater(n)
    return { ...n, children: updateNodeById(n.children, id, updater) }
  })
}

export function insertNodeAfter(
  nodes: ComponentNode[],
  afterId: string,
  newNode: ComponentNode
): ComponentNode[] {
  const result: ComponentNode[] = []
  for (const node of nodes) {
    result.push({ ...node, children: insertNodeAfter(node.children, afterId, newNode) })
    if (node.id === afterId) result.push(newNode)
  }
  return result
}

export function flattenNodes(nodes: ComponentNode[]): ComponentNode[] {
  const result: ComponentNode[] = []
  for (const node of nodes) {
    result.push(node)
    result.push(...flattenNodes(node.children))
  }
  return result
}

const SHORTHAND_CONFLICTS: Record<string, string[]> = {
  borderRadius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"],
  padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
  margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
}

export function stylePropsToCSS(
  styles: StyleProps,
  important = false
): React.CSSProperties {
  const suffix = important ? " !important" : ""
  const CUSTOM_KEYS = new Set(["backgroundVideo", "imageBlur", "overlayColor"])
  const entries = Object.entries(styles).filter(([k, v]) => v !== undefined && v !== "" && !CUSTOM_KEYS.has(k))
  const css: Record<string, string> = {}
  for (const [k, v] of entries) {
    let val = `${v}`
    if (k === "backgroundImage" && val && val !== "none") {
      const isCSSFn = (s: string) => /^(url|linear-gradient|radial-gradient|conic-gradient|none)\s*\(/.test(s) || s === "none"
      if (!isCSSFn(val)) {
        val = `url(${val})`
      }
    }
    if ((k === "backdropFilter" || k === "filter") && val && !val.includes("(")) {
      val = `blur(${val}${/^\d+$/.test(val) ? "px" : ""})`
    }
    css[k] = `${val}${suffix}`
  }
  // Expand shorthands when individual properties are also present to avoid React warnings
  for (const [shorthand, longhands] of Object.entries(SHORTHAND_CONFLICTS)) {
    if (css[shorthand] && longhands.some((l) => l in css)) {
      const val = css[shorthand]
      for (const l of longhands) {
        if (!(l in css)) css[l] = val
      }
      delete css[shorthand]
    }
  }
  return css as React.CSSProperties
}

export function resolveResponsiveStyles(
  styles: ResponsiveValue<StyleProps>,
  breakpoint: "desktop" | "tablet" | "mobile"
): StyleProps {
  const base = styles.desktop || {}
  if (breakpoint === "desktop") return base
  if (breakpoint === "tablet") return { ...base, ...(styles.tablet || {}) }
  return { ...base, ...(styles.tablet || {}), ...(styles.mobile || {}) }
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function cloneNode(node: ComponentNode): ComponentNode {
  const clone = deepClone(node)
  const reassignIds = (n: ComponentNode): ComponentNode => {
    const result = { ...n, id: generateId(), children: n.children.map(reassignIds) }
    if (result.styles?.desktop) {
      // Strip positioning, height, and transform so clones auto-size and don't overlap
      const { height, minHeight, transform, marginLeft, marginTop, ...rest } = result.styles.desktop as Record<string, unknown>
      result.styles = { ...result.styles, desktop: rest as typeof result.styles.desktop }
    }
    return result
  }
  return reassignIds(clone)
}
