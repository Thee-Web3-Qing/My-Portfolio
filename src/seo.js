import { services } from './data/services.js'
import { INDUSTRIES, LAYOUTS } from './data/december.js'

export const SITE_URL = 'https://www.qingthecreator.xyz'
export const SOCIAL_IMAGE = `${SITE_URL}/qing-class-portrait.jpg`

const personId = `${SITE_URL}/#qing`
const websiteId = `${SITE_URL}/#website`

const productWork = [
  { '@type': 'SoftwareApplication', name: 'Tab', applicationCategory: 'FinanceApplication', url: 'https://clearyourtab.xyz/' },
  { '@type': 'SoftwareApplication', name: 'Gigga', applicationCategory: 'BusinessApplication', url: 'https://get-gigga.vercel.app/' },
  { '@type': 'WebApplication', name: 'Think Tank Circle', applicationCategory: 'EducationalApplication', url: 'https://think-tank-circle.vercel.app/' },
  { '@type': 'SoftwareApplication', name: 'Beauty by 3lle', applicationCategory: 'BusinessApplication', url: 'https://beauty-by3ll3.vercel.app/' },
  { '@type': 'SoftwareApplication', name: 'Moment', applicationCategory: 'BusinessApplication', url: 'https://moment-blush.vercel.app/' },
  { '@type': 'SoftwareApplication', name: 'The Authors Room', applicationCategory: 'BusinessApplication', url: 'https://the-authors-room.vercel.app/' },
  { '@type': 'SoftwareApplication', name: '22Energy', applicationCategory: 'BusinessApplication', url: 'https://22-energy-rho.vercel.app/' },
  { '@type': 'SoftwareApplication', name: 'Bookie', applicationCategory: 'BusinessApplication', url: 'https://askbookie.xyz/' },
  { '@type': 'SoftwareApplication', name: 'Man of Ubuntu', applicationCategory: 'EducationalApplication', url: 'https://manofubuntu.org/' },
  { '@type': 'WebApplication', name: 'The Dragon Universe', applicationCategory: 'BusinessApplication', url: 'https://www.thedragonuniverse.io/' },
  { '@type': 'SoftwareApplication', name: 'AssetDNA', applicationCategory: 'BusinessApplication', url: 'https://asset-dna-gules.vercel.app/' },
]

const contentWork = [
  { '@type': 'CreativeWork', name: 'The Degen Throne', url: 'https://youtu.be/mjgcVDle2Wg' },
  { '@type': 'CreativeWork', name: 'Union Build Comic', url: 'https://x.com/qingthecreator_/status/1922198581517185088' },
  { '@type': 'CreativeWork', name: 'Polygon Beef', url: 'https://x.com/qingthecreator/status/1892170886712541632' },
]

export const basePerson = {
  '@type': 'Person',
  '@id': personId,
  name: 'Giwa Oluwasheedah',
  alternateName: ['Qing', 'Qing The Creator'],
  url: SITE_URL,
  image: SOCIAL_IMAGE,
  jobTitle: 'AI Product Builder and Creative Strategist',
  description: 'Lagos-based AI product builder and creative strategist creating mobile-first websites, digital products, AI business systems and Web3 content campaigns.',
  email: 'mailto:qinglidah@gmail.com',
  telephone: '+2348124320659',
  homeLocation: {
    '@type': 'Place',
    name: 'Lagos, Nigeria',
  },
  knowsAbout: [
    'AI product development',
    'Mobile-first website design',
    'Digital product prototyping',
    'AI business automation',
    'Web3 content strategy',
    'Creative direction',
  ],
  sameAs: [
    'https://x.com/QingTheCreator_',
    'https://github.com/Thee-Web3-Qing',
  ],
}

const staticRoutes = {
  '/': {
    title: 'Qing The Creator | AI Product Builder and Creative Strategist',
    description: 'Giwa Oluwasheedah, known as Qing The Creator, builds mobile-first websites, AI products, business systems and Web3 content campaigns from Lagos, Nigeria.',
    label: 'Qing The Creator portfolio',
    heading: 'AI product builder, creative strategist and storyteller in Lagos, Nigeria.',
    paragraphs: [
      'Giwa Oluwasheedah, known as Qing The Creator, turns rough ideas into clear stories, mobile-first websites and useful digital products.',
      'Services include AI product development, mobile-first website design, AI business automation, product prototyping and Web3 content strategy.',
    ],
    type: 'ProfilePage',
  },
  '/content': {
    title: 'Content Campaigns and Creative Direction | Qing The Creator',
    description: 'Explore Web3 campaigns, documentaries, scripts, comics, music and product education created by Qing The Creator.',
    label: 'Content portfolio',
    heading: 'Web3 content strategy, campaigns and creative storytelling.',
    paragraphs: [
      'Qing creates technical product education, campaign concepts, video scripts, documentaries, live Spaces, comics and culturally relevant storytelling.',
      'Featured brand work includes CodeXero, Margin Trade, Ramphub, Clapmi and other Web3 product campaigns.',
    ],
    type: 'CollectionPage',
  },
  '/products': {
    title: 'AI Products, Websites and Client Builds | Qing The Creator',
    description: 'View mobile-first websites, marketplaces, AI products, dashboards and client platforms designed and built by Qing The Creator.',
    label: 'Product portfolio',
    heading: 'Websites, AI products and digital platforms built for real goals.',
    paragraphs: [
      'Spotlight work includes Bookie, Man of Ubuntu, The Dragon Universe, Gigga and Tab, alongside Think Tank Circle, Beauty by 3lle, Moment, The Authors Room, 22Energy and AssetDNA.',
      'Each case study explains what the client wanted, what Qing built, the product features and the live deployment.',
    ],
    type: 'CollectionPage',
  },
  '/hire': {
    title: 'Hire Qing | Websites, AI Products and Content Strategy',
    description: 'Hire Qing The Creator for mobile-first websites, AI product development, business automation, prototyping or Web3 content strategy.',
    label: 'Work with Qing',
    heading: 'Hire Qing for websites, AI products, automation and content strategy.',
    paragraphs: [
      'Qing works with founders, creators, technology brands and small businesses that need help turning an idea or business problem into a clear, useful output.',
      'Project enquiries can be sent through WhatsApp or email.',
    ],
    type: 'ContactPage',
  },
  '/experience': {
    title: 'Experience and Selected Recognition | Qing The Creator',
    description: 'Explore Qing The Creator’s experience across Web3 content, community, conference hosting, product building and creative direction.',
    label: 'Professional experience',
    heading: 'Experience across technology, products, content and community.',
    paragraphs: [
      'Giwa Oluwasheedah is a product builder, Web3 storyteller, conference host, community architect and creative director based in Lagos, Nigeria.',
      'Her work combines product thinking, technical communication and culture-led storytelling.',
    ],
    type: 'ProfilePage',
  },
  '/admin': {
    title: 'Private Admin Studio | Qing The Creator',
    description: 'Private website project and payment administration.',
    label: 'Private admin studio',
    heading: 'Private client management dashboard.',
    paragraphs: ['Administrator access is required.'],
    type:'WebPage',noindex:true,
  },
  '/december/track': {
    title: 'Track Your December Website | Qing The Creator',
    description: 'Check the current stage of your December website using your Paystack order reference.',
    label:'December website progress',
    heading:'Customer project progress tracking.',
    paragraphs:['Use the reference saved after your payment to see the latest public project update.'],
    type:'WebPage',noindex:true,
  },
  '/december/details': {
    title:'Submit Business Information | Qing The Creator',
    description:'Securely provide your branding and product information after Paystack verifies your payment.',
    label:'December website onboarding',
    heading:'Complete your business information after payment.',
    paragraphs:['Use your Paystack transaction reference and payment email to submit your website requirements.'],
    type:'WebPage',noindex:true,
  },
  '/payment/callback': {
    title: 'Payment Verification | Qing The Creator',
    description: 'Verify the status of a Paystack payment for the December website sale or Qing’s Vibecoding Class.',
    label: 'Payment status',
    heading: 'Secure payment verification.',
    paragraphs: ['Your payment status is verified directly with Paystack.'],
    type: 'WebPage',
  },
  '/december': {
    title: 'December Website Sale | Business Websites from ₦100,000 | Qing The Creator',
    description: 'Get a beautiful website for your clothing, food, gifting, beauty, events or hospitality business. Choose an industry, a layout and optional features with clear prices.',
    label: 'December Website Sale',
    heading: 'December websites for businesses, with industry templates and optional add-ons.',
    paragraphs: [
      'Every December website starts at ₦100,000 and includes a responsive branded storefront, up to 12 listings, a seasonal offer and WhatsApp ordering or enquiries.',
      'Browse industry layouts and choose optional features, AI product photos and a 60% deposit or full-payment checkout.',
    ],
    type: 'WebPage',
  },
  '/class': {
    title: 'Beginner Vibecoding Class | Learn to Build with AI',
    description: 'Join Qing’s beginner vibecoding class and learn how to turn an idea into a mobile-first product using AI, GitHub, Vercel and Supabase.',
    label: 'Qing’s Vibecoding Starter Class',
    heading: 'Learn the basics of building digital products with AI.',
    paragraphs: [
      'The beginner class teaches product planning, scaffolding, interface design, backend connections, APIs, debugging and deployment through practical work.',
      'Students register with their details and payment receipt. Accepted payments determine the active class price tier.',
    ],
    type: 'Course',
  },
}

const demoRoutes = Object.fromEntries(INDUSTRIES.map(industry => [
  '/december/demo/' + industry.id, {
    title: industry.label + ' Storefront Preview | December Website Sale',
    description: 'Explore a seasonal sample website for ' + industry.label.toLowerCase() + '. Choose a layout, add features and book a branded website from ₦100,000.',
    label: industry.label + ' website example',
    heading: 'Interactive ' + industry.label.toLowerCase() + ' demo website.',
    paragraphs: [
      'This is an illustrative working storefront with sample product photography, pricing and editorial layouts.',
      'Customise your own December website from ₦100,000, with optional add-on features.',
    ],
    type: 'WebPage',
  }
]))

const industryRoutes = Object.fromEntries(INDUSTRIES.flatMap(industry =>
  ['', '/features', '/checkout'].map(stage => {
    const path = '/december/' + industry.id + stage
    const pageName = stage === '/features' ? 'Optional features and prices' : stage === '/checkout' ? 'Website checkout' : 'Website designs'
    return [path, {
      title: industry.label + ' ' + pageName + ' | December Website Sale',
      description: 'Create a ' + industry.label.toLowerCase() + ' business website with an editorial template, up to 12 listings and individually priced optional features.',
      label: industry.label + ' ' + pageName.toLowerCase(),
      heading: industry.label + ' ' + pageName.toLowerCase() + '.',
      paragraphs: ['Choose from three independent design styles and an expanded set of features tailored to this industry.', 'Websites start at ₦100,000, with a 60% deposit or full payment through Paystack.'],
      type:'WebPage',
      noindex:stage === '/checkout',
    }]
  })
))
const previewRoutes = Object.fromEntries(INDUSTRIES.flatMap(industry =>
  LAYOUTS.map(style => {
    const path = '/' + industry.id + style.id
    return [path, {
      title:industry.label + ' ' + style.label + ' Website Sample | December Sale',
      description:'Sample ' + style.label.toLowerCase() + ' website layout for ' + industry.label.toLowerCase() + '.',
      label:industry.label + ' ' + style.label.toLowerCase() + ' sample storefront',
      heading:style.label + ' sample website for ' + industry.label.toLowerCase() + '.',
      paragraphs:['This preview currently shows illustrative demo content until the standalone industry interface is completed.'],
      type:'WebPage',
    }]
  })
))

export const servicePaths = Object.keys(services).map((slug) => `/services/${slug}`)
export const publicPaths = [...Object.keys(staticRoutes).filter(path => !['/admin','/december/track','/december/details','/payment/callback'].includes(path)), ...Object.keys(demoRoutes), ...Object.keys(previewRoutes), ...servicePaths]

export function getSeoForPath(pathname) {
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
  if (staticRoutes[cleanPath]) return { path: cleanPath, ...staticRoutes[cleanPath] }
  if (demoRoutes[cleanPath]) return { path: cleanPath, ...demoRoutes[cleanPath] }
  if (industryRoutes[cleanPath]) return { path: cleanPath, ...industryRoutes[cleanPath] }
  if (previewRoutes[cleanPath]) return { path: cleanPath, ...previewRoutes[cleanPath] }
  if (cleanPath === '/december/details') return {
    path:cleanPath, title:'Submit Business Information | Qing The Creator',
    description:'Complete your December website order using a verified Paystack reference.',
    label:'December website onboarding',
    heading:'Complete your business information after payment.',
    paragraphs:['Use your Paystack reference and payment email to submit your business name, product photos, services and brand assets.'],
    type:'WebPage'
  }

  const serviceMatch = cleanPath.match(/^\/services\/([^/]+)$/)
  const service = serviceMatch ? services[serviceMatch[1]] : null
  if (service) {
    return {
      path: cleanPath,
      title: `${service.eyebrow} | Qing The Creator`,
      description: service.summary,
      label: service.eyebrow,
      heading: service.title,
      paragraphs: [service.summary, `This service is designed for ${service.idealFor.join(', ').toLowerCase()}.`],
      type: 'Service',
      service,
    }
  }

  return { path: '/', ...staticRoutes['/'] }
}

export function buildSchema(seo) {
  const pageUrl = `${SITE_URL}${seo.path === '/' ? '' : seo.path}`
  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: SITE_URL,
    name: 'Qing The Creator Portfolio',
    publisher: { '@id': personId },
    inLanguage: 'en',
  }

  let page
  if (seo.type === 'Service') {
    page = {
      '@type': 'Service',
      '@id': `${pageUrl}/#service`,
      name: seo.service.eyebrow,
      serviceType: seo.service.serviceType,
      description: seo.description,
      url: pageUrl,
      provider: { '@id': personId },
      areaServed: [
        { '@type': 'Country', name: 'Nigeria' },
        { '@type': 'Place', name: 'Remote and international' },
      ],
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      },
    }
  } else if (seo.type === 'Course') {
    page = {
      '@type': 'Course',
      '@id': `${pageUrl}/#course`,
      name: seo.label,
      description: seo.description,
      url: pageUrl,
      provider: { '@id': personId },
      inLanguage: 'en',
    }
  } else {
    page = {
      '@type': seo.type,
      '@id': `${pageUrl}/#page`,
      url: pageUrl,
      name: seo.label,
      description: seo.description,
      isPartOf: { '@id': websiteId },
      about: { '@id': personId },
      mainEntity: seo.type === 'ProfilePage' ? { '@id': personId } : undefined,
      inLanguage: 'en',
    }
    if (seo.path === '/products') page.hasPart = productWork
    if (seo.path === '/content') page.hasPart = contentWork
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [basePerson, website, page],
  }
}
