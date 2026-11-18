import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Pause, Play } from 'lucide-react'
import { Link } from 'react-router'
import { services, type Service } from '../data'
import { BrandIcon } from './BrandIcon'
import { SectionLabel } from './Site'

const heroSlugs = ['asbestos-testing', 'asbestos', 'lead', 'mold', 'water-damage']
const heroServices = heroSlugs.flatMap(slug => services.filter(service => service.slug === slug))
const rotationDelay = 7000

function HeroServiceSlider({ slides }: { slides: Service[] }) {
  const slider = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  const service = slides[active]
  const rotationActive = playing && visible && pageVisible && !hovered

  useEffect(() => {
    const node = slider.current
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
    const timer = window.setTimeout(() => setActive((active + 1) % slides.length), rotationDelay)
    return () => window.clearTimeout(timer)
  }, [active, rotationActive, slides.length])

  function selectSlide(next: number) {
    setPlaying(false)
    setActive((next + slides.length) % slides.length)
  }

  return (
    <div
      className="hero-service-slider"
      ref={slider}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured services"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={event => {
        if (!(event.target as HTMLElement).closest('.hero-rotation-toggle')) setPlaying(false)
      }}
    >
      <div className="hero-service-stage">
        {slides.map((slide, index) => (
          <img
            className={index === active ? 'is-current' : undefined}
            key={slide.slug}
            src={slide.image}
            alt={slide.imageAlt}
            aria-hidden={index !== active}
            fetchPriority={index === 0 ? 'high' : 'low'}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
        <div className="hero-service-caption" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
          <Link className="hero-service-link" to={service.path}>
            <span className="hero-service-title" key={service.slug}>
              <span className="brand-icon-badge hero-service-icon"><BrandIcon name={service.slug} /></span>
              <span>{service.name}</span>
            </span>
            <ArrowUpRight size={21} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="hero-service-controls" role="group" aria-label="Service slides">
        <button type="button" className="hero-rotation-toggle" aria-label={playing ? 'Pause service rotation' : 'Play service rotation'} onClick={() => setPlaying(value => !value)}>
          {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
        </button>
        <div className="hero-service-dots">
          {slides.map((slide, index) => (
            <button type="button" key={slide.slug} aria-label={`Show ${slide.name}`} aria-current={index === active ? 'true' : undefined} onClick={() => selectSlide(index)}>
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="hero-service-arrows">
          <button type="button" aria-label="Previous service" onClick={() => selectSlide(active - 1)}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" aria-label="Next service" onClick={() => selectSlide(active + 1)}><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  )
}

export function HomeHero() {
  const testing = heroServices[0]

  return (
    <section className="home-hero" aria-labelledby="homepage-heading">
      <div className="shell home-hero-layout">
        <div className="home-hero-copy">
          <SectionLabel light>Environmental & property services</SectionLabel>
          <h1 id="homepage-heading">Asbestos testing and environmental services.</h1>
          <p className="hero-intro">Find out what’s in your building before work begins. We also handle abatement, mold remediation, and water damage restoration.</p>
          <div className="hero-actions">
            <Link to={`/get-a-quote/?service=${encodeURIComponent(testing.quoteOption)}`} className="button button-primary">Request asbestos testing <ArrowUpRight size={20} aria-hidden="true" /></Link>
            <a href="#services" className="button button-ghost">Explore all services <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="hero-trust" aria-label="Service assurances">
            <span><Check size={17} aria-hidden="true" />IDPH-licensed services</span>
            <span><Check size={17} aria-hidden="true" />Fully insured</span>
          </div>
        </div>
        <HeroServiceSlider slides={heroServices} />
      </div>
    </section>
  )
}
