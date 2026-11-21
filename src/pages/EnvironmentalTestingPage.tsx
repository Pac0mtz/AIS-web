import { Link } from 'react-router'
import { ArrowUpRight, Check } from 'lucide-react'
import { contact } from '../data'
import { Page, QuoteBand, SectionLabel } from '../components/Site'
import { getPageMeta, imageAttributes } from '../../server/page-meta.mjs'

const tests = [
  {
    path: '/asbestos-testing-sampling/',
    title: 'Asbestos testing',
    text: 'Appearance cannot confirm asbestos. Sampling covers materials the site already lists, including floor tile, mastic, pipe insulation, ceiling texture, plaster, roofing, siding and cement products. Laboratory analysis is used to decide whether the next step is management or abatement.',
  },
  {
    path: '/asbestos-surveys-inspections/',
    title: 'Asbestos surveys',
    text: 'A survey is broader than one sample. AIS documents accessible suspect materials, their condition and the areas a renovation or demolition would disturb. Scopes already offered include baseline assessments, renovation reviews, pre-demolition surveys and targeted re-inspections.',
  },
  {
    path: '/mold-testing-inspections/',
    title: 'Mold testing',
    text: 'Mold testing starts with the room and the moisture, not a lab result alone. Inspections use moisture readings and, when they answer a specific question, surface or air samples. The test does not by itself remove growth or correct the leak.',
  },
]

const cities = [
  ['Chicago', '/service-areas/chicago-il/'],
  ['Naperville', '/service-areas/naperville-il/'],
  ['Aurora', '/service-areas/aurora-il/'],
  ['Joliet', '/service-areas/joliet-il/'],
  ['Evanston', '/service-areas/evanston-il/'],
  ['Schaumburg', '/service-areas/schaumburg-il/'],
  ['Oak Park', '/service-areas/oak-park-il/'],
  ['Cicero', '/service-areas/cicero-il/'],
  ['Des Plaines', '/service-areas/des-plaines-il/'],
  ['Skokie', '/service-areas/skokie-il/'],
] as const

export function EnvironmentalTestingPage() {
  const meta = getPageMeta('/environmental-testing/')
  return (
    <Page title={meta.title} description={meta.description} className="service-page">
      <section className="service-hero shell">
        <div className="breadcrumbs"><Link to="/">Home</Link><span aria-hidden="true"> / </span><Link to="/services/">Services</Link><span aria-hidden="true"> / </span><span>Environmental testing</span></div>
        <div className="service-hero-grid">
          <div>
            <span className="micro-label">Asbestos · Mold · Material sampling</span>
            <h1>{meta.h1}</h1>
            <p className="service-slogan">{meta.slogan}</p>
          </div>
          <div className="service-hero-aside">
            <p>AIS Environmental Inc. tests properties in Chicago and across Illinois, Indiana and Wisconsin before materials are disturbed. Removal, remediation and repairs stay separate services, quoted only after the testing scope is clear.</p>
            <Link to="/get-a-quote/?service=Asbestos%20Inspection" className="button button-primary">Request a free estimate <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>
      <figure className="service-hero-image shell">
        <img src="/images/asbestos-testing.webp" alt="Technician documenting a building-material sample during an asbestos inspection" {...imageAttributes('/images/asbestos-testing.webp')} fetchPriority="high" decoding="async" />
      </figure>
      <section className="section shell">
        <div className="section-heading split-heading">
          <SectionLabel>Choose the test</SectionLabel>
          <h2>Asbestos and mold testing services.</h2>
          <p>Each one answers a different question. The visit is planned around the suspect material or moisture concern.</p>
        </div>
        <div className="service-list-plain">
          {tests.map(test => (
            <article className="service-detail" key={test.path}>
              <div>
                <h2><Link to={test.path}>{test.title}</Link></h2>
                <p>{test.text}</p>
                <Link to={test.path} className="text-link">Read the {test.title.toLowerCase()} page <ArrowUpRight size={16} /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading split-heading">
          <SectionLabel>When to test</SectionLabel>
          <h2>Test before the material is cut, sanded or removed.</h2>
          <p>Testing is planned around the materials, moisture concerns and work being considered.</p>
        </div>
        <ul className="area-needs">
          {[
            'Before renovation or demolition',
            'When suspect material is deteriorating',
            'During property due diligence',
            'Before flooring, roofing or mechanical work',
            'When a room has visible growth, a musty odor or a known leak',
          ].map(item => <li key={item}><Check size={18} aria-hidden="true" />{item}</li>)}
        </ul>
        <p>You cannot confirm asbestos by looking at a material. Mold testing does not fix the moisture that allowed growth.</p>
      </section>
      <section className="section shell">
        <div className="section-heading split-heading">
          <SectionLabel>Who it is for</SectionLabel>
          <h2>Homes, multi-family buildings and commercial properties.</h2>
          <p>The same testing services are already listed for homeowners, property managers, offices, industrial buildings, schools and contractors planning the next trade.</p>
        </div>
        <p>Call <a href={contact.phoneHref}>{contact.phoneDisplay}</a> or send the property address, what you are seeing and what work is planned. The office is at {contact.address}. Estimates are free. IDPH-licensed services and insured work are already part of how AIS describes the team. A license number, a lab turnaround promise and a published price are not.</p>
      </section>
      <section className="section shell">
        <div className="section-heading split-heading">
          <SectionLabel>Chicagoland</SectionLabel>
          <h2>City pages for communities AIS already serves.</h2>
          <p>Each city page describes the local property mix and links back to these testing services.</p>
        </div>
        <div className="city-link-grid">
          {cities.map(([name, path]) => (
            <Link to={path} key={path}><span><strong>{name}</strong><small>Illinois</small></span><ArrowUpRight size={17} /></Link>
          ))}
        </div>
        <p><Link to="/service-areas/" className="text-link">All Illinois, Indiana and Wisconsin service areas <ArrowUpRight size={16} /></Link></p>
      </section>
      <QuoteBand title="Need environmental testing before the project starts?" text="Tell us the property, the material or the moisture concern. We will point you to asbestos testing, a survey or mold testing." />
    </Page>
  )
}
