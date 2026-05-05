# Megan & Kris — Wedding Website

A custom, password-gated wedding site for **July 14, 2026** at the Resort at
Pelican Hill (Newport Coast, CA).

Tech: Next.js 15 · React 19 · Tailwind CSS v4 · Framer Motion · TypeScript
Hosting: Vercel · Domain: meganandkris.com (registered at Squarespace)

---

## Quickstart

```bash
# from the project folder
npm install
npm run dev
# open http://localhost:3000 → enter password from .env.local
```

`.env.local` is already populated with:
- `SITE_PASSWORD=m&k71426` — the password printed on the Bella Figura enclosure
- `NEXT_PUBLIC_VENMO_HANDLE=@megan-kris` — placeholder, swap for your real handle
- `NEXT_PUBLIC_ZELLE_EMAIL=saladikm@gmail.com` — used on Registry page
- `NEXT_PUBLIC_PHOTO_UPLOAD_URL=...` — paste your Google Drive "Request Files" URL here

---

## Where to drop iPhone photos

Put files in `public/images/` under the right subfolder:

| Spot on the site | File path |
|---|---|
| Home hero background | `public/images/couple/hero.jpg` (landscape, ~1600×1000) |
| Open Graph share preview | `public/images/couple/og.jpg` (1200×630) |
| Itinerary — Pelican Hill (ceremony) | `public/images/venues/pelican-hill.jpg` |
| Itinerary — Mastro's | `public/images/venues/mastros.jpg` |
| Itinerary — Pelican Hill breakfast | `public/images/venues/pelican-hill-breakfast.jpg` |

Missing files fall back to elegant placeholder treatments — drop them in
when you have them, no code change required.

---

## Editing content

All text content lives in plain TypeScript files under `data/` for clarity:

- `data/itinerary.ts` — times, addresses, blurbs for the three day-of stops
- `data/menu.ts` — reception (Mastro's) and breakfast (Pelican Hill) menus
- `data/registry.ts` — the curated registry items list
- `data/milestones.ts` — milestones plotted on the Bride & Groom Tracker

Save and refresh — Next.js hot-reloads.

The marquee component, the **Bride & Groom Tracker**, has placeholder
milestones for both of you in `data/milestones.ts`. Edit those entries to
tell your story along the path from Eureka to Newport and Irvine to Newport.

---

## Deploying

1. **Push the repo** to a new private GitHub repo.
2. **Import to Vercel** (free tier). It auto-detects Next.js.
3. In Vercel project settings → Environment Variables, add the same
   variables from `.env.local`. **Important:** Vercel needs them too.
4. **Custom domain (meganandkris.com):** since the domain is at Squarespace,
   you have two options:
   - **Easy path:** transfer the domain to Cloudflare (~$10/yr cheaper, no
     functional difference) and let Vercel handle DNS.
   - **Stay on Squarespace DNS:** in Squarespace → Domains → DNS, add an
     **A record** for `@` pointing to `76.76.21.21` (Vercel's anycast IP)
     and a **CNAME** for `www` pointing to `cname.vercel-dns.com`. Then
     add the domain in Vercel → it issues the cert automatically.

---

## Password gate

- The middleware (`middleware.ts`) protects every route except `/login`,
  `/api/auth`, and static assets.
- Login posts the password to `POST /api/auth`. On match, an HTTP-only
  cookie is set (180-day expiry).
- Changing `SITE_PASSWORD` in env invalidates all existing cookies because
  the auth token is salted with the password.

The current password is `m&k71426` — printed on the Bella Figura enclosure
card. Test from Incognito before invitations mail.

---

## Project structure

```
app/
  layout.tsx           Root shell with fonts, Nav, Footer
  globals.css          Tailwind v4 + Victorian design tokens
  page.tsx             Home — Hero, Directory, Tracker
  not-found.tsx        404 with a hidden snail
  login/               Password prompt
  api/auth/route.ts    Auth POST/DELETE
  itinerary/           The day, hour by hour
  menu/                Reception + breakfast menus
  registry/            Honeymoon fund + curated items
  upload/              CTA to your Google Drive folder
  gallery/             Post-wedding photo gallery (scaffold)

components/
  Nav.tsx              Sticky header, live countdown, mobile drawer
  Footer.tsx           Calligraphy mark + rose divider
  Hero.tsx             Home hero with full countdown
  Countdown.tsx        Live ticker (compact + full variants)
  DirectoryTiles.tsx   The five entry-point cards
  BrideGroomTracker.tsx  Animated SVG map + interactive milestones
  BotanicalDivider.tsx Section dividers (lavender / rose / snail)
  Calligraphy.tsx      Pinyon Script wrapper
  PrintButton.tsx      Used on Itinerary + Menu

lib/
  auth.ts              Password matching + cookie token
  wedding-date.ts      Date constants + diff helpers

data/
  itinerary.ts
  menu.ts
  registry.ts
  milestones.ts

public/
  robots.txt           Disallow all
  images/              Drop iPhone photos here (see folder README)
```

---

## Phase checklist (from REQUIREMENTS.md)

- [x] **Phase 1** — Scaffold (this project)
- [ ] **Phase 2** — Real photos and copy
  - [ ] Drop iPhone photos in `public/images/couple/` and `public/images/venues/`
  - [ ] Refine `data/milestones.ts` with your real story
  - [ ] Final pass on `data/registry.ts` items
  - [ ] Mobile QA on iPhone + Android (Chrome dev tools is fine)
- [ ] **Phase 3** — Pre-launch (week before invitations mail)
  - [ ] Test password gate from Incognito
  - [ ] Confirm Bella Figura is printing the right URL + password
  - [ ] Soft launch to one or two trusted guests
- [ ] **Phase 4** — Day-of additions (week before)
  - [ ] Replace `data/menu.ts` with the real Mastro's menu
- [ ] **Phase 5** — Post-wedding
  - [ ] Wire the gallery to Cloudflare R2 or replace with photographer's deliverables
  - [ ] Add a Honeymoon Recap page when you're back

---

## Hidden treats

There are two snails on the site. Have fun finding them.
