import type { Project, PageSchema, ComponentNode, StyleProps, Breakpoint } from "@/types"

// ─── React Project Exporter ───────────────────────────────────────────────────
// Generates a clean, readable React + Tailwind project from a PageSchema

function styleToCSS(styles: StyleProps): string {
  const entries = Object.entries(styles).filter(([, v]) => v !== undefined && v !== "")
  return entries.map(([k, v]) => `  ${camelToKebab(k)}: ${v};`).join("\n")
}

function camelToKebab(s: string): string {
  return s.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
}

function styleToInline(styles: StyleProps): string {
  const entries = Object.entries(styles).filter(([, v]) => v !== undefined && v !== "")
  return entries.map(([k, v]) => `${k}: "${v}"`).join(", ")
}

function generateComponentJSX(node: ComponentNode, depth = 0): string {
  const indent = "  ".repeat(depth)
  const styles = node.styles.desktop || {}
  const inlineStyle = Object.keys(styles).length > 0
    ? ` style={{ ${styleToInline(styles)} }}`
    : ""

  const props = node.props as Record<string, unknown>

  switch (node.type) {
    case "heading": {
      const tag = (props.level as string) || "h2"
      return `${indent}<${tag}${inlineStyle}>${props.text ?? "Heading"}</${tag}>`
    }
    case "paragraph":
      return `${indent}<p${inlineStyle}>${props.text ?? "Text"}</p>`
    case "button":
    case "cta-button":
      return `${indent}<a href="${props.href ?? "#"}"${inlineStyle}>${props.text ?? "Button"}</a>`
    case "image":
      return `${indent}<img src="${props.src ?? ""}" alt="${props.alt ?? ""}"${inlineStyle} />`
    case "hero":
      return generateHeroJSX(props, inlineStyle, indent, node.children, depth)
    case "spacer":
      return `${indent}<div${inlineStyle} />`
    case "divider":
      return `${indent}<hr${inlineStyle} />`
    default: {
      if (node.children.length > 0) {
        const tag = containerTag(node.type)
        const children = node.children.map((c) => generateComponentJSX(c, depth + 1)).join("\n")
        return `${indent}<${tag}${inlineStyle}>\n${children}\n${indent}</${tag}>`
      }
      return `${indent}<div data-component="${node.type}"${inlineStyle} />`
    }
  }
}

function containerTag(type: string): string {
  const map: Record<string, string> = {
    section: "section", footer: "footer", container: "div", flex: "div", grid: "div", stack: "div",
  }
  return map[type] ?? "div"
}

function generateHeroJSX(props: Record<string, unknown>, style: string, indent: string, children: ComponentNode[], depth: number): string {
  return `${indent}<section${style}>
${indent}  {/* Hero Section */}
${indent}  <h1 className="text-6xl font-extrabold">${props.heading ?? "Hero Heading"}</h1>
${indent}  <p className="text-xl text-gray-400 mt-4">${props.subheading ?? ""}</p>
${indent}  <a href="${props.ctaHref ?? "#"}" className="mt-8 inline-block px-8 py-4 rounded-full bg-blue-500 text-white font-bold">
${indent}    ${props.ctaText ?? "Get Started"}
${indent}  </a>
${children.map((c) => generateComponentJSX(c, depth + 1)).join("\n")}
${indent}</section>`
}

function generatePageComponent(page: PageSchema, projectName: string): string {
  const components = page.components.map((c) => generateComponentJSX(c, 2)).join("\n\n")
  return `import React from 'react'

export default function ${toPascalCase(page.name)}() {
  return (
    <main>
${components}
    </main>
  )
}
`
}

function toPascalCase(s: string): string {
  return s.replace(/(?:^|[\s_-])(\w)/g, (_, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "")
}

export interface ExportFile {
  path: string
  content: string
}

export function exportAsReact(project: Project): ExportFile[] {
  const files: ExportFile[] = []
  const name = project.name.toLowerCase().replace(/\s+/g, "-")

  // package.json
  files.push({
    path: "package.json",
    content: JSON.stringify({
      name,
      version: "0.1.0",
      private: true,
      scripts: { dev: "next dev", build: "next build", start: "next start" },
      dependencies: {
        "react": "^19.0.0",
        "react-dom": "^19.0.0",
        "next": "^16.0.0",
        "tailwindcss": "^4.0.0",
        "gsap": "^3.12.0",
      },
      devDependencies: {
        "typescript": "^5.0.0",
        "@types/react": "^19.0.0",
        "@types/node": "^20.0.0",
      },
    }, null, 2),
  })

  // tailwind.css
  files.push({
    path: "app/globals.css",
    content: `@import "tailwindcss";\n\n:root {\n  --background: #09090b;\n  --foreground: #fafafa;\n}\n\nbody {\n  background: var(--background);\n  color: var(--foreground);\n}\n`,
  })

  // Root layout
  files.push({
    path: "app/layout.tsx",
    content: `import type { Metadata } from 'next'\nimport './globals.css'\n\nexport const metadata: Metadata = {\n  title: '${project.name}',\n}\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  )\n}\n`,
  })

  // Pages
  for (const page of project.pages) {
    const isHome = page.slug === "/" || page.slug === ""
    const filePath = isHome ? "app/page.tsx" : `app${page.slug}/page.tsx`
    files.push({ path: filePath, content: generatePageComponent(page, project.name) })
  }

  // README
  files.push({
    path: "README.md",
    content: `# ${project.name}\n\nExported from VisualCraft.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`,
  })

  return files
}

export function exportAsHTML(project: Project): ExportFile[] {
  const files: ExportFile[] = []

  for (const page of project.pages) {
    const components = page.components.map((c) => componentToHTML(c)).join("\n")
    const isHome = page.slug === "/" || page.slug === ""
    const fileName = isHome ? "index.html" : `${page.slug.replace(/^\//, "")}.html`

    files.push({
      path: fileName,
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.metadata.title || project.name}</title>
  <meta name="description" content="${page.metadata.description || ""}" />
  <link rel="stylesheet" href="styles.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
</head>
<body>
${components}
<script src="animations.js" defer></script>
</body>
</html>`,
    })
  }

  // CSS
  files.push({ path: "styles.css", content: generateBaseCSS(project) })
  // Animations JS
  files.push({ path: "animations.js", content: generateAnimationsJS(project) })

  return files
}

function componentToHTML(node: ComponentNode, depth = 0): string {
  const indent = "  ".repeat(depth)
  const styles = node.styles.desktop || {}
  const styleAttr = Object.keys(styles).length > 0
    ? ` style="${Object.entries(styles).filter(([, v]) => v).map(([k, v]) => `${camelToKebab(k)}:${v}`).join(";")}"`
    : ""
  const dataAttr = ` data-animation-id="${node.id}"`
  const props = node.props as Record<string, unknown>

  switch (node.type) {
    case "heading": {
      const tag = (props.level as string) || "h2"
      return `${indent}<${tag}${styleAttr}${dataAttr}>${props.text ?? "Heading"}</${tag}>`
    }
    case "paragraph":
      return `${indent}<p${styleAttr}${dataAttr}>${props.text ?? ""}</p>`
    case "button":
    case "cta-button":
      return `${indent}<a href="${props.href ?? "#"}"${styleAttr}${dataAttr}>${props.text ?? "Button"}</a>`
    case "image":
      return `${indent}<img src="${props.src ?? ""}" alt="${props.alt ?? ""}"${styleAttr}${dataAttr} />`
    case "spacer":
      return `${indent}<div${styleAttr}></div>`
    case "divider":
      return `${indent}<hr${styleAttr} />`
    default: {
      const tag = containerTag(node.type)
      const children = node.children.length > 0
        ? `\n${node.children.map((c) => componentToHTML(c, depth + 1)).join("\n")}\n${indent}`
        : ""
      return `${indent}<${tag}${styleAttr}${dataAttr}>${children}</${tag}>`
    }
  }
}

function generateBaseCSS(project: Project): string {
  const tokens = project.designTokens
  return `/* VisualCraft Export — ${project.name} */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --color-primary: ${tokens.colors.primary[500]};
  --color-secondary: ${tokens.colors.secondary[500]};
  --color-background: ${tokens.colors.background};
  --color-foreground: ${tokens.colors.foreground};
  --font-sans: ${tokens.typography.fontFamilySans};
  --font-base: ${tokens.typography.baseFontSize};
  --radius-md: ${tokens.radii.md};
}
html { font-family: var(--font-sans); font-size: var(--font-base); }
body { background: var(--color-background); color: var(--color-foreground); }
img, video { max-width: 100%; height: auto; display: block; }
a { color: inherit; }
`
}

function generateAnimationsJS(project: Project): string {
  const allNodes: ComponentNode[] = []
  for (const page of project.pages) {
    collectNodes(page.components, allNodes)
  }

  const animCalls = allNodes
    .filter((n) => n.animations.length > 0)
    .map((n) => {
      const anim = n.animations[0]
      const el = `document.querySelector('[data-animation-id="${n.id}"]')`
      return generateGSAPCall(el, anim)
    })
    .filter(Boolean)
    .join("\n")

  return `/* VisualCraft — GSAP Animations */
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
${animCalls}
});
`
}

function collectNodes(nodes: ComponentNode[], out: ComponentNode[]): void {
  for (const n of nodes) {
    out.push(n)
    if (n.children.length) collectNodes(n.children, out)
  }
}

function generateGSAPCall(el: string, anim: { preset: string; duration: number; delay: number; ease: string; trigger: string; scrollStart?: string }): string {
  const presetMap: Record<string, string> = {
    fadeUp: `gsap.from(${el}, { opacity: 0, y: 40, duration: ${anim.duration}, delay: ${anim.delay}, ease: '${anim.ease}'`,
    fadeIn: `gsap.from(${el}, { opacity: 0, duration: ${anim.duration}, delay: ${anim.delay}, ease: '${anim.ease}'`,
    scaleIn: `gsap.from(${el}, { opacity: 0, scale: 0.8, duration: ${anim.duration}, delay: ${anim.delay}, ease: '${anim.ease}'`,
  }

  const base = presetMap[anim.preset] || presetMap.fadeUp
  if (anim.trigger === "onScroll") {
    return `  ${base}, scrollTrigger: { trigger: ${el}, start: '${anim.scrollStart ?? "top 80%"}' }});`
  }
  return `  ${base}});`
}
