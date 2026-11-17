import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://aisenvironmentalinc.com'

const REQUIRED_ROUTES = [
  '/',
  '/about/',
  '/services/',
  '/industries/',
  '/faq/',
  '/reviews/',
  '/projects/',
  '/service-areas/',
  '/contact/',
  '/get-a-quote/',
  '/blog/',
  '/thank-you',
  '/asbestos-services/',
  '/door-replacement/',
  '/service-areas/illinois/',
  '/service-areas/chicago-il/',
  '/service-areas/burlington-wi/',
  '/author/mtzprints/',
  '/category/health/',
  '/category/home-improvement/',
  '/2023/12/27/',
]

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8')
}

function literalRoutePaths(source) {
  return [...source.matchAll(/<Route\b[^>]*\bpath="([^"]+)"/g)]
    .map(match => match[1])
    .filter(routePath => routePath !== '*')
}

function literalDataPaths(source) {
  return [...source.matchAll(/(?<![\w$])path:\s*['"]([^'"]+)['"]/g)].map(match => match[1])
}

function serviceAreaPaths(source) {
  return [...source.matchAll(/\[\s*'[^']+'\s*,\s*'([a-z0-9-]+)'\s*,\s*'[A-Z]{2}'/g)]
    .map(match => `/service-areas/${match[1]}/`)
}

export function isLegacyWordpressPath(pathname) {
  return pathname.startsWith('/author/')
    || pathname.startsWith('/category/')
    || /^\/\d{4}\/\d{2}\/\d{2}(\/|$)/.test(pathname)
}

export function collectSiteRoutes() {
  const app = read('src/App.tsx')
  const routes = new Set([
    ...literalRoutePaths(app),
    ...literalDataPaths(read('src/data.ts')),
    ...literalDataPaths(read('src/serviceCatalog.ts')),
    ...literalDataPaths(read('src/siteContent.ts')),
    ...serviceAreaPaths(read('src/siteContent.ts')),
  ])

  for (const routePath of routes) {
    if (!routePath.startsWith('/')) throw new Error(`Route is not absolute: ${routePath}`)
  }

  const sorted = [...routes].sort((a, b) => a.localeCompare(b))
  for (const routePath of REQUIRED_ROUTES) {
    if (!routes.has(routePath)) throw new Error(`Route collector missed ${routePath}`)
  }
  if (sorted.length < 70) throw new Error(`Route collector returned too few paths (${sorted.length})`)
  return sorted
}

function isExcludedSitemapPath(routePath) {
  return routePath === '/thank-you'
    || routePath === '/book-online'
    || routePath === '/book-online/'
    || isLegacyWordpressPath(routePath)
}

export function sitemapPaths(routes = collectSiteRoutes()) {
  return routes.filter(routePath => !isExcludedSitemapPath(routePath))
}

export function renderSitemap(paths) {
  for (const routePath of paths) {
    if (routePath !== '/' && !routePath.endsWith('/')) {
      throw new Error(`Sitemap path must match trailing-slash canonicals: ${routePath}`)
    }
    if (isExcludedSitemapPath(routePath)) {
      throw new Error(`Sitemap includes an excluded path: ${routePath}`)
    }
  }
  const body = paths.map(routePath => `  <url><loc>${ORIGIN}${routePath}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

export function writeSiteFiles() {
  const routes = collectSiteRoutes()
  const paths = sitemapPaths(routes)
  const sitemap = renderSitemap(paths)
  fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap)
  fs.writeFileSync(
    path.join(root, 'server/known-routes.json'),
    `${JSON.stringify({ routes }, null, 2)}\n`,
  )
  return { routes, paths, sitemap }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (isDirectRun) {
  const { routes, paths } = writeSiteFiles()
  console.log(`Wrote ${paths.length} sitemap URLs and ${routes.length} known routes`)
}
