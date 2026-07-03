import { canHaveChildren } from "@/lib/utils"
import type { ComponentType } from "@/types"

export interface DropTarget {
  parentId: string | null
  index: number
}

export interface DropIndicator {
  top: number
  left: number
  width: number
  height: number
}

export function findDropTarget(
  clientX: number,
  clientY: number,
  canvasEl: HTMLElement,
  excludeId?: string,
): DropTarget {
  let bestContainer: { id: string | null; el: HTMLElement; depth: number } = {
    id: null, el: canvasEl, depth: -1,
  }

  const allNodes = canvasEl.querySelectorAll<HTMLElement>("[data-node-id]")
  allNodes.forEach((el) => {
    const nodeId = el.getAttribute("data-node-id")!
    const nodeType = el.getAttribute("data-node-type")
    if (nodeId === excludeId || !nodeType) return
    if (!canHaveChildren(nodeType as ComponentType)) return

    const rect = el.getBoundingClientRect()
    if (
      clientX >= rect.left && clientX <= rect.right &&
      clientY >= rect.top && clientY <= rect.bottom
    ) {
      let depth = 0
      let parent = el.parentElement
      while (parent && parent !== canvasEl) {
        if (parent.hasAttribute("data-node-id")) depth++
        parent = parent.parentElement
      }
      if (depth > bestContainer.depth) {
        bestContainer = { id: nodeId, el, depth }
      }
    }
  })

  let directChildren = Array.from(
    bestContainer.el.querySelectorAll<HTMLElement>(":scope > [data-node-id]")
  ).filter((el) => el.getAttribute("data-node-id") !== excludeId)

  // For containers that render children in nested wrappers (innerClip div,
  // card-slider, tabs, etc.), direct children won't be found via :scope >.
  // Fall back to the first-level data-node-id descendants that are immediate
  // children of this container's component tree.
  if (directChildren.length === 0 && bestContainer.id) {
    const nested = Array.from(
      bestContainer.el.querySelectorAll<HTMLElement>("[data-node-id]")
    ).filter((el) => {
      if (el.getAttribute("data-node-id") === excludeId) return false
      // Only keep elements whose closest ancestor node-id is this container
      let p = el.parentElement
      while (p && p !== bestContainer.el) {
        if (p.hasAttribute("data-node-id") && p.getAttribute("data-node-id") !== bestContainer.id) return false
        p = p.parentElement
      }
      return true
    })
    if (nested.length > 0) {
      directChildren = nested
    }
  }

  if (directChildren.length === 0) {
    return { parentId: bestContainer.id, index: 0 }
  }

  // Determine layout direction from the container or its first wrapper child
  let layoutEl = bestContainer.el
  const firstChild = bestContainer.el.firstElementChild as HTMLElement | null
  if (directChildren.length > 0 && firstChild && !firstChild.hasAttribute("data-node-id")) {
    layoutEl = firstChild
  }
  const style = window.getComputedStyle(layoutEl)
  const isRow = style.display.includes("flex") &&
    (style.flexDirection === "row" || style.flexDirection === "row-reverse")

  for (let i = 0; i < directChildren.length; i++) {
    const rect = directChildren[i].getBoundingClientRect()
    if (isRow) {
      if (clientX < rect.left + rect.width / 2) return { parentId: bestContainer.id, index: i }
    } else {
      if (clientY < rect.top + rect.height / 2) return { parentId: bestContainer.id, index: i }
    }
  }

  return { parentId: bestContainer.id, index: directChildren.length }
}

export function getDropIndicator(
  target: DropTarget,
  canvasEl: HTMLElement,
  excludeId?: string,
): DropIndicator | null {
  const containerEl = target.parentId
    ? canvasEl.querySelector<HTMLElement>(`[data-node-id="${target.parentId}"]`)
    : canvasEl

  if (!containerEl) return null

  let directChildren = Array.from(
    containerEl.querySelectorAll<HTMLElement>(":scope > [data-node-id]")
  ).filter((el) => el.getAttribute("data-node-id") !== excludeId)

  // Same nested-child fallback as findDropTarget
  if (directChildren.length === 0 && target.parentId) {
    const nested = Array.from(
      containerEl.querySelectorAll<HTMLElement>("[data-node-id]")
    ).filter((el) => {
      if (el.getAttribute("data-node-id") === excludeId) return false
      let p = el.parentElement
      while (p && p !== containerEl) {
        if (p.hasAttribute("data-node-id") && p.getAttribute("data-node-id") !== target.parentId) return false
        p = p.parentElement
      }
      return true
    })
    if (nested.length > 0) directChildren = nested
  }

  const canvasRect = canvasEl.getBoundingClientRect()
  const containerRect = containerEl.getBoundingClientRect()

  let layoutEl: Element = containerEl
  const firstChild = containerEl.firstElementChild
  if (directChildren.length > 0 && firstChild && !firstChild.hasAttribute("data-node-id")) {
    layoutEl = firstChild
  }
  const style = window.getComputedStyle(layoutEl)
  const padTop = parseFloat(style.paddingTop) || 0
  const padLeft = parseFloat(style.paddingLeft) || 0
  const padRight = parseFloat(style.paddingRight) || 0
  const padBottom = parseFloat(style.paddingBottom) || 0

  const layoutRect = layoutEl.getBoundingClientRect()
  const contentLeft = layoutRect.left + padLeft - canvasRect.left
  const contentWidth = layoutRect.width - padLeft - padRight

  const isRow = style.display.includes("flex") &&
    (style.flexDirection === "row" || style.flexDirection === "row-reverse")

  if (isRow) {
    const contentTop = layoutRect.top + padTop - canvasRect.top
    const contentHeight = layoutRect.height - padTop - padBottom

    let x: number
    if (directChildren.length === 0) {
      x = contentLeft + 4
    } else if (target.index >= directChildren.length) {
      const last = directChildren[directChildren.length - 1].getBoundingClientRect()
      x = last.right + 2 - canvasRect.left
    } else {
      const child = directChildren[target.index].getBoundingClientRect()
      x = child.left - 2 - canvasRect.left
    }
    return { top: contentTop, left: x, width: 3, height: Math.max(contentHeight, 20) }
  }

  let y: number
  if (directChildren.length === 0) {
    y = layoutRect.top + padTop + 4 - canvasRect.top
  } else if (target.index >= directChildren.length) {
    const last = directChildren[directChildren.length - 1].getBoundingClientRect()
    y = last.bottom + 2 - canvasRect.top
  } else {
    const child = directChildren[target.index].getBoundingClientRect()
    y = child.top - 2 - canvasRect.top
  }
  return { top: y, left: contentLeft, width: Math.max(contentWidth, 20), height: 3 }
}

export function highlightContainer(
  canvasEl: HTMLElement,
  parentId: string | null,
  prevEl: HTMLElement | null,
): HTMLElement | null {
  if (prevEl) {
    prevEl.style.outline = ""
    prevEl.style.outlineOffset = ""
  }

  if (!parentId) return null

  const el = canvasEl.querySelector<HTMLElement>(`[data-node-id="${parentId}"]`)
  if (el) {
    el.style.outline = "2px dashed rgba(14, 165, 233, 0.6)"
    el.style.outlineOffset = "-2px"
    return el
  }
  return null
}

export function clearContainerHighlight(el: HTMLElement | null) {
  if (el) {
    el.style.outline = ""
    el.style.outlineOffset = ""
  }
}
