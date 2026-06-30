"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ParticleSystemBlockProps {
  count?: number
  color?: string
  size?: number
  speed?: number
  [key: string]: unknown
}

function Particles({ count = 300, color = "#0ea5e9", size = 0.05, speed = 0.3 }: { count?: number; color?: string; size?: number; speed?: number }) {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }
    return { positions, velocities }
  }, [count])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * speed * 0.1
    meshRef.current.rotation.x += delta * speed * 0.05
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

export function ParticleSystemBlock({ count = 300, color = "#0ea5e9", size = 0.05, speed = 0.3 }: ParticleSystemBlockProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        <ambientLight intensity={0.5} />
        <Particles count={Number(count)} color={String(color)} size={Number(size)} speed={Number(speed)} />
      </Canvas>
    </div>
  )
}
