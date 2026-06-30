"use client"

import { useRef, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface TubeRingBlockProps {
  color?: string
  secondaryColor?: string
  wireframe?: boolean
  speed?: number
  tubeRadius?: number
  ringRadius?: number
  metalness?: number
  roughness?: number
  distort?: number
  emissive?: string
  emissiveIntensity?: number
  lightAngleX?: number
  lightAngleY?: number
  lightIntensity?: number
  ambientIntensity?: number
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

function AnimatedRing({ color = "#6366f1", wireframe = false, speed = 1, tubeRadius = 0.35, ringRadius = 1.5, metalness = 0.7, roughness = 0.15, distort = 0.2, emissive, emissiveIntensity = 0.3 }: {
  color?: string; wireframe?: boolean; speed?: number; tubeRadius?: number; ringRadius?: number; metalness?: number; roughness?: number; distort?: number; emissive?: string; emissiveIntensity?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.4
    ref.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.2
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[ringRadius, tubeRadius, 48, 100]} />
      {distort > 0 ? (
        <MeshDistortMaterial color={color} wireframe={wireframe} metalness={metalness} roughness={roughness}
          distort={distort} speed={speed * 2} emissive={emissive || color} emissiveIntensity={emissiveIntensity} />
      ) : (
        <meshStandardMaterial color={color} wireframe={wireframe} metalness={metalness} roughness={roughness}
          emissive={emissive || color} emissiveIntensity={emissiveIntensity} />
      )}
    </mesh>
  )
}

export function TubeRingBlock({
  color = "#6366f1", secondaryColor, wireframe = false, speed = 1,
  tubeRadius = 0.35, ringRadius = 1.5, metalness = 0.7, roughness = 0.15, distort = 0.2,
  emissive, emissiveIntensity = 0.3,
  lightAngleX = 5, lightAngleY = 5, lightIntensity = 1, ambientIntensity = 0.4,
  mouseParallax = false, mouseIntensity = 1, autoRotate = false, enableZoom = false, bgColor,
}: TubeRingBlockProps) {
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
        <AnimatedRing color={String(color)} wireframe={Boolean(wireframe)} speed={Number(speed)}
          tubeRadius={Number(tubeRadius)} ringRadius={Number(ringRadius)}
          metalness={Number(metalness)} roughness={Number(roughness)} distort={Number(distort)}
          emissive={emissive ? String(emissive) : undefined} emissiveIntensity={Number(emissiveIntensity)} />
        <OrbitControls enableZoom={Boolean(enableZoom)} enablePan={false} autoRotate={Boolean(autoRotate)} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
