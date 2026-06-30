"use client"

import { useRef, useCallback, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

interface FloatingObjectsBlockProps {
  count?: number
  shape?: string
  color?: string
  speed?: number
  secondaryColor?: string
  metalness?: number
  roughness?: number
  opacity?: number
  spread?: number
  floatIntensity?: number
  mixShapes?: boolean
  bgColor?: string
  lightAngleX?: number
  lightAngleY?: number
  lightIntensity?: number
  ambientIntensity?: number
  lightColor?: string
  castShadows?: boolean
  mouseParallax?: boolean
  mouseIntensity?: number
  cameraFov?: number
  cameraZoom?: number
  [key: string]: unknown
}

const ALL_SHAPES = ["sphere", "cube", "torus", "blob", "ring", "pill", "crystal", "wave"] as const

function WaveGeometry() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.2, 1.2, 32, 32)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, Math.sin(x * 4) * 0.12 + Math.cos(y * 4) * 0.12)
    }
    g.computeVertexNormals()
    return g
  }, [])
  return <primitive object={geo} attach="geometry" />
}

function SpiralGeometry() {
  const geo = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let t = 0; t < Math.PI * 4; t += 0.1) {
      points.push(new THREE.Vector3(Math.cos(t) * 0.4, t * 0.1 - 0.6, Math.sin(t) * 0.4))
    }
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 64, 0.06, 8, false)
  }, [])
  return <primitive object={geo} attach="geometry" />
}

function getGeometry(shape: string) {
  switch (shape) {
    case "cube": return <boxGeometry args={[0.9, 0.9, 0.9]} />
    case "torus": return <torusGeometry args={[0.5, 0.2, 16, 32]} />
    case "blob": return <icosahedronGeometry args={[0.6, 3]} />
    case "ring": return <torusGeometry args={[0.5, 0.06, 16, 48]} />
    case "pill": return <capsuleGeometry args={[0.3, 0.6, 16, 32]} />
    case "crystal": return <octahedronGeometry args={[0.55]} />
    case "wave": return <WaveGeometry />
    case "spiral": return <SpiralGeometry />
    default: return <sphereGeometry args={[0.6, 32, 32]} />
  }
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

function FloatingShape({ shape, color, position, scale, speed, metalness, roughness, opacity, floatIntensity, mixShapes, index, castShadows }: {
  shape: string; color: string; position: [number, number, number]; scale: number; speed: number
  metalness: number; roughness: number; opacity: number; floatIntensity: number; mixShapes: boolean; index: number; castShadows: boolean
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * speed * 0.3
    ref.current.rotation.y += delta * speed * 0.5
  })

  const actualShape = mixShapes ? ALL_SHAPES[index % ALL_SHAPES.length] : shape

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={floatIntensity}>
      <mesh ref={ref} position={position} scale={scale} castShadow={castShadows} receiveShadow={castShadows}>
        {getGeometry(actualShape)}
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} transparent opacity={opacity} />
      </mesh>
    </Float>
  )
}

function Scene({ count = 8, shape = "sphere", color = "#0ea5e9", speed = 1, secondaryColor, metalness = 0.6, roughness = 0.3, opacity = 0.85, spread = 2, floatIntensity = 1.5, mixShapes = false, lightAngleX = 5, lightAngleY = 5, lightIntensity = 0.8, ambientIntensity = 0.6, lightColor = "#ffffff", castShadows = false, mouseParallax = false, mouseIntensity = 1, mouse }: {
  count?: number; shape?: string; color?: string; speed?: number; secondaryColor?: string
  metalness?: number; roughness?: number; opacity?: number; spread?: number; floatIntensity?: number; mixShapes?: boolean
  lightAngleX?: number; lightAngleY?: number; lightIntensity?: number; ambientIntensity?: number; lightColor?: string; castShadows?: boolean
  mouseParallax?: boolean; mouseIntensity?: number; mouse: React.RefObject<{ x: number; y: number } | null>
}) {
  const objects = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const radius = spread + Math.random() * (spread * 0.75)
    return {
      position: [Math.cos(angle) * radius, (Math.random() - 0.5) * (spread * 1.5), Math.sin(angle) * radius] as [number, number, number],
      scale: 0.3 + Math.random() * 0.5,
    }
  })

  return (
    <>
      {mouseParallax && <MouseParallaxRig intensity={mouseIntensity} mouse={mouse} />}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[lightAngleX, lightAngleY, 5]} intensity={lightIntensity} color={lightColor} castShadow={castShadows} />
      <pointLight position={[-3, -3, -3]} intensity={0.3} color={secondaryColor || "#ff6b6b"} />
      <pointLight position={[3, 3, -3]} intensity={0.2} color={secondaryColor || "#ff6b6b"} />
      {objects.map((obj, i) => (
        <FloatingShape key={i} index={i} shape={shape} color={color} position={obj.position} scale={obj.scale} speed={speed}
          metalness={metalness} roughness={roughness} opacity={opacity} floatIntensity={floatIntensity} mixShapes={mixShapes} castShadows={castShadows} />
      ))}
    </>
  )
}

export function FloatingObjectsBlock({
  count = 8, shape = "sphere", color = "#0ea5e9", speed = 1,
  secondaryColor, metalness = 0.6, roughness = 0.3, opacity = 0.85,
  spread = 2, floatIntensity = 1.5, mixShapes = false, bgColor,
  lightAngleX = 5, lightAngleY = 5, lightIntensity = 0.8, ambientIntensity = 0.6,
  lightColor, castShadows = false, mouseParallax = false, mouseIntensity = 1,
  cameraFov = 50, cameraZoom = 6,
}: FloatingObjectsBlockProps) {
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
        <Scene count={Number(count)} shape={String(shape)} color={String(color)} speed={Number(speed)}
          secondaryColor={secondaryColor ? String(secondaryColor) : undefined}
          metalness={Number(metalness)} roughness={Number(roughness)} opacity={Number(opacity)}
          spread={Number(spread)} floatIntensity={Number(floatIntensity)} mixShapes={Boolean(mixShapes)}
          lightAngleX={Number(lightAngleX)} lightAngleY={Number(lightAngleY)} lightIntensity={Number(lightIntensity)}
          ambientIntensity={Number(ambientIntensity)} lightColor={lightColor ? String(lightColor) : "#ffffff"}
          castShadows={Boolean(castShadows)} mouseParallax={Boolean(mouseParallax)} mouseIntensity={Number(mouseIntensity)}
          mouse={mouse} />
      </Canvas>
    </div>
  )
}
