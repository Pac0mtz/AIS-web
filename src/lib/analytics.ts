import { callClickEvents, createQuoteConversionScheduler, spaPageViewEvents } from './quote-conversion.mjs'
import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID, REQUEST_QUOTE_CONVERSION_LABEL } from './tracking-ids.mjs'

export { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID, REQUEST_QUOTE_CONVERSION_LABEL }

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const QUOTE_CONVERSION_KEY = 'ais-request-quote-conversion'
let phoneTrackingInstalled = false

function storageGet() {
  try { return sessionStorage.getItem(QUOTE_CONVERSION_KEY) || '' } catch { return '' }
}

function storageSet(value: string) {
  try { sessionStorage.setItem(QUOTE_CONVERSION_KEY, value) } catch { /* private mode */ }
}

const scheduleQuoteConversion = createQuoteConversionScheduler({
  getItem: storageGet,
  setItem: storageSet,
  send: () => {
    const label = REQUEST_QUOTE_CONVERSION_LABEL.trim()
    if (!label) return
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${label}`,
    })
  },
  setTimeout: (fn: () => void, ms: number) => window.setTimeout(fn, ms),
  clearTimeout: (id: number) => window.clearTimeout(id),
})

export function markQuoteConversionPending() {
  storageSet('pending')
}

/**
 * Fire the Request quote conversion once for a successful submit.
 * Re-renders and refreshes do not send another event. No value or currency is attached.
 */
export function scheduleRequestQuoteConversion() {
  if (!REQUEST_QUOTE_CONVERSION_LABEL.trim()) return () => {}
  return scheduleQuoteConversion()
}

export function installPhoneClickTracking() {
  if (phoneTrackingInstalled || typeof document === 'undefined') return
  phoneTrackingInstalled = true
  document.addEventListener('click', event => {
    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest('a')
    const href = link?.getAttribute('href') || ''
    if (!href.toLowerCase().startsWith('tel:')) return
    for (const item of callClickEvents(href, { adsId: GOOGLE_ADS_ID, ga4Id: GA4_MEASUREMENT_ID })) {
      window.gtag?.('event', item.name, item.params)
    }
  })
}

export function trackSpaPageView(pathname: string) {
  for (const item of spaPageViewEvents(pathname, { adsId: GOOGLE_ADS_ID, ga4Id: GA4_MEASUREMENT_ID })) {
    window.gtag?.('event', item.name, item.params)
  }
}
