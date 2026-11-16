export const AIS_QUOTE_FORM_KINDS = ["fullscreen", "hero", "contact", "service", "location"] as const
export type AisQuoteFormKind = (typeof AIS_QUOTE_FORM_KINDS)[number]

/** Fieldtaskpro lead forms for AIS Environmental Inc. */
export const AIS_QUOTE_FORM_TOKENS: Record<AisQuoteFormKind, string> = {
  fullscreen: "a5bd41e6ae2d2bfdf34931d67c44b44a",
  hero: "1457814a266fdfdf6f5d35cb31be7791",
  contact: "741710e6ae59458396a6b983e7028d33",
  service: "b93d05cd1a5731ff5f4f6105a033ab57",
  location: "60ed1488cc455867e456d3da31c289e3",
}

export function isAisQuoteFormKind(value: unknown): value is AisQuoteFormKind {
  return typeof value === "string" && (AIS_QUOTE_FORM_KINDS as readonly string[]).includes(value)
}

export function aisQuoteFormSubmitUrl(kind: AisQuoteFormKind) {
  return `https://fieldtaskpro.com/api/public/crm-lead/${AIS_QUOTE_FORM_TOKENS[kind]}`
}

export function aisQuoteFormKindFromPath(pathname: string): AisQuoteFormKind {
  const path = pathname.replace(/\/+$/, "") || "/"
  if (path === "/") return "hero"
  if (path === "/contact" || path === "/contact/") return "contact"
  if (path.startsWith("/service-areas/")) return "location"
  if (path === "/get-a-quote" || path === "/get-a-quote/") return "fullscreen"
  return "service"
}

/** Same service options as A&B / Fieldtaskpro AIS forms. */
export const LEAD_SERVICES = [
  "Asbestos Inspection",
  "Asbestos Removal",
  "Asbestos Survey",
  "Lead Paint Inspection",
  "Lead Paint Removal",
  "Mold Testing",
  "Mold Remediation",
  "Water Damage Restoration",
  "Windows / Doors",
  "Roofing",
  "Siding / Gutters",
  "Other",
] as const

export const LEAD_PROPERTY_TYPES = ["Residential", "Commercial", "Mixed Use", "Other"] as const

export const LEAD_TIMELINES = [
  "ASAP",
  "This Month",
  "Next 30-60 Days",
  "Planning Ahead",
  "Not Sure",
] as const

export type LeadFormPayload = {
  name: string
  email: string
  phone: string
  service: string
  timeline: string
  description: string
  propertyAddress: string
  city: string
  state: string
  zipCode: string
  propertyType: string
  formKind?: AisQuoteFormKind
}
