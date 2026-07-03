import type { ComponentMeta, ComponentType } from "@/types"

const registry: Record<ComponentType, ComponentMeta> = {
  // ── Layout ──────────────────────────────────────────────────────────────────
  section: {
    type: "section", label: "Section", icon: "layout-panel-top", category: "Layout",
    defaultProps: {}, canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { display: "flex", flexDirection: "column", width: "100%", paddingTop: "80px", paddingBottom: "80px" },
  },
  container: {
    type: "container", label: "Container", icon: "square", category: "Layout",
    defaultProps: { maxWidth: "1200px" }, canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { display: "flex", flexDirection: "column", width: "100%", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", paddingLeft: "24px", paddingRight: "24px" },
  },
  flex: {
    type: "flex", label: "Flex", icon: "rows-3", category: "Layout",
    defaultProps: { direction: "row", wrap: "nowrap", justify: "flex-start", align: "center" },
    canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { display: "flex", flexDirection: "row", gap: "16px", width: "100%" },
  },
  grid: {
    type: "grid", label: "Grid", icon: "layout-grid", category: "Layout",
    defaultProps: { columns: 3, gap: "24px" },
    canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", width: "100%" },
  },
  stack: {
    type: "stack", label: "Stack", icon: "layers", category: "Layout",
    defaultProps: { spacing: "16px" },
    canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { display: "flex", flexDirection: "column", gap: "16px", width: "100%" },
  },
  spacer: {
    type: "spacer", label: "Spacer", icon: "move-vertical", category: "Layout",
    defaultProps: { height: "64px" }, canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { height: "64px", width: "100%" },
  },

  // ── Typography ──────────────────────────────────────────────────────────────
  heading: {
    type: "heading", label: "Heading", icon: "heading", category: "Typography",
    defaultProps: { text: "Your Heading", level: "h2", gradient: false },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { fontSize: "48px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-0.02em", color: "#18181b", width: "fit-content" },
  },
  paragraph: {
    type: "paragraph", label: "Paragraph", icon: "text", category: "Typography",
    defaultProps: { text: "Your paragraph text goes here. Edit it to tell your story." },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { fontSize: "16px", fontWeight: "400", lineHeight: "1.7", color: "#71717a", maxWidth: "640px" },
  },
  "rich-text": {
    type: "rich-text", label: "Rich Text", icon: "type", category: "Typography",
    defaultProps: { html: "<p>Rich text content</p>" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { fontSize: "16px", lineHeight: "1.7", color: "#71717a", maxWidth: "640px" },
  },
  blockquote: {
    type: "blockquote", label: "Blockquote", icon: "quote", category: "Typography",
    defaultProps: { text: "An inspiring quote goes here.", author: "Author Name" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { borderLeft: "4px solid #0ea5e9", paddingLeft: "24px", fontSize: "20px", maxWidth: "640px" },
  },
  list: {
    type: "list", label: "List", icon: "list", category: "Typography",
    defaultProps: { items: ["Item one", "Item two", "Item three"], ordered: false },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { fontSize: "16px", lineHeight: "2", color: "#71717a", maxWidth: "480px" },
  },

  // ── Buttons ─────────────────────────────────────────────────────────────────
  button: {
    type: "button", label: "Button", icon: "mouse-pointer-click", category: "Buttons",
    defaultProps: { text: "Click Me", variant: "primary", href: "#", size: "md", gradientFrom: "#0ea5e9", gradientTo: "#8b5cf6", gradientAngle: "135" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", cursor: "pointer" },
  },
  "cta-button": {
    type: "cta-button", label: "CTA Button", icon: "zap", category: "Buttons",
    defaultProps: { text: "Get Started Free", subtext: "No credit card required", href: "#" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "9999px", cursor: "pointer" },
  },
  "icon-button": {
    type: "icon-button", label: "Icon Button", icon: "circle-dot", category: "Buttons",
    defaultProps: { icon: "arrow-right", variant: "outline", size: "md" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", cursor: "pointer" },
  },

  // ── Media ───────────────────────────────────────────────────────────────────
  image: {
    type: "image", label: "Image", icon: "image", category: "Media",
    defaultProps: { src: "/placeholder.svg", alt: "Image", objectFit: "cover" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "320px", borderRadius: "12px" },
  },
  video: {
    type: "video", label: "Video", icon: "video", category: "Media",
    defaultProps: { src: "", poster: "", autoplay: false, loop: false, muted: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "480px", borderRadius: "12px" },
  },
  gallery: {
    type: "gallery", label: "Gallery", icon: "image-plus", category: "Media",
    defaultProps: { images: [], columns: 3, gap: "16px" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "100%" },
  },
  slider: {
    type: "slider", label: "Slider", icon: "panel-left-close", category: "Media",
    defaultProps: { slides: [], autoplay: true, interval: 4000, showDots: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "480px", overflow: "hidden", borderRadius: "12px" },
  },

  // ── Forms ───────────────────────────────────────────────────────────────────
  input: {
    type: "input", label: "Input", icon: "text-cursor-input", category: "Forms",
    defaultProps: { label: "Email", placeholder: "your@email.com", type: "email", required: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "320px" },
  },
  textarea: {
    type: "textarea", label: "Textarea", icon: "square-pen", category: "Forms",
    defaultProps: { label: "Message", placeholder: "Your message...", rows: 4 },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "320px" },
  },
  checkbox: {
    type: "checkbox", label: "Checkbox", icon: "check-square", category: "Forms",
    defaultProps: { label: "I agree to the terms", checked: false },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },
  radio: {
    type: "radio", label: "Radio", icon: "circle-dot", category: "Forms",
    defaultProps: { label: "Option", name: "group", value: "option1" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },
  "select-field": {
    type: "select-field", label: "Select", icon: "chevron-down", category: "Forms",
    defaultProps: { label: "Choose option", options: ["Option 1", "Option 2", "Option 3"] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "320px" },
  },

  // ── Marketing ───────────────────────────────────────────────────────────────
  hero: {
    type: "hero", label: "Hero Section", icon: "layout-template", category: "Marketing",
    defaultProps: { heading: "Build Anything", subheading: "The ultimate platform.", ctaText: "Get Started", variant: "gradient", badge: "New Release" },
    canHaveChildren: true, draggable: true, droppable: true, resizable: false,
    defaultStyles: { paddingTop: "120px", paddingBottom: "120px", textAlign: "center", width: "100%" },
  },
  features: {
    type: "features", label: "Features", icon: "star", category: "Marketing",
    defaultProps: { heading: "Everything you need", items: [] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { paddingTop: "80px", paddingBottom: "80px", width: "100%" },
  },
  testimonials: {
    type: "testimonials", label: "Testimonials", icon: "message-square-quote", category: "Marketing",
    defaultProps: { heading: "What people say", items: [] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { paddingTop: "80px", paddingBottom: "80px", width: "100%" },
  },
  faq: {
    type: "faq", label: "FAQ", icon: "help-circle", category: "Marketing",
    defaultProps: { heading: "Frequently Asked Questions", items: [] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { paddingTop: "80px", paddingBottom: "80px", width: "100%" },
  },
  pricing: {
    type: "pricing", label: "Pricing", icon: "badge-dollar-sign", category: "Marketing",
    defaultProps: { heading: "Simple Pricing", plans: [] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { paddingTop: "80px", paddingBottom: "80px", width: "100%" },
  },
  logos: {
    type: "logos", label: "Logo Strip", icon: "building-2", category: "Marketing",
    defaultProps: { heading: "Trusted by teams at", logos: [] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { paddingTop: "60px", paddingBottom: "60px", width: "100%" },
  },
  statistics: {
    type: "statistics", label: "Statistics", icon: "bar-chart-2", category: "Marketing",
    defaultProps: { items: [{ value: "10K+", label: "Users" }, { value: "99%", label: "Uptime" }, { value: "24/7", label: "Support" }] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { paddingTop: "80px", paddingBottom: "80px", width: "100%" },
  },
  team: {
    type: "team", label: "Team", icon: "users", category: "Marketing",
    defaultProps: { heading: "Meet the Team", members: [] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { paddingTop: "80px", paddingBottom: "80px", width: "100%" },
  },
  "cta-section": {
    type: "cta-section", label: "CTA Section", icon: "megaphone", category: "Marketing",
    defaultProps: { heading: "Ready to get started?", subtext: "Join thousands of users.", ctaText: "Start Free Trial" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { paddingTop: "80px", paddingBottom: "80px", textAlign: "center", width: "100%" },
  },
  footer: {
    type: "footer", label: "Footer", icon: "layout-panel-bottom", category: "Marketing",
    defaultProps: { brand: "VisualCraft", links: [], copyright: "© 2025 VisualCraft. All rights reserved." },
    canHaveChildren: true, draggable: true, droppable: true, resizable: false,
    defaultStyles: { paddingTop: "64px", paddingBottom: "32px", width: "100%" },
  },

  // ── Interactive ──────────────────────────────────────────────────────────────
  accordion: {
    type: "accordion", label: "Accordion", icon: "list-collapse", category: "Interactive",
    defaultProps: {
      allowMultiple: false, iconStyle: "plus", gap: "8px",
    },
    canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { width: "100%", display: "flex", flexDirection: "column" },
  },
  "accordion-item": {
    type: "accordion-item", label: "Accordion Item", icon: "chevron-down", category: "Interactive",
    defaultProps: { title: "Question?", defaultOpen: false },
    canHaveChildren: true, draggable: true, droppable: true, resizable: false,
    defaultStyles: { width: "100%", borderRadius: "8px" },
  },
  tabs: {
    type: "tabs", label: "Tabs", icon: "panel-top", category: "Interactive",
    defaultProps: { tabs: [{ label: "Tab 1" }, { label: "Tab 2" }] },
    canHaveChildren: true, draggable: true, droppable: true, resizable: false,
    defaultStyles: { width: "100%" },
  },
  modal: {
    type: "modal", label: "Modal", icon: "square-arrow-out-up-right", category: "Interactive",
    defaultProps: { triggerText: "Open Modal", title: "Modal Title", content: "Modal content" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },
  drawer: {
    type: "drawer", label: "Drawer", icon: "panel-right-open", category: "Interactive",
    defaultProps: { triggerText: "Open Drawer", title: "Drawer", side: "right" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },
  carousel: {
    type: "carousel", label: "Carousel", icon: "gallery-thumbnails", category: "Interactive",
    defaultProps: { items: [], autoplay: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "480px", overflow: "hidden" },
  },
  "card-slider": {
    type: "card-slider", label: "Card Slider", icon: "layout-grid", category: "Interactive",
    defaultProps: {
      cards: [
        { image: "", title: "David Doll", description: "The lorem text the section contains header having open and close functionality.", buttonText: "View More", buttonUrl: "#" },
        { image: "", title: "Rose Bush", description: "The lorem text the section contains header having open and close functionality.", buttonText: "View More", buttonUrl: "#" },
        { image: "", title: "Jones Goi", description: "The lorem text the section contains header having open and close functionality.", buttonText: "View More", buttonUrl: "#" },
      ],
      autoplay: false, visibleCards: 3, gap: 16, accentColor: "#3b82f6",
    },
    canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { width: "100%", overflow: "hidden" },
  },
  counter: {
    type: "counter", label: "Counter", icon: "hash", category: "Interactive",
    defaultProps: { from: 0, to: 1000, suffix: "+", label: "Users", duration: 2 },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { textAlign: "center", width: "fit-content" },
  },
  "progress-bar": {
    type: "progress-bar", label: "Progress Bar", icon: "loader", category: "Interactive",
    defaultProps: { label: "Progress", value: 75, showValue: true, animated: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "320px" },
  },

  // ── Advanced ─────────────────────────────────────────────────────────────────
  marquee: {
    type: "marquee", label: "Marquee", icon: "move-right", category: "Advanced",
    defaultProps: { items: ["Item 1", "Item 2", "Item 3"], speed: 30, direction: "left" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%", overflow: "hidden", paddingTop: "16px", paddingBottom: "16px" },
  },
  timeline: {
    type: "timeline", label: "Timeline", icon: "git-branch", category: "Advanced",
    defaultProps: { items: [{ title: "Step 1", description: "Description", date: "2024" }] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%" },
  },
  "bento-grid": {
    type: "bento-grid", label: "Bento Grid", icon: "grid-3x3", category: "Advanced",
    defaultProps: { items: [] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "100%" },
  },
  "masonry-grid": {
    type: "masonry-grid", label: "Masonry Grid", icon: "layout-dashboard", category: "Advanced",
    defaultProps: { columns: 3, items: [] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%" },
  },
  divider: {
    type: "divider", label: "Divider", icon: "minus", category: "Layout",
    defaultProps: { style: "solid", label: "" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%", borderTop: "1px solid #27272a", marginTop: "16px", marginBottom: "16px" } as Record<string, string>,
  },
  badge: {
    type: "badge", label: "Badge", icon: "tag", category: "Typography",
    defaultProps: { text: "New", variant: "primary" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "inline-flex", alignItems: "center", paddingTop: "4px", paddingBottom: "4px", paddingLeft: "12px", paddingRight: "12px", borderRadius: "9999px", fontSize: "12px", fontWeight: "600" },
  },
  card: {
    type: "card", label: "Card", icon: "credit-card", category: "Layout",
    defaultProps: { title: "Card Title", description: "Card description" },
    canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { borderRadius: "12px", padding: "24px", backgroundColor: "#ffffff", borderWidth: "1px", borderStyle: "solid", borderColor: "#e4e4e7", width: "360px" },
  },
  icon: {
    type: "icon", label: "Icon", icon: "sparkles", category: "Typography",
    defaultProps: { name: "star", size: 24, color: "#0ea5e9" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "inline-flex" },
  },

  // ── Media (extra) ───────────────────────────────────────────────────────────
  audio: {
    type: "audio", label: "Audio", icon: "volume-2", category: "Media",
    defaultProps: { src: "", autoplay: false, loop: false, controls: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "320px" },
  },
  embed: {
    type: "embed", label: "Embed / iFrame", icon: "code-2", category: "Media",
    defaultProps: { src: "", title: "Embedded content", aspectRatio: "16/9" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "480px", borderRadius: "12px", overflow: "hidden" },
  },
  map: {
    type: "map", label: "Map", icon: "map-pin", category: "Media",
    defaultProps: { src: "", address: "New York, NY", zoom: 14 },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "480px", height: "400px", borderRadius: "12px", overflow: "hidden" },
  },

  // ── Forms (extra) ──────────────────────────────────────────────────────────
  form: {
    type: "form", label: "Form", icon: "file-text", category: "Forms",
    defaultProps: { action: "", method: "POST" },
    canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { display: "flex", flexDirection: "column", gap: "16px", width: "100%" },
  },
  "file-upload": {
    type: "file-upload", label: "File Upload", icon: "upload", category: "Forms",
    defaultProps: { label: "Upload file", accept: "*", multiple: false },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "320px" },
  },
  "range-slider": {
    type: "range-slider", label: "Range Slider", icon: "sliders-horizontal", category: "Forms",
    defaultProps: { label: "Volume", min: 0, max: 100, value: 50, step: 1 },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "320px" },
  },
  switch: {
    type: "switch", label: "Switch / Toggle", icon: "toggle-left", category: "Forms",
    defaultProps: { label: "Enable notifications", checked: false },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },
  "date-picker": {
    type: "date-picker", label: "Date Picker", icon: "calendar", category: "Forms",
    defaultProps: { label: "Select date", placeholder: "YYYY-MM-DD" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "280px" },
  },

  // ── Navigation ─────────────────────────────────────────────────────────────
  navbar: {
    type: "navbar", label: "Navbar", icon: "panel-top", category: "Layout",
    defaultProps: {
      brand: "Brand",
      links: [
        { text: "Home", href: "#" },
        { text: "About", href: "#", children: [{ text: "Team", href: "#" }, { text: "Story", href: "#" }] },
        { text: "Contact", href: "#" },
      ],
      sticky: true,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%", paddingTop: "16px", paddingBottom: "16px", position: "relative", zIndex: "50", boxSizing: "border-box" },
  },
  breadcrumb: {
    type: "breadcrumb", label: "Breadcrumb", icon: "chevrons-right", category: "Layout",
    defaultProps: { items: [{ text: "Home", href: "#" }, { text: "Products", href: "#" }, { text: "Current" }] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%" },
  },
  pagination: {
    type: "pagination", label: "Pagination", icon: "more-horizontal", category: "Layout",
    defaultProps: {
      totalPages: 5, currentPage: 1, maxVisible: 7,
      showPrevNext: true, showFirstLast: false,
      prevLabel: "←", nextLabel: "→",
      shape: "rounded", size: "md", variant: "outlined",
      activeColor: "", align: "center",
    },
    canHaveChildren: true, draggable: true, droppable: true, resizable: true,
    defaultStyles: { width: "100%", minHeight: "300px", display: "flex", flexDirection: "column" },
  },
  "sidebar-nav": {
    type: "sidebar-nav", label: "Sidebar Nav", icon: "panel-left", category: "Layout",
    defaultProps: { title: "Menu", links: [{ text: "Dashboard", href: "#", active: true }, { text: "Settings", href: "#" }, { text: "Profile", href: "#" }] },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "240px", paddingTop: "16px", paddingBottom: "16px" },
  },
  menu: {
    type: "menu", label: "Menu / Links", icon: "list-ordered", category: "Layout",
    defaultProps: { links: [{ text: "Home", href: "#" }, { text: "About", href: "#" }, { text: "Services", href: "#" }, { text: "Contact", href: "#" }], direction: "horizontal" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },

  // ── Content ────────────────────────────────────────────────────────────────
  link: {
    type: "link", label: "Link", icon: "external-link", category: "Typography",
    defaultProps: { text: "Click here", href: "#", target: "_self", underline: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { color: "#0ea5e9", fontSize: "16px" },
  },
  "social-links": {
    type: "social-links", label: "Social Links", icon: "share-2", category: "Typography",
    defaultProps: { links: [{ platform: "twitter", url: "#" }, { platform: "github", url: "#" }, { platform: "linkedin", url: "#" }], size: 20 },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "flex", gap: "12px" },
  },
  rating: {
    type: "rating", label: "Rating", icon: "star", category: "Interactive",
    defaultProps: { value: 4, max: 5, size: 20, color: "#f59e0b" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "inline-flex", gap: "4px" },
  },
  avatar: {
    type: "avatar", label: "Avatar", icon: "user-circle", category: "Typography",
    defaultProps: { src: "", name: "John Doe", size: "md" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },
  "avatar-group": {
    type: "avatar-group", label: "Avatar Group", icon: "users", category: "Typography",
    defaultProps: { avatars: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }], max: 3, size: "md" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "flex" },
  },
  tooltip: {
    type: "tooltip", label: "Tooltip", icon: "message-circle", category: "Interactive",
    defaultProps: { text: "Hover me", tooltip: "This is a tooltip", position: "top" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },
  alert: {
    type: "alert", label: "Alert / Notice", icon: "alert-triangle", category: "Interactive",
    defaultProps: { title: "Heads up!", message: "This is an important notice.", variant: "info", dismissible: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%" },
  },
  "tag-group": {
    type: "tag-group", label: "Tags / Pills", icon: "tags", category: "Typography",
    defaultProps: { tags: ["React", "Next.js", "TypeScript", "Tailwind"], variant: "primary" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { display: "flex", flexWrap: "wrap", gap: "8px" },
  },
  table: {
    type: "table", label: "Table", icon: "table-2", category: "Advanced",
    defaultProps: { headers: ["Name", "Email", "Role"], rows: [["John", "john@example.com", "Admin"], ["Jane", "jane@example.com", "Editor"]], striped: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%" },
  },
  "code-block": {
    type: "code-block", label: "Code Block", icon: "terminal", category: "Typography",
    defaultProps: { code: "const hello = 'world';\nconsole.log(hello);", language: "javascript" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "480px", borderRadius: "8px", overflow: "hidden" },
  },

  // ── Marketing (extra) ──────────────────────────────────────────────────────
  newsletter: {
    type: "newsletter", label: "Newsletter", icon: "mail", category: "Marketing",
    defaultProps: { heading: "Stay in the loop", subtext: "Get updates in your inbox.", buttonText: "Subscribe", placeholder: "your@email.com" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%", paddingTop: "60px", paddingBottom: "60px", textAlign: "center" },
  },
  "contact-form": {
    type: "contact-form", label: "Contact Form", icon: "send", category: "Marketing",
    defaultProps: { heading: "Get in touch", fields: ["name", "email", "message"], buttonText: "Send Message" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "480px" },
  },
  banner: {
    type: "banner", label: "Banner", icon: "flag", category: "Marketing",
    defaultProps: { text: "🎉 Special offer — 50% off for a limited time!", linkText: "Learn more", href: "#", variant: "info", dismissible: true },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%" },
  },

  // ── Interactive (extra) ────────────────────────────────────────────────────
  popover: {
    type: "popover", label: "Popover", icon: "message-square", category: "Interactive",
    defaultProps: { triggerText: "Click me", content: "Popover content here", position: "bottom" },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: {},
  },
  steps: {
    type: "steps", label: "Steps / Stepper", icon: "list-ordered", category: "Interactive",
    defaultProps: { steps: [{ title: "Step 1", description: "Details" }, { title: "Step 2", description: "Details" }, { title: "Step 3", description: "Details" }], currentStep: 1 },
    canHaveChildren: false, draggable: true, droppable: false, resizable: false,
    defaultStyles: { width: "100%" },
  },

  // ── 3D ──────────────────────────────────────────────────────────────────────
  "floating-objects": {
    type: "floating-objects", label: "Floating Objects", icon: "box", category: "3D",
    defaultProps: {
      count: 8, shape: "sphere", color: "#0ea5e9", speed: 1, metalness: 0.6, roughness: 0.3, opacity: 0.85,
      spread: 2, floatIntensity: 1.5, mixShapes: false,
      lightAngleX: 5, lightAngleY: 5, lightIntensity: 0.8, ambientIntensity: 0.6,
      castShadows: false, mouseParallax: false, mouseIntensity: 1, cameraFov: 50, cameraZoom: 6,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "interactive-shapes": {
    type: "interactive-shapes", label: "Interactive Shapes", icon: "triangle", category: "3D",
    defaultProps: {
      shape: "torus", color: "#d946ef", wireframe: false, metalness: 0.8, roughness: 0.2,
      distort: 0.3, distortSpeed: 2, autoRotate: true, autoRotateSpeed: 1, enableZoom: false,
      shapeScale: 1, emissiveIntensity: 0,
      lightAngleX: 5, lightAngleY: 5, lightIntensity: 1, ambientIntensity: 0.5,
      castShadows: false, mouseParallax: false, mouseIntensity: 1, cameraFov: 50, cameraZoom: 5,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "400px" },
  },
  "3d-hero": {
    type: "3d-hero", label: "3D Hero", icon: "layers-3", category: "3D",
    defaultProps: {
      heading: "Next Level Design", subheading: "Build something amazing", variant: "floating",
      fontSize: 3, showSubheading: false, shapeScale: 1, shapeOpacity: 0.7, animationSpeed: 1, distort: 0.4,
      lightAngleX: 5, lightAngleY: 5, lightIntensity: 0.8, ambientIntensity: 0.4,
      mouseParallax: false, mouseIntensity: 1, cameraFov: 50,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "600px", position: "relative" },
  },
  "particle-system": {
    type: "particle-system", label: "Particle System", icon: "sparkles", category: "3D",
    defaultProps: { count: 500, color: "#0ea5e9", size: 0.05, speed: 0.3 },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  globe: {
    type: "globe", label: "Globe", icon: "globe", category: "3D",
    defaultProps: {
      color: "#0ea5e9", autoRotate: true, showDots: true, rotateSpeed: 0.15,
      dotSize: 0.02, dotOpacity: 0.6, lineOpacity: 0.2, showLines: true, enableZoom: false,
      dotCount: 2000, globeOpacity: 0.15, globeMetalness: 0.3, globeRoughness: 0.5, glowIntensity: 0,
      lightAngleX: 5, lightAngleY: 3, lightIntensity: 0.8, ambientIntensity: 0.6,
      mouseParallax: false, mouseIntensity: 1, cameraFov: 45, cameraZoom: 4.5,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "product-showcase": {
    type: "product-showcase", label: "Product Showcase", icon: "box-select", category: "3D",
    defaultProps: {
      color: "#0ea5e9", accentColor: "#333", metalness: 0.9, roughness: 0.05, clearcoat: 1,
      autoRotate: true, autoRotateSpeed: 0.5, enableZoom: false, environment: "studio",
      productScale: 1, floatSpeed: 1.5, floatIntensity: 0.8,
      lightAngleX: 5, lightAngleY: 5, lightIntensity: 1, ambientIntensity: 0.4,
      castShadows: true, mouseParallax: false, mouseIntensity: 1, cameraFov: 45, cameraZoom: 5.5,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "gradient-blob": {
    type: "gradient-blob", label: "Gradient Blob", icon: "circle-dot", category: "3D",
    defaultProps: {
      color1: "#6366f1", color2: "#ec4899", speed: 2, distort: 0.4, scale: 2.2, opacity: 0.9,
      metalness: 0.3, roughness: 0.2, lightAngleX: 5, lightAngleY: 5, lightIntensity: 1, ambientIntensity: 0.5,
      mouseParallax: false, mouseIntensity: 1,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "wave-terrain": {
    type: "wave-terrain", label: "Wave Terrain", icon: "waves", category: "3D",
    defaultProps: {
      color: "#0ea5e9", wireframe: false, speed: 1, waveHeight: 0.5, waveFrequency: 3,
      metalness: 0.4, roughness: 0.3, opacity: 0.9, gridSize: 80,
      lightAngleX: 2, lightAngleY: 5, lightIntensity: 1, ambientIntensity: 0.4,
      mouseParallax: false, mouseIntensity: 1, enableZoom: false,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  aurora: {
    type: "aurora", label: "Aurora", icon: "rainbow", category: "3D",
    defaultProps: {
      color1: "#22d3ee", color2: "#8b5cf6", color3: "#34d399",
      speed: 0.8, ribbonCount: 5, opacity: 0.35, waveAmplitude: 0.8,
      lightIntensity: 0.6, ambientIntensity: 0.3, mouseParallax: false, mouseIntensity: 1,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "morph-sphere": {
    type: "morph-sphere", label: "Morph Sphere", icon: "atom", category: "3D",
    defaultProps: {
      color: "#6366f1", speed: 1, noiseScale: 1.5, noiseStrength: 0.3,
      metalness: 0.6, roughness: 0.2, wireframe: false, emissiveIntensity: 0,
      lightAngleX: 5, lightAngleY: 5, lightIntensity: 1, ambientIntensity: 0.5,
      mouseParallax: false, mouseIntensity: 1, autoRotate: true, enableZoom: false,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "glass-layers": {
    type: "glass-layers", label: "Glass Layers", icon: "layers", category: "3D",
    defaultProps: {
      color1: "#6366f1", color2: "#0ea5e9", color3: "#ec4899",
      layerCount: 5, gap: 0.6, rotateX: -15, rotateY: 25, speed: 1,
      opacity: 0.4, metalness: 0.1, roughness: 0.05,
      lightAngleX: 5, lightAngleY: 5, lightIntensity: 1, ambientIntensity: 0.5,
      mouseParallax: false, mouseIntensity: 1,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "perspective-grid": {
    type: "perspective-grid", label: "Perspective Grid", icon: "grid-3x3", category: "3D",
    defaultProps: {
      color: "#0ea5e9", lineOpacity: 0.3, dotSize: 0.05, gridSize: 20,
      speed: 0.5, waveHeight: 0.3, showDots: true, showLines: true,
      lightIntensity: 0.5, ambientIntensity: 0.3, mouseParallax: true, mouseIntensity: 1,
      glowIntensity: 0,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "tube-ring": {
    type: "tube-ring", label: "Tube Ring", icon: "disc", category: "3D",
    defaultProps: {
      color: "#6366f1", wireframe: false, speed: 1, tubeRadius: 0.35, ringRadius: 1.5,
      metalness: 0.7, roughness: 0.15, distort: 0.2, emissiveIntensity: 0.3,
      lightAngleX: 5, lightAngleY: 5, lightIntensity: 1, ambientIntensity: 0.4,
      mouseParallax: false, mouseIntensity: 1, autoRotate: false, enableZoom: false,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },
  "light-trails": {
    type: "light-trails", label: "Light Trails", icon: "sparkles", category: "3D",
    defaultProps: {
      color1: "#0ea5e9", color2: "#8b5cf6", color3: "#ec4899",
      trailCount: 6, speed: 1, trailLength: 1.5, spread: 2, glowIntensity: 0.5,
      ambientIntensity: 0.2, mouseParallax: true, mouseIntensity: 1,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%", height: "500px" },
  },

  // ── Animated ────────────────────────────────────────────────────────────────
  "horizontal-scroll": {
    type: "horizontal-scroll", label: "Horizontal Scroll", icon: "arrow-right-left", category: "Animated",
    defaultProps: {
      cards: [
        { title: "Project Alpha", category: "DESIGN", src: "", placeholder: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600" },
        { title: "Project Beta", category: "DEVELOPMENT", src: "", placeholder: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600" },
        { title: "Project Gamma", category: "BRANDING", src: "", placeholder: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600" },
        { title: "Project Delta", category: "ARCHITECTURE", src: "", placeholder: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600" },
      ],
      cardWidth: "420px", gap: "48px", aspectRatio: "16/10",
      showLabels: true, borderRadius: "16px", overlayColor: "rgba(0,0,0,0.3)",
      bgColor: "transparent",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%" },
  },
  "vertical-scroll-cards": {
    type: "vertical-scroll-cards", label: "Vertical Scroll Cards", icon: "arrow-down-up", category: "Animated",
    defaultProps: {
      heading: "Why\nSmooth\nScroll?", headingSize: "72px",
      accentColor: "#f43f5e", accentWidth: "5px",
      cards: [
        { title: "CREATE MORE IMMERSIVE INTERFACES", description: "Unlock the creative potential and impact of your web experiences." },
        { title: "FLAWLESS KINETIC ALIGNMENT", description: "Synchronize your visual elements with scroll movement." },
        { title: "OPTIMIZE MOBILE PERFORMANCE", description: "Ensure a lightweight experience on touch-sensitive devices." },
      ],
      bgColor: "transparent",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%" },
  },
  "text-zoom-scroll": {
    type: "text-zoom-scroll", label: "Text Zoom Scroll", icon: "zoom-in", category: "Animated",
    defaultProps: {
      line1: "BUILT TO", line2: "ENTER", line3: "LENIS FLOW",
      fontSize: "13vw", bgColor: "transparent", textColor: "#0a0a0a",
      revealBg: "transparent", revealTextColor: "#0a0a0a",
      revealTitle: "Thank You.", revealSubtitle: "Project Sequence Terminal // Complete",
      revealDescription: "The core architecture handles all constraints smoothly.",
      headerLeft: "Ecosystem Module // 03", headerRight: "Web Scrolling Engine",
      footerLeft: "As It Should Be", footerRight: "Runtime Context // 2026",
      autoPlay: true, zoomDuration: 5,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%" },
  },
  "story-scroll": {
    type: "story-scroll", label: "Story Scroll", icon: "scroll-text", category: "Animated",
    defaultProps: {
      heading: "Transforming visions into,\ndigital reality.",
      subheading: "FUTURE-READY INNOVATION",
      promises: [
        { id: 1, num: "01", subtitle: "CORE PILLAR", title: "Scalable Architecture", desc: "Cloud-native solutions designed to adapt and expand alongside your growing business needs seamlessly.", glowColor: "rgba(245, 158, 11, 0.15)" },
        { id: 2, num: "02", subtitle: "CORE PILLAR", title: "Data-Driven Insights", desc: "Leveraging advanced analytics and AI to turn complex data into actionable strategies and clear advantages.", glowColor: "rgba(245, 158, 11, 0.15)" },
        { id: 3, num: "03", subtitle: "CORE PILLAR", title: "Uncompromised Security", desc: "Enterprise-grade encryption and continuous monitoring to ensure your digital assets are protected around the clock.", glowColor: "rgba(245, 158, 11, 0.15)" },
      ],
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%" },
  },
  "normal-story-carousel": {
    type: "normal-story-carousel", label: "Normal Story Carousel", icon: "gallery-horizontal", category: "Animated",
    defaultProps: {
      heading: "Selected Work",
      items: [
        { id: 1, title: "Jaipuria Convocation Film", category: "Production, Video Editing, Cinematography", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200" },
        { id: 2, title: "AdiDev Press", category: "Social Media, Graphic Design, Ecommerce", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200" },
        { id: 3, title: "Calendar Showcase", category: "Photography, Art Direction, Editorial", image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200" },
        { id: 4, title: "Corporate Identity", category: "Branding, Typography, Interactive", image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200" },
        { id: 5, title: "Cinematic Narratives", category: "Film Production, Sound Design", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200" },
      ],
      itemWidth: "40%",
      aspectRatio: "16/10",
      gap: "32px",
      borderRadius: "24px",
      showTitle: true,
      showCategory: true,
      showDots: true,
      overlayOnHover: true,
      padding: "96px 24px",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%" },
  },
  "text-reveal": {
    type: "text-reveal", label: "Text Reveal Scroll", icon: "type", category: "Animated",
    defaultProps: {
      text: "We are a creative agency driven by the power of imagination and precision. We believe in designing digital products that not only look spectacular but work flawlessly. Every pixel we place, every line of code we write, and every interaction we design is crafted with deep intention and purpose. Our work spans branding, web development, photography, and interactive storytelling. Together, we push boundaries to craft experiences that inspire, engage, and connect with people globally.",
      scrollHeight: "150vh",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { width: "100%" },
  },

  // ── Waves ────────────────────────────────────────────────────────────────
  // Decorative animated SVG waves. Dropped inside a section, they auto-anchor
  // to the bottom via absolute positioning and sit behind sibling content
  // (zIndex: -1 within the section's stacking context).
  "wave-1": {
    type: "wave-1", label: "Wave · Sine", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-1",
      color: "#0ea5e9", secondaryColor: "#38bdf8", tertiaryColor: "#7dd3fc",
      height: "180px", opacity: "1",
      animationEnabled: true, animationSpeed: 12, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.6",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "180px", zIndex: "0" },
  },
  "wave-2": {
    type: "wave-2", label: "Wave · Cloth", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-2",
      color: "#8b5cf6", secondaryColor: "#a78bfa", tertiaryColor: "#c4b5fd",
      height: "220px", opacity: "1",
      animationEnabled: true, animationSpeed: 15, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.55", layerCount: 22,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "200px", zIndex: "0" },
  },
  "wave-3": {
    type: "wave-3", label: "Wave · Ocean", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-3",
      color: "#0284c7", secondaryColor: "#0ea5e9", tertiaryColor: "#7dd3fc",
      height: "220px", opacity: "1",
      animationEnabled: true, animationSpeed: 18, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.55",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "220px", zIndex: "0" },
  },
  "wave-4": {
    type: "wave-4", label: "Wave · Fluid", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-4",
      color: "#ec4899", secondaryColor: "#f472b6", tertiaryColor: "#f9a8d4",
      height: "150px", opacity: "1",
      animationEnabled: false, animationSpeed: 10, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.6",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "150px", zIndex: "0" },
  },
  "wave-5": {
    type: "wave-5", label: "Wave · Silk", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-5",
      color: "#0ea5e9", secondaryColor: "#38bdf8", tertiaryColor: "#7dd3fc",
      height: "260px", opacity: "1",
      animationEnabled: true, animationSpeed: 14, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.5", layerCount: 26,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "170px", zIndex: "0" },
  },
  "wave-6": {
    type: "wave-6", label: "Wave · Deep", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-6",
      color: "#14b8a6", secondaryColor: "#2dd4bf", tertiaryColor: "#5eead4",
      height: "230px", opacity: "1",
      animationEnabled: true, animationSpeed: 20, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.55",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "230px", zIndex: "0" },
  },
  "wave-7": {
    type: "wave-7", label: "Wave · Ribbon", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-7",
      color: "#ef4444", secondaryColor: "#f87171", tertiaryColor: "#fca5a5",
      height: "220px", opacity: "1",
      animationEnabled: true, animationSpeed: 14, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.55", layerCount: 9,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "200px", zIndex: "0" },
  },
  "wave-8": {
    type: "wave-8", label: "Wave · Threads", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-8",
      color: "#eab308", secondaryColor: "#facc15", tertiaryColor: "#fde047",
      height: "180px", opacity: "1",
      animationEnabled: true, animationSpeed: 10, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.6", layerCount: 11,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "160px", zIndex: "0" },
  },
  "wave-9": {
    type: "wave-9", label: "Wave · Aurora", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-9",
      color: "#22c55e", secondaryColor: "#8b5cf6", tertiaryColor: "#22d3ee",
      height: "280px", opacity: "1",
      animationEnabled: true, animationSpeed: 22, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.65", layerCount: 30,
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "210px", zIndex: "0" },
  },
  "wave-10": {
    type: "wave-10", label: "Wave · Sweep", icon: "waves", category: "Waves",
    defaultProps: {
      waveType: "wave-10",
      color: "#22c55e", secondaryColor: "#4ade80", tertiaryColor: "#86efac",
      height: "190px", opacity: "1",
      animationEnabled: true, animationSpeed: 13, animationDirection: "left",
      flipHorizontal: false, flipVertical: false,
      position: "bottom", layerOpacity: "0.55",
    },
    canHaveChildren: false, draggable: true, droppable: false, resizable: true,
    defaultStyles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "190px", zIndex: "0" },
  },
}

export function getComponentMeta(type: ComponentType): ComponentMeta {
  return registry[type]
}

export function getAllComponents(): ComponentMeta[] {
  return Object.values(registry)
}

export function getComponentsByCategory(category: ComponentMeta["category"]): ComponentMeta[] {
  return Object.values(registry).filter((c) => c.category === category)
}

export { registry as componentRegistry }
