import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Pause, Play } from 'lucide-react'
import { Link } from 'react-router'
import { services } from '../data'
import { imageAttributes } from '../../server/page-meta.mjs'
import type { LEAD_SERVICES } from '../lib/lead-form'
import { BrandIcon } from './BrandIcon'

const slideCopy = [
  {
    slug: 'asbestos-testing',
    label: 'Sampling & laboratory analysis',
    title: 'Asbestos testing & sampling',
    description: 'Find out if suspect materials contain asbestos before you renovate, demolish, or make repairs.',
    action: 'Request asbestos testing',
    quoteService: 'Asbestos Inspection',
  },
  {
    slug: 'asbestos',
    label: 'Containment & abatement',
    title: 'Asbestos removal',
    description: 'Plan the containment, removal, and disposal of asbestos materials in your home or building.',
    action: 'Request asbestos removal',
    quoteService: 'Asbestos Removal',
  },
  {
    slug: 'lead',
    label: 'Dust control & cleanup',
    title: 'Lead removal & abatement',
    description: 'Get help removing deteriorated lead paint with work-area containment and a thorough cleanup.',
    action: 'Request lead paint removal',
    quoteService: 'Lead Paint Removal',
  },
  {
    slug: 'mold',
    label: 'Cleanup & moisture control',
    title: 'Mold remediation',
    description: 'Identify the moisture source, contain the affected area, and clean up mold.',
    action: 'Request mold remediation',
    quoteService: 'Mold Remediation',
  },
  {
    slug: 'water-damage',
    label: 'Water extraction & structural drying',
    title: 'Water damage restoration',
    description: 'Remove standing water and dry affected floors, walls, and other materials after a leak or flood.',
    action: 'Get help with water damage',
    quoteService: 'Water Damage Restoration',
  },
] satisfies Array<{
  slug: string
  label: string
  title: string
  description: string
  action: string
  quoteService: typeof LEAD_SERVICES[number]
}>

const heroSlides = slideCopy.flatMap(copy => {
  const service = services.find(service => service.slug === copy.slug)
  return service ? [{ ...copy, service }] : []
})
const rotationDelay = 3000

export function HomeHero() {
  const hero = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  const slide = heroSlides[active]
  const rotationActive = playing && visible && pageVisible && !hovered

  useEffect(() => {
    const node = hero.current
    if (!node || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= 0.25), { threshold: 0.25 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const respectReducedMotion = (event: MediaQueryListEvent) => {
      if (event.matches) setPlaying(false)
    }
    const syncVisibility = () => setPageVisible(!document.hidden)

    preference.addEventListener('change', respectReducedMotion)
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      preference.removeEventListener('change', respectReducedMotion)
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [])

  useEffect(() => {
    if (!rotationActive) return
    const timer = window.setTimeout(() => setActive((active + 1) % heroSlides.length), rotationDelay)
    return () => window.clearTimeout(timer)
  }, [active, rotationActive])

  function selectSlide(next: number) {
    setPlaying(false)
    setActive((next + heroSlides.length) % heroSlides.length)
  }

  return (
    <section
      className="home-hero"
      ref={hero}
      aria-roledescription="carousel"
      aria-label="Featured services"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={event => {
        if (!(event.target as HTMLElement).closest('.hero-rotation-toggle')) setPlaying(false)
      }}
    >
      <div className="home-hero-images">
        {heroSlides.map(({ service, slug }, index) => (
          <img
            className={index === active ? 'is-current' : undefined}
            data-service={slug}
            key={slug}
            src={service.image}
            alt={service.imageAlt}
            aria-hidden={index !== active}
            {...imageAttributes(service.image)}
            fetchPriority={index === 0 ? 'high' : 'low'}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>
      <div className="shell home-hero-layout">
        <div className="home-hero-copy">
          <div className="home-hero-content" key={slide.slug} aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
            <div className="home-hero-label">
              <span className="brand-icon-badge hero-service-icon"><BrandIcon name={slide.slug} /></span>
              <span className="micro-label">{slide.label}</span>
            </div>
            <h1>{slide.title}</h1>
            <p className="hero-intro">{slide.description}</p>
            <div className="hero-actions">
              <Link to={`/get-a-quote/?service=${encodeURIComponent(slide.quoteService)}`} className="button button-primary">{slide.action} <ArrowUpRight size={20} aria-hidden="true" /></Link>
              <Link to={slide.service.path} className="button button-ghost">View service details <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
        <div className="home-hero-footer">
          <div className="hero-service-controls" role="group" aria-label="Service slides">
            <button type="button" className="hero-rotation-toggle" aria-label={playing ? 'Pause service rotation' : 'Play service rotation'} onClick={() => setPlaying(value => !value)}>
              {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
            </button>
            <div className="hero-service-dots">
              {heroSlides.map(({ service, slug }, index) => (
                <button type="button" key={slug} aria-label={`Show ${service.name}`} aria-current={index === active ? 'true' : undefined} onClick={() => selectSlide(index)}>
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="hero-service-arrows">
              <button type="button" aria-label="Previous service" onClick={() => selectSlide(active - 1)}><ArrowLeft size={18} aria-hidden="true" /></button>
              <button type="button" aria-label="Next service" onClick={() => selectSlide(active + 1)}><ArrowRight size={18} aria-hidden="true" /></button>
            </div>
          </div>
          <div className="hero-trust" aria-label="Service assurances">
            <span><Check size={17} aria-hidden="true" />IDPH-licensed services</span>
            <span><Check size={17} aria-hidden="true" />Fully insured</span>
          </div>
        </div>
      </div>
    </section>
  )
}
