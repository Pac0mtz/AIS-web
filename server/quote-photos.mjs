import path from 'node:path'
import multer, { MulterError } from 'multer'

export const MAX_QUOTE_PHOTOS = 5
export const MAX_QUOTE_PHOTO_BYTES = 10 * 1024 * 1024
/** 5 × 10 MB plus multipart overhead. nginx.conf allows the same size on this route only. */
export const MAX_QUOTE_BODY_BYTES = 55 * 1024 * 1024

const KIND_EXT = { jpeg: '.jpg', png: '.png', webp: '.webp', heic: '.heic' }
const KIND_MIME = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
}
const DECLARED_MIME = {
  jpeg: new Set(['image/jpeg', 'image/jpg', 'image/pjpeg']),
  png: new Set(['image/png', 'image/x-png']),
  webp: new Set(['image/webp']),
  heic: new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']),
}
const HEIF_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'heif', 'mif1', 'msf1'])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_QUOTE_PHOTO_BYTES,
    files: MAX_QUOTE_PHOTOS,
    fields: 24,
    parts: 40,
    fieldSize: 1024 * 1024,
  },
})

function declaredMime(value) {
  return String(value || '').toLowerCase().split(';')[0].trim()
}

export function detectImageKind(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpeg'
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'png'
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  if (buffer.toString('ascii', 4, 8) !== 'ftyp') return null
  const brand = buffer.toString('ascii', 8, 12).toLowerCase()
  if (HEIF_BRANDS.has(brand)) return 'heic'
  const boxSize = buffer.readUInt32BE(0)
  const end = Math.min(buffer.length, Number.isFinite(boxSize) && boxSize > 16 ? boxSize : 32)
  const brands = buffer.toString('ascii', 8, end).toLowerCase()
  for (const item of HEIF_BRANDS) {
    if (brands.includes(item)) return 'heic'
  }
  return null
}

function mimeAgrees(kind, mime) {
  const declared = declaredMime(mime)
  if (!declared || declared === 'application/octet-stream') return true
  return DECLARED_MIME[kind].has(declared)
}

export function safePhotoFilename(original, kind) {
  const ext = KIND_EXT[kind] || '.jpg'
  const base = path.basename(String(original || 'photo'))
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[\\/]/g, '_')
    .trim()
  const cleaned = base.replace(/[^\w.\- ()]+/g, '_').replace(/^\.+/, '').slice(0, 80)
  const stem = cleaned || 'photo'
  const lower = stem.toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'].some(item => lower.endsWith(item))) return stem
  return `${stem}${ext}`
}

function fileLabel(name) {
  const label = String(name || 'This file').replace(/[\r\n]+/g, ' ').trim() || 'This file'
  return `“${label}”`
}

export function validateQuotePhotos(files = []) {
  const list = Array.isArray(files) ? files : []
  if (list.length > MAX_QUOTE_PHOTOS) {
    return {
      ok: false,
      error: 'You can attach up to 5 photos. Remove the extra images and try again.',
    }
  }
  const photos = []
  for (const file of list) {
    const original = file?.originalname || file?.filename || 'photo'
    const buffer = file?.buffer
    const size = buffer?.length ?? Number(file?.size || 0)
    if (!buffer || size <= 0) {
      return { ok: false, error: `${fileLabel(original)} is empty. Choose a different photo.` }
    }
    if (size > MAX_QUOTE_PHOTO_BYTES) {
      return { ok: false, error: `${fileLabel(original)} is over 10 MB. Choose a smaller image.` }
    }
    const kind = detectImageKind(buffer)
    if (!kind || !mimeAgrees(kind, file?.mimetype)) {
      return {
        ok: false,
        error: `${fileLabel(original)} isn’t a JPG, PNG, HEIC, or WebP image. Choose a photo in one of those formats.`,
      }
    }
    photos.push({
      filename: safePhotoFilename(original, kind),
      contentType: KIND_MIME[kind],
      buffer,
    })
  }
  return { ok: true, photos }
}

function uploadErrorMessage(error) {
  const code = error instanceof MulterError ? error.code : ''
  if (code === 'LIMIT_FILE_SIZE') {
    return 'Each photo must be 10 MB or smaller. Choose a smaller image and try again.'
  }
  if (code === 'LIMIT_FILE_COUNT' || code === 'LIMIT_UNEXPECTED_FILE') {
    return 'You can attach up to 5 photos. Remove the extra images and try again.'
  }
  if (code === 'LIMIT_FIELD_VALUE') {
    return 'One of the written answers is too long. Shorten it and try again.'
  }
  return 'Could not read the photos. Use up to 5 JPG, PNG, HEIC, or WebP images, 10 MB each, and try again.'
}

export function quotePhotoUpload(req, res, next) {
  const type = String(req.headers['content-type'] || '')
  if (!type.toLowerCase().includes('multipart/form-data')) {
    req.quotePhotos = []
    return next()
  }
  const length = Number(req.headers['content-length'] || 0)
  if (Number.isFinite(length) && length > MAX_QUOTE_BODY_BYTES) {
    res.status(400).json({
      success: false,
      error: 'The upload is too large. Send up to 5 images, 10 MB each.',
    })
    req.resume()
    return
  }
  upload.array('photos', MAX_QUOTE_PHOTOS)(req, res, (error) => {
    if (error) {
      res.status(400).json({ success: false, error: uploadErrorMessage(error) })
      return
    }
    const validated = validateQuotePhotos(req.files || [])
    if (!validated.ok) {
      res.status(400).json({ success: false, error: validated.error })
      return
    }
    req.quotePhotos = validated.photos
    next()
  })
}
