"use client"

import { useRef, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface ThreeDHeroBlockProps {
  heading?: string
  subheading?: string
  variant?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  fontSize?: number
  textColor?: string
  bgColor?: string
  showSubheading?: boolean
  lightAngleX?: number
  lightAngleY?: number
  lightIntensity?: number
  ambientIntensity?: number
  lightColor?: string
  mouseParallax?: boolean
  mouseIntensity?: number
  cameraFov?: number
  shapeScale?: number
  shapeOpacity?: number
  animationSpeed?: number
  distort?: number
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

function FloatingGradientSphere({ color = "#6366f1", scale = 1, opacity = 0.7, speed = 1, distort = 0.4 }: { color?: string; scale?: number; opacity?: number; speed?: number; distort?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.2 * speed
  })
  return (
    <Float speed={1.5 * speed} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={ref} position={[2, 0.5, -1]} scale={1.8 * scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial color={color} roughness={0.1} metalness={0.9} distort={distort} speed={3} transparent opacity={opacity} />
      </mesh>
    </Float>
  )
}

function FloatingTorus({ color = "#ec4899", scale = 1, opacity = 0.6, speed = 1 }: { color?: string; scale?: number; opacity?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.3 * speed
    ref.current.rotation.z += delta * 0.2 * speed
  })
  return (
    <Float speed={2 * speed} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={ref} position={[-2, -0.5, -1]} scale={1.2 * scale}>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} transparent opacity={opacity} />
      </mesh>
    </Float>
  )
}

function FloatingCone({ color = "#0ea5e9", scale = 1, opacity = 0.5, speed = 1 }: { color?: string; scale?: number; opacity?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.4 * speed
  })
  return (
    <Float speed={1.8 * speed} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={ref} position={[0, -1.5, -2]} scale={0.8 * scale}>
        <coneGeometry args={[0.8, 1.6, 6]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} transparent opacity={opacity} />
      </mesh>
    </Float>
  )
}

function Scene({ primaryColor, secondaryColor, accentColor, lightAngleX = 5, lightAngleY = 5, lightIntensity = 0.8, ambientIntensity = 0.4, lightColor = "#ffffff", mouseParallax = false, mouseIntensity = 1, shapeScale = 1, shapeOpacity = 0.7, animationSpeed = 1, distort = 0.4, mouse }: {
  primaryColor?: string; secondaryColor?: string; accentColor?: string
  lightAngleX?: number; lightAngleY?: number; lightIntensity?: number; ambientIntensity?: number; lightColor?: string
  mouseParallax?: boolean; mouseIntensity?: number; shapeScale?: number; shapeOpacity?: number; animationSpeed?: number; distort?: number
  mouse: React.RefObject<{ x: number; y: number } | null>
}) {
  return (
    <>
      {mouseParallax && <MouseParallaxRig intensity={mouseIntensity} mouse={mouse} />}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[lightAngleX, lightAngleY, 5]} intensity={lightIntensity} color={lightColor} />
      <pointLight position={[-5, 3, 5]} intensity={0.6} color={secondaryColor || "#ec4899"} />
      <pointLight position={[5, -3, 5]} intensity={0.4} color={primaryColor || "#6366f1"} />
      <FloatingGradientSphere color={primaryColor} scale={shapeScale} opacity={shapeOpacity} speed={animationSpeed} distort={distort} />
      <FloatingTorus color={secondaryColor} scale={shapeScale} opacity={shapeOpacity * 0.85} speed={animationSpeed} />
      <FloatingCone color={accentColor} scale={shapeScale} opacity={shapeOpacity * 0.7} speed={animationSpeed} />
    </>
  )
}

export function ThreeDHeroBlock({
  heading = "Next Level Design", subheading = "", primaryColor, secondaryColor, accentColor,
  fontSize = 3, textColor, bgColor, showSubheading = false,
  lightAngleX = 5, lightAngleY = 5, lightIntensity = 0.8, ambientIntensity = 0.4,
  lightColor, mouseParallax = false, mouseIntensity = 1, cameraFov = 50,
  shapeScale = 1, shapeOpacity = 0.7, animationSpeed = 1, distort = 0.4,
}: ThreeDHeroBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
  }, [])

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ position: "relative", width: "100%", height: "100%", background: bgColor ? String(bgColor) : "transparent" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: Number(cameraFov) }} style={{ position: "absolute", inset: 0, background: "transparent", zIndex: -1 }}>
        <Scene primaryColor={primaryColor ? String(primaryColor) : undefined}
          secondaryColor={secondaryColor ? String(secondaryColor) : undefined}
          accentColor={accentColor ? String(accentColor) : undefined}
          lightAngleX={Number(lightAngleX)} lightAngleY={Number(lightAngleY)} lightIntensity={Number(lightIntensity)}
          ambientIntensity={Number(ambientIntensity)} lightColor={lightColor ? String(lightColor) : "#ffffff"}
          mouseParallax={Boolean(mouseParallax)} mouseIntensity={Number(mouseIntensity)}
          shapeScale={Number(shapeScale)} shapeOpacity={Number(shapeOpacity)} animationSpeed={Number(animationSpeed)}
          distort={Number(distort)} mouse={mouse} />
      </Canvas>
      <div style={{
        position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", height: "100%",
        textAlign: "center", padding: "40px 20px", pointerEvents: "none",
      }}>
        <h1 style={{ fontSize: `${Number(fontSize)}em`, fontWeight: 900, margin: 0, lineHeight: 1.1, color: textColor ? String(textColor) : undefined }}>{heading}</h1>
        {Boolean(showSubheading) && subheading && (
          <p style={{ fontSize: `${Number(fontSize) * 0.4}em`, marginTop: "16px", opacity: 0.7, color: textColor ? String(textColor) : undefined }}>{subheading}</p>
        )}
      </div>
    </div>
  )
}
