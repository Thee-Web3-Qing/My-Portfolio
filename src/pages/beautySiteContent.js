/* Fictional portfolio examples. Never imply live services, verified reviews or stock. */
const p=(id,w=1100)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=83'
const px=(id,w=1100)=>'https://images.pexels.com/photos/'+id+'/pexels-photo-'+id+'.jpeg?auto=compress&cs=tinysrgb&w='+w
const create=(id,name,category,price,image,description,details={})=>({id,name,category,price,image,description,...details})
export const beautyCollections={
 editorial:{
  brand:'MAISON BEAUTÉ',label:'Salon & beauty atelier',eyebrow:'BEAUTY IS A PERSONAL ART',
  hero:p('photo-1524504388940-b1c1722653e1',1600),
  setting:px(7750090,1300),detail:px(5128234),portrait:p('photo-1534528741775-53994a69daeb'),
  storyTitle:'A studio that makes space for you.',story:'A quiet but expressive beauty atelier, from the consultation to the finishing touches. Every appointment is built around individual style, thoughtful preparation and beautiful detail.',
  principles:[['The consultation','We start with the look, the occasion and the details that matter to you.'],['The preparation','A considered treatment plan, with products and timing made clear.'],['The finishing touch','We check the result together, then share simple aftercare guidance.']],
  items:[
   create('sculpted-nails','Sculpted Nail Set','Nails',22000,px(8377206),'A tailored manicure with refined shaping, careful colour selection and a glossy finish.',{length:'75–90 minutes',includes:['Shape consultation','Cuticle preparation','Gel colour finish','Aftercare guidance']}),
   create('lash-lift','Lifted Lashes','Lashes',24000,px(5128234),'A natural-looking lash lift designed to open up the eyes.',{length:'60 minutes',includes:['Lash consultation','Cleansing and preparation','Lift and finishing','Care guidance']}),
   create('soft-glam','Soft Glam','Makeup',35000,p('photo-1740389702808-b63f49277fcc'),'Light-catching makeup designed around your face and occasion.',{length:'90 minutes',includes:['Skin preparation','Shade and finish consultation','Full beauty application','Touch-up advice']}),
   create('signature-install','Signature Hair Install','Hair',42000,p('photo-1595476108010-b4d1f102b1b1'),'Polished styling, natural-looking finishing and attention to the hairline.',{length:'120 minutes',includes:['Style consultation','Hair preparation','Installation and styling','Maintenance guidance']}),
   create('clean-manicure','The Bare Manicure','Nails',12000,p('photo-1604654894610-df63bc536371'),'A beautifully simple manicure with clean, minimal finishing.',{length:'45 minutes',includes:['Nail shaping','Cuticle care','Natural glossy finish']}),
   create('skin-reset','Skin Reset Facial','Facials',30000,p('photo-1570172619644-dfd03ed5d881'),'A calm cleanse, gentle hydration and a skin-comfort ritual.',{length:'75 minutes',includes:['Skin conversation','Gentle cleansing','Moisture-focused treatment','Homecare notes']}),
  ],
  faqs:[['Can I book multiple services?','Yes. In the finished site, clients could request more than one service, with availability confirmed by the salon.'],['Will my appointment be confirmed immediately?','This demonstration does not reserve an appointment. A real salon website can include its actual booking and confirmation process.'],['Can I choose an artist?','The finished version can include real artist portfolios, availability and selection.']]
 },
 catalogue:{
  brand:'VÉRA SKIN',label:'Skincare & skin rituals',eyebrow:'A BETTER ROUTINE BEGINS HERE',
  hero:px(6925487,1700),setting:px(7317129,1300),detail:px(7795661),portrait:px(6925483,1200),
  storyTitle:'Good skin starts with good habits.',story:'Véra Skin is an illustrative skincare label centred on simple routines, gentle textures and deliberate care. This design shows how to explain products as well as display them.',
  principles:[['Discover','Browse by skin goal, texture or step in the routine.'],['Understand','Every product page explains texture, purpose and how to use it.'],['Build a ritual','Choose a few essentials and view a combined basket before sending an enquiry.']],
  items:[
   create('daily-cleanser','Daily Dew Cleanser','Cleanse',17500,px(8049838),'A gentle cleanser with a soft feel for the start and end of your day.',{size:'150 ml',texture:'Light gel',includes:['Daily cleansing','Morning and evening use','Gentle massage and rinse'],ritual:'Massage onto damp skin, then rinse. Follow with moisturiser.'}),
   create('vitamin-serum','The Glow Serum','Serums',26500,px(7795661),'A lightweight serum concept for a bright, considered daily ritual.',{size:'30 ml',texture:'Fluid serum',includes:['Lightweight feel','Use after cleansing','Pair with moisturiser'],ritual:'Apply a few drops to clean skin and allow to absorb.'}),
   create('barrier-cream','Barrier Comfort Cream','Moisturise',19500,px(8490091),'An everyday cream with a cushiony finish.',{size:'50 ml',texture:'Rich cream',includes:['Comforting finish','Morning or evening','Layers with serums'],ritual:'Smooth a small amount across clean skin after serum.'}),
   create('night-oil','After Hours Face Oil','Oils',24000,px(7795661),'A few drops of a nourishing-feeling oil for a slower evening ritual.',{size:'30 ml',texture:'Light oil',includes:['Evening application','Mix into moisturiser if preferred','Finishing ritual'],ritual:'Press a small amount onto skin as the final step.'}),
   create('body-milk','Soft Skin Body Milk','Body',22500,p('photo-1556228578-0d85b1a4d571'),'A light, easy-to-layer body lotion concept.',{size:'250 ml',texture:'Soft lotion',includes:['Post-shower use','Light texture','Everyday comfort'],ritual:'Apply to clean body skin as desired.'}),
   create('ritual-duo','The Daily Ritual Duo','Sets',38500,p('photo-1571781926291-c477ebfd024b'),'Two complementary staples for a simple starter routine.',{size:'2 pieces',texture:'Cleanse + moisture',includes:['Cleanser','Moisturiser','Routine card'],ritual:'Cleanse, then moisturise. Use your regular sun protection in the morning.'}),
  ],
  faqs:[['Are these formulas available for purchase?','No. The products and prices are fictional demonstration entries, created to show how a real skincare brand can present its catalogue.'],['Can customers filter by product type?','Yes. The shop below filters products by category and the demo bag combines selected items.'],['How would ingredients and directions be shown?','The finished website can include verified ingredient lists, directions and warnings supplied by the merchant. This demo does not invent formula ingredients.']]
 },
 minimal:{
  brand:'AURA DENTAL',label:'Dental care studio',eyebrow:'THE ART OF A CONFIDENT SMILE',
  hero:px(34683936,1600),setting:px(6812444,1300),detail:px(3845626),portrait:px(37458354),
  storyTitle:'Care begins with a conversation.',story:'A contemporary dental studio concept that lets patients explore service information, meet the practice and request an appointment. All treatment details are illustrative, not individual medical guidance.',
  principles:[['Listen','Understand the patient’s concerns and history.'],['Explain','Discuss assessment findings, options, limitations and costs.'],['Plan','Agree on appropriate next steps with the qualified clinician.']],
  items:[
   create('consultation','Dental Consultation','Consultations',25000,px(3845626),'An initial appointment to discuss concerns and potential next steps.',{length:'30–45 minutes',includes:['Discussion of concerns','Examination as appropriate','Explanation of options','Proposed follow-up plan']}),
   create('professional-clean','Professional Cleaning','Preventive',38000,px(6812444),'A preventive care appointment, subject to professional assessment.',{length:'45–60 minutes',includes:['Oral hygiene assessment','Professional cleaning as appropriate','Home-care discussion']}),
   create('cosmetic-smile','Cosmetic Smile Consultation','Cosmetic',42000,px(4971500),'Explore aesthetic dental options through a professional consultation.',{length:'45 minutes',includes:['Smile goals discussion','Clinical examination','Options and suitability discussion']}),
   create('aligner-review','Orthodontic Assessment','Orthodontics',50000,px(6529056),'A starting consultation to discuss alignment and specialist care.',{length:'45–60 minutes',includes:['Alignment concerns','Examination','Potential referral or treatment plan']}),
   create('implant-consult','Implant Assessment','Restorative',60000,px(6502305),'Discuss tooth replacement questions with a qualified dental team.',{length:'60 minutes',includes:['History and concerns','Clinical assessment','Suitability and options discussion']}),
   create('follow-up','Dental Follow-up','Consultations',18000,px(3845626),'A review appointment for ongoing care and questions.',{length:'20–30 minutes',includes:['Progress discussion','Review of care','Next steps when indicated']}),
  ],
  faqs:[['Is this a real dental booking service?','No. The clinic, fees and booking form are fictional demonstrations only.'],['Do the listed treatments suit everyone?','No. Dental treatment suitability and costs require an individual assessment by a qualified professional.'],['Can a real practice show clinicians and opening hours?','Yes. A finished site can feature verified professionals, actual credentials, clinic hours and contact details.']]
 },
 botanical:{
  brand:'FOLIA BOTANICS',label:'Botanical beauty & body care',eyebrow:'A ROUTINE ROOTED IN THE EVERYDAY',
  hero:px(10496086,1600),setting:px(8049838,1300),detail:px(7795661),portrait:px(7317129,1200),
  storyTitle:'Good things grow from simple rituals.',story:'Folia Botanics is a fictional plant-inspired body and skincare shop. Its site shows products, collections, rituals and a sample multi-item shopping bag, all in a calm, product-led setting.',
  principles:[['Curate','Choose a few practical essentials for the morning or evening.'],['Explore','Open individual products for textures, sizes and usage notes.'],['Combine','Build a sample basket and see the full order summary.']],
  items:[
   create('buttery-lotion','Buttery Smooth Lotion','Body',19500,px(8490091),'A velvety lotion concept for an everyday body-care ritual.',{size:'250 ml',texture:'Soft lotion',includes:['Easy everyday application','Warm creamy texture','Body-care essential'],ritual:'Apply to clean skin, paying attention to dry areas.'}),
   create('green-wash','Garden Body Wash','Cleanse',17500,px(8049838),'A gentle-feeling wash with a fresh botanical presentation.',{size:'300 ml',texture:'Light wash',includes:['Daily body cleansing','Easy-rinse texture','Fresh ritual'],ritual:'Lather onto wet skin and rinse thoroughly.'}),
   create('soft-shampoo','Botanical Shampoo','Hair',21000,px(7795661),'A wash-day staple in a simple product-led collection.',{size:'250 ml',texture:'Liquid shampoo',includes:['Wash-day cleansing','Gentle massage','Rinse completely'],ritual:'Apply to wet hair, work through and rinse.'}),
   create('balancing-oil','The Botanical Oil','Oils',23500,px(7795661),'A lightweight oil concept for a finishing touch after bathing.',{size:'100 ml',texture:'Light oil',includes:['Body-care finishing step','Soft glow','Everyday routine'],ritual:'Smooth a few drops onto clean skin.'}),
   create('daily-cream','Daily Moisture Cream','Skin',21500,px(7317129),'A nourishing-feeling cream with an understated finish.',{size:'50 ml',texture:'Cushion cream',includes:['Day or night','Comforting finish','Simple application'],ritual:'Apply after cleansing and follow your usual daily skin routine.'}),
   create('body-bundle','The Body Ritual Set','Sets',48500,px(10496086),'A considered set of shower, moisturising and aftercare essentials.',{size:'3 pieces',texture:'Wash + lotion + oil',includes:['Body wash','Lotion','Botanical oil'],ritual:'Cleanse, moisturise and finish with oil when desired.'}),
  ],
  faqs:[['Can I combine different products in one order?','Yes. The sample bag collects more than one item and calculates the total before showing an order message.'],['Are these real products?','No. These are fictional product concepts and sample prices designed to illustrate a completed merchant website.'],['Can a real client add variants and stock?','Yes, where included in the agreed features. Your own product information and inventory rules would replace this demonstration.']]
 }
}
