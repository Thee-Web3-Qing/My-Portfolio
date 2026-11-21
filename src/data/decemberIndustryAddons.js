/**
 * Only distinctive, interactive enhancements are sold as December feature add-ons.
 * A complete functional storefront, catalogue, ordinary enquiries and WhatsApp
 * orders are covered by the base package. Prices include the 5% December reduction.
 *
 * These are bounded, rules-based interfaces using merchant-supplied content.
 * AI fitting/AR, live availability and ongoing third-party services are NOT implied.
 */
export const INDUSTRY_ADDON_GROUPS = {
  fashion: [
    { title:'Interactive styling', description:'Give customers an experience beyond browsing ordinary product cards.', items:[
      ['fashion-outfit-builder','Mix-and-match outfit builder','Customers combine tops, bottoms and accessories visually, then send the chosen pieces and total in one enquiry.',42750],
      ['fashion-style-quiz','Personal style finder quiz','A short guided quiz recommends products using a fixed matching guide supplied by your brand.',28500],
      ['fashion-fit-finder','Guided fit recommendation','A measurement-based selector suggests the closest listed size using your supplied size chart. No body scanning.',33250],
    ]},
    { title:'Immersive product experiences', description:'Show how pieces work together and help shoppers make choices.', items:[
      ['fashion-shop-the-look','Interactive shop-the-look hotspots','Clickable styling images reveal each outfit item and its price, with an outfit total.',28500],
      ['fashion-360-viewer','360° product spin','Shoppers rotate selected products with the angle-by-angle photos you provide. Includes up to five items.',28500],
    ]},
  ],
  food: [
    {title:'Build your order',description:'Turn complex menus into interactive ordering experiences.',items:[
      ['food-party-tray-builder','Build-your-own party tray','Customers select trays, protein combinations and portions, with a live itemised estimate.',42750],
      ['food-cake-builder','Interactive custom cake builder','Choose cake size, flavour, finish and inscription, then preview the estimated price and order summary.',38000],
      ['food-bundle-builder','Mix-and-match meal bundles','Let customers assemble a set menu from allowed courses and see the total update.',33250],
    ]},
    {title:'Smart planning tools',description:'Useful calculators for feeding a crowd.',items:[
      ['food-portion-calculator','Guest-to-portion calculator','Customers enter guest count and select meal type to see suggested portions based on your serving guidelines.',28500],
      ['food-delivery-calculator','Live delivery fee estimator','Calculate an estimated delivery charge from your supplied area, order-size and service fee rules.',23750],
    ]},
  ],
  gifts: [
    {title:'Interactive gifting',description:'Make choosing a gift feel personal.',items:[
      ['gifts-build-box','Visual build-your-own hamper','Choose items and box sizes, see the bundle fill up and watch the total change before enquiry.',42750],
      ['gifts-gift-finder','Gift finder quiz','A quiz recommends hampers based on recipient, occasion and available budget.',28500],
      ['gifts-wrapping-preview','Gift packaging preview','Preview pre-photographed wrap, ribbon and box combinations before selecting one.',33250],
    ]},
    {title:'Personal and corporate tools',description:'Better gifting experiences for individuals and teams.',items:[
      ['gifts-message-preview','Live personalised card preview','Type a gift message and see it rendered on one of your branded card designs.',23750],
      ['gifts-corporate-estimator','Bulk gifting price calculator','Select hamper tier and quantity to view a live estimate from your approved corporate price bands.',28500],
    ]},
  ],
  beauty: [
    {title:'Find your look',description:'Help clients visualise the result and choose confidently.',items:[
      ['beauty-style-match','Hairstyle and beauty match quiz','Guide customers to recommended hairstyles or services using your supplied style rules.',28500],
      ['beauty-before-after','Interactive before-and-after slider','Compare treatment, hair or makeup results using paired, approved customer images.',14250],
      ['beauty-bridal-board','Bridal look inspiration board','Customers choose reference looks and save a combined inspiration board with their enquiry.',38000],
    ]},
    {title:'Personalised packages',description:'Plan a service visit before booking.',items:[
      ['beauty-package-builder','Build your beauty package','Combine service extras from your approved menu to calculate an estimated package cost.',33250],
      ['beauty-prep-planner','Event beauty preparation planner','Suggest a preparation timeline from a selected event date and your lead-time rules.',28500],
    ]},
  ],
  events: [
    {title:'Interactive event planning',description:'Move beyond a static services portfolio.',items:[
      ['events-package-builder','Build-your-own event package','Select coverage, decor, staffing and service extras with a live estimate.',38000],
      ['events-budget-planner','Event budget breakdown tool','Allocate an entered budget across service categories using configurable percentages.',38000],
      ['events-moodboard','Interactive event moodboard','Select provided decor themes, reference photos and colour palettes to create a shareable enquiry board.',38000],
    ]},
    {title:'Planning assistance',description:'Give customers useful guidance before their first consultation.',items:[
      ['events-guest-estimator','Guest count and service calculator','Estimate seating and service quantities based on guest number and your event rules.',28500],
      ['events-timeline-builder','Event timeline planner','Produce a basic suggested run-of-show from the event type, date and milestones you provide.',33250],
    ]},
  ],
  accessories: [
    {title:'Make it yours',description:'Interactive product experiences for premium accessories.',items:[
      ['accessories-engraving-preview','Live engraving preview','Type initials or a name and preview its position on your prepared product mockups.',33250],
      ['accessories-stack-builder','Mix-and-match accessory builder','Visually combine watches, bracelets or jewellery into a styled set with a calculated total.',38000],
      ['accessories-style-quiz','Accessory style matcher','Recommend pieces based on occasion, preference and budget through a short quiz.',28500],
    ]},
    {title:'Detailed product discovery',description:'Let shoppers explore your collection more deeply.',items:[
      ['accessories-360-viewer','360° accessory viewer','A drag-to-rotate product viewer using photography you provide. Includes up to five products.',28500],
      ['accessories-comparison','Side-by-side product comparison','Compare up to three products at once on dimensions, materials, finishes and prices.',23750],
    ]},
  ],
  hospitality: [
    {title:'Plan a stay',description:'Give visitors clearer information before sending an enquiry.',items:[
      ['hospitality-stay-calculator','Interactive stay cost estimator','Enter dates and guests to estimate nights, cleaning charges and extras from supplied rates. No availability claims.',33250],
      ['hospitality-property-comparison','Compare properties side by side','Compare up to three listings by amenities, capacity, location and listed prices.',28500],
      ['hospitality-floorplan','Clickable room and floorplan tour','Explore a supplied floorplan with hotspots opening property photographs and descriptions.',38000],
    ]},
    {title:'Personalised stays',description:'Help visitors discover experiences beyond the room.',items:[
      ['hospitality-stay-builder','Build your stay experience','Choose room packages and available optional experiences to see a combined enquiry estimate.',33250],
      ['hospitality-nearby-guide','Interactive neighbourhood guide','A curated interactive guide to nearby places with map links, based on your approved local recommendations.',28500],
    ]},
  ],
}

export const INDUSTRY_ADDONS = Object.entries(INDUSTRY_ADDON_GROUPS).flatMap(([industry, groups]) =>
  groups.flatMap(group => group.items.map(([id,name,description,price]) => ({
    id,name,description,price,industries:[industry],group:group.title,
    recommended:[industry],scope:'interactive-enhancement',
  })))
)

export function getIndustryGroups(industry) {
  return (INDUSTRY_ADDON_GROUPS[industry] || []).map(group=>({
    ...group,
    items:group.items.map(([id])=>INDUSTRY_ADDONS.find(x=>x.id===id)).filter(Boolean),
  }))
}
