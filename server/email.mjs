import nodemailer from 'nodemailer'
import { renderQuoteNotification, resolveQuoteFromName } from './quote-email-template.mjs'

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
const fromName = resolveQuoteFromName(process.env.SMTP_FROM_NAME)
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

export async function sendQuoteEmail(formData) {
  if (!smtpConfig.auth.pass) throw new Error('SMTP_PASS is not configured')
  const message = renderQuoteNotification(formData)
  await transporter().sendMail({
    from: { name: fromName, address: fromEmail },
    to: notifyTo,
    replyTo: formData.email,
    subject: message.subject,
    text: message.text,
    html: message.html,
  })
  return true
}
