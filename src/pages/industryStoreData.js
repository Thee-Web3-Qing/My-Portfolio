import { ACCESSORY_STYLES,ACCESSORY_WORLDS } from './accessoryWorldData.js'
// Temporary, illustrative photo catalogue for December website concepts.
// These are sample prices, services, properties and imagery, not live inventory.
const photo=(id,w=1400)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=85'
const beauty={
 hero:photo('photo-1560066984-138dadb4c035'),studio:photo('photo-1522335789203-aabd1fc54bc9'),
 makeup:photo('photo-1487412720507-e7ab37603c6f'),hair:photo('photo-1595476108010-b4d1f102b1b1'),
 nails:photo('photo-1604654894610-df63bc536371'),face:photo('photo-1570172619644-dfd03ed5d881'),
 portrait:photo('photo-1517841905240-472988babdf9'),style:photo('photo-1562322140-8baeececf3df'),
 spa:photo('photo-1512290923902-8a9f81dc236c'),brush:photo('photo-1526045478516-99145907023c'),
 lashes:photo('photo-1596704017254-9b121068fb31'),skin:photo('photo-1556228578-0d85b1a4d571')
}
const events={
 hero:photo('photo-1519167758481-83f550bb49b3'),gallery:photo('photo-1492684223066-81342ee5ff30'),
 wedding:photo('photo-1511795409834-ef04bbd61622'),table:photo('photo-1519225421980-715cb0215aed'),
 party:photo('photo-1530103862676-de8c9debad1d'),launch:photo('photo-1505236858219-8359eb29e329'),
 camera:photo('photo-1542038784456-1ea8e935640e'),flowers:photo('photo-1464366400600-7168b8af9bc3'),
 music:photo('photo-1470229722913-7c0e2dbbafd3'),portrait:photo('photo-1519741497674-611481863552'),
 dinner:photo('photo-1496337589254-7e19d01cec44'),venue:photo('photo-1469371670807-013ccf25f16a')
}
const accessories={
 hero:photo('photo-1548036328-c9fa89d128fa'),jewellery:photo('photo-1515562141207-7a88fb7ce338'),
 bag:photo('photo-1584917865442-de89df76afd3'),chain:photo('photo-1611652022419-a9419f74343d'),
 earrings:photo('photo-1630019852942-f89202989a59'),watch:photo('photo-1523275335684-37898b6baf30'),
 perfume:photo('photo-1541643600914-78b084683601'),sunglasses:photo('photo-1511499767150-a48a237f0083'),
 bracelet:photo('photo-1573408301185-9146fe634ad0'),clutch:photo('photo-1566150905458-1bf1fc113f0d'),
 leather:photo('photo-1600185365926-3a2ce3cdb9eb'),gold:photo('photo-1535632066927-ab7c9ab60908')
}
const hospitality={
 hero:photo('photo-1600607687939-ce8a6c25118c'),light:photo('photo-1600566753190-17f0baa2a6c3'),
 loft:photo('photo-1600585154340-be6161a56a0c'),lounge:photo('photo-1600607687920-4e2a09cf159d'),
 room:photo('photo-1600566752355-35792bedcfea'),pool:photo('photo-1613490493576-7fde63acd811'),
 house:photo('photo-1564013799919-ab600027ffc6'),coast:photo('photo-1600596542815-ffad4c1539a9'),
 suite:photo('photo-1600566753086-00f18fb6b3ea'),dining:photo('photo-1600607687644-c7171b42498f'),
 terrace:photo('photo-1613977257363-707ba9348227'),bath:photo('photo-1584622650111-993a426fbf0a')
}
const item=(id,title,category,price,image,description,rest={})=>({id,title,category,price,image,description,...rest})
export const storeData={
 beauty:{
  slug:'beauty',label:'Beauty & Hair',verb:'Book an appointment',hero:beauty.hero,secondary:beauty.studio,
  categories:['All','Hair','Makeup','Nails','Skin & Spa','Lashes'],photos:beauty,
  brands:{
   editorial:{name:'MUSE / ATELIER',eyebrow:'THE ART OF BEAUTY',strapline:'Make room for your most beautiful self.',heading:'Beauty without ordinary.',accent:'#d9ab85'},
   catalogue:{name:'GLOWROOM',eyebrow:'YOUR BEAUTY, YOUR RULES',strapline:'Good hair days and great skin starts here.',heading:'Your next glow is booked.',accent:'#f087ac'},
   minimal:{name:'SÉRÉNE',eyebrow:'SKIN. HAIR. STILLNESS.',strapline:'Thoughtfully done. Beautifully you.',heading:'A little more you.',accent:'#8f9278'}
  },
  items:[
   item('signature-install','The Signature Install','Hair',42000,beauty.hair,'A polished lace installation with careful finishing and a natural hairline.',{duration:120,badge:'MOST BOOKED'}),
   item('silk-press','Silk Press Ritual','Hair',28000,beauty.style,'Smooth, glossy movement with an intentional soft finish.',{duration:90}),
   item('soft-glam','Soft Glam Makeup','Makeup',35000,beauty.makeup,'A luminous beauty look tailored to your features and the occasion.',{duration:90,badge:'A FAVOURITE'}),
   item('bridal-glam','Bridal Glow','Makeup',95000,beauty.portrait,'A bespoke special-occasion makeup session with an extended consultation.',{duration:150}),
   item('sculpted-nails','The Sculpted Set','Nails',22000,beauty.nails,'Modern nail shapes and a refined colour story, finished to perfection.',{duration:90}),
   item('clean-manicure','Barely There Manicure','Nails',12000,beauty.brush,'Thoughtfully groomed nails, clean lines and a glossy finish.',{duration:45}),
   item('skin-reset','The Skin Reset','Skin & Spa',30000,beauty.face,'A soothing facial ritual with cleansing, hydration and a gentle finish.',{duration:75,badge:'RESET & RESTORE'}),
   item('calm-body','The Calm Hour','Skin & Spa',34000,beauty.spa,'A relaxed body-care session designed to give your week some space.',{duration:60}),
   item('lash-lift','The Lifted Lash','Lashes',24000,beauty.lashes,'Define and frame your lashes with a natural-looking lift.',{duration:60})
  ]
 },
 events:{
  slug:'events',label:'Events & Creatives',verb:'Enquire about a project',hero:events.hero,secondary:events.table,
  categories:['All','Weddings','Celebrations','Corporate','Production','Experiences'],photos:events,
  brands:{
   editorial:{name:'AFTER HOURS',eyebrow:'A CREATIVE EVENT STUDIO',strapline:'We make extraordinary nights happen.',heading:'Make it unforgettable.',accent:'#a7f46a'},
   catalogue:{name:'MOMENT CLUB',eyebrow:'BIG FEELINGS. GOOD PEOPLE.',strapline:'Ideas worth gathering for.',heading:'Your moment starts here.',accent:'#f47e48'},
   minimal:{name:'FORMA EVENTS',eyebrow:'DESIGNED TO BE REMEMBERED',strapline:'Beautiful experiences, made with intention.',heading:'Every detail matters.',accent:'#b38269'}
  },
  items:[
   item('wedding-story','The Wedding Story','Weddings',390000,events.wedding,'Wedding visual direction and coverage for your most meaningful day.',{duration:'Full-day',features:['Creative planning call','Moodboard','Photography direction'],badge:'SIGNATURE'}),
   item('modern-tablescape','Modern Tablescape','Weddings',250000,events.table,'An artful dinner setting for an intimate and memorable celebration.',{duration:'Event-day',features:['Concept design','Tablescape','Set styling']}),
   item('birthday-concept','Birthday, Reimagined','Celebrations',180000,events.party,'A bold celebration concept with considered styling and personality.',{duration:'Event-day',features:['Theme design','Styling','Setup direction'],badge:'MOST LOVED'}),
   item('intimate-soirée','Intimate Soirée','Celebrations',135000,events.dinner,'Creative direction for a private dinner and a beautiful night in.',{duration:'Evening',features:['Moodboard','Dining styling','Guest experience']}),
   item('brand-launch','The Launch Edit','Corporate',325000,events.launch,'A launch experience designed around the story of your brand.',{duration:'Event-day',features:['Creative concept','Run-of-show','Branded styling']}),
   item('company-mixer','Team Social','Corporate',210000,events.gallery,'An easy, memorable gathering that brings your people together.',{duration:'Half-day',features:['Concept','Music direction','Experience design']}),
   item('portrait-session','Editorial Portraits','Production',95000,events.camera,'Distinct, art-directed portraits for your portfolio or brand.',{duration:'2 hours',features:['Creative brief','Art direction','Photo session']}),
   item('film-content','The Content Day','Production',160000,events.portrait,'A focussed content shoot planned around one clear creative concept.',{duration:'Half-day',features:['Shoot plan','Art direction','Content capture']}),
   item('immersive-night','After Dark Experience','Experiences',275000,events.music,'A concept-led evening of music, lighting and memorable moments.',{duration:'Evening',features:['Lighting concept','Music brief','Guest flow']})
  ]
 },
 accessories:{
  slug:'accessories',label:'Accessories & Lifestyle',verb:'Shop accessories',hero:accessories.hero,secondary:accessories.jewellery,
  categories:['All','Bags','Jewellery','Timepieces','Fragrance','Eyewear'],photos:accessories,
  brands:{
   editorial:{name:'FORM & FOUND',eyebrow:'OBJECTS WITH ATTITUDE',strapline:'The finishing touch is everything.',heading:'The art of the detail.',accent:'#f68e55'},
   catalogue:{name:'THE LITTLE OBJECTS',eyebrow:'VERY GOOD THINGS',strapline:'Little pieces with big personality.',heading:'Everything but ordinary.',accent:'#e67aa1'},
   minimal:{name:'OBJECTS / 09',eyebrow:'COLLECTED, NOT COMPROMISED',strapline:'Good objects. Good taste. Always.',heading:'Less, but better.',accent:'#a08c74'}
  },
  items:[
   item('city-tote','The City Tote','Bags',54000,accessories.hero,'A contemporary shoulder bag with room for the everyday essentials.',{colors:['Espresso','Black','Oat'],badge:'BESTSELLER'}),
   item('soft-shoulder','Soft Structure Bag','Bags',62000,accessories.bag,'A slouchy, sculptural bag for days that turn into nights.',{colors:['Taupe','Black','Cream']}),
   item('luna-chain','Luna Chain','Jewellery',29500,accessories.chain,'A delicate gold-tone necklace that layers beautifully.',{colors:['Gold','Silver'],badge:'THE EDIT'}),
   item('orbit-earrings','Orbit Earrings','Jewellery',18500,accessories.earrings,'A sculptural pair that catches the light without asking.',{colors:['Gold','Silver']}),
   item('fine-bracelet','The Fine Bracelet','Jewellery',23500,accessories.bracelet,'An everyday finishing touch with a clean, delicate profile.',{colors:['Gold','Silver']}),
   item('weekend-watch','The Weekend Watch','Timepieces',78000,accessories.watch,'An everyday timepiece with a warm modern finish.',{colors:['Silver','Champagne']}),
   item('noir-fragrance','Noir Eau de Parfum','Fragrance',48500,accessories.perfume,'An intimate signature scent with a warm, lasting impression.',{colors:['Original']}),
   item('after-sun','After Sun Frames','Eyewear',32500,accessories.sunglasses,'Statement sunglasses that go with practically everything.',{colors:['Black','Tortoise']}),
   item('evening-clutch','After Hours Clutch','Bags',42500,accessories.clutch,'The easy choice for a night worth dressing up for.',{colors:['Black','Chocolate','Cream']})
  ]
 },
 hospitality:{
  slug:'hospitality',label:'Short-lets & Experiences',verb:'Explore stays',hero:hospitality.hero,secondary:hospitality.pool,
  categories:['All','Apartments','Suites','Villas','Experiences'],photos:hospitality,
  brands:{
   editorial:{name:'SUNDAY HOUSE',eyebrow:'SOMEWHERE TO DISAPPEAR TO',strapline:'Find a slower kind of weekend.',heading:'Stay a little longer.',accent:'#e1c38f'},
   catalogue:{name:'NEST CLUB',eyebrow:'GOOD STAYS, GREAT STORIES',strapline:'Your next favourite place is waiting.',heading:'Find your happy place.',accent:'#eeb65b'},
   minimal:{name:'ATELIER STAYS',eyebrow:'ROOM TO BREATHE',strapline:'Spaces for living beautifully, even briefly.',heading:'Somewhere that feels right.',accent:'#9ba79c'}
  },
  items:[
   item('the-studio','The Studio','Apartments',65000,hospitality.light,'A bright, thoughtfully designed city studio for work and weekends.',{guests:2,beds:1,baths:1,area:'Lekki Phase 1',amenities:['Wi-Fi','Kitchenette','Air conditioning'],badge:'CITY FAVOURITE'}),
   item('the-city-suite','The City Suite','Suites',105000,hospitality.suite,'A beautifully layered one-bedroom stay with space to unwind.',{guests:2,beds:1,baths:1,area:'Victoria Island',amenities:['Wi-Fi','Balcony','Smart TV']}),
   item('the-residence','The Residence','Apartments',145000,hospitality.lounge,'An airy two-bedroom apartment built around easy living.',{guests:4,beds:2,baths:2,area:'Ikoyi',amenities:['Full kitchen','Wi-Fi','Workspace'],badge:'GUEST PICK'}),
   item('the-pool-house','The Pool House','Villas',255000,hospitality.pool,'A private villa setting with a pool and space to gather.',{guests:6,beds:3,baths:3,area:'Lekki',amenities:['Private pool','Parking','Outdoor dining']}),
   item('the-terrace','The Terrace','Apartments',125000,hospitality.terrace,'A calm elevated space for slow mornings and city evenings.',{guests:4,beds:2,baths:2,area:'Victoria Island',amenities:['Terrace','Kitchen','Wi-Fi']}),
   item('weekend-house','The Weekend House','Villas',310000,hospitality.house,'An expansive home made for family, friends and a full weekend.',{guests:8,beds:4,baths:3,area:'Lekki',amenities:['Garden','Parking','Kitchen']}),
   item('the-slow-suite','The Slow Suite','Suites',88000,hospitality.room,'Soft textures, quiet corners and a little luxury of your own.',{guests:2,beds:1,baths:1,area:'Ikoyi',amenities:['Wi-Fi','Air conditioning','Workspace']}),
   item('the-coastal-villa','The Coastal Villa','Villas',285000,hospitality.coast,'A generous getaway shaped by warmth and open spaces.',{guests:6,beds:3,baths:3,area:'Lekki',amenities:['Pool access','Parking','Garden']}),
   item('city-escape','The City Escape','Experiences',45000,hospitality.dining,'An intimate curated dining or relaxation experience.',{guests:2,beds:0,baths:0,area:'Victoria Island',amenities:['Experience host','Curated setting','Private booking']})
  ]
 }
}
export const styles=['editorial','catalogue','minimal']
export const money=n=>'₦'+Number(n||0).toLocaleString('en-NG')
export const getItem=(store,id)=>store.items.find(p=>p.id===id)
export const getBrand=(store,style)=>store.slug==='accessories'?(ACCESSORY_WORLDS[style]||store.brands.editorial):(store.brands[style]||store.brands.editorial)
export const getRoot=(slug,style)=>'/'+slug+style
export const allPaths=Object.entries(storeData).flatMap(([slug,store])=>(slug==='accessories'?ACCESSORY_STYLES:styles).flatMap(style=>{
 const root=getRoot(slug,style)
 const subpages=['explore','about','contact','faq','saved',...(slug==='beauty'?['book']:slug==='events'?['plan']:slug==='accessories'?['cart','style-kit']:['search','enquire'])]
 return [root,...[...new Set(subpages)].map(page=>root+'/'+page),...(slug==='accessories'?ACCESSORY_WORLDS[style].items:store.items).map(p=>root+'/item/'+p.id)]
}))
