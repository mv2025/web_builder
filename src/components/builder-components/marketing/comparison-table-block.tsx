interface ComparisonPlan {
  name: string
  price?: string
  highlighted?: boolean
}

interface ComparisonFeature {
  name: string
  category?: string
  values: (boolean | string)[]
}

interface ComparisonTableBlockProps {
  heading?: string
  subheading?: string
  plans?: ComparisonPlan[]
  features?: ComparisonFeature[]
  accentColor?: string
  breakpoint?: "desktop" | "tablet" | "mobile"
  [key: string]: unknown
}

const DEFAULT_PLANS: ComparisonPlan[] = [
  { name: "Free", price: "$0/mo" },
  { name: "Pro", price: "$29/mo", highlighted: true },
  { name: "Enterprise", price: "Custom" },
]

const DEFAULT_FEATURES: ComparisonFeature[] = [
  { name: "Projects", category: "Usage", values: ["3", "Unlimited", "Unlimited"] },
  { name: "Team members", category: "Usage", values: ["1", "5", "Unlimited"] },
  { name: "Storage", category: "Usage", values: ["1 GB", "50 GB", "Unlimited"] },
  { name: "Custom domain", category: "Features", values: [false, true, true] },
  { name: "Analytics", category: "Features", values: [false, true, true] },
  { name: "API access", category: "Features", values: [false, false, true] },
  { name: "Priority support", category: "Support", values: [false, true, true] },
  { name: "Dedicated account manager", category: "Support", values: [false, false, true] },
  { name: "SLA", category: "Support", values: [false, false, true] },
]

export function ComparisonTableBlock({
  heading = "Compare plans",
  subheading = "Find the perfect plan for your needs",
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
  accentColor = "#0ea5e9",
  breakpoint = "desktop",
}: ComparisonTableBlockProps) {
  const isMobile = breakpoint === "mobile"
  const isTablet = breakpoint === "tablet"

  const categories = [...new Set(features.map(f => f.category).filter(Boolean))]
  const cellPad = isMobile ? "10px 8px" : "14px 16px"
  const fontSize = isMobile ? "12px" : isTablet ? "13px" : "14px"
  const borderColor = "rgba(128,128,128,0.15)"

  return (
    <section style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", boxSizing: "border-box" }}>
      {(heading || subheading) && (
        <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "48px" }}>
          {heading && (
            <h2 style={{
              fontSize: isMobile ? "26px" : isTablet ? "34px" : "42px",
              fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "12px", lineHeight: 1.15,
            }}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p style={{ fontSize: isMobile ? "13px" : "16px", opacity: 0.5 }}>{subheading}</p>
          )}
        </div>
      )}

      <div style={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
        <table style={{
          width: "100%", borderCollapse: "collapse", fontSize,
          fontFamily: "inherit", color: "inherit", minWidth: isMobile ? "500px" : undefined,
        }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
              <th style={{ padding: cellPad, textAlign: "left", fontWeight: 600, width: "35%" }}>
                Features
              </th>
              {plans.map((plan, i) => (
                <th key={i} style={{
                  padding: cellPad, textAlign: "center", fontWeight: 700,
                  background: plan.highlighted ? `${accentColor}10` : undefined,
                  borderLeft: `1px solid ${borderColor}`,
                }}>
                  <div style={{ fontSize: isMobile ? "14px" : "16px" }}>{plan.name}</div>
                  {plan.price && (
                    <div style={{ fontSize: isMobile ? "11px" : "12px", opacity: 0.5, fontWeight: 400, marginTop: "2px" }}>
                      {plan.price}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.length > 0
              ? categories.map(cat => (
                  <CategoryGroup
                    key={cat}
                    category={cat!}
                    features={features.filter(f => f.category === cat)}
                    plans={plans}
                    cellPad={cellPad}
                    borderColor={borderColor}
                    accentColor={accentColor}
                  />
                ))
              : features.map((feat, i) => (
                  <FeatureRow
                    key={i}
                    feature={feat}
                    plans={plans}
                    cellPad={cellPad}
                    borderColor={borderColor}
                    accentColor={accentColor}
                    isLast={i === features.length - 1}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CategoryGroup({
  category, features, plans, cellPad, borderColor, accentColor,
}: {
  category: string
  features: ComparisonFeature[]
  plans: ComparisonPlan[]
  cellPad: string
  borderColor: string
  accentColor: string
}) {
  return (
    <>
      <tr>
        <td
          colSpan={plans.length + 1}
          style={{
            padding: `${cellPad}`,
            fontWeight: 700, fontSize: "0.8em",
            textTransform: "uppercase", letterSpacing: "0.08em",
            opacity: 0.5, borderBottom: `1px solid ${borderColor}`,
            background: "rgba(128,128,128,0.03)",
          }}
        >
          {category}
        </td>
      </tr>
      {features.map((feat, i) => (
        <FeatureRow
          key={i}
          feature={feat}
          plans={plans}
          cellPad={cellPad}
          borderColor={borderColor}
          accentColor={accentColor}
          isLast={false}
        />
      ))}
    </>
  )
}

function FeatureRow({
  feature, plans, cellPad, borderColor, accentColor, isLast,
}: {
  feature: ComparisonFeature
  plans: ComparisonPlan[]
  cellPad: string
  borderColor: string
  accentColor: string
  isLast: boolean
}) {
  return (
    <tr style={{ borderBottom: isLast ? "none" : `1px solid ${borderColor}` }}>
      <td style={{ padding: cellPad, opacity: 0.8 }}>{feature.name}</td>
      {feature.values.map((val, i) => (
        <td key={i} style={{
          padding: cellPad, textAlign: "center",
          borderLeft: `1px solid ${borderColor}`,
          background: plans[i]?.highlighted ? `${accentColor}08` : undefined,
        }}>
          {typeof val === "boolean" ? (
            val ? (
              <span style={{ color: accentColor, fontWeight: 700 }}>✓</span>
            ) : (
              <span style={{ opacity: 0.25 }}>—</span>
            )
          ) : (
            <span style={{ fontWeight: 500 }}>{val}</span>
          )}
        </td>
      ))}
    </tr>
  )
}
