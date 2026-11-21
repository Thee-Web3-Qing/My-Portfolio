
import { useEffect, useMemo, useState } from 'react'
import { fashionImages as images, fashionProducts as products, money, categories } from './fashionData.js'
import './fashionPreviews.css'

const strokes = {
  search: 'M21 21l-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  bag: 'M5 8h14l1 13H4L5 8ZM9 9V6a3 3 0 0 1 6 0v3',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  arrowUp: 'M7 17 17 7M8 7h9v9',
  close: 'M5 5l14 14M19 5 5 19',
  menu: 'M3 7h18M3 12h18M3 17h18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  filter: 'M4 7h16M7 12h10m-7 5h4',
  check: 'M4 12l5 5L20 6',
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
  spark: 'm12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z',
  hanger: 'M9 6a3 3 0 0 1 6 0c0 2-3 3-3 5l9 7v2H3v-2l9-7',
}

function Icon({ name, size = 19, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={strokes[name] || strokes.arrow} />
    </svg>
  )
}

function Photo({ src, alt, className = '', eager = false }) {
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={(event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80'
  }} />
}

function useShop(title) {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [saved, setSaved] = useState([])
  const [checkout, setCheckout] = useState(false)
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const add = (product, quantity = 1) => {
    setCart((items) => {
      const exists = items.find((item) => item.product.id === product.id)
      return exists
        ? items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...items, { product, quantity }]
    })
    setSelected(null)
    setCheckout(false)
    setCartOpen(true)
  }
  const changeQuantity = (id, step) => setCart((items) => items.map((item) => item.product.id === id ? { ...item, quantity: item.quantity + step } : item).filter((item) => item.quantity > 0))
  const toggleSaved = (id) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  return { title, cart, cartOpen, setCartOpen, selected, setSelected, saved, toggleSaved, checkout, setCheckout, add, changeQuantity, count, total }
}

function ShopOverlays({ shop }) {
  return (
    <>
      {shop.selected && <QuickView key={shop.selected.id} product={shop.selected} onClose={() => shop.setSelected(null)} onAdd={shop.add} />}
      {shop.cartOpen && (
        <div className="fashion-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) shop.setCartOpen(false) }}>
          <aside className="fashion-cart-panel" role="dialog" aria-modal="true" aria-label="Shopping bag">
            <div className="fashion-panel-head">
              <div><span className="fashion-overline">YOUR SELECTION</span><h2>Shopping bag <small>({shop.count})</small></h2></div>
              <button type="button" className="fashion-icon-btn" aria-label="Close bag" onClick={() => shop.setCartOpen(false)}><Icon name="close" /></button>
            </div>
            {shop.cart.length === 0 ? (
              <div className="fashion-empty"><Icon name="bag" size={32} /><h3>Nothing in your bag yet.</h3><p>Find something worth keeping.</p><button type="button" className="fashion-dark-button" onClick={() => shop.setCartOpen(false)}>Continue exploring <Icon name="arrow" /></button></div>
            ) : (
              <>
                <div className="fashion-cart-items">{shop.cart.map(({ product, quantity }) => (
                  <div className="fashion-cart-item" key={product.id}>
                    <Photo src={product.image} alt={product.name} />
                    <div><span className="fashion-overline">{product.brand}</span><h3>{product.name}</h3><p>{product.color}</p><strong>{money(product.price)}</strong><div className="fashion-qty"><button type="button" aria-label={'Remove one ' + product.name} onClick={() => shop.changeQuantity(product.id, -1)}><Icon name="minus" size={14} /></button><span>{quantity}</span><button type="button" aria-label={'Add one ' + product.name} onClick={() => shop.changeQuantity(product.id, 1)}><Icon name="plus" size={14} /></button></div></div>
                  </div>
                ))}</div>
                <div className="fashion-cart-bottom">
                  <div className="fashion-cart-total"><span>Subtotal</span><strong>{money(shop.total)}</strong></div>
                  <p>Shipping and final costs would be calculated at checkout.</p>
                  {shop.checkout && <div className="fashion-demo-notice" role="status"><Icon name="check" /> This is a storefront prototype. A secure payment checkout will be connected for the finished client website.</div>}
                  <button className="fashion-dark-button fashion-full-button" type="button" onClick={() => shop.setCheckout(true)}>Continue to checkout <Icon name="arrow" /></button>
                  <button className="fashion-link-button fashion-full-button" type="button" onClick={() => shop.setCartOpen(false)}>Keep shopping</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  )
}

function QuickView({ product, onClose, onAdd }) {
  const [size, setSize] = useState(product.category === 'Shoes' ? '39' : 'M')
  const [quantity, setQuantity] = useState(1)
  return (
    <div className="fashion-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="fashion-quickview" role="dialog" aria-modal="true" aria-label={'View ' + product.name}>
        <button className="fashion-icon-btn fashion-quick-close" type="button" aria-label="Close details" onClick={onClose}><Icon name="close" /></button>
        <Photo src={product.image} alt={product.name} />
        <div className="fashion-quick-info">
          <span className="fashion-overline">THE EDIT / NEW SEASON</span>
          <h2>{product.name}</h2>
          <p>{product.brand} · {product.color}</p>
          <strong className="fashion-quick-price">{money(product.price)}</strong>
          <p className="fashion-quick-description">Considered everyday style, designed to work beautifully with the rest of your wardrobe. This is sample product information for the website preview.</p>
          {product.category === 'Clothing' || product.category === 'Shoes' ? <><span className="fashion-overline">SELECT SIZE: {size}</span><div className="fashion-sizes">{(product.category === 'Shoes' ? ['38', '39', '40', '41', '42'] : ['XS', 'S', 'M', 'L', 'XL']).map((option) => <button key={option} type="button" aria-pressed={option === size} className={option === size ? 'active' : ''} onClick={() => setSize(option)}>{option}</button>)}</div></> : null}
          <div className="fashion-quick-actions"><div className="fashion-qty"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((n) => Math.max(1, n - 1))}><Icon name="minus" size={15} /></button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((n) => n + 1)}><Icon name="plus" size={15} /></button></div><button type="button" className="fashion-dark-button" onClick={() => onAdd(product, quantity)}>Add to bag <Icon name="arrow" /></button></div>
          <div className="fashion-quick-support"><span>Complimentary styling guidance</span><span>Easy returns on eligible items</span></div>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product, shop, variant = 'catalogue' }) {
  const isSaved = shop.saved.includes(product.id)
  return (
    <article className={'fashion-product fashion-product--' + variant}>
      <div className="fashion-product-image">
        <button type="button" className="fashion-product-photo" onClick={() => shop.setSelected(product)} aria-label={'View ' + product.name}><Photo src={product.image} alt={product.name} /></button>
        <span className="fashion-product-tag">{product.tag}</span>
        <button type="button" className={'fashion-favorite ' + (isSaved ? 'is-saved' : '')} aria-label={isSaved ? 'Remove from saved pieces' : 'Save this piece'} aria-pressed={isSaved} onClick={() => shop.toggleSaved(product.id)}><Icon name="heart" size={18} /></button>
        <button type="button" className="fashion-product-add" onClick={() => shop.add(product)} aria-label={'Add ' + product.name + ' to bag'}><Icon name="plus" size={19} /></button>
      </div>
      <div className="fashion-product-info"><div><span>{product.subcategory}</span><button type="button" onClick={() => shop.setSelected(product)}>{product.name}</button></div><strong>{money(product.price)}</strong></div>
    </article>
  )
}

function Newsletter({ variant = '' }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <form className={'fashion-newsletter-form ' + variant} onSubmit={(event) => { event.preventDefault(); if (email.includes('@')) setDone(true) }}>
      {done ? <p role="status">This form is a preview. Mailing-list signup will be connected during client setup.</p> : <><label className="sr-only" htmlFor={'fashion-email-' + variant}>Email address</label><input id={'fashion-email-' + variant} type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button aria-label="Join mailing list" type="submit"><Icon name="arrow" /></button></>}
    </form>
  )
}

function FashionFooter({ brand, tone = '' }) {
  return <footer className={'fashion-footer ' + tone}><div><span className="fashion-footer-brand">{brand}</span><p>Good clothes. Great stories. Your kind of style.</p></div><div className="fashion-footer-links"><a href="#top">Back to top ↑</a><span>Contact available at launch</span><span>© 2026 {brand}</span></div><small>CONCEPT STOREFRONT · SAMPLE CONTENT & PRICING</small></footer>
}

function FashionRouteMeta({ title }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title + ' | Fashion Website Concept'
    return () => { document.title = previousTitle }
  }, [title])
  return null
}

export function FashionEditorial() {
  const shop = useShop('MODE')
  const [menu, setMenu] = useState(false)
  const editorialPicks = products.filter((product) => product.editorial)
  return (
    <div className="fashion-site fashion-editorial" id="top">
      <FashionRouteMeta title="MODE Editorial" />
      <div className="fe-announcement">NEW SEASON. NEW RULES. <span>COMPLIMENTARY SHIPPING OVER ₦100,000</span> <Icon name="spark" size={13} /></div>
      <header className="fe-header"><button type="button" className="fe-menu-trigger" aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name={menu ? 'close' : 'menu'} size={21} /> <span>MENU</span></button><a href="#top" className="fe-logo">MØDE<span>®</span></a><div className="fe-header-right"><a href="#fe-collection">COLLECTIONS</a><a href="#fe-shop">SHOP ALL</a><button type="button" aria-label="Open shopping bag" onClick={() => shop.setCartOpen(true)}><Icon name="bag" size={21} /><span>{shop.count}</span></button></div></header>
      {menu && <nav className="fe-mobile-menu"><a href="#fe-collection" onClick={() => setMenu(false)}>Collections <Icon name="arrowUp" /></a><a href="#fe-shop" onClick={() => setMenu(false)}>Shop the edit <Icon name="arrowUp" /></a><a href="#fe-story" onClick={() => setMenu(false)}>Our story <Icon name="arrowUp" /></a></nav>}
      <main>
        <section className="fe-hero">
          <div className="fe-hero-words"><div className="fe-hero-topline"><span>VOL. 06 / 2026</span><span>THE NEW ATTITUDE</span></div><h1>WEAR<br />YOUR<br /><em>ENERGY.</em></h1><div className="fe-hero-bottom"><span>YOUR LOOK. YOUR LANGUAGE.</span><a href="#fe-collection">DISCOVER THE DROP <Icon name="arrowUp" size={20} /></a></div></div>
          <div className="fe-hero-photo"><Photo src={images.editorialHero} alt="Fashion model in sculptural ivory tailoring" eager /><div className="fe-hero-image-label"><span>01 / THE EDIT</span><span>UNAPOLOGETICALLY YOU</span></div></div>
          <div className="fe-hero-vertical">THE NEW SEASON IS HERE <span>✳</span> BREAK THE UNIFORM</div>
        </section>
        <div className="fe-ticker" aria-label="Dress like you mean it"><div>NOT HERE TO BLEND IN <span>✳</span> MADE TO BE SEEN <span>✳</span> NOT HERE TO BLEND IN <span>✳</span> MADE TO BE SEEN <span>✳</span></div></div>
        <section className="fe-intro" id="fe-collection"><div><span className="fashion-overline">01 / THE STORY</span><h2>EVERY DAY<br />IS A <em>RUNWAY.</em></h2></div><div className="fe-intro-side"><p>Clothes that say everything before you say a word. A modern wardrobe for people who dress for themselves.</p><a href="#fe-shop" className="fe-underlined">EXPLORE NEW ARRIVALS <Icon name="arrowUp" /></a></div></section>
        <section className="fe-mosaic" aria-label="Shop fashion collections"><a href="#fe-shop" className="fe-mosaic-item fe-mosaic-big"><Photo src={images.editorialStreet} alt="Contemporary fashion street-style campaign" /><div><span>01 / EVERYDAY ICONS</span><h3>OFF THE<br />CLOCK.</h3><span>DISCOVER COLLECTION ↗</span></div></a><a href="#fe-shop" className="fe-mosaic-item fe-mosaic-small"><Photo src={images.editorialSecond} alt="Vibrant editorial styling and tailoring" /><div><span>02 / THE COLOR ISSUE</span><h3>DO MORE.<br />WEAR MORE.</h3><span>SHOP THE EDIT ↗</span></div></a></section>
        <section className="fe-shop-section" id="fe-shop"><div className="fe-section-heading"><div><span className="fashion-overline">02 / CURATED TO GET NOTICED</span><h2>THE GOOD<br /><i>STUFF.</i></h2></div><p>Some pieces just have main-character energy. These are those pieces.</p></div><div className="fe-product-grid">{editorialPicks.map((product) => <ProductCard key={product.id} product={product} shop={shop} variant="editorial" />)}</div></section>
        <section className="fe-story" id="fe-story"><div className="fe-story-photo"><Photo src={images.editorialCampaign} alt="Fashion portrait featuring expressive style" /></div><div className="fe-story-copy"><span className="fashion-overline">03 / STYLE IS PERSONAL</span><h2>LESS RULES.<br /><em>MORE YOU.</em></h2><p>For the woman who makes the room her own. Unexpected combinations, everyday confidence, and pieces that work overtime.</p><a href="#fe-shop">FIND YOUR NEXT LOOK <Icon name="arrowUp" /></a></div></section>
        <section className="fe-newsletter"><div><span>AN INVITATION TO THE INSIDE.</span><h2>GOOD TASTE<br />LOOKS GOOD ON YOU.</h2></div><div><p>New drops, private previews, and a little something extra in your inbox.</p><Newsletter variant="fe-newsletter-field" /></div></section>
      </main>
      <FashionFooter brand="MØDE" tone="fe-footer" />
      <ShopOverlays shop={shop} />
    </div>
  )
}

export function FashionCatalogue() {
  const shop = useShop('THE EDIT')
  const [category, setCategory] = useState('All pieces')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [savedOnly, setSavedOnly] = useState(false)
  const [lookIds, setLookIds] = useState([1, 2, 3])
  const filtered = useMemo(() => {
    const result = products.filter((product) => (category === 'All pieces' || product.category === category) && (!savedOnly || shop.saved.includes(product.id)) && (product.name + ' ' + product.subcategory + ' ' + product.color).toLowerCase().includes(query.toLowerCase().trim()))
    if (sort === 'low') result.sort((a, b) => a.price - b.price)
    if (sort === 'high') result.sort((a, b) => b.price - a.price)
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [category, query, sort, savedOnly, shop.saved])
  const look = products.filter((product) => lookIds.includes(product.id))
  const lookTotal = look.reduce((sum, product) => sum + product.price, 0)
  const addLookItem = (id) => setLookIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id].slice(-4))
  return (
    <div className="fashion-site fashion-catalogue" id="top">
      <FashionRouteMeta title="The Edit Catalogue" />
      <div className="fc-topline">THE NEW-SEASON EDIT <span>FREE DELIVERY ON ORDERS OVER ₦100,000</span> EASY RETURNS</div>
      <header className="fc-header"><a href="#top" className="fc-logo">the edit<span>.</span></a><nav><a href="#catalogue-shop">SHOP ALL</a><a href="#catalogue-shop" onClick={() => setCategory('Clothing')}>CLOTHING</a><a href="#catalogue-shop" onClick={() => setCategory('Accessories')}>ACCESSORIES</a><a href="#catalogue-look">STYLE STUDIO</a></nav><div className="fc-header-actions"><button aria-label="Show saved items" type="button" onClick={() => { setSavedOnly(!savedOnly); document.getElementById('catalogue-shop')?.scrollIntoView({ behavior: 'smooth' }) }}><Icon name="heart" size={21} /><sup>{shop.saved.length || ''}</sup></button><button type="button" onClick={() => shop.setCartOpen(true)} aria-label="Open bag"><Icon name="bag" size={21} /><sup>{shop.count}</sup></button></div></header>
      <main>
        <section className="fc-hero"><div className="fc-hero-copy"><span className="fashion-overline">THE DECEMBER WARDROBE · ISSUE 01</span><h1>Find your<br /><em>next favourite.</em></h1><p>Easy pieces. Better outfits. Everything worth adding to your wardrobe, all in one place.</p><a href="#catalogue-shop">SHOP THE COLLECTION <Icon name="arrow" /></a><div className="fc-hero-mini"><span>CURATED WITH INTENTION</span><span>01 / 04</span></div></div><div className="fc-hero-visual"><Photo src={images.catalogueHero} alt="Friends finding their style while shopping fashion" eager /><span className="fc-hero-badge">DRESS FOR<br /><em>YOURSELF.</em></span></div></section>
        <div className="fc-perks"><span>✳ NEW ARRIVALS WEEKLY</span><span>✳ SHOP YOUR WHOLE LOOK</span><span>✳ STYLE IT YOUR WAY</span></div>
        <section className="fc-shop-intro" id="catalogue-shop"><div><span className="fashion-overline">FIND WHAT FEELS LIKE YOU</span><h2>The collection<span>({products.length})</span></h2></div><p>The pieces you'll reach for again and again. Discover your wardrobe, your way.</p></section>
        <section className="fc-catalogue-layout">
          <aside className={'fc-filters ' + (showFilters ? 'fc-filters-open' : '')} aria-label="Product filters">
            <div className="fc-filter-head"><span>FILTER THE EDIT</span><button type="button" className="fc-mobile-only" onClick={() => setShowFilters(false)} aria-label="Close filters"><Icon name="close" /></button></div>
            <div className="fc-filter-block"><h3>Category</h3>{categories.map((name) => <button type="button" key={name} className={category === name ? 'fc-filter-active' : ''} onClick={() => { setCategory(name); setShowFilters(false) }}><span>{name}</span><span>{name === 'All pieces' ? products.length : products.filter((p) => p.category === name).length}</span></button>)}</div>
            <div className="fc-filter-block"><h3>Your edit</h3><label className="fc-checkbox"><input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} /><span>Show saved pieces only</span></label></div>
            <div className="fc-styling-banner"><Icon name="spark" size={22} /><span>GOOD OUTFITS START HERE.</span><p>Build your look in the style studio.</p><a href="#catalogue-look">TRY THE STYLE STUDIO <Icon name="arrowUp" /></a></div>
          </aside>
          <div className="fc-results"><div className="fc-tools"><label className="fc-search"><Icon name="search" size={19} /><input type="search" placeholder="Search clothing, shoes, accessories..." value={query} onChange={(e) => setQuery(e.target.value)} /></label><button type="button" className="fc-filter-toggle" onClick={() => setShowFilters(!showFilters)}><Icon name="filter" size={18} /> Filters</button><label className="fc-sort">SORT BY <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div><div className="fc-results-count">SHOWING {filtered.length} PIECES {savedOnly ? '/ YOUR SAVED EDIT' : ''}</div>{filtered.length ? <div className="fc-product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} shop={shop} variant="catalogue" />)}</div> : <div className="fc-no-results"><h3>No pieces found.</h3><p>Try a different search or category.</p><button type="button" onClick={() => { setCategory('All pieces'); setQuery(''); setSavedOnly(false) }}>Clear filters <Icon name="arrow" /></button></div>}</div>
        </section>
        <section className="fc-look-section" id="catalogue-look"><div className="fc-look-heading"><span className="fashion-overline">THE STYLE STUDIO / AN INTERACTIVE PREVIEW</span><h2>One look. <em>All yours.</em></h2><p>Choose pieces from the rail, build an outfit, and add the full edit to your bag.</p></div><div className="fc-look-builder"><div className="fc-look-feature"><Photo src={images.catalogueDetail} alt="Everyday wardrobe outfit inspiration" /><div className="fc-look-stamp"><Icon name="hanger" size={20} /> MIX & MATCH YOUR OWN LOOK</div></div><div className="fc-look-editor"><div className="fc-look-editor-header"><span>YOUR LOOK</span><span>{look.length} PIECES</span></div><div className="fc-selected-look">{look.length ? look.map((product) => <div key={product.id} className="fc-look-item"><Photo src={product.image} alt={product.name} /><div><strong>{product.name}</strong><span>{product.subcategory}</span><b>{money(product.price)}</b></div><button type="button" aria-label={'Remove ' + product.name + ' from look'} onClick={() => addLookItem(product.id)}><Icon name="close" size={16} /></button></div>) : <p className="fc-look-empty">Choose from the rail below to build your look.</p>}</div><div className="fc-look-rail-title"><span>ADD TO YOUR LOOK</span><span>CHOOSE UP TO FOUR</span></div><div className="fc-look-rail">{products.slice(0, 9).map((product) => <button key={product.id} type="button" className={lookIds.includes(product.id) ? 'active' : ''} aria-pressed={lookIds.includes(product.id)} title={product.name} onClick={() => addLookItem(product.id)}><Photo src={product.image} alt={product.name} /><span>{lookIds.includes(product.id) ? '✓' : '+'}</span></button>)}</div><div className="fc-look-total"><span>YOUR LOOK TOTAL</span><strong>{money(lookTotal)}</strong></div><button type="button" disabled={!look.length} className="fashion-dark-button fashion-full-button" onClick={() => look.forEach((product) => shop.add(product))}>ADD THE LOOK TO BAG <Icon name="arrow" /></button><p className="fc-look-disclaimer">Style studio is a mix-and-match preview, not an AI or 3D fitting room.</p></div></div></section>
        <section className="fc-bottom-banner"><div><span className="fashion-overline">THE LATEST IN STYLE</span><h2>Wear what<br />moves you.</h2><p>Discover outfits worth repeating.</p><a href="#catalogue-shop">SHOP NOW <Icon name="arrowUp" /></a></div><Photo src={images.editorialSecond} alt="Model wearing bold contemporary fashion" /></section>
      </main>
      <FashionFooter brand="the edit." tone="fc-footer" />
      <ShopOverlays shop={shop} />
    </div>
  )
}

export function FashionMinimal() {
  const shop = useShop('FORME')
  const [menu, setMenu] = useState(false)
  const minimalPieces = products.filter((product) => product.minimal)
  return (
    <div className="fashion-site fashion-minimal" id="top">
      <FashionRouteMeta title="FORME Minimal" />
      <div className="fm-announcement">Complimentary delivery on orders over ₦100,000 <span>Discover the new collection</span></div>
      <header className="fm-header"><a href="#top" className="fm-logo">FORME<span>STUDIO</span></a><nav className={menu ? 'fm-nav-open' : ''}><a href="#fm-collection" onClick={() => setMenu(false)}>Collection</a><a href="#fm-products" onClick={() => setMenu(false)}>Shop</a><a href="#fm-about" onClick={() => setMenu(false)}>Our philosophy</a></nav><div className="fm-actions"><button type="button" onClick={() => shop.setCartOpen(true)} aria-label="Open bag">Bag ({shop.count})</button><button type="button" className="fm-menu" aria-label="Toggle navigation" onClick={() => setMenu(!menu)}><Icon name={menu ? 'close' : 'menu'} size={20} /></button></div></header>
      <main>
        <section className="fm-hero"><div className="fm-hero-copy"><span className="fashion-overline">COLLECTION 01 · THE ART OF LESS</span><h1>Pieces for<br />the way <em>you live.</em></h1><p>Quiet confidence, beautiful simplicity, and the kind of clothing you reach for every day.</p><a href="#fm-products">Explore collection <Icon name="arrowUp" size={17} /></a><div className="fm-hero-number"><span>EST. 2026</span><span>01 / 03</span></div></div><div className="fm-hero-image"><Photo src={images.minimalHero} alt="Minimalist women's fashion in a clean architectural setting" eager /><span>THE EVERYDAY EDIT</span></div></section>
        <section className="fm-statement" id="fm-about"><span className="fashion-overline">A CONSIDERED WARDROBE</span><p>We believe the most beautiful thing you can wear is <em>being yourself.</em></p><span>MADE FOR THE MOMENTS BETWEEN EVERYTHING.</span></section>
        <section className="fm-collections" id="fm-collection"><div className="fm-section-top"><div><span className="fashion-overline">AN EDIT OF ESSENTIALS</span><h2>Find your form.</h2></div><a href="#fm-products">View all pieces <Icon name="arrowUp" size={17} /></a></div><div className="fm-collection-grid"><a href="#fm-products" className="fm-collection-card fm-collection-one"><Photo src={images.minimalFeature} alt="Fashion portrait from the everyday collection" /><div><span>01 /</span><h3>The everyday</h3><span>Discover pieces ↗</span></div></a><a href="#fm-products" className="fm-collection-card fm-collection-two"><Photo src={images.editorialHero} alt="Elegant ivory tailored suit on a model" /><div><span>02 /</span><h3>The tailored edit</h3><span>Discover pieces ↗</span></div></a></div></section>
        <section className="fm-products-section" id="fm-products"><div className="fm-section-top"><div><span className="fashion-overline">A FEW FAVOURITES</span><h2>Worth keeping.</h2></div><span className="fm-section-note">A simple wardrobe, thoughtfully chosen.</span></div><div className="fm-product-grid">{minimalPieces.map((product) => <ProductCard key={product.id} product={product} shop={shop} variant="minimal" />)}</div></section>
        <section className="fm-note"><div className="fm-note-image"><Photo src={images.minimalDetail} alt="Neutral clothes and wardrobe details" /></div><div className="fm-note-copy"><span className="fashion-overline">THE FORME POINT OF VIEW</span><h2>Less noise.<br /><em>More meaning.</em></h2><p>Clothing for your real life, not just the photograph. Pieces to wear slowly, love deeply, and make entirely your own.</p><a href="#fm-products">Find your piece <Icon name="arrowUp" size={17} /></a></div></section>
        <section className="fm-newsletter"><span className="fashion-overline">LET'S KEEP IN TOUCH</span><h2>A little note from us.</h2><p>New collections, thoughtful stories and early access. Only the good things.</p><Newsletter variant="fm-newsletter-field" /></section>
      </main>
      <FashionFooter brand="FORME" tone="fm-footer" />
      <ShopOverlays shop={shop} />
    </div>
  )
}
