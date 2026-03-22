# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Jersey Trust corporate website. Marketing site for a UAE-based Corporate Services Provider specialising in RAK ICC Foundations.

- **Domain**: jerseytrust.ae (staging at new.jerseytrust.ae)
- **Stack**: Astro 6 + Tailwind CSS 4, static site
- **Hosting**: Cloudflare Pages (account `f806d2c052431b97dfcb1289e462b65b`)
- **Repo**: ShareMatch/jersey-trust-website

## Commands

```bash
npm run dev          # Dev server (localhost:4321)
npm run build        # Build to dist/
npm run preview      # Preview production build

# Deploy to Cloudflare Pages
CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=f806d2c052431b97dfcb1289e462b65b \
  npx wrangler pages deploy dist --project-name jersey-trust-website --branch main
```

## Architecture

- `src/layouts/Layout.astro` - Base layout with meta, fonts, slots for header/footer
- `src/components/Header.astro` - Fixed nav with mobile menu
- `src/components/Footer.astro` - Full footer with contact, services, socials
- `src/pages/` - File-based routing (Astro static)
- `src/styles/global.css` - Tailwind theme with JT brand colours
- `public/images/` - Logo and static assets

## Brand

- **Colours**: Red (`#c8102e`), Gold (`#b8860b`), Navy (`#1a1a2e`)
- **Fonts**: Playfair Display (headings), Inter (body)
- **Tone**: Warm professional, UK English throughout
- **Logo**: Red shield with Jersey crest, gold "TRUST" text

## Content Source

Brand assets and sales materials are in the Jersey Trust Google Workspace shared drive (`0AKg-SVT433vBUk9PVA`). Access via:
```bash
XDG_CONFIG_HOME=/home/cmwtrading55/.config/gws-jerseytrust gws drive files list --params '...'
```

## Git

Push via SSH: `git@github.com-sharematch:ShareMatch/jersey-trust-website.git`
