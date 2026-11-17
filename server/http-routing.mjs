const APEX_HOST = 'aisenvironmentalinc.com'
const WWW_HOST = 'www.aisenvironmentalinc.com'

export function firstHeader(value) {
  if (!value) return ''
  const raw = Array.isArray(value) ? value[0] : String(value)
  return raw.split(',')[0].trim()
}

export function requestHost(req) {
  const host = firstHeader(req.headers['x-forwarded-host']) || firstHeader(req.headers.host)
  return host.replace(/:\d+$/, '').replace(/\.$/, '').toLowerCase()
}

export function requestProto(req) {
  const proto = firstHeader(req.headers['x-forwarded-proto']).replace(/:$/, '').toLowerCase()
  return proto || 'https'
}

/** 301 www to the apex, preserving path and query. Uses X-Forwarded-Host/Proto behind the proxy. */
export function wwwRedirectTarget(req) {
  if (requestHost(req) !== WWW_HOST) return null
  return `${requestProto(req)}://${APEX_HOST}${req.originalUrl || '/'}`
}

/**
 * Trailing-slash policy matches canonicals: directory routes keep a trailing slash.
 * /thank-you is the exception and is canonical without one.
 * File-like paths (a dot in the last segment) are left alone.
 */
export function canonicalPathname(pathname) {
  if (!pathname || pathname === '/') return '/'
  if (pathname === '/thank-you' || pathname === '/thank-you/') return '/thank-you'
  if (pathname.endsWith('/')) return pathname
  const segment = pathname.slice(pathname.lastIndexOf('/') + 1)
  if (segment.includes('.')) return pathname
  return `${pathname}/`
}

export function trailingSlashTarget(pathname, knownRoutes) {
  const canonical = canonicalPathname(pathname)
  if (canonical === pathname) return null
  if (!knownRoutes.has(canonical)) return null
  return canonical
}

/** Retired WordPress URLs. Both slash forms 301 in one hop, before trailing-slash rules. */
const LEGACY_REDIRECTS = new Map([
  ['/book-online', '/get-a-quote/'],
  ['/book-online/', '/get-a-quote/'],
])

export function redirectTarget(pathname, knownRoutes) {
  return LEGACY_REDIRECTS.get(pathname) || trailingSlashTarget(pathname, knownRoutes)
}

export function redirectPath(targetPath, originalUrl) {
  const queryAt = originalUrl.indexOf('?')
  const search = queryAt === -1 ? '' : originalUrl.slice(queryAt)
  return `${targetPath}${search}`
}

export function withThankYouRobots(html, pathname) {
  if (pathname !== '/thank-you') return html
  if (html.includes('name="robots"')) return html
  return html.replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />')
}
