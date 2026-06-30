"use client"

import { useState } from "react"
import { useEditorStore } from "@/stores/editor-store"
import type { ComponentNode, AnimationConfig, AnimationPreset, AnimationTrigger, AnimationCustomProps } from "@/types"
import { SectionLabel } from "./right-sidebar"

interface AnimationPanelProps { node: ComponentNode }

const PRESETS: { value: AnimationPreset; label: string; category: string }[] = [
  // Fade
  { value: "fadeIn", label: "Fade In", category: "Fade" },
  { value: "fadeUp", label: "Fade Up", category: "Fade" },
  { value: "fadeDown", label: "Fade Down", category: "Fade" },
  { value: "fadeLeft", label: "Fade Left", category: "Fade" },
  { value: "fadeRight", label: "Fade Right", category: "Fade" },
  // Scale
  { value: "scaleIn", label: "Scale In", category: "Scale" },
  { value: "scaleUp", label: "Scale Up", category: "Scale" },
  { value: "scaleDown", label: "Scale Down", category: "Scale" },
  { value: "zoomIn", label: "Zoom In", category: "Scale" },
  { value: "zoomOut", label: "Zoom Out", category: "Scale" },
  // Rotate
  { value: "rotateIn", label: "Rotate In", category: "Rotate" },
  { value: "rotateLeft", label: "Rotate Left", category: "Rotate" },
  { value: "rotateRight", label: "Rotate Right", category: "Rotate" },
  { value: "spin", label: "Spin 360°", category: "Rotate" },
  { value: "spin3d", label: "Spin 3D", category: "Rotate" },
  // Bounce / Elastic
  { value: "bounce", label: "Bounce", category: "Bounce" },
  { value: "bounceIn", label: "Bounce In", category: "Bounce" },
  { value: "bounceUp", label: "Bounce Up", category: "Bounce" },
  { value: "elastic", label: "Elastic", category: "Bounce" },
  { value: "rubberBand", label: "Rubber Band", category: "Bounce" },
  // Flip
  { value: "flipX", label: "Flip X", category: "Flip" },
  { value: "flipY", label: "Flip Y", category: "Flip" },
  { value: "flipIn", label: "Flip In", category: "Flip" },
  // Slide
  { value: "slideUp", label: "Slide Up", category: "Slide" },
  { value: "slideDown", label: "Slide Down", category: "Slide" },
  { value: "slideLeft", label: "Slide Left", category: "Slide" },
  { value: "slideRight", label: "Slide Right", category: "Slide" },
  // Skew
  { value: "skewIn", label: "Skew In", category: "Skew" },
  { value: "skewLeft", label: "Skew Left", category: "Skew" },
  { value: "skewRight", label: "Skew Right", category: "Skew" },
  // Blur / Glow
  { value: "blurIn", label: "Blur In", category: "Blur" },
  { value: "blurUp", label: "Blur Up", category: "Blur" },
  { value: "glowIn", label: "Glow In", category: "Blur" },
  // Text
  { value: "typewriter", label: "Typewriter", category: "Text" },
  { value: "textReveal", label: "Text Reveal", category: "Text" },
  { value: "wordReveal", label: "Word Reveal", category: "Text" },
  { value: "charReveal", label: "Char Reveal", category: "Text" },
  { value: "lineReveal", label: "Line Reveal", category: "Text" },
  // Reveal / Clip
  { value: "imageReveal", label: "Image Reveal", category: "Reveal" },
  { value: "clipReveal", label: "Clip Reveal", category: "Reveal" },
  { value: "maskReveal", label: "Mask Reveal", category: "Reveal" },
  // Scroll
  { value: "parallax", label: "Parallax", category: "Scroll" },
  { value: "parallaxDeep", label: "Parallax Deep", category: "Scroll" },
  { value: "zoomOnScroll", label: "Zoom on Scroll", category: "Scroll" },
  { value: "rotateOnScroll", label: "Rotate on Scroll", category: "Scroll" },
  { value: "marquee", label: "Marquee", category: "Scroll" },
  // Attention
  { value: "shake", label: "Shake", category: "Attention" },
  { value: "wobble", label: "Wobble", category: "Attention" },
  { value: "pulse", label: "Pulse", category: "Attention" },
  { value: "flash", label: "Flash", category: "Attention" },
  { value: "heartbeat", label: "Heartbeat", category: "Attention" },
  { value: "swing", label: "Swing", category: "Attention" },
  { value: "jello", label: "Jello", category: "Attention" },
  { value: "tada", label: "Tada", category: "Attention" },
  // Special
  { value: "rollIn", label: "Roll In", category: "Special" },
  { value: "rollOut", label: "Roll Out", category: "Special" },
  { value: "lightSpeedIn", label: "Light Speed In", category: "Special" },
  { value: "jackInTheBox", label: "Jack in the Box", category: "Special" },
  // Float / Drift
  { value: "float", label: "Float", category: "Continuous" },
  { value: "driftLeft", label: "Drift Left", category: "Continuous" },
  { value: "driftRight", label: "Drift Right", category: "Continuous" },
  { value: "wave", label: "Wave", category: "Continuous" },
  // Stagger
  { value: "staggerUp", label: "Stagger Up", category: "Stagger" },
  { value: "staggerScale", label: "Stagger Scale", category: "Stagger" },
  { value: "staggerRotate", label: "Stagger Rotate", category: "Stagger" },
  { value: "staggerFade", label: "Stagger Fade", category: "Stagger" },
  { value: "cascade", label: "Cascade", category: "Stagger" },
  { value: "splitDrop", label: "Split Drop", category: "Stagger" },
  // Background
  { value: "morphBg", label: "Morph BG", category: "Background" },
  { value: "gradientShift", label: "Gradient Shift", category: "Background" },
  { value: "colorPulse", label: "Color Pulse", category: "Background" },
  // Line / Border
  { value: "drawBorder", label: "Draw Border", category: "Line" },
  { value: "underlineReveal", label: "Underline Reveal", category: "Line" },
  // Progress
  { value: "counter", label: "Counter", category: "Progress" },
  { value: "progressFill", label: "Progress Fill", category: "Progress" },
  // Custom
  { value: "custom", label: "Custom", category: "Custom" },
  { value: "none", label: "None", category: "Custom" },
]

const TRIGGERS: { value: AnimationTrigger; label: string }[] = [
  { value: "onMount", label: "On Load" },
  { value: "onScroll", label: "On Scroll" },
  { value: "onHover", label: "On Hover" },
  { value: "onClick", label: "On Click" },
]

const EASES = [
  "none", "power1.in", "power1.out", "power1.inOut",
  "power2.in", "power2.out", "power2.inOut",
  "power3.in", "power3.out", "power3.inOut",
  "power4.in", "power4.out", "power4.inOut",
  "back.in(1.7)", "back.out(1.7)", "back.inOut(1.7)",
  "elastic.out(1,0.3)", "elastic.in(1,0.3)", "elastic.inOut(1,0.3)",
  "bounce.in", "bounce.out", "bounce.inOut",
  "sine.in", "sine.out", "sine.inOut",
  "expo.in", "expo.out", "expo.inOut",
  "circ.in", "circ.out", "circ.inOut",
  "steps(5)", "steps(10)", "steps(20)",
  "slow(0.7,0.7,false)",
]

const TOGGLE_ACTIONS = [
  "play none none reverse",
  "play none none none",
  "play pause resume reverse",
  "play complete complete reset",
  "restart none none reverse",
  "restart pause resume reset",
]

const TRANSFORM_ORIGINS = [
  "center center", "top left", "top center", "top right",
  "center left", "center right",
  "bottom left", "bottom center", "bottom right",
]

function defaultAnimation(): AnimationConfig {
  return {
    preset: "fadeUp",
    trigger: "onScroll",
    duration: 0.8,
    delay: 0,
    ease: "power3.out",
    repeat: 0,
    stagger: 0,
    scrollStart: "top 80%",
    scrollEnd: "bottom 20%",
    yoyo: false,
    scrub: false,
    pin: false,
    markers: false,
    transformOrigin: "center center",
  }
}

export function AnimationPanel({ node }: AnimationPanelProps) {
  const { updateNodeAnimations } = useEditorStore()
  const animations = node.animations ?? []
  const [expandedIndex, setExpandedIndex] = useState<number | null>(animations.length > 0 ? 0 : null)

  const addAnimation = () => {
    const next = [...animations, defaultAnimation()]
    updateNodeAnimations(node.id, next)
    setExpandedIndex(next.length - 1)
  }

  const removeAnimation = (index: number) => {
    updateNodeAnimations(node.id, animations.filter((_, i) => i !== index))
    setExpandedIndex(null)
  }

  const updateAnimation = (index: number, partial: Partial<AnimationConfig>) => {
    const next = animations.map((a, i) => i === index ? { ...a, ...partial } : a)
    updateNodeAnimations(node.id, next)
  }

  const updateCustom = (index: number, partial: Partial<AnimationCustomProps>) => {
    const anim = animations[index]
    updateAnimation(index, { custom: { ...(anim.custom ?? {}), ...partial } })
  }

  const duplicateAnimation = (index: number) => {
    const next = [...animations]
    next.splice(index + 1, 0, { ...animations[index] })
    updateNodeAnimations(node.id, next)
    setExpandedIndex(index + 1)
  }

  const categories = [...new Set(PRESETS.map((p) => p.category))]

  return (
    <div style={{ padding: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <SectionLabel>Animations ({animations.length})</SectionLabel>
        <button
          onClick={addAnimation}
          style={{
            padding: "4px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600,
            background: "var(--accent-muted)", color: "var(--accent)",
          }}
        >
          + Add
        </button>
      </div>

      {animations.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--fg-ghost)", fontSize: "13px" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>✨</div>
          No animations yet.<br />Click + Add to create one.
        </div>
      )}

      {animations.map((anim, i) => {
        const isExpanded = expandedIndex === i
        const presetLabel = PRESETS.find((p) => p.value === anim.preset)?.label ?? anim.preset

        return (
          <div key={i} style={{
            marginBottom: "8px", borderRadius: "10px",
            background: "var(--card-bg)", border: "1px solid var(--border-subtle)",
          }}>
            {/* Collapsed header */}
            <div
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-muted)" }}>
                  {i + 1}. {presetLabel}
                </span>
                <span style={{ fontSize: "10px", color: "var(--fg-ghost)", background: "var(--bg-tertiary)", padding: "1px 6px", borderRadius: "4px" }}>
                  {TRIGGERS.find((t) => t.value === anim.trigger)?.label}
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button onClick={(e) => { e.stopPropagation(); duplicateAnimation(i) }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-ghost)", fontSize: "11px", padding: "2px 4px" }} title="Duplicate">⧉</button>
                <button onClick={(e) => { e.stopPropagation(); removeAnimation(i) }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-ghost)", fontSize: "14px", padding: "2px 4px" }}>✕</button>
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div style={{ padding: "0 12px 14px" }}>
                {/* Preset */}
                <Field label="Preset">
                  <select
                    value={anim.preset}
                    onChange={(e) => updateAnimation(i, { preset: e.target.value as AnimationPreset })}
                    style={selectStyle}
                  >
                    {categories.map((cat) => (
                      <optgroup key={cat} label={cat}>
                        {PRESETS.filter((p) => p.category === cat).map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </Field>

                {/* Trigger */}
                <Field label="Trigger">
                  <div style={{ display: "flex", gap: "4px" }}>
                    {TRIGGERS.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => updateAnimation(i, { trigger: t.value })}
                        style={{
                          flex: 1, padding: "5px 2px", borderRadius: "5px", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: 600,
                          background: anim.trigger === t.value ? "var(--accent-muted)" : "var(--input-bg)",
                          color: anim.trigger === t.value ? "var(--accent)" : "var(--fg-faint)",
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Duration, Delay, Stagger */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                  <Field label="Duration">
                    <NumberInput value={anim.duration} onChange={(v) => updateAnimation(i, { duration: v })} min={0} max={20} step={0.1} />
                  </Field>
                  <Field label="Delay">
                    <NumberInput value={anim.delay} onChange={(v) => updateAnimation(i, { delay: v })} min={0} max={10} step={0.1} />
                  </Field>
                  <Field label="Stagger">
                    <NumberInput value={anim.stagger ?? 0} onChange={(v) => updateAnimation(i, { stagger: v })} min={0} max={2} step={0.05} />
                  </Field>
                </div>

                {/* Ease */}
                <Field label="Easing">
                  <select value={anim.ease} onChange={(e) => updateAnimation(i, { ease: e.target.value })} style={selectStyle}>
                    {EASES.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </Field>

                {/* Transform Origin */}
                <Field label="Transform Origin">
                  <select value={anim.transformOrigin ?? "center center"} onChange={(e) => updateAnimation(i, { transformOrigin: e.target.value })} style={selectStyle}>
                    {TRANSFORM_ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>

                {/* Repeat & Yoyo */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  <Field label="Repeat">
                    <select value={anim.repeat} onChange={(e) => updateAnimation(i, { repeat: Number(e.target.value) })} style={selectStyle}>
                      <option value={0}>Once</option>
                      <option value={1}>2x</option>
                      <option value={2}>3x</option>
                      <option value={3}>4x</option>
                      <option value={5}>6x</option>
                      <option value={-1}>Infinite</option>
                    </select>
                  </Field>
                  <Field label="Yoyo">
                    <ToggleRow label="" checked={anim.yoyo ?? false} onChange={(v) => updateAnimation(i, { yoyo: v })} />
                  </Field>
                </div>

                {/* Scroll settings */}
                {anim.trigger === "onScroll" && (
                  <>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent)", marginTop: "8px", marginBottom: "6px" }}>Scroll Settings</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <Field label="Start">
                        <input value={anim.scrollStart ?? "top 80%"} onChange={(e) => updateAnimation(i, { scrollStart: e.target.value })} style={inputStyle} />
                      </Field>
                      <Field label="End">
                        <input value={anim.scrollEnd ?? "bottom 20%"} onChange={(e) => updateAnimation(i, { scrollEnd: e.target.value })} style={inputStyle} />
                      </Field>
                    </div>
                    <Field label="Toggle Actions">
                      <select value={anim.toggleActions ?? "play none none reverse"} onChange={(e) => updateAnimation(i, { toggleActions: e.target.value })} style={selectStyle}>
                        {TOGGLE_ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      <ToggleRow label="Scrub" checked={anim.scrub ?? false} onChange={(v) => updateAnimation(i, { scrub: v })} />
                      <ToggleRow label="Pin" checked={anim.pin ?? false} onChange={(v) => updateAnimation(i, { pin: v })} />
                      <ToggleRow label="Markers" checked={anim.markers ?? false} onChange={(v) => updateAnimation(i, { markers: v })} />
                    </div>
                  </>
                )}

                {/* Custom properties */}
                {anim.preset === "custom" && (
                  <>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent)", marginTop: "8px", marginBottom: "6px" }}>Custom Properties</div>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--fg-ghost)", marginBottom: "4px" }}>FROM</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      <Field label="X">
                        <NumberInput value={anim.custom?.fromX ?? 0} onChange={(v) => updateCustom(i, { fromX: v })} min={-500} max={500} step={1} />
                      </Field>
                      <Field label="Y">
                        <NumberInput value={anim.custom?.fromY ?? 0} onChange={(v) => updateCustom(i, { fromY: v })} min={-500} max={500} step={1} />
                      </Field>
                      <Field label="Scale">
                        <NumberInput value={anim.custom?.fromScale ?? 1} onChange={(v) => updateCustom(i, { fromScale: v })} min={0} max={5} step={0.1} />
                      </Field>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      <Field label="Rotation">
                        <NumberInput value={anim.custom?.fromRotation ?? 0} onChange={(v) => updateCustom(i, { fromRotation: v })} min={-360} max={360} step={1} />
                      </Field>
                      <Field label="Skew X">
                        <NumberInput value={anim.custom?.fromSkewX ?? 0} onChange={(v) => updateCustom(i, { fromSkewX: v })} min={-90} max={90} step={1} />
                      </Field>
                      <Field label="Skew Y">
                        <NumberInput value={anim.custom?.fromSkewY ?? 0} onChange={(v) => updateCustom(i, { fromSkewY: v })} min={-90} max={90} step={1} />
                      </Field>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <Field label="Opacity">
                        <NumberInput value={anim.custom?.fromOpacity ?? 0} onChange={(v) => updateCustom(i, { fromOpacity: v })} min={0} max={1} step={0.1} />
                      </Field>
                      <Field label="Blur (px)">
                        <NumberInput value={anim.custom?.fromBlur ?? 0} onChange={(v) => updateCustom(i, { fromBlur: v })} min={0} max={50} step={1} />
                      </Field>
                    </div>

                    <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--fg-ghost)", marginTop: "6px", marginBottom: "4px" }}>TO</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      <Field label="X">
                        <NumberInput value={anim.custom?.toX ?? 0} onChange={(v) => updateCustom(i, { toX: v })} min={-500} max={500} step={1} />
                      </Field>
                      <Field label="Y">
                        <NumberInput value={anim.custom?.toY ?? 0} onChange={(v) => updateCustom(i, { toY: v })} min={-500} max={500} step={1} />
                      </Field>
                      <Field label="Scale">
                        <NumberInput value={anim.custom?.toScale ?? 1} onChange={(v) => updateCustom(i, { toScale: v })} min={0} max={5} step={0.1} />
                      </Field>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      <Field label="Rotation">
                        <NumberInput value={anim.custom?.toRotation ?? 0} onChange={(v) => updateCustom(i, { toRotation: v })} min={-360} max={360} step={1} />
                      </Field>
                      <Field label="Skew X">
                        <NumberInput value={anim.custom?.toSkewX ?? 0} onChange={(v) => updateCustom(i, { toSkewX: v })} min={-90} max={90} step={1} />
                      </Field>
                      <Field label="Skew Y">
                        <NumberInput value={anim.custom?.toSkewY ?? 0} onChange={(v) => updateCustom(i, { toSkewY: v })} min={-90} max={90} step={1} />
                      </Field>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <Field label="Opacity">
                        <NumberInput value={anim.custom?.toOpacity ?? 1} onChange={(v) => updateCustom(i, { toOpacity: v })} min={0} max={1} step={0.1} />
                      </Field>
                      <Field label="Blur (px)">
                        <NumberInput value={anim.custom?.toBlur ?? 0} onChange={(v) => updateCustom(i, { toBlur: v })} min={0} max={50} step={1} />
                      </Field>
                    </div>

                    <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--fg-ghost)", marginTop: "6px", marginBottom: "4px" }}>COLORS</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      <Field label="BG Color">
                        <input type="color" value={anim.custom?.backgroundColor ?? "#000000"} onChange={(e) => updateCustom(i, { backgroundColor: e.target.value })} style={{ ...inputStyle, padding: "2px", height: "28px" }} />
                      </Field>
                      <Field label="Text Color">
                        <input type="color" value={anim.custom?.color ?? "#000000"} onChange={(e) => updateCustom(i, { color: e.target.value })} style={{ ...inputStyle, padding: "2px", height: "28px" }} />
                      </Field>
                      <Field label="Border Color">
                        <input type="color" value={anim.custom?.borderColor ?? "#000000"} onChange={(e) => updateCustom(i, { borderColor: e.target.value })} style={{ ...inputStyle, padding: "2px", height: "28px" }} />
                      </Field>
                    </div>
                    <Field label="Transform Origin">
                      <select value={anim.custom?.transformOrigin ?? "center center"} onChange={(e) => updateCustom(i, { transformOrigin: e.target.value })} style={selectStyle}>
                        {TRANSFORM_ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </Field>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* GSAP badge */}
      <div style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(255,170,0,0.06)", border: "1px solid rgba(255,170,0,0.15)", display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <span style={{ fontSize: "16px" }}>⚡</span>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#fbbf24" }}>Powered by GSAP</div>
          <div style={{ fontSize: "11px", color: "#92400e" }}>Animations render in preview mode</div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "6px" }}>
      {label && <div style={{ fontSize: "10px", color: "var(--fg-faint)", marginBottom: "3px" }}>{label}</div>}
      {children}
    </div>
  )
}

function NumberInput({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      style={inputStyle}
    />
  )
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
      {label && <span style={{ fontSize: "10px", color: "var(--fg-faint)" }}>{label}</span>}
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: "32px", height: "18px", borderRadius: "9px", border: "none", cursor: "pointer",
          background: checked ? "var(--accent)" : "var(--input-bg)",
          position: "relative", transition: "background 0.2s",
        }}
      >
        <div style={{
          width: "14px", height: "14px", borderRadius: "50%", background: "#fff",
          position: "absolute", top: "2px", left: checked ? "16px" : "2px", transition: "left 0.2s",
        }} />
      </button>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "5px 6px", borderRadius: "6px", fontSize: "11px",
  background: "var(--input-bg)", border: "1px solid var(--input-border)",
  color: "var(--input-fg)", outline: "none",
}

const selectStyle: React.CSSProperties = {
  width: "100%", padding: "5px 6px", borderRadius: "6px", fontSize: "11px",
  background: "var(--bg-tertiary)", border: "1px solid var(--input-border)",
  color: "var(--input-fg)", outline: "none",
}
