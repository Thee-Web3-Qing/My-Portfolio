
/* December food storefront demo inventory.
   Product names, prices, addresses and reviews are illustrative.
   Images are temporary references and require production licensing / replacement. */
const u = id => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=1200&q=83'
export const foodPhotos = {
 koreanBowl: 'https://farmerjacksmarket.com/cdn/shop/collections/korean-food.png?v=1777396216',
 koreanRice: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=85',
 tteokbokki: 'https://www.unileverfoodsolutionsarabia.com/ar/chef-inspiration/world-cuisine/korean/seouls-gwangjang-market/jcr%3Acontent/parsys/content/columncontrol_copy/columnctrl_parsys_1/textimage/image.transform/jpeg-optimized/image.1571732643483.jpg',
 koreanPlace: u('photo-1552566626-52f8b828add9'),
 koreanTable: u('photo-1517248135467-4c7edcad34c4'),
 koreanGrill: u('photo-1544025162-d76694265947'),
 koreanChicken: u('photo-1562967914-608f82629710'),
 koreanSoup: u('photo-1547592180-85f173990554'),
 koreanDrinks: u('photo-1544145945-f90425340c7e'),
 koreanSides: u('photo-1512621776951-a57141f2eefd'),
 bakeryHero: u('photo-1555507036-ab1f4038808a'),
 bakeryChoc: 'https://www.fluffyummy.com/cdn/shop/files/pain-au-chocolat-2557333.png?v=1757900808&width=1946',
 bakeryCroissant: 'https://images.unsplash.com/photo-1747459707225-65744d0ae6be?auto=format&fit=crop&w=1200&q=85',
 bakeryBread: u('photo-1509440159596-0249088772ff'),
 bakeryCake: u('photo-1578985545062-69928b1d9587'),
 bakeryBuns: u('photo-1668015777649-053a0fefce3c'),
 bakeryCookies: u('photo-1499636136210-6f4ee915583e'),
 bakeryChocolate: u('photo-1606313564200-e75d5e30476c'),
 bakeryCoffee: u('photo-1509042239860-f550ce710b93'),
 bakeryDonuts: u('photo-1551024506-0bccd828d307'),
 bakeryCafe: u('photo-1559925393-8be0ec4767c8'),
 bakeryParty: u('photo-1565958011703-44f9829ba187'),
 biryaniPot: 'https://muttonmahal.com/cdn/shop/files/Mutton_Biryani_Cut.jpg?v=1772729340',
 biryaniSpread: 'https://muttonmahal.com/cdn/shop/files/Biryani_Master_Combo.jpg?v=1777624186',
 biryaniChickenRice: 'https://thebasilico.ca/storage/2024/04/7a09499e-f09d-49c6-bf7d-1f403bc57976-copy.png',
 biryaniRice: 'https://d1w7312wesee68.cloudfront.net/F5krd33cSPKq6_nWbu5oRU0IpqIAhDzA1Ld_acT_Xxk/resize%3Afit%3A720%3A720/plain/s3%3A/toasttab/restaurants/restaurant-176719000000000000/menu/items/1/item-900000022837412081_1772756111.jpg',
 biryaniChicken: 'https://www.bollywoodboxcalgary.com/assets/popular-dishes/butter-chicken.webp',
 biryaniCurry: u('photo-1631452180519-c014fe946bc7'),
 biryaniPaneer: 'https://www.indianhealthyrecipe.com/wp-content/uploads/2023/12/palak-paneer-recipe-featured.webp',
 biryaniSamosa: u('photo-1601050690597-df0568f70950'),
 biryaniNaan: u('photo-1626074353765-517a681e40be'),
 biryaniVegetarian: u('photo-1546833999-b9f581a1996d'),
 biryaniRestaurant: u('photo-1517248135467-4c7edcad34c4'),
 biryaniSpices: u('photo-1596040033229-a9821ebd058d'),
}
const item=(id,name,category,price,image,description,badge='')=>({id,name,category,price,image:foodPhotos[image],description,badge})
const korean=[
 item('bibimbap','Dolsot Bibimbap','Signature',12500,'koreanBowl','Hot stone-bowl rice with seasoned vegetables, egg and a gochujang finish.','Most loved'),
 item('bulgogi','Seoul Beef Bulgogi','Grill',16500,'koreanGrill','Tender marinated beef with sesame, scallions and Korean rice.','Signature'),
 item('tteokbokki','Spicy Tteokbokki','Street food',9800,'tteokbokki','Chewy rice cakes in a glossy, sweet-and-spicy gochujang sauce.','Popular'),
 item('chicken','Crispy Korean Chicken','Grill',14500,'koreanChicken','Golden fried chicken with a sweet chilli glaze and sesame.'),
 item('kimchi-rice','Kimchi Fried Rice','Signature',10800,'koreanRice','A satisfying rice dish with kimchi, vegetables and a rich savoury finish.'),
 item('banchan','Banchan Selection','Sides',6500,'koreanSides','A colourful selection of seasonal Korean-inspired side dishes.'),
 item('korean-soup','Warm Korean Soup','Sides',8300,'koreanSoup','Comforting broth with greens and a deliciously savoury flavour.'),
 item('seoul-set','Seoul Sharing Set','Signature',31500,'koreanBowl','Our signature bowls and small plates for sharing.'),
 item('lime-spritz','Seoul Citrus Spritz','Drinks',6500,'koreanDrinks','Citrus, sparkling soda and a gentle herbal finish.'),
 item('beef-feast','Korean Grill Feast','Grill',32900,'koreanGrill','A generous grill selection for the whole table.')
]
const bakery=[
 item('butter-croissant','Butter Croissant','Pastries',3600,'bakeryCroissant','Golden, crisp and generously buttery, with delicate flaky layers.','Bestseller'),
 item('pain-choc','Pain au Chocolat','Pastries',4200,'bakeryChoc','Flaky buttery pastry with a rich chocolate centre.'),
 item('cinnamon-bun','Cinnamon Cloud Bun','Pastries',3900,'bakeryBuns','Warm cinnamon, soft dough and a little sweet glaze.','Fresh today'),
 item('choc-cookie','Chocolate Chunk Cookie','Cookies',2200,'bakeryCookies','A chewy middle, crisp edge and generous chocolate chunks.'),
 item('birthday-cake','Strawberry Celebration Cake','Cakes',28000,'bakeryCake','A soft celebration cake dressed with strawberries and cream.','Made to order'),
 item('brownie','Double Chocolate Brownie','Cookies',3400,'bakeryChocolate','Fudgy, rich and made for serious chocolate lovers.'),
 item('donuts','Sugar Kiss Doughnuts','Pastries',3800,'bakeryDonuts','A little cloud of sweetness, freshly prepared.'),
 item('sourdough','Country Sourdough','Bread',6500,'bakeryBread','Slow-fermented artisan loaf with a crisp, golden crust.'),
 item('latte','Honey Oat Latte','Coffee',4600,'bakeryCoffee','Espresso, silky oat milk and just a little honey.'),
 item('party-box','The Weekend Treat Box','Bundles',19800,'bakeryParty','A crowd-pleasing mix of bakery favourites for sharing.','Party favourite')
]
const biryani=[
 item('mutton-biryani','Mutton Biryani','Biryani',14500,'biryaniPot','Tender mutton layered with spiced basmati rice, warming aromatics and herbs.','Signature'),
 item('chicken-biryani','Chicken Dum Biryani','Biryani',11900,'biryaniChickenRice','Fragrant rice and slow-cooked chicken prepared with warming spices.','Most ordered'),
 item('jeera-rice','Jeera Chawal','Rice',4900,'biryaniRice','Fluffy basmati rice seasoned with toasted cumin.'),
 item('kadai-chicken','Kadai Chicken','Curries',10900,'biryaniCurry','Chicken simmered with peppers and a richly spiced sauce.'),
 item('palak-paneer','Palak Paneer','Vegetarian',9900,'biryaniPaneer','Soft paneer cubes in a deeply flavoured herb and spice sauce.'),
 item('butter-chicken','Butter Chicken','Curries',11900,'biryaniChicken','Tender chicken in a smooth buttery tomato sauce.'),
 item('veg-biryani','Vegetable Biryani','Vegetarian',9900,'biryaniVegetarian','Spiced basmati layered with vegetables and fragrant herbs.'),
 item('samosa','Crispy Samosas','Sides',3900,'biryaniSamosa','Golden pastry pockets filled with a warmly spiced savoury mixture.'),
 item('naan','Fresh Butter Naan','Sides',2800,'biryaniNaan','Soft warm flatbread brushed with butter.'),
 item('royal-feast','Royal Family Feast','Combos',33900,'biryaniSpread','A generous feast of biryani, curry and sides for the entire table.','Group favourite')
]
export const foodStores={
 editorial:{id:'editorial',root:'/foodeditorial',name:'HANSIK',accent:'한식',label:'Korean restaurant',tagline:'Tradition in every bite, reimagined for today.',hero:foodPhotos.koreanBowl,secondary:foodPhotos.koreanPlace,location:'Sample restaurant location, Lagos',phone:'Phone added at launch',categories:['All','Signature','Grill','Street food','Sides','Drinks'],items:korean,featured:['bibimbap','bulgogi','tteokbokki'],special:'Korean flavours beyond food.'},
 catalogue:{id:'catalogue',root:'/foodcatalogue',name:'Crumb & Co.',accent:'Freshly baked',label:'Bakery and café',tagline:'Butter, flour & a little bit of love.',hero:foodPhotos.bakeryHero,secondary:foodPhotos.bakeryCafe,location:'Sample bakery location, Lagos',phone:'Phone added at launch',categories:['All','Pastries','Cakes','Cookies','Bread','Coffee','Bundles'],items:bakery,featured:['butter-croissant','pain-choc','birthday-cake','choc-cookie'],special:'Your party, our cake.'},
 minimal:{id:'minimal',root:'/foodminimal',name:'KANIGIRI',accent:'TASTE OF ANDHRA',label:'Indian food ordering',tagline:'Big flavour, delivered with care.',hero:foodPhotos.biryaniPot,secondary:foodPhotos.biryaniSpread,location:'Sample kitchen location, Lagos',phone:'Phone added at launch',categories:['All','Biryani','Curries','Vegetarian','Rice','Sides','Combos'],items:biryani,featured:['mutton-biryani','kadai-chicken','palak-paneer'],special:'Every bite, a celebration.'},
 artisan:{id:'artisan',root:'/foodartisan',name:'MATBOR',accent:'BIRYANI HOUSE',label:'Artisanal biryani kitchen',tagline:'Biryani worth gathering for.',hero:foodPhotos.biryaniPot,secondary:foodPhotos.biryaniSpices,location:'Sample kitchen location, Lagos',phone:'Phone added at launch',categories:['All','Biryani','Curries','Vegetarian','Rice','Sides','Combos'],items:biryani,featured:['mutton-biryani','chicken-biryani','veg-biryani'],special:'Slow cooked. Warmly shared.'}
}
export const money = n => '₦'+Number(n).toLocaleString('en-NG')
export const getItem=(store,id)=>store.items.find(p=>p.id===id)
