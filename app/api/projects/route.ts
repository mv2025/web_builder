import { NextResponse } from "next/server"
import type { Project } from "@/types"

// In-memory store (replace with Prisma + PostgreSQL in production)
const projects = new Map<string, Project>()

export async function GET() {
  const all = Array.from(projects.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  return NextResponse.json({ projects: all })
}

export async function POST(request: Request) {
  const body = await request.json() as Project
  if (!body.id || !body.name) {
    return NextResponse.json({ error: "id and name are required" }, { status: 400 })
  }
  body.updatedAt = new Date().toISOString()
  projects.set(body.id, body)
  return NextResponse.json({ project: body }, { status: 201 })
}
