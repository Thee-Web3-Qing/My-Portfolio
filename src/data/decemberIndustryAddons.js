/**
 * Flat, scoped optional features for the December storefront offer.
 * All displayed amounts already include the 5% December add-on discount.
 * These are bounded template enhancements, not bespoke integrations.
 */
export const INDUSTRY_ADDON_GROUPS = {
  fashion: [
    { title:'Product discovery', description:'Help shoppers find the right piece.', items:[
      ['fashion-collections','Shop by collection','Collection landing sections and a category filter for up to six collections.',14250],
      ['fashion-size-guide','Size and measurement guide','One branded size chart and measurement guidance.',9500],
      ['fashion-variants','Size and colour choices','Display selectable sizes and colours on up to 12 product listings.',19000],
      ['fashion-product-pages','Individual product detail pages','Reusable product detail page with gallery, specifications and enquiry button.',23750],
    ]},
    { title:'Campaigns & conversion', description:'Make the December collection easier to shop.', items:[
      ['fashion-lookbook','Editorial lookbook','A styled campaign gallery with linked product cards.',19000],
      ['fashion-outfits','Shop-the-look bundles','Display curated outfit combinations and a combined WhatsApp enquiry.',33250],
      ['fashion-wishlist','Save favourites','Browser-based wishlist on the demo storefront, without user accounts.',23750],
      ['fashion-stock','Stock and preorder labels','Display availability, preorder and limited-edition labels from supplied data.',9500],
    ]},
  ],
  food: [
    {title:'Menu & portions',description:'Help customers order the right portions and combinations.',items:[
      ['food-categories','Menu categories & filters','Organise dishes into categories and add menu filters.',14250],
      ['food-portions','Portion and tray sizes','Show small, medium and large servings with their supplied prices.',14250],
      ['food-options','Meal customisation','Add up to five selectable options such as protein or spice level.',19000],
      ['food-allergens','Dietary and allergen labels','Display clearly supplied allergen and dietary information.',9500],
    ]},
    {title:'Ordering & events',description:'Make December preorders less stressful.',items:[
      ['food-preorder','Preorder date requests','Collect requested delivery or pickup dates without claiming live availability.',23750],
      ['food-delivery','Delivery area selector','Show delivery zones and quoted fees from your supplied price list.',19000],
      ['food-catering','Catering enquiry form','Capture guest count, event date, budget and catering requirements.',23750],
      ['food-cakes','Custom cake request form','Collect flavours, sizes, inscriptions and design references.',23750],
    ]},
  ],
  gifts: [
    {title:'Gift discovery',description:'Make every present feel considered.',items:[
      ['gifts-occasion','Shop by occasion','Browse birthdays, Christmas, corporate gifts and other occasions.',9500],
      ['gifts-tiers','Hamper size and tier options','Show entry, standard and premium versions with their own prices.',14250],
      ['gifts-wrapping','Wrapping and packaging choices','Display optional packaging finishes and corresponding price labels.',9500],
      ['gifts-gallery','Recipient inspiration gallery','A visual gift guide organised by recipient or budget.',14250],
    ]},
    {title:'Personalisation & bulk',description:'Make ordering special gifts easier.',items:[
      ['gifts-message','Gift note field','Collect a short personalised gift message in enquiries.',9500],
      ['gifts-build-box','Build-your-own hamper','Select items within defined categories and generate an itemised WhatsApp enquiry.',33250],
      ['gifts-recipient','Recipient & delivery details','Collect recipient name, delivery instructions and preferred date.',14250],
      ['gifts-corporate','Corporate bulk gifting form','Collect quantities, company details and a branded-gift enquiry.',23750],
    ]},
  ],
  beauty: [
    {title:'Services & portfolio',description:'Show the work and service details clients need.',items:[
      ['beauty-service-menu','Service menu with durations','Show service categories, duration estimates and prices.',14250],
      ['beauty-style-gallery','Before and after gallery','A curated beauty or hair results gallery.',14250],
      ['beauty-team','Stylist and artist profiles','Introduce up to four stylists and their specialities.',14250],
      ['beauty-care','Aftercare and prep guide','Service preparation instructions and aftercare details.',9500],
    ]},
    {title:'Enquiries & appointments',description:'Collect organised booking requests.',items:[
      ['beauty-appointment-request','Appointment request form','Collect preferred dates and times, with manual availability confirmation.',23750],
      ['beauty-bridal','Bridal and group booking enquiry','Collect event dates, group sizes and package requirements.',23750],
      ['beauty-consultation','Consultation questionnaire','Capture hair type, service goals and reference-photo links.',14250],
      ['beauty-packages','Service bundle comparison','Compare up to five packages, inclusions and prices.',19000],
    ]},
  ],
  events: [
    {title:'Showcase & packages',description:'Give potential clients a clear view of your work.',items:[
      ['events-categories','Portfolio by event type','Filter galleries by weddings, birthdays, corporate events and more.',14250],
      ['events-packages','Package comparison','Compare up to five event service packages side by side.',19000],
      ['events-testimonials','Client story and testimonial gallery','Feature provided reviews and event photographs.',14250],
      ['events-case-study','Detailed project case study','One structured project story with goals, delivery and photography.',23750],
    ]},
    {title:'Planning & enquiries',description:'Capture useful details before the first call.',items:[
      ['events-date','Event date enquiry','Collect preferred date and venue without a live booking guarantee.',19000],
      ['events-brief','Detailed event brief form','Collect guest count, service scope, budget and theme.',23750],
      ['events-extras','Event extras selector','Add optional service packages to one combined enquiry.',23750],
      ['events-estimate','Illustrative quote estimator','Show indicative package totals from a fixed approved price list.',33250],
    ]},
  ],
  accessories: [
    {title:'Shop & explore',description:'Bring attention to your products and details.',items:[
      ['accessories-categories','Category and collection filters','Filter bags, jewellery, watches and accessories by collection.',14250],
      ['accessories-variants','Product colour and finish options','Show available colours, material finishes or styles.',14250],
      ['accessories-detail','Product details and care page','Reusable product detail section with care instructions.',23750],
      ['accessories-stock','Availability indicators','Display supplied in-stock, sold-out and preorder labels.',9500],
    ]},
    {title:'Gifting & conversion',description:'Encourage meaningful combined orders.',items:[
      ['accessories-bundles','Accessory bundles','Present curated gift sets with a combined enquiry.',19000],
      ['accessories-engraving','Personalisation request','Collect engraving text or customisation notes.',14250],
      ['accessories-size','Ring and bracelet size guide','Provide an accurate guide using the merchant’s measurements.',9500],
      ['accessories-lookbook','Styled accessory editorial','Create a curated imagery section showing products in context.',19000],
    ]},
  ],
  hospitality: [
    {title:'Properties & discovery',description:'Make listings easier to compare.',items:[
      ['hospitality-amenities','Amenity filters','Filter listings by Wi-Fi, parking, kitchen and other listed amenities.',19000],
      ['hospitality-property-page','Detailed property page','Show gallery, amenities, check-in notes and house rules for each listing.',23750],
      ['hospitality-gallery','Room and property gallery','Dedicated gallery with up to 20 supplied property photos.',14250],
      ['hospitality-neighbourhood','Neighbourhood and directions','Add a location map, area highlights and directions.',14250],
    ]},
    {title:'Rates & enquiries',description:'Clarify rates before someone asks for availability.',items:[
      ['hospitality-rates','Nightly and weekly rate display','Show merchant-supplied rate periods and their prices.',14250],
      ['hospitality-request','Stay date enquiry','Collect preferred dates and guest numbers without real-time availability.',23750],
      ['hospitality-policies','House rules and policies','Show check-in, cancellation and property policies.',9500],
      ['hospitality-activities','Experiences and add-ons','Show optional stay extras and request information together.',19000],
    ]},
  ],
}

export const INDUSTRY_ADDONS = Object.entries(INDUSTRY_ADDON_GROUPS).flatMap(([industry, groups]) =>
  groups.flatMap(group => group.items.map(([id,name,description,price]) => ({
    id,name,description,price,industries:[industry],group:group.title,
    recommended:[industry],scope:'industry',
  })))
)

export function getIndustryGroups(industry) {
  return (INDUSTRY_ADDON_GROUPS[industry] || []).map(group=>({
    ...group,
    items:group.items.map(([id])=>INDUSTRY_ADDONS.find(x=>x.id===id)).filter(Boolean),
  }))
}
