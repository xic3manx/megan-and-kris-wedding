# Deploy guide — meganandkris.com

A step-by-step from local folder → live, password-gated site at
**https://meganandkris.com**. Estimated time: 25–35 minutes the first time,
mostly waiting for DNS to propagate.

---

## What you need before you start

- A GitHub account (free)
- A Vercel account (free — sign in with GitHub for one click)
- The Squarespace account where `meganandkris.com` was purchased
- This project folder on your machine

---

## Step 1 — Local sanity check (5 min)

Open a terminal in the project folder and confirm it builds locally.

```bash
cd "C:\Users\Kris\Documents\Claude\Projects\Wedding Website"
npm install
npm run build
npm run dev
```

Open http://localhost:3000 → you should be redirected to `/login` →
enter `m&k71426` → land on the home directory.

If `npm run build` succeeds, deployment will succeed. If it fails, send
me the error output and I'll fix it before we push.

---

## Step 2 — Push to GitHub (5 min)

1. Go to https://github.com/new
2. **Repository name:** `meganandkris-wedding` (or whatever you like)
3. **Visibility:** **Private** (important — protects the password from being indexed in repo search)
4. Don't check any of the "initialize with" boxes — we have a project already
5. Click **Create repository**

Then in your terminal:

```bash
cd "C:\Users\Kris\Documents\Claude\Projects\Wedding Website"
git init
git branch -M main
git add .
git commit -m "Initial scaffold — Megan & Kris wedding site"
git remote add origin https://github.com/<your-username>/meganandkris-wedding.git
git push -u origin main
```

(`.gitignore` already excludes `.env.local`, so the password does not
ship to GitHub.)

---

## Step 3 — Import to Vercel (3 min)

1. Go to https://vercel.com/new
2. **Import Git Repository** → pick your new GitHub repo
3. Vercel auto-detects **Next.js** — leave all the defaults
4. **Before clicking Deploy**, expand the **Environment Variables** section
   and add **all five** values from your `.env.local`:

   | Name | Value |
   |---|---|
   | `SITE_PASSWORD` | `m&k71426` |
   | `NEXT_PUBLIC_SITE_URL` | `https://meganandkris.com` |
   | `NEXT_PUBLIC_PHOTO_UPLOAD_URL` | (paste your Google Drive request-files URL — see Step 6) |
   | `NEXT_PUBLIC_VENMO_HANDLE` | `@your-real-venmo-handle` |
   | `NEXT_PUBLIC_ZELLE_EMAIL` | `saladikm@gmail.com` |

5. Click **Deploy**. Vercel will build and ship in ~90 seconds. You'll
   get a URL like `meganandkris-wedding-xyz.vercel.app`.

6. Visit it. Confirm the login page appears, the password works, and
   the home page loads.

---

## Step 4 — Connect meganandkris.com (10 min + DNS wait)

Since the domain is at Squarespace, you'll point its DNS to Vercel.

**4a. In Vercel** (the easy half):

1. Open your project → **Settings** → **Domains**
2. Type `meganandkris.com` → **Add**
3. Vercel will show you the DNS records you need to add. Most likely:
   - **A record:** `@` → `76.76.21.21`
   - **CNAME record:** `www` → `cname.vercel-dns.com`
4. Also click **Add** for `www.meganandkris.com` so both work.
5. Vercel will say "Invalid Configuration" until DNS propagates. That's expected.

**4b. In Squarespace** (the slightly tedious half):

1. Sign in at https://account.squarespace.com
2. **Domains** → click **meganandkris.com** → **DNS Settings**
3. **Remove** the existing A records pointing to Squarespace's IPs
   (usually 198.185.159.x or similar)
4. **Add records:**
   - Type **A**, Host `@`, Data `76.76.21.21`
   - Type **CNAME**, Host `www`, Data `cname.vercel-dns.com`
5. **Keep** any TXT records (email verification, SPF, etc.) untouched
6. **Save**

**4c. Wait** 10–60 minutes for DNS to propagate. Vercel auto-issues a
Let's Encrypt SSL cert as soon as it sees the DNS resolve. You'll see a
green check next to the domain in Vercel.

Pro tip: while you wait, run this to check propagation:
```bash
nslookup meganandkris.com
```
When it returns `76.76.21.21`, you're live.

---

## Step 5 — Test the live site

Once the green check appears in Vercel:

1. **Incognito window** → https://meganandkris.com
2. Should redirect to `/login`
3. Enter `m&k71426` → should land on home, see the live countdown
4. Try a wrong password → should show the error and not let you in
5. Open DevTools → Application → Cookies → confirm `mk_auth` cookie is
   set, `Secure: true`, `HttpOnly: true`
6. Test the print stylesheets: open `/itinerary` → Cmd/Ctrl+P → preview
   should look like an editorial card on white paper

If anything looks off, let me know — I'll fix and you redeploy with one
`git push`.

---

## Step 6 — Set up the Google Drive upload folder (3 min)

The Upload page links to your Drive folder, but you need to create that
link.

1. Open https://drive.google.com
2. **New** → **Folder** → name it "Megan & Kris — Wedding Photos"
3. Open the folder → click the gear icon (or right-click the folder name)
4. **File request** (this lets non-Google users upload without an account)
5. Copy the URL Google gives you
6. Paste it into Vercel's `NEXT_PUBLIC_PHOTO_UPLOAD_URL` env variable
7. Redeploy (Vercel does this automatically when you save env changes)

---

## Step 7 — Confirm with Bella Figura

Before they print, send Bella Figura the final two strings to engrave on
the enclosure card:

> For schedule, travel, and updates, visit
> **meganandkris.com** · password: **m&k71426**

(or whatever wording matches the suite design they've drafted)

---

## Maintenance: how to make changes later

Any change is `edit a file → git commit → git push`. Vercel rebuilds
automatically. The dev loop:

```bash
# pull latest
git pull

# edit a file in data/, components/, or app/
# preview locally
npm run dev

# ship
git add .
git commit -m "what you changed"
git push
```

For just content (registry items, milestones, menu courses, blurbs),
the `data/` folder is where to look first.

---

## If something breaks

- **Build fails on Vercel:** check the Build Log; usually a missing env
  variable or a typo in a `data/*.ts` file
- **Password gate redirects in a loop:** make sure `SITE_PASSWORD` env
  is set in Vercel and matches what you're typing exactly (the `&`
  matters)
- **DNS still not resolving after 2+ hours:** double-check Squarespace
  has the A record pointing to `76.76.21.21` and no other A records
  conflicting

You can always back out a bad deploy in Vercel: **Deployments** →
previous deployment → **Promote to Production**. Instant rollback.
