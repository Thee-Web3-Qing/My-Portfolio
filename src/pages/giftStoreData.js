/**
 * Shared temporary gift and hamper visual catalogue for the three December demos.
 *
 * IMPORTANT: Photos are illustrative external references, not the branded
 * products being sold. Client-owned or licensed photography replaces all
 * assets, prices, claims and availability before a live store takes orders.
 */
const uns=(id,w=1400)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=84'
export const giftPhotos={
 editorialHero:'https://img.forestessentialsindia.com/pub/media/catalog/product/cache/f8158826193ba5faa8b862a9bd1eb9e9/2/1/21340_christmas_gift_box_680gms_2.jpg',
 luxuryBox:'https://thecustomizeboxes.com/assets/products-gallery/corporate-gift-boxes.webp',
 luxuryDesk:'https://alpineclover.ch/cdn/shop/files/Work_Life_Balance_92b42746-7835-4f3b-a09e-7f35ef1dd029_1024x1024.jpg?v=1737113342',
 selfCare:'https://www.kindredfires.com/cdn/shop/collections/Christmas-Gift-Set-5-_2.jpg?crop=center&height=1200&v=1731407076&width=1200',
 coffeeBox:'https://www.boxupgifting.com/cdn/shop/products/DSC08002.jpg?v=1729161328&width=1445',
 lavenderBox:'https://www.vertiana.com/cdn/shop/files/image.jpg?v=1682506473',
 coffeeChocolate:'https://sharperimage.com/cdn/shop/files/211276-z1.jpg?v=1755889488&width=1200',
 blushHoliday:'https://bagy.com.br/blog/wp-content/uploads/2024/11/kitdenatal.png',
 colorfulWrap:'https://joycreativeshop.com/cdn/shop/collections/Untitled_design_-_2025-10-29T135930.889.png?v=1761930813&width=1200',
 starWrap:'https://www.wanderlustpaper.co/cdn/shop/files/Small_Christmas_September_2022_Flat_lay_accc3325-5c1c-4bb4-968d-34c99f63519a_1080x.jpg?v=1693738439',
 season:'https://img.forestessentialsindia.com/pub/media/catalog/product/cache/f8158826193ba5faa8b862a9bd1eb9e9/2/1/21340_christmas_gift_box_680gms_2.jpg',
 texture:uns('photo-1513201099705-a9746e1e201f'),
 candle:uns('photo-1603006905003-be475563bc59'),
 coffee:uns('photo-1447933601403-0c6688de566e'),
 chocolate:uns('photo-1548907040-4d42b2d1092d'),
 flowers:uns('photo-1490750967868-88aa4486c946'),
 cards:uns('photo-1513519245088-0e12902e5a38'),
 wrapped:uns('photo-1549465220-1a8b9238cd48'),
 tiny:uns('photo-1512909006721-3d6018887383'),
}
export const giftCategories=['All','Festive','Corporate','Wellness','Gourmet','Everyday','Celebration']
export const giftOccasions=['Christmas','Birthday','Thank You','Congratulations','Just Because','Corporate']
const product=(id,name,category,price,image,caption,contents,marker='')=>({
 id,name,category,price,image:giftPhotos[image],caption,contents,marker
})
export const giftProducts=[
 product('noel-edit','The Noël Edit','Festive',89500,'editorialHero','A deep-green festive box for a beautiful end-of-year gesture.',['Candle','Bath ritual','Sweet treats','Keepsake note'],'SEASONAL'),
 product('good-gesture','The Good Gesture','Corporate',75000,'luxuryBox','An understated corporate gift with coffee, sweets and thoughtful essentials.',['Coffee blend','Artisan sweet treats','Candle','Gift card'],'SIGNATURE'),
 product('slow-sunday','The Slow Sunday Box','Wellness',59000,'selfCare','The little luxuries for a day spent doing absolutely nothing.',['Relaxation candle','Bath soak','Body care','Herbal tea'],'BESTSELLER'),
 product('daily-ritual','The Daily Ritual','Wellness',48000,'lavenderBox','A lavender-inspired gift designed for a soft reset.',['Lavender bath salts','Scented candle','Body care','Soft washcloth']),
 product('office-hour','The Desk Edit','Corporate',82500,'luxuryDesk','Gorgeous everyday essentials for valued colleagues and clients.',['Coffee','Ceramic cup','Candle','Artisan tea'],'CORPORATE PICK'),
 product('coffee-date','Coffee & Comfort','Gourmet',54500,'coffeeBox','A cosy coffee moment, beautifully boxed and ready to give.',['Premium coffee','Reusable mug','Candle','Chocolate']),
 product('sweet-note','Something Sweet','Gourmet',38500,'coffeeChocolate','Warm drinks, delicious chocolate and a ribbon-tied thank-you.',['Chocolate selection','Coffee','Scented candle'],'UNDER ₦40K'),
 product('holiday-glow','The Holiday Glow','Celebration',99000,'blushHoliday','A festive self-care gesture finished with an elegant bow.',['Body care','Aromatic mist','Wellness extras','Gift note']),
 product('colour-me-happy','Little Joys','Everyday',32500,'colorfulWrap','A playful, patterned surprise for the person who loves colour.',['Gift wrap set','Greeting card','Keepsake'],'SMALL & SWEET'),
 product('the-paper-edit','The Paper Edit','Everyday',28500,'starWrap','Beautiful paper goods for someone who values the details.',['Greeting cards','Patterned wrap','Decorative tags']),
 product('christmas-box','December Darling','Festive',109000,'season','A generous and beautifully packed holiday ritual.',['Gourmet treats','Body care','Scented extras','Keepsake box'],'DECEMBER LIMITED'),
 product('all-for-you','Just for You','Celebration',43500,'wrapped','A timeless gift wrapped beautifully for any happy occasion.',['Personal note','Curated treats','Signature wrapping']),
]
export const giftItems=[
 {id:'candle',name:'Scented soy candle',price:9500,symbol:'✧',family:'Rituals',photo:giftPhotos.candle},
 {id:'coffee',name:'Artisan coffee blend',price:7500,symbol:'☕',family:'Indulgences',photo:giftPhotos.coffee},
 {id:'chocolate',name:'Fine chocolate assortment',price:8500,symbol:'◆',family:'Indulgences',photo:giftPhotos.chocolate},
 {id:'bath',name:'Bath and body ritual',price:12000,symbol:'✿',family:'Rituals',photo:giftPhotos.lavenderBox},
 {id:'florals',name:'Dried floral keepsake',price:7900,symbol:'❀',family:'Keepsakes',photo:giftPhotos.flowers},
 {id:'stationery',name:'Paper goods and note cards',price:6500,symbol:'✎',family:'Keepsakes',photo:giftPhotos.starWrap},
]
export const giftPackaging=[
 {id:'sage',name:'Sage & ivory',color:'#8f9d7c',ink:'#fff',price:0},
 {id:'wine',name:'Wine & gold',color:'#783842',ink:'#fff7ed',price:4500},
 {id:'blush',name:'Blush pink',color:'#e8b8b6',ink:'#432d28',price:2500},
]
export const giftBrands={
 editorial:{id:'editorial',root:'/giftseditorial',name:'MAISON NOËL',sub:'THE ART OF GIVING',label:'Editorial',tagline:'Give them something to remember.',hero:giftPhotos.editorialHero},
 catalogue:{id:'catalogue',root:'/giftscatalogue',name:'THE GIFT CLUB',sub:'WRAP SOMETHING WONDERFUL',label:'Catalogue',tagline:'A little joy goes a long way.',hero:giftPhotos.colorfulWrap},
 minimal:{id:'minimal',root:'/giftsminimal',name:'THE KIND EDIT',sub:'THOUGHTFULLY GIVEN',label:'Minimal',tagline:'A beautiful thing to give.',hero:giftPhotos.luxuryDesk},
}
export const giftMoney=n=>'₦'+Number(n||0).toLocaleString('en-NG')
export const getGift=id=>giftProducts.find(p=>p.id===id)
export const getGiftItem=id=>giftItems.find(p=>p.id===id)
export const getPackaging=id=>giftPackaging.find(p=>p.id===id)||giftPackaging[0]
