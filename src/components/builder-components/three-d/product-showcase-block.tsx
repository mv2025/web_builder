"use client"

import { useRef, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Float, Environment } from "@react-three/drei"
import * as THREE from "three"

interface ProductShowcaseBlockProps {
  modelUrl?: string
  color?: string
  accentColor?: string
  metalness?: number
  roughness?: number
  clearcoat?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  enableZoom?: boolean
  environment?: string
  bgColor?: string
  lightAngleX?: number
  lightAngleY?: number
  lightIntensity?: number
  ambientIntensity?: number
  lightColor?: string
  secondaryLightColor?: string
  castShadows?: boolean
  mouseParallax?: boolean
  mouseIntensity?: number
  cameraFov?: number
  cameraZoom?: number
  floatSpeed?: number
  floatIntensity?: number
  productScale?: number
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

function ProductPlaceholder({ color = "#0ea5e9", accentColor = "#333", metalness = 0.9, roughness = 0.05, clearcoat = 1, castShadows = false, floatSpeed = 1.5, floatIntensity = 0.8, productScale = 1 }: {
  color: string; accentColor?: string; metalness?: number; roughness?: number; clearcoat?: number; castShadows?: boolean; floatSpeed?: number; floatIntensity?: number; productScale?: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.3
  })

  return (
    <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={floatIntensity}>
      <group ref={groupRef} scale={productScale}>
        <mesh position={[0, 0, 0]} castShadow={castShadows} receiveShadow={castShadows}>
          <boxGeometry args={[1.8, 2.4, 0.9]} />
          <meshPhysicalMaterial
            color={color}
            roughness={roughness}
            metalness={metalness}
            clearcoat={clearcoat}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.15, 0.451]}>
          <boxGeometry args={[1.5, 1.8, 0.01]} />
          <meshStandardMaterial color="#111" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.9, 0.451]}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, -1.5, 0]} castShadow={castShadows}>
          <cylinderGeometry args={[0.8, 1, 0.15, 32]} />
          <meshPhysicalMaterial color={color} roughness={roughness} metalness={metalness} clearcoat={clearcoat * 0.5} />
        </mesh>
        <mesh position={[0, -1.35, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
        </mesh>
      </group>
    </Float>
  )
}

const ENV_PRESETS = ["studio", "apartment", "city", "dawn", "forest", "lobby", "night", "park", "sunset", "warehouse"] as const
type EnvPreset = typeof ENV_PRESETS[number]

export function ProductShowcaseBlock({
  color = "#0ea5e9", accentColor = "#333", metalness = 0.9, roughness = 0.05, clearcoat = 1,
  autoRotate = true, autoRotateSpeed = 0.5, enableZoom = false,
  environment = "studio", bgColor,
  lightAngleX = 5, lightAngleY = 5, lightIntensity = 1, ambientIntensity = 0.4,
  lightColor, secondaryLightColor, castShadows = true,
  mouseParallax = false, mouseIntensity = 1,
  cameraFov = 45, cameraZoom = 5.5,
  floatSpeed = 1.5, floatIntensity = 0.8, productScale = 1,
}: ProductShowcaseBlockProps) {
  const envPreset = ENV_PRESETS.includes(String(environment) as EnvPreset) ? (String(environment) as EnvPreset) : "studio"
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
      <Canvas camera={{ position: [0, 0, Number(cameraZoom)], fov: Number(cameraFov) }} shadows={Boolean(castShadows)} style={{ background: "transparent", position: "relative", zIndex: -1 }}>
        {Boolean(mouseParallax) && <MouseParallaxRig intensity={Number(mouseIntensity)} mouse={mouse} />}
        <ambientLight intensity={Number(ambientIntensity)} />
        <directionalLight position={[Number(lightAngleX), Number(lightAngleY), 5]} intensity={Number(lightIntensity)} color={lightColor ? String(lightColor) : "#ffffff"} castShadow={Boolean(castShadows)} />
        <pointLight position={[-5, 3, 3]} intensity={0.4} color={secondaryLightColor ? String(secondaryLightColor) : "#ec4899"} />
        <pointLight position={[5, -2, 3]} intensity={0.3} color={secondaryLightColor ? String(secondaryLightColor) : "#6366f1"} />
        <Environment preset={envPreset} />
        <ProductPlaceholder color={String(color)} accentColor={String(accentColor)}
          metalness={Number(metalness)} roughness={Number(roughness)} clearcoat={Number(clearcoat)}
          castShadows={Boolean(castShadows)} floatSpeed={Number(floatSpeed)} floatIntensity={Number(floatIntensity)}
          productScale={Number(productScale)} />
        <OrbitControls enableZoom={Boolean(enableZoom)} enablePan={false}
          autoRotate={Boolean(autoRotate)} autoRotateSpeed={Number(autoRotateSpeed)} />
      </Canvas>
    </div>
  )
}
