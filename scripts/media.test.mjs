import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { build } from 'esbuild'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { outputFiles } = await build({
  stdin: {
    contents: "export { services } from './src/data'; export { serviceAreas, industries, projectTypes } from './src/siteContent'; export { serviceSectionMedia } from './src/serviceMedia'; export { areaMedia } from './src/areaMedia'; export { getRelatedServices } from './src/serviceRelations';",
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true, platform: 'node', format: 'esm', write: false,
})
const { services, serviceAreas, industries, projectTypes, serviceSectionMedia, areaMedia, getRelatedServices } = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`)

test('service heroes and all section photographs are unique across service pages', () => {
  const seenPaths = new Map()
  const seenHashes = new Map()
  const verify = (src, owner) => {
    assert.equal(seenPaths.has(src), false, `${src} repeated in ${owner} and ${seenPaths.get(src)}`)
    const bytes = fs.readFileSync(path.join(root, 'public', src))
    const hash = createHash('sha256').update(bytes).digest('hex')
    assert.equal(seenHashes.has(hash), false, `Identical image content in ${owner} and ${seenHashes.get(hash)}`)
    seenPaths.set(src, owner)
    seenHashes.set(hash, owner)
  }
  verify('/images/asbestos-testing.webp', 'environmental testing hub')
  for (const service of services) {
    verify(service.image, `${service.slug} hero`)
    const sections = serviceSectionMedia[service.slug]
    assert.deepEqual(Object.keys(sections).sort(), service.sections.map(section => section.id).sort())
    for (const section of service.sections) {
      const images = sections[section.id]
      assert.ok(images.length === 1 || images.length === 2)
      for (const image of images) {
        assert.ok(image.alt && image.caption)
        verify(image.src, `${service.slug}/${section.id}`)
      }
    }
  }
})

test('every city and state has a different local photograph with attribution', () => {
  const hashes = new Set()
  for (const area of serviceAreas) {
    const image = areaMedia[area.slug]
    assert.ok(image, area.slug)
    const bytes = fs.readFileSync(path.join(root, 'public', image.src))
    const hash = createHash('sha256').update(bytes).digest('hex')
    assert.equal(hashes.has(hash), false, area.slug)
    hashes.add(hash)
    assert.ok(image.alt && image.width > 0 && image.height > 0)
    assert.ok(image.author && image.license && image.sourceUrl && image.licenseUrl)
  }
})

test('related service and industry links resolve without self-links or duplicate suggestions', () => {
  const slugs = new Set(services.map(service => service.slug))
  for (const service of services) {
    const related = getRelatedServices(service)
    assert.equal(related.length, 3)
    assert.equal(new Set(related.map(item => item.slug)).size, 3)
    for (const item of related) {
      assert.ok(slugs.has(item.slug), item.slug)
      assert.notEqual(item.slug, service.slug)
    }
  }
  for (const item of [...industries, ...projectTypes]) {
    for (const slug of item.serviceSlugs) assert.ok(slugs.has(slug), slug)
  }
})
