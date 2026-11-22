import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8')
}

function pick(source, key) {
  return source.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] || ''
}

function extractServices(source) {
  const indexes = []
  const re = /path:\s*'(\/[^']+)'/g
  let match
  while ((match = re.exec(source))) indexes.push(match.index)
  const services = []
  indexes.forEach((start, index) => {
    const head = source.slice(start, indexes[index + 1] ?? start + 1800).slice(0, 1600)
    const item = {
      path: pick(head, 'path'),
      slug: pick(head, 'slug'),
      name: pick(head, 'name'),
      headline: pick(head, 'headline'),
      slogan: pick(head, 'slogan'),
      description: pick(head, 'description'),
      image: pick(head, 'image'),
    }
    if (item.path && item.headline && item.description && item.image && item.name) services.push(item)
  })
  return services
}

function extractPosts(source) {
  const start = source.indexOf('export const posts')
  const slice = source.slice(start)
  const indexes = []
  const re = /path:\s*'(\/[^']+)'/g
  let match
  while ((match = re.exec(slice))) indexes.push(match.index)
  return indexes.map((index, position) => {
    const head = slice.slice(index, indexes[position + 1] ?? index + 900).slice(0, 800)
    return {
      path: pick(head, 'path'),
      title: pick(head, 'title'),
      excerpt: pick(head, 'excerpt'),
      image: pick(head, 'image'),
      datePublished: (pick(head, 'path').match(/^\/(\d{4})\/(\d{2})\/(\d{2})\//) || []).slice(1).join('-'),
    }
  }).filter(post => post.path && post.title && post.excerpt)
}

function extractAreas(source) {
  const stateBlock = source.slice(source.indexOf('const stateSeeds'), source.indexOf('export const stateAreas'))
  const cityBlock = source.slice(source.indexOf('const citySeeds'), source.indexOf('export const cityAreas'))
  const row = /\['([^']+)'\s*,\s*'([^']+)'\s*,\s*'([A-Z]{2})'\s*,\s*'([^']+)'\]/g
  const states = [...stateBlock.matchAll(row)].map(match => ({
    kind: 'state',
    name: match[1],
    slug: match[2],
    stateCode: match[3],
    state: match[1],
    context: match[4],
    path: `/service-areas/${match[2]}/`,
  }))
  const stateName = Object.fromEntries(states.map(state => [state.stateCode, state.name]))
  const cities = [...cityBlock.matchAll(row)].map(match => ({
    kind: 'city',
    name: match[1],
    slug: match[2],
    stateCode: match[3],
    state: stateName[match[3]],
    context: match[4],
    path: `/service-areas/${match[2]}/`,
  }))
  return [...states, ...cities]
}

function imageSize(filePath) {
  const data = fs.readFileSync(filePath)
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) {
    return { w: data.readUInt32BE(16), h: data.readUInt32BE(20) }
  }
  if (data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WEBP') {
    const chunk = data.subarray(12, 16).toString()
    if (chunk === 'VP8X') return { w: 1 + data.readUIntLE(24, 3), h: 1 + data.readUIntLE(27, 3) }
    if (chunk === 'VP8 ') {
      const start = data.indexOf(Buffer.from([0x9d, 0x01, 0x2a]))
      if (start !== -1) {
        return { w: data.readUInt16LE(start + 3) & 0x3fff, h: data.readUInt16LE(start + 5) & 0x3fff }
      }
    }
    if (chunk === 'VP8L') {
      const b0 = data[21]
      const b1 = data[22]
      const b2 = data[23]
      const b3 = data[24]
      return {
        w: 1 + (((b1 & 0x3f) << 8) | b0),
        h: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      }
    }
  }
  return null
}

export function extractSeoCatalog() {
  const services = [
    ...extractServices(read('src/data.ts')),
    ...extractServices(read('src/serviceCatalog.ts')),
  ]
  const posts = extractPosts(read('src/data.ts'))
  const areaPhotos = JSON.parse(read('src/areaMedia.json'))
  const areas = extractAreas(read('src/siteContent.ts')).map(area => ({ ...area, image: areaPhotos[area.slug].src }))
  if (services.length < 16) throw new Error(`Expected at least 16 services, found ${services.length}`)
  if (posts.length < 4) throw new Error(`Expected at least 4 posts, found ${posts.length}`)
  if (areas.length < 24) throw new Error(`Expected at least 24 Illinois service areas, found ${areas.length}`)

  const images = {}
  const files = new Set([
    ...services.map(service => service.image),
    ...posts.map(post => post.image),
    ...areas.map(area => area.image),
    ...fs.readdirSync(path.join(root, 'public/images'), { recursive: true }).filter(file => /\.webp$/i.test(file)).map(file => `/images/${file.replaceAll('\\', '/')}`),
    '/ais-logo.webp',
    '/ais-logo-dark.webp',
    '/images/asbestos-testing.webp',
    '/images/asbestos-sampling-team.webp',
  ])
  for (const urlPath of files) {
    const filePath = path.join(root, 'public', urlPath)
    if (!fs.existsSync(filePath)) throw new Error(`Missing image for SEO catalog: ${urlPath}`)
    const size = imageSize(filePath)
    if (!size) throw new Error(`Could not read image dimensions: ${urlPath}`)
    images[urlPath] = size
  }

  return { services, posts, areas, images }
}

export function writeSeoCatalog() {
  const catalog = extractSeoCatalog()
  const target = path.join(root, 'server/seo-catalog.json')
  fs.writeFileSync(target, `${JSON.stringify(catalog)}\n`)
  return catalog
}
