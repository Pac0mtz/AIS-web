import { useEffect } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { contact } from '../data'
import { Page } from '../components/Site'
import { scheduleRequestQuoteConversion } from '../lib/analytics'
import { getPageMeta } from '../../server/page-meta.mjs'

export function ThankYouPage() {
  const meta = getPageMeta('/thank-you')
  useEffect(() => scheduleRequestQuoteConversion(), [])

  return (
    <Page
      title={meta.title}
      description={meta.description}
      robots={meta.robots}
    >
      <section className="thank-you shell">
        <span className="micro-label">Request received</span>
        <h1>{meta.h1}</h1>
        <p className="page-slogan">{meta.slogan}</p>
        <p>Your project estimate request is in. A member of the AIS team will review the details and contact you shortly. For something urgent, call us directly.</p>
        <div className="hero-actions">
          <a href={contact.phoneHref} className="button button-primary">Call {contact.phoneDisplay} <ArrowUpRight size={18} /></a>
          <Link to="/" className="text-link">Back home <ArrowRight size={18} /></Link>
        </div>
      </section>
    </Page>
  )
}
