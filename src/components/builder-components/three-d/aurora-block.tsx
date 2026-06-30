"use client"

import { useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface AuroraBlockProps {
  color1?: string
  color2?: string
  color3?: string
  speed?: number
  ribbonCount?: number
  opacity?: number
  lightIntensity?: number
  ambientIntensity?: number
  mouseParallax?: boolean
  mouseIntensity?: number
  bgColor?: string
  waveAmplitude?: number
  [key: string]: unknown
}

function MouseRig({ intensity = 1, mouse }: { intensity: number; mouse: React.RefObject<{ x: number; y: number } | null> }) {
  const { camera } = useThree()
  useFrame(() => {
    if (!mouse.current) return
    camera.position.x += (mouse.current.x * intensity * 1.5 - camera.position.x) * 0.03
    camera.position.y += (mouse.current.y * intensity * 0.5 - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })
  return null
}

function AuroraRibbon({ color, yOffset, speed, opacity, waveAmplitude, index }: {
  color: string; yOffset: number; speed: number; opacity: number; waveAmplitude: number; index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => new THREE.PlaneGeometry(10, 2, 80, 1), [])
  const phase = index * 1.3

  useFrame((state) => {
    if (!meshRef.current) return
    const pos = geo.attributes.position
    const t = state.clock.elapsedTime * speed + phase
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const baseY = pos.getY(i)
      pos.setZ(i, Math.sin(x * 1.5 + t) * waveAmplitude + Math.sin(x * 0.7 + t * 0.6) * waveAmplitude * 0.6)
      pos.setY(i, baseY + Math.sin(x * 0.5 + t * 0.4) * waveAmplitude * 0.3)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} position={[0, yOffset, -2 - index * 0.5]} geometry={geo}>
      <meshStandardMaterial
        color={color} transparent opacity={opacity} side={THREE.DoubleSide}
        emissive={color} emissiveIntensity={0.5} roughness={0.8} metalness={0.1}
      />
    </mesh>
  )
}

export function AuroraBlock({
  color1 = "#22d3ee", color2 = "#8b5cf6", color3 = "#34d399",
  speed = 0.8, ribbonCount = 5, opacity = 0.35,
  lightIntensity = 0.6, ambientIntensity = 0.3,
  mouseParallax = false, mouseIntensity = 1, bgColor, waveAmplitude = 0.8,
}: AuroraBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    mouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2
    mouse.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2
  }, [])

  const colors = [String(color1), String(color2), String(color3)]
  const count = Math.max(1, Math.min(10, Number(ribbonCount)))

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ width: "100%", height: "100%", position: "relative", background: bgColor ? String(bgColor) : "transparent" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        {Boolean(mouseParallax) && <MouseRig intensity={Number(mouseIntensity)} mouse={mouse} />}
        <ambientLight intensity={Number(ambientIntensity)} />
        <directionalLight position={[0, 5, 5]} intensity={Number(lightIntensity)} />
        {Array.from({ length: count }, (_, i) => (
          <AuroraRibbon key={i} index={i} color={colors[i % colors.length]}
            yOffset={(i - count / 2) * 0.6} speed={Number(speed)}
            opacity={Number(opacity)} waveAmplitude={Number(waveAmplitude)} />
        ))}
      </Canvas>
    </div>
  )
}
