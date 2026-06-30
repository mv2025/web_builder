import { NextResponse } from "next/server"
import { exportAsReact, exportAsHTML } from "@/engine/export/react-exporter"
import type { Project, ExportFormat } from "@/types"

export async function POST(request: Request) {
  const body = await request.json() as { project: Project; format: ExportFormat }
  const { project, format } = body

  if (!project || !format) {
    return NextResponse.json({ error: "project and format are required" }, { status: 400 })
  }

  try {
    let files: { path: string; content: string }[]

    switch (format) {
      case "react":
      case "nextjs":
        files = exportAsReact(project)
        break
      case "html":
        files = exportAsHTML(project)
        break
      default:
        return NextResponse.json({ error: `Format "${format}" not yet supported` }, { status: 400 })
    }

    return NextResponse.json({ files, format, projectName: project.name })
  } catch (err) {
    console.error("Export error:", err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
