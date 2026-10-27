import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const interactiveSelector = [
  '.portfolio-project-card',
  '.portfolio-service-card',
  '.portfolio-case-card',
  '.portfolio-creative-card',
  '.portfolio-content-card',
  '.portfolio-award-card',
  '.portfolio-hire-service',
  '.portfolio-offer-card',
  '.portfolio-consult-card',
  '.portfolio-timeline-row',
].join(',')

export default function PortfolioInteractions() {
  const location = useLocation()

  useEffect(() => {
    const root = document.querySelector('.portfolio-clay')
    if (!root) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cards = [...root.querySelectorAll(interactiveSelector)]

    cards.forEach((card, index) => {
      card.classList.add('portfolio-reveal')
      card.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 55}ms`)
    })

    const observer = reducedMotion
      ? null
      : new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('portfolio-visible')
              observer.unobserve(entry.target)
            }
          })
        }, { threshold: 0.12, rootMargin: '0px 0px -35px' })

    cards.forEach((card) => {
      if (observer) observer.observe(card)
      else card.classList.add('portfolio-visible')
    })

    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const tiltCards = supportsHover && !reducedMotion ? cards : []

    const cleanups = tiltCards.map((card) => {
      const handleMove = (event) => {
        const bounds = card.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5
        card.style.setProperty('--tilt-x', `${(-y * 2.4).toFixed(2)}deg`)
        card.style.setProperty('--tilt-y', `${(x * 2.8).toFixed(2)}deg`)
        card.style.setProperty('--glow-x', `${((x + 0.5) * 100).toFixed(0)}%`)
        card.style.setProperty('--glow-y', `${((y + 0.5) * 100).toFixed(0)}%`)
      }

      const handleLeave = () => {
        card.style.removeProperty('--tilt-x')
        card.style.removeProperty('--tilt-y')
        card.style.removeProperty('--glow-x')
        card.style.removeProperty('--glow-y')
      }

      card.addEventListener('pointermove', handleMove)
      card.addEventListener('pointerleave', handleLeave)
      return () => {
        card.removeEventListener('pointermove', handleMove)
        card.removeEventListener('pointerleave', handleLeave)
      }
    })

    const updateScroll = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty('--page-progress', distance > 0 ? `${window.scrollY / distance}` : '0')
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })

    return () => {
      observer?.disconnect()
      cleanups.forEach((cleanup) => cleanup())
      window.removeEventListener('scroll', updateScroll)
    }
  }, [location.pathname])

  return null
}
