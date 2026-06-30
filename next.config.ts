import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Silence Node.js modules that Three.js may reference in browser bundles
      fs: { browser: "./src/lib/empty.ts" },
      path: { browser: "./src/lib/empty.ts" },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dialog"],
  },
}

export default nextConfig
