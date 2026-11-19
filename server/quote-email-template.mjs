/**
 * Quote-notification email.
 *
 * Layout and cards match the lead notification A&B website forms
 * send through Fieldtaskpro (`emailTemplates.leadFormNewLead` /
 * `leadFormBrandedEmailHtml` in Pac0mtz/Fieldtaskpro2
 * TakFlow-main/TaskFlow/server/email.ts). Pac0mtz/abenvironmental was not
 * readable with this environment's GitHub credentials, so that is the
 * template those public submissions actually use.
 *
 * AIS branding (name, logo, colors, address, phone, site) is applied here.
 * SMTP delivery, recipients, and Fieldtaskpro forwarding stay in the callers.
 */

export const AIS_COMPANY_NAME = 'AIS Environmental Inc.'

/** Known bad display names. The live misspelling is not in this repo. */
const LEGACY_FROM_NAMES = new Set([
  'AIS Environmental',
  'AIS Environmental Services',
  'AIS Envrionmental',
  'AIS Envrionmental Services',
])

export const AIS_QUOTE_EMAIL_BRAND = {
  companyName: AIS_COMPANY_NAME,
  logoUrl: 'https://aisenvironmentalinc.com/ais-logo.png',
  /** --brand-primary / --blue-800 from src/index.css */
  color: '#152773',
  /** --brand-accent / --red-600 from src/index.css */
  accent: '#d90002',
  address: '2524 Scott St., Franklin Park, IL 60131',
  phone: '(708) 240-9468',
  phoneHref: 'tel:+17082409468',
  website: 'https://aisenvironmentalinc.com',
  websiteLabel: 'aisenvironmentalinc.com',
  email: 'info@aisenvironmentalinc.com',
}

/**
 * Website From display name.
 * `SMTP_FROM_NAME` still overrides this when it is set to something else.
 * The production misspelling "AIS Envrionmental Services" is not a code
 * constant; when that env var (or the previous code default) is the only
 * source, it is replaced with AIS Environmental Inc.
 */
export function resolveQuoteFromName(raw = process.env.SMTP_FROM_NAME) {
  const name = String(raw || '').replace(/[\r\n]+/g, ' ').replace(/[<>"]/g, '').trim()
  if (!name || LEGACY_FROM_NAMES.has(name)) return AIS_COMPANY_NAME
  return name
}

export const SAMPLE_QUOTE_LEAD = {
  name: 'Jordan Hale',
  email: 'jordan.hale@example.com',
  phone: '(312) 555-0148',
  service: 'Asbestos Inspection',
  propertyType: 'Residential',
  propertyAddress: '1842 W Division St',
  city: 'Chicago',
  state: 'IL',
  zipCode: '60622',
  timeline: 'This Month',
  description: 'Popcorn ceiling in the kitchen and a pipe chase in the basement. Please include containment & disposal.',
  submittedAt: '2026-11-16T15:04:00.000Z',
}

const EMAIL_UI_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const FORM_NAME = 'Website quote form'

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function sanitizeHeaderText(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim()
}

function emailLinkHref(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  try {
    return escapeHtml(new URL(trimmed).href)
  } catch {
    return escapeHtml(encodeURI(trimmed))
  }
}

function relativeLuminance(hex) {
  const raw = String(hex || '').replace('#', '').trim()
  if (!/^[0-9a-f]{6}$/i.test(raw)) return 0
  const channel = (pair) => {
    const c = parseInt(pair, 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const r = channel(raw.slice(0, 2))
  const g = channel(raw.slice(2, 4))
  const b = channel(raw.slice(4, 6))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function generateColorTheme(baseColor) {
  const color = /^#[0-9a-f]{6}$/i.test(baseColor || '') ? baseColor : '#1e40af'
  const hex = color.slice(1)
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const lighten = (amount) => {
    const mix = (channel) => Math.min(255, Math.round(channel + (255 - channel) * amount))
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
  }
  const darkText = relativeLuminance(color) > 0.45
  return {
    primary: color,
    light: lighten(0.3),
    title: darkText ? '#1e293b' : '#ffffff',
    subtitle: darkText ? 'rgba(30, 41, 59, 0.88)' : 'rgba(255, 255, 255, 0.9)',
  }
}

function filled(value, fallback) {
  const text = String(value ?? '').trim()
  return text || fallback
}

function quoteFields(formData) {
  return {
    name: filled(formData?.name, 'No name given'),
    email: filled(formData?.email, 'Not provided'),
    phone: filled(formData?.phone, 'Not provided'),
    service: filled(formData?.service, 'Not provided'),
    propertyType: filled(formData?.propertyType || formData?.property_type, 'Not provided'),
    propertyAddress: filled(formData?.propertyAddress || formData?.property_address, 'Not provided'),
    city: filled(formData?.city, 'Not provided'),
    state: filled(formData?.state, 'Not provided'),
    zip: filled(formData?.zipCode || formData?.zip_code, 'Not provided'),
    timeline: filled(formData?.timeline, 'Not provided'),
    description: filled(formData?.description || formData?.message, 'No description'),
    submitted: filled(formData?.submittedAt, new Date().toISOString()),
    photos: photoNames(formData),
  }
}

function photoNames(formData) {
  const raw = Array.isArray(formData?.photos) ? formData.photos : []
  return raw
    .map(item => {
      const name = typeof item === 'string' ? item : item?.filename || item?.fileName || ''
      return String(name).replace(/[\r\n]+/g, ' ').trim()
    })
    .filter(Boolean)
}

function photoCountLabel(count) {
  return `${count} ${count === 1 ? 'photo' : 'photos'}`
}

function detailCard(rows, { background, border, labelColor, accent }) {
  const cells = rows
    .map(
      (row) =>
        `<tr><td style="padding:5px 14px 5px 0;font-size:14px;font-weight:700;color:${labelColor};vertical-align:top;white-space:nowrap;">${escapeHtml(row.label)}</td><td style="padding:5px 0;font-size:14px;color:#334155;line-height:1.5;vertical-align:top;white-space:pre-wrap;">${escapeHtml(row.value)}</td></tr>`,
    )
    .join('')
  const accentStyle = accent ? `border-left:4px solid ${accent};` : ''
  return `<div style="background:${background};border-radius:12px;padding:18px 20px;margin:22px 0;border:1px solid ${border};${accentStyle}">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${cells}</table>
            </div>`
}

function brandedHtml({ brand, fields }) {
  const colors = generateColorTheme(brand.color)
  const accent = /^#[0-9a-f]{6}$/i.test(brand.accent || '') ? brand.accent : colors.primary
  const safeCompany = escapeHtml(brand.companyName)
  const year = new Date(fields.submitted).getFullYear() || new Date().getFullYear()
  const contactCard = detailCard(
    [
      { label: 'Name', value: fields.name },
      { label: 'Email', value: fields.email },
      { label: 'Phone', value: fields.phone },
    ],
    { background: '#f8fafc', border: '#e2e8f0', labelColor: '#0f172a', accent },
  )
  const projectCard = detailCard(
    [
      { label: 'Service', value: fields.service },
      { label: 'Property type', value: fields.propertyType },
      { label: 'Property address', value: fields.propertyAddress },
      { label: 'City', value: fields.city },
      { label: 'State', value: fields.state },
      { label: 'ZIP', value: fields.zip },
      { label: 'Timeline', value: fields.timeline },
      { label: 'Description', value: fields.description },
      { label: 'Submitted', value: fields.submitted },
    ],
    { background: '#ffffff', border: '#e2e8f0', labelColor: '#334155', accent: '' },
  )
  const photoCard = detailCard(
    [
      { label: 'Count', value: photoCountLabel(fields.photos.length) },
      { label: 'Files', value: fields.photos.length ? fields.photos.join('\n') : 'None' },
    ],
    { background: '#ffffff', border: '#e2e8f0', labelColor: '#334155', accent: '' },
  )
  const intro = `<p style="margin:0 0 8px;font-size:15px;line-height:1.65;color:#475569;">Reply to this email to reach <strong style="color:#0f172a;">${escapeHtml(fields.name)}</strong> directly.</p>`
  const logo = brand.logoUrl
    ? `<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;"><tr><td style="background:#ffffff;border-radius:12px;padding:12px 16px;"><img src="${emailLinkHref(brand.logoUrl)}" alt="${safeCompany}" width="220" style="display:block;width:220px;max-width:100%;height:auto;border:0;" /></td></tr></table>`
    : ''
  const footer = `${escapeHtml('Sent from the website quote form.')}<br/>${escapeHtml(brand.address)}<br/><a href="${escapeHtml(brand.phoneHref)}" style="color:#64748b;text-decoration:underline;">${escapeHtml(brand.phone)}</a><br/><a href="${emailLinkHref(brand.website)}" style="color:#64748b;text-decoration:underline;">${escapeHtml(brand.websiteLabel)}</a><br/><a href="${emailLinkHref(`mailto:${brand.email}`)}" style="color:#64748b;text-decoration:underline;">${escapeHtml(brand.email)}</a>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(`New quote request — ${fields.name}`)}</title>
</head>
<body style="margin:0;padding:28px 16px;background:#f1f5f9;font-family:${EMAIL_UI_FONT};color:#334155;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 14px 40px rgba(15,23,42,0.10);border:1px solid #e2e8f0;">
    <div style="padding:32px 28px 28px;text-align:center;background:linear-gradient(135deg,${colors.primary} 0%,${colors.light} 100%);">
      ${logo}
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${colors.subtitle};">New quote request</p>
      <h1 style="margin:0;font-size:24px;font-weight:800;line-height:1.25;letter-spacing:-0.03em;color:${colors.title};">${escapeHtml(fields.name)}</h1>
      <p style="margin:10px 0 0;font-size:15px;line-height:1.55;color:${colors.subtitle};">${escapeHtml(FORM_NAME)}</p>
    </div>
    <div style="padding:32px 28px 12px;color:#334155;">
      ${intro}
      ${contactCard}
      <p style="margin:22px 0 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Project details</p>
      ${projectCard}
      <p style="margin:22px 0 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Photos</p>
      ${photoCard}
    </div>
    <div style="padding:18px 28px 22px;text-align:center;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.55;color:#94a3b8;">
      ${footer}<br/>© ${year} ${safeCompany}
    </div>
  </div>
</body>
</html>`
}

function plainText(brand, fields) {
  const lines = [
    `Quote request from ${fields.name} — ${brand.companyName}`,
    FORM_NAME,
    '',
    `Reply to this email to reach ${fields.name} directly.`,
    '',
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    '',
    'Project details',
    `Service: ${fields.service}`,
    `Property type: ${fields.propertyType}`,
    `Property address: ${fields.propertyAddress}`,
    `City: ${fields.city}`,
    `State: ${fields.state}`,
    `ZIP: ${fields.zip}`,
    `Timeline: ${fields.timeline}`,
    `Description: ${fields.description}`,
    `Submitted: ${fields.submitted}`,
    '',
    'Photos',
    `Count: ${photoCountLabel(fields.photos.length)}`,
    `Files: ${fields.photos.length ? fields.photos.join('\n') : 'None'}`,
    '',
    'Sent from the website quote form.',
    brand.companyName,
    brand.address,
    brand.phone,
    brand.website,
    brand.email,
  ]
  return lines.join('\n')
}

export function quoteEmailSubject(name, companyName = AIS_COMPANY_NAME) {
  const who = sanitizeHeaderText(name) || 'No name given'
  return `Quote request from ${who} — ${companyName}`
}

export function renderQuoteNotification(formData, brand = AIS_QUOTE_EMAIL_BRAND) {
  const fields = quoteFields(formData)
  return {
    subject: quoteEmailSubject(fields.name, brand.companyName),
    text: plainText(brand, fields),
    html: brandedHtml({ brand, fields }),
  }
}
