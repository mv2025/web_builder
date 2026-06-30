"use client"

import { useRef, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

interface GlassLayersBlockProps {
  color1?: string
  color2?: string
  color3?: string
  layerCount?: number
  gap?: number
  rotateX?: number
  rotateY?: number
  speed?: number
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
    camera.position.x += (mouse.current.x * intensity * 2 - camera.position.x) * 0.04
    camera.position.y += (mouse.current.y * intensity * 2 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

function GlassPanel({ color, position, rotation, opacity, metalness, roughness, index, speed }: {
  color: string; position: [number, number, number]; rotation: [number, number, number]; opacity: number; metalness: number; roughness: number; index: number; speed: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + index * 0.8) * 0.15
  })

  return (
    <Float speed={speed} rotationIntensity={0.05} floatIntensity={0.2}>
      <mesh ref={ref} position={position} rotation={rotation} castShadow>
        <planeGeometry args={[3, 2]} />
        <meshPhysicalMaterial
          color={color} transparent opacity={opacity} metalness={metalness} roughness={roughness}
          side={THREE.DoubleSide} clearcoat={1} clearcoatRoughness={0.1}
          transmission={0.2} thickness={0.5}
        />
      </mesh>
    </Float>
  )
}

export function GlassLayersBlock({
  color1 = "#6366f1", color2 = "#0ea5e9", color3 = "#ec4899",
  layerCount = 5, gap = 0.6, rotateX = -15, rotateY = 25, speed = 1,
  opacity = 0.4, metalness = 0.1, roughness = 0.05,
  lightAngleX = 5, lightAngleY = 5, lightIntensity = 1, ambientIntensity = 0.5,
  mouseParallax = false, mouseIntensity = 1, bgColor,
}: GlassLayersBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    mouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2
    mouse.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2
  }, [])

  const count = Math.max(2, Math.min(10, Number(layerCount)))
  const colors = [String(color1), String(color2), String(color3)]
  const rxRad = (Number(rotateX) * Math.PI) / 180
  const ryRad = (Number(rotateY) * Math.PI) / 180

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ width: "100%", height: "100%", position: "relative", background: bgColor ? String(bgColor) : "transparent" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} shadows style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        {Boolean(mouseParallax) && <MouseRig intensity={Number(mouseIntensity)} mouse={mouse} />}
        <ambientLight intensity={Number(ambientIntensity)} />
        <directionalLight position={[Number(lightAngleX), Number(lightAngleY), 5]} intensity={Number(lightIntensity)} castShadow />
        <pointLight position={[-3, 2, 3]} intensity={0.3} color={String(color3)} />
        {Array.from({ length: count }, (_, i) => {
          const z = (i - count / 2) * Number(gap)
          return (
            <GlassPanel key={i} index={i} color={colors[i % colors.length]}
              position={[0, 0, z]} rotation={[rxRad, ryRad, 0]}
              opacity={Number(opacity)} metalness={Number(metalness)} roughness={Number(roughness)} speed={Number(speed)} />
          )
        })}
      </Canvas>
    </div>
  )
}
