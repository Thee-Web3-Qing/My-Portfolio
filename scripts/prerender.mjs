import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { buildSchema, getSeoForPath, publicPaths, SITE_URL, SOCIAL_IMAGE } from '../src/seo.js'

const distDirectory = new URL('../dist/', import.meta.url)
const templatePath = new URL('index.html', distDirectory)
const template = await readFile(templatePath, 'utf8')

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

function removeExistingSeo(html) {
  const metaKeys = [
    ['name', 'description'],
    ['name', 'robots'],
    ['property', 'og:type'],
    ['property', 'og:site_name'],
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:url'],
    ['property', 'og:image'],
    ['name', 'twitter:card'],
    ['name', 'twitter:title'],
    ['name', 'twitter:description'],
    ['name', 'twitter:image'],
  ]

  let cleaned = html.replace(/\s*<title>[\s\S]*?<\/title>/i, '')
  for (const [attribute, key] of metaKeys) {
    cleaned = cleaned.replace(new RegExp(`\\s*<meta\\s+[^>]*${attribute}=["']${key}["'][^>]*>`, 'gi'), '')
  }
  cleaned = cleaned.replace(/\s*<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, '')
  cleaned = cleaned.replace(/\s*<script\s+[^>]*data-qing-schema[^>]*>[\s\S]*?<\/script>/gi, '')
  return cleaned
}

function buildHead(seo) {
  const canonicalUrl = `${SITE_URL}${seo.path === '/' ? '' : seo.path}`
  const ogType = seo.type === 'ProfilePage' ? 'profile' : 'website'
  const schema = JSON.stringify(buildSchema(seo)).replaceAll('<', '\\u003c')
  return `
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="Qing The Creator" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${SOCIAL_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${SOCIAL_IMAGE}" />
    <script type="application/ld+json" data-qing-schema>${schema}</script>`
}

function buildCrawlableContent(seo) {
  const serviceDetails = seo.service
    ? `<h2>What this service includes</h2><ul>${seo.service.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : ''
  const serviceLinks = publicPaths
    .filter((path) => path.startsWith('/services/'))
    .map((path) => {
      const serviceSeo = getSeoForPath(path)
      return `<li><a href="${path}">${escapeHtml(serviceSeo.label)}</a></li>`
    })
    .join('')

  return `<main data-prerendered-content>
      <p>Qing The Creator portfolio</p>
      <h1>${escapeHtml(seo.heading)}</h1>
      ${seo.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      ${serviceDetails}
      <h2>Services</h2>
      <ul>${serviceLinks}</ul>
      <p><a href="/products">View products and client builds</a> · <a href="/content">View content work</a> · <a href="/hire">Contact Qing</a></p>
    </main>`
}

function outputPathForRoute(pathname) {
  if (pathname === '/') return join(distDirectory.pathname, 'index.html')
  return join(distDirectory.pathname, `${pathname.slice(1)}.html`)
}

const cleanedTemplate = removeExistingSeo(template)

for (const pathname of publicPaths) {
  const seo = getSeoForPath(pathname)
  const head = buildHead(seo)
  const body = buildCrawlableContent(seo)
  const html = cleanedTemplate
    .replace('</head>', `${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)

  const outputPath = outputPathForRoute(pathname)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}

console.log(`Pre-rendered ${publicPaths.length} public portfolio routes.`)
