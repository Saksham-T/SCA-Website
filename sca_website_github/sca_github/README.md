# Seetusk Creative Agency — seetusk.agency

Brutalist, dark-mode marketing site for Seetusk Creative Agency.

## Stack
Pure static HTML/CSS/JS. No build step. Drop-in deploy.

## Pages
- `index.html` — home
- `content.html`, `influencer.html`, `web.html` — verticals
- `about.html`, `contact.html`
- `404.html` — error page

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Import the repo on vercel.com → it'll detect a static site.
3. Add custom domain `seetusk.agency` in Vercel project settings.
4. Done. `vercel.json` provides clean URLs (e.g. `/content` instead of `/content.html`).

## Before you ship
- [ ] Drop a real `favicon.ico` and `og.jpg` (1200×630) at the repo root.
- [ ] Replace the placeholder client names on inner pages with real ones.
- [ ] Update real contact email if `contact@seetusk.com` / `hr@seetusk.com` change.
- [ ] Hook the newsletter form to a real provider (Substack/Mailchimp/Beehiiv) — currently mailto.

## Contact form
Currently uses a `mailto:` link, no backend needed. Replace with Formspree / Web3Forms / a function later if volume grows.

## SEO
- `sitemap.xml` and `robots.txt` are at root.
- OG meta tags set on the homepage. Duplicate the meta block on inner pages if you want richer share cards.
