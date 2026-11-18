import catalog from './seo-catalog.json' with { type: 'json' }

export const ORIGIN = 'https://aisenvironmentalinc.com'
const BUSINESS_ID = `${ORIGIN}/#business`

const BUSINESS = {
  '@type': 'HomeAndConstructionBusiness',
  '@id': BUSINESS_ID,
  name: 'AIS Environmental Inc.',
  url: `${ORIGIN}/`,
  telephone: '+1-708-240-9468',
  image: `${ORIGIN}/ais-logo.webp`,
  logo: `${ORIGIN}/ais-logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2524 Scott St.',
    addressLocality: 'Franklin Park',
    addressRegion: 'IL',
    postalCode: '60131',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.9244896,
    longitude: -87.874849,
  },
  areaServed: [
    { '@type': 'State', name: 'Illinois' },
    { '@type': 'State', name: 'Indiana' },
    { '@type': 'State', name: 'Wisconsin' },
  ],
}

const services = new Map(catalog.services.map(service => [service.path, service]))
const posts = new Map(catalog.posts.map(post => [post.path, post]))
const areas = new Map(catalog.areas.map(area => [area.path, area]))

const STATIC = {
  '/': {
    title: 'Asbestos and Mold Testing in Chicago | AIS Environmental',
    description: 'Asbestos testing, mold testing and environmental testing in Chicago, plus lead paint, water damage and exterior services across Illinois, Indiana and Wisconsin.',
    h1: 'Asbestos and Mold Testing in Chicago',
    slogan: 'Environmental and property services across Illinois, Indiana and Wisconsin.',
    image: '/images/asbestos-sampling-team.webp',
    kind: 'home',
  },
  '/about/': {
    title: 'About AIS Environmental Inc. in Franklin Park',
    description: 'AIS Environmental Inc. in Franklin Park provides asbestos, lead paint, mold and property services for commercial, residential and multi-family buildings.',
    h1: 'About AIS Environmental in Franklin Park',
    slogan: 'The work is technical. The reason is human.',
    kind: 'page',
  },
  '/services/': {
    title: 'Asbestos, Mold and Property Services | AIS Environmental',
    description: 'Asbestos testing, mold testing, lead paint, water damage, roofing, siding, gutter, window and door services across Illinois, Indiana and Wisconsin.',
    h1: 'Asbestos, Mold and Property Services',
    slogan: 'From first question to finished work.',
    kind: 'page',
  },
  '/environmental-testing/': {
    title: 'Environmental Testing in Chicago | AIS Environmental',
    description: 'Environmental testing in Chicago for asbestos, mold and lead paint. AIS samples materials, inspects moisture and explains the next step before removal or repairs.',
    h1: 'Environmental Testing in Chicago',
    slogan: 'Know what is in the building before the work starts.',
    image: '/images/asbestos-testing.webp',
    kind: 'service',
    serviceType: 'Environmental testing',
  },
  '/industries/': {
    title: 'Industries Served by AIS Environmental',
    description: 'Environmental and property services for residential, multi-family, commercial, industrial, education, healthcare, municipal and construction clients.',
    h1: 'Industries Served by AIS Environmental',
    slogan: 'Property expertise shaped around your building.',
    kind: 'page',
  },
  '/faq/': {
    title: 'Asbestos, Mold and Lead Paint FAQ | AIS Environmental',
    description: 'Answers about asbestos testing, lead paint, mold, water damage, exterior services, estimates and AIS service areas.',
    h1: 'Asbestos, Mold and Lead Paint FAQ',
    slogan: 'Useful answers before work begins.',
    kind: 'page',
  },
  '/reviews/': {
    title: 'Customer Feedback for AIS Environmental',
    description: 'Share your experience with AIS Environmental and learn about the service standards for property projects.',
    h1: 'Customer Feedback for AIS Environmental',
    slogan: 'Your experience helps us improve.',
    kind: 'page',
  },
  '/projects/': {
    title: 'Asbestos, Mold and Property Projects | AIS Environmental',
    description: 'Asbestos, lead paint, mold, water damage and exterior property project types supported by AIS Environmental.',
    h1: 'Asbestos, Mold and Property Projects',
    slogan: 'Property work organized around the real scope.',
    kind: 'page',
  },
  '/service-areas/': {
    title: 'Service Areas in Illinois, Indiana and Wisconsin | AIS',
    description: 'AIS Environmental serves cities across Illinois, Indiana and Wisconsin, including Chicago, Aurora, Gary, Milwaukee and surrounding communities.',
    h1: 'Service Areas in Illinois, Indiana and Wisconsin',
    slogan: 'Environmental and property services across the Midwest.',
    kind: 'page',
  },
  '/contact/': {
    title: 'Contact AIS Environmental in Franklin Park',
    description: 'Contact AIS Environmental in Franklin Park for asbestos, mold, lead paint and property services. Call (708) 240-9468.',
    h1: 'Contact AIS Environmental in Franklin Park',
    slogan: "Tell us what's going on.",
    kind: 'page',
  },
  '/get-a-quote/': {
    title: 'Request a Free Project Quote | AIS Environmental',
    description: 'Request a free estimate for asbestos testing, mold testing, lead paint, water damage or exterior property services.',
    h1: 'Request a Free Project Quote',
    slogan: "Let's scope your project.",
    kind: 'page',
  },
  '/blog/': {
    title: 'Asbestos, Mold and Property Guides | AIS Environmental',
    description: 'Practical articles about asbestos, lead paint, mold and window replacement from AIS Environmental Inc.',
    h1: 'Asbestos, Mold and Property Guides',
    slogan: 'Understand your property.',
    kind: 'page',
  },
  '/author/mtzprints/': {
    title: 'Articles by mtzprints | AIS Environmental',
    description: 'Property articles written for AIS Environmental by mtzprints.',
    h1: 'Articles by mtzprints',
    slogan: 'Notes from the AIS team.',
    kind: 'page',
  },
  '/category/health/': {
    title: 'Asbestos, Mold and Lead Paint Articles | AIS Environmental',
    description: 'Health articles about asbestos, mold and lead paint from AIS Environmental.',
    h1: 'Asbestos, Mold and Lead Paint Articles',
    slogan: 'Health, made clearer.',
    kind: 'page',
  },
  '/category/home-improvement/': {
    title: 'Window and Home Improvement Articles | AIS Environmental',
    description: 'Home improvement articles about windows and property decisions from AIS Environmental.',
    h1: 'Window and Home Improvement Articles',
    slogan: 'Better home decisions.',
    kind: 'page',
  },
  '/thank-you': {
    title: 'Thank You for Your Quote Request | AIS Environmental',
    description: 'AIS Environmental received your project estimate request and will follow up soon.',
    h1: 'Thank You for Your Quote Request',
    slogan: "We'll follow up.",
    robots: 'noindex, nofollow',
    kind: 'page',
  },
}

function page(pathname, fields) {
  const robots = fields.robots || ''
  return {
    pathname,
    title: fields.title,
    description: fields.description,
    h1: fields.h1,
    slogan: fields.slogan || '',
    robots,
    canonical: robots.includes('noindex') && pathname === '/thank-you'
      ? `${ORIGIN}/thank-you`
      : `${ORIGIN}${pathname}`,
    image: fields.image || '',
    kind: fields.kind,
    serviceType: fields.serviceType || '',
    area: fields.area,
    post: fields.post,
    found: true,
  }
}

function notFoundMeta() {
  return {
    pathname: '',
    title: 'Page Not Found | AIS Environmental',
    description: 'The requested page could not be found on the AIS Environmental website.',
    h1: 'Page Not Found',
    slogan: 'Wrong turn. Right team.',
    robots: 'noindex, nofollow',
    canonical: '',
    image: '',
    kind: 'notfound',
    serviceType: '',
    found: false,
  }
}

export function getPageMeta(pathname) {
  if (STATIC[pathname]) return page(pathname, STATIC[pathname])
  const service = services.get(pathname)
  if (service) {
    return page(pathname, {
      title: `${service.headline} | AIS Environmental`,
      description: service.description,
      h1: service.headline,
      slogan: service.slogan,
      image: service.image,
      kind: 'service',
      serviceType: service.name,
    })
  }
  const area = areas.get(pathname)
  if (area) {
    const place = area.kind === 'state' ? area.name : `${area.name}, ${area.stateCode}`
    return page(pathname, {
      title: `Environmental Testing in ${place} | AIS Environmental`,
      description: area.kind === 'state'
        ? `Environmental testing across ${area.name}, including asbestos testing, mold testing and lead paint inspection for ${area.context}.`
        : `Environmental testing in ${area.name}, ${area.state}, including asbestos testing, mold testing and lead paint inspection for ${area.context}.`,
      h1: `Environmental Testing in ${place}`,
      slogan: area.kind === 'state' ? `Property services across ${area.name}.` : `Property services in ${area.name}.`,
      kind: 'area',
      serviceType: 'Environmental testing',
      area,
    })
  }
  const post = posts.get(pathname)
  if (post) {
    return page(pathname, {
      title: `${post.title} | AIS Environmental`,
      description: post.excerpt,
      h1: post.title,
      image: post.image,
      kind: 'article',
      post,
    })
  }
  return notFoundMeta()
}

export function imageAttributes(urlPath) {
  const size = catalog.images[urlPath]
  if (!size) return {}
  return { width: size.w, height: size.h }
}

function absolute(urlPath) {
  if (!urlPath) return undefined
  return `${ORIGIN}${urlPath}`
}

export function schemaGraph(meta) {
  const graph = [BUSINESS, {
    '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    name: 'AIS Environmental Inc.',
    url: `${ORIGIN}/`,
    publisher: { '@id': BUSINESS_ID },
  }]

  if (!meta.found) {
    graph.push({
      '@type': 'WebPage',
      name: meta.title,
      description: meta.description,
      isPartOf: { '@id': `${ORIGIN}/#website` },
    })
    return { '@context': 'https://schema.org', '@graph': graph }
  }

  const pageNode = {
    '@type': meta.kind === 'article' ? 'Article' : 'WebPage',
    '@id': `${meta.canonical}#webpage`,
    url: meta.canonical,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': `${ORIGIN}/#website` },
    about: { '@id': BUSINESS_ID },
  }
  if (meta.image) pageNode.primaryImageOfPage = absolute(meta.image)
  if (meta.kind === 'article' && meta.post) {
    pageNode.headline = meta.post.title
    pageNode.datePublished = meta.post.datePublished
    pageNode.author = { '@type': 'Organization', name: 'AIS Environmental Inc.', url: `${ORIGIN}/` }
    pageNode.mainEntityOfPage = meta.canonical
  }
  graph.push(pageNode)

  if (meta.kind === 'service' || meta.kind === 'area' || meta.kind === 'home') {
    const area = meta.area
    graph.push({
      '@type': 'Service',
      '@id': `${meta.canonical}#service`,
      name: meta.h1,
      serviceType: meta.serviceType || meta.h1,
      description: meta.description,
      url: meta.canonical,
      provider: { '@id': BUSINESS_ID },
      areaServed: area
        ? {
          '@type': area.kind === 'state' ? 'State' : 'City',
          name: area.name,
          containedInPlace: area.kind === 'city' ? { '@type': 'State', name: area.state } : undefined,
        }
        : [
          { '@type': 'City', name: 'Chicago' },
          { '@type': 'State', name: 'Illinois' },
          { '@type': 'State', name: 'Indiana' },
          { '@type': 'State', name: 'Wisconsin' },
        ],
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
