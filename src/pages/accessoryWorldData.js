// Distinct accessory storefront prototypes inspired by six supplied visual
// references. Demo products and temporary photographs are illustrative.
// Every style has its own assortment, never a shared mismatched catalogue.
const art=(name)=>'/december-art/'+name+'.webp'
const photo=(id,w=1200)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=85'
const p=(id,title,category,price,image,description,colors=['Original'],badge)=>({
  id,title,category,price,image,description,colors,...(badge?{badge}:{})
})
export const ACCESSORY_STYLES=['editorial','tech','catalogue','playful','market','minimal']
export const ACCESSORY_WORLDS={
 editorial:{
  name:'OSSIA',eyebrow:'HAND-SCULPTED EYEWEAR',heading:'Objects for the face.',
  strapline:'Rimless silhouettes. Engineered metal. Built in limited numbers.',
  categories:['All','Rimless','Metal','Sunglasses'],
  images:{hero:art('ossia-profile'),detail:art('orbit'),portrait:art('ossia-macro'),studio:art('ossia-studio'),craft:art('ossia-studio')},
  items:[
   p('orbit','ORBIT','Rimless',32000,art('orbit'),'Minimal rimless frames with sculpted metallic accents.',['Polished silver','Black'],'NEW DROP'),
   p('relic','RELIC','Metal',38000,art('relic'),'Fine sculptural temple details and a considered silhouette.',['Silver','Oxidised steel']),
   p('veil','VEIL','Sunglasses',34000,art('veil'),'Smoke lenses set in a fine industrial frame.',['Smoke','Wine']),
   p('frame-04','FRAME 04','Metal',36000,art('frame-04'),'Black titanium geometry with lightweight comfort.',['Black titanium','Silver']),
   p('halo','HALO','Rimless',39000,art('halo'),'Soft gold metal with a luminous curved profile.',['Pale gold','Black']),
   p('static','STATIC','Rimless',30000,art('static'),'A transparent modern silhouette shaped for everyday wear.',['Clear acetate','Graphite'])
  ]
 },
 tech:{
  name:'VYRA',eyebrow:'HUMAN TECH / IN FOCUS',heading:'A smarter look at tomorrow.',
  strapline:'AI glasses for a more connected, open world.',
  categories:['All','Smart frames','Accessories'],
  images:{hero:art('vyra-campaign'),portrait:art('vyra-campaign'),detail:art('vyra-amber'),community:art('vyra-community')},
  items:[
   p('vyra-amber','VYRA ONE','Smart frames',49900,art('vyra-amber'),'Classic Amber. A connected frame concept with built-in AI assistance.',['Classic Amber']),
   p('vyra-smoke','VYRA ONE / SMOKE','Smart frames',49900,art('vyra-smoke'),'A dark smoke finish for a quieter statement.',['Smoke']),
   p('vyra-clear','VYRA ONE / CLEAR','Smart frames',49900,art('vyra-clear'),'Clear architectural lenses for an open view.',['Clear']),
   p('vyra-case','VYRA CASE','Accessories',8500,photo('photo-1548036328-c9fa89d128fa'),'Compact protective carrying case for everyday travel.',['Black'])
  ]
 },
 catalogue:{
  name:'AERO STEP',eyebrow:'MOVE AHEAD',heading:'Built for movement.',
  strapline:'Comfort in every stride. Designed for your city.',
  categories:['All','Running','Basketball','Training','Lifestyle'],
  images:{hero:art('aero-campaign'),run:photo('photo-1538805060514-97d9cc17730c'),basket:photo('photo-1519861531473-9200262188bf'),train:photo('photo-1571019614242-c5c5dee9f50b'),city:photo('photo-1529139574466-a303027c1d8b')},
  items:[
   p('vortex','VORTEX 3','Running',12900,art('vortex'),'Daily running comfort with a responsive lightweight sole.',['Stone','Onyx'],'BESTSELLER'),
   p('pulse-pro','PULSE PRO','Running',15400,art('pulse-pro'),'Quick transitions and an easy everyday fit.',['Black','Cloud']),
   p('flow','FIT FLOW','Training',13900,art('flow'),'Versatile trainers for studio workouts and city movement.',['White','Silver'],'NEW'),
   p('court-high','COURT HIGH','Basketball',11900,art('court-high'),'A modern court high-top with confident lines.',['Black','Ivory']),
   p('trainer-x','TRAINER X1','Lifestyle',12400,art('trainer-x'),'A clean everyday trainer with cushioned support.',['Ivory','Olive']),
   p('pace','PACE LOW','Lifestyle',10800,photo('photo-1519741497674-611481863552'),'A simple low profile for everything after the workout.',['Off-white','Black'])
  ]
 },
 playful:{
  name:'HUSH',eyebrow:'OBJECTS WITH PERSONALITY',heading:'Your choice. Your story.',
  strapline:'Beautifully unconventional pieces for carrying your world.',
  categories:['All','Handbags','Mini bags','Metallic'],
  images:{hero:art('hush-campaign'),chrome:art('hush-campaign'),still:photo('photo-1566150905458-1bf1fc113f0d'),art:photo('photo-1513364776144-60967b0f800f'),pink:photo('photo-1553062407-98eeb64c6a62')},
  items:[
   p('sabrina','SABRINA','Metallic',22000,art('hush-campaign'),'Soft chrome and a futuristic sculpted silhouette.',['Silver','Black'],'ECO EDIT'),
   p('brielle','BRIELLE','Handbags',20000,photo('photo-1566150905458-1bf1fc113f0d'),'A tactile modern day bag with raised detailing.',['White','Blush']),
   p('naomi','NAOMI','Mini bags',23500,photo('photo-1548036328-c9fa89d128fa'),'A compact pink statement piece with rounded construction.',['Pink','Cream']),
   p('muse','MUSE','Handbags',26500,photo('photo-1566150905458-1bf1fc113f0d'),'A soft sculptural companion for unexpected days.',['Rose','Silver']),
   p('mini-sculpt','MINI SCULPT','Mini bags',19000,photo('photo-1584917865442-de89df76afd3'),'Unexpected curves and a clean custom finish.',['Chrome','Blush']),
   p('bubble','BUBBLE','Handbags',25000,photo('photo-1548036328-c9fa89d128fa'),'A playful silhouette you will want to take everywhere.',['Pink','White'])
  ]
 },
 market:{
  name:'NOVA FINDS',eyebrow:'MODERN GENERAL STORE',heading:'Everyday essentials.',
  strapline:'Curated finds in tech, fashion, home and everyday living.',
  categories:['All','Electronics','Fashion','Home & Living','Beauty & Care','Footwear','Accessories','Sports','Office & Stationery'],
  images:{hero:art('nova-campaign'),electronics:art('nova-audio'),fashion:photo('photo-1591047139829-d91aecb6caea'),home:photo('photo-1507473885765-e6ed057f782c'),beauty:photo('photo-1556228578-0d85b1a4d571'),footwear:art('nova-sneaker'),eyewear:photo('photo-1511499767150-a48a237f0083'),sport:photo('photo-1517836357463-d25dfeac3438'),office:photo('photo-1455390582262-044cdead277a')},
  items:[
   p('urban-pack','URBAN COMMUTER BACKPACK','Accessories',7900,art('nova-pack'),'Organised everyday carry for work and travel.',['Navy','Black'],'NEW'),
   p('nova-wireless','NOVA WIRELESS HEADPHONES','Electronics',12900,art('nova-audio'),'Comfortable over-ear sound with an everyday profile.',['Black','Sand']),
   p('polarised','POLARISED SUNGLASSES','Accessories',4900,photo('photo-1511499767150-a48a237f0083'),'Classic shades for sun-soaked days.',['Tortoise','Black']),
   p('lifestyle-sneaker','CLASSIC LIFESTYLE SNEAKER','Footwear',8900,art('nova-sneaker'),'Everyday comfort with a clean contrast sole.',['White','Navy']),
   p('serum','REVITALISING FACE SERUM','Beauty & Care',2400,photo('photo-1556228578-0d85b1a4d571'),'A fresh daily ritual for healthy-looking skin.',['30ml']),
   p('modern-lamp','MODERN DESK LAMP','Home & Living',17900,photo('photo-1507473885765-e6ed057f782c'),'A warm accent for home and workspace.',['Copper','Stone']),
   p('field-jacket','FIELD JACKET','Fashion',15900,photo('photo-1591047139829-d91aecb6caea'),'Everyday layers with clean lines.',['Oat','Black']),
   p('training-kit','TRAINING KIT','Sports',11500,photo('photo-1517836357463-d25dfeac3438'),'Make every session count with essentials built to last.',['Black']),
   p('desk-notebook','DESK NOTEBOOK','Office & Stationery',3900,photo('photo-1455390582262-044cdead277a'),'An everyday notebook for good ideas and thoughtful plans.',['Navy','Paper'])
  ]
 },
 minimal:{
  name:'Veloura',eyebrow:'TIMELESS FINE JEWELLERY',heading:'From classic to contemporary.',
  strapline:'A thoughtful selection of exquisite everyday jewellery.',
  categories:['All','Rings','Earrings','Bracelets','Necklaces'],
  images:{ hands:art('veloura-hands'), wrist:art('veloura-wrist'), hero:art('veloura-necklace'),model:art('veloura-portrait'),skin:art('veloura-earring'),still:art('laura-bracelet'),box:art('veloura-box'),story:art('veloura-lapels')},
  items:[
   p('queen-ring','QUEEN RING','Rings',66000,art('queen-ring'),'A refined gold ring with a sparkling centre stone.',['Yellow gold','White gold']),
   p('laura-bracelet','LAURA BRACELET','Bracelets',25000,art('laura-bracelet'),'A confident modern link bracelet.',['Gold']),
   p('diamond-necklace','DIAMOND NECKLACE','Necklaces',39900,art('diamond-necklace'),'A delicate everyday pendant with a luminous sparkle.',['Gold','Silver']),
   p('yuna-bracelet','YUNA BRACELET','Bracelets',22000,photo('photo-1611652022419-a9419f74343d'),'A beautifully considered minimal chain.',['Gold']),
   p('occa-earrings','OCCA EARRINGS','Earrings',18000,art('occa-earrings'),'Simple gold hoops with elegant volume.',['Gold','Silver']),
   p('tender-set','TENDER SET','Necklaces',45000,photo('photo-1515562141207-7a88fb7ce338'),'A matching intimate edit for special days.',['Gold'])
  ]
 }
}
export const accessoryWorld=(style)=>ACCESSORY_WORLDS[style]||ACCESSORY_WORLDS.editorial
export const accessoryStore=(base,style)=>{
 const world=accessoryWorld(style)
 return {...base,items:world.items,categories:world.categories,images:world.images,hero:world.images.hero,
    secondary:world.images.still||world.images.portrait||world.images.model||world.images.hero,
    photos:world.images,brands:{...base.brands,[style]:world}}
}
