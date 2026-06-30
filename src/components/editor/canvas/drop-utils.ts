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

  const directChildren = Array.from(
    bestContainer.el.querySelectorAll<HTMLElement>(":scope > [data-node-id]")
  ).filter((el) => el.getAttribute("data-node-id") !== excludeId)

  if (directChildren.length === 0) {
    return { parentId: bestContainer.id, index: 0 }
  }

  const style = window.getComputedStyle(bestContainer.el)
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

  const directChildren = Array.from(
    containerEl.querySelectorAll<HTMLElement>(":scope > [data-node-id]")
  ).filter((el) => el.getAttribute("data-node-id") !== excludeId)

  const canvasRect = canvasEl.getBoundingClientRect()
  const containerRect = containerEl.getBoundingClientRect()

  const style = window.getComputedStyle(containerEl)
  const padTop = parseFloat(style.paddingTop) || 0
  const padLeft = parseFloat(style.paddingLeft) || 0
  const padRight = parseFloat(style.paddingRight) || 0
  const padBottom = parseFloat(style.paddingBottom) || 0

  const contentLeft = containerRect.left + padLeft - canvasRect.left
  const contentWidth = containerRect.width - padLeft - padRight

  const isRow = style.display.includes("flex") &&
    (style.flexDirection === "row" || style.flexDirection === "row-reverse")

  if (isRow) {
    const contentTop = containerRect.top + padTop - canvasRect.top
    const contentHeight = containerRect.height - padTop - padBottom

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
    y = containerRect.top + padTop + 4 - canvasRect.top
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
    prevEl.style.background = ""
  }

  if (!parentId) return null

  const el = canvasEl.querySelector<HTMLElement>(`[data-node-id="${parentId}"]`)
  if (el) {
    el.style.outline = "2px dashed rgba(14, 165, 233, 0.6)"
    el.style.outlineOffset = "-2px"
    el.style.background = "rgba(14, 165, 233, 0.04)"
    return el
  }
  return null
}

export function clearContainerHighlight(el: HTMLElement | null) {
  if (el) {
    el.style.outline = ""
    el.style.outlineOffset = ""
    el.style.background = ""
  }
}
