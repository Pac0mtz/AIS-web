const FORM_TOKENS = {
  fullscreen: process.env.FTP_FORM_FULLSCREEN || 'a5bd41e6ae2d2bfdf34931d67c44b44a',
  hero: process.env.FTP_FORM_HERO || '1457814a266fdfdf6f5d35cb31be7791',
  contact: process.env.FTP_FORM_CONTACT || '741710e6ae59458396a6b983e7028d33',
  service: process.env.FTP_FORM_SERVICE || 'b93d05cd1a5731ff5f4f6105a033ab57',
  location: process.env.FTP_FORM_LOCATION || '60ed1488cc455867e456d3da31c289e3',
}

const FTP_SERVICES = [
  'Asbestos Inspection',
  'Asbestos Removal',
  'Asbestos Survey',
  'Lead Paint Inspection',
  'Lead Paint Removal',
  'Mold Testing',
  'Mold Remediation',
  'Water Damage Restoration',
  'Windows / Doors',
  'Roofing',
  'Siding / Gutters',
  'Other',
]

const FTP_PROPERTY_TYPES = ['Residential', 'Commercial', 'Mixed Use', 'Other']
const FTP_TIMELINES = ['ASAP', 'This Month', 'Next 30-60 Days', 'Planning Ahead', 'Not Sure']

function mapService(raw) {
  const trimmed = String(raw || '').trim()
  if (!trimmed) return 'Other'
  if (FTP_SERVICES.includes(trimmed)) return trimmed
  const lower = trimmed.toLowerCase()
  if (lower.includes('asbestos') && lower.includes('survey')) return 'Asbestos Survey'
  if (lower.includes('asbestos') && (lower.includes('remov') || lower.includes('abat'))) return 'Asbestos Removal'
  if (lower.includes('asbestos')) return 'Asbestos Inspection'
  if (lower.includes('mold') && lower.includes('remed')) return 'Mold Remediation'
  if (lower.includes('mold')) return 'Mold Testing'
  if (lower.includes('lead')) return lower.includes('remov') ? 'Lead Paint Removal' : 'Lead Paint Inspection'
  if (lower.includes('window') || lower.includes('door')) return 'Windows / Doors'
  if (lower.includes('roof')) return 'Roofing'
  if (lower.includes('siding') || lower.includes('gutter')) return 'Siding / Gutters'
  if (lower.includes('water') || lower.includes('flood')) return 'Water Damage Restoration'
  return 'Other'
}

function mapPropertyType(raw) {
  const trimmed = String(raw || '').trim()
  if (FTP_PROPERTY_TYPES.includes(trimmed)) return trimmed
  const lower = trimmed.toLowerCase()
  if (lower.startsWith('residential')) return 'Residential'
  if (lower.startsWith('commercial')) return 'Commercial'
  if (lower.includes('mixed')) return 'Mixed Use'
  return trimmed ? 'Other' : 'Other'
}

function mapTimeline(raw) {
  const trimmed = String(raw || '').trim()
  if (!trimmed) return ''
  if (FTP_TIMELINES.includes(trimmed)) return trimmed
  return ''
}

function composePropertyAddress(body) {
  const street = String(body.propertyAddress || body.property_address || '').trim()
  const city = String(body.city || '').trim()
  const state = String(body.state || '').trim()
  const zip = String(body.zipCode || body.zip_code || '').trim()
  const cityLine = [city, state].filter(Boolean).join(', ')
  const locality = [cityLine, zip].filter(Boolean).join(' ').trim()
  if (street && locality) return `${street}, ${locality}`
  return street || locality || 'Not provided'
}

function submitUrl(kind) {
  const token = FORM_TOKENS[kind] || FORM_TOKENS.hero
  return `https://fieldtaskpro.com/api/public/crm-lead/${token}`
}

export async function forwardQuoteToFieldtaskpro(body, kind = 'hero') {
  const formKind = FORM_TOKENS[body.formKind] ? body.formKind : kind
  const service = mapService(body.service)
  const propertyType = mapPropertyType(body.propertyType || body.property_type)
  const address = composePropertyAddress(body)
  const timeline = mapTimeline(body.timeline)
  const notes = String(body.description || body.message || body.notes || '').trim()

  const payload = {
    name: String(body.name || '').trim() || 'Website lead',
    email: String(body.email || '').trim(),
    phone: String(body.phone || '').trim() || '0000000000',
    service_needed: service,
    property_type: propertyType,
    property_address: address,
  }
  if (timeline) payload.timeline = timeline
  if (notes) payload.notes = notes

  try {
    const response = await fetch(submitUrl(formKind), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      console.error('Fieldtaskpro lead forward failed:', formKind, response.status, text.slice(0, 400))
      return false
    }
    return true
  } catch (error) {
    console.error('Fieldtaskpro lead forward error:', error)
    return false
  }
}
