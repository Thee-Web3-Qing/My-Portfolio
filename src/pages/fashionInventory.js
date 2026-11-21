
/**
 * One and only one asset registry for all three December fashion demo sites.
 * Exactly thirty external image sources: six campaign images + twenty-four product images.
 * Temporary visual assets. The client will replace them with licensed brand photography.
 * Curated looks use fashion images with the same wardrobe colours and silhouettes.
 */
const uns = (id) => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=1100&q=85'

export const fashionImageSet = [
  { id: 'look-mono', kind: 'look', src: 'https://images.asos-media.com/products/vero-moda-pleated-mini-skirt-in-dark-grey-check-print/209350808-4?fit=constrain&wid=1080', alt: 'Full-body outfit with white off-shoulder top, black pleated skirt, black boots and dark handbag' },
  { id: 'look-wine', kind: 'look', src: 'https://ro.marella.com/dam/jcr%3Acd709f10-dd9d-434b-8ab4-fa9a6e6b5b99/EDITO_Cover_A_464x665.jpg', alt: 'Burgundy leather jacket and matching trousers outfit' },
  { id: 'look-blue', kind: 'look', src: 'https://cdn.dsmcdn.com/mnresize/400/-/ty1791/prod/QC_PREP/20251124/19/fa572dad-1544-37c7-b674-05ea5c86c9f7/1_org_zoom.jpg', alt: 'Blue belted coat with white boots street style' },
  { id: 'campaign-bright', kind: 'campaign', src: uns('photo-1529139574466-a303027c1d8b'), alt: 'High-energy streetwear editorial portrait' },
  { id: 'campaign-street', kind: 'campaign', src: uns('photo-1539109136881-3be0616acf4b'), alt: 'Contemporary fashion editorial in the city' },
  { id: 'campaign-luxury', kind: 'campaign', src: uns('photo-1515886657613-9f3515b0c78f'), alt: 'Minimal luxury fashion editorial' },

  { id: 'ivory', kind: 'product', src: 'https://static.zara.net/assets/public/3755/9bbc/bcde4ce6b648/218bd4606ec8/04938011250-a1/04938011250-a1.jpg?ts=1771259891620', alt: 'White off shoulder fitted long sleeve top' },
  { id: 'pleat', kind: 'product', src: 'https://www.meshki.us/cdn/shop/files/GHOST-MuraPleatedMiniSkirt-Black2.png?v=1774123070&width=1200', alt: 'Black pleated mini skirt cutout on plain background' },
  { id: 'boots', kind: 'product', src: 'https://static.zara.net/assets/public/a4fc/4498/495643caa4d5/dd9ef9eb8f38/11028610800-e1/11028610800-e1.jpg?ts=1759848697333', alt: 'Black knee high leather boots product photo' },
  { id: 'tabby', kind: 'product', src: 'https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/198685073935/4We0szM0QV9-198685073935-1.jpg', alt: 'Black leather shoulder bag with gold clasp' },
  { id: 'wine', kind: 'product', src: 'https://www.mytheresa.com/image/1094/1238/100/73/P01067925_d3.jpg', alt: 'Burgundy belted leather vest worn by model' },
  { id: 'winepants', kind: 'product', src: 'https://down-id.img.susercontent.com/file/sg-11134201-7rdw9-mdpm7vu2i3foa7', alt: 'Burgundy tailored straight leg trousers on white' },
  { id: 'croco', kind: 'product', src: uns('photo-1584917865442-de89df76afd3'), alt: 'Structured small leather handbag' },
  { id: 'heels', kind: 'product', src: uns('photo-1515347619252-60a4bf4fff4f'), alt: 'Elegant high heel shoes' },
  { id: 'bluecoat', kind: 'product', src: 'https://a.1stdibscdn.com/balenciaga-hourglass-double-breasted-wool-blend-coat-royal-blue-38-fr-for-sale/v_34252/v_188425221679982925948/v_18842522_1679982926691_bg_processed.jpg', alt: 'Royal blue tailored double breasted coat' },
  { id: 'whiteboots', kind: 'product', src: 'https://images.top5best.com/images/list_img_s/list_2961/modatope_29608755.jpg', alt: 'White knee high boots with block heels' },
  { id: 'rosebag', kind: 'product', src: uns('photo-1548036328-c9fa89d128fa'), alt: 'Soft leather shoulder bag' },
  { id: 'greyskirt', kind: 'product', src: uns('photo-1583496661160-fb5886a13d27'), alt: 'Tailored skirt neutral silhouette' },
  { id: 'linen', kind: 'product', src: uns('photo-1598554747436-c9293d6a588f'), alt: 'Everyday crisp white blouse' },
  { id: 'widepants', kind: 'product', src: uns('photo-1594633312681-425c7b97ccd1'), alt: 'Relaxed wide-leg trousers' },
  { id: 'blackdress', kind: 'product', src: uns('photo-1539008835657-9e8e9680c956'), alt: 'Elegant black dress product photograph' },
  { id: 'gold', kind: 'product', src: uns('photo-1535632066927-ab7c9ab60908'), alt: 'Minimal gold jewellery' },
  { id: 'sneaker', kind: 'product', src: uns('photo-1549298916-b41d501d3772'), alt: 'Classic white sneakers' },
  { id: 'crossbody', kind: 'product', src: uns('photo-1553062407-98eeb64c6a62'), alt: 'Everyday compact crossbody bag' },
  { id: 'knit', kind: 'product', src: uns('photo-1434389677669-e08b4cac3105'), alt: 'Soft neutral knitwear' },
  { id: 'jacket', kind: 'product', src: uns('photo-1591047139829-d91aecb6caea'), alt: 'Relaxed cropped jacket' },
  { id: 'longcoat', kind: 'product', src: uns('photo-1544022613-e87ca75a784a'), alt: 'Coat in a neutral tone' },
  { id: 'minibag', kind: 'product', src: uns('photo-1547949003-9792a18a2601'), alt: 'Classic compact shoulder bag' },
  { id: 'summerdress', kind: 'product', src: uns('photo-1496747611176-843222e1e57c'), alt: 'Soft summer dress editorial' },
  { id: 'bootsbrown', kind: 'product', src: uns('photo-1608256246200-53e635b5b65f'), alt: 'Tall leather boots' },
]

if (fashionImageSet.length !== 30) throw new Error('Fashion image set must contain exactly 30 assets')

export const fashionImage = Object.fromEntries(fashionImageSet.map(asset => [asset.id, asset.src]))
const P = (id, brand, name, category, price, colour, group, more = {}) => ({
  id, brand, name, category, price, colour, group, image: fashionImage[id], ...more
})
export const fashionInventory = [
  P('ivory', 'STUDIO', 'Off-shoulder knit top', 'Tops', 29900, 'Ivory', 'mono', { badge: 'Bestseller', fabric: 'Ribbed knit', description: 'A flattering off-shoulder neckline with a refined everyday fit.' }),
  P('pleat', 'STUDIO', 'Pleated mini skirt', 'Bottoms', 49900, 'Black', 'mono', { badge: 'New arrival', fabric: 'Pleated suiting', description: 'Sharp pleats and a sculpted waist, built for easy styling.' }),
  P('boots', 'STUDIO', 'Leather knee-high boots', 'Shoes', 129000, 'Black', 'mono', { fabric: 'Leather look', description: 'A tall, sleek boot that brings definition to every outfit.' }),
  P('tabby', 'STUDIO', 'Structured shoulder bag', 'Bags', 85000, 'Black', 'mono', { badge: 'Popular', fabric: 'Leather look', description: 'A compact structured shape with gold-tone hardware.' }),
  P('wine', 'STUDIO', 'Burgundy leather vest', 'Tops', 72000, 'Burgundy', 'wine', { badge: 'New arrival', fabric: 'Leather look' }),
  P('winepants', 'STUDIO', 'Wine tailored trousers', 'Bottoms', 65500, 'Burgundy', 'wine', { fabric: 'Tailored twill' }),
  P('croco', 'STUDIO', 'Sculpted mini bag', 'Bags', 58000, 'Black', 'wine', { fabric: 'Leather look' }),
  P('heels', 'STUDIO', 'Pointed leather heels', 'Shoes', 45000, 'Black', 'wine', { fabric: 'Leather look' }),
  P('bluecoat', 'STUDIO', 'Blue tailored coat', 'Outerwear', 122000, 'Cobalt blue', 'blue', { badge: 'New arrival', fabric: 'Wool blend' }),
  P('whiteboots', 'STUDIO', 'Ivory knee-high boots', 'Shoes', 79000, 'Ivory', 'blue', { fabric: 'Leather look' }),
  P('rosebag', 'STUDIO', 'Soft shoulder bag', 'Bags', 54000, 'Blush', 'blue', { fabric: 'Leather look' }),
  P('greyskirt', 'STUDIO', 'Tailored city skirt', 'Bottoms', 37500, 'Charcoal', 'blue', { fabric: 'Suiting' }),
  P('linen', 'STUDIO', 'Cotton everyday shirt', 'Tops', 32900, 'White', 'essentials', { badge: 'Essential' }),
  P('widepants', 'STUDIO', 'Relaxed wide-leg trouser', 'Bottoms', 46500, 'Sand', 'essentials'),
  P('blackdress', 'STUDIO', 'Evening slip dress', 'Dresses', 59000, 'Black', 'essentials', { badge: 'Bestseller' }),
  P('gold', 'STUDIO', 'Sculptural gold earrings', 'Accessories', 18000, 'Gold', 'essentials'),
  P('sneaker', 'STUDIO', 'Everyday leather sneaker', 'Shoes', 52000, 'Cream', 'essentials'),
  P('crossbody', 'STUDIO', 'Utility crossbody bag', 'Bags', 39000, 'Tan', 'essentials'),
  P('knit', 'STUDIO', 'Soft crewneck knit', 'Tops', 36000, 'Oat', 'essentials'),
  P('jacket', 'STUDIO', 'Cropped everyday jacket', 'Outerwear', 68000, 'Chocolate', 'essentials'),
  P('longcoat', 'STUDIO', 'Longline tailored coat', 'Outerwear', 112000, 'Camel', 'essentials'),
  P('minibag', 'STUDIO', 'Weekend mini bag', 'Bags', 28500, 'Burgundy', 'essentials'),
  P('summerdress', 'STUDIO', 'The Sunday dress', 'Dresses', 56000, 'Stone', 'essentials'),
  P('bootsbrown', 'STUDIO', 'Brown city boots', 'Shoes', 84500, 'Chocolate', 'essentials'),
]
export const fashionLooks = [
  { id: 'mono', title: 'The City Classic', eyebrow: 'MONOCHROME / LOOK 01', image: fashionImage['look-mono'], products: ['ivory','pleat','boots','tabby'], description: 'Cream knit, black pleats, high boots and a structured black bag. Styled to closely follow the photographed outfit.' },
  { id: 'wine', title: 'The Wine Edit', eyebrow: 'OXBLOOD / LOOK 02', image: fashionImage['look-wine'], products: ['wine','winepants','croco','heels'], description: 'Burgundy tailoring, a compact bag and black heels, matching the palette and silhouette of the photographed look.' },
  { id: 'blue', title: 'Blue Hour', eyebrow: 'COBALT / LOOK 03', image: fashionImage['look-blue'], products: ['bluecoat','whiteboots','rosebag','greyskirt'], description: 'A strong blue coat, pale boots and a soft neutral accent.' },
]
export const fashionCategories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Shoes', 'Bags', 'Accessories']
export const fashionMoney = value => '₦' + Number(value).toLocaleString('en-NG')
export const getFashionProduct = id => fashionInventory.find(p => p.id === id)
export const getFashionLook = id => fashionLooks.find(l => l.id === id)
