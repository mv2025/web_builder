"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

interface CarouselItem {
  id: number
  title: string
  category: string
  image: string
}

interface NormalStoryCarouselBlockProps {
  heading?: string
  items?: CarouselItem[]
  isPreview?: boolean
  [key: string]: unknown
}

export function NormalStoryCarouselBlock({
  heading = "Selected Work",
  items = [
    {
      id: 1,
      title: "Jaipuria Convocation Film",
      category: "Production, Video Editing, Cinematography",
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200",
    },
    {
      id: 2,
      title: "AdiDev Press",
      category: "Social Media, Graphic Design, Ecommerce",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    },
    {
      id: 3,
      title: "Calendar Showcase",
      category: "Photography, Art Direction, Editorial",
      image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200",
    },
    {
      id: 4,
      title: "Corporate Identity",
      category: "Branding, Typography, Interactive",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200",
    },
    {
      id: 5,
      title: "Cinematic Narratives",
      category: "Film Production, Sound Design",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
    }
  ],
  isPreview = false,
}: NormalStoryCarouselBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  
  const [width, setWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [activeDot, setActiveDot] = useState(0)

  const updateWidth = () => {
    if (carouselRef.current && viewportRef.current) {
      const scrollW = carouselRef.current.scrollWidth
      const offsetW = viewportRef.current.offsetWidth
      setWidth(Math.max(0, scrollW - offsetW))
    }
  }

  useEffect(() => {
    updateWidth()
    const timer = setTimeout(updateWidth, 500)
    window.addEventListener("resize", updateWidth)
    
    let observer: ResizeObserver | undefined
    if (carouselRef.current) {
      observer = new ResizeObserver(updateWidth)
      observer.observe(carouselRef.current)
    }
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateWidth)
      if (observer) observer.disconnect()
    }
  }, [])

  const handleDragStart = () => {
    updateWidth()
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (carouselRef.current && viewportRef.current) {
      const scrollOffset = -carouselRef.current.getBoundingClientRect().left + viewportRef.current.getBoundingClientRect().left
      const cardWidth = carouselRef.current.scrollWidth / items.length
      const index = Math.min(
        Math.max(Math.round(scrollOffset / cardWidth), 0),
        items.length - 1
      )
      setActiveDot(index)
    }
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-24 overflow-hidden select-none"
      style={{
        backgroundColor: "transparent",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
        {/* Main Heading */}
        <h2 className="text-[12vw] md:text-[8vw] lg:text-[6vw] xl:text-[5vw] font-light tracking-tight mb-12 sm:mb-16 transition-all duration-300 leading-none" style={{ color: "#0a0a0a" }}>
          {heading}
        </h2>

        {/* Carousel Drag Container */}
        <div ref={viewportRef} className="overflow-visible relative w-full">
          <motion.div
            ref={carouselRef}
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="flex gap-8 cursor-grab active:cursor-grabbing w-max pr-16"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="w-[85vw] md:w-[65vw] lg:w-[55vw] xl:w-[50vw] flex-shrink-0 flex flex-col group"
              >
                {/* 16:10 Premium Aspect Ratio Card Image */}
                <div className="w-full aspect-[16/10] relative rounded-[2rem] overflow-hidden bg-neutral-100 border border-neutral-200/40 shadow-2xl transition-all duration-500 group-hover:border-black/10 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                  />
                  {/* Dark gradient overlay to keep texts legible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Card Info Overlay (Shown on Hover) */}
                  <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-500 font-medium tracking-wide" style={{ color: "#f59e0b" }}>
                      {item.category}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-16">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (carouselRef.current && containerRef.current) {
                  const cardWidth = carouselRef.current.scrollWidth / items.length
                  setActiveDot(index)
                }
              }}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: activeDot === index ? "32px" : "8px",
                backgroundColor: activeDot === index ? "#000000" : "#d4d4d4",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
