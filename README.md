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
npm start                 # serves on PORT (default 3000)
```

On cPanel, use **Setup Node.js App**: set the application root, application
URL, startup file, and add the environment variables from `.env`. Set the
application mode to *Production*.

Keep the process alive with whatever the host provides — Passenger on cPanel,
or `pm2 start npm --name taxipeninsula -- start` on a plain VPS.

### 3. Reverse proxy

Point nginx/Apache at `http://127.0.0.1:3000` and terminate TLS at the proxy.
`NEXT_PUBLIC_SITE_URL` must be the real public HTTPS URL — it drives canonical
URLs, the sitemap and Open Graph tags.

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
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Wrong canonical URLs and sitemap |
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
<https://www.google.com/recaptcha/admin> for `taxipeninsula.com.au` and paste
both keys into `.env`.

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
