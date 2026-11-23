import { Routes, Route } from 'react-router-dom'
  import Nav from './components/Nav.jsx'
  import RouteMeta from './components/RouteMeta.jsx'
  import PortfolioInteractions from './components/PortfolioInteractions.jsx'
  import Footer from './components/Footer.jsx'
  import Home from './pages/Home.jsx'
  import December, { DecemberShortcut } from './pages/December.jsx'
  import { INDUSTRIES, LAYOUTS } from './data/december.js'
  import PaymentCallback from './pages/PaymentCallback.jsx'
  import DecemberDetails from './pages/DecemberDetails.jsx'
  import DecemberProgress from './pages/DecemberProgress.jsx'
  import DecemberAdmin from './pages/DecemberAdmin.jsx'
  import DecemberDemo from './pages/DecemberDemo.jsx'
  import Content from './pages/Content.jsx'
  import Products from './pages/Products.jsx'
  import Hire from './pages/Hire.jsx'
  import Experience from './pages/Experience.jsx'
  import Class from './pages/Class.jsx'
  import Service from './pages/Service.jsx'
  import FashionPlatform from './pages/FashionPlatform.jsx'
  import FoodStorefront from './pages/FoodStorefront.jsx'
  import GiftStorefront from './pages/GiftStorefront.jsx'
  import IndustryStorefront from './pages/IndustryStorefront.jsx'
  import BeautyReferenceStorefront from './pages/BeautyReferenceStorefront.jsx'

  export default function App() {
    return (
      <Routes>
        <Route path="/fashioneditorial/*" element={<FashionPlatform mode="editorial" />} />
        <Route path="/fashioncatalogue/*" element={<FashionPlatform mode="catalogue" />} />
        <Route path="/fashionminimal/*" element={<FashionPlatform mode="minimal" />} />
        <Route path="/foodeditorial/*" element={<FoodStorefront type="editorial" />} />
        <Route path="/foodcatalogue/*" element={<FoodStorefront type="catalogue" />} />
        <Route path="/foodminimal/*" element={<FoodStorefront type="minimal" />} />
        <Route path="/foodartisan/*" element={<FoodStorefront type="artisan" />} />
        <Route path="/giftseditorial/*" element={<GiftStorefront mode="editorial" />} />
        <Route path="/giftscatalogue/*" element={<GiftStorefront mode="catalogue" />} />
        <Route path="/giftsminimal/*" element={<GiftStorefront mode="minimal" />} />
        {['editorial','catalogue','minimal','botanical'].map(variant =>
          <Route key={'beauty'+variant} path={'/beauty'+variant+'/*'} element={<BeautyReferenceStorefront variant={variant} />} />
        )}
        {['events','accessories','hospitality'].flatMap(industry => ['editorial','catalogue','minimal'].map(style =>
          <Route key={industry+style} path={'/'+industry+style+'/*'} element={<IndustryStorefront industry={industry} style={style} />} />
        ))}
        <Route
          path="*"
          element={
            <div className="portfolio-clay min-h-screen flex flex-col">
              <RouteMeta />
              <PortfolioInteractions />
              <Nav />
              <main className="portfolio-main flex-1 max-w-6xl mx-auto px-6 w-full">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/content" element={<Content />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/hire" element={<Hire />} />
                  <Route path="/experience" element={<Experience />} />
                  <Route path="/class" element={<Class />} />
                  <Route path="/december" element={<December />} />
                  <Route path="/december/:industry/:stage?" element={<DecemberShortcut />} />
                  <Route path="/december/demo/:industry" element={<DecemberDemo />} />
                  {INDUSTRIES.flatMap(industry => LAYOUTS.map(style =>
                    <Route key={industry.id + style.id} path={'/' + industry.id + style.id}
                      element={<DecemberDemo previewIndustry={industry.id} previewLayout={style.id} />} />
                  ))}
                  <Route path="/december/details" element={<DecemberDetails />} />
                  <Route path="/december/track" element={<DecemberProgress />} />
                  <Route path="/admin" element={<DecemberAdmin />} />
                  <Route path="/payment/callback" element={<PaymentCallback />} />
                  <Route path="/services/:serviceSlug" element={<Service />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    )
  }
