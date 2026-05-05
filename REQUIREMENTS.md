# Wedding Website — Requirements & Build Spec
**Owners:** Megan & Kris Saladin
**Wedding date:** July 14, 2026
**Last updated:** May 5, 2026
**Status:** Pre-build — collecting decisions
---
## 1. Project summary
Build a custom, password-gated wedding website that serves three lifecycle stages:
1. **Pre-wedding** (now → July 2026): invite guests, share details, collect RSVPs
2. **Day-of** (July 13–15, 2026): itinerary + menu reference
3. **Post-wedding** (August 2026 onward): photo/video galleries, honeymoon recap, guestbook
One domain, one password, one aesthetic — site grows with us instead of rebuilding later.
---
## 2. Decisions still needed (fill in before build starts)
- [ ] **Aesthetic direction** — pick one:
  - [ ] Modern minimal (whitespace, sans-serif, single accent color)
  - [ ] Editorial magazine (large serif, asymmetric, photo-driven)
  - [ ] Coastal warm (cream/sand, warm tones, Crystal Cove vibe)
  - [ ] Dark moody (charcoal/black, gold accents, dramatic photography)
  - [ ] Custom: ___
- [ ] **Domain** — top 3 candidates (Cloudflare Registrar for purchase):
  1. ___
  2. ___
  3. ___
- [ ] **Gift line** — include or omit?
  - [ ] Include quiet line with Venmo + Zelle
  - [ ] Omit entirely (presence-is-the-gift framing)
- [ ] **Site password** — single shared password printed on Bella Figura invitation: ___
- [ ] **Primary contact email for RSVPs** — `rsvp@[domain]` or personal email: ___
---
## 3. Tech stack
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Kris already uses it; SSR + static export both fine |
| Styling | Tailwind CSS v4 | Speed of iteration |
| Components | shadcn/ui (selective) | Forms, dialogs only — most layout custom |
| Hosting | Vercel free tier | Zero cost, zero ops, automatic SSL |
| Domain registrar | Cloudflare Registrar | Cheapest, no upsells, ~$10-12/yr |
| Photo storage | Cloudflare R2 (free 10GB) | Wedding photos 2-5GB easily fit |
| Video hosting | Vimeo unlisted (or YouTube unlisted) | Don't self-host video |
| RSVP backend | `mailto:` link or Supabase free tier | 13 guests = mailto is fine |
| Auth/password gate | Single shared password via middleware + cookie | One password for all guests |
**No payment integration on this site.** No Stripe, no Wave, no embedded checkouts. If gift line is included, it links out to native Venmo/Zelle.
---
## 4. Site structure
### 4.1 Pre-wedding pages (build now)
- [ ] **Home** — hero photo, names, date, location, countdown
- [ ] **Our Story** — how we met, timeline, proposal, why elopement
- [ ] **Schedule** — day-of timeline at high level (ceremony time, dinner, etc.)
- [ ] **Travel & Stay** — venue address, recommended hotels for guests, airport guidance, parking
- [ ] **Things to Do** — Laguna/Newport recommendations for guests extending the trip (Crystal Cove, restaurants, beaches)
- [ ] **FAQ** — dress code, weather, kids policy (none), gift policy, photography
- [ ] **RSVP** — `mailto:` link to dedicated email OR simple form (Supabase if needed)
### 4.2 Day-of pages (publish week-of)
- [ ] **Itinerary** — printable detailed schedule
- [ ] **Menu** — printable dinner menu, wine list
### 4.3 Post-wedding pages (publish later)
- [ ] **Photos** — gallery from photographer, organized by moment (ceremony / Crystal Cove / dinner)
- [ ] **Videos** — embedded Vimeo/YouTube unlisted videos
- [ ] **Guestbook** — collected notes/messages from guests
- [ ] **Honeymoon recap** — Bardessono → Tahoe → Zion travelogue with photos
### 4.4 Optional gift line (conditional)
If "include" decided: a quiet section on FAQ or Travel page reading something like:
> Your presence is the gift. If you'd like to do something extra,
> our honeymoon fund welcomes contributions:
> - Venmo: @kris-megan
> - Zelle: hello@[domain]
No itemized list. No Amazon registry. No payment buttons embedded on site.
---
## 5. Authentication / privacy
- [ ] All routes behind a single shared password (set in env var)
- [ ] Cookie-based auth, persists across pages (no re-prompt per page)
- [ ] Optional: separate password for post-wedding gallery pages (in case wedding password needs to expire)
- [ ] Indexing disabled (`robots.txt` blocks all, `noindex` meta tag)
- [ ] Cloudflare Access optional layer if extra paranoid (free tier)
---
## 6. Photo gallery requirements (post-wedding)
- [ ] Storage: Cloudflare R2 bucket
- [ ] Image optimization: Next.js `<Image>` component with R2 public URL
- [ ] Lightbox: `yet-another-react-lightbox` library
- [ ] Lazy loading enabled for below-fold images
- [ ] EXIF data stripped before upload (privacy)
- [ ] Categories/sections: Pre-wedding / Ceremony / Crystal Cove / Dinner / Honeymoon
- [ ] Download option per photo (so guests can save high-res of themselves)
---
## 7. Video requirements (post-wedding)
- [ ] Vimeo Plus account during upload month ($7), cancel after
- [ ] Videos uploaded as **unlisted with password**
- [ ] Embedded via Vimeo iframe on site
- [ ] Section: Ceremony video, first-look video, drone footage, etc.
---
## 8. Guestbook (post-wedding)
- [ ] Simple Supabase table: `name`, `message`, `submitted_at`
- [ ] Form on page collects entries
- [ ] Display chronologically or filtered
- [ ] Manual moderation queue (we approve before publishing)
---
## 9. Coordination with Bella Figura invitations
The invitation suite must include:
- [ ] Website URL (small, bottom of invitation or on enclosure card)
- [ ] Password (printed in elegant calligraphy on enclosure or RSVP card)
- [ ] Phrasing: "For schedule, travel, and updates, visit [url] · password: [password]"
- [ ] **No mention of registry/gifts on the printed invitation itself** (etiquette)
---
## 10. Build phases
### Phase 1 — Scaffold (1 weekend)
- [ ] Repo init, Next.js 15 + Tailwind
- [ ] Domain registered at Cloudflare
- [ ] Vercel deploy with custom domain + SSL
- [ ] Password gate middleware
- [ ] Home, Story, Schedule, Travel, RSVP pages with placeholder content
### Phase 2 — Content (2-3 evenings)
- [ ] Real photos and copy on all pages
- [ ] FAQ filled out
- [ ] Things to Do recommendations populated
- [ ] Mobile responsive QA on iPhone + Android
### Phase 3 — Pre-launch (week before invitations mail)
- [ ] Final review with Megan
- [ ] Test password gate from incognito
- [ ] Test on slow 3G connection
- [ ] Confirm Bella Figura is printing correct URL + password
- [ ] Soft launch to 1-2 trusted guests for feedback
### Phase 4 — Day-of additions (week before wedding)
- [ ] Itinerary page populated and printable
- [ ] Menu page populated and printable
### Phase 5 — Post-wedding (within 4-6 weeks)
- [ ] Photo gallery from photographer's deliverables
- [ ] Video embeds from Vimeo
- [ ] Guestbook activated and announced
- [ ] Honeymoon recap pages
---
## 11. Costs
| Item | Cost | Notes |
|---|---|---|
| Domain | $10-12/year | Cloudflare Registrar |
| Hosting | $0 | Vercel free tier covers this easily |
| R2 storage | $0 | First 10GB free |
| Vimeo (1 month) | $7 | Cancel after upload |
| Supabase | $0 | Free tier for guestbook + optional RSVP |
| **Total year 1** | **~$17-19** | |
vs Zola: free but generic, locks you into their templates and platform.
---
## 12. Open questions / parking lot
- [ ] Custom email forwarding (e.g., `kris@[domain]` → personal Gmail)? Cloudflare Email Routing is free.
- [ ] Add an interactive map of the wedding venue + recommended hotels/restaurants?
- [ ] Should the post-wedding gallery be public eventually, or stay password-gated forever?
- [ ] Print-stylesheet for the day-of itinerary and menu (ensure they look good when guests print)
- [ ] Calendar invite (.ics download) for the wedding date?
- [ ] QR code printed on invitation that opens the site directly?
---
## 13. Files to be generated by Claude in Cowork
When ready to build, request these files:
```
/app
  /layout.tsx           — root layout with password gate check
  /page.tsx             — Home
  /story/page.tsx       — Our Story
  /schedule/page.tsx    — Schedule overview
  /travel/page.tsx      — Travel & Stay + Things to Do
  /faq/page.tsx         — FAQ + (conditional) gift line
  /rsvp/page.tsx        — RSVP form or mailto
  /api/auth/route.ts    — password verification endpoint
  /middleware.ts        — protects all routes except /login
/app/(post-wedding)
  /photos/page.tsx      — photo gallery (scaffold now, populate later)
  /videos/page.tsx      — video embeds (scaffold now, populate later)
  /guestbook/page.tsx   — guestbook (scaffold now, populate later)
  /honeymoon/page.tsx   — honeymoon recap (scaffold now, populate later)
/components
  /Hero.tsx
  /Countdown.tsx
  /PhotoGallery.tsx
  /Lightbox.tsx
  /PasswordPrompt.tsx
  /Nav.tsx
  /Footer.tsx
/lib
  /supabase.ts          — only if RSVP form / guestbook needed
  /auth.ts              — password check helper
/public
  (photos, favicon, etc.)
.env.local
  SITE_PASSWORD=
  NEXT_PUBLIC_SITE_URL=
  R2_BUCKET=
  R2_ACCESS_KEY=
  R2_SECRET_KEY=
  SUPABASE_URL=
  SUPABASE_ANON_KEY=
```
---
## 14. Things that are explicitly NOT in scope
- Embedded payment processing (Stripe, Wave, etc.)
- Itemized cash gift "registry" with payment buttons
- Public indexing / SEO
- User accounts (single shared password is sufficient)
- Live-streaming the ceremony
- E-commerce / merchandise
- Multi-language support
- Native mobile app
---
## 15. Where to take this next
1. Fill in the decisions in **Section 2** above
2. Open this doc in Cowork
3. Ask Claude to scaffold Phase 1 based on this spec
4. Iterate the codebase from there
