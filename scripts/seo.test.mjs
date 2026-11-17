import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { collectSiteRoutes, isLegacyWordpressPath, renderSitemap, sitemapPaths } from './build-sitemap.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8')
}

test('index.html is indexable and loads gtag once', () => {
  const html = read('index.html')
  assert.doesNotMatch(html, /noindex|nofollow/)
  assert.equal((html.match(/https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=AW-625851217/g) || []).length, 1)
  assert.equal((html.match(/gtag\('config', 'AW-625851217'\)/g) || []).length, 1)
  assert.equal((html.match(/gtag\('config', 'G-WW7YHXKG9X'\)/g) || []).length, 1)
})

test('sitemap matches App routes, canonical slashes, and drops legacy URLs', () => {
  const routes = collectSiteRoutes()
  const paths = sitemapPaths(routes)
  const sitemap = renderSitemap(paths)
  assert.equal(read('public/sitemap.xml'), sitemap)
  assert.equal(JSON.parse(read('server/known-routes.json')).routes.join('\n'), routes.join('\n'))
  assert.ok(paths.includes('/'))
  assert.ok(paths.includes('/about/'))
  assert.ok(paths.includes('/get-a-quote/'))
  assert.ok(paths.includes('/asbestos-services/'))
  assert.ok(paths.includes('/service-areas/chicago-il/'))
  assert.ok(paths.includes('/blog/'))
  assert.equal(paths.includes('/thank-you'), false)
  assert.equal(paths.includes('/book-online'), false)
  assert.equal(paths.includes('/book-online/'), false)
  assert.equal(paths.some(isLegacyWordpressPath), false)
  assert.doesNotMatch(sitemap, /book-online/)
  assert.doesNotMatch(sitemap, /<loc>[^<]*(\/author\/|\/category\/|\/2023\/|\/thank-you)/)
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
  assert.ok(locations.length > 0)
  for (const loc of locations) {
    assert.ok(loc.startsWith('https://aisenvironmentalinc.com/'), loc)
  }
  for (const routePath of paths) {
    if (routePath !== '/') assert.ok(routePath.endsWith('/'), routePath)
  }
})

test('thank-you conversion label is the confirmed Request quote action', () => {
  const analytics = read('src/lib/analytics.ts')
  assert.match(analytics, /REQUEST_QUOTE_CONVERSION_LABEL = 'lRxqCJnzvOUYENH2tqoC'/)
  assert.match(analytics, /6655261081/)
  assert.match(analytics, /gtag\?\.\('event', 'conversion', \{\s*send_to: `\$\{GOOGLE_ADS_ID\}\/\$\{label\}`,\s*\}\)/)
  assert.match(analytics, /event', 'phone_click'/)
  const thankYou = read('src/pages/ThankYouPage.tsx')
  assert.match(thankYou, /scheduleRequestQuoteConversion\(\)/)
  assert.match(thankYou, /noindex, nofollow/)
})

test('the quote form navigates to /thank-you and does not fire the conversion', () => {
  const form = read('src/components/LeadForm.tsx')
  assert.match(form, /navigate\('\/thank-you'\)/)
  assert.match(form, /\/api\/quote-requests/)
  assert.doesNotMatch(form, /gtag|conversion|thank you\. we received/i)
})
