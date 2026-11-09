import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import { contact, posts, processSteps, services, type Post, type Service } from '../data'
import { FormNotice, ImageComparison, Page, QuoteBand, SectionLabel, ServiceCarousel, ShareLinks } from '../components/Site'
import { useEmailDraft } from '../hooks/useEmailDraft'

export function HomePage() {
  return (
    <Page title="Asbestos Removal in Chicago | AIS Environmental Inc." description="AIS Environmental provides asbestos, lead paint and mold services for Chicago homes, businesses and industrial properties, plus professional window installation." className="home-page">
      <section className="home-hero shell-wide">
        <img className="home-hero-background" src="/images/asbestos-hero.webp" alt="Technicians in protective suits inside a contained asbestos work area" fetchPriority="high" />
        <div className="shell home-hero-copy">
          <SectionLabel light>Environmental & property services</SectionLabel>
          <h1>Asbestos removal and property services <span>in Chicago.</span></h1>
          <p className="hero-intro">Practical help for asbestos, lead paint, mold and window projects—delivered with careful work practices and clear communication.</p>
          <div className="hero-actions">
            <Link to="/get-a-quote/" className="button button-primary">Request a free estimate <ArrowUpRight size={20} /></Link>
            <a href="#services" className="button button-ghost">Explore our services <ArrowRight size={18} /></a>
          </div>
          <div className="hero-trust" aria-label="Service assurances">
            <span><Check size={17} aria-hidden="true" />IDPH-licensed services</span>
            <span><Check size={17} aria-hidden="true" />Fully insured</span>
            <span><Check size={17} aria-hidden="true" />Free project estimates</span>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Properties we serve">
        <div className="shell proof-grid">
          <div><strong>Local</strong><span>Chicago & surrounding areas</span></div>
          <div><strong>Residential</strong><span>Homes and living spaces</span></div>
          <div><strong>Commercial</strong><span>Businesses and workplaces</span></div>
          <div><strong>Multi-family</strong><span>Buildings and shared properties</span></div>
        </div>
      </section>

      <section className="section shell services-section" id="services">
        <div className="section-heading split-heading">
          <SectionLabel>Our services</SectionLabel>
          <h2>Property services, from assessment to completion.</h2>
          <p>Start with the concern you can see. We will help define the work, explain your options and plan the next step.</p>
        </div>
        <div className="service-list">
          {services.map(service => (
            <Link to={service.path} className="service-row" key={service.path}>
              <span className="service-number">{service.number}</span>
              <div className="service-row-title"><h3>{service.name}</h3><span>{service.eyebrow}</span></div>
              <p>{service.intro}</p>
              <div className="service-thumb"><img src={service.image} alt="" loading="lazy" decoding="async" /></div>
              <span className="round-arrow"><ArrowUpRight aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section about-teaser">
        <div className="shell about-teaser-grid">
          <div className="about-teaser-image"><img src="/images/mold-hero.webp" alt="AIS technician checking moisture levels on a basement wall" loading="lazy" decoding="async" /><span className="vertical-caption">ASSESS / CONTAIN / CORRECT</span></div>
          <div className="about-teaser-copy">
            <SectionLabel>Why choose AIS</SectionLabel>
            <h2>A local team that puts people first.</h2>
            <p className="large-copy">Clear answers. Careful work. Respect for your space.</p>
            <p>AIS Environmental serves commercial, residential and multi-family properties with a focus on safe work practices, straightforward communication and respect for the people using the space.</p>
            <Link to="/about/" className="button button-outline">Learn about AIS <ArrowUpRight size={18} /></Link>
          </div>
          <div className="about-orange-panel">
            <span className="micro-label">Our commitment</span>
            <strong>Safety first.<br />Service always.</strong>
            <p>Integrity in the details. Care in the work.</p>
          </div>
        </div>
      </section>

      <section className="section shell process-section">
        <div className="section-heading split-heading">
          <SectionLabel>What to expect</SectionLabel>
          <h2>A straightforward process from first call to closeout.</h2>
          <p>Every property is different. You should still know what happens next and why.</p>
        </div>
        <div className="process-grid">
          {processSteps.map(step => <div className="process-step" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}
        </div>
      </section>

      <section className="section field-section">
        <div className="shell"><ServiceCarousel /></div>
      </section>

      <section className="section shell journal-section">
        <div className="journal-heading"><div><SectionLabel>Property resources</SectionLabel><h2>Practical guidance for your property.</h2></div><Link to="/blog/" className="text-link">View all articles <ArrowUpRight size={18} /></Link></div>
        <div className="journal-grid">
          {posts.slice(0, 3).map((post, index) => <PostCard post={post} number={`0${index + 1}`} key={post.path} />)}
        </div>
      </section>
      <QuoteBand />
    </Page>
  )
}

function PostCard({ post, number }: { post: Post; number: string }) {
  return (
    <article className="post-card">
      <Link to={post.path} className="post-card-image"><img src={post.image} alt="" loading="lazy" decoding="async" /><span>{number}</span></Link>
      <div className="post-card-meta"><Link to={post.categoryPath}>{post.category}</Link><span>{post.date}</span></div>
      <h3><Link to={post.path}>{post.shortTitle}</Link></h3>
      <p>{post.excerpt}</p>
      <Link to={post.path} className="text-link">Read article <ArrowUpRight size={16} /></Link>
    </article>
  )
}

export function ServicePage({ service }: { service: Service }) {
  const related = services.filter(item => item.path !== service.path).slice(0, 3)
  return (
    <Page title={`${service.name} in Chicago | AIS Environmental Inc.`} description={service.description} className="service-page">
      <section className="service-hero shell">
        <div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13} /><Link to="/#services">Services</Link><ChevronRight size={13} /><span>{service.shortName}</span></div>
        <div className="service-hero-grid">
          <div>
            <SectionLabel>Service {service.number} / 04</SectionLabel>
            <h1>{service.headline}</h1>
          </div>
          <div className="service-hero-aside"><p>{service.intro}</p><Link to={`/get-a-quote/?service=${encodeURIComponent(service.quoteOption)}`} className="button button-primary">Request a free estimate <ArrowUpRight size={19} /></Link></div>
        </div>
      </section>
      <div className="service-hero-image shell-wide">
        <img src={service.image} alt={service.imageAlt} />
        <div className="service-image-caption shell"><span>{service.eyebrow}</span><span>AIS Environmental / {service.number}</span></div>
      </div>

      <section className="section shell service-content-grid" id="services">
        <aside className="service-toc">
          <span className="micro-label">On this page</span>
          <nav aria-label="On this page">
            {service.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><span>0{index + 1}</span>{section.title}</a>)}
          </nav>
          <div className="toc-contact"><span>Prefer to talk?</span><a href={contact.phoneHref}>{contact.phoneDisplay}<ArrowUpRight size={15} /></a></div>
        </aside>
        <div className="service-content">
          <div className="service-overview"><SectionLabel>The essentials</SectionLabel><p>{service.scope}</p></div>
          {service.sections.map((section, index) => (
            <section className="service-detail" id={section.id} key={section.id}>
              <span className="detail-number">0{index + 1}</span>
              <div><h2>{section.title}</h2><p>{section.intro}</p><ul>{section.points.map(point => <li key={point}><Check size={17} aria-hidden="true" />{point}</li>)}</ul></div>
            </section>
          ))}
          {service.slug === 'windows' && <div className="service-comparison"><SectionLabel>A visible difference</SectionLabel><h2>From tired to tailored.</h2><ImageComparison /></div>}
        </div>
      </section>

      <section className="section related-section">
        <div className="shell">
          <div className="section-heading split-heading"><SectionLabel>Related expertise</SectionLabel><h2>More ways<br />we can help.</h2></div>
          <div className="related-grid">{related.map(item => <Link to={item.path} className="related-card" key={item.path}><img src={item.image} alt="" loading="lazy" decoding="async" /><span>{item.number}</span><h3>{item.name}</h3><ArrowUpRight /></Link>)}</div>
        </div>
      </section>
      <QuoteBand title={`Planning a ${service.shortName.toLowerCase()} project?`} text="Share a few details about the property and the work you are considering. We will follow up to discuss scope and next steps." />
    </Page>
  )
}

export function AboutPage() {
  const values = [
    ['01', 'Safety', 'We prioritize safe work practices for occupants, workers and the property around them.'],
    ['02', 'Client service', 'We listen carefully, explain the scope and stay responsive from the first conversation onward.'],
    ['03', 'Integrity', 'We aim to be straightforward about what the property needs and what the work involves.'],
    ['04', 'Environmental stewardship', 'We handle affected materials with care and consider the broader environment around every project.'],
    ['05', 'Continuous learning', 'We keep developing our knowledge of methods, materials and better ways to serve clients.'],
    ['06', 'Teamwork', 'Complex property work depends on coordination—with clients, occupants and project partners.'],
  ]
  return (
    <Page title="About AIS Environmental Inc. | Chicago" description="Learn about AIS Environmental’s mission, values and property services for commercial, residential and multi-family buildings across the Chicago area." className="about-page">
      <section className="about-hero shell">
        <SectionLabel>About AIS Environmental</SectionLabel>
        <h1>The work is technical.<br /><span>The reason is human.</span></h1>
        <div className="about-hero-bottom"><p>We help people make informed decisions about the spaces where they live, work and invest.</p><span className="micro-label">Chicago, Illinois / Local service</span></div>
      </section>
      <div className="about-image shell-wide"><img src="/images/asbestos-hero.webp" alt="Environmental technicians preparing a contained work area" /><div className="about-image-word" aria-hidden="true">CARE</div></div>
      <section className="section shell about-story">
        <div><SectionLabel>Who we are</SectionLabel><h2>Local knowledge.<br />Practical solutions.</h2></div>
        <div className="about-story-copy"><p className="large-copy">AIS Environmental Inc. serves commercial, residential and multi-family properties across Chicago and surrounding areas.</p><p>Our services include asbestos testing, removal and abatement; lead-paint inspections and removal; mold inspection and remediation; and professional window installation. We are fully insured and provide IDPH-licensed services.</p><p>That range reflects a simple idea: property owners deserve a clear plan, careful work and a team that respects the building as much as the people inside it.</p></div>
      </section>
      <section className="mission-grid">
        <div className="mission-panel"><SectionLabel light>Our mission</SectionLabel><h2>Make properties safer—and the process clearer.</h2><p>We work to deliver reliable environmental and property services with careful methods, useful communication and respect for every client’s space.</p></div>
        <div className="vision-panel"><SectionLabel>Our vision</SectionLabel><h2>Be the team people trust before work begins.</h2><p>We want property owners to feel informed, supported and confident about the next step—not pressured into one.</p></div>
      </section>
      <section className="section shell values-section">
        <div className="section-heading split-heading"><SectionLabel>What we value</SectionLabel><h2>Principles that<br />show up on site.</h2><p>Not wall copy. A working standard for every conversation and every project.</p></div>
        <div className="values-grid">{values.map(([number, title, text]) => <div className="value-item" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
      </section>
      <QuoteBand title="A careful team for your next property project." />
    </Page>
  )
}

export function BlogPage() {
  const [featured, ...rest] = posts
  return (
    <Page title="Property Health & Home Improvement Blog | AIS Environmental" description="Practical articles about asbestos, lead paint, mold and window replacement from AIS Environmental Inc. in Chicago." className="blog-page">
      <section className="blog-hero shell"><SectionLabel>Field notes / AIS journal</SectionLabel><h1>Understand<br />your property.</h1><div className="blog-hero-bottom"><p>Useful context for healthier buildings, better renovation decisions and more comfortable rooms.</p><div className="blog-filters"><Link to="/category/health/">Health</Link><Link to="/category/home-improvement/">Home improvement</Link></div></div></section>
      <section className="shell featured-post">
        <Link to={featured.path} className="featured-post-image"><img src={featured.image} alt="Technicians inside a contained asbestos work area" loading="lazy" decoding="async" /><span>Featured / 01</span></Link>
        <div className="featured-post-copy"><div className="post-card-meta"><Link to={featured.categoryPath}>{featured.category}</Link><span>{featured.date}</span></div><h2><Link to={featured.path}>{featured.title}</Link></h2><p>{featured.excerpt}</p><Link to={featured.path} className="button button-outline">Read the article <ArrowUpRight size={18} /></Link></div>
      </section>
      <section className="section shell all-posts"><div className="all-posts-heading"><SectionLabel>All articles</SectionLabel><span>03 more notes</span></div><div className="post-list">{rest.map((post, index) => <PostListItem post={post} number={`0${index + 2}`} key={post.path} />)}</div></section>
      <QuoteBand title="Have a property question of your own?" text="Every building is different. Tell us what you are seeing and we can help you identify a practical next step." />
    </Page>
  )
}

function PostListItem({ post, number }: { post: Post; number: string }) {
  return <article className="post-list-item"><span className="post-list-number">{number}</span><Link to={post.path} className="post-list-image"><img src={post.image} alt="" loading="lazy" decoding="async" /></Link><div className="post-list-copy"><div className="post-card-meta"><Link to={post.categoryPath}>{post.category}</Link><span>{post.date}</span></div><h2><Link to={post.path}>{post.shortTitle}</Link></h2><p>{post.excerpt}</p></div><Link to={post.path} className="round-arrow" aria-label={`Read ${post.shortTitle}`}><ArrowUpRight /></Link></article>
}

export function ArchivePage({ type, value }: { type: 'category' | 'author'; value: string }) {
  const filtered = useMemo(() => type === 'author' ? posts : posts.filter(post => post.category.toLowerCase().replace(' ', '-') === value), [type, value])
  const title = type === 'author' ? 'Notes from the AIS team.' : value === 'health' ? 'Health, made clearer.' : 'Better home decisions.'
  const categoryName = value === 'health' ? 'Health' : 'Home Improvement'
  return (
    <Page title={`${type === 'author' ? 'Author: mtzprints' : categoryName} | AIS Environmental Blog`} description={`Browse AIS Environmental ${type === 'author' ? 'articles by mtzprints' : categoryName.toLowerCase() + ' articles'}.`} className="archive-page">
      <section className="archive-hero shell"><div className="breadcrumbs"><Link to="/blog/">Field notes</Link><ChevronRight size={13} /><span>{type === 'author' ? 'mtzprints' : categoryName}</span></div><SectionLabel>{type === 'author' ? 'Author archive / mtzprints' : `Category / ${categoryName}`}</SectionLabel><h1>{title}</h1><p>{filtered.length} practical {filtered.length === 1 ? 'article' : 'articles'} from the AIS Environmental team.</p></section>
      <section className="section shell"><div className="post-list">{filtered.map((post, index) => <PostListItem post={post} number={`0${index + 1}`} key={post.path} />)}</div></section>
      <QuoteBand />
    </Page>
  )
}

export function ArticlePage({ post }: { post: Post }) {
  const commentForm = useEmailDraft(`Article comment: ${post.shortTitle}`)
  const related = posts.filter(item => item.path !== post.path).slice(0, 2)
  return (
    <Page title={`${post.title} | AIS Environmental`} description={post.excerpt} className="article-page">
      <article>
        <header className="article-header shell"><div className="breadcrumbs"><Link to="/blog/">Field notes</Link><ChevronRight size={13} /><Link to={post.categoryPath}>{post.category}</Link></div><SectionLabel>{post.category} / Property knowledge</SectionLabel><h1>{post.title}</h1><div className="article-byline"><span>By <Link to="/author/mtzprints/">mtzprints</Link></span><span>{post.date}</span><span>6 min read</span></div></header>
        <div className="article-hero-image shell-wide"><img src={post.image} alt="" loading="lazy" decoding="async" /></div>
        <div className="shell article-layout">
          <aside className="article-aside"><ShareLinks title={post.title} /><Link to={post.servicePath} className="article-service-link"><span className="micro-label">Related service</span><strong>{post.serviceName}</strong><ArrowUpRight /></Link></aside>
          <div className="article-body"><p className="article-lede">{post.excerpt}</p>{post.sections.map((section, index) => <section key={section.heading}><span className="article-section-number">0{index + 1}</span><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.points && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}</section>)}<div className="article-callout"><span className="micro-label">Need property-specific guidance?</span><h2>Let’s look at your space.</h2><p>An article can explain the basics. An inspection or project conversation can clarify what applies to your property.</p><Link to={post.servicePath} className="button button-primary">Explore {post.serviceName.toLowerCase()} <ArrowUpRight size={18} /></Link></div></div>
        </div>
      </article>
      <section className="article-comment-section"><div className="shell article-comment-grid"><div><SectionLabel>Join the conversation</SectionLabel><h2>Leave a comment.</h2><p>Questions and property context are welcome. Submitting opens a draft in your email app.</p></div><form action={`mailto:${contact.email}`} method="get" onSubmit={commentForm.submit} className="comment-form"><div className="form-row"><label>Name<input name="name" required data-email-label="Name" autoComplete="name" /></label><label>Email<input name="email" type="email" required data-email-label="Email" autoComplete="email" /></label></div><label>Comment<textarea name="comment" required data-email-label="Comment" rows={5} /></label><button className="button button-primary" type="submit">Prepare comment <ArrowUpRight size={18} /></button><FormNotice>{commentForm.notice}</FormNotice></form></div></section>
      <section className="section shell"><div className="journal-heading"><div><SectionLabel>Keep reading</SectionLabel><h2>More field notes.</h2></div><Link to="/blog/" className="text-link">All articles <ArrowUpRight size={17} /></Link></div><div className="journal-grid two-cards">{related.map((item, index) => <PostCard post={item} number={`0${index + 1}`} key={item.path} />)}</div></section>
    </Page>
  )
}

export function ContactPage() {
  const form = useEmailDraft('Website contact')
  return (
    <Page title="Contact AIS Environmental Inc. | Chicago" description="Contact AIS Environmental for asbestos, lead paint, mold and window services in Chicago and surrounding areas. Call (708) 240-9468." className="contact-page">
      <section className="contact-hero shell"><SectionLabel>Contact / Start a conversation</SectionLabel><h1>Tell us what’s<br />going on.</h1><p>A few details about the property and your concern are enough to start.</p></section>
      <section className="shell contact-grid">
        <div className="contact-details">
          <div className="contact-detail"><Phone aria-hidden="true" /><span className="micro-label">Call</span><a href={contact.phoneHref}>{contact.phoneDisplay}</a><p>For project questions and scheduling.</p></div>
          <div className="contact-detail"><Mail aria-hidden="true" /><span className="micro-label">Email</span><a href={`mailto:${contact.publicEmail}`}>{contact.publicEmail}</a><p>Send photos, documents or property context.</p></div>
          <div className="contact-detail"><MapPin aria-hidden="true" /><span className="micro-label">Visit</span><a href={contact.mapsUrl} target="_blank" rel="noreferrer">2524 Scott St.<br />Franklin Park, IL 60131</a><p>Serving Chicago and surrounding areas.</p></div>
        </div>
        <form className="contact-form" action={`mailto:${contact.email}`} method="get" onSubmit={form.submit}>
          <div className="form-heading"><span className="micro-label">Project inquiry</span><h2>How can we help?</h2></div>
          <div className="form-row"><label>First name<input name="firstName" required data-email-label="First name" autoComplete="given-name" /></label><label>Last name<input name="lastName" required data-email-label="Last name" autoComplete="family-name" /></label></div>
          <label>Email address<input name="email" type="email" required data-email-label="Email" autoComplete="email" /></label>
          <label>Subject<input name="subject" required data-email-label="Subject" /></label>
          <label>Message<textarea name="message" required data-email-label="Message" rows={6} placeholder="Property type, location, and what you are seeing…" /></label>
          <button className="button button-primary" type="submit">Prepare email <ArrowUpRight size={19} /></button><p className="form-footnote">This form opens a draft in your email application. No form data is stored on this website.</p><FormNotice>{form.notice}</FormNotice>
        </form>
      </section>
      <section className="contact-map" aria-label="AIS Environmental service area">
        <div className="service-area-visual" aria-hidden="true">
          <svg viewBox="0 0 1440 440" preserveAspectRatio="xMidYMid slice">
            <g className="area-roads area-roads-minor">
              <path d="M-80 82 460 260 1510 56" /><path d="M-40 370 510 182 1490 326" />
              <path d="M174-40 332 480" /><path d="M568-30 706 470" /><path d="M1110-30 1000 470" /><path d="M1320-40 1210 480" />
              <path d="M-40 212 1480 212" /><path d="M60-20 1410 410" />
            </g>
            <g className="area-roads area-roads-major">
              <path d="M-80 398 420 88 1510 158" /><path d="M850-50 922 490" />
            </g>
            <circle className="area-ring" cx="970" cy="202" r="74" />
            <circle className="area-ring area-ring-outer" cx="970" cy="202" r="142" />
            <circle className="area-center" cx="970" cy="202" r="7" />
          </svg>
          <div className="area-pin"><MapPin size={24} /><span><strong>AIS Environmental</strong><small>Franklin Park</small></span></div>
          <span className="area-caption">Local service across Chicago & surrounding areas</span>
        </div>
        <div className="map-label"><span className="micro-label">Home base</span><strong>Franklin Park, Illinois</strong><a href={contact.mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={16} /></a></div>
      </section>
    </Page>
  )
}

export function QuotePage() {
  const location = useLocation()
  const requested = new URLSearchParams(location.search).get('service')
  const initial = services.find(service => service.quoteOption.toLowerCase() === requested?.toLowerCase())?.quoteOption || ''
  const [selected, setSelected] = useState(initial)
  const form = useEmailDraft(`Free estimate${selected ? `: ${selected}` : ''}`)
  function submit(event: FormEvent<HTMLFormElement>) { form.submit(event) }
  return (
    <Page title="Get a Free Project Quote | AIS Environmental Inc." description="Request a free estimate for asbestos removal, lead paint removal, mold remediation or window installation in the Chicago area." className="quote-page">
      <section className="quote-hero shell"><SectionLabel>Free estimate / No obligation</SectionLabel><h1>Let’s scope<br />your project.</h1><p>Share the basics below. Your email app will open a prepared draft for you to review and send.</p></section>
      <section className="shell quote-form-layout">
        <form className="quote-form" action={`mailto:${contact.email}`} method="get" onSubmit={submit}>
          <fieldset className="service-choice"><legend>01 / What do you need help with?</legend><div className="service-choice-grid">{services.map(service => <label className={selected === service.quoteOption ? 'selected' : ''} key={service.slug}><input type="radio" name="serviceChoice" value={service.quoteOption} checked={selected === service.quoteOption} onChange={() => setSelected(service.quoteOption)} /><span>{service.number}</span><strong>{service.name}</strong><Check size={18} /></label>)}</div></fieldset>
          <div className="quote-details"><span className="micro-label">02 / Your details</span><div className="form-row"><label>First name<input name="firstName" required data-email-label="First name" autoComplete="given-name" /></label><label>Last name<input name="lastName" required data-email-label="Last name" autoComplete="family-name" /></label></div><div className="form-row"><label>Phone<input name="phone" type="tel" required data-email-label="Phone" autoComplete="tel" /></label><label>Email<input name="email" type="email" required data-email-label="Email" autoComplete="email" /></label></div><label>Property address<input name="address" required data-email-label="Property address" autoComplete="street-address" /></label><input type="hidden" name="service" value={selected} data-email-label="Service type" /><label>Project details<textarea name="details" required data-email-label="Project details" rows={6} placeholder="Tell us about the property, the affected area, and any work you are planning…" /></label><button type="submit" className="button button-primary">Prepare quote request <ArrowUpRight size={19} /></button><p className="form-footnote">Review the draft in your email app and press Send there. No form data is stored on this website.</p><FormNotice>{form.notice}</FormNotice></div>
        </form>
        <aside className="quote-aside"><span className="micro-label">What happens next</span>{processSteps.slice(0, 3).map(step => <div key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}<div className="quote-aside-contact"><p>Prefer to describe it by phone?</p><a href={contact.phoneHref}>{contact.phoneDisplay}<ArrowUpRight size={18} /></a></div></aside>
      </section>
    </Page>
  )
}

export function NotFoundPage() {
  return <Page title="Page not found | AIS Environmental" description="The requested page could not be found."><section className="not-found shell"><span className="micro-label">Error / 404</span><h1>Wrong turn.<br />Right team.</h1><p>The page you requested does not exist. Head home or explore our services.</p><div className="hero-actions"><Link to="/" className="button button-primary">Back home <ArrowUpRight size={18} /></Link><Link to="/contact/" className="text-link">Contact AIS <ArrowRight size={18} /></Link></div></section></Page>
}
