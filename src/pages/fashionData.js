
/**
 * December fashion storefront prototypes.
 * All photography is temporary Unsplash imagery. Replace the URLs here
 * with the client's approved campaign and product photography.
 * Prices, names and stock are illustrative prototype data.
 */
const photo = (id, width = 1000) => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + width + '&q=85'

export const fashionImages = {
  editorialHero: photo('photo-1744616451132-086c11ce9862', 1700),
  editorialSecond: photo('photo-1629511565591-a1d494ad6c58', 1300),
  editorialDetail: photo('photo-1539109136881-3be0616acf4b', 1100),
  editorialStreet: photo('photo-1529139574466-a303027c1d8b', 1300),
  editorialCampaign: photo('photo-1515886657613-9f3515b0c78f', 1400),
  catalogueHero: photo('photo-1483985988355-763728e1935b', 1600),
  catalogueDetail: photo('photo-1490481651871-ab68de25d43d', 1200),
  minimalHero: photo('photo-1539109136881-3be0616acf4b', 1600),
  minimalFeature: photo('photo-1509631179647-0177331693ae', 1200),
  minimalDetail: photo('photo-1483985988355-763728e1935b', 1400),
}

export const fashionProducts = [
  { id: 1, name: 'Sculpted Blazer', brand: 'THE EDIT', category: 'Clothing', subcategory: 'Jackets', price: 68000, color: 'Stone', tag: 'Bestseller', image: photo('photo-1591047139829-d91aecb6caea'), editorial: true, minimal: true },
  { id: 2, name: 'Muse Pleated Skirt', brand: 'THE EDIT', category: 'Clothing', subcategory: 'Skirts', price: 42000, color: 'Charcoal', tag: 'New', image: photo('photo-1583496661160-fb5886a13d27'), editorial: true },
  { id: 3, name: 'Everyday Structured Bag', brand: 'THE EDIT', category: 'Accessories', subcategory: 'Bags', price: 55000, color: 'Black', tag: 'Popular', image: photo('photo-1548036328-c9fa89d128fa'), editorial: true, minimal: true },
  { id: 4, name: 'City Leather Boots', brand: 'THE EDIT', category: 'Shoes', subcategory: 'Boots', price: 82000, color: 'Espresso', tag: 'New', image: photo('photo-1608256246200-53e635b5b65f'), editorial: true },
  { id: 5, name: 'The Cotton Shirt', brand: 'THE EDIT', category: 'Clothing', subcategory: 'Tops', price: 32000, color: 'Ivory', tag: 'Essential', image: photo('photo-1598554747436-c9293d6a588f'), minimal: true },
  { id: 6, name: 'Wide-Leg Trousers', brand: 'THE EDIT', category: 'Clothing', subcategory: 'Trousers', price: 46000, color: 'Sand', tag: 'Bestseller', image: photo('photo-1594633312681-425c7b97ccd1'), minimal: true },
  { id: 7, name: 'The Weekend Set', brand: 'THE EDIT', category: 'Clothing', subcategory: 'Sets', price: 74000, color: 'Oat', tag: 'New', image: photo('photo-1483985988355-763728e1935b'), minimal: true },
  { id: 8, name: 'Signature Mini Bag', brand: 'THE EDIT', category: 'Accessories', subcategory: 'Bags', price: 39000, color: 'Wine', tag: 'Just in', image: photo('photo-1584917865442-de89df76afd3') },
  { id: 9, name: 'The Slip Dress', brand: 'THE EDIT', category: 'Clothing', subcategory: 'Dresses', price: 59000, color: 'Ink', tag: 'New', image: photo('photo-1539008835657-9e8e9680c956'), minimal: true },
  { id: 10, name: 'Gold Form Hoops', brand: 'THE EDIT', category: 'Accessories', subcategory: 'Jewellery', price: 18000, color: 'Gold', tag: 'Essential', image: photo('photo-1535632066927-ab7c9ab60908') },
  { id: 11, name: 'The Everyday Sneaker', brand: 'THE EDIT', category: 'Shoes', subcategory: 'Sneakers', price: 52000, color: 'Cream', tag: 'Popular', image: photo('photo-1549298916-b41d501d3772') },
  { id: 12, name: 'Classic Crossbody', brand: 'THE EDIT', category: 'Accessories', subcategory: 'Bags', price: 44000, color: 'Tan', tag: 'New', image: photo('photo-1553062407-98eeb64c6a62') },
]

export const money = (value) => '₦' + Number(value).toLocaleString('en-NG')
export const categories = ['All pieces', 'Clothing', 'Shoes', 'Accessories']
