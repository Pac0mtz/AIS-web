declare module '../../server/page-meta.mjs' {
  export function getPageMeta(pathname: string): {
    pathname: string
    title: string
    description: string
    h1: string
    slogan: string
    robots: string
    canonical: string
    image: string
    kind: string
    found: boolean
  }
  export function imageAttributes(urlPath: string): { width?: number; height?: number }
}

declare module './quote-conversion.mjs' {
  export function createQuoteConversionScheduler(options: {
    getItem: () => string
    setItem: (value: string) => void
    send: () => void
    setTimeout: (fn: () => void, ms: number) => number
    clearTimeout: (id: number) => void
  }): () => () => void
  export function callClickEvents(href: string, ids: { adsId: string; ga4Id: string }): Array<{ name: string; params: Record<string, string> }>
  export function spaPageViewEvents(pathname: string, ids: { adsId: string; ga4Id: string }): Array<{ name: string; params: Record<string, string> }>
}

declare module './tracking-ids.mjs' {
  export const GOOGLE_ADS_ID: string
  export const GA4_MEASUREMENT_ID: string
  export const REQUEST_QUOTE_CONVERSION_LABEL: string
}
