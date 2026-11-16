import nodemailer from 'nodemailer'

const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.titan.email',
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || 'true') !== 'false',
  auth: {
    user: process.env.SMTP_USER || 'info@aisenvironmentalinc.com',
    pass: process.env.SMTP_PASS || '',
  },
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
}

const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'info@aisenvironmentalinc.com'
const fromName = process.env.SMTP_FROM_NAME || 'AIS Environmental'
const notifyTo = process.env.LEAD_NOTIFY_EMAIL || fromEmail

function transporter() {
  return nodemailer.createTransport(smtpConfig)
}

export async function verifySmtp() {
  if (!smtpConfig.auth.pass) {
    console.error('SMTP_PASS is not set')
    return false
  }
  try {
    await transporter().verify()
    console.log('SMTP server is ready')
    return true
  } catch (error) {
    console.error('SMTP connection error:', error?.message || error)
    return false
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function leadLines(formData) {
  return [
    ['Name', formData.name],
    ['Email', formData.email],
    ['Phone', formData.phone || 'Not provided'],
    ['Service', formData.service || 'Not provided'],
    ['Property type', formData.propertyType || formData.property_type || 'Not provided'],
    ['Property address', formData.propertyAddress || formData.property_address || 'Not provided'],
    ['City', formData.city || 'Not provided'],
    ['State', formData.state || 'Not provided'],
    ['ZIP', formData.zipCode || formData.zip_code || 'Not provided'],
    ['Timeline', formData.timeline || 'Not provided'],
    ['Description', formData.description || formData.message || 'No description'],
    ['Submitted', formData.submittedAt || new Date().toISOString()],
  ]
}

export async function sendQuoteEmail(formData) {
  if (!smtpConfig.auth.pass) throw new Error('SMTP_PASS is not configured')
  const rows = leadLines(formData)
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')
  const html = `
    <h2>New AIS website lead</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows.map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join('')}
    </table>
  `
  await transporter().sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: notifyTo,
    replyTo: formData.email,
    subject: `New quote request — ${formData.name || 'Website lead'}`,
    text,
    html,
  })
  return true
}
