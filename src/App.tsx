import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { SiteFooter, SiteHeader } from './components/Site'
import { posts, services } from './data'
import { serviceAreas } from './siteContent'
import { AboutPage, ArchivePage, ArticlePage, BlogPage, ContactPage, HomePage, NotFoundPage, QuotePage, ServicePage } from './pages/Pages'
import { ThankYouPage } from './pages/ThankYouPage'
import { EnvironmentalTestingPage } from './pages/EnvironmentalTestingPage'
import { trackSpaPageView } from './lib/analytics'
import { AreaPage, FaqPage, IndustriesPage, ProjectsPage, ReviewsPage, ServiceAreasPage, ServicesPage } from './pages/ExpandedPages'
import './App.css'

function AnalyticsRouteListener() {
  const { pathname } = useLocation()
  const seen = useRef<string | null>(null)
  useEffect(() => {
    if (seen.current === null || seen.current === pathname) {
      seen.current = pathname
      return
    }
    seen.current = pathname
    trackSpaPageView(pathname)
  }, [pathname])
  return null
}

function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1))
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target?.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' })
      })
    }
  }, [pathname, hash])
  return null
}

function MotionEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      frame = 0
      const available = document.documentElement.scrollHeight - window.innerHeight
      const progress = available > 0 ? Math.min(window.scrollY / available, 1) : 0
      document.documentElement.style.setProperty('--scroll-progress', String(progress))
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    let observer: IntersectionObserver | undefined
    let animatedElements: HTMLElement[] = []
    const frame = window.requestAnimationFrame(() => {
      const main = document.getElementById('main-content')
      if (!main) return
      const selector = [
        '.section-heading', '.service-row', '.about-teaser-grid', '.process-step',
        '.service-carousel', '.post-card', '.quote-band-grid', '.service-detail',
        '.related-card', '.industry-teaser-grid > a', '.industry-overview > a',
        '.industry-detail', '.project-type', '.state-card', '.city-link-grid > a',
        '.area-service-link-grid > a', '.contact-detail', '.value-item',
      ].join(',')
      animatedElements = Array.from(main.querySelectorAll<HTMLElement>(selector)).filter(element => {
        const rect = element.getBoundingClientRect()
        return rect.top > window.innerHeight * 0.9 && !element.closest('.reveal-item')
      })
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
      animatedElements.forEach((element, index) => {
        element.classList.add('reveal-item')
        element.style.setProperty('--reveal-order', String(index % 4))
        observer?.observe(element)
      })
    })
    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      animatedElements.forEach(element => {
        element.classList.remove('reveal-item', 'is-visible')
        element.style.removeProperty('--reveal-order')
      })
    }
  }, [pathname])

  return <div className="scroll-progress" aria-hidden="true" />
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <RouteEffects />
      <AnalyticsRouteListener />
      <MotionEffects />
      <SiteHeader />
      <Routes key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about/" element={<AboutPage />} />
        <Route path="/services/" element={<ServicesPage />} />
        <Route path="/industries/" element={<IndustriesPage />} />
        <Route path="/faq/" element={<FaqPage />} />
        <Route path="/reviews/" element={<ReviewsPage />} />
        <Route path="/projects/" element={<ProjectsPage />} />
        <Route path="/service-areas/" element={<ServiceAreasPage />} />
        {serviceAreas.map(area => <Route key={area.path} path={area.path} element={<AreaPage area={area} />} />)}
        {services.map(service => <Route key={service.path} path={service.path} element={<ServicePage service={service} />} />)}
        <Route path="/environmental-testing/" element={<EnvironmentalTestingPage />} />
        <Route path="/contact/" element={<ContactPage />} />
        <Route path="/get-a-quote/" element={<QuotePage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/blog/" element={<BlogPage />} />
        <Route path="/author/mtzprints/" element={<ArchivePage type="author" value="mtzprints" />} />
        <Route path="/category/health/" element={<ArchivePage type="category" value="health" />} />
        <Route path="/category/home-improvement/" element={<ArchivePage type="category" value="home-improvement" />} />
        {posts.map(post => <Route key={post.path} path={post.path} element={<ArticlePage post={post} />} />)}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </>
  )
}
