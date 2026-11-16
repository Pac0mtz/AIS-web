import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import {
  LEAD_PROPERTY_TYPES,
  LEAD_SERVICES,
  LEAD_TIMELINES,
  aisQuoteFormKindFromPath,
  type AisQuoteFormKind,
  type LeadFormPayload,
} from '../lib/lead-form'
import { FormNotice } from './Site'
import { QuotePhotoField, type QuotePhoto } from './QuotePhotoField'

const empty: LeadFormPayload = {
  name: '',
  email: '',
  phone: '',
  service: '',
  timeline: '',
  description: '',
  propertyAddress: '',
  city: '',
  state: '',
  zipCode: '',
  propertyType: '',
}

export function LeadForm({
  formKind,
  initialService = '',
  submitLabel = 'Request a free estimate',
  className = 'contact-form',
}: {
  formKind?: AisQuoteFormKind
  initialService?: string
  submitLabel?: string
  className?: string
}) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const resolvedKind = formKind ?? aisQuoteFormKindFromPath(pathname)
  const [data, setData] = useState<LeadFormPayload>({ ...empty, service: initialService })
  const [photos, setPhotos] = useState<QuotePhoto[]>([])
  const [photoError, setPhotoError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof LeadFormPayload>(key: K, value: LeadFormPayload[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    if (!data.name.trim() || !data.email.trim() || !data.phone.trim() || !data.service.trim()) {
      setNotice('Please fill in name, email, phone, and service.')
      return
    }
    setSubmitting(true)
    try {
      const body = new FormData()
      body.append('name', data.name.trim())
      body.append('email', data.email.trim())
      body.append('phone', data.phone.trim())
      body.append('service', data.service)
      body.append('timeline', data.timeline)
      body.append('description', data.description.trim())
      body.append('propertyAddress', data.propertyAddress.trim())
      body.append('city', data.city.trim())
      body.append('state', data.state.trim())
      body.append('zipCode', data.zipCode.trim())
      body.append('propertyType', data.propertyType)
      body.append('formKind', resolvedKind)
      body.append('submittedAt', new Date().toISOString())
      for (const photo of photos) body.append('photos', photo.file, photo.file.name)
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.success) {
        setNotice(result.error || result.message || 'Could not send your request. Please try again or call us.')
        return
      }
      for (const photo of photos) URL.revokeObjectURL(photo.previewUrl)
      navigate('/thank-you')
    } catch {
      setNotice('Could not send your request. Please try again or call us.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={className} onSubmit={onSubmit} noValidate>
      <div className="form-heading">
        <span className="micro-label">Project inquiry</span>
        <h2>How can we help?</h2>
      </div>

      <label>Full name
        <input name="name" required autoComplete="name" value={data.name} onChange={e => update('name', e.target.value)} />
      </label>
      <div className="form-row">
        <label>Email
          <input name="email" type="email" required autoComplete="email" value={data.email} onChange={e => update('email', e.target.value)} />
        </label>
        <label>Phone
          <input name="phone" type="tel" required autoComplete="tel" value={data.phone} onChange={e => update('phone', e.target.value)} />
        </label>
      </div>

      <label>Service needed
        <select name="service" required value={data.service} onChange={e => update('service', e.target.value)}>
          <option value="" disabled>Select a service</option>
          {LEAD_SERVICES.map(service => <option key={service} value={service}>{service}</option>)}
        </select>
      </label>

      <label>Property type
        <select name="propertyType" value={data.propertyType} onChange={e => update('propertyType', e.target.value)}>
          <option value="">Select property type</option>
          {LEAD_PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>

      <label>Property address
        <input name="propertyAddress" autoComplete="street-address" value={data.propertyAddress} onChange={e => update('propertyAddress', e.target.value)} />
      </label>
      <div className="form-row">
        <label>City
          <input name="city" autoComplete="address-level2" value={data.city} onChange={e => update('city', e.target.value)} />
        </label>
        <label>State
          <input name="state" autoComplete="address-level1" value={data.state} onChange={e => update('state', e.target.value)} />
        </label>
      </div>
      <div className="form-row">
        <label>ZIP code
          <input name="zipCode" autoComplete="postal-code" value={data.zipCode} onChange={e => update('zipCode', e.target.value)} />
        </label>
        <label>Timeline
          <select name="timeline" value={data.timeline} onChange={e => update('timeline', e.target.value)}>
            <option value="">Select timeline</option>
            {LEAD_TIMELINES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <label>Project details
        <textarea
          name="description"
          rows={6}
          placeholder="Property type, location, and what you are seeing…"
          value={data.description}
          onChange={e => update('description', e.target.value)}
        />
      </label>

      <QuotePhotoField
        photos={photos}
        error={photoError}
        onChange={(next, error) => {
          setPhotos(next)
          setPhotoError(error)
        }}
      />

      <button className="button button-primary" type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : submitLabel} <ArrowUpRight size={19} />
      </button>
      <p className="form-footnote">We email your request to AIS and save it in Fieldtaskpro. No password-protected mailbox access is required on your device.</p>
      <FormNotice>{notice}</FormNotice>
    </form>
  )
}
