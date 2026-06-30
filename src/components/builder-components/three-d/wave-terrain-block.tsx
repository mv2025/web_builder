"use client"

import { useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

interface WaveTerrainBlockProps {
  color?: string
  wireframe?: boolean
  speed?: number
  waveHeight?: number
  waveFrequency?: number
  metalness?: number
  roughness?: number
  opacity?: number
  gridSize?: number
  lightAngleX?: number
  lightAngleY?: number
  lightIntensity?: number
  ambientIntensity?: number
  lightColor?: string
  mouseParallax?: boolean
  mouseIntensity?: number
  bgColor?: string
  secondaryColor?: string
  enableZoom?: boolean
  [key: string]: unknown
}

function MouseRig({ intensity = 1, mouse }: { intensity: number; mouse: React.RefObject<{ x: number; y: number } | null> }) {
  const { camera } = useThree()
  useFrame(() => {
    if (!mouse.current) return
    camera.position.x += (mouse.current.x * intensity * 2 - camera.position.x) * 0.04
    camera.position.y += (3 + mouse.current.y * intensity - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Terrain({ color = "#0ea5e9", wireframe = false, speed = 1, waveHeight = 0.5, waveFrequency = 3, metalness = 0.4, roughness = 0.3, opacity = 0.9, gridSize = 80 }: {
  color?: string; wireframe?: boolean; speed?: number; waveHeight?: number; waveFrequency?: number; metalness?: number; roughness?: number; opacity?: number; gridSize?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => new THREE.PlaneGeometry(8, 8, gridSize, gridSize), [gridSize])

  useFrame((state) => {
    if (!meshRef.current) return
    const pos = geo.attributes.position
    const t = state.clock.elapsedTime * speed
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, Math.sin(x * waveFrequency + t) * waveHeight * 0.5 + Math.cos(y * waveFrequency + t * 0.7) * waveHeight * 0.5)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} geometry={geo}>
      <meshStandardMaterial
        color={color} wireframe={wireframe} metalness={metalness} roughness={roughness}
        transparent opacity={opacity} side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function WaveTerrainBlock({
  color = "#0ea5e9", wireframe = false, speed = 1, waveHeight = 0.5, waveFrequency = 3,
  metalness = 0.4, roughness = 0.3, opacity = 0.9, gridSize = 80,
  lightAngleX = 2, lightAngleY = 5, lightIntensity = 1, ambientIntensity = 0.4,
  lightColor, mouseParallax = false, mouseIntensity = 1, bgColor, secondaryColor,
  enableZoom = false,
}: WaveTerrainBlockProps) {
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
      <Canvas camera={{ position: [0, 3, 5], fov: 50 }} style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        {Boolean(mouseParallax) && <MouseRig intensity={Number(mouseIntensity)} mouse={mouse} />}
        <ambientLight intensity={Number(ambientIntensity)} />
        <directionalLight position={[Number(lightAngleX), Number(lightAngleY), 5]} intensity={Number(lightIntensity)} color={lightColor ? String(lightColor) : "#ffffff"} />
        <pointLight position={[-3, 2, -3]} intensity={0.4} color={secondaryColor ? String(secondaryColor) : "#6366f1"} />
        <Terrain color={String(color)} wireframe={Boolean(wireframe)} speed={Number(speed)} waveHeight={Number(waveHeight)}
          waveFrequency={Number(waveFrequency)} metalness={Number(metalness)} roughness={Number(roughness)}
          opacity={Number(opacity)} gridSize={Number(gridSize)} />
        <OrbitControls enableZoom={Boolean(enableZoom)} enablePan={false} />
      </Canvas>
    </div>
  )
}
