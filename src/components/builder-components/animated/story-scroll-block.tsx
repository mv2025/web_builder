"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Lenis from "lenis"

interface PromiseItem {
  id: number
  num: string
  subtitle: string
  title: string
  desc: string
  glowColor: string
}

interface StoryScrollBlockProps {
  heading?: string
  subheading?: string
  promises?: PromiseItem[]
  isPreview?: boolean
  [key: string]: unknown
}

export function StoryScrollBlock({
  heading = "Transforming visions into,\ndigital reality.",
  subheading = "FUTURE-READY INNOVATION",
  promises = [
    {
      id: 1,
      num: "01",
      subtitle: "CORE PILLAR",
      title: "Scalable Architecture",
      desc: "Cloud-native solutions designed to adapt and expand alongside your growing business needs seamlessly.",
      glowColor: "rgba(245, 158, 11, 0.15)", // Amber glow
    },
    {
      id: 2,
      num: "02",
      subtitle: "CORE PILLAR",
      title: "Data-Driven Insights",
      desc: "Leveraging advanced analytics and AI to turn complex data into actionable strategies and clear advantages.",
      glowColor: "rgba(245, 158, 11, 0.15)",
    },
    {
      id: 3,
      num: "03",
      subtitle: "CORE PILLAR",
      title: "Uncompromised Security",
      desc: "Enterprise-grade encryption and continuous monitoring to ensure your digital assets are protected around the clock.",
      glowColor: "rgba(245, 158, 11, 0.15)",
    }
  ],
  isPreview = false,
}: StoryScrollBlockProps) {
  const [activePromise, setActivePromise] = useState(1)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLElement | Window | null>(null)

  // Track viewport size for sticky/interactive layout trigger
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Lenis setup for preview mode
  useEffect(() => {
    if (isPreview) {
      const canvas = sectionRef.current?.closest("[data-canvas-scroll]") as HTMLElement | null
      if (canvas) {
        scrollContainerRef.current = canvas
        const lenis = new Lenis({
          wrapper: canvas,
          content: canvas.firstElementChild as HTMLElement || undefined,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        })
        let rafId: number
        function raf(time: number) {
          lenis.raf(time)
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
        return () => {
          lenis.destroy()
          cancelAnimationFrame(rafId)
        }
      }
    }
    scrollContainerRef.current = window
  }, [isPreview])

  // High-accuracy bounding rect scroll progress tracker
  useEffect(() => {
    if (!isDesktop) return

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const containerHeight = isPreview && scrollContainerRef.current && scrollContainerRef.current instanceof HTMLElement 
          ? scrollContainerRef.current.clientHeight 
          : window.innerHeight
          
        const totalScrollable = rect.height - containerHeight
        
        if (totalScrollable > 0) {
          let progress = -rect.top / totalScrollable
          progress = Math.max(0, Math.min(1, progress))
          setScrollProgress(progress)
          
          // Map progress boundaries to active index
          if (progress < 0.33) {
            setActivePromise(1)
          } else if (progress < 0.66) {
            setActivePromise(2)
          } else {
            setActivePromise(3)
          }
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
      handleScroll()
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [isDesktop, isPreview])

  // Smoothen the translation with spring physics
  const smoothTranslationY = -scrollProgress * 900

  return (
    <section 
      ref={sectionRef} 
      className="relative lg:h-[300vh] py-16 lg:py-0 select-none" 
      id="promises"
      style={{
        backgroundColor: "transparent",
        height: isDesktop ? "300vh" : "auto",
        width: "100%",
        fontFamily: "var(--font-sans, sans-serif)"
      }}
    >
      {/* Subtle grid background overlay */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Sticky viewport container (pins on desktop, standard layout on mobile) */}
      <div className="py-16 sm:py-24 lg:py-0 lg:sticky lg:top-0 lg:h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column (Pinned Text) */}
            <div className="lg:col-span-5 text-left z-20">
              <span className="block text-[10px] font-mono tracking-[0.3em] text-amber-500 uppercase mb-4" style={{ color: "#f59e0b" }}>
                {subheading}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6" style={{ whiteSpace: "pre-line", color: "#0a0a0a" }}>
                {heading}
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: "#525252" }}>
                Three pillars of excellence that drive our methodology — ensuring sustainable growth and unparalleled performance.
              </p>
              <div className="flex items-center gap-3 border-t pt-6" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                <span className="w-10 h-[2px]" style={{ backgroundColor: "#f59e0b" }} />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: "#525252" }}>
                  EST. 2024 — NEXUS ENTERPRISE
                </span>
              </div>
            </div>

            {/* Right Column (Timeline & Cards) */}
            <div className="lg:col-span-7 relative pl-0 lg:pl-16 lg:h-[450px] lg:overflow-hidden">
              
              {/* Translating timeline container on desktop, static list on mobile */}
              <motion.div 
                className="w-full relative flex flex-col z-10 gap-10 lg:gap-0"
                style={isDesktop ? { y: smoothTranslationY } : {}}
              >
                {/* Timeline background track line (Desktop Only) */}
                <div className="hidden lg:block absolute left-[27px] top-[225px] h-[900px] w-[3px] z-0" style={{ backgroundColor: "#e5e5e5" }} />
                
                {/* Animated active path line (Desktop Only) */}
                <motion.div 
                  className="hidden lg:block absolute left-[27px] top-[225px] w-[3px] origin-top rounded-full z-0"
                  style={{ height: isDesktop ? `${scrollProgress * 900}px` : '100%', backgroundColor: "#f59e0b" }}
                />

                {promises.map((promise) => {
                  const isActive = isDesktop ? activePromise === promise.id : true;
                  return (
                    <div 
                      key={promise.id} 
                      className="lg:h-[450px] flex gap-6 sm:gap-8 items-center"
                    >
                      {/* Timeline Number Circle */}
                      <span className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-sm shadow-md shrink-0 transition-all duration-500 z-10`} style={{
                        backgroundColor: isActive ? "#f59e0b" : "#f5f5f5",
                        color: isActive ? "#0a0a0a" : "#737373",
                        borderColor: isActive ? "#f59e0b" : "#e5e5e5",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        transform: isActive ? "scale(1.1)" : "scale(1)",
                        boxShadow: isActive ? "0 0 15px rgba(245,158,11,0.4)" : "none",
                      }}>
                        {promise.num}
                      </span>

                      {/* Card Content Box */}
                      <div 
                        className={`flex-1 p-6 sm:p-8 rounded-3xl border transition-all duration-500`}
                        style={{
                          backgroundColor: isActive ? "rgba(255, 255, 255, 0.9)" : "transparent",
                          borderColor: isActive ? "rgba(245, 158, 11, 0.2)" : "transparent",
                          opacity: isActive ? 1 : 0.4,
                          transform: isActive ? "scale(1)" : "scale(0.95)",
                          pointerEvents: isActive ? "auto" : "none",
                          boxShadow: isActive ? `0 20px 40px ${promise.glowColor}` : "none",
                        }}
                      >
                        <span className="block text-[10px] font-mono tracking-widest uppercase mb-2 transition-colors duration-500" style={{ color: isActive ? "#f59e0b" : "#737373" }}>
                          {promise.subtitle}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-bold mb-3 transition-colors duration-500" style={{ color: isActive ? "#0a0a0a" : "#737373" }}>
                          {promise.title}
                        </h4>
                        <p className="text-xs sm:text-sm leading-relaxed transition-colors duration-500" style={{ color: isActive ? "#525252" : "#737373" }}>
                          {promise.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
