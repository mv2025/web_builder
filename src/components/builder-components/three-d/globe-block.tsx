"use client"

import { useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

extend({ Line_: THREE.Line })

interface GlobeBlockProps {
  color?: string
  autoRotate?: boolean
  showDots?: boolean
  rotateSpeed?: number
  dotSize?: number
  dotOpacity?: number
  lineOpacity?: number
  showLines?: boolean
  enableZoom?: boolean
  secondaryColor?: string
  bgColor?: string
  lightAngleX?: number
  lightAngleY?: number
  lightIntensity?: number
  ambientIntensity?: number
  lightColor?: string
  mouseParallax?: boolean
  mouseIntensity?: number
  cameraFov?: number
  cameraZoom?: number
  globeOpacity?: number
  globeMetalness?: number
  globeRoughness?: number
  dotCount?: number
  glowColor?: string
  glowIntensity?: number
  [key: string]: unknown
}

function MouseParallaxRig({ intensity = 1, mouse }: { intensity: number; mouse: React.RefObject<{ x: number; y: number } | null> }) {
  const { camera } = useThree()
  useFrame(() => {
    if (!mouse.current) return
    camera.position.x += (mouse.current.x * intensity * 2 - camera.position.x) * 0.05
    camera.position.y += (mouse.current.y * intensity * 2 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

function GlobeMesh({ color = "#0ea5e9", autoRotate = true, showDots = true, rotateSpeed = 0.15, dotSize = 0.02, dotOpacity = 0.6, lineOpacity = 0.2, showLines = true, globeOpacity = 0.15, globeMetalness = 0.3, globeRoughness = 0.5, dotCount = 2000, glowColor, glowIntensity = 0 }: {
  color?: string; autoRotate?: boolean; showDots?: boolean; rotateSpeed?: number; dotSize?: number; dotOpacity?: number; lineOpacity?: number; showLines?: boolean
  globeOpacity?: number; globeMetalness?: number; globeRoughness?: number; dotCount?: number; glowColor?: string; glowIntensity?: number
}) {
  const globeRef = useRef<THREE.Group>(null)
  const dotsRef = useRef<THREE.Points>(null)

  const dotPositions = useMemo(() => {
    const positions: number[] = []
    const count = Math.max(100, Math.min(5000, dotCount))
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      const r = 1.52
      positions.push(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      )
    }
    return new Float32Array(positions)
  }, [dotCount])

  const latLineObjects = useMemo(() => {
    const lines: THREE.Line[] = []
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: lineOpacity })
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = []
      const phi = (90 - lat) * (Math.PI / 180)
      for (let lng = 0; lng <= 360; lng += 5) {
        const theta = lng * (Math.PI / 180)
        points.push(new THREE.Vector3(
          1.5 * Math.sin(phi) * Math.cos(theta),
          1.5 * Math.cos(phi),
          1.5 * Math.sin(phi) * Math.sin(theta)
        ))
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      lines.push(new THREE.Line(geom, mat))
    }
    for (let lng = 0; lng < 360; lng += 30) {
      const points: THREE.Vector3[] = []
      const theta = lng * (Math.PI / 180)
      for (let lat = -90; lat <= 90; lat += 5) {
        const phi = (90 - lat) * (Math.PI / 180)
        points.push(new THREE.Vector3(
          1.5 * Math.sin(phi) * Math.cos(theta),
          1.5 * Math.cos(phi),
          1.5 * Math.sin(phi) * Math.sin(theta)
        ))
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      lines.push(new THREE.Line(geom, mat))
    }
    return lines
  }, [color, lineOpacity])

  useFrame((_, delta) => {
    if (!globeRef.current || !autoRotate) return
    globeRef.current.rotation.y += delta * rotateSpeed
  })

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1.48, 64, 64]} />
        <meshStandardMaterial color={color} transparent opacity={globeOpacity} roughness={globeRoughness} metalness={globeMetalness}
          emissive={glowColor || color} emissiveIntensity={glowIntensity} />
      </mesh>
      {showLines && latLineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
      {showDots && (
        <points ref={dotsRef}>
          <bufferGeometry>
            <bufferAttribute args={[dotPositions, 3]} attach="attributes-position" />
          </bufferGeometry>
          <pointsMaterial color={color} size={dotSize} transparent opacity={dotOpacity} sizeAttenuation />
        </points>
      )}
    </group>
  )
}

export function GlobeBlock({
  color = "#0ea5e9", autoRotate = true, showDots = true,
  rotateSpeed = 0.15, dotSize = 0.02, dotOpacity = 0.6,
  lineOpacity = 0.2, showLines = true, enableZoom = false,
  secondaryColor, bgColor,
  lightAngleX = 5, lightAngleY = 3, lightIntensity = 0.8, ambientIntensity = 0.6,
  lightColor, mouseParallax = false, mouseIntensity = 1,
  cameraFov = 45, cameraZoom = 4.5,
  globeOpacity = 0.15, globeMetalness = 0.3, globeRoughness = 0.5,
  dotCount = 2000, glowColor, glowIntensity = 0,
}: GlobeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
  }, [])

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ width: "100%", height: "100%", position: "relative", background: bgColor ? String(bgColor) : "transparent" }}>
      <Canvas camera={{ position: [0, 0, Number(cameraZoom)], fov: Number(cameraFov) }} style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        {Boolean(mouseParallax) && <MouseParallaxRig intensity={Number(mouseIntensity)} mouse={mouse} />}
        <ambientLight intensity={Number(ambientIntensity)} />
        <directionalLight position={[Number(lightAngleX), Number(lightAngleY), 5]} intensity={Number(lightIntensity)} color={lightColor ? String(lightColor) : "#ffffff"} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color={secondaryColor ? String(secondaryColor) : "#6366f1"} />
        <GlobeMesh color={String(color)} autoRotate={Boolean(autoRotate)} showDots={Boolean(showDots)}
          rotateSpeed={Number(rotateSpeed)} dotSize={Number(dotSize)} dotOpacity={Number(dotOpacity)}
          lineOpacity={Number(lineOpacity)} showLines={Boolean(showLines)}
          globeOpacity={Number(globeOpacity)} globeMetalness={Number(globeMetalness)} globeRoughness={Number(globeRoughness)}
          dotCount={Number(dotCount)} glowColor={glowColor ? String(glowColor) : undefined} glowIntensity={Number(glowIntensity)} />
        <OrbitControls enableZoom={Boolean(enableZoom)} enablePan={false} />
      </Canvas>
    </div>
  )
}
