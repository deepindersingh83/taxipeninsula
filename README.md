# Taxi Peninsula

The website for Taxi Peninsula — maxi taxi, wheelchair accessible (WAT) and
airport transport across the Mornington Peninsula and south-east Melbourne.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Prisma and
MySQL/MariaDB.

---

## What's in it

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | Animated hero, fleet picker, accessibility section, latest posts |
| Book a ride | `/book` | Full booking form + reCAPTCHA, email, SMS, database |
| Services | `/services` | Nine services, each with an anchor and JSON-LD |
| Areas | `/areas` | Index of every suburb, grouped by region |
| Area page | `/areas/[slug]` | One SEO landing page per suburb, generated at build |
| About | `/about` | Story, values, accreditations |
| Blog | `/blog`, `/blog/[slug]` | Paginated, categorised, DB-backed |
| Contact | `/contact` | Contact form + map |
| Legal | `/terms`, `/privacy` | Australian Privacy Act / ACL aware templates |
| **Admin** | `/admin` | Bookings, enquiries, blog editor, service areas |

Plus `/sitemap.xml`, `/robots.txt` and a custom 404.

---

## Quick start (local development)

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
#    Edit .env — at minimum set DATABASE_URL and AUTH_SECRET.
#    Generate a secret with:  openssl rand -base64 48

# 3. Create the tables and seed the starter content
npm run setup      # = prisma db push && prisma db seed

# 4. Run it
npm run dev        # http://localhost:3000
```

Nothing above is domain-specific — the site detects the domain it is served on
(see [Domain](#domain)), so a fresh clone works immediately.

Sign in to the admin panel at `/admin/login` with the `SEED_ADMIN_EMAIL` and
`SEED_ADMIN_PASSWORD` from your `.env`. **Change that password immediately**
from *Account settings*.

---

## Deploying to a normal server (cPanel / Plesk / VPS)

This is a Node application, not static HTML. It needs a Node process running.

### 1. Database

Create a MySQL/MariaDB database and user (cPanel → MySQL Databases), then set
`DATABASE_URL` in `.env`:

```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE"
```

If the password contains `@ : / ? #` or `%`, URL-encode it (`@` becomes `%40`).

### 2. Build and start

```bash
npm ci
npx prisma db push        # creates the tables
npm run db:seed           # first admin + service areas + starter posts
npm run build
npm start                 # serves on the configured port
```

On cPanel, use **Setup Node.js App**: set the application root, application
URL, startup file, and add the environment variables from `.env`. Set the
application mode to *Production*.

Keep the process alive with whatever the host provides — Passenger on cPanel,
or `pm2 start npm --name taxipeninsula -- start` on a plain VPS.

### 3. Reverse proxy

Point nginx/Apache at `http://127.0.0.1:<your port>` and terminate TLS at the
proxy. Make sure the proxy forwards the original host and scheme, or the site
cannot work out its own public address:

```nginx
proxy_set_header Host              $host;
proxy_set_header X-Forwarded-Host  $host;
proxy_set_header X-Forwarded-Proto $scheme;
```

### 4. Writable uploads directory

Images uploaded through the blog editor are written to `public/uploads`. That
directory must be writable by the Node process and must survive deployments —
if you deploy by replacing the whole directory, move it to persistent storage
and symlink it, or the images vanish on the next deploy.

---

## Environment variables

Every variable is documented inline in [`.env.example`](.env.example). The ones
that actually matter:

| Variable | Required | What breaks without it |
| --- | --- | --- |
| `DATABASE_URL` | **Yes** | Nothing works |
| `AUTH_SECRET` | **Yes** | Admin sign-in throws |
| `PORT` | No — defaults to 3000 | See [Port](#port) |
| `NEXT_PUBLIC_SITE_URL` | No — auto-detected | See [Domain](#domain) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` | In production | **Public forms refuse to submit** |
| `SMTP_*`, `MAIL_*` | Strongly recommended | Bookings are saved but no email is sent |
| `ENABLE_SMS` + `TWILIO_*` | Optional | Driver SMS alerts stay off |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` | Optional | Analytics/verification scripts are simply not loaded |

The admin dashboard shows a live status panel for email, reCAPTCHA and SMS, so
you can see at a glance whether an integration is actually configured.

### About reCAPTCHA and failing closed

With no `RECAPTCHA_SECRET_KEY`:

* in **development** verification is skipped and a warning is logged, so the
  site is usable before you have registered a reCAPTCHA site;
* in **production** verification **fails** and forms are rejected.

That is deliberate. A misconfigured production deploy must not silently accept
unverified submissions. Register a v3 site at
<https://www.google.com/recaptcha/admin> for your domain and paste both keys
into `.env`.

---

## Port

Several apps often share one box, so the port is an operator setting, never
hardcoded. It is taken from the first of these that is set:

| | How | Example |
| --- | --- | --- |
| 1 | `--port` flag | `npm start -- --port 4500` |
| 2 | `PORT` environment variable | `PORT=4500 npm start` |
| 3 | `PORT` in `.env` / `.env.local` | `PORT=4500` |
| 4 | Default | `3000` |

The shell environment deliberately beats `.env`, because managed hosts
(cPanel/Passenger, Docker, systemd) assign a port that way and the app has to
honour it.

`.env` is read by `scripts/run-next.mjs` before Next.js starts. That script
exists precisely so a `PORT` line in `.env` works — npm would otherwise expand
`$PORT` from the shell long before Next.js ever reads `.env`, and setting it
there would silently do nothing.

**A few ports cannot be used.** Chrome and Firefox refuse to connect to about
sixty well-known service ports — 6000 (X11), 6666, 5060, 587 and others — and
Next.js rejects them for the same reason. Ask for one and you get a clear
message naming the port and suggesting an alternative, rather than a site that
mysteriously will not load:

```
✖ Port 6000 cannot be used (set via the PORT environment variable).

  Chrome and Firefox refuse to open this port — it is on their blocked
  list of well-known service ports — and Next.js rejects it for the same
  reason. A site served there is unreachable in a browser.

  Pick another port, for example 6001, 8080 or 8000:
```

---

## Domain

**The domain is detected automatically.** Clone the repo, start it, and the site
works on whatever domain it is reached by — `taxipeninsula.com.au`, a staging
subdomain, a bare IP, `localhost`. Canonical tags, Open Graph URLs,
`sitemap.xml`, `robots.txt`, JSON-LD and the admin link in booking emails all
follow the request.

Behind a reverse proxy this relies on `X-Forwarded-Host` and
`X-Forwarded-Proto`; the nginx snippet above sets both.

Setting `NEXT_PUBLIC_SITE_URL` pins the domain instead, and is worth doing in
production for two reasons:

**Speed.** With it set, nothing reads request headers, so pages stay statically
prerendered — all 38 area pages and every blog post. With it unset, the domain
has to be read per request, so those pages render dynamically. Correct either
way; measurably faster when pinned.

**Trust.** `Host` is supplied by the client, and a misconfigured proxy can pass
a forged one straight through. Pinning the domain means a spoofed `Host` can
never reach a canonical tag or the admin link inside a booking notification
email. Verified: with the variable set, a request carrying
`Host: evil.example.com` still produces `https://taxipeninsula.com.au/...`
everywhere.

---

## Day-to-day admin

Everything below is doable by a non-technical user at `/admin`:

* **Bookings** — filter by status or upcoming trips, search by reference / name
  / phone / address, change status, add internal notes, delete.
* **Enquiries** — read contact-form messages, reply by email, mark read/replied.
* **Blog posts** — rich text editor with headings, lists, quotes, links and
  image upload; draft/publish; cover image; category; SEO title and meta
  description; auto-generated URL slug and reading time.
* **Service areas** — add a suburb and it immediately gets its own public page
  at `/areas/<slug>`, listed on `/areas` and (optionally) on the home page.
* **Account** — change your own password.

Adding a *new staff account* is a server-side operation by design. Create one
with a short script or by adding it to `prisma/seed.ts` and re-running
`npm run db:seed`.

---

## Architecture notes

**Forms save before they notify.** The booking and contact routes write to the
database *first*, then send email/SMS concurrently. An SMTP outage can never
lose a booking; whether the notification actually went out is recorded on the
record and shown in the admin panel.

**Blog HTML is sanitised on write, not on read.** `lib/sanitize.ts` runs every
submission through an allow-list before it is stored, so the database can never
hold a script tag regardless of what renders it later.

**Three layers of spam defence.** A hidden honeypot field (submissions are
silently discarded so a bot never learns it was caught), an in-memory
fixed-window rate limiter per IP, and reCAPTCHA v3 score checking.

**Auth is a signed JWT in an httpOnly cookie.** `middleware.ts` does a cheap
signature check on the Edge; every admin page and Server Action independently
calls `requireUser()`, because middleware is a convenience, not the security
boundary.

**The animated taxi is pure SVG + CSS.** No image requests, sharp at any size,
recoloured from theme tokens, and completely still for anyone with
`prefers-reduced-motion: reduce`.

**Watch out for the road strips.** `RoadStrip` positions its dash track
absolutely. The track is deliberately far wider than the viewport, and a
statically positioned one contributes its full width to the parent's
min-content size — which silently blows out any grid column it sits in. For the
same reason, grid templates here use `minmax(0, 1fr)` rather than `1fr`.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Generates the Prisma client, then builds |
| `npm start` | Production server |
| `npm run setup` | `db:push` + `db:seed` — first-time setup |
| `npm run db:push` | Applies `prisma/schema.prisma` to the database |
| `npm run db:seed` | Seeds admin user, 38 service areas, categories, 3 posts |
| `npm run db:studio` | Prisma Studio — a raw database browser |

---

## Before going live

See **[CONTENT.md](CONTENT.md)** — it lists every piece of placeholder content,
every credential you still need to obtain, and the legal items that must be
reviewed. Work through it top to bottom.
