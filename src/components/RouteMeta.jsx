import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { buildSchema, getSeoForPath, SITE_URL, SOCIAL_IMAGE } from '../seo'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    element.setAttribute('data-qing-seo', 'true')
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export default function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = getSeoForPath(pathname)
    const canonicalUrl = `${SITE_URL}${seo.path === '/' ? '' : seo.path}`
    document.title = seo.title

    setMeta('name', 'description', seo.description)
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('property', 'og:type', seo.type === 'ProfilePage' ? 'profile' : 'website')
    setMeta('property', 'og:site_name', 'Qing The Creator')
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', SOCIAL_IMAGE)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)
    setMeta('name', 'twitter:image', SOCIAL_IMAGE)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('data-qing-seo', 'true')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    let schema = document.head.querySelector('script[data-qing-schema]')
    if (!schema) {
      schema = document.createElement('script')
      schema.setAttribute('type', 'application/ld+json')
      schema.setAttribute('data-qing-schema', 'true')
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify(buildSchema(seo))
  }, [pathname])

  return null
}
