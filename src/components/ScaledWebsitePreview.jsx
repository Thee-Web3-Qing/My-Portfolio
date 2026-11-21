import { useEffect, useRef, useState } from 'react'

/**
 * A genuine responsive website preview, independent of the viewer's screen.
 *
 * "desktop" always renders the iframe with a 1440px-wide viewport and scales
 * the rendered result down to fit the available box. "mobile" always renders
 * at a 390px viewport. The parent page remains fully responsive.
 *
 * Resizing the preview does not change its internal responsive breakpoint.
 */
export default function ScaledWebsitePreview({
  src,
  title,
  device = 'desktop',
  interactive = true,
  className = '',
}) {
  const containerRef = useRef(null)
  const viewportWidth = device === 'mobile' ? 390 : 1440
  const [size, setSize] = useState({ scale: 1, height: 800 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const boxWidth = container.clientWidth
      const boxHeight = container.clientHeight
      if (!boxWidth || !boxHeight) return

      const scale = Math.max(0.05, Math.min(1, boxWidth / viewportWidth))
      const height = Math.ceil(boxHeight / scale)

      setSize(previous => (
        Math.abs(previous.scale - scale) < 0.0001 && previous.height === height
          ? previous
          : { scale, height }
      ))
    }

    update()
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(update)
      : null

    observer?.observe(container)
    window.addEventListener('resize', update)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [viewportWidth])

  return (
    <div
      ref={containerRef}
      className={className}
      data-preview-device={device}
      data-preview-width={viewportWidth}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <iframe
        key={src + ':' + device}
        src={src}
        title={title}
        loading="lazy"
        tabIndex={interactive ? 0 : -1}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          width: viewportWidth + 'px',
          minWidth: viewportWidth + 'px',
          maxWidth: 'none',
          height: size.height + 'px',
          border: 0,
          backgroundColor: '#fff',
          transform: 'scale(' + size.scale + ')',
          transformOrigin: 'top left',
          pointerEvents: interactive ? 'auto' : 'none',
        }}
      />
    </div>
  )
}
