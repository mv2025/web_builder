interface PricingPlan {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  cta?: string
  popular?: boolean
}

interface PricingBlockProps {
  heading?: string
  subheading?: string
  plans?: PricingPlan[]
  breakpoint?: string
  [key: string]: unknown
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Free", price: "$0", period: "/mo",
    description: "Perfect for individuals and small projects.",
    features: ["5 projects", "100 components", "PNG export", "Community support"],
    cta: "Start for Free",
  },
  {
    name: "Pro", price: "$29", period: "/mo",
    description: "For professionals who need more power.",
    features: ["Unlimited projects", "All components", "React & Next.js export", "Custom domains", "Priority support", "Animation builder"],
    cta: "Get Pro", popular: true,
  },
  {
    name: "Agency", price: "$99", period: "/mo",
    description: "For teams and agencies building at scale.",
    features: ["Everything in Pro", "10 team members", "White-label option", "API access", "Dedicated support", "Custom integrations"],
    cta: "Contact Sales",
  },
]

export function PricingBlock({
  heading = "Simple, transparent pricing",
  subheading = "No hidden fees. No surprises. Cancel anytime.",
  plans = DEFAULT_PLANS,
  breakpoint = "desktop",
}: PricingBlockProps) {
  const cols = breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : 3
  return (
    <section style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: breakpoint === "mobile" ? "32px" : "64px" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "12px" }}>
          {heading}
        </h2>
        <p style={{ fontSize: "1.1em", opacity: 0.5 }}>{subheading}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: breakpoint === "mobile" ? "16px" : "24px", alignItems: "start" }}>
        {plans.map((plan, i) => (
          <div key={i} style={{
            padding: "28px", borderRadius: "inherit",
            background: plan.popular ? "rgba(128,128,128,0.08)" : "rgba(128,128,128,0.03)",
            border: plan.popular ? "2px solid currentColor" : "1px solid rgba(128,128,128,0.15)",
            position: "relative",
          }}>
            {plan.popular && (
              <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "currentColor", fontSize: "0.7em", fontWeight: 700, padding: "4px 12px", borderRadius: "9999px" }}>
                <span style={{ color: "#fff", mixBlendMode: "difference" }}>Most Popular</span>
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontWeight: 600, opacity: 0.6, marginBottom: "8px" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                <span style={{ fontSize: "2.5em", fontWeight: 800 }}>{plan.price}</span>
                {plan.period && <span style={{ fontSize: "0.875em", opacity: 0.5 }}>{plan.period}</span>}
              </div>
              {plan.description && <p style={{ fontSize: "0.8em", opacity: 0.5, marginTop: "8px" }}>{plan.description}</p>}
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {plan.features.map((f, j) => (
                <li key={j} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875em", opacity: 0.8 }}>
                  ✓ {f}
                </li>
              ))}
            </ul>

            <button style={{
              width: "100%", padding: "12px", borderRadius: "inherit", border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: "inherit",
              background: plan.popular ? "currentColor" : "rgba(128,128,128,0.15)",
              fontWeight: 600,
            }}>
              {plan.popular ? <span style={{ color: "#fff", mixBlendMode: "difference" }}>{plan.cta ?? "Get Started"}</span> : <span style={{ color: "inherit" }}>{plan.cta ?? "Get Started"}</span>}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
