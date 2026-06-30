"use client"

import { useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import * as THREE from "three"

extend({ Line_: THREE.Line })

interface PerspectiveGridBlockProps {
  color?: string
  dotColor?: string
  lineOpacity?: number
  dotSize?: number
  gridSize?: number
  speed?: number
  waveHeight?: number
  showDots?: boolean
  showLines?: boolean
  lightIntensity?: number
  ambientIntensity?: number
  mouseParallax?: boolean
  mouseIntensity?: number
  bgColor?: string
  glowColor?: string
  glowIntensity?: number
  [key: string]: unknown
}

function MouseRig({ intensity = 1, mouse }: { intensity: number; mouse: React.RefObject<{ x: number; y: number } | null> }) {
  const { camera } = useThree()
  useFrame(() => {
    if (!mouse.current) return
    camera.position.x += (mouse.current.x * intensity * 1.5 - camera.position.x) * 0.03
    camera.position.y += (3 + mouse.current.y * intensity * 0.5 - camera.position.y) * 0.03
    camera.lookAt(0, -0.5, 0)
  })
  return null
}

function GridLines({ color = "#0ea5e9", lineOpacity = 0.3, gridSize = 20, speed = 0.5, waveHeight = 0.3 }: {
  color?: string; lineOpacity?: number; gridSize?: number; speed?: number; waveHeight?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const lineObjects = useMemo(() => {
    const lines: THREE.Line[] = []
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: lineOpacity })
    const half = gridSize / 2
    for (let i = -half; i <= half; i++) {
      const pts = [new THREE.Vector3(i, 0, -half), new THREE.Vector3(i, 0, half)]
      lines.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat))
      const pts2 = [new THREE.Vector3(-half, 0, i), new THREE.Vector3(half, 0, i)]
      lines.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), mat))
    }
    return lines
  }, [color, lineOpacity, gridSize])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime * speed
    groupRef.current.children.forEach((child) => {
      const line = child as THREE.Line
      const pos = line.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const z = pos.getZ(i)
        pos.setY(i, Math.sin(x * 0.5 + t) * waveHeight * 0.5 + Math.cos(z * 0.5 + t * 0.7) * waveHeight * 0.5)
      }
      pos.needsUpdate = true
    })
  })

  return (
    <group ref={groupRef}>
      {lineObjects.map((obj, i) => <primitive key={i} object={obj} />)}
    </group>
  )
}

function GridDots({ dotColor = "#0ea5e9", dotSize = 0.05, gridSize = 20, speed = 0.5, waveHeight = 0.3, glowColor, glowIntensity = 0 }: {
  dotColor?: string; dotSize?: number; gridSize?: number; speed?: number; waveHeight?: number; glowColor?: string; glowIntensity?: number
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr: number[] = []
    const half = gridSize / 2
    for (let x = -half; x <= half; x++) {
      for (let z = -half; z <= half; z++) {
        arr.push(x, 0, z)
      }
    }
    return new Float32Array(arr)
  }, [gridSize])

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position
    const t = state.clock.elapsedTime * speed
    const half = gridSize / 2
    let idx = 0
    for (let x = -half; x <= half; x++) {
      for (let z = -half; z <= half; z++) {
        pos.setY(idx, Math.sin(x * 0.5 + t) * waveHeight * 0.5 + Math.cos(z * 0.5 + t * 0.7) * waveHeight * 0.5)
        idx++
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        color={glowColor || dotColor} size={dotSize} transparent opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

export function PerspectiveGridBlock({
  color = "#0ea5e9", dotColor, lineOpacity = 0.3, dotSize = 0.05,
  gridSize = 20, speed = 0.5, waveHeight = 0.3,
  showDots = true, showLines = true,
  lightIntensity = 0.5, ambientIntensity = 0.3,
  mouseParallax = true, mouseIntensity = 1, bgColor,
  glowColor, glowIntensity = 0,
}: PerspectiveGridBlockProps) {
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
      <Canvas camera={{ position: [0, 3, 8], fov: 55 }} style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        {Boolean(mouseParallax) && <MouseRig intensity={Number(mouseIntensity)} mouse={mouse} />}
        <ambientLight intensity={Number(ambientIntensity)} />
        <directionalLight position={[0, 5, 5]} intensity={Number(lightIntensity)} />
        {Boolean(showLines) && <GridLines color={String(color)} lineOpacity={Number(lineOpacity)} gridSize={Number(gridSize)} speed={Number(speed)} waveHeight={Number(waveHeight)} />}
        {Boolean(showDots) && <GridDots dotColor={dotColor ? String(dotColor) : String(color)} dotSize={Number(dotSize)} gridSize={Number(gridSize)} speed={Number(speed)} waveHeight={Number(waveHeight)} glowColor={glowColor ? String(glowColor) : undefined} glowIntensity={Number(glowIntensity)} />}
      </Canvas>
    </div>
  )
}
