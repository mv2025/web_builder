"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VolumetricStudio } from "@/components/ui/volumetric-studio";

export default function VolumetricHeroSection({
  headline = "Design in a new dimension.",
  description = "Physically accurate lighting. Rendered live. Zero shaders.",
  button1Text = "Get Started",
  button1Link = "#",
  button2Text = "View Docs",
  button2Link = "#",
  lightColor = "230,240,255",
  bgColor = "#000000",
  breakpoint = "desktop"
}) {
  /* hero parallax */
  const { scrollYProgress: heroProg } = useScroll({ offset: ["start start", "end start"] });
  const heroTitleY = useTransform(heroProg, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProg, [0, 0.6], [1, 0]);
  const heroBgScale = useTransform(heroProg, [0, 1], [1, 1.15]);

  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";
  const isMobileOrTablet = isMobile || isTablet;

  const rgbColor = React.useMemo(() => {
    if (!lightColor) return "230,240,255";
    if (lightColor.includes(",")) return lightColor;
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = lightColor.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
      : "230,240,255";
  }, [lightColor]);

  const titleFontSize = isMobile 
    ? "1.75rem" 
    : isTablet 
      ? "3rem" 
      : "5rem";

  return (
    <section className="relative w-full h-screen overflow-hidden text-white font-sans" style={{ overflowX: "clip", backgroundColor: bgColor }}>
      <style>{`
        .volumetric-gradient-text {
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
        }
      `}</style>

      <motion.div className="absolute inset-0" style={{ scale: heroBgScale }}>
        <VolumetricStudio lightColor={lightColor} bgColor={bgColor} />
      </motion.div>

      {/* parallax content layer */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
        style={{ y: heroTitleY, opacity: heroOpacity }}
      >
        {/* title — stagger per letter, wrapped by word to prevent splitting words */}
        <div 
          className="mb-4 px-2 flex justify-center mx-auto"
          style={{ flexWrap: isMobile ? "wrap" : "nowrap", maxWidth: "100%" }}
        >
          {(headline || "").split(" ").map((word, wordIdx) => (
            <React.Fragment key={wordIdx}>
              {wordIdx > 0 && <span className="inline-block font-bold tracking-tight" style={{ fontSize: titleFontSize, color: `rgb(${rgbColor})`, opacity: 0.8 }}>&nbsp;</span>}
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((ch, i) => {
                  // Calculate a flat index for delay stagger
                  const delayIndex = wordIdx * 4 + i;
                  return (
                    <motion.span
                      key={i}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ delay: 1.7 + delayIndex * 0.018, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block pb-[0.3em] -mb-[0.3em] font-bold tracking-tight volumetric-gradient-text"
                      style={{
                        fontSize: titleFontSize,
                        background: `linear-gradient(to bottom, #ffffff 30%, rgba(${rgbColor},0.7) 100%)`,
                      }}
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </span>
            </React.Fragment>
          ))}
        </div>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="text-sm sm:text-base md:text-lg max-w-sm sm:max-w-xl text-white/40 mb-8 px-4"
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {button1Text && (
            <button
              onClick={() => { window.location.href = button1Link; }}
              className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              {button1Text}
            </button>
          )}
          {button2Text && (
            <button
              onClick={() => { window.location.href = button2Link; }}
              className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white border border-white/20 rounded-full hover:bg-white/8 hover:scale-105 active:scale-95 transition-all"
            >
              {button2Text}
            </button>
          )}
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/18">Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 0, 1], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent origin-top"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
