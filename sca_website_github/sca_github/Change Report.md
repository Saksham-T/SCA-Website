# SCA Website — Change Report

_Branch source: `Saksham-T/SCA-Website` @ `Dev` (path `sca_website_github/sca_github`)_
_Date: June 27, 2026_

This report documents every change made during this working session, in order.

---

## 1. Pulled the latest Dev branch into the project

Synced the project to the latest `Dev` commit. Imported **92 source files** and placed them at the project root:

- All root HTML pages (`index.html`, `web.html`, `influencer.html`, `content.html`, `about.html`, `contact.html`, `careers.html`, `404.html`, plus concept/`-v1` variants)
- `assets/` — site CSS and JS (`sca.css`, `sca.js`, `sca-*.css/js`, bundles, `camera-model.js`)
- `api/apply.js`
- `backend/` — full Node/Express backend (34 files: controllers, models, routes, middleware, services, utils, config)
- `redesign/` and `hero-concepts/` source files
- `Careers-webpage/`
- Config/meta files (`vercel.json`, `sitemap.xml`, `robots.txt`, `sw.js`, `.gitignore`, `.design-canvas.state.json`)

**Not re-imported:** ~980 image/font/frame binaries (already present in the project and unchanged on `Dev`). Re-pulling them would have been redundant.

---

## 2. `web.html` — removed "Selected work" section (was Section 07)

Removed the entire case-study section titled **"Examples of the kind of work we shape."** This included three sample case cards:

- **Product storefront with clearer discovery** (Shopify / Story)
- **Service website built around buyer intent** (Brand site / CMS, SEO)
- **Campaign page for paid and creator traffic** (Launch / Ads)

…plus the section's closing CTA ("Bring us the current link…" + _Start a web project_ button).

**Also removed the now-orphaned references:** the **"Work"** link in the top nav and the **"See selected builds"** button in the closing CTA (both pointed to the deleted `#work` anchor).

> _Reason given: needs more (approved) information before this section can return._

---

## 3. `web.html` — live-build hero image swap + removed "Motion experiments" section

- **Image swap:** in the live-build hero (the window where typed code resolves into a live page preview), replaced the product image `images/ambar-coffee-clean.webp` with the ASCII horse render `images/ed-denoised-horse.webp`.
- **Removed Section 08 / Motion experiments** (the "Build proof" section about ASCII Motion, including the View Gallery / Documentation / Live Demo buttons). The horse render it used now lives in the live-build hero instead.

---

## 4. `web.html` — removed "Handoff & ownership" section (was Section 10)

Removed the section titled **"You should not be trapped by the team that built your website,"** including its three cards: _Access map_, _Editor guide_, and _Next actions_. No links pointed to it, so nothing was left dangling.

---

## 5. `web.html` — section renumbering

After the three deletions above, all section numbers (comments, watermarks, and on-screen labels) were resequenced:

| New | Section |
|-----|---------|
| 01 | Problem |
| 02 | Build system |
| 03 | Stack & fit |
| 04 | Build types |
| 05 | What this is not |
| 06 | Built to be measured |
| 07 | In-house products |
| 08 | FAQ |
| 09 | Next move (closing CTA) |

---

## 6. `influencer.html` — removed two sections + renumbering

Removed:
- **Section 05 / Creator selection** ("Chosen by fit, not follower count" — the Audience / Content / Credibility / Value criteria cards)
- **Section 07 / Compliance and rights** ("The boring paperwork makes the campaign usable")

No anchor/nav links pointed to either, so no broken references. Remaining sections were resequenced:

| New | Section |
|-----|---------|
| 02 | The system |
| 03 | What we manage |
| 04 | Campaign types |
| 05 | Tracking |
| 06 | Campaign examples |
| 07 | Client notes |
| 08 | FAQ |
| 09 | Next move |

---

## 7. Em-dash cleanup (AI-tell removal) — `content.html`, `influencer.html`, `web.html`

Removed long em dashes (`—` / `&mdash;`) from all **visible** page copy (body text, headings, eyebrows, page titles, meta descriptions), replacing them with commas or periods for natural reading. Em dashes inside CSS/JS code comments were left untouched because they never render on the page.

- **content.html** — 8 replacements: page `<title>`, meta description, and six body lines (the "design — planned monthly", "visible — not another vendor", "more energy — and what to stop making", "content team — without hiring one", "launches — so the brand feels", and "verticals — see the…" sentences).
- **influencer.html** — 1 replacement: the page `<title>` ("Creator campaigns with proof —…"). Body copy had no visible em dashes.
- **web.html** — 1 replacement: an em dash in a nav accessibility label. Visible body copy already had none (the em-dash-heavy case-study copy was removed in steps 2–3).

> _Not yet done (offered): the same em-dash pass on `index.html`, `about.html`, `careers.html`, `contact.html`, and `404.html`, which still contain em dashes in visible copy._

---

## Notes

- Two console messages appear in the in-app preview on `web.html`/`influencer.html`: a **service-worker registration failure** and a **"Transition was skipped"** warning. Both are environmental to the sandbox preview (the service worker can't register there; the warning is a View Transitions API quirk) and are **not** caused by any of the edits above.
