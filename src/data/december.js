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

// These change the scope of the website job, not the basic functionality.
// Standard product browsing, WhatsApp ordering and routine enquiries are included.
export const SHARED_ADDONS = [
  { id:'custom-design', name:'Fully custom homepage design', description:'A newly art-directed hero, typography and section arrangement beyond the selected starter design.', price:57000, recommended:['fashion','food','gifts','beauty','events','accessories','hospitality'], scope:'design-extension' },
  { id:'expanded-catalogue', name:'Expand catalogue to 30 listings', description:'Increase the supplied catalogue from 12 to a total of 30 ready-to-publish products or services.', price:19000, recommended:['fashion','food','gifts','accessories','hospitality'], scope:'content-extension' },
  { id:'page', name:'Additional designed page', description:'One additional page using the approved the approved template components, with your supplied content.', price:28500, recommended:['events','hospitality'], scope:'content-extension' },
]

export const ADDONS = [...SHARED_ADDONS, ...INDUSTRY_ADDONS]
export { getIndustryGroups }

const SHARED_ADDON_ELIGIBILITY = {
  'expanded-catalogue':['fashion','food','gifts','accessories','hospitality'],
}

export function getAvailableAddons(industry) {
  return ADDONS.filter(item => item.industries
    ? item.industries.includes(industry)
    : !SHARED_ADDON_ELIGIBILITY[item.id] || SHARED_ADDON_ELIGIBILITY[item.id].includes(industry))
}

export function getSharedGroups(industry) {
  const allowed = new Set(getAvailableAddons(industry).map(item=>item.id))
  return [
    {
      title:'Optional design & content extensions',
      description:'Only if you need more design or content work than the complete starter template includes.',
      items: SHARED_ADDONS.filter(x=>allowed.has(x.id)),
    },
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
