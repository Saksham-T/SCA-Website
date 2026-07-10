# CLAUDE.md

Guidance for working in this repository. This is the **SeeTusk (SCA) agency website** — a
static multi-page marketing site built with Vite and deployed on Vercel, backed by a
separate Node/Express + MongoDB service for form handling, with small React islands on
the About page.

## Commands

```bash
npm run dev        # Vite dev server (serves raw source)
npm run build      # Static build: copy raw source -> dist/ (node build-static.mjs)
npm run build:vite # Legacy `vite build` (bundles/hashes — BREAKS this site, see below)
npm run preview    # Preview the production build (serves dist/)

# Backend (separate package)
cd backend && npm install
npm run dev        # or: npm start  (Express + MongoDB API)
```

## Architecture

### 1. Static multi-page site (the actual product)
Hand-authored HTML at the repo root with fixed asset paths, pre-built bundles
(`assets/sca.bundle.min.css/js`), and **classic (non-module) scripts**
(`assets/sca-kinetic.js`, `sca-magnetic.js`, `sca-livebuild.js`, `sca-deck.js`,
`sca-influencer.js`, `sca-about.js`). `vercel.json` maps clean URLs to these pages, sets
security headers, long-caches `/assets` & `/img`, and redirects legacy paths.

**Build = raw copy, NOT `vite build`.** `npm run build` runs `build-static.mjs`, which
copies the deployable root HTML + `assets/` + `images/` + `sw.js`/`robots.txt`/`sitemap.xml`
into `dist/` untouched. Do **not** switch back to `vite build`: Vite bundles only
`type="module"` scripts, so it drops the classic scripts (they 404 → dead animations) and
re-processes/hashes the authored CSS, making the build render differently from `npm run dev`.
The dev server serves the raw files, so raw-copy `dist/` is the only thing that matches dev
and deploys faithfully.

| Route         | File             |
|---------------|------------------|
| `/`           | `index.html`     |
| `/content`    | `content.html`   |
| `/influencer` | `influencer.html`|
| `/web`        | `web.html`       |
| `/about`      | `about.html`     |
| `/contact`    | `contact.html`   |
| `/careers`    | `careers.html`   |
| (404)         | `404.html`       |

Concept/scratch variants exist (`*-v1`, `index-original`, `index-prewireframe`,
`about-concept.html`, `hero-concepts/`, `redesign/`, `frames/`) and are not shipped routes.

### 2. Styles & scripts — `assets/`
Modular, per-page CSS/JS (not one global bundle): `sca.css`, `sca-hero.css`, `sca-web.css`,
`sca-influencer.css`, `sca-about.css`, `sca-footer.css`, `sca-mobile.css`, `sca-dark.css`,
plus behavior scripts (`sca.js`, `sca-kinetic.js`, `sca-magnetic.js`, `sca-livebuild.js`,
`camera-model.js`) and pre-built `*.bundle.min.*`. A service worker (`sw.js`) handles caching.
An Apollo.io website tracker script is injected across pages.

### 3. React islands (About page only)
`assets/about-react-entry.tsx` mounts React 19 roots into `#purpose-react-root` and
`#values-react-root`, rendering `components/PurposeSection.tsx` and
`components/ValuesSection.tsx` (built to `assets/about-react-bundle.js/css`). The rest of
the site has no React.

### 4. Backend — `backend/` (Node/Express + MongoDB)
Production-ready forms API. Entry `server.js` -> `src/app.js` (Helmet, CORS allow-list for
`*.seetusk.com` / `*.seetusk.agency`, rate limiting, mongo-sanitize, Winston/Morgan logs).
Routes:
- `POST /api/applications` — careers form; Multer resume upload, honeypot + time-trap spam
  checks, saves `Application`, emails HR (resume attached) + candidate.
- `GET  /api/jobs` — live job listings for the careers page.
- `POST /api/inquiries` — contact/project inquiries.
- `POST /api/newsletters` — email signup.
- `GET  /health` — liveness probe.

Models: `Application`, `Job`, `Inquiry`, `Newsletter`, plus a unified `TabularRecord`.
Every submission is mirrored into flat key-value rows via `src/utils/syncTabular.js`
(upsert keyed by `tableName` + `sourceId`); `src/scripts/migrateExistingToTabular.js`
backfills on startup. Email is sent via SMTP/Nodemailer or the Brevo HTTP API
(`src/services/emailService.js`, `brevoMailer.js`).

### 5. Legacy serverless — `api/apply.js`
Standalone Vercel function that emails a careers application (base64 resume) directly to
`hr@seetusk.com` via Nodemailer. Predates `backend/` and shares the same root `.env`.

## Conventions & gotchas

- **Single root `.env`** powers BOTH `backend/` (via `backend/src/config/index.js`, which
  reads `../../../.env`) and the legacy `api/apply.js`. `.env.example` documents the keys.
- **Dual-copy repo**: root pages are mirrored in `_github_drop/sca_github/` and `uploads/`.
  Per project history, page edits are made to the root and the nested `sca_github/` copy in
  tandem — confirm which tree is live-deployed before editing pages.
- `frontend/` currently contains only its own `node_modules` + `dist` (an isolated
  Vite/React scaffold), NOT active site source. The live site is the root HTML + `assets/`.
- Content/section changes are documented in `Change Report.md`; design intent in
  `website_wireframe.md` and `specs/` (PDFs: sitemap, design-system, change specs).
- Content style rule from prior work: no em dashes (`—`) in visible page copy — use commas
  or periods (em dashes in code comments are fine since they don't render).
- Root `package.json` lists many transitive deps explicitly; the meaningful runtime deps are
  Vite 8, React 19, react-router 7, motion, nodemailer, zod.
