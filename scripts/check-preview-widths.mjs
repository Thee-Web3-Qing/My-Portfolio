// Guard the design preview's own viewport contract against regressions.
// The host page is responsive but each iframe must retain its selected
// independent CSS viewport: Desktop = 1440px and Mobile = 390px.
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { readFile } from 'node:fs/promises'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { default: ScaledWebsitePreview } = await vite.ssrLoadModule('/src/components/ScaledWebsitePreview.jsx')
  for (const [device, width] of [['desktop', 1440], ['mobile', 390]]) {
    const markup = renderToStaticMarkup(React.createElement(ScaledWebsitePreview, {
      src: '/giftsminimal',
      title: 'Gift design sample',
      device,
      interactive: false,
      className: 'preview-test-frame'
    }))
    if (!markup.includes('data-preview-device="' + device + '"')) {
      throw new Error('Preview did not carry the selected device type: ' + device)
    }
    if (!markup.includes('data-preview-width="' + width + '"')) {
      throw new Error('Preview did not carry its native design width: ' + width)
    }
    if (!markup.includes('width:' + width + 'px')) {
      throw new Error('Iframe is not sized to its native CSS viewport: ' + device)
    }
    if (!markup.includes('transform:scale(')) {
      throw new Error('Iframe visual scaling was removed: ' + device)
    }
    if (!markup.includes('pointer-events:none')) {
      throw new Error('Non-interactive gallery iframe must not capture touch gestures.')
    }
  }
  const salesPage = await readFile('src/pages/December.jsx', 'utf8')
  const gallery = await readFile('src/components/StorefrontPreviewGallery.jsx', 'utf8')
  if (!salesPage.includes('device={previewDevice}') || !gallery.includes('device={device}')) {
    throw new Error('Both preview surfaces must pass the user-selected device.')
  }
  if (!salesPage.includes("previewDevice}") || !gallery.includes("site.id + '-' + device")) {
    throw new Error('Switching the preview device must reset the iframe.')
  }
  console.log('Verified 1440px Desktop and 390px Mobile preview render contracts in both site galleries.')
} finally {
  await vite.close()
}
