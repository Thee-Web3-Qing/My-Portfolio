import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { buildSchema, getSeoForPath, publicPaths, SITE_URL, SOCIAL_IMAGE } from '../src/seo.js'
import { fashionInventory, fashionLooks } from '../src/pages/fashionInventory.js'

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
    <meta name="robots" content="${seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />
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

// Standalone fashion prototypes use the regular React entrypoint, not the portfolio's SEO body.
// Emitting a real HTML file for each route makes direct links work with Vercel cleanUrls.
const fashionPreviewRoutes = [
  { path: '/fashioneditorial', title: 'LOCO | Fashion Editorial Store Preview' },
  { path: '/fashioncatalogue', title: 'HER FASHION | Fashion Catalogue and Styling Preview' },
  { path: '/fashionminimal', title: 'RUSH | Minimal Fashion Fitting Room Preview' },
]

const commercePages = ['shop','looks','about','faq','wishlist','cart']
const extras = {fashioneditorial:['campaign'],fashioncatalogue:['stylist'],fashionminimal:['fitting-room']}
for (const base of Object.keys(extras)) {
  const brand=base==='fashioneditorial'?'LOCO':base==='fashioncatalogue'?'HER FASHION':'RUSH'
  for (const section of [...commercePages,...extras[base]]) {
    fashionPreviewRoutes.push({path:'/'+base+'/'+section,title:brand+' | '+section.replaceAll('-',' ')})
  }
  for (const product of fashionInventory) {
    fashionPreviewRoutes.push({path:'/'+base+'/product/'+product.id,title:product.name+' | '+brand})
  }
  for (const look of fashionLooks) {
    fashionPreviewRoutes.push({path:'/'+base+'/looks/'+look.id,title:look.title+' | '+brand})
  }
}

for (const preview of fashionPreviewRoutes) {
  const head = '<title>' + escapeHtml(preview.title) + '</title>' +
    '<meta name="description" content="Fashion storefront concept designed by Qing The Creator. Sample products and temporary imagery." />' +
    '<meta name="robots" content="noindex, nofollow" />'
  const html = cleanedTemplate.replace('</head>', head + '\n  </head>')
  const path = outputPathForRoute(preview.path)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, html)
}

/* Standalone food storefront pages.
 * Each exact route gets a real index entrypoint, so direct links, refresh and
 * nested product-detail URLs work on a static Vercel/Vite deployment.
 * These are client demonstrations and deliberately not search indexed. */
const foodMenus = {
  foodeditorial: ['bibimbap','bulgogi','tteokbokki','chicken','kimchi-rice','banchan','korean-soup','seoul-set','lime-spritz','beef-feast'],
  foodcatalogue: ['butter-croissant','pain-choc','cinnamon-bun','choc-cookie','birthday-cake','brownie','donuts','sourdough','latte','party-box'],
  foodminimal: ['mutton-biryani','chicken-biryani','jeera-rice','kadai-chicken','palak-paneer','butter-chicken','veg-biryani','samosa','naan','royal-feast'],
  foodartisan: ['mutton-biryani','chicken-biryani','jeera-rice','kadai-chicken','palak-paneer','butter-chicken','veg-biryani','samosa','naan','royal-feast'],
}
const foodBrands={foodeditorial:'HANSIK',foodcatalogue:'Crumb & Co.',foodminimal:'KANIGIRI',foodartisan:'MATBOR'}
const foodSubpages=['menu','about','contact','catering','events','experience','reservations','locations','faq','cart']
let foodCount=0
for(const [root,ids] of Object.entries(foodMenus)){
  const paths=['/'+root,...foodSubpages.map(slug=>'/'+root+'/'+slug),...ids.map(id=>'/'+root+'/item/'+id)]
  for(const pathname of paths){
    const segment=pathname.split('/').filter(Boolean).slice(1).join(' · ')
    const title=(segment?segment+' | ':'')+foodBrands[root]+' | December Food Website Preview'
    const html=cleanedTemplate.replace('</head>',`
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="A complete food-business website demonstration with a menu, product details, enquiry forms and a sample shopping bag." />
    <meta name="robots" content="noindex, nofollow" />
  </head>`)
    const outputPath=outputPathForRoute(pathname)
    await mkdir(dirname(outputPath),{recursive:true})
    await writeFile(outputPath,html)
    foodCount++
  }
}
console.log(`Pre-rendered ${foodCount} standalone food website preview routes.`)


console.log(`Pre-rendered ${publicPaths.length} public portfolio routes.`)
