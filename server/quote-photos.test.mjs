import assert from 'node:assert/strict'
import http from 'node:http'
import test from 'node:test'
import express from 'express'
import { forwardQuoteToFieldtaskpro } from './fieldtaskpro-lead.mjs'
import { app } from './index.mjs'
import {
  MAX_QUOTE_BODY_BYTES,
  MAX_QUOTE_PHOTO_BYTES,
  detectImageKind,
  quotePhotoUpload,
  safePhotoFilename,
  validateQuotePhotos,
} from './quote-photos.mjs'

function tinyJpeg() {
  return Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01])
}

function tinyPng() {
  return Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d])
}

function tinyWebp() {
  const buffer = Buffer.alloc(12)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(4, 4)
  buffer.write('WEBP', 8)
  return buffer
}

function tinyHeic() {
  return Buffer.from([
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70,
    0x68, 0x65, 0x69, 0x63,
    0x00, 0x00, 0x00, 0x00,
    0x68, 0x65, 0x69, 0x63,
    0x6d, 0x69, 0x66, 0x31,
  ])
}

function tinyMp4() {
  return Buffer.from([
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70,
    0x6d, 0x70, 0x34, 0x32,
    0x00, 0x00, 0x00, 0x00,
    0x6d, 0x70, 0x34, 0x32,
    0x69, 0x73, 0x6f, 0x6d,
  ])
}

function encodeMultipart(fields, files, boundary = '----aisform') {
  const chunks = []
  const push = (value) => chunks.push(Buffer.isBuffer(value) ? value : Buffer.from(value))
  for (const [name, value] of Object.entries(fields)) {
    push(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`)
  }
  for (const file of files) {
    push(`--${boundary}\r\nContent-Disposition: form-data; name="photos"; filename="${file.filename}"\r\nContent-Type: ${file.type}\r\n\r\n`)
    push(file.buffer)
    push('\r\n')
  }
  push(`--${boundary}--\r\n`)
  return { body: Buffer.concat(chunks), contentType: `multipart/form-data; boundary=${boundary}` }
}

function listen(handler) {
  const server = http.createServer(handler)
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }))
  })
}

function close(server) {
  return new Promise(resolve => server.close(resolve))
}

function post(port, { path = '/api/quote-requests', headers = {}, body = Buffer.alloc(0) } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method: 'POST',
      headers: { host: 'aisenvironmentalinc.com', ...headers, 'content-length': body.length },
    }, res => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8')
        let json = {}
        try { json = raw ? JSON.parse(raw) : {} } catch { json = { raw } }
        resolve({ status: res.statusCode, json })
      })
    })
    req.on('error', reject)
    req.end(body)
  })
}

function parserApp() {
  const server = express()
  server.use(express.json({ limit: '2mb' }))
  server.post('/api/quote-requests', quotePhotoUpload, (req, res) => {
    res.json({
      body: req.body,
      photos: (req.quotePhotos || []).map(photo => ({
        filename: photo.filename,
        contentType: photo.contentType,
        size: photo.buffer.length,
      })),
    })
  })
  return server
}

test('magic bytes identify jpg, png, webp, and heic, and reject other containers', () => {
  assert.equal(detectImageKind(tinyJpeg()), 'jpeg')
  assert.equal(detectImageKind(tinyPng()), 'png')
  assert.equal(detectImageKind(tinyWebp()), 'webp')
  assert.equal(detectImageKind(tinyHeic()), 'heic')
  assert.equal(detectImageKind(tinyMp4()), null)
  assert.equal(detectImageKind(Buffer.from('GIF89a and more')), null)
  assert.equal(detectImageKind(Buffer.from('<html></html>')), null)
})

test('validation accepts matching image types and names the fix for everything else', () => {
  const ok = validateQuotePhotos([
    { originalname: 'kitchen.jpg', mimetype: 'image/jpeg', buffer: tinyJpeg() },
    { originalname: 'wall.png', mimetype: 'image/png', buffer: tinyPng() },
    { originalname: 'soft.webp', mimetype: 'image/webp', buffer: tinyWebp() },
    { originalname: 'phone.heic', mimetype: 'application/octet-stream', buffer: tinyHeic() },
  ])
  assert.equal(ok.ok, true)
  assert.deepEqual(ok.photos.map(photo => photo.contentType), ['image/jpeg', 'image/png', 'image/webp', 'image/heic'])

  const spoofed = validateQuotePhotos([{ originalname: 'notes.jpg', mimetype: 'image/jpeg', buffer: Buffer.from('not a photo!!') }])
  assert.equal(spoofed.ok, false)
  assert.match(spoofed.error, /notes\.jpg/)
  assert.match(spoofed.error, /Choose a photo in one of those formats/)

  const mismatch = validateQuotePhotos([{ originalname: 'wall.png', mimetype: 'image/jpeg', buffer: tinyPng() }])
  assert.equal(mismatch.ok, false)
  assert.match(mismatch.error, /Choose a photo/)

  const gif = validateQuotePhotos([{ originalname: 'anim.gif', mimetype: 'image/gif', buffer: Buffer.from('GIF89a-long-enough') }])
  assert.equal(gif.ok, false)

  const empty = validateQuotePhotos([{ originalname: 'blank.jpg', mimetype: 'image/jpeg', buffer: Buffer.alloc(0) }])
  assert.match(empty.error, /empty/)
  assert.match(empty.error, /Choose a different photo/)

  const huge = Buffer.alloc(MAX_QUOTE_PHOTO_BYTES + 1, 0)
  tinyJpeg().copy(huge)
  const tooBig = validateQuotePhotos([{ originalname: 'huge.jpg', mimetype: 'image/jpeg', buffer: huge }])
  assert.match(tooBig.error, /10 MB/)
  assert.match(tooBig.error, /Choose a smaller image/)

  const many = Array.from({ length: 6 }, (_, index) => ({
    originalname: `${index}.jpg`,
    mimetype: 'image/jpeg',
    buffer: tinyJpeg(),
  }))
  const tooMany = validateQuotePhotos(many)
  assert.match(tooMany.error, /up to 5 photos/)
  assert.match(tooMany.error, /Remove the extra images/)
})

test('photo filenames cannot carry a path or a header break', () => {
  const name = safePhotoFilename('../..\\evil\r\nBcc: x.jpg', 'jpeg')
  assert.equal(name.includes('/'), false)
  assert.equal(name.includes('\\'), false)
  assert.equal(name.includes('\n'), false)
  assert.equal(name.includes('\r'), false)
  assert.match(name, /\.jpg$/)
})

test('multipart parsing keeps text fields and accepted photos', async () => {
  const { server, port } = await listen(parserApp())
  try {
    const form = encodeMultipart(
      {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '7085550100',
        service: 'Mold Testing',
        description: 'Basement ceiling',
        formKind: 'contact',
      },
      [
        { filename: 'kitchen.jpg', type: 'image/jpeg', buffer: tinyJpeg() },
        { filename: 'wall.png', type: 'image/png', buffer: tinyPng() },
      ],
    )
    const res = await post(port, { headers: { 'content-type': form.contentType }, body: form.body })
    assert.equal(res.status, 200)
    assert.equal(res.json.body.name, 'Ada Lovelace')
    assert.equal(res.json.body.email, 'ada@example.com')
    assert.equal(res.json.body.service, 'Mold Testing')
    assert.equal(res.json.body.formKind, 'contact')
    assert.equal(res.json.photos.length, 2)
    assert.equal(res.json.photos[0].filename, 'kitchen.jpg')
    assert.equal(res.json.photos[0].contentType, 'image/jpeg')
    assert.equal(res.json.photos[1].contentType, 'image/png')
  } finally {
    await close(server)
  }
})

test('JSON submissions still parse and do not require photos', async () => {
  const { server, port } = await listen(parserApp())
  try {
    const body = Buffer.from(JSON.stringify({ name: 'Ada', email: 'ada@example.com', service: 'Other' }))
    const res = await post(port, {
      headers: { 'content-type': 'application/json' },
      body,
    })
    assert.equal(res.status, 200)
    assert.equal(res.json.body.email, 'ada@example.com')
    assert.deepEqual(res.json.photos, [])
  } finally {
    await close(server)
  }
})

test('the quote route rejects a bad upload before Fieldtaskpro is called', async () => {
  const { server, port } = await listen(app)
  const original = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error('outbound request')
  }
  try {
    const missing = await post(port, {
      headers: { 'content-type': 'application/json' },
      body: Buffer.from(JSON.stringify({ phone: '7085550100' })),
    })
    assert.equal(missing.status, 400)
    assert.match(missing.json.error, /Missing required fields: name, email/)

    const form = encodeMultipart(
      { name: 'Ada', email: 'ada@example.com' },
      [{ filename: 'notes.jpg', type: 'image/jpeg', buffer: Buffer.from('this is not a photo') }],
    )
    const bad = await post(port, { headers: { 'content-type': form.contentType }, body: form.body })
    assert.equal(bad.status, 400)
    assert.match(bad.json.error, /Choose a photo in one of those formats/)

    const extras = encodeMultipart(
      { name: 'Ada', email: 'ada@example.com' },
      Array.from({ length: 6 }, (_, index) => ({ filename: `${index}.jpg`, type: 'image/jpeg', buffer: tinyJpeg() })),
    )
    const many = await post(port, { headers: { 'content-type': extras.contentType }, body: extras.body })
    assert.equal(many.status, 400)
    assert.match(many.json.error, /up to 5 photos/)

    const huge = Buffer.alloc(MAX_QUOTE_PHOTO_BYTES + 1, 0)
    tinyJpeg().copy(huge)
    const fat = encodeMultipart(
      { name: 'Ada', email: 'ada@example.com' },
      [{ filename: 'huge.jpg', type: 'image/jpeg', buffer: huge }],
    )
    const oversize = await post(port, { headers: { 'content-type': fat.contentType }, body: fat.body })
    assert.equal(oversize.status, 400)
    assert.match(oversize.json.error, /10 MB/)
    assert.equal(called, false)
  } finally {
    globalThis.fetch = original
    await close(server)
  }
})

test('an oversized content length is refused before the body is stored', () => {
  let continued = false
  const req = {
    headers: {
      'content-type': 'multipart/form-data; boundary=ais',
      'content-length': String(MAX_QUOTE_BODY_BYTES + 1),
    },
    resume() {},
  }
  const res = {
    statusCode: 0,
    body: null,
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body },
  }
  quotePhotoUpload(req, res, () => { continued = true })
  assert.equal(continued, false)
  assert.equal(res.statusCode, 400)
  assert.match(res.body.error, /up to 5 images, 10 MB each/)
})

test('Fieldtaskpro photos upload first and are stored on the lead uploads field', async () => {
  const calls = []
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init })
    if (String(url).endsWith('/upload')) {
      const file = init.body.get('file')
      assert.equal(typeof file?.arrayBuffer, 'function')
      assert.equal(file.name, 'kitchen.jpg')
      return {
        ok: true,
        status: 200,
        json: async () => ({
          url: 'https://fieldtaskpro.com/uploads/crm-leads/form/kitchen.jpg',
          fileName: 'kitchen.jpg',
          fileSize: tinyJpeg().length,
          fileType: 'image/jpeg',
        }),
        text: async () => '',
      }
    }
    return { ok: true, status: 201, json: async () => ({ ok: true }), text: async () => '' }
  }
  const sent = await forwardQuoteToFieldtaskpro({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '7085550100',
    service: 'Mold Testing',
    formKind: 'contact',
    description: 'Basement ceiling',
  }, 'contact', {
    fetchImpl,
    photos: [{ filename: 'kitchen.jpg', contentType: 'image/jpeg', buffer: tinyJpeg() }],
  })
  assert.equal(sent, true)
  assert.equal(calls.length, 2)
  assert.match(calls[0].url, /\/api\/public\/crm-lead\/[a-f0-9]+\/upload$/)
  assert.match(calls[1].url, /\/api\/public\/crm-lead\/[a-f0-9]+$/)
  const lead = JSON.parse(calls[1].init.body)
  assert.equal(lead.name, 'Ada Lovelace')
  assert.equal(lead.service_needed, 'Mold Testing')
  assert.equal(lead.notes, 'Basement ceiling')
  assert.equal(lead.uploads.length, 1)
  assert.equal(lead.uploads[0].url, '/uploads/crm-leads/form/kitchen.jpg')
  assert.equal(lead.uploads[0].fileName, 'kitchen.jpg')
  assert.equal(lead.uploads[0].fileType, 'image/jpeg')
})

test('a Fieldtaskpro photo upload failure does not create the lead', async () => {
  let leadPosts = 0
  const logs = []
  const original = console.error
  console.error = (...args) => logs.push(args.map(item => String(item?.message || item)).join(' '))
  try {
    const sent = await forwardQuoteToFieldtaskpro({
      name: 'Ada',
      email: 'ada@example.com',
      formKind: 'hero',
    }, 'hero', {
      photos: [{ filename: 'kitchen.jpg', contentType: 'image/jpeg', buffer: tinyJpeg() }],
      fetchImpl: async (url) => {
        if (String(url).endsWith('/upload')) {
          return { ok: false, status: 400, text: async () => 'Only images or PDF files are allowed', json: async () => ({}) }
        }
        leadPosts += 1
        return { ok: true, status: 201, json: async () => ({ ok: true }), text: async () => '' }
      },
    })
    assert.equal(sent, false)
    assert.equal(leadPosts, 0)
    assert.equal(logs.some(line => /pass|secret|smtp/i.test(line)), false)
  } finally {
    console.error = original
  }
})

test('quotes without photos keep the existing JSON lead body', async () => {
  const calls = []
  const sent = await forwardQuoteToFieldtaskpro({
    name: 'Ada',
    email: 'ada@example.com',
    service: 'Roofing',
    formKind: 'fullscreen',
  }, 'fullscreen', {
    fetchImpl: async (url, init) => {
      calls.push({ url: String(url), init })
      return { ok: true, status: 201, json: async () => ({ ok: true }), text: async () => '' }
    },
  })
  assert.equal(sent, true)
  assert.equal(calls.length, 1)
  assert.equal(String(calls[0].url).endsWith('/upload'), false)
  const lead = JSON.parse(calls[0].init.body)
  assert.equal(lead.service_needed, 'Roofing')
  assert.equal(Object.hasOwn(lead, 'uploads'), false)
})

test('lead quotes, including legacy inspection selections, use the removal service in Fieldtaskpro', async () => {
  for (const service of ['Lead', 'Lead abatement', 'Lead Paint Removal', 'Lead Paint Inspection', 'Lead testing']) {
    const calls = []
    const sent = await forwardQuoteToFieldtaskpro({
      name: 'Website visitor', email: 'visitor@example.com', service,
    }, 'fullscreen', {
      fetchImpl: async (_url, init) => {
        calls.push(JSON.parse(init.body))
        return { ok: true }
      },
    })
    assert.equal(sent, true)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].service_needed, 'Lead Paint Removal', service)
  }
})
