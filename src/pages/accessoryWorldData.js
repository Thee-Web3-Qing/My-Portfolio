// Distinct accessory storefront prototypes inspired by six supplied visual
// references. Demo products and temporary photographs are illustrative.
// Every style has its own assortment, never a shared mismatched catalogue.
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
  images:{hero:photo('photo-1577803645773-f96470509666'),detail:photo('photo-1511499767150-a48a237f0083'),portrait:photo('photo-1572635196237-14b3f281503f'),studio:photo('photo-1560250097-0b93528c311a'),craft:photo('photo-1503341455253-b2e723bb3dbb')},
  items:[
   p('orbit','ORBIT','Rimless',32000,photo('photo-1511499767150-a48a237f0083'),'Minimal rimless frames with sculpted metallic accents.',['Polished silver','Black'],'NEW DROP'),
   p('relic','RELIC','Metal',38000,photo('photo-1577803645773-f96470509666'),'Fine sculptural temple details and a considered silhouette.',['Silver','Oxidised steel']),
   p('veil','VEIL','Sunglasses',34000,photo('photo-1572635196237-14b3f281503f'),'Smoke lenses set in a fine industrial frame.',['Smoke','Wine']),
   p('frame-04','FRAME 04','Metal',36000,photo('photo-1508296695146-257a814070b4'),'Black titanium geometry with lightweight comfort.',['Black titanium','Silver']),
   p('halo','HALO','Rimless',39000,photo('photo-1473496169904-658ba7c44d8a'),'Soft gold metal with a luminous curved profile.',['Pale gold','Black']),
   p('static','STATIC','Rimless',30000,photo('photo-1511499767150-a48a237f0083'),'A transparent modern silhouette shaped for everyday wear.',['Clear acetate','Graphite'])
  ]
 },
 tech:{
  name:'VYRA',eyebrow:'HUMAN TECH / IN FOCUS',heading:'A smarter look at tomorrow.',
  strapline:'AI glasses for a more connected, open world.',
  categories:['All','Smart frames','Accessories'],
  images:{hero:photo('photo-1511499767150-a48a237f0083'),portrait:photo('photo-1517841905240-472988babdf9'),detail:photo('photo-1572635196237-14b3f281503f'),community:photo('photo-1506794778202-cad84cf45f1d')},
  items:[
   p('vyra-amber','VYRA ONE','Smart frames',49900,photo('photo-1511499767150-a48a237f0083'),'Classic Amber. A connected frame concept with built-in AI assistance.',['Classic Amber']),
   p('vyra-smoke','VYRA ONE / SMOKE','Smart frames',49900,photo('photo-1572635196237-14b3f281503f'),'A dark smoke finish for a quieter statement.',['Smoke']),
   p('vyra-clear','VYRA ONE / CLEAR','Smart frames',49900,photo('photo-1577803645773-f96470509666'),'Clear architectural lenses for an open view.',['Clear']),
   p('vyra-case','VYRA CASE','Accessories',8500,photo('photo-1548036328-c9fa89d128fa'),'Compact protective carrying case for everyday travel.',['Black'])
  ]
 },
 catalogue:{
  name:'AERO STEP',eyebrow:'MOVE AHEAD',heading:'Built for movement.',
  strapline:'Comfort in every stride. Designed for your city.',
  categories:['All','Running','Basketball','Training','Lifestyle'],
  images:{hero:photo('photo-1556906781-9a412961c28c'),run:photo('photo-1538805060514-97d9cc17730c'),basket:photo('photo-1519861531473-9200262188bf'),train:photo('photo-1571019614242-c5c5dee9f50b'),city:photo('photo-1529139574466-a303027c1d8b')},
  items:[
   p('vortex','VORTEX 3','Running',12900,photo('photo-1542291026-7eec264c27ff'),'Daily running comfort with a responsive lightweight sole.',['Stone','Onyx'],'BESTSELLER'),
   p('pulse-pro','PULSE PRO','Running',15400,photo('photo-1525966222134-fcfa99b8ae77'),'Quick transitions and an easy everyday fit.',['Black','Cloud']),
   p('flow','FIT FLOW','Training',13900,photo('photo-1600185365926-3a2ce3cdb9eb'),'Versatile trainers for studio workouts and city movement.',['White','Silver'],'NEW'),
   p('court-high','COURT HIGH','Basketball',11900,photo('photo-1549298916-b41d501d3772'),'A modern court high-top with confident lines.',['Black','Ivory']),
   p('trainer-x','TRAINER X1','Lifestyle',12400,photo('photo-1543163521-1bf539c55dd2'),'A clean everyday trainer with cushioned support.',['Ivory','Olive']),
   p('pace','PACE LOW','Lifestyle',10800,photo('photo-1519741497674-611481863552'),'A simple low profile for everything after the workout.',['Off-white','Black'])
  ]
 },
 playful:{
  name:'HUSH',eyebrow:'OBJECTS WITH PERSONALITY',heading:'Your choice. Your story.',
  strapline:'Beautifully unconventional pieces for carrying your world.',
  categories:['All','Handbags','Mini bags','Metallic'],
  images:{hero:photo('photo-1548036328-c9fa89d128fa'),chrome:photo('photo-1584917865442-de89df76afd3'),still:photo('photo-1566150905458-1bf1fc113f0d'),art:photo('photo-1513364776144-60967b0f800f'),pink:photo('photo-1553062407-98eeb64c6a62')},
  items:[
   p('sabrina','SABRINA','Metallic',22000,photo('photo-1584917865442-de89df76afd3'),'Soft chrome and a futuristic sculpted silhouette.',['Silver','Black'],'ECO EDIT'),
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
  categories:['All','Electronics','Fashion','Home & Living','Beauty & Care','Footwear','Accessories','Sports'],
  images:{hero:photo('photo-1553062407-98eeb64c6a62'),electronics:photo('photo-1505740420928-5e560c06d30e'),fashion:photo('photo-1591047139829-d91aecb6caea'),home:photo('photo-1507473885765-e6ed057f782c'),beauty:photo('photo-1556228578-0d85b1a4d571'),footwear:photo('photo-1542291026-7eec264c27ff'),eyewear:photo('photo-1511499767150-a48a237f0083'),sport:photo('photo-1517836357463-d25dfeac3438'),office:photo('photo-1455390582262-044cdead277a')},
  items:[
   p('urban-pack','URBAN COMMUTER BACKPACK','Accessories',7900,photo('photo-1553062407-98eeb64c6a62'),'Organised everyday carry for work and travel.',['Navy','Black'],'NEW'),
   p('nova-wireless','NOVA WIRELESS HEADPHONES','Electronics',12900,photo('photo-1505740420928-5e560c06d30e'),'Comfortable over-ear sound with an everyday profile.',['Black','Sand']),
   p('polarised','POLARISED SUNGLASSES','Accessories',4900,photo('photo-1511499767150-a48a237f0083'),'Classic shades for sun-soaked days.',['Tortoise','Black']),
   p('lifestyle-sneaker','CLASSIC LIFESTYLE SNEAKER','Footwear',8900,photo('photo-1542291026-7eec264c27ff'),'Everyday comfort with a clean contrast sole.',['White','Navy']),
   p('serum','REVITALISING FACE SERUM','Beauty & Care',2400,photo('photo-1556228578-0d85b1a4d571'),'A fresh daily ritual for healthy-looking skin.',['30ml']),
   p('modern-lamp','MODERN DESK LAMP','Home & Living',17900,photo('photo-1507473885765-e6ed057f782c'),'A warm accent for home and workspace.',['Copper','Stone']),
   p('field-jacket','FIELD JACKET','Fashion',15900,photo('photo-1591047139829-d91aecb6caea'),'Everyday layers with clean lines.',['Oat','Black']),
   p('training-kit','TRAINING KIT','Sports',11500,photo('photo-1517836357463-d25dfeac3438'),'Make every session count with essentials built to last.',['Black'])
  ]
 },
 minimal:{
  name:'Veloura',eyebrow:'TIMELESS FINE JEWELLERY',heading:'From classic to contemporary.',
  strapline:'A thoughtful selection of exquisite everyday jewellery.',
  categories:['All','Rings','Earrings','Bracelets','Necklaces'],
  images:{hero:photo('photo-1535632066927-ab7c9ab60908'),model:photo('photo-1517841905240-472988babdf9'),skin:photo('photo-1617038260897-41a1f14a8ca0'),still:photo('photo-1602173574767-37ac01994b2a'),box:photo('photo-1515562141207-7a88fb7ce338'),story:photo('photo-1630019852942-f89202989a59')},
  items:[
   p('queen-ring','QUEEN RING','Rings',66000,photo('photo-1605100804763-247f67b3557e'),'A refined gold ring with a sparkling centre stone.',['Yellow gold','White gold']),
   p('laura-bracelet','LAURA BRACELET','Bracelets',25000,photo('photo-1573408301185-9146fe634ad0'),'A confident modern link bracelet.',['Gold']),
   p('diamond-necklace','DIAMOND NECKLACE','Necklaces',39900,photo('photo-1599643478518-a784e5dc4c8f'),'A delicate everyday pendant with a luminous sparkle.',['Gold','Silver']),
   p('yuna-bracelet','YUNA BRACELET','Bracelets',22000,photo('photo-1611652022419-a9419f74343d'),'A beautifully considered minimal chain.',['Gold']),
   p('occa-earrings','OCCA EARRINGS','Earrings',18000,photo('photo-1535632066927-ab7c9ab60908'),'Simple gold hoops with elegant volume.',['Gold','Silver']),
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
