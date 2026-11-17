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
  assert.equal(location.protocol, 'http:')
  assert.equal(location.hostname, 'aisenvironmentalinc.com')
  assert.equal(`${location.pathname}${location.search}`, '/contact/?utm=ads')
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

test('canonical routes and static files stay 200', async () => {
  for (const urlPath of ['/', '/about/', '/contact/', '/asbestos-services/', '/service-areas/chicago-il/', '/author/mtzprints/', '/2023/12/27/', '/thank-you', '/robots.txt', '/sitemap.xml', '/favicon.png', '/api/health']) {
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

test('only /thank-you is served with a robots noindex tag', async () => {
  const thankYou = await request('/thank-you')
  const about = await request('/about/')
  assert.equal(thankYou.status, 200)
  assert.match(thankYou.body, /<meta name="robots" content="noindex, nofollow"\s*\/?>/)
  assert.doesNotMatch(about.body, /noindex/)
})

test('robots.txt allows crawling and publishes the sitemap', async () => {
  const res = await request('/robots.txt')
  assert.match(res.body, /^User-agent: \*$/m)
  assert.match(res.body, /^Allow: \/$/m)
  assert.match(res.body, /^Disallow: \/api\/$/m)
  assert.match(res.body, /^Sitemap: https:\/\/aisenvironmentalinc\.com\/sitemap\.xml$/m)
  assert.doesNotMatch(res.body, /^Disallow: \/$/m)
})
