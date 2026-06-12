import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Content from './pages/Content.jsx'
import Products from './pages/Products.jsx'
import Hire from './pages/Hire.jsx'
import Experience from './pages/Experience.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-6xl mx-auto px-6 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/content" element={<Content />} />
          <Route path="/products" element={<Products />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/experience" element={<Experience />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}