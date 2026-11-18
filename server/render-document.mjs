import { getPageMeta, schemaGraph } from './page-meta.mjs'

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function replaceTitle(html, title) {
  return html.replace(/(<title id="seo-title">)[\s\S]*?(<\/title>)/, `$1${escapeHtml(title)}$2`)
}

function replaceAttr(html, id, attr, value) {
  const pattern = new RegExp(`(<[^>]*id="${id}"[^>]*\\s${attr}=")[^"]*(")`)
  if (!pattern.test(html)) throw new Error(`Missing ${attr} on #${id}`)
  return html.replace(pattern, `$1${escapeHtml(value)}$2`)
}

function replaceH1(html, h1) {
  return html.replace(/(<h1 id="seo-h1"[^>]*>)[\s\S]*?(<\/h1>)/, `$1${escapeHtml(h1)}$2`)
}

export function renderDocument(html, pathname) {
  const meta = getPageMeta(pathname)
  let next = replaceTitle(html, meta.title)
  next = replaceAttr(next, 'seo-description', 'content', meta.description)
  next = replaceAttr(next, 'seo-og-title', 'content', meta.title)
  next = replaceAttr(next, 'seo-og-description', 'content', meta.description)
  next = replaceH1(next, meta.h1)

  if (meta.canonical) {
    next = replaceAttr(next, 'seo-canonical', 'href', meta.canonical)
    if (next.includes('id="seo-og-url"')) next = replaceAttr(next, 'seo-og-url', 'content', meta.canonical)
  } else {
    next = next.replace(/\s*<link id="seo-canonical"[^>]*>\s*/g, '\n    ')
    next = next.replace(/\s*<meta id="seo-og-url"[^>]*>\s*/g, '\n    ')
  }

  next = next.replace(/\s*<meta id="seo-robots"[^>]*>\s*/g, '\n    ')
  if (meta.robots) {
    next = next.replace(
      '<head>',
      `<head>\n    <meta id="seo-robots" name="robots" content="${escapeHtml(meta.robots)}" />`,
    )
  }

  const json = JSON.stringify(schemaGraph(meta)).replace(/</g, '\\u003c')
  next = next.replace(
    /(<script id="seo-jsonld" type="application\/ld\+json">)[\s\S]*?(<\/script>)/,
    `$1${json}$2`,
  )

  if (pathname === '/thank-you') {
    next = next.replace(
      "gtag('config', 'AW-625851217');",
      "gtag('config', 'AW-625851217', { send_page_view: false });",
    )
  }

  if (meta.image && meta.found) {
    const preload = `<link rel="preload" as="image" href="${escapeHtml(meta.image)}" fetchpriority="high" />`
    next = next.replace('</head>', `    ${preload}\n  </head>`)
  }

  return next
}

export function robotsHeader(pathname) {
  const robots = getPageMeta(pathname).robots
  return robots || null
}
