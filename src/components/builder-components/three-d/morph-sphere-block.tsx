"use client"

import { useRef, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

interface MorphSphereBlockProps {
  color?: string
  speed?: number
  noiseScale?: number
  noiseStrength?: number
  metalness?: number
  roughness?: number
  wireframe?: boolean
  emissive?: string
  emissiveIntensity?: number
  lightAngleX?: number
  lightAngleY?: number
  lightIntensity?: number
  ambientIntensity?: number
  secondaryColor?: string
  mouseParallax?: boolean
  mouseIntensity?: number
  autoRotate?: boolean
  enableZoom?: boolean
  bgColor?: string
  [key: string]: unknown
}

function MouseRig({ intensity = 1, mouse }: { intensity: number; mouse: React.RefObject<{ x: number; y: number } | null> }) {
  const { camera } = useThree()
  useFrame(() => {
    if (!mouse.current) return
    camera.position.x += (mouse.current.x * intensity * 2 - camera.position.x) * 0.04
    camera.position.y += (mouse.current.y * intensity * 2 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

function NoiseSphere({ color = "#6366f1", speed = 1, noiseScale = 1.5, noiseStrength = 0.3, metalness = 0.6, roughness = 0.2, wireframe = false, emissive, emissiveIntensity = 0 }: {
  color?: string; speed?: number; noiseScale?: number; noiseStrength?: number; metalness?: number; roughness?: number; wireframe?: boolean; emissive?: string; emissiveIntensity?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const originalPositions = useRef<Float32Array | null>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const geo = meshRef.current.geometry
    const pos = geo.attributes.position

    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(pos.array)
    }

    const t = state.clock.elapsedTime * speed
    const orig = originalPositions.current

    for (let i = 0; i < pos.count; i++) {
      const ox = orig[i * 3]
      const oy = orig[i * 3 + 1]
      const oz = orig[i * 3 + 2]

      const noise = Math.sin(ox * noiseScale + t) * Math.cos(oy * noiseScale + t * 0.7) * Math.sin(oz * noiseScale + t * 0.5)
      const displacement = 1 + noise * noiseStrength

      pos.setXYZ(i, ox * displacement, oy * displacement, oz * displacement)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color={color} wireframe={wireframe} metalness={metalness} roughness={roughness}
        emissive={emissive || "#000000"} emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}

export function MorphSphereBlock({
  color = "#6366f1", speed = 1, noiseScale = 1.5, noiseStrength = 0.3,
  metalness = 0.6, roughness = 0.2, wireframe = false,
  emissive, emissiveIntensity = 0,
  lightAngleX = 5, lightAngleY = 5, lightIntensity = 1, ambientIntensity = 0.5,
  secondaryColor, mouseParallax = false, mouseIntensity = 1,
  autoRotate = true, enableZoom = false, bgColor,
}: MorphSphereBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    mouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2
    mouse.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2
  }, [])

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ width: "100%", height: "100%", position: "relative", background: bgColor ? String(bgColor) : "transparent" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        {Boolean(mouseParallax) && <MouseRig intensity={Number(mouseIntensity)} mouse={mouse} />}
        <ambientLight intensity={Number(ambientIntensity)} />
        <directionalLight position={[Number(lightAngleX), Number(lightAngleY), 5]} intensity={Number(lightIntensity)} />
        <pointLight position={[-4, -2, 3]} intensity={0.4} color={secondaryColor ? String(secondaryColor) : "#ec4899"} />
        <NoiseSphere color={String(color)} speed={Number(speed)} noiseScale={Number(noiseScale)} noiseStrength={Number(noiseStrength)}
          metalness={Number(metalness)} roughness={Number(roughness)} wireframe={Boolean(wireframe)}
          emissive={emissive ? String(emissive) : undefined} emissiveIntensity={Number(emissiveIntensity)} />
        <OrbitControls enableZoom={Boolean(enableZoom)} enablePan={false} autoRotate={Boolean(autoRotate)} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
