"use client"

import { useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import * as THREE from "three"

extend({ Line_: THREE.Line })

interface LightTrailsBlockProps {
  color1?: string
  color2?: string
  color3?: string
  trailCount?: number
  speed?: number
  trailLength?: number
  spread?: number
  glowIntensity?: number
  ambientIntensity?: number
  mouseParallax?: boolean
  mouseIntensity?: number
  bgColor?: string
  [key: string]: unknown
}

function MouseRig({ intensity = 1, mouse }: { intensity: number; mouse: React.RefObject<{ x: number; y: number } | null> }) {
  const { camera } = useThree()
  useFrame(() => {
    if (!mouse.current) return
    camera.position.x += (mouse.current.x * intensity * 2 - camera.position.x) * 0.03
    camera.position.y += (mouse.current.y * intensity * 1 - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Trail({ color, index, speed, trailLength, spread }: {
  color: string; index: number; speed: number; trailLength: number; spread: number
}) {
  const tubeRef = useRef<THREE.Mesh>(null)
  const phase = index * 2.1

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segs = 80
    for (let i = 0; i <= segs; i++) {
      const t = (i / segs) * Math.PI * 2 * trailLength
      const r = spread * (0.5 + Math.sin(t * 0.3 + phase) * 0.4)
      points.push(new THREE.Vector3(
        Math.cos(t + phase) * r,
        Math.sin(t * 0.5 + phase * 0.7) * spread * 0.5,
        Math.sin(t + phase) * r
      ))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [phase, trailLength, spread])

  const geo = useMemo(() => new THREE.TubeGeometry(curve, 100, 0.04, 8, false), [curve])

  useFrame((state) => {
    if (!tubeRef.current) return
    tubeRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2 + phase
    tubeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.15 + phase) * 0.2
  })

  return (
    <mesh ref={tubeRef} geometry={geo}>
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={1.5}
        transparent opacity={0.8} roughness={0.3} metalness={0.5}
      />
    </mesh>
  )
}

export function LightTrailsBlock({
  color1 = "#0ea5e9", color2 = "#8b5cf6", color3 = "#ec4899",
  trailCount = 6, speed = 1, trailLength = 1.5, spread = 2, glowIntensity = 0.5,
  ambientIntensity = 0.2, mouseParallax = true, mouseIntensity = 1, bgColor,
}: LightTrailsBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    mouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2
    mouse.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2
  }, [])

  const colors = [String(color1), String(color2), String(color3)]
  const count = Math.max(1, Math.min(12, Number(trailCount)))

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ width: "100%", height: "100%", position: "relative", background: bgColor ? String(bgColor) : "transparent" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        {Boolean(mouseParallax) && <MouseRig intensity={Number(mouseIntensity)} mouse={mouse} />}
        <ambientLight intensity={Number(ambientIntensity)} />
        <pointLight position={[0, 0, 0]} intensity={Number(glowIntensity)} color={String(color1)} />
        {Array.from({ length: count }, (_, i) => (
          <Trail key={i} index={i} color={colors[i % colors.length]}
            speed={Number(speed)} trailLength={Number(trailLength)} spread={Number(spread)} />
        ))}
      </Canvas>
    </div>
  )
}
