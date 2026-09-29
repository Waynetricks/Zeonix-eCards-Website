# Zeonix eCards — Website

Official marketing website for **Zeonix eCards**, the digital invitation
service from Zeonix Software Company (Dar es Salaam, Tanzania).

Built with **React + TypeScript + Tailwind CSS** (Vite), structured as
reusable components so it can later connect to the Smart Invite backend
(guest lists, QR generation, WhatsApp/SMS delivery, scanning, attendance
tracking, and event reports).

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm start          # production server (serves dist/ + API on one port)
```

Requires Node.js 18+.

## Going live

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full production deployment
guide: hosting (Railway / Render / VPS), environment variables, connecting
the zeonixecards.com domain, email setup, and a post-deploy test checklist.
In production one Node process serves both the site and the API from the
same origin — no CORS configuration needed.


## Project structure

```
src/
  components/
    Navbar.tsx            Sticky nav with mobile menu
    Hero.tsx               Hero section with animated card stack
    Services.tsx           Event types offered
    HowItWorks.tsx         4-step process
    SmartInvitations.tsx   QR / personalisation / guest tracking explainer
    Gallery.tsx             Filterable design gallery
    WhyZeonix.tsx           Differentiators
    AboutUs.tsx             Studio + parent company intro
    ContactOrder.tsx        Inquiry form + contact channels
    Footer.tsx
    ui/
      Button.tsx
      SectionHeading.tsx
      InvitationCard.tsx    Decorative SVG card mockup (Hero/About only)
      PortfolioCard.tsx     Real gallery design thumbnail
      Lightbox.tsx           Full-screen design preview
      InstagramIcon.tsx
  data/
    services.ts             Content for the Services section
    portfolio.ts             Real client designs shown in the Gallery
    mockups.ts               Decorative mockups for Hero/About only
  types/
    index.ts                 Shared TypeScript types
  index.css                  Design tokens usage, base styles
tailwind.config.js            Brand colors, fonts, animations
```

## Brand tokens (tailwind.config.js)

Sampled directly from the official Zeonix eCards logo mark.

| Token            | Hex       | Use                          |
|-------------------|-----------|-------------------------------|
| `ink`             | `#0C2521` | Primary dark / text on light  |
| `brand`           | `#81BE46` | Logo green — icons, borders   |
| `brand.deep`      | `#4C7A26` | Accessible text, links, buttons|
| `brand.bright`    | `#9BD35E` | Accents on dark surfaces      |
| `brand.soft`      | `#EEF6E4` | Soft tinted surfaces, badges  |
| `paper`           | `#FCFDFC` | Background / light surfaces   |
| `stone`           | `#5C6B63` | Muted body text                |

Fonts: **Sora** (display/headings — echoes the logo's bold geometric
wordmark) + **Inter** (body/UI), loaded via Google Fonts in `src/index.css`.

## Logo assets (public/brand)

- `zeonix-logo-full.png` — full lockup (mark + wordmark), transparent
  background, used in the navbar and on a light plate in the footer.
- `zeonix-icon.png` — the circular mark only, cropped tight, used as the
  source for `public/favicon.png`.

Both were generated from the original logo file by trimming whitespace and
removing the white background — the artwork itself was not redrawn or
recolored. If the logo is ever updated, replace these two files (and
`favicon.png`) with new exports from the same process.

## Gallery / portfolio (src/data/portfolio.ts)

The Gallery section shows real Zeonix eCards client designs, not
placeholders. Images live in `public/gallery/` and are referenced,
unmodified, from `src/data/portfolio.ts`.

**To add a new design:**
1. Drop the image file in `public/gallery/`.
2. Add an entry to `portfolioDesigns` in `src/data/portfolio.ts` with its
   `category`, a short `title`, the image path, and its pixel `width`/
   `height` (used to size the masonry layout correctly before the image
   loads — check an image's dimensions with any image viewer or
   `file <image>` on the command line).

The gallery filters by `category` automatically and the lightbox (click to
preview) works with any number of designs. Categories with no designs yet
show a friendly placeholder instead of an empty grid.

Note: `src/data/mockups.ts` is a separate, smaller set of illustrative SVG
card mockups used only for ambient decoration in the Hero and About
sections — it's unrelated to the real portfolio.

## Connecting to the Smart Invite backend

The site is intentionally decoupled from data:

- `src/data/services.ts` and `src/data/gallery.ts` hold static content today —
  swap these for API calls once the backend exists.
- `ContactOrder.tsx`'s `handleSubmit` currently just flips local state to show
  a confirmation message — wire it to your inquiry/order endpoint here.
- `InvitationCard.tsx` takes a typed `GalleryDesign` prop — real invitation
  designs, guest records, and QR codes can replace the illustrative SVG
  motifs without touching layout code elsewhere.

## Editing contact details

WhatsApp, phone, Instagram, and location appear in `ContactOrder.tsx` and
`Footer.tsx`. Update both if any of these change.
