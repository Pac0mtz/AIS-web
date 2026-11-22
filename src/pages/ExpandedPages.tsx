import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, MapPin, Search } from 'lucide-react'
import { contact, services, type ServiceCategory } from '../data'
import { cityAreas, faqs, industries, projectTypes, stateAreas, type ServiceArea } from '../siteContent'
import { FormNotice, Page, QuoteBand, SectionLabel } from '../components/Site'
import { getPageMeta } from '../../server/page-meta.mjs'
import { ServiceCard } from '../components/ServiceCard'
import { useEmailDraft } from '../hooks/useEmailDraft'
import { BrandIcon } from '../components/BrandIcon'
import { CityLink } from '../components/CityLink'
import { BrandedBullet } from '../components/BrandedBullet'
import { areaMedia } from '../areaMedia'

const categoryDetails: Array<{ name: ServiceCategory; id: string; title: string; text: string }> = [
  { name: 'Asbestos', id: 'asbestos', title: 'Asbestos assessment & abatement', text: 'Testing, surveys, removal and demolition-related scopes for residential, commercial and industrial properties.' },
  { name: 'Lead & Mold', id: 'lead-mold', title: 'Lead paint & mold services', text: 'Lead paint removal and abatement, alongside mold inspection and remediation tailored to the affected space.' },
  { name: 'Water Damage', id: 'water-damage', title: 'Water damage & flooded basements', text: 'Water removal, structural drying, affected-material cleanup and practical repair coordination.' },
  { name: 'Exterior', id: 'exterior', title: 'Exterior property improvements', text: 'Roofing, siding, gutters, windows and doors with attention to fit, finish and weather protection.' },
]

function IndexHero({ eyebrow, title, intro, current }: { eyebrow: string; title: string; intro: string; current: string }) {
  return (
    <section className="index-hero shell">
      <div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13} /><span>{current}</span></div>
      <div className="index-hero-grid"><div><SectionLabel>{eyebrow}</SectionLabel><h1>{title}</h1></div><p>{intro}</p></div>
    </section>
  )
}

export function ServicesPage() {
  const meta = getPageMeta('/services/')
  return (
    <Page title={meta.title} description={meta.description} className="services-index-page">
      <IndexHero eyebrow={`${services.length} services / One property team`} title={meta.h1} intro="Start with a specific concern or review the full service catalog. Every service has its own page with scope details, process information and a direct estimate pathway." current="Services" />
      <p className="shell page-slogan">{meta.slogan} Need sampling first? See <Link to="/environmental-testing/">environmental testing in Chicago</Link>.</p>
      <nav className="category-jump shell" aria-label="Service categories">{categoryDetails.map((category, index) => <a href={`#${category.id}`} key={category.id}><span>0{index + 1}</span>{category.name}<ArrowRight size={16} /></a>)}</nav>
      {categoryDetails.map(category => {
        const items = services.filter(service => service.category === category.name)
        return (
          <section className="section shell service-catalog-section" id={category.id} key={category.id}>
            <div className="section-heading split-heading"><SectionLabel>{category.name} / {String(items.length).padStart(2, '0')} services</SectionLabel><h2>{category.title}</h2><p>{category.text}</p></div>
            <div className="service-list">{items.map(service => <ServiceCard service={service} key={service.path} />)}</div>
          </section>
        )
      })}
      <QuoteBand title="Not sure which service fits?" text="Describe the property, what you are seeing and any work you are planning. We will help identify a practical first step." />
    </Page>
  )
}

export function IndustriesPage() {
  const meta = getPageMeta('/industries/')
  return (
    <Page title={meta.title} description={meta.description} className="industries-page">
      <IndexHero eyebrow="Industries we serve / Eight client sectors" title={meta.h1} intro="Every sector has different occupants, schedules and operational priorities. We adapt the scope and communication while keeping the work focused on safe practices and clear outcomes." current="Industries We Serve" />
      <p className="shell page-slogan">{meta.slogan}</p>
      <section className="industry-overview shell">{industries.map(industry => <a href={`#${industry.id}`} key={industry.id}><span className="brand-icon-badge industry-icon"><BrandIcon name={industry.id} /></span><span className="industry-number">{industry.number}</span><strong>{industry.shortName}</strong><p>{industry.summary}</p><ArrowUpRight size={18} /></a>)}</section>
      <div className="industry-detail-list shell">
        {industries.map(industry => {
          const related = industry.serviceSlugs.map(slug => services.find(service => service.slug === slug)).filter(Boolean)
          return (
            <section className="industry-detail" id={industry.id} key={industry.id}>
              <div className="industry-detail-heading"><span className="brand-icon-badge industry-detail-icon"><BrandIcon name={industry.id} /></span><span className="industry-number">{industry.number}</span><SectionLabel>{industry.shortName}</SectionLabel><h2>{industry.name}</h2><p className="large-copy">{industry.summary}</p><p>{industry.description}</p></div>
              <div className="industry-detail-lists"><div><span className="micro-label">Properties we support</span><ul>{industry.properties.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul></div><div><span className="micro-label">Planning priorities</span><ul>{industry.priorities.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul></div></div>
              <div className="industry-services"><span className="micro-label">Relevant services</span><div>{related.map(service => service && <Link to={service.path} key={service.path}>{service.name}<ArrowUpRight size={15} /></Link>)}</div></div>
            </section>
          )
        })}
      </div>
      <QuoteBand title="Tell us about your property and the people using it." text="We will discuss the space, the work and the coordination needed for your sector." />
    </Page>
  )
}

export function FaqPage() {
  const meta = getPageMeta('/faq/')
  const groups = [...new Set(faqs.map(faq => faq.category))]
  return (
    <Page title={meta.title} description={meta.description} className="faq-page">
      <IndexHero eyebrow="Frequently asked questions" title={meta.h1} intro="Start with the basics, then contact us for property-specific guidance. Building conditions and project requirements vary, so the next step should always reflect your actual space." current="FAQ" />
      <p className="shell page-slogan">{meta.slogan}</p>
      <section className="section shell faq-layout">
        <aside className="faq-aside"><span className="micro-label">Topics</span>{groups.map(group => <a href={`#${group.toLowerCase().replaceAll(' ', '-')}`} key={group}>{group}<ArrowRight size={15} /></a>)}<div><strong>Still have a question?</strong><Link to="/contact/" className="text-link">Contact AIS <ArrowUpRight size={16} /></Link></div></aside>
        <div className="faq-groups">{groups.map(group => <section id={group.toLowerCase().replaceAll(' ', '-')} key={group}><SectionLabel>{group}</SectionLabel>{faqs.filter(faq => faq.category === group).map(faq => <details className="faq-item" key={faq.question}><summary><h2>{faq.question}</h2><ChevronDown size={21} /></summary><p>{faq.answer}</p></details>)}</section>)}</div>
      </section>
      <QuoteBand title="Your property may need a more specific answer." text="Tell us what you are seeing and what work you are planning. We can help clarify the next step." />
    </Page>
  )
}

export function ReviewsPage() {
  const meta = getPageMeta('/reviews/')
  const form = useEmailDraft('Feedback for AIS Environmental Inc.')
  return (
    <Page title={meta.title} description={meta.description} className="reviews-page">
      <IndexHero eyebrow="Customer feedback" title={meta.h1} intro="Clear communication and careful work matter throughout a project. Share feedback directly with our team using the form below; submissions are not published automatically." current="Reviews" />
      <p className="shell page-slogan">{meta.slogan}</p>
      <section className="section shell review-standards"><div className="section-heading split-heading"><SectionLabel>Our service standard</SectionLabel><h2>What clients should expect.</h2><p>These are working commitments, not anonymous testimonial claims.</p></div><div className="process-grid"><div className="process-step"><span>01</span><h3>A clear scope</h3><p>Understand the work area, the planned methods and the questions that still need answers.</p></div><div className="process-step"><span>02</span><h3>A careful work area</h3><p>Protect surrounding spaces and use procedures suited to the material and property.</p></div><div className="process-step"><span>03</span><h3>A useful closeout</h3><p>Review the completed scope, relevant documentation and any recommended next step.</p></div></div></section>
      <section className="review-form-section"><div className="shell review-form-grid"><div><SectionLabel>Share feedback</SectionLabel><h2>Tell us about your project.</h2><p>Your email application will open a prepared draft for you to review and send. No feedback is stored or published by this website.</p></div><form className="contact-form" action={`mailto:${contact.email}`} method="get" onSubmit={form.submit}><div className="form-row"><label>Name<input name="name" required data-email-label="Name" autoComplete="name" /></label><label>Email<input name="email" type="email" required data-email-label="Email" autoComplete="email" /></label></div><div className="form-row"><label>Service<select name="service" required data-email-label="Service" defaultValue=""><option value="" disabled>Select a service</option>{services.map(service => <option key={service.slug} value={service.name}>{service.name}</option>)}</select></label><label>Project location<input name="location" required data-email-label="Project location" autoComplete="address-level2" /></label></div><label>Your feedback<textarea name="feedback" required data-email-label="Feedback" rows={6} placeholder="What went well? What could we do better?" /></label><button className="button button-primary" type="submit">Prepare feedback email <ArrowUpRight size={18} /></button><FormNotice>{form.notice}</FormNotice></form></div></section>
      <QuoteBand title="Ready to discuss a new property project?" />
    </Page>
  )
}

export function ProjectsPage() {
  const meta = getPageMeta('/projects/')
  return (
    <Page title={meta.title} description={meta.description} className="projects-page">
      <IndexHero eyebrow="Projects / Capabilities" title={meta.h1} intro={meta.slogan} current="Projects" />
      <section className="section shell"><div className="project-type-grid">{projectTypes.map(project => { const related = project.serviceSlugs.map(slug => services.find(service => service.slug === slug)).filter(Boolean); return <article className="project-type" key={project.number}><div className="project-type-image"><img src={project.image} alt="" loading="lazy" decoding="async" /><span>{project.number}</span><span className="brand-icon-badge project-type-icon"><BrandIcon name={`project-${project.number}`} /></span></div><h2>{project.title}</h2><p>{project.text}</p><div className="project-service-links">{related.map(service => service && <Link to={service.path} key={service.path}>{service.name}<ArrowUpRight size={15} /></Link>)}</div></article>})}</div></section>
      <section className="section project-process"><div className="shell"><div className="section-heading split-heading"><SectionLabel>From scope to closeout</SectionLabel><h2>A project plan you can follow.</h2><p>The exact sequence changes with the property, but the important checkpoints should stay clear.</p></div><div className="process-grid"><div className="process-step"><span>01</span><h3>Assess</h3><p>Review the property, affected materials and intended work.</p></div><div className="process-step"><span>02</span><h3>Define</h3><p>Organize the scope, work area, access and project sequence.</p></div><div className="process-step"><span>03</span><h3>Complete</h3><p>Carry out the agreed work and clean the affected area.</p></div><div className="process-step"><span>04</span><h3>Document</h3><p>Review relevant records and the next construction or repair step.</p></div></div></div></section>
      <QuoteBand title="Have a project that does not fit a standard category?" text="Share the property details and intended work. We will help define the appropriate service scope." />
    </Page>
  )
}

export function ServiceAreasPage() {
  const meta = getPageMeta('/service-areas/')
  const [query, setQuery] = useState('')
  const filtered = cityAreas.filter(area => `${area.name} ${area.state}`.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <Page title={meta.title} description={meta.description} className="areas-page">
      <IndexHero eyebrow="Service areas / Illinois" title={meta.h1} intro="AIS serves cities across Illinois, including Chicago and the surrounding communities. Find your city below, then review asbestos testing, mold testing and the other services available for your property." current="Service Areas" />
      <section className="state-card-grid shell">{stateAreas.map((area, index) => <Link to={area.path} className="state-card" key={area.path}><span>0{index + 1} / {area.stateCode}</span><h2>{area.name}</h2><p>{cityAreas.filter(city => city.stateCode === area.stateCode).length} city service pages</p><strong>Explore {area.name} <ArrowUpRight size={18} /></strong></Link>)}</section>
      <section className="section shell area-directory"><div className="section-heading split-heading"><SectionLabel>City directory</SectionLabel><h2>Find your service area.</h2><p>Every city page includes local property context, available services and direct contact options.</p></div><div className="area-controls"><label className="area-search"><span>Search Illinois cities</span><div><Search size={19} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Chicago or Aurora" /></div></label></div><p className="area-result-count" role="status">{filtered.length} {filtered.length === 1 ? 'community' : 'communities'} shown</p><div className="city-link-grid">{filtered.map(area => <CityLink city={area} key={area.path} />)}</div>{filtered.length === 0 && <div className="area-empty"><h3>No matching city found.</h3><p>Clear the search or contact us to discuss your property location.</p><button type="button" className="button button-outline" onClick={() => setQuery('')}>Show all service areas</button></div>}</section>
      <QuoteBand title="Do not see your exact community?" text="Contact us with the property address. We will confirm scheduling and service availability for your location." />
    </Page>
  )
}

export function AreaPage({ area }: { area: ServiceArea }) {
  const meta = getPageMeta(area.path)
  const photo = areaMedia[area.slug]
  const isState = area.kind === 'state'
  const localCities = cityAreas.filter(city => city.stateCode === area.stateCode)
  const currentIndex = localCities.findIndex(city => city.slug === area.slug)
  const moreCities = isState ? localCities : [...localCities.slice(currentIndex + 1), ...localCities.slice(0, currentIndex)].slice(0, 8)
  return (
    <Page title={meta.title} description={meta.description} className="area-page">
      <section className="area-hero">
        <div className="shell"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13} /><Link to="/service-areas/">Service areas</Link><ChevronRight size={13} />{!isState && <><Link to={`/service-areas/${area.stateSlug}/`}>{area.state}</Link><ChevronRight size={13} /></>}<span>{area.name}</span></div><div className="area-hero-grid"><div><SectionLabel light>{isState ? `${area.stateCode} / State service area` : `${area.stateCode} / Local service area`}</SectionLabel><h1>{meta.h1}</h1><p className="page-slogan">{meta.slogan}</p></div><div><p>AIS Environmental supports {area.context}. Our services range from environmental testing and abatement to water-damage restoration and exterior improvements.</p><Link to="/get-a-quote/" className="button button-primary area-estimate-button">Request a free estimate <ArrowUpRight size={18} /></Link></div></div></div>
      </section>
      <figure className="area-hero-photo shell" id="local-view">
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} fetchPriority="high" decoding="async" />
        <figcaption><span>{photo.caption}</span><span>Photo: <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.author}</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></span></figcaption>
      </figure>
      <section className="section shell area-content-grid"><div><SectionLabel>Serving {area.name}</SectionLabel><h2>One team for the building and the concern inside it.</h2><p className="large-copy">Property support for {area.name}, {area.state}, with service scopes adapted to the building and the work being planned.</p><p>Contact our team with the property address, the affected area and any renovation or repair plans. We will discuss the appropriate testing, inspection, removal, restoration or installation service and confirm scheduling for your location.</p><ul className="area-needs">{area.needs.map(need => <li key={need}><BrandedBullet />{need}</li>)}</ul></div><aside className="area-contact-card"><MapPin size={25} /><span className="micro-label">{isState ? 'Statewide service' : `${area.name} service area`}</span><h3>Start with your property address.</h3><p>Call {contact.phoneDisplay} or prepare a free estimate request online.</p><Link to="/contact/" className="button button-outline area-contact-button">Contact AIS <ArrowUpRight size={17} /></Link></aside></section>
      <section className="section area-services"><div className="shell"><div className="section-heading split-heading"><SectionLabel>Available services</SectionLabel><h2>Services available in {area.name}.</h2><p>Explore a service page for process details, common materials and estimate options.</p></div><div className="area-service-link-grid">{services.map(service => <Link to={service.path} key={service.path}><span>{service.number}</span><strong>{service.name}</strong><ArrowUpRight size={16} /></Link>)}</div></div></section>
      <section className="section shell area-city-section"><div className="journal-heading"><div><SectionLabel>{isState ? `${area.name} city directory` : `More ${area.state} service areas`}</SectionLabel><h2>{isState ? `Explore ${area.name} communities.` : `Serving communities across ${area.state}.`}</h2></div>{!isState && <Link to={`/service-areas/${area.stateSlug}/`} className="text-link">All {area.name} areas <ArrowUpRight size={16} /></Link>}</div><div className="city-link-grid">{moreCities.map(city => <CityLink city={city} key={city.path} />)}</div></section>
      <section className="section shell">
        <SectionLabel>Testing in {area.name}</SectionLabel>
        <h2>Asbestos and mold testing in {area.name}.</h2>
        <p>AIS already serves {area.context}. Asbestos sampling and mold inspections help plan removal, remediation or repairs. We also provide lead paint removal and abatement.</p>
        <div className="area-service-link-grid">
          <Link to="/environmental-testing/"><span>01</span><strong>Environmental testing</strong><ArrowUpRight size={16} /></Link>
          <Link to="/asbestos-testing-sampling/"><span>02</span><strong>Asbestos testing</strong><ArrowUpRight size={16} /></Link>
          <Link to="/asbestos-surveys-inspections/"><span>03</span><strong>Asbestos surveys</strong><ArrowUpRight size={16} /></Link>
          <Link to="/mold-testing-inspections/"><span>04</span><strong>Mold testing</strong><ArrowUpRight size={16} /></Link>
        </div>
      </section>
      <QuoteBand title={`Planning a property project in ${area.name}?`} text="Tell us what you are seeing and where the property is located. We will help identify the right service and discuss scheduling." />
    </Page>
  )
}
