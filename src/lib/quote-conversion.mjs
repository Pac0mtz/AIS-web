/**
 * Quote conversions fire only after a successful form submit marks the visit pending.
 * A refresh reads "fired" and does not send again. StrictMode clears the first timer
 * and the second timer is the only one that sends.
 * There is no call-conversion label in this repo, so phone clicks stay generic events.
 */

export function createQuoteConversionScheduler({ getItem, setItem, send, setTimeout, clearTimeout }) {
  let ticket = 0
  return function scheduleQuoteConversion() {
    if (getItem() !== 'pending') return () => {}
    const mine = ++ticket
    const timer = setTimeout(() => {
      if (mine !== ticket) return
      if (getItem() !== 'pending') return
      setItem('fired')
      send()
    }, 0)
    return () => clearTimeout(timer)
  }
}

export function callClickEvents(href, { adsId, ga4Id }) {
  const params = { link_url: href }
  const events = [{ name: 'click_to_call', params: { ...params, send_to: adsId } }]
  if (ga4Id) events.push({ name: 'click_to_call', params: { ...params, send_to: ga4Id } })
  return events
}

export function spaPageViewEvents(pathname, { adsId, ga4Id }) {
  const params = {
    page_path: pathname,
    page_location: `https://aisenvironmentalinc.com${pathname}`,
  }
  const events = []
  if (ga4Id) events.push({ name: 'page_view', params: { ...params, send_to: ga4Id } })
  // Skip the Ads page_view on /thank-you so a URL conversion rule cannot double-count the event.
  if (adsId && pathname !== '/thank-you') {
    events.push({ name: 'page_view', params: { ...params, send_to: adsId } })
  }
  return events
}
