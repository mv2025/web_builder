"use client"

import { useRef, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface GradientBlobBlockProps {
  color1?: string
  color2?: string
  speed?: number
  distort?: number
  scale?: number
  opacity?: number
  metalness?: number
  roughness?: number
  lightAngleX?: number
  lightAngleY?: number
  lightIntensity?: number
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
    camera.position.x += (mouse.current.x * intensity * 1.5 - camera.position.x) * 0.04
    camera.position.y += (mouse.current.y * intensity * 1.5 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Blob({ color1 = "#6366f1", color2 = "#ec4899", speed = 2, distort = 0.4, blobScale = 2.2, opacity = 0.9, metalness = 0.3, roughness = 0.2 }: {
  color1?: string; color2?: string; speed?: number; distort?: number; blobScale?: number; opacity?: number; metalness?: number; roughness?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.15
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })

  return (
    <>
      <mesh ref={ref} scale={blobScale}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color={color1}
          distort={distort}
          speed={speed}
          roughness={roughness}
          metalness={metalness}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh scale={blobScale * 0.85}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color={color2}
          distort={distort * 1.2}
          speed={speed * 0.8}
          roughness={roughness}
          metalness={metalness}
          transparent
          opacity={opacity * 0.6}
        />
      </mesh>
    </>
  )
}

export function GradientBlobBlock({
  color1 = "#6366f1", color2 = "#ec4899", speed = 2, distort = 0.4,
  scale = 2.2, opacity = 0.9, metalness = 0.3, roughness = 0.2,
  lightAngleX = 5, lightAngleY = 5, lightIntensity = 1, ambientIntensity = 0.5,
  mouseParallax = false, mouseIntensity = 1, bgColor,
}: GradientBlobBlockProps) {
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
        <pointLight position={[-4, -4, 4]} intensity={0.4} color={String(color2)} />
        <Blob color1={String(color1)} color2={String(color2)} speed={Number(speed)} distort={Number(distort)}
          blobScale={Number(scale)} opacity={Number(opacity)} metalness={Number(metalness)} roughness={Number(roughness)} />
      </Canvas>
    </div>
  )
}
