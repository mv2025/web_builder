// ─── Core Node Types ─────────────────────────────────────────────────────────

export type Breakpoint = "desktop" | "tablet" | "mobile"

export type AnimationTrigger = "onMount" | "onScroll" | "onHover" | "onClick"
export type AnimationPreset =
  | "fadeIn" | "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight"
  | "scaleIn" | "scaleUp" | "scaleDown" | "zoomIn" | "zoomOut"
  | "rotateIn" | "rotateLeft" | "rotateRight" | "spin" | "spin3d"
  | "bounce" | "bounceIn" | "bounceUp" | "elastic" | "rubberBand"
  | "flipX" | "flipY" | "flipIn"
  | "slideUp" | "slideDown" | "slideLeft" | "slideRight"
  | "skewIn" | "skewLeft" | "skewRight"
  | "blurIn" | "blurUp" | "glowIn"
  | "typewriter" | "textReveal" | "wordReveal" | "charReveal" | "lineReveal"
  | "imageReveal" | "clipReveal" | "maskReveal"
  | "parallax" | "parallaxDeep" | "marquee" | "zoomOnScroll" | "rotateOnScroll"
  | "shake" | "wobble" | "pulse" | "flash" | "heartbeat" | "swing" | "jello" | "tada"
  | "rollIn" | "rollOut" | "lightSpeedIn" | "jackInTheBox"
  | "morphBg" | "gradientShift" | "colorPulse"
  | "float" | "driftLeft" | "driftRight"
  | "staggerUp" | "staggerScale" | "staggerRotate" | "staggerFade"
  | "drawBorder" | "underlineReveal"
  | "counter" | "progressFill"
  | "splitDrop" | "cascade" | "wave"
  | "custom" | "none"

export interface AnimationCustomProps {
  fromX?: number
  fromY?: number
  fromScale?: number
  fromRotation?: number
  fromSkewX?: number
  fromSkewY?: number
  fromOpacity?: number
  fromBlur?: number
  toX?: number
  toY?: number
  toScale?: number
  toRotation?: number
  toSkewX?: number
  toSkewY?: number
  toOpacity?: number
  toBlur?: number
  transformOrigin?: string
  yoyo?: boolean
  clipPath?: string
  backgroundColor?: string
  color?: string
  borderColor?: string
}

export interface AnimationConfig {
  preset: AnimationPreset
  trigger: AnimationTrigger
  duration: number
  delay: number
  ease: string
  repeat: number
  scrollStart?: string
  scrollEnd?: string
  stagger?: number
  scrub?: boolean
  pin?: boolean
  markers?: boolean
  toggleActions?: string
  custom?: AnimationCustomProps
  yoyo?: boolean
  transformOrigin?: string
}

export interface ResponsiveValue<T> {
  desktop: T
  tablet?: T
  mobile?: T
}

export interface StyleProps {
  // Layout
  display?: string
  flexDirection?: string
  flexWrap?: string
  justifyContent?: string
  alignItems?: string
  alignSelf?: string
  gap?: string
  rowGap?: string
  columnGap?: string
  flexGrow?: string
  flexShrink?: string
  flexBasis?: string
  order?: string
  gridTemplateColumns?: string
  gridTemplateRows?: string
  gridColumn?: string
  gridRow?: string
  placeItems?: string
  placeSelf?: string

  // Sizing
  width?: string
  height?: string
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string
  aspectRatio?: string
  boxSizing?: string

  // Spacing
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  marginTop?: string
  marginRight?: string
  marginBottom?: string
  marginLeft?: string
  padding?: string
  margin?: string

  // Typography
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  fontStyle?: string
  lineHeight?: string
  letterSpacing?: string
  wordSpacing?: string
  textAlign?: string
  textTransform?: string
  textDecoration?: string
  textDecorationColor?: string
  textDecorationStyle?: string
  textShadow?: string
  textOverflow?: string
  whiteSpace?: string
  wordBreak?: string
  color?: string

  // Background
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  backgroundClip?: string
  backgroundBlendMode?: string
  backgroundAttachment?: string
  backgroundOrigin?: string
  // Custom (not real CSS — used by section bg-layer rendering)
  backgroundVideo?: string
  imageBlur?: string
  overlayColor?: string

  // Border
  borderWidth?: string
  borderStyle?: string
  borderColor?: string
  borderRadius?: string
  borderTopLeftRadius?: string
  borderTopRightRadius?: string
  borderBottomLeftRadius?: string
  borderBottomRightRadius?: string
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
  outline?: string
  outlineOffset?: string

  // Effects
  boxShadow?: string
  opacity?: string
  backdropFilter?: string
  filter?: string
  mixBlendMode?: string
  overflow?: string
  overflowX?: string
  overflowY?: string
  zIndex?: string
  cursor?: string
  pointerEvents?: string
  userSelect?: string
  transition?: string
  transform?: string
  transformOrigin?: string

  // Position
  position?: string
  top?: string
  right?: string
  bottom?: string
  left?: string
  inset?: string

  // Clip & Mask
  clipPath?: string
  objectFit?: string
  objectPosition?: string

  // Visibility
  visibility?: string
}

export type ComponentType =
  // Layout
  | "section" | "container" | "flex" | "grid" | "stack" | "spacer"
  // Typography
  | "heading" | "paragraph" | "rich-text" | "blockquote" | "list"
  // Buttons
  | "button" | "cta-button" | "icon-button"
  // Media
  | "image" | "video" | "gallery" | "slider" | "audio" | "embed" | "map"
  // Forms
  | "input" | "textarea" | "checkbox" | "radio" | "select-field"
  | "form" | "file-upload" | "range-slider" | "switch" | "date-picker"
  // Navigation
  | "navbar" | "breadcrumb" | "pagination" | "sidebar-nav" | "menu"
  // Content
  | "link" | "social-links" | "rating" | "avatar" | "avatar-group"
  | "tooltip" | "alert" | "tag-group" | "table" | "code-block"
  // Marketing
  | "hero" | "features" | "testimonials" | "faq" | "pricing"
  | "logos" | "statistics" | "team" | "cta-section" | "footer"
  | "newsletter" | "contact-form" | "banner"
  // Interactive
  | "accordion" | "accordion-item" | "tabs" | "modal" | "drawer" | "carousel" | "card-slider"
  | "counter" | "progress-bar" | "popover" | "steps"
  // Advanced
  | "marquee" | "timeline" | "bento-grid" | "masonry-grid"
  // 3D
  | "floating-objects" | "interactive-shapes" | "3d-hero"
  | "particle-system" | "globe" | "product-showcase"
  | "gradient-blob" | "wave-terrain" | "aurora" | "morph-sphere"
  | "glass-layers" | "perspective-grid" | "tube-ring" | "light-trails"
  // Utility
  | "divider" | "badge" | "card" | "icon"
  // Animated
  | "horizontal-scroll" | "vertical-scroll-cards" | "text-zoom-scroll" | "story-scroll" | "normal-story-carousel" | "text-reveal"
  // Waves — decorative SVG backgrounds
  | "wave-1" | "wave-2" | "wave-3" | "wave-4" | "wave-5"
  | "wave-6" | "wave-7" | "wave-8" | "wave-9" | "wave-10"

export interface ComponentNode {
  id: string
  type: ComponentType
  name: string
  props: Record<string, unknown>
  styles: ResponsiveValue<StyleProps>
  animations: AnimationConfig[]
  children: ComponentNode[]
  locked: boolean
  hidden: boolean
  parentId: string | null
}

export interface PageSchema {
  id: string
  name: string
  slug: string
  components: ComponentNode[]
  metadata: {
    title: string
    description: string
    ogImage?: string
  }
  designTokens?: Partial<DesignTokens>
}

// ─── Design System ────────────────────────────────────────────────────────────

export interface ColorScale {
  50: string; 100: string; 200: string; 300: string; 400: string
  500: string; 600: string; 700: string; 800: string; 900: string; 950: string
}

export interface DesignTokens {
  colors: {
    primary: ColorScale
    secondary: ColorScale
    accent: ColorScale
    neutral: ColorScale
    success: ColorScale
    warning: ColorScale
    error: ColorScale
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
  }
  typography: {
    fontFamilySans: string
    fontFamilyMono: string
    fontFamilySerif: string
    baseFontSize: string
    scaleRatio: number
  }
  spacing: Record<string, string>
  radii: Record<string, string>
  shadows: Record<string, string>
  breakpoints: {
    tablet: number
    mobile: number
  }
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface ProjectSettings {
  favicon?: string
  customFonts?: string[]
  analytics?: { provider: string; id: string }
  customCode?: { head?: string; bodyEnd?: string }
}

export interface Project {
  id: string
  name: string
  description?: string
  pages: PageSchema[]
  designTokens: DesignTokens
  settings: ProjectSettings
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

// ─── Editor State ─────────────────────────────────────────────────────────────

export interface EditorSelection {
  nodeIds: string[]
  pageId: string | null
}

export interface HistoryEntry {
  pages: PageSchema[]
  timestamp: number
  description: string
}

export interface EditorViewport {
  zoom: number
  panX: number
  panY: number
}

// ─── Component Registry ───────────────────────────────────────────────────────

export interface ComponentMeta {
  type: ComponentType
  label: string
  icon: string
  category: ComponentCategory
  defaultProps: Record<string, unknown>
  defaultStyles: StyleProps
  defaultChildren?: ComponentNode[]
  resizable: boolean
  draggable: boolean
  droppable: boolean
  canHaveChildren: boolean
}

export type ComponentCategory =
  | "Layout" | "Typography" | "Buttons" | "Media" | "Forms"
  | "Marketing" | "Interactive" | "Advanced" | "3D" | "Animated" | "Waves"

// ─── Export ───────────────────────────────────────────────────────────────────

export type ExportFormat = "react" | "nextjs" | "html" | "pdf" | "image"

export interface ExportOptions {
  format: ExportFormat
  includeAnimations: boolean
  imageFormat?: "png" | "jpg" | "webp"
  imageScale?: number
}
