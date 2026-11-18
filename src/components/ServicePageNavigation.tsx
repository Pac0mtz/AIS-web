import { useEffect, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, ClipboardCheck, ClipboardList, Droplets, FileCheck2, FlaskConical,
  Hammer, House, Layers, ListChecks, PaintRoller, Phone, Ruler, ScanSearch, ShieldCheck, Wind, Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import { contact, type ServiceSection } from '../data'

const sectionIcons: Record<string, LucideIcon> = {
  materials: Layers,
  inspection: ScanSearch,
  removal: Hammer,
  encapsulation: PaintRoller,
  documentation: FileCheck2,
  testing: FlaskConical,
  safety: ShieldCheck,
  remediation: ShieldCheck,
  moisture: Droplets,
  'air-quality': Wind,
  'when-to-replace': ScanSearch,
  replacement: Ruler,
  'window-options': Layers,
  benefits: ClipboardCheck,
  'when-to-test': ScanSearch,
  'materials-tested': Layers,
  'sampling-process': FlaskConical,
  results: FileCheck2,
  'survey-types': ClipboardList,
  'accessible-areas': House,
  condition: ScanSearch,
  'survey-reporting': FileCheck2,
  'commercial-planning': ClipboardList,
  'commercial-containment': ShieldCheck,
  'commercial-removal': Hammer,
  'commercial-closeout': FileCheck2,
  'tile-assessment': Layers,
  'tile-preparation': ShieldCheck,
  'tile-removal-methods': Hammer,
  'tile-finish': ClipboardCheck,
  'pre-demolition': ClipboardList,
  'selective-demolition': Hammer,
  'demolition-controls': ShieldCheck,
  'demolition-handoff': FileCheck2,
  'inspection-scope': ClipboardList,
  'testing-methods': FlaskConical,
  'friction-surfaces': Layers,
  'inspection-report': FileCheck2,
  'mold-inspection': ScanSearch,
  'moisture-assessment': Droplets,
  'mold-sampling': FlaskConical,
  'mold-next-steps': FileCheck2,
  'water-assessment': ScanSearch,
  'water-extraction': Droplets,
  'structural-drying': Wind,
  'restoration-plan': ClipboardCheck,
  'basement-source': ScanSearch,
  'basement-cleanup': Droplets,
  'basement-drying': Wind,
  'basement-repair': Wrench,
  'roof-assessment': ScanSearch,
  'roof-repair': Wrench,
  'roof-replacement': House,
  'roof-water': Droplets,
  'siding-review': ScanSearch,
  'siding-repair': Wrench,
  'siding-installation': Layers,
  'siding-coordination': ClipboardCheck,
  'gutter-review': ScanSearch,
  'gutter-repair': Wrench,
  'gutter-installation': Ruler,
  'drainage-impact': Droplets,
  'door-review': ScanSearch,
  'door-options': Layers,
  'door-installation': Ruler,
  'door-finish': ClipboardCheck,
}

export function ServiceSectionMarker({ id, index }: { id: string; index: number }) {
  const Icon = sectionIcons[id] ?? ListChecks

  return (
    <span className="service-step-marker" aria-hidden="true">
      <Icon size={19} strokeWidth={1.7} />
      <span>{String(index + 1).padStart(2, '0')}</span>
    </span>
  )
}

export function ServicePageNavigation({ sections }: { sections: ServiceSection[] }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const targets = sections.map(section => document.getElementById(section.id))
    let frame = 0

    const updateActiveSection = () => {
      frame = 0
      const readingLine = Math.min(window.innerHeight * 0.4, 190)
      const current = targets.find(target => {
        if (!target) return false
        const { top, bottom } = target.getBoundingClientRect()
        return top <= readingLine && bottom > readingLine
      })
      setActiveId(current?.id ?? '')
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [sections])

  return (
    <aside className="service-toc">
      <p className="service-toc-title" id="service-toc-title"><ListChecks size={18} aria-hidden="true" /> On this page</p>
      <nav aria-labelledby="service-toc-title">
        <ol role="list">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} aria-current={activeId === section.id ? 'location' : undefined}>
                <ServiceSectionMarker id={section.id} index={index} />
                <span className="service-toc-link-text">{section.title}</span>
                <ArrowRight className="service-toc-arrow" size={15} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <a className="service-toc-call" href={contact.phoneHref}>
        <span className="service-call-icon"><Phone size={19} aria-hidden="true" /></span>
        <span className="service-call-copy"><span>Call AIS</span><strong>{contact.phoneDisplay}</strong></span>
        <ArrowUpRight className="service-action-arrow" size={17} aria-hidden="true" />
      </a>
    </aside>
  )
}

export function ServiceEstimateLink({ href }: { href: string }) {
  return (
    <Link to={href} className="button button-primary service-estimate-link">
      Request a free estimate
      <span className="service-estimate-arrow"><ArrowUpRight className="service-action-arrow" size={19} aria-hidden="true" /></span>
    </Link>
  )
}

export function ServiceProjectCTA({ href, serviceName }: { href: string; serviceName: string }) {
  return (
    <section className="section shell service-project-cta" aria-labelledby="service-project-cta-title">
      <div className="service-project-card">
        <div className="service-project-intro">
          <span className="service-project-icon" aria-hidden="true"><ClipboardCheck size={24} strokeWidth={1.7} /></span>
          <div>
            <h2 id="service-project-cta-title">Planning your {serviceName.toLowerCase()} project?</h2>
            <p>Tell us about your property and the work you need. We’ll follow up to discuss the scope and next steps.</p>
          </div>
        </div>
        <div className="service-project-actions">
          <ServiceEstimateLink href={href} />
          <a className="service-project-phone" href={contact.phoneHref}>
            <Phone size={17} aria-hidden="true" /> Call {contact.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
