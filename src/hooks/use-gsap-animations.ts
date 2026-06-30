"use client"

import { useEffect } from "react"
import type { AnimationConfig } from "@/types"

declare global {
  interface Window {
    gsap?: {
      fromTo: (target: unknown, from: object, to: object) => unknown
      to: (target: unknown, vars: object) => unknown
      set: (target: unknown, vars: object) => void
      registerPlugin: (...plugins: unknown[]) => void
      killTweensOf: (target: unknown) => void
      timeline: (vars?: object) => { fromTo: (target: unknown, from: object, to: object) => unknown; to: (target: unknown, vars: object) => unknown }
    }
    ScrollTrigger?: unknown
  }
}

function getGSAPTween(anim: AnimationConfig): { from: Record<string, unknown>; to: Record<string, unknown> } {
  const repeatVal = typeof anim.repeat === "number" ? anim.repeat : 0
  const yoyo = anim.yoyo ?? false
  const origin = anim.transformOrigin ?? "center center"
  const base = { duration: anim.duration, delay: anim.delay, repeat: repeatVal, yoyo }
  const withEase = (extra: Record<string, unknown>) => ({
    ...extra, ...base,
    ease: anim.ease || "power3.out",
    transformOrigin: origin,
  })

  switch (anim.preset) {
    // ── Fade ──
    case "fadeIn":
      return { from: { opacity: 0 }, to: withEase({ opacity: 1 }) }
    case "fadeUp":
      return { from: { opacity: 0, y: 40 }, to: withEase({ opacity: 1, y: 0 }) }
    case "fadeDown":
      return { from: { opacity: 0, y: -40 }, to: withEase({ opacity: 1, y: 0 }) }
    case "fadeLeft":
      return { from: { opacity: 0, x: 60 }, to: withEase({ opacity: 1, x: 0 }) }
    case "fadeRight":
      return { from: { opacity: 0, x: -60 }, to: withEase({ opacity: 1, x: 0 }) }

    // ── Scale ──
    case "scaleIn":
      return { from: { opacity: 0, scale: 0.8 }, to: withEase({ opacity: 1, scale: 1 }) }
    case "scaleUp":
      return { from: { opacity: 0, scale: 0.5, y: 30 }, to: withEase({ opacity: 1, scale: 1, y: 0 }) }
    case "scaleDown":
      return { from: { opacity: 0, scale: 1.3 }, to: withEase({ opacity: 1, scale: 1 }) }
    case "zoomIn":
      return { from: { opacity: 0, scale: 0.3 }, to: withEase({ opacity: 1, scale: 1 }) }
    case "zoomOut":
      return { from: { opacity: 0, scale: 1.5 }, to: withEase({ opacity: 1, scale: 1 }) }

    // ── Rotate ──
    case "rotateIn":
      return { from: { opacity: 0, rotation: -15 }, to: withEase({ opacity: 1, rotation: 0 }) }
    case "rotateLeft":
      return { from: { opacity: 0, rotation: -90 }, to: withEase({ opacity: 1, rotation: 0 }) }
    case "rotateRight":
      return { from: { opacity: 0, rotation: 90 }, to: withEase({ opacity: 1, rotation: 0 }) }
    case "spin":
      return { from: { rotation: 0 }, to: withEase({ rotation: 360 }) }
    case "spin3d":
      return { from: { rotationY: 0, opacity: 0 }, to: withEase({ rotationY: 360, opacity: 1 }) }

    // ── Bounce / Elastic ──
    case "bounce":
      return { from: { opacity: 0, y: -60 }, to: { ...withEase({ opacity: 1, y: 0 }), ease: "bounce.out" } }
    case "bounceIn":
      return { from: { opacity: 0, scale: 0.3 }, to: { ...withEase({ opacity: 1, scale: 1 }), ease: "bounce.out" } }
    case "bounceUp":
      return { from: { opacity: 0, y: 80 }, to: { ...withEase({ opacity: 1, y: 0 }), ease: "bounce.out" } }
    case "elastic":
      return { from: { opacity: 0, scale: 0.5 }, to: { ...withEase({ opacity: 1, scale: 1 }), ease: "elastic.out(1,0.3)" } }
    case "rubberBand":
      return { from: { scaleX: 1 }, to: { ...withEase({ scaleX: 1, keyframes: [{ scaleX: 1.25, scaleY: 0.75 }, { scaleX: 0.75, scaleY: 1.25 }, { scaleX: 1.15, scaleY: 0.85 }, { scaleX: 1, scaleY: 1 }] }), ease: "power2.out" } }

    // ── Flip ──
    case "flipX":
      return { from: { opacity: 0, rotationX: -90 }, to: withEase({ opacity: 1, rotationX: 0, transformPerspective: 600 }) }
    case "flipY":
      return { from: { opacity: 0, rotationY: -90 }, to: withEase({ opacity: 1, rotationY: 0, transformPerspective: 600 }) }
    case "flipIn":
      return { from: { opacity: 0, rotationY: 180, scale: 0.8 }, to: withEase({ opacity: 1, rotationY: 0, scale: 1, transformPerspective: 800 }) }

    // ── Slide ──
    case "slideUp":
      return { from: { y: "100%", opacity: 0 }, to: withEase({ y: 0, opacity: 1 }) }
    case "slideDown":
      return { from: { y: "-100%", opacity: 0 }, to: withEase({ y: 0, opacity: 1 }) }
    case "slideLeft":
      return { from: { x: "100%", opacity: 0 }, to: withEase({ x: 0, opacity: 1 }) }
    case "slideRight":
      return { from: { x: "-100%", opacity: 0 }, to: withEase({ x: 0, opacity: 1 }) }

    // ── Skew ──
    case "skewIn":
      return { from: { opacity: 0, skewX: 20, x: -40 }, to: withEase({ opacity: 1, skewX: 0, x: 0 }) }
    case "skewLeft":
      return { from: { opacity: 0, skewY: -10, x: 50 }, to: withEase({ opacity: 1, skewY: 0, x: 0 }) }
    case "skewRight":
      return { from: { opacity: 0, skewY: 10, x: -50 }, to: withEase({ opacity: 1, skewY: 0, x: 0 }) }

    // ── Blur / Glow ──
    case "blurIn":
      return { from: { opacity: 0, filter: "blur(20px)" }, to: withEase({ opacity: 1, filter: "blur(0px)" }) }
    case "blurUp":
      return { from: { opacity: 0, y: 30, filter: "blur(10px)" }, to: withEase({ opacity: 1, y: 0, filter: "blur(0px)" }) }
    case "glowIn":
      return { from: { opacity: 0, filter: "blur(8px) brightness(2)" }, to: withEase({ opacity: 1, filter: "blur(0px) brightness(1)" }) }

    // ── Text ──
    case "typewriter":
    case "textReveal":
    case "wordReveal":
    case "charReveal":
    case "lineReveal":
      return { from: { opacity: 0, y: 20 }, to: withEase({ opacity: 1, y: 0 }) }

    // ── Reveal / Clip ──
    case "imageReveal":
      return { from: { clipPath: "inset(0 100% 0 0)" }, to: withEase({ clipPath: "inset(0 0% 0 0)" }) }
    case "clipReveal":
      return { from: { clipPath: "inset(0 0 100% 0)" }, to: withEase({ clipPath: "inset(0 0 0% 0)" }) }
    case "maskReveal":
      return { from: { clipPath: "circle(0% at 50% 50%)" }, to: withEase({ clipPath: "circle(100% at 50% 50%)" }) }

    // ── Scroll ──
    case "parallax":
      return { from: { y: -30 }, to: withEase({ y: 30 }) }
    case "parallaxDeep":
      return { from: { y: -80 }, to: withEase({ y: 80 }) }
    case "zoomOnScroll":
      return { from: { scale: 0.9, opacity: 0.5 }, to: withEase({ scale: 1, opacity: 1 }) }
    case "rotateOnScroll":
      return { from: { rotation: -10 }, to: withEase({ rotation: 10 }) }

    // ── Attention ──
    case "shake":
      return { from: { x: 0 }, to: { ...withEase({ keyframes: [{ x: -10 }, { x: 10 }, { x: -6 }, { x: 6 }, { x: -2 }, { x: 0 }] }), ease: "power2.inOut" } }
    case "wobble":
      return { from: { rotation: 0, x: 0 }, to: { ...withEase({ keyframes: [{ rotation: -5, x: -20 }, { rotation: 3, x: 15 }, { rotation: -2, x: -8 }, { rotation: 0, x: 0 }] }), ease: "power2.inOut" } }
    case "pulse":
      return { from: { scale: 1 }, to: { ...withEase({ keyframes: [{ scale: 1.05 }, { scale: 1 }] }), ease: "power2.inOut" } }
    case "flash":
      return { from: { opacity: 1 }, to: { ...withEase({ keyframes: [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }, { opacity: 1 }] }), ease: "power1.inOut" } }
    case "heartbeat":
      return { from: { scale: 1 }, to: { ...withEase({ keyframes: [{ scale: 1.15 }, { scale: 1 }, { scale: 1.15 }, { scale: 1 }] }), ease: "power2.inOut" } }
    case "swing":
      return { from: { rotation: 0, transformOrigin: "top center" }, to: { ...withEase({ keyframes: [{ rotation: 15 }, { rotation: -10 }, { rotation: 5 }, { rotation: -2 }, { rotation: 0 }] }), ease: "power2.inOut" } }
    case "jello":
      return { from: { skewX: 0, skewY: 0 }, to: { ...withEase({ keyframes: [{ skewX: -12.5, skewY: -12.5 }, { skewX: 6.25, skewY: 6.25 }, { skewX: -3, skewY: -3 }, { skewX: 1.5, skewY: 1.5 }, { skewX: 0, skewY: 0 }] }), ease: "power2.inOut" } }
    case "tada":
      return { from: { scale: 1, rotation: 0 }, to: { ...withEase({ keyframes: [{ scale: 0.9, rotation: -3 }, { scale: 1.1, rotation: 3 }, { scale: 1.1, rotation: -3 }, { scale: 1.1, rotation: 3 }, { scale: 1, rotation: 0 }] }), ease: "power2.inOut" } }

    // ── Special ──
    case "rollIn":
      return { from: { opacity: 0, x: -100, rotation: -120 }, to: withEase({ opacity: 1, x: 0, rotation: 0 }) }
    case "rollOut":
      return { from: { opacity: 1, x: 0, rotation: 0 }, to: withEase({ opacity: 0, x: 100, rotation: 120 }) }
    case "lightSpeedIn":
      return { from: { opacity: 0, x: 200, skewX: -30 }, to: withEase({ opacity: 1, x: 0, skewX: 0 }) }
    case "jackInTheBox":
      return { from: { opacity: 0, scale: 0.1, rotation: 30, transformOrigin: "center bottom" }, to: withEase({ opacity: 1, scale: 1, rotation: 0 }) }

    // ── Background ──
    case "morphBg":
    case "gradientShift":
    case "colorPulse":
      return { from: { opacity: 0.8 }, to: withEase({ opacity: 1 }) }

    // ── Float / Drift ──
    case "float":
      return { from: { y: 0 }, to: { ...withEase({ y: -15 }), yoyo: true, repeat: repeatVal === 0 ? -1 : repeatVal, ease: "sine.inOut" } }
    case "driftLeft":
      return { from: { x: 0 }, to: { ...withEase({ x: -20 }), yoyo: true, repeat: repeatVal === 0 ? -1 : repeatVal, ease: "sine.inOut" } }
    case "driftRight":
      return { from: { x: 0 }, to: { ...withEase({ x: 20 }), yoyo: true, repeat: repeatVal === 0 ? -1 : repeatVal, ease: "sine.inOut" } }

    // ── Stagger variants ──
    case "staggerUp":
      return { from: { opacity: 0, y: 30 }, to: withEase({ opacity: 1, y: 0, stagger: anim.stagger || 0.1 }) }
    case "staggerScale":
      return { from: { opacity: 0, scale: 0.5 }, to: withEase({ opacity: 1, scale: 1, stagger: anim.stagger || 0.1 }) }
    case "staggerRotate":
      return { from: { opacity: 0, rotation: -45 }, to: withEase({ opacity: 1, rotation: 0, stagger: anim.stagger || 0.08 }) }
    case "staggerFade":
      return { from: { opacity: 0 }, to: withEase({ opacity: 1, stagger: anim.stagger || 0.05 }) }

    // ── Border / Line ──
    case "drawBorder":
      return { from: { borderColor: "transparent", borderWidth: "0px" }, to: withEase({ borderColor: "currentColor", borderWidth: "2px" }) }
    case "underlineReveal":
      return { from: { backgroundSize: "0% 2px" }, to: withEase({ backgroundSize: "100% 2px" }) }

    // ── Progress ──
    case "counter":
    case "progressFill":
      return { from: { width: "0%" }, to: withEase({ width: "100%" }) }

    // ── Complex ──
    case "splitDrop":
      return { from: { opacity: 0, y: -40, rotationX: 45 }, to: withEase({ opacity: 1, y: 0, rotationX: 0, transformPerspective: 600 }) }
    case "cascade":
      return { from: { opacity: 0, y: 50, scale: 0.9 }, to: withEase({ opacity: 1, y: 0, scale: 1, stagger: anim.stagger || 0.15 }) }
    case "wave":
      return { from: { y: 0 }, to: { ...withEase({ y: -20 }), yoyo: true, repeat: repeatVal === 0 ? -1 : repeatVal, stagger: anim.stagger || 0.1, ease: "sine.inOut" } }
    case "marquee":
      return { from: { x: "0%" }, to: { ...withEase({ x: "-100%" }), repeat: -1, ease: "none" } }

    // ── Custom ──
    case "custom": {
      const c = anim.custom ?? {}
      return {
        from: {
          ...(c.fromX !== undefined ? { x: c.fromX } : {}),
          ...(c.fromY !== undefined ? { y: c.fromY } : {}),
          ...(c.fromScale !== undefined ? { scale: c.fromScale } : {}),
          ...(c.fromRotation !== undefined ? { rotation: c.fromRotation } : {}),
          ...(c.fromSkewX !== undefined ? { skewX: c.fromSkewX } : {}),
          ...(c.fromSkewY !== undefined ? { skewY: c.fromSkewY } : {}),
          ...(c.fromOpacity !== undefined ? { opacity: c.fromOpacity } : {}),
          ...(c.fromBlur !== undefined ? { filter: `blur(${c.fromBlur}px)` } : {}),
          ...(c.clipPath ? { clipPath: c.clipPath } : {}),
        },
        to: withEase({
          ...(c.toX !== undefined ? { x: c.toX } : {}),
          ...(c.toY !== undefined ? { y: c.toY } : {}),
          ...(c.toScale !== undefined ? { scale: c.toScale } : {}),
          ...(c.toRotation !== undefined ? { rotation: c.toRotation } : {}),
          ...(c.toSkewX !== undefined ? { skewX: c.toSkewX } : {}),
          ...(c.toSkewY !== undefined ? { skewY: c.toSkewY } : {}),
          ...(c.toOpacity !== undefined ? { opacity: c.toOpacity } : {}),
          ...(c.toBlur !== undefined ? { filter: `blur(${c.toBlur}px)` } : {}),
          ...(c.backgroundColor ? { backgroundColor: c.backgroundColor } : {}),
          ...(c.color ? { color: c.color } : {}),
          ...(c.borderColor ? { borderColor: c.borderColor } : {}),
          ...(c.transformOrigin ? { transformOrigin: c.transformOrigin } : {}),
        }),
      }
    }

    default:
      return { from: { opacity: 0 }, to: withEase({ opacity: 1 }) }
  }
}

export function useGSAPAnimation(
  ref: React.RefObject<HTMLDivElement | null>,
  animations: AnimationConfig[],
  isPreview: boolean,
) {
  useEffect(() => {
    if (!isPreview || !ref.current || animations.length === 0) return
    if (typeof window === "undefined" || !window.gsap) return

    const el = ref.current
    const gsap = window.gsap

    for (const anim of animations) {
      if (anim.preset === "none") continue
      const { from, to } = getGSAPTween(anim)

      if (anim.trigger === "onMount") {
        gsap.fromTo(el, from, to)
      } else if (anim.trigger === "onScroll" && window.ScrollTrigger) {
        gsap.fromTo(el, from, {
          ...to,
          scrollTrigger: {
            trigger: el,
            start: anim.scrollStart ?? "top 80%",
            end: anim.scrollEnd ?? "bottom 20%",
            toggleActions: anim.toggleActions ?? "play none none reverse",
            scrub: anim.scrub ?? false,
            pin: anim.pin ?? false,
            markers: anim.markers ?? false,
          },
        })
      } else if (anim.trigger === "onHover") {
        const onEnter = () => gsap.fromTo(el, from, { ...to, duration: anim.duration * 0.5 })
        el.addEventListener("mouseenter", onEnter)
        return () => el.removeEventListener("mouseenter", onEnter)
      } else if (anim.trigger === "onClick") {
        const onClick = () => gsap.fromTo(el, from, { ...to, duration: anim.duration * 0.5 })
        el.addEventListener("click", onClick)
        return () => el.removeEventListener("click", onClick)
      }
    }

    return () => {
      gsap.killTweensOf(el)
    }
  }, [ref, animations, isPreview])
}
