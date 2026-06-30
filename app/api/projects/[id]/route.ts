import { NextResponse } from "next/server"
import type { Project } from "@/types"

// Shared in-memory store (import from shared module in real implementation)
declare const globalThis: typeof global & { __projects?: Map<string, Project> }
if (!globalThis.__projects) globalThis.__projects = new Map()
const projects = globalThis.__projects

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.get(id)
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ project })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json() as Partial<Project>
  const existing = projects.get(id)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() }
  projects.set(id, updated)
  return NextResponse.json({ project: updated })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!projects.has(id)) return NextResponse.json({ error: "Not found" }, { status: 404 })
  projects.delete(id)
  return NextResponse.json({ success: true })
}
