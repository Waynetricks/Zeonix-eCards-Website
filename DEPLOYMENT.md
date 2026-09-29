# Zeonix eCards — Production Deployment Guide

This guide takes the site from localhost to a public URL. The project deploys
as **one Node.js service** that serves both the built frontend (`dist/`) and
the contact API (`/api/*`) on the same origin — no CORS setup needed, one
process to run, one place to configure.

```
                    ┌─────────────────────────────┐
  Browser ────────► │  Node server (server/index.mjs)
                    │  • serves dist/ (React site)
                    │  • POST /api/contact        ──────► submissions.json (data volume)
                    │  • GET  /api/health         ──────► SMTP (Gmail) → business inbox
                    └─────────────────────────────┘
```

---

## What you need before starting

| Requirement | Where to get it |
|---|---|
| A hosting account (Railway, Render, or Fly.io — any works) | railway.app / render.com / fly.io |
| The domain `zeonixecards.com` (optional; a free `*.up.railway.app` / `*.onrender.com` URL works until connected) | Your domain registrar |
| A Gmail App Password for inquiry emails | https://myaccount.google.com/apppasswords |

---

## Step 1 — Create the email credentials (5 minutes)

The inquiry form sends an email notification to the business inbox on every
submission. Gmail requires an **App Password** (never your normal password):

1. Sign in to the Zeonix business Gmail account.
2. Enable 2-Step Verification: https://myaccount.google.com/security
3. Create an App Password: https://myaccount.google.com/apppasswords
   - App name: `Zeonix eCards website`
   - Copy the 16-character password it shows you.
4. Note these values for Step 3:
   - `SMTP_USER` = the Gmail address, e.g. `zeonix.business@gmail.com`
   - `SMTP_PASSWORD` = the 16-character app password
   - `EMAIL_FROM` = same as SMTP_USER
   - `EMAIL_TO` = the inbox that should receive inquiries

> Gmail's free SMTP limit is ~500 emails/day — far more than an inquiry form
> needs. If you later move to a custom domain mailbox (e.g. Zoho, Google
> Workspace), just change `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD`.

---

## Step 2 — Put the code on GitHub (if not already)

The host pulls the code from your repository:

```bash
git push origin master        # or connect the existing repo in the host UI
```

---

## Step 3 — Deploy (choose ONE option)

### Option A — Railway (recommended: simplest)

1. Go to https://railway.app → **New Project** → **Deploy from GitHub repo**
   → select this repository.
2. Railway auto-detects the `Dockerfile` and builds. Wait for the build to
   finish (~2 minutes).
3. Open the service → **Variables** tab → add the environment variables from
   the table in Step 4.
4. **Settings** → **Networking** → **Generate Domain** → pick a name (e.g.
   `zeonixecards`) → you get `https://zeonixecards.up.railway.app`.
5. **Volumes**: Settings → Volumes → **New Volume**, mount path `/data` —
   this is where inquiries are stored so they survive redeploys.
6. Deploy again (Variables changed) and open the URL. Done.

### Option B — Render

1. Go to https://render.com → **New** → **Web Service** → connect the repo.
2. Runtime **Docker** (it uses the repo's `Dockerfile`).
3. Instance type: Free tier works to start (spins down when idle; paid keeps
   it always on).
4. **Environment** tab → add the variables from Step 4.
5. **Disks**: add a disk with mount path `/data` (1 GB is plenty) so
   submissions persist.
6. Create Web Service → Render builds and gives you
   `https://zeonix-ecards.onrender.com`.

### Option C — Any VPS (Ubuntu + Docker)

```bash
# on the server, with Docker installed and this repo cloned
docker build -t zeonix-ecards .
docker run -d --name zeonix \
  -p 80:3001 \
  -v zeonix-data:/data \
  -e DATA_DIR=/data \
  -e PORT=3001 \
  -e NODE_ENV=production \
  -e TRUST_PROXY=false \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_PORT=587 \
  -e SMTP_SECURE=false \
  -e SMTP_USER=... -e SMTP_PASSWORD=... \
  -e EMAIL_FROM=... -e EMAIL_TO=... \
  --restart unless-stopped \
  zeonix-ecards
```

For HTTPS on a VPS put nginx or Caddy in front (Caddy does TLS automatically):

```
# Caddyfile
zeonixecards.com {
    reverse_proxy localhost:3001
}
```

...and set `-e TRUST_PROXY=true` so rate limiting sees real client IPs.

---

## Step 4 — Environment variables (set these on the host)

Set these in the hosting provider's dashboard (Railway **Variables**, Render
**Environment**, or `docker -e`). **Never commit real secrets to git.**

| Variable | Required? | Value |
|---|---|---|
| `NODE_ENV` | ✅ yes | `production` |
| `PORT` | auto | The host injects it (Railway/Render/Fly). Only set on a raw VPS. |
| `DATA_DIR` | ✅ yes | `/data` (matches the volume mount path) |
| `SMTP_HOST` | ✅ for email | `smtp.gmail.com` |
| `SMTP_PORT` | ✅ for email | `587` |
| `SMTP_SECURE` | ✅ for email | `false` (587 uses STARTTLS) |
| `SMTP_USER` | ✅ for email | your Gmail address |
| `SMTP_PASSWORD` | ✅ for email | the 16-char **App Password** from Step 1 |
| `EMAIL_FROM` | ✅ for email | your Gmail address |
| `EMAIL_TO` | ✅ for email | inbox that receives inquiry notifications |
| `TRUST_PROXY` | recommended | `true` on Railway/Render/Fly or behind nginx/Caddy; `false` on a direct-exposure VPS |
| `CORS_ORIGINS` | only if frontend is hosted separately | e.g. `https://zeonixecards.com,https://www.zeonixecards.com` |
| `VITE_CONTACT_API_URL` | not needed | default `/api/contact` is correct (same origin) |
| `VITE_WHATSAPP_NUMBER` | optional | default `255699068552` |
| `VITE_WHATSAPP_MESSAGE` | optional | default message pre-filled in WhatsApp |

> `VITE_*` variables are compiled into the frontend at build time. The
> defaults are already production-correct, so you normally set none of them.
> If you change any `VITE_*`, trigger a rebuild (Redeploy) after saving.

---

## Step 5 — Connect the domain zeonixecards.com

1. In your host's dashboard, add a **custom domain**: `zeonixecards.com`
   (and `www.zeonixecards.com`). The host shows you the DNS record to create.
2. At your domain registrar's DNS page create what the host asks for:

   **Railway / Render (typical):**
   | Type | Name | Value |
   |---|---|---|
   | A | `@` | the IP the host gives you (e.g. `34.123.xx.xx`) |
   | CNAME | `www` | e.g. `zeonix-ecards.up.railway.app` |

   **Or if the host gives a CNAME for the apex** (some registrars support
   CNAME flattening): CNAME `@` → the target the host shows.
3. Wait for DNS to propagate (usually minutes, up to 48 h worst case).
   Check with: `dig zeonixecards.com +short`
4. TLS/HTTPS certificates are issued automatically by Railway/Render/Fly/
   Caddy — nothing to configure.
5. Set both the apex and `www` as custom domains so both redirect correctly.

**Until the domain is connected**, the site is already fully public on the
host's URL (e.g. `https://zeonixecards.up.railway.app`) — you can launch and
connect the domain later.

**If you end up using a different domain** (not zeonixecards.com), also update
the canonical/OG URLs in `index.html` and `public/robots.txt` +
`public/sitemap.xml`, then rebuild.

---

## Step 6 — Post-deploy verification checklist

Run these against your live URL (shown as `https://YOUR-DOMAIN`):

```bash
# 1. Site loads
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-DOMAIN/                 # → 200

# 2. Backend is connected
curl -s https://YOUR-DOMAIN/api/health                                        # → {"ok":true,...}

# 3. Static assets load
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-DOMAIN/gallery/wedding-andrew-janeth.jpg   # → 200
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-DOMAIN/brand/zeonix-logo-full.png          # → 200

# 4. Contact form API works (also verifies the database path is writable)
curl -s -X POST https://YOUR-DOMAIN/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"0699 068 552","eventType":"Wedding"}'      # → {"ok":true,...}
```

Then in a real browser (Chrome, Firefox, Edge, Safari, and a phone):

- [ ] Homepage loads with hero animation, brand colors, and logo
- [ ] Gallery thumbnails all render; clicking opens the lightbox; filters work
- [ ] Contact form: fill → submit → green success message appears
- [ ] The inquiry email arrives at `EMAIL_TO` within a minute
- [ ] Every WhatsApp button (navbar, services, floating, footer, contact)
      opens a WhatsApp chat with +255 699 068 552 and a pre-filled message
      (on desktop it opens web.whatsapp.com — also correct)
- [ ] Instagram link opens @zeonix_ecards
- [ ] Works on mobile: menu opens, sections scroll, nothing overflows

**Verifying the database:** the test submission from step 4 is stored in
`submissions.json` inside the mounted volume (`/data/submissions.json`).
On Railway: open the volume file via a connected terminal; on a VPS:
`docker exec zeonix cat /data/submissions.json`.

**Verifying email delivery problems:** check the host's Logs tab — email
failures are logged as `Failed to send inquiry email`. Note the inquiry is
ALWAYS saved to the database first, so a Gmail hiccup never loses a lead.

---

## What was hardened for production (technical summary)

- **Single-origin deployment**: the Node server now serves the built frontend
  with gzip, ETag-free immutable caching for hashed assets, and SPA fallback.
- **Security headers**: CSP, X-Frame-Options, HSTS, nosniff,
  Referrer-Policy, Permissions-Policy on every response.
- **CORS**: wildcard `*` removed. Same-origin by default; explicit origin
  allowlist via `CORS_ORIGINS` when needed.
- **Path traversal protection** on static serving (403 on escape attempts).
- **Request body limit** (64 KB) + correct 400 responses for malformed JSON.
- **Rate limiting** keyed on real client IP when `TRUST_PROXY=true`.
- **Atomic JSON writes** (temp file + rename) so a crash can't corrupt the
  inquiry database; `DATA_DIR` moves it onto a persistent volume.
- **Crash-safe logging** (falls back to console if the filesystem is
  read-only) and graceful SIGTERM shutdown for zero-downtime redeploys.
- **WhatsApp links** centralized in `src/config.ts` (env-overridable) and
  opened with `noopener`.
- Missing `animate-fade-in` keyframes added; SEO meta (Open Graph, canonical,
  robots, sitemap) added; fonts preconnected.
