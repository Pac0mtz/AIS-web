import { useEffect } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { contact } from '../data'
import { Page } from '../components/Site'
import { scheduleRequestQuoteConversion } from '../lib/analytics'

export function ThankYouPage() {
  useEffect(() => scheduleRequestQuoteConversion(), [])

  return (
    <Page
      title="Thank you | AIS Environmental"
      description="AIS Environmental received your project estimate request and will follow up soon."
      robots="noindex, nofollow"
    >
      <section className="thank-you shell">
        <span className="micro-label">Request received</span>
        <h1>Thank you.<br />We&apos;ll follow up.</h1>
        <p>Your project estimate request is in. A member of the AIS team will review the details and contact you shortly. For something urgent, call us directly.</p>
        <div className="hero-actions">
          <a href={contact.phoneHref} className="button button-primary">Call {contact.phoneDisplay} <ArrowUpRight size={18} /></a>
          <Link to="/" className="text-link">Back home <ArrowRight size={18} /></Link>
        </div>
      </section>
    </Page>
  )
}
