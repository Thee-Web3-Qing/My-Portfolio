# Giwa Sheedah — Portfolio Site

A Vite + React + Tailwind portfolio showcasing creative direction, Web3 storytelling, hackathon products, and event hosting experience.

## Quick start

```bash
npm install
npm run dev
```

Open the printed localhost URL and start editing.

## Build & deploy

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or GitHub Pages.

- **Vercel/Netlify**: Connect repo, set build command to `npm run build`, output to `dist/`. Done.

## What to customize

| Page | What's in it | File |
|---|---|---|
| Navigation | Name, nav links | `src/components/Nav.jsx` |
| Footer | Email, social links | `src/components/Footer.jsx` |
| Home | Hero copy, tagline | `src/pages/Home.jsx` |
| Content | 3 content channels + top 3 pieces each | `src/pages/Content.jsx` |
| Products | Hackathon builds, links, tags | `src/pages/Products.jsx` |
| Hire | Offers, consultation, payment links | `src/pages/Hire.jsx` |
| Experience | Roles, events, awards | `src/pages/Experience.jsx` |

All files have `// EDIT` comments where you should add/change content.

## Setting up payments

### Stripe (card payments)

1. Go to **Stripe Dashboard** → **Payment Links**.
2. Create a new link for your consultation (one-time or recurring).
3. Copy the generated URL.
4. Paste into `STRIPE_PAYMENT_LINK` in `src/pages/Hire.jsx`.

No backend needed — Stripe hosts the checkout page.

### Crypto (wallet address)

1. Add your wallet address to `CRYPTO_ADDRESS` in `src/pages/Hire.jsx`.
2. The page shows a copy button. For verification, ask clients to email the tx hash.

## Design

- **Palette**: Warm paper (#FAF6EF), ink black (#16161D), electric purple (#6E5BFF), coral (#FF6A4D), lime (#D6FF3F).
- **Type**: Bricolage Grotesque (display), Inter (body), Space Mono (labels/code).
- **Signature**: The "Channel Stack" — your 3 content styles frame as channels (CH.01/02/03) that fan out on hover like a radio dial.

## Key features

- Multi-page routing with React Router
- Responsive design (mobile-first)
- Accessible focus states and reduced-motion support
- Noise texture overlay on cards
- Playful, experimental aesthetic (as requested)

## After launch

- Replace `qinglidah@gmail.com` in Footer + Hire page with your email address
- Add real Stripe Payment Link URL
- Add real crypto wallet address
- Customize all content sections with your actual pieces, links, and copy
- Deploy to Vercel or Netlify

---

Built for loud ideas. Shipped everywhere.