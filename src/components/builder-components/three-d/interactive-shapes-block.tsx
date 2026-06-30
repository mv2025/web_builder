"use client"

import { useRef, useCallback, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface InteractiveShapesBlockProps {
  shape?: string
  color?: string
  wireframe?: boolean
  metalness?: number
  roughness?: number
  distort?: number
  distortSpeed?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  enableZoom?: boolean
  secondaryColor?: string
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
  shapeScale?: number
  emissive?: string
  emissiveIntensity?: number
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

function Shape({ shape = "torus", color = "#d946ef", wireframe = false, metalness = 0.8, roughness = 0.2, distort = 0.3, distortSpeed = 2, castShadows = false, shapeScale = 1, emissive, emissiveIntensity = 0 }: {
  shape?: string; color?: string; wireframe?: boolean; metalness?: number; roughness?: number; distort?: number; distortSpeed?: number; castShadows?: boolean; shapeScale?: number; emissive?: string; emissiveIntensity?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.3
    ref.current.rotation.x += delta * 0.1
  })

  const waveGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(3, 3, 64, 64)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, Math.sin(x * 3) * 0.25 + Math.cos(y * 3) * 0.25)
    }
    g.computeVertexNormals()
    return g
  }, [])

  const spiralGeo = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let t = 0; t < Math.PI * 6; t += 0.08) {
      points.push(new THREE.Vector3(Math.cos(t) * (1 - t * 0.03), t * 0.15 - 1.2, Math.sin(t) * (1 - t * 0.03)))
    }
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 128, 0.08, 12, false)
  }, [])

  const ribbonGeo = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let t = 0; t < Math.PI * 4; t += 0.1) {
      points.push(new THREE.Vector3(Math.sin(t) * 1.2, Math.cos(t * 0.5) * 0.8, t * 0.2 - 1.2))
    }
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 100, 0.12, 8, false)
  }, [])

  const getGeo = () => {
    switch (shape) {
      case "cube": return <boxGeometry args={[2, 2, 2]} />
      case "torus": return <torusGeometry args={[1.2, 0.5, 32, 64]} />
      case "blob": return <icosahedronGeometry args={[1.5, 4]} />
      case "ring": return <torusGeometry args={[1.3, 0.12, 24, 64]} />
      case "pill": return <capsuleGeometry args={[0.7, 1.4, 32, 64]} />
      case "crystal": return <octahedronGeometry args={[1.5]} />
      case "wave": return <primitive object={waveGeo} attach="geometry" />
      case "spiral": return <primitive object={spiralGeo} attach="geometry" />
      case "ribbon": return <primitive object={ribbonGeo} attach="geometry" />
      case "arch": return <torusGeometry args={[1.2, 0.3, 24, 48, Math.PI]} />
      default: return <sphereGeometry args={[1.5, 64, 64]} />
    }
  }

  const useDistort = shape === "sphere" || shape === "blob"

  if (useDistort) {
    return (
      <mesh ref={ref} scale={shapeScale} castShadow={castShadows} receiveShadow={castShadows}>
        {shape === "blob" ? <icosahedronGeometry args={[1.5, 4]} /> : <sphereGeometry args={[1.5, 64, 64]} />}
        <MeshDistortMaterial color={color} wireframe={wireframe} roughness={roughness} metalness={metalness} distort={distort} speed={distortSpeed}
          emissive={emissive || "#000000"} emissiveIntensity={emissiveIntensity} />
      </mesh>
    )
  }

  return (
    <mesh ref={ref} scale={shapeScale} castShadow={castShadows} receiveShadow={castShadows}>
      {getGeo()}
      <meshStandardMaterial color={color} wireframe={wireframe} roughness={roughness} metalness={metalness}
        emissive={emissive || "#000000"} emissiveIntensity={emissiveIntensity} />
    </mesh>
  )
}

export function InteractiveShapesBlock({
  shape = "torus", color = "#d946ef", wireframe = false,
  metalness = 0.8, roughness = 0.2, distort = 0.3, distortSpeed = 2,
  autoRotate = true, autoRotateSpeed = 1, enableZoom = false,
  secondaryColor, bgColor,
  lightAngleX = 5, lightAngleY = 5, lightIntensity = 1, ambientIntensity = 0.5,
  lightColor, castShadows = false, mouseParallax = false, mouseIntensity = 1,
  cameraFov = 50, cameraZoom = 5, shapeScale = 1,
  emissive, emissiveIntensity = 0,
}: InteractiveShapesBlockProps) {
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
        <pointLight position={[-5, -5, -5]} intensity={0.3} color={secondaryColor ? String(secondaryColor) : "#6366f1"} />
        <Shape shape={String(shape)} color={String(color)} wireframe={Boolean(wireframe)}
          metalness={Number(metalness)} roughness={Number(roughness)} distort={Number(distort)} distortSpeed={Number(distortSpeed)}
          castShadows={Boolean(castShadows)} shapeScale={Number(shapeScale)}
          emissive={emissive ? String(emissive) : undefined} emissiveIntensity={Number(emissiveIntensity)} />
        <OrbitControls enableZoom={Boolean(enableZoom)} enablePan={false} autoRotate={Boolean(autoRotate)} autoRotateSpeed={Number(autoRotateSpeed)} />
      </Canvas>
    </div>
  )
}
