export const QUOTE_PHOTO_LIMIT = 5
export const QUOTE_PHOTO_MAX_BYTES = 10 * 1024 * 1024
export const QUOTE_PHOTO_HINT = 'Add photos (optional) — up to 5 images, 10 MB each, JPG/PNG/HEIC/WebP'

const IMAGE_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/heic-sequence',
  'image/heif-sequence',
])

const IMAGE_EXT = /\.(jpe?g|png|webp|heic|heif)$/i

function fileLabel(name: string) {
  const label = name.replace(/[\r\n]+/g, ' ').trim() || 'This file'
  return `“${label}”`
}

export function quotePhotoProblem(file: File): string | null {
  const type = (file.type || '').toLowerCase().split(';')[0].trim()
  const typeOk = IMAGE_MIME.has(type) || ((!type || type === 'application/octet-stream') && IMAGE_EXT.test(file.name))
  if (!typeOk) {
    return `${fileLabel(file.name)} isn’t a JPG, PNG, HEIC, or WebP image. Choose a photo in one of those formats.`
  }
  if (file.size <= 0) return `${fileLabel(file.name)} is empty. Choose a different photo.`
  if (file.size > QUOTE_PHOTO_MAX_BYTES) return `${fileLabel(file.name)} is over 10 MB. Choose a smaller image.`
  return null
}

export function acceptQuotePhotos(current: File[], incoming: File[]) {
  const errors: string[] = []
  const accepted: File[] = []
  for (const file of incoming) {
    const problem = quotePhotoProblem(file)
    if (problem) {
      errors.push(problem)
      continue
    }
    if (current.length + accepted.length >= QUOTE_PHOTO_LIMIT) {
      errors.push('You can attach up to 5 photos. Remove one before adding another.')
      break
    }
    accepted.push(file)
  }
  return {
    files: [...current, ...accepted],
    error: [...new Set(errors)].slice(0, 3).join(' '),
  }
}
