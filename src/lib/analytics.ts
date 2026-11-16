import { contact } from '../data'

const GOOGLE_ADS_ID = 'AW-625851217'

/**
 * Google Ads conversion action 6655261081 (Request quote).
 * While this is empty, the thank-you page must not fire a conversion event.
 */
export const REQUEST_QUOTE_CONVERSION_LABEL = 'lRxqCJnzvOUYENH2tqoC'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let requestQuoteConversionTicket = 0
let phoneTrackingInstalled = false

function isAisPhoneLink(href: string) {
  return href === contact.phoneHref || href.startsWith(`${contact.phoneHref}?`)
}

/**
 * Fire the Request quote conversion once for this thank-you mount.
 * StrictMode runs the effect, cleans it up, then runs it again; only the latest ticket sends.
 * Re-renders do not schedule another event. No value or currency is attached.
 */
export function scheduleRequestQuoteConversion() {
  const label = REQUEST_QUOTE_CONVERSION_LABEL.trim()
  if (!label) return () => {}

  const ticket = ++requestQuoteConversionTicket
  const timer = window.setTimeout(() => {
    if (ticket !== requestQuoteConversionTicket) return
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${label}`,
    })
  }, 0)

  return () => {
    window.clearTimeout(timer)
  }
}

export function installPhoneClickTracking() {
  if (phoneTrackingInstalled || typeof document === 'undefined') return
  phoneTrackingInstalled = true
  document.addEventListener('click', event => {
    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest('a')
    const href = link?.getAttribute('href') || ''
    if (!isAisPhoneLink(href)) return
    window.gtag?.('event', 'phone_click')
  })
}
