"use client"

import * as React from "react"

// Ten wave / flow shapes. Some are filled paths (bottom-anchored fills for a
// solid look); others are "thread fans" — dense stacks of thin S-curves that
// evoke silk / cloth / aurora. Thread fans are parameterized so `layerCount`
// can scale the density smoothly.
type WavePathSet = {
  primary: string
  secondary?: string
  tertiary?: string
  viewBox?: string
}

const WAVE_PATHS: Record<string, WavePathSet> = {
  // 1 · Simple filled sine
  "wave-1": {
    primary: "M0,192 C240,128 480,256 720,192 C960,128 1200,256 1440,192 L1440,320 L0,320 Z",
  },

  // 2 · Cloth — thread fan (rendered via ThreadFan)
  "wave-2": { primary: "" },

  // 3 · Deep ocean — four-layer parallax feel
  "wave-3": {
    primary: "M0,220 C200,170 400,280 600,220 C800,160 1000,280 1200,220 C1320,190 1400,210 1440,220 L1440,320 L0,320 Z",
    secondary: "M0,180 C240,240 480,120 720,180 C960,240 1200,120 1440,180 L1440,320 L0,320 Z",
    tertiary: "M0,140 C180,180 360,110 540,140 C720,170 900,110 1080,140 C1260,170 1350,130 1440,140 L1440,320 L0,320 Z",
  },

  // 4 · Fluid Layers — three counter-phase filled curves
  "wave-4": {
    primary: "M0,200 C180,80 540,80 720,200 C900,320 1260,320 1440,200 L1440,320 L0,320 Z",
    secondary: "M0,240 C180,320 540,320 720,240 C900,160 1260,160 1440,240 L1440,320 L0,320 Z",
    tertiary: "M0,280 C240,240 480,240 720,280 C960,320 1200,320 1440,280 L1440,320 L0,320 Z",
  },

  // 5 · Silk — big flowing thread fan (rendered via ThreadFan)
  "wave-5": { primary: "" },

  // 6 · Bubble bumps
  "wave-6": {
    primary: "M0,320 L0,220 Q90,120 180,220 Q270,320 360,220 Q450,120 540,220 Q630,320 720,220 Q810,120 900,220 Q990,320 1080,220 Q1170,120 1260,220 Q1350,320 1440,220 L1440,320 Z",
    secondary: "M0,320 L0,260 Q90,200 180,260 Q270,320 360,260 Q450,200 540,260 Q630,320 720,260 Q810,200 900,260 Q990,320 1080,260 Q1170,200 1260,260 Q1350,320 1440,260 L1440,320 Z",
  },

  // 7 · Ribbon — modern flowing ribbon (thread fan)
  "wave-7": { primary: "" },

  // 8 · Silk Threads — tight thread fan at bottom
  "wave-8": { primary: "" },

  // 9 · Aurora — very wide, wispy thread fan with high speed variance
  "wave-9": { primary: "" },

  // 10 · Long low sweep
  "wave-10": {
    primary: "M0,260 C480,180 960,180 1440,260 L1440,320 L0,320 Z",
    secondary: "M0,290 C480,230 960,230 1440,290 L1440,320 L0,320 Z",
  },
}

export type WaveType = keyof typeof WAVE_PATHS

// Thread fans use this to know which preset shape to render.
const THREAD_FAN_PRESETS: Record<string, ThreadFanPreset> = {
  // Cloth — tight bundle near the bottom, subtle depth
  "wave-2": {
    centerY: 235, spreadTotal: 110,
    ampCenter: 100, ampEdge: 40,
    widthCenter: 3, widthEdge: 1.1,
    opacityCenterMul: 1.0, opacityEdgeMul: 0.15,
    speedBase: 0.9, speedSpread: 0.7,
    heroPhaseOffset: 0,
  },
  // Silk — big elegant flowing bundle across the whole area
  "wave-5": {
    centerY: 180, spreadTotal: 220,
    ampCenter: 160, ampEdge: 70,
    widthCenter: 4, widthEdge: 1.4,
    opacityCenterMul: 1.0, opacityEdgeMul: 0.14,
    speedBase: 0.85, speedSpread: 0.75,
    heroPhaseOffset: 0,
  },
  // Ribbon — thick central hero band with fewer thin support threads
  "wave-7": {
    centerY: 180, spreadTotal: 200,
    ampCenter: 170, ampEdge: 90,
    widthCenter: 8, widthEdge: 1.8,
    opacityCenterMul: 1.0, opacityEdgeMul: 0.18,
    speedBase: 1.0, speedSpread: 0.6,
    heroPhaseOffset: 0,
  },
  // Silk Threads — tight band anchored low, mid-density
  "wave-8": {
    centerY: 258, spreadTotal: 100,
    ampCenter: 120, ampEdge: 70,
    widthCenter: 4, widthEdge: 1.4,
    opacityCenterMul: 1.0, opacityEdgeMul: 0.2,
    speedBase: 1.0, speedSpread: 0.55,
    heroPhaseOffset: 0,
  },
  // Aurora — ultra-wide wispy spread, thin threads, huge speed variance so
  // strands drift at very different rates → Northern Lights feel
  "wave-9": {
    centerY: 170, spreadTotal: 280,
    ampCenter: 90, ampEdge: 25,
    widthCenter: 2.5, widthEdge: 0.8,
    opacityCenterMul: 0.9, opacityEdgeMul: 0.06,
    speedBase: 0.7, speedSpread: 1.6,
    heroPhaseOffset: 0,
  },
}

type ThreadFanPreset = {
  centerY: number
  spreadTotal: number
  ampCenter: number
  ampEdge: number
  widthCenter: number
  widthEdge: number
  opacityCenterMul: number
  opacityEdgeMul: number
  speedBase: number
  speedSpread: number
  heroPhaseOffset: number
}

export interface WaveBlockProps {
  waveType: WaveType
  color?: string
  secondaryColor?: string
  tertiaryColor?: string
  height?: string
  opacity?: string
  animationEnabled?: boolean
  animationSpeed?: number
  animationDirection?: "left" | "right"
  flipHorizontal?: boolean
  flipVertical?: boolean
  position?: "top" | "bottom"
  layerOpacity?: string
  layerCount?: number  // number of threads for thread-fan waves (2/5/7/8)
  breakpoint?: "desktop" | "tablet" | "mobile"
}

// ── One tile duplicated + slid one full viewBox width via animateTransform.
// viewBox-unit math means the wrap point is always exact at any container size.
function AnimatedWavePath({
  d,
  fill,
  stroke,
  strokeWidth,
  speed,
  animate,
  direction,
  opacity,
}: {
  d: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  speed: number
  animate: boolean
  direction: "left" | "right"
  opacity: number
}) {
  const pathProps: React.SVGProps<SVGPathElement> = {
    d,
    opacity,
    fill: fill ?? "none",
    stroke,
    strokeWidth,
    strokeLinecap: stroke ? "round" : undefined,
  }
  return (
    <g>
      <path {...pathProps} />
      <path {...pathProps} transform="translate(1440 0)" />
      {animate && (
        <animateTransform
          attributeName="transform"
          type="translate"
          from={direction === "left" ? "0 0" : "-1440 0"}
          to={direction === "left" ? "-1440 0" : "0 0"}
          dur={`${Math.max(1, speed)}s`}
          repeatCount="indefinite"
        />
      )}
    </g>
  )
}

// A single tileable S-curve. Control points are mirrored around x=720 so the
// tangent at x=0 matches the tangent at x=1440 — path duplicated at
// translate(1440,0) connects with C¹ continuity, no visible seam.
function makeSCurvePath(y: number, amp: number): string {
  const upper = y - amp * 0.5
  const lower = y + amp * 0.5
  return `M0,${y} C180,${upper} 540,${upper} 720,${y} C900,${lower} 1260,${lower} 1440,${y}`
}

// ── Unified thread-fan renderer. Each thread is one S-curve; density, spread,
// amplitude falloff and speed variance come from the preset. Center threads
// use the primary color (thick + opaque); edge threads fade into secondary
// and tertiary at lower opacity — like flowing silk / aurora / cloth.
function ThreadFan({
  preset,
  layerCount,
  color,
  secondaryColor,
  tertiaryColor,
  layerOpacity,
  animationEnabled,
  animationSpeed,
  animationDirection,
}: {
  preset: ThreadFanPreset
  layerCount: number
  color: string
  secondaryColor: string
  tertiaryColor: string
  layerOpacity: number
  animationEnabled: boolean
  animationSpeed: number
  animationDirection: "left" | "right"
}) {
  const n = Math.max(3, Math.min(80, Math.round(layerCount)))
  const halfSpread = preset.spreadTotal / 2
  const threads: Array<{
    y: number; amp: number; width: number; opacity: number; color: string; speedMul: number
  }> = []
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1)   // 0..1
    const d = Math.abs(t - 0.5) * 2         // 0 at center, 1 at edges
    const y = preset.centerY - halfSpread + t * preset.spreadTotal
    const amp = preset.ampEdge + (preset.ampCenter - preset.ampEdge) * (1 - d)
    const width = preset.widthEdge + (preset.widthCenter - preset.widthEdge) * (1 - d)
    // Hero (center) stays fully opaque; others fall off with a soft curve
    const opacity = d < 0.03 ? preset.opacityCenterMul
      : layerOpacity * (preset.opacityCenterMul + (preset.opacityEdgeMul - preset.opacityCenterMul) * d)
    const threadColor = d < 0.28 ? color : d < 0.6 ? secondaryColor : tertiaryColor
    const speedMul = preset.speedBase + d * preset.speedSpread
    threads.push({ y, amp, width, opacity, color: threadColor, speedMul })
  }
  return (
    <>
      {threads.map((th, i) => (
        <AnimatedWavePath
          key={i}
          d={makeSCurvePath(th.y, th.amp)}
          stroke={th.color}
          strokeWidth={th.width}
          speed={animationSpeed * th.speedMul}
          animate={animationEnabled}
          direction={animationDirection}
          opacity={th.opacity}
        />
      ))}
    </>
  )
}

export function WaveBlock({
  waveType,
  color = "#0ea5e9",
  secondaryColor = "#38bdf8",
  tertiaryColor = "#7dd3fc",
  height = "180px",
  opacity = "1",
  animationEnabled = true,
  animationSpeed = 12,
  animationDirection = "left",
  flipHorizontal = false,
  flipVertical = false,
  position = "bottom",
  layerOpacity = "0.6",
  layerCount,
  breakpoint,
}: WaveBlockProps) {
  const paths = WAVE_PATHS[waveType] ?? WAVE_PATHS["wave-1"]
  const preset = THREAD_FAN_PRESETS[waveType]
  const isThreadFan = !!preset
  const viewBox = paths.viewBox ?? (isThreadFan && (waveType === "wave-5" || waveType === "wave-9") ? "0 0 1440 400" : "0 0 1440 320")
  const layerOp = parseFloat(layerOpacity) || 0.6

  // Sensible per-wave defaults when the user hasn't set a count yet.
  const defaultCount: Record<string, number> = { "wave-2": 22, "wave-5": 26, "wave-7": 9, "wave-8": 11, "wave-9": 30 }
  const effectiveLayerCount = layerCount ?? defaultCount[waveType] ?? 8

  const transforms: string[] = []
  if (flipHorizontal) transforms.push("scaleX(-1)")
  if (flipVertical) transforms.push("scaleY(-1)")
  const transform = transforms.length ? transforms.join(" ") : undefined

  return (
    <div
      style={{
        // Fill the wrapper exactly — inset:0 works whether the wrapper has an
        // explicit or auto height, avoiding percentage-height resolution edge
        // cases that were making the wave collapse to 0 in preview.
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: parseFloat(opacity) || 1,
        pointerEvents: "none",
        transform,
        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {isThreadFan ? (
          <ThreadFan
            preset={preset}
            layerCount={effectiveLayerCount}
            color={color}
            secondaryColor={secondaryColor}
            tertiaryColor={tertiaryColor}
            layerOpacity={layerOp}
            animationEnabled={animationEnabled}
            animationSpeed={animationSpeed}
            animationDirection={animationDirection}
          />
        ) : (
          <>
            {paths.tertiary && (
              <AnimatedWavePath
                d={paths.tertiary}
                fill={tertiaryColor}
                speed={animationSpeed * 1.6}
                animate={animationEnabled}
                direction={animationDirection}
                opacity={layerOp * 0.7}
              />
            )}
            {paths.secondary && (
              <AnimatedWavePath
                d={paths.secondary}
                fill={secondaryColor}
                speed={animationSpeed * 1.25}
                animate={animationEnabled}
                direction={animationDirection}
                opacity={layerOp}
              />
            )}
            <AnimatedWavePath
              d={paths.primary}
              fill={color}
              speed={animationSpeed}
              animate={animationEnabled}
              direction={animationDirection}
              opacity={1}
            />
          </>
        )}
      </svg>
    </div>
  )
}
