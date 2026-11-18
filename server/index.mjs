import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { sendQuoteEmail, verifySmtp } from './email.mjs'
import { forwardQuoteToFieldtaskpro } from './fieldtaskpro-lead.mjs'
import { quotePhotoUpload } from './quote-photos.mjs'
import { canonicalOriginRedirect, redirectPath, redirectTarget } from './http-routing.mjs'
import { renderDocument, robotsHeader } from './render-document.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(process.env.AIS_DIST_DIR || path.resolve(__dirname, '../dist'))
const port = Number(process.env.PORT || 5000)
const knownRoutes = new Set(
  JSON.parse(fs.readFileSync(path.join(__dirname, 'known-routes.json'), 'utf8')).routes,
)
const app = express()

app.disable('x-powered-by')
app.set('trust proxy', true)

app.use((req, res, next) => {
  const target = canonicalOriginRedirect(req)
  if (!target) return next()
  res.redirect(301, target)
})

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: false }))

function missingQuoteFields(body) {
  const name = String(body?.name || '').trim()
  const email = String(body?.email || '').trim()
  if (!name || !email) return 'Missing required fields: name, email'
  return null
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/quote-requests', quotePhotoUpload, async (req, res) => {
  try {
    const required = missingQuoteFields(req.body || {})
    if (required) return res.status(400).json({ success: false, error: required })

    const photos = req.quotePhotos || []
    let emailSent = false
    try {
      emailSent = await sendQuoteEmail({
        ...req.body,
        submittedAt: req.body.submittedAt || new Date().toISOString(),
      }, photos)
    } catch (error) {
      console.error('Email sending error:', error)
    }

    const fieldtaskproSent = await forwardQuoteToFieldtaskpro(req.body, req.body.formKind || 'fullscreen', { photos })
    if (!fieldtaskproSent) {
      return res.status(502).json({
        success: false,
        error: 'Failed to send quote to Fieldtaskpro',
        emailSent,
      })
    }

    return res.status(201).json({ success: true, emailSent, fieldtaskproSent })
  } catch (error) {
    console.error('Error creating quote request:', error)
    return res.status(500).json({ success: false, error: 'Failed to create quote request' })
  }
})

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  const target = redirectTarget(req.path, knownRoutes)
  if (!target) return next()
  res.redirect(301, redirectPath(target, req.originalUrl))
})

app.use(express.static(distDir, { index: false, maxAge: '7d' }))

app.get('*', (req, res) => {
  const status = knownRoutes.has(req.path) ? 200 : 404
  fs.readFile(path.join(distDir, 'index.html'), 'utf8', (err, html) => {
    if (err) {
      res.status(500).type('text/plain').send('Site build is missing')
      return
    }
    const robots = robotsHeader(req.path)
    if (robots) res.set('X-Robots-Tag', robots)
    res.status(status).type('html').send(renderDocument(html, req.path))
  })
})

export { app }

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (isDirectRun) {
  verifySmtp().finally(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`AIS website listening on ${port}`)
    })
  })
}
