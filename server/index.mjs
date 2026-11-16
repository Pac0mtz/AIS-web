import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sendQuoteEmail, verifySmtp } from './email.mjs'
import { forwardQuoteToFieldtaskpro } from './fieldtaskpro-lead.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const port = Number(process.env.PORT || 5000)
const app = express()

app.disable('x-powered-by')
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

app.post('/api/quote-requests', async (req, res) => {
  try {
    const required = missingQuoteFields(req.body || {})
    if (required) return res.status(400).json({ success: false, error: required })

    let emailSent = false
    try {
      emailSent = await sendQuoteEmail({
        ...req.body,
        submittedAt: req.body.submittedAt || new Date().toISOString(),
      })
    } catch (error) {
      console.error('Email sending error:', error)
    }

    const fieldtaskproSent = await forwardQuoteToFieldtaskpro(req.body, req.body.formKind || 'fullscreen')
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

app.use(express.static(distDir, { index: false, maxAge: '7d' }))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

verifySmtp().finally(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`AIS website listening on ${port}`)
  })
})
