import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { after, before, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { app } from './index.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distIndex = path.join(root, 'dist/index.html')

let server
let port

function request(urlPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: urlPath,
      method: 'GET',
      headers: { host: 'aisenvironmentalinc.com', ...headers },
    }, res => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          location: res.headers.location || '',
          robots: String(res.headers['x-robots-tag'] || ''),
          body: Buffer.concat(chunks).toString('utf8'),
          contentType: String(res.headers['content-type'] || ''),
        })
      })
    })
    req.on('error', reject)
    req.end()
  })
}

function resolvedLocation(location) {
  return new URL(location, 'https://aisenvironmentalinc.com')
}

before(async () => {
  assert.ok(fs.existsSync(distIndex), 'dist/index.html is missing. Run npm run build before npm test.')
  server = http.createServer(app)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  port = server.address().port
})

after(async () => {
  if (!server) return
  await new Promise(resolve => server.close(resolve))
})

test('www host 301s to the apex and preserves path and query', async () => {
  const res = await request('/about/?service=Asbestos', {
    host: 'www.aisenvironmentalinc.com',
    'x-forwarded-proto': 'https',
  })
  assert.equal(res.status, 301)
  const location = resolvedLocation(res.location)
  assert.equal(location.protocol, 'https:')
  assert.equal(location.hostname, 'aisenvironmentalinc.com')
  assert.equal(`${location.pathname}${location.search}`, '/about/?service=Asbestos')
})

test('x-forwarded-host and x-forwarded-proto win over the internal Host header', async () => {
  const res = await request('/contact/?utm=ads', {
    host: '127.0.0.1',
    'x-forwarded-host': 'www.aisenvironmentalinc.com, edge.internal',
    'x-forwarded-proto': 'http',
  })
  assert.equal(res.status, 301)
  const location = resolvedLocation(res.location)
  assert.equal(location.protocol, 'https:')
  assert.equal(location.hostname, 'aisenvironmentalinc.com')
  assert.equal(`${location.pathname}${location.search}`, '/contact/?utm=ads')
})

test('http on the apex 301s to the https apex', async () => {
  const res = await request('/services/?utm=ads', {
    host: 'aisenvironmentalinc.com',
    'x-forwarded-proto': 'http',
  })
  assert.equal(res.status, 301)
  const location = resolvedLocation(res.location)
  assert.equal(location.protocol, 'https:')
  assert.equal(location.hostname, 'aisenvironmentalinc.com')
  assert.equal(`${location.pathname}${location.search}`, '/services/?utm=ads')
})

test('a mixed-case apex host 301s to the lowercase https host', async () => {
  const res = await request('/mold-testing-inspections/', {
    host: 'AISEnvironmentalInc.com',
    'x-forwarded-proto': 'https',
  })
  assert.equal(res.status, 301)
  const location = resolvedLocation(res.location)
  assert.equal(`${location.protocol}//${location.host}${location.pathname}`, 'https://aisenvironmentalinc.com/mold-testing-inspections/')
})

test('apex host does not redirect www', async () => {
  const res = await request('/about/', { host: 'aisenvironmentalinc.com', 'x-forwarded-proto': 'https' })
  assert.equal(res.status, 200)
  assert.equal(res.location, '')
})

test('known routes without a trailing slash 301 to the canonical slash', async () => {
  const res = await request('/get-a-quote?service=Lead%20Paint')
  assert.equal(res.status, 301)
  const location = resolvedLocation(res.location)
  assert.equal(location.hostname, 'aisenvironmentalinc.com')
  assert.equal(`${location.pathname}${location.search}`, '/get-a-quote/?service=Lead%20Paint')
})

test('retired lead inspection URLs redirect to removal and preserve the query string', async () => {
  for (const pathname of ['/lead-paint-inspection', '/lead-paint-inspection/']) {
    const res = await request(`${pathname}?utm_source=search`)
    assert.equal(res.status, 301)
    const location = resolvedLocation(res.location)
    assert.equal(`${location.pathname}${location.search}`, '/lead-paint-removal/?utm_source=search')
  }
  assert.equal((await request('/lead-paint-inspection-extra/')).status, 404)
})

test('lead service HTML advertises removal and abatement without inspection or testing', async () => {
  const res = await request('/lead-paint-removal/')
  assert.equal(res.status, 200)
  assert.match(res.body, /Lead Paint Removal (?:&amp;|&) Abatement in Chicago/)
  assert.doesNotMatch(res.body, /lead(?:[- ]paint)?[- ](?:inspection|testing)/i)
})

test('/thank-you/ 301s to /thank-you and keeps the query string', async () => {
  const res = await request('/thank-you/?utm=ads')
  assert.equal(res.status, 301)
  const location = resolvedLocation(res.location)
  assert.equal(`${location.pathname}${location.search}`, '/thank-you?utm=ads')
})

test('/book-online and /book-online/ 301 to /get-a-quote/ and keep the query string', async () => {
  const cases = [
    ['/book-online', '/get-a-quote/'],
    ['/book-online/', '/get-a-quote/'],
    ['/book-online?utm_source=gbp&service=Lead%20Paint', '/get-a-quote/?utm_source=gbp&service=Lead%20Paint'],
    ['/book-online/?utm_source=gbp&service=Lead%20Paint', '/get-a-quote/?utm_source=gbp&service=Lead%20Paint'],
  ]
  for (const [urlPath, expected] of cases) {
    const res = await request(urlPath)
    assert.equal(res.status, 301, urlPath)
    const location = resolvedLocation(res.location)
    assert.equal(location.hostname, 'aisenvironmentalinc.com')
    assert.equal(`${location.pathname}${location.search}`, expected, urlPath)
  }
})

test('near-miss book-online paths stay 404', async () => {
  for (const urlPath of ['/book-online-now', '/book-online/extra', '/book-online/extra/']) {
    const res = await request(urlPath)
    assert.equal(res.status, 404, urlPath)
    assert.equal(res.location, '')
  }
})

test('the bare legacy blog date 301s home and article URLs stay put', async () => {
  const date = await request('/2023/12/27/')
  assert.equal(date.status, 301)
  assert.equal(resolvedLocation(date.location).pathname, '/')
  const article = await request('/2023/12/27/the-dangers-of-asbestos-and-how-ais-environmental-inc-can-help/')
  assert.equal(article.status, 200)
})

test('canonical routes and static files stay 200', async () => {
  for (const urlPath of ['/', '/about/', '/contact/', '/asbestos-services/', '/asbestos-testing-sampling/', '/environmental-testing/', '/service-areas/chicago-il/', '/author/mtzprints/', '/thank-you', '/robots.txt', '/sitemap.xml', '/favicon.png', '/api/health']) {
    const res = await request(urlPath)
    assert.equal(res.status, 200, urlPath)
  }
})

test('unknown paths return 404 with the SPA shell', async () => {
  for (const urlPath of ['/wp-admin', '/wp-admin/', '/wp-login.php', '/xmlrpc.php', '/not-a-real-page']) {
    const res = await request(urlPath)
    assert.equal(res.status, 404, urlPath)
    assert.match(res.body, /id="root"/)
    assert.equal(res.location, '')
  }
})

test('only thank-you and unknown routes are noindex, in both the meta tag and X-Robots-Tag', async () => {
  const thankYou = await request('/thank-you')
  const about = await request('/about/')
  const missing = await request('/not-a-real-page')
  assert.equal(thankYou.status, 200)
  assert.match(thankYou.body, /<meta id="seo-robots" name="robots" content="noindex, nofollow"\s*\/?>/)
  assert.equal(thankYou.robots, 'noindex, nofollow')
  assert.equal(about.robots, '')
  assert.doesNotMatch(about.body, /noindex/)
  assert.equal(missing.status, 404)
  assert.equal(missing.robots, 'noindex, nofollow')
  assert.match(missing.body, /noindex, nofollow/)
})

test('initial HTML has a unique title, description, canonical, one H1 and page JSON-LD', async () => {
  const home = await request('/')
  const testing = await request('/asbestos-testing-sampling/')
  const mold = await request('/mold-testing-inspections/')
  const chicago = await request('/service-areas/chicago-il/')
  const environmental = await request('/environmental-testing/')
  const pages = [home, testing, mold, chicago, environmental]
  const titles = pages.map(page => page.body.match(/<title id="seo-title">([^<]+)<\/title>/)?.[1])
  assert.equal(new Set(titles).size, titles.length)
  for (const page of pages) {
    assert.equal(page.status, 200)
    assert.equal((page.body.match(/<h1\b/g) || []).length, 1)
    assert.equal((page.body.match(/gtag\/js\?id=AW-625851217/g) || []).length, 1)
    assert.match(page.body, /G-WW7YHXKG9X/)
    assert.match(page.body, /HomeAndConstructionBusiness/)
    assert.match(page.body, /2524 Scott St\./)
    assert.match(page.body, /\+1-708-240-9468/)
    assert.doesNotMatch(page.body, /AggregateRating|reviewCount/)
    assert.doesNotMatch(page.body, /Phase I|environmental site assessment/i)
  }
  assert.match(home.body, /<link id="seo-canonical" rel="canonical" href="https:\/\/aisenvironmentalinc\.com\/"\s*\/?>/)
  assert.match(testing.body, /href="https:\/\/aisenvironmentalinc\.com\/asbestos-testing-sampling\/"/)
  assert.match(testing.body, /<h1 id="seo-h1"[^>]*>Asbestos Testing in Chicago<\/h1>/)
  assert.match(testing.body, /<title id="seo-title">Asbestos Testing in Chicago \| AIS Environmental<\/title>/)
  assert.match(mold.body, /<h1 id="seo-h1"[^>]*>Mold Testing in Chicago<\/h1>/)
  assert.match(chicago.body, /<h1 id="seo-h1"[^>]*>Environmental Testing in Chicago, IL<\/h1>/)
  assert.match(environmental.body, /"@type":"Service"/)
  assert.match(environmental.body, /Environmental testing/)
  assert.match(home.body, /rel="preload" as="image"/)
  const thankYou = await request('/thank-you')
  assert.match(thankYou.body, /send_page_view: false/)
  assert.match(thankYou.body, /gtag\/js\?id=AW-625851217/)
  assert.match(thankYou.body, /href="https:\/\/aisenvironmentalinc\.com\/thank-you"/)
})

test('robots.txt allows crawling and publishes the sitemap', async () => {
  const res = await request('/robots.txt')
  assert.match(res.body, /^User-agent: \*$/m)
  assert.match(res.body, /^Allow: \/$/m)
  assert.match(res.body, /^Disallow: \/api\/$/m)
  assert.match(res.body, /^Sitemap: https:\/\/aisenvironmentalinc\.com\/sitemap\.xml$/m)
  assert.doesNotMatch(res.body, /^Disallow: \/$/m)
})


test('retired out-of-state pages are 404 and noindex in both slash forms', async () => {
  const retired = ['indiana', 'wisconsin', 'gary-in', 'hammond-in', 'east-chicago-in', 'merrillville-in', 'valparaiso-in', 'crown-point-in', 'milwaukee-wi', 'kenosha-wi', 'racine-wi', 'madison-wi', 'green-bay-wi', 'beloit-wi', 'janesville-wi', 'waukesha-wi', 'wauwatosa-wi', 'pleasant-prairie-wi', 'west-allis-wi', 'burlington-wi']
  for (const slug of retired) {
    for (const suffix of ['', '/']) {
      const url = `/service-areas/${slug}${suffix}`
      const res = await request(url)
      assert.equal(res.status, 404, url)
      assert.equal(res.location, '', url)
      assert.equal(res.robots, 'noindex, nofollow', url)
      assert.doesNotMatch(res.body, /Indiana|Wisconsin/i, url)
    }
  }
  for (const url of ['/', '/services/', '/service-areas/', '/service-areas/illinois/', '/service-areas/chicago-il/', '/environmental-testing/', '/asbestos-services/']) {
    const res = await request(url)
    assert.equal(res.status, 200, url)
    assert.match(res.body, /Illinois/, url)
    assert.doesNotMatch(res.body, /Indiana|Wisconsin/i, url)
  }
})
