// Five individually art-directed stay and experience website demos.
// Properties, rates and photographs are illustrative, not live inventory.
const art=(name)=>'/december-art/'+name+'.webp'
const photo=(id,w=1600)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=85'
const item=(id,title,category,price,image,description,area,guests=2,beds=1,baths=1,amenities=[],badge='')=>({id,title,category,price,image,description,area,guests,beds,baths,amenities,...(badge?{badge}:{})})
export const STAY_STYLES=['editorial','catalogue','adventure','minimal','architect']
export const STAY_WORLDS={
 editorial:{
  name:'ORIZON',eyebrow:'DESIGN LED PROPERTIES',heading:'New way of living.',
  strapline:'Extraordinary spaces. A new point of view.',accent:'#b7cbed',
  categories:['All','Villas','Apartments','Suites'],
  images:{
   background:art('orizon-mountains'),
   hero:art('orizon-campaign'),
   villa:art('orizon-campaign'),
   studio:photo('photo-1600607687939-ce8a6c25118c'),
   panorama:photo('photo-1600585154340-be6161a56a0c'),
   detail:photo('photo-1600566753190-17f0baa2a6c3')
  },
  items:[
   item('lunar-oasis','Lunar Oasis Villa','Villas',285000,art('orizon-campaign'),'A sculptural private villa that blurs the boundary between architecture and landscape.','Scottsdale',6,3,3,['Private pool','Panoramic views','Private parking'],'FEATURED'),
   item('desert-horizon','Desert Horizon House','Villas',245000,photo('photo-1600585154340-be6161a56a0c'),'Sky-facing glass walls and a secluded terrace for long, quiet weekends.','Sedona',4,2,2,['View terrace','Full kitchen','Wi-Fi']),
   item('solstice-suite','Solstice Sky Suite','Suites',135000,photo('photo-1600566753086-00f18fb6b3ea'),'A sunrise-ready suite with graceful curved interiors and warm light.','Phoenix',2,1,1,['Balcony','Wi-Fi','Workspace']),
   item('the-glasshouse','The Glasshouse','Villas',310000,photo('photo-1600596542815-ffad4c1539a9'),'A glass pavilion within a peaceful landscaped estate.','Paradise Valley',8,4,3,['Garden','Pool','Dining terrace']),
   item('copper-studio','Copper Studio','Apartments',79000,photo('photo-1600566753190-17f0baa2a6c3'),'A compact design stay with contemporary finishes and city access.','Phoenix',2,1,1,['Air conditioning','Fast Wi-Fi']),
   item('moonlight-loft','Moonlight Loft','Apartments',119000,photo('photo-1600607687939-ce8a6c25118c'),'Open-plan living and carefully considered evening light.','Scottsdale',3,1,1,['Kitchen','Smart TV','Outdoor seating'])
  ]
 },
 catalogue:{
  name:'VISA TRAVELS',eyebrow:'TRAVEL WITH INTENTION',heading:'Going places.',
  strapline:'Curated journeys, new friends and beautifully chosen retreats.',accent:'#c89c72',
  categories:['All','Retreats','Experiences','Villas','Tours'],
  images:{
   background:photo('photo-1464822759023-fed622ff2c3b'),
   hero:art('visa-campaign'),
   hillside:photo('photo-1500534623283-312aade485b7'),
   yurt:photo('photo-1528360983277-13d401cdc186'),
   mountains:photo('photo-1464822759023-fed622ff2c3b'),
   coast:photo('photo-1507525428034-b723cf961d3e'),
   companion:photo('photo-1500530855697-b586d89ba3ee')
  },
  items:[
   item('alpine-retreat','Alpine Valley Escape','Retreats',178000,art('visa-campaign'),'An unhurried mountain stay with guided sunrise walks and evenings under the stars.','Kazakhstan',2,1,1,['Guided walks','Private transfer','Breakfast'],'MOST LOVED'),
   item('bali-culture','Ubud Culture Weekend','Tours',125000,photo('photo-1537996194471-e657df975ab4'),'Local guides, rice terraces and the little places worth slowing down for.','Bali',2,0,0,['Local guide','Curated route','Meals']),
   item('savana-camp','Savana Sky Camp','Retreats',145000,photo('photo-1528360983277-13d401cdc186'),'A design-forward overnight camp in the open landscape.','Sumba',4,2,1,['Camp host','Meals','Nature trail']),
   item('coastal-reset','The Coastal Reset','Experiences',86000,photo('photo-1507525428034-b723cf961d3e'),'Salt air, an easy itinerary and time to do absolutely nothing.','Bali',2,0,0,['Coastal guide','Sunset experience']),
   item('summit-path','Summit Path','Tours',163000,photo('photo-1464822759023-fed622ff2c3b'),'A guided mountain route with picture-perfect moments on the way.','Kazakhstan',6,0,0,['Guide','Transfers','Route briefing']),
   item('hidden-villa','Hidden Grove Villa','Villas',235000,photo('photo-1613490493576-7fde63acd811'),'A private green retreat surrounded by calm.','Bali',6,3,3,['Pool','Full kitchen','Garden'])
  ]
 },
 adventure:{
  name:'NEPALICA',eyebrow:'NEPAL WITHOUT LIMITS',heading:'Discover beyond the ordinary.',
  strapline:'Personal journeys through mountain light, people and place.',accent:'#377cb6',
  categories:['All','Trekking','Cultural','Retreats','Experiences'],
  images:{
   hero:art('nepal-campaign'),
   summit:photo('photo-1500534623283-312aade485b7'),
   trail:art('nepal-trail'),
   lake:art('nepal-lake'),
   village:art('nepal-temple'),
   clouds:photo('photo-1486870591958-9b9d0d1dda99'),
   hiker:art('nepal-trail')
  },
  items:[
   item('everest-evermore','Everest Evermore','Trekking',255000,art('nepal-campaign'),'A guided mountain experience shaped around famous high-altitude views.','Everest Region',6,0,0,['Trail guide','Route support','Transfer'],'MOST POPULAR'),
   item('annapurna-trail','Annapurna Trail','Trekking',198000,art('nepal-trail'),'A beautiful route through terraced hills and mountain villages.','Annapurna',4,0,0,['Guide','Trail itinerary','Local transfers']),
   item('pokhara-retreat','Pokhara Retreat','Retreats',139000,art('nepal-lake'),'A slow lakeside escape framed by distant peaks.','Pokhara',2,1,1,['Lakeside stay','Breakfast','Nature walk']),
   item('kathmandu-soul','Kathmandu Soul','Cultural',109000,art('nepal-temple'),'A thoughtfully planned day of living heritage and local stories.','Kathmandu',4,0,0,['Local guide','Cultural visits','Transfers']),
   item('himalaya-escape','Himalayan Escape','Experiences',158000,photo('photo-1486870591958-9b9d0d1dda99'),'Mountain air, gentle adventure and memorable days in nature.','Himalayas',6,0,0,['Local guide','Transport','Equipment briefing']),
   item('misty-mornings','Misty Mornings','Retreats',129000,photo('photo-1470770841072-f978cf4d019e'),'Scenic mornings and calm evenings at a mountain lodge.','Nagarkot',2,1,1,['Lodge stay','Breakfast','Mountain views'])
  ]
 },
 minimal:{
  name:'PIGMA',eyebrow:'RESPONSIBLE LUXURY',heading:'Sustainable luxury in Thailand.',
  strapline:'Beautiful residences, designed with the natural world in mind.',accent:'#576844',
  categories:['All','Villas','Apartments','Suites'],
  images:{
   hero:art('pigma-campaign'),
   forest:art('pigma-pool'),
   coast:art('pigma-campaign'),
   villa:art('pigma-pool'),
   suite:art('pigma-interior'),
   room:art('pigma-interior'),
   leaves:photo('photo-1441974231531-c6227db76b6e')
  },
  items:[
   item('pigma-coastal','Coastal Canopy Villa','Villas',275000,art('pigma-campaign'),'A layered, open-air villa wrapped in lush tropical planting.','Phuket',6,3,3,['Pool','Open-air living','Garden'],'OCEAN EDIT'),
   item('pigma-grove','The Green Grove','Villas',245000,art('pigma-pool'),'A private residence arranged around shade, light and indoor-outdoor living.','Koh Samui',4,2,2,['Garden','Wi-Fi','Solar-ready design']),
   item('pigma-courtyard','Courtyard House','Villas',285000,photo('photo-1564013799919-ab600027ffc6'),'An intimate tropical hideaway opening toward a central courtyard.','Phuket',6,3,2,['Courtyard','Pool','Parking']),
   item('pigma-suite','The Banyan Suite','Suites',110000,art('pigma-interior'),'A soft-toned residence with considered materials and calm interiors.','Chiang Mai',2,1,1,['Wi-Fi','Workspace','Balcony']),
   item('pigma-pavilion','Glass Pavilion','Villas',310000,photo('photo-1600596542815-ffad4c1539a9'),'A serene escape with uninterrupted landscape views.','Koh Samui',8,4,3,['Pool','Terrace','Chef kitchen']),
   item('pigma-loft','Palm Loft','Apartments',86000,photo('photo-1600607687939-ce8a6c25118c'),'Natural textures, filtered daylight and a beautiful sense of quiet.','Phuket',2,1,1,['Balcony','Full kitchen','Wi-Fi'])
  ]
 },
 architect:{
  name:'APEX ARC',eyebrow:'SPACES TO EXPERIENCE',heading:'Spaces that inspire.',
  strapline:'Exceptional design-led stays and architectural experiences.',accent:'#35383a',
  categories:['All','Villas','Apartments','Suites','Experiences'],
  images:{
   hero:art('apex-campaign'),
   architecture:art('apex-campaign'),
   interior:photo('photo-1600566753086-00f18fb6b3ea'),
   garden:photo('photo-1600607687939-ce8a6c25118c'),
   office:photo('photo-1600607687644-c7171b42498f'),
   dining:photo('photo-1600566753190-17f0baa2a6c3'),
   room:photo('photo-1600566752355-35792bedcfea'),
   pool:photo('photo-1613490493576-7fde63acd811')
  },
  items:[
   item('arc-forest','Forest Pavilion','Villas',275000,art('apex-forest'),'A striking black-clad residence nested into a private landscape.','Lekki',6,3,3,['Pool','Garden','Wi-Fi'],'SIGNATURE'),
   item('arc-light','Light House','Villas',295000,art('apex-campaign'),'An architectural residence composed around shadow and light.','Ikoyi',6,3,3,['Garden','Parking','Kitchen']),
   item('arc-courtyard','Courtyard Apartment','Apartments',135000,photo('photo-1600607687939-ce8a6c25118c'),'A refined and restful open-plan home for a weekend away.','Victoria Island',4,2,2,['Kitchen','Fast Wi-Fi','Balcony']),
   item('arc-studio','Design Studio','Apartments',85000,photo('photo-1600566753190-17f0baa2a6c3'),'A quietly detailed space made for work and retreat.','Lekki',2,1,1,['Workspace','Wi-Fi','Air conditioning']),
   item('arc-suite','Gallery Suite','Suites',115000,photo('photo-1600566753086-00f18fb6b3ea'),'Soft materials and an elegant city outlook.','Ikoyi',2,1,1,['Balcony','City view','Wi-Fi']),
   item('arc-supper','The Long Table','Experiences',68000,photo('photo-1600607687644-c7171b42498f'),'A private design-led dining experience for small groups.','Victoria Island',6,0,0,['Curated dinner','Private setting','Host'])
  ]
 }
}
export const stayWorld=style=>STAY_WORLDS[style]||STAY_WORLDS.editorial
export const stayStore=(base,style)=>{
 const world=stayWorld(style)
 return {...base,items:world.items,categories:world.categories,hero:world.images.hero,
    secondary:world.images.pool||world.images.villa||world.images.architecture||world.images.trail||world.images.hero,
    photos:world.images,brands:{...base.brands,[style]:world}}
}
