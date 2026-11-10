import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Mail, Menu, Phone, X } from 'lucide-react'
import { contact, services } from '../data'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="AIS Environmental home">
      <span className="logo-ais">AIS<span className="logo-dot" aria-hidden="true" /></span>
      <span className="logo-words"><strong>Environmental</strong><span>Inc.</span></span>
    </Link>
  )
}

export function SiteHeader() {
  const [mobileState, setMobileState] = useState({ open: false, route: '' })
  const [servicesState, setServicesState] = useState({ open: false, route: '' })
  const location = useLocation()
  const routeKey = location.pathname + location.search
  const mobileOpen = mobileState.open && mobileState.route === routeKey
  const servicesOpen = servicesState.open && servicesState.route === routeKey
  const setMobileOpen = useCallback((open: boolean) => setMobileState({ open, route: routeKey }), [routeKey])
  const setServicesOpen = useCallback((open: boolean) => setServicesState({ open, route: routeKey }), [routeKey])
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', mobileOpen)
    return () => document.body.classList.remove('menu-is-open')
  }, [mobileOpen])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (servicesOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) setServicesOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setServicesOpen(false)
        if (mobileOpen) {
          setMobileOpen(false)
          menuButtonRef.current?.focus()
        }
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [servicesOpen, mobileOpen, setMobileOpen, setServicesOpen])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>Illinois · Indiana · Wisconsin</span>
          <span className="utility-center">Residential · Commercial · Industrial</span>
          <a href={contact.phoneHref}><Phone size={12} aria-hidden="true" /> {contact.phoneDisplay}</a>
        </div>
      </div>
      <header className="site-header" ref={headerRef}>
        <div className="shell header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink to="/" end>Home</NavLink>
            <div className="services-nav">
              <button type="button" aria-expanded={servicesOpen} aria-controls="services-menu" onClick={() => setServicesOpen(!servicesOpen)}>
                Services <ChevronDown size={15} strokeWidth={1.8} className={servicesOpen ? 'rotate' : ''} aria-hidden="true" />
              </button>
              <div id="services-menu" className={`services-menu ${servicesOpen ? 'is-open' : ''}`}>
                <div className="services-menu-intro">
                  <span className="micro-label">Our services</span>
                  <p>Start with the right service for your property.</p>
                  <Link to="/services/" className="text-link">View all 17 services <ArrowUpRight size={16} /></Link>
                </div>
                <div className="services-menu-links">
                  {services.map(service => (
                    <NavLink to={service.path} key={service.path}>
                      <span>{service.number}</span>{service.name}<ArrowUpRight size={19} aria-hidden="true" />
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <NavLink to="/industries/">Industries</NavLink>
            <NavLink to="/service-areas/">Service Areas</NavLink>
            <NavLink to="/blog/">Blog</NavLink>
            <NavLink to="/about/">About</NavLink>
            <NavLink to="/contact/">Contact</NavLink>
          </nav>
          <Link className="header-quote" to="/get-a-quote/">Get a quote <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <button ref={menuButtonRef} className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
          <nav className="shell mobile-nav" aria-label="Mobile navigation">
            <NavLink to="/" end tabIndex={mobileOpen ? 0 : -1}><span>01</span>Home</NavLink>
            <div className="mobile-nav-group"><span>02</span><strong>Services</strong></div>
            <div className="mobile-service-links">
              <NavLink to="/services/" tabIndex={mobileOpen ? 0 : -1}><strong>All 17 services</strong><ArrowUpRight size={18} /></NavLink>
              {services.map(service => <NavLink key={service.path} to={service.path} tabIndex={mobileOpen ? 0 : -1}>{service.name}<ArrowUpRight size={18} /></NavLink>)}
            </div>
            <NavLink to="/industries/" tabIndex={mobileOpen ? 0 : -1}><span>03</span>Industries</NavLink>
            <NavLink to="/service-areas/" tabIndex={mobileOpen ? 0 : -1}><span>04</span>Service Areas</NavLink>
            <NavLink to="/projects/" tabIndex={mobileOpen ? 0 : -1}><span>05</span>Projects</NavLink>
            <NavLink to="/faq/" tabIndex={mobileOpen ? 0 : -1}><span>06</span>FAQ</NavLink>
            <NavLink to="/reviews/" tabIndex={mobileOpen ? 0 : -1}><span>07</span>Reviews</NavLink>
            <NavLink to="/blog/" tabIndex={mobileOpen ? 0 : -1}><span>08</span>Blog</NavLink>
            <NavLink to="/about/" tabIndex={mobileOpen ? 0 : -1}><span>09</span>About</NavLink>
            <NavLink to="/contact/" tabIndex={mobileOpen ? 0 : -1}><span>10</span>Contact</NavLink>
            <Link className="button button-primary mobile-quote" to="/get-a-quote/" tabIndex={mobileOpen ? 0 : -1}>Request a free estimate <ArrowUpRight size={18} /></Link>
          </nav>
        </div>
      </header>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div className="footer-brand">
          <Logo light />
          <p>Environmental and property services for homes, businesses and industrial properties across Illinois, Indiana and Wisconsin.</p>
        </div>
        <div className="footer-column">
          <span className="micro-label">Services</span>
          {services.slice(0, 6).map(service => <Link key={service.path} to={service.path}>{service.name}</Link>)}
          <Link to="/services/"><strong>All 17 services</strong></Link>
        </div>
        <div className="footer-column">
          <span className="micro-label">Company</span>
          <Link to="/industries/">Industries we serve</Link>
          <Link to="/service-areas/">Service areas</Link>
          <Link to="/projects/">Projects</Link>
          <Link to="/reviews/">Customer feedback</Link>
          <Link to="/faq/">FAQ</Link>
          <Link to="/about/">About AIS</Link>
          <Link to="/blog/">Property resources</Link>
          <Link to="/contact/">Contact</Link>
          <Link to="/get-a-quote/">Get a quote</Link>
        </div>
        <div className="footer-column footer-contact">
          <span className="micro-label">Start here</span>
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          <a href={`mailto:${contact.publicEmail}`}>{contact.publicEmail}</a>
          <a href={contact.mapsUrl} target="_blank" rel="noreferrer">{contact.address}</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} AIS Environmental Inc.</span>
        <span>Safety first. Service always.</span>
        <a href="#main-content">Back to top <ArrowUpRight size={14} /></a>
      </div>
    </footer>
  )
}

export function Page({ title, description, children, className = '' }: { title: string; description: string; children: ReactNode; className?: string }) {
  const location = useLocation()
  useEffect(() => {
    document.title = title
    const setMeta = (selector: string, attr: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) {
        element = document.createElement('meta')
        document.head.appendChild(element)
      }
      element.setAttribute(attr, value)
    }
    const desc = document.head.querySelector<HTMLMetaElement>('meta[name="description"]') || document.createElement('meta')
    desc.setAttribute('name', 'description')
    desc.setAttribute('content', description)
    if (!desc.parentNode) document.head.appendChild(desc)
    setMeta('meta[property="og:title"]', 'property', 'og:title')
    const ogTitle = document.head.querySelector('meta[property="og:title"]')
    ogTitle?.setAttribute('content', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description')
    document.head.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    setMeta('meta[property="og:type"]', 'property', 'og:type')
    document.head.querySelector('meta[property="og:type"]')?.setAttribute('content', location.pathname.includes('/2023/12/27/') && location.pathname !== '/2023/12/27/' ? 'article' : 'website')
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `https://aisenvironmentalinc.com${location.pathname}`
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [title, description, location.pathname])
  return <main id="main-content" className={className}>{children}</main>
}

export function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`section-label ${light ? 'is-light' : ''}`}><span className="label-mark" aria-hidden="true" />{children}</div>
}

export function QuoteBand({ title = 'Need help with a property concern?', text = 'Tell us what you are dealing with. We will help you understand the next step and provide a free project estimate.' }: { title?: string; text?: string }) {
  return (
    <section className="quote-band">
      <div className="shell quote-band-grid">
        <SectionLabel light>Free project estimate</SectionLabel>
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="quote-band-actions">
          <Link to="/get-a-quote/" className="button button-light">Get a quote <ArrowUpRight size={20} /></Link>
          <a href={contact.phoneHref} className="text-link light-link">Or call {contact.phoneDisplay}</a>
        </div>
      </div>
    </section>
  )
}

export function FormNotice({ children }: { children: ReactNode }) {
  if (!children) return null
  return <p className="form-notice" role="status"><Check size={18} aria-hidden="true" />{children}</p>
}

export function ImageComparison() {
  const [position, setPosition] = useState(50)
  return (
    <div className="comparison-wrap">
      <div className="comparison" style={{ '--comparison-position': `${position}%` } as CSSProperties}>
        <img src="/images/windows-hero.webp" alt="New dark-framed window being installed in a brick residence" />
        <div className="comparison-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} aria-hidden="true">
          <img src="/images/windows-hero.webp" alt="" />
        </div>
        <span className="comparison-label comparison-label-before">Existing</span>
        <span className="comparison-label comparison-label-after">Renewed</span>
        <div className="comparison-line" style={{ left: `${position}%` }} aria-hidden="true"><span><ArrowLeft size={15} /><ArrowRight size={15} /></span></div>
        <input aria-label="Compare existing and renewed window finish" type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} />
      </div>
      <p className="image-caption">Illustrative finish comparison · Drag or use arrow keys to explore</p>
    </div>
  )
}

export function ServiceCarousel() {
  const [active, setActive] = useState(0)
  const carouselServices = services.filter(service => service.featured)
  const service = carouselServices[active]
  const go = (direction: number) => setActive((active + direction + carouselServices.length) % carouselServices.length)
  return (
    <div className="service-carousel">
      <div className="carousel-image-wrap">
        <img key={service.image} src={service.image} alt={service.imageAlt} className="carousel-image" loading="lazy" decoding="async" />
        <span className="carousel-index">{service.number} / {String(carouselServices.length).padStart(2, '0')}</span>
      </div>
      <div className="carousel-info">
        <SectionLabel>In the field</SectionLabel>
        <h3>{service.name}</h3>
        <p>{service.intro}</p>
        <Link to={service.path} className="text-link">Explore this service <ArrowUpRight size={17} /></Link>
        <div className="carousel-controls">
          <button type="button" onClick={() => go(-1)} aria-label="Previous service"><ArrowLeft /></button>
          <div className="carousel-progress" aria-hidden="true">{carouselServices.map((item, index) => <span key={item.slug} className={index === active ? 'active' : ''} />)}</div>
          <button type="button" onClick={() => go(1)} aria-label="Next service"><ArrowRight /></button>
        </div>
      </div>
    </div>
  )
}

export function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://aisenvironmentalinc.com${useLocation().pathname}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.prompt('Copy this link', url)
    }
  }
  return (
    <div className="share-links" aria-label="Share this article">
      <span className="micro-label">Share</span>
      <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} aria-label="Share by email"><Mail size={18} />Email</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">Facebook<ArrowUpRight size={15} /></a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight size={15} /></a>
      <button type="button" onClick={copy}><Copy size={16} />{copied ? 'Copied' : 'Copy link'}</button>
    </div>
  )
}
