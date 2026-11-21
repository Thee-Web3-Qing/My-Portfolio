import { INDUSTRY_ADDONS, getIndustryGroups } from './decemberIndustryAddons.js'

export const BASE_PRICE = 120000

export const INDUSTRIES = [
  { id: 'fashion', label: 'Clothing & fashion', kicker: 'New season, new collection', category: 'Shop', type: 'products', colour: '#c85843', backdrop: '#ead4bd', exampleBrand: 'ATELIER NO. 4', sample: ['The holiday edit', 'Ready-to-wear', 'New arrivals'], feature: 'Holiday collections, sizes and prices' },
  { id: 'food', label: 'Food & cakes', kicker: 'Made for December tables', category: 'Order', type: 'products', colour: '#ab5b31', backdrop: '#f2d8ae', exampleBrand: 'SUNDAY TABLE', sample: ['Festive trays', 'Party platters', 'Dessert boxes'], feature: 'Festive menus, portions and preorders' },
  { id: 'gifts', label: 'Gifts & hampers', kicker: 'Thoughtful gifting, beautifully wrapped', category: 'Gift', type: 'products', colour: '#346e57', backdrop: '#dce9cf', exampleBrand: 'THE GIFT DEPT.', sample: ['Corporate hampers', 'Mini gift boxes', 'Build a hamper'], feature: 'Gift bundles, packaging and delivery' },
  { id: 'beauty', label: 'Beauty & hair', kicker: 'Your festive glow-up', category: 'Book', type: 'services', colour: '#9d5473', backdrop: '#efdce5', exampleBrand: 'FORME BEAUTY', sample: ['Wig installations', 'Nail sets', 'Makeup looks'], feature: 'Service packages and booking enquiries' },
  { id: 'events', label: 'Events & creatives', kicker: 'Every moment deserves the frame', category: 'Enquire', type: 'services', colour: '#5f5b9a', backdrop: '#dedcf4', exampleBrand: 'AFTER HOURS STUDIO', sample: ['Photography', 'Decor packages', 'Event coverage'], feature: 'Portfolios, packages and availability enquiries' },
  { id: 'accessories', label: 'Accessories & lifestyle', kicker: 'The details make the outfit', category: 'Shop', type: 'products', colour: '#8b573e', backdrop: '#e5d8c9', exampleBrand: 'OBJECTS & CO.', sample: ['Bags', 'Jewellery', 'Fragrance'], feature: 'Product collections and WhatsApp orders' },
  { id: 'hospitality', label: 'Short-lets & experiences', kicker: 'Stay somewhere worth remembering', category: 'Reserve', type: 'stays', colour: '#466a76', backdrop: '#d4e5e6', exampleBrand: 'STAY SUNDAY', sample: ['The studio', 'The city suite', 'Private experiences'], feature: 'Property galleries and reservation enquiries' },
]

export const LAYOUTS = [
  { id: 'editorial', label: 'Editorial', description: 'A dramatic campaign hero and curated feature sections.' },
  { id: 'catalogue', label: 'Catalogue', description: 'Lead with available products, services or packages.' },
  { id: 'minimal', label: 'Minimal', description: 'Quiet typography, large images and lots of breathing room.' },
]

export const SHARED_ADDONS = [
  { id: 'custom-design', name: 'Custom homepage design', description: 'Unique hero, typography and section arrangement.', price: 57000, recommended: ['fashion', 'beauty', 'events'] },
  { id: 'expanded-catalogue', name: 'Expanded catalogue', description: 'Increase your included listings from 12 to 30.', price: 19000, recommended: ['fashion', 'food', 'gifts', 'accessories'] },
  { id: 'cart', name: 'Multi-item order basket', description: 'Customers combine items into one WhatsApp order.', price: 33250, recommended: ['fashion', 'food', 'gifts', 'accessories'] },
  { id: 'order-form', name: 'Custom enquiry / order form', description: 'Collect details like dates, sizes or delivery instructions.', price: 23750, recommended: ['food', 'gifts', 'events'] },
  { id: 'booking', name: 'Appointment booking', description: 'Customers request a slot; you confirm availability.', price: 61750, recommended: ['beauty', 'events', 'hospitality'] },
  { id: 'gallery', name: 'Extra image gallery', description: 'A dedicated gallery for up to 20 photos.', price: 14250, recommended: ['beauty', 'events', 'hospitality'] },
  { id: 'page', name: 'Additional standard page', description: 'One extra page from your existing design components.', price: 28500, recommended: ['events', 'hospitality'] },
  { id: 'payment', name: 'Customer online payments', description: 'Hosted payment checkout for your storefront, subject to provider approval.', price: 66500, recommended: ['fashion', 'food', 'gifts', 'accessories'] },
]

export const ADDONS = [...SHARED_ADDONS, ...INDUSTRY_ADDONS]
export { getIndustryGroups }

const SHARED_ADDON_ELIGIBILITY = {
  'expanded-catalogue':['fashion','food','gifts','accessories','hospitality'],
  cart:['fashion','food','gifts','accessories'],
  booking:['beauty','events','hospitality'],
}

export function getAvailableAddons(industry) {
  return ADDONS.filter(item => item.industries
    ? item.industries.includes(industry)
    : !SHARED_ADDON_ELIGIBILITY[item.id] || SHARED_ADDON_ELIGIBILITY[item.id].includes(industry))
}

export function getSharedGroups(industry) {
  const allowed = new Set(getAvailableAddons(industry).map(item=>item.id))
  return [
    { title:'Design & presentation', description:'Change how your storefront is displayed.', items:SHARED_ADDONS.filter(x=>allowed.has(x.id) && ['custom-design','expanded-catalogue','gallery','page'].includes(x.id)) },
    { title:'Orders & customer enquiries', description:'Add optional ordering and communication tools.', items:SHARED_ADDONS.filter(x=>allowed.has(x.id) && ['cart','order-form','booking','payment'].includes(x.id)) },
  ].filter(group=>group.items.length>0)
}

export const money = amount => '₦' + Number(amount || 0).toLocaleString('en-NG')

export function imageUnitPrice(count) {
  if (count >= 30) return 400
  if (count >= 10) return 450
  return 500
}

export function calculateDecemberQuote({ industry = 'fashion', layout = 'editorial', addons = [], images = 0 } = {}) {
  const selectedIndustry = INDUSTRIES.find(item => item.id === industry) || INDUSTRIES[0]
  const selectedLayout = LAYOUTS.find(item => item.id === layout) || LAYOUTS[0]
  const chosenIds = new Set(Array.isArray(addons) ? addons : [])
  const selectedAddons = getAvailableAddons(selectedIndustry.id).filter(item => chosenIds.has(item.id))
  const imageCount = Number.isInteger(Number(images)) ? Math.max(0, Math.min(200, Number(images))) : 0
  const photosUnitPrice = imageUnitPrice(imageCount)
  const imagesSubtotal = imageCount * photosUnitPrice
  const addonsSubtotal = selectedAddons.reduce((sum, item) => sum + item.price, 0)
  const total = BASE_PRICE + addonsSubtotal + imagesSubtotal
  return {
    industry: selectedIndustry,
    layout: selectedLayout,
    selectedAddons,
    images: imageCount,
    imageUnitPrice: photosUnitPrice,
    imagesSubtotal,
    addonsSubtotal,
    base: BASE_PRICE,
    total,
    deposit: Math.round(total * 0.6),
    balance: total - Math.round(total * 0.6),
  }
}
