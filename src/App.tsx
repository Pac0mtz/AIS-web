import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { SiteFooter, SiteHeader } from './components/Site'
import { posts, services } from './data'
import { AboutPage, ArchivePage, ArticlePage, BlogPage, ContactPage, HomePage, NotFoundPage, QuotePage, ServicePage } from './pages/Pages'
import './App.css'

function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1))
        target?.scrollIntoView({ block: 'start' })
      })
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/2023/12/27/" element={<HomePage />} />
        <Route path="/about/" element={<AboutPage />} />
        {services.map(service => <Route key={service.path} path={service.path} element={<ServicePage service={service} />} />)}
        <Route path="/contact/" element={<ContactPage />} />
        <Route path="/get-a-quote/" element={<QuotePage />} />
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
