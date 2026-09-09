# Pre-launch checklist

Everything on this site that is **not yet confirmed**, in the order it matters.
Work top to bottom. Items marked 🔴 will cause real problems if launched as-is.

---

## 1. Confirmed business details ✅

These were supplied and are already live throughout the site. They all come from
one file — [`src/lib/site.ts`](src/lib/site.ts) — so changing a phone number is a
one-line edit that updates every page, email template and structured-data block.

| Field | Current value |
| --- | --- |
| Trading name | Taxi Peninsula |
| ABN | 91 637 106 042 |
| Phone | 0468 323 211 |
| Email | support@taxipeninsula.com.au |
| Based in | Rosebud VIC 3939 |
| Hours | 24/7 including public holidays |
| Domain | https://taxipeninsula.com.au |
| Facebook | facebook.com/taxipeninsula.com.au |
| Instagram | instagram.com/taxipeninsula |
| LinkedIn | linkedin.com/in/taxi-peninsula-285110283 |
| Google | share.google/iPdCX1Df57mcgJp9X |
| Logo | `public/brand/logo-dark.png` |

**Tagline (created for you):** *"Rosebud to the runway, around the clock."*
Change it in `site.ts` → `site.tagline` if you'd like something different.

### Still to confirm

- [ ] **Registered office address.** The site currently says "Rosebud VIC 3939"
      with no street address, which is correct for a service-based operator. If
      you want a full street address shown, set `site.address.street`.
- [ ] **Map location.** The contact page map is centred on Rosebud 3939
      generally. Set exact coordinates in `site.map` if you want a precise pin.

---

## 2. 🔴 Credentials you still need to obtain

None of these are in the code. All go in `.env` on the server.

- [ ] **🔴 Google reCAPTCHA v3 keys** — register at
      <https://www.google.com/recaptcha/admin> for `taxipeninsula.com.au`.
      Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY`.
      **Until these are set, the booking and contact forms will refuse to submit
      in production.** This is deliberate — see the README.
- [ ] **🔴 SMTP credentials** — host, port, username, password for
      `support@taxipeninsula.com.au`. Without these, bookings are still saved to
      the database but **no notification email is sent to you or the customer**.
      For cPanel mail this is usually `mail.taxipeninsula.com.au`, port 465,
      secure = true.
- [ ] **🔴 `AUTH_SECRET`** — generate with `openssl rand -base64 48`. Admin
      sign-in will not work without it.
- [ ] **🔴 Database credentials** — MySQL/MariaDB database, user and password.
- [ ] **Set `NEXT_PUBLIC_SITE_URL="https://taxipeninsula.com.au"`.** Not
      required — the domain is auto-detected, so the site runs correctly
      without it — but pinning it in production makes every page statically
      prerendered (faster) and stops a forged `Host` header reaching your
      canonical tags or booking emails. See README → Domain.
- [ ] **Pick a `PORT`** if 3000 is already taken on your server. Set it in
      `.env`, or per-run with `PORT=4500 npm start`. See README → Port.
- [ ] **Change the seeded admin password.** The seed creates an account with
      whatever `SEED_ADMIN_PASSWORD` is set to. Sign in and change it at
      `/admin/account` immediately.
- [ ] **SPF and DKIM records** for the sending domain, or booking confirmations
      will land in spam.

### Optional, when you have them

- [ ] Google Analytics 4 → `NEXT_PUBLIC_GA_MEASUREMENT_ID` (`G-XXXXXXXXXX`)
- [ ] Google Tag Manager → `NEXT_PUBLIC_GTM_ID` (`GTM-XXXXXXX`)
- [ ] Google Search Console → `NEXT_PUBLIC_GSC_VERIFICATION` (the `content`
      value from the HTML-tag verification method)
- [ ] Twilio for driver SMS → `ENABLE_SMS=true` plus `TWILIO_ACCOUNT_SID`,
      `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `DRIVER_SMS_NUMBER`.
      **Built and ready, but off by default** — email is the primary
      notification as you asked.

---

## 3. Service copy — please read once

File: [`src/content/services.ts`](src/content/services.ts)

All nine services you asked for are there: airport transfers (MEL/Avalon),
wheelchair accessible, NDIS, group & event transfers, corporate accounts,
winery & day tours, school & regular runs, cruise & ferry, parcel/courier.

The *list* is yours. The supporting bullet points were **drafted here** and read
as commitments to a customer. Please confirm or correct anything that promises
something specific:

- [ ] "Flight tracking — we adjust for delays **at no charge**"
- [ ] "**Consolidated monthly invoicing** with per-trip breakdown" (corporate)
- [ ] "**Trailer available** for oversized luggage on request" — removed, but
      check nothing else claims equipment you don't have
- [ ] "**Proof of delivery photographed and sent**" (parcel runs)
- [ ] "Regular driver where the schedule allows" (corporate, school runs)
- [ ] "Room for a carer **plus five other passengers**" (WAT capacity)
- [ ] Vehicle seat counts and luggage capacities in `src/lib/site.ts` →
      `carTypes`. Currently: Sedan 4, Wagon 4, SUV 6, Maxi 11, WAT 10,
      Baby-seat sedan 4.

**Pricing** is set to "quoted on request" everywhere, as you specified. No fare
table is published anywhere on the site.

---

## 4. Service areas

38 suburbs are seeded across four regions: Mornington Peninsula, Bayside &
Frankston, South-East Melbourne, and Melbourne City & Airports. Each has its own
page at `/areas/<slug>` for local search.

- [ ] **Check the travel-time estimates.** Each area shows an approximate time to
      Melbourne Airport (e.g. "≈ 1 hr 30 min" from Rosebud). These are estimates
      written here, not measured. Correct any that are wrong — a wrong number on
      an airport transfer page costs you trust.
- [ ] **Check the local detail.** Some descriptions reference specific local
      knowledge (Martha Cove gates, Point Nepean Road in summer, Station Pier
      parking). Confirm these read as true to you.
- [ ] **Add or remove suburbs** at `/admin/areas` — no developer needed. Adding
      one immediately publishes a new page.

---

## 5. 🔴 Accreditation logos — read this before adding image files

You hold **NDIS**, **TAC** and **RACV** approvals, and these are displayed
prominently on the home page, services page, booking page, area pages and in the
footer.

They are currently rendered as **typeset text badges, not logo images** — and
that was a deliberate decision, not an oversight:

- **NDIS** — the "Registered NDIS Provider" logo may only be used by registered
  providers under the NDIS Commission's brand guidelines, in the approved form.
- **TAC** — the TAC logo is a registered trade mark; third-party use requires
  approval.
- **RACV** — RACV requires written permission for use of its marks.

Reproducing any of them without permission is a trade mark risk that falls on
your business, not on the website.

**To add the real logos:**

1. Obtain the official logo files and written permission from each organisation.
2. Drop them into `public/brand/accreditations/` as `ndis.svg`, `tac.svg`,
   `racv.svg` (filenames are already configured in `site.ts` → `accreditations`).
3. Tell your developer to switch `AccreditationStrip` to render the image.

- [ ] Confirm all three accreditations are **currently valid**. If one lapses,
      delete its entry from `accreditations` in `site.ts` and it disappears from
      every page at once.
- [ ] Confirm the NDIS registration is a **provider registration**, so the
      wording "Registered NDIS provider" is accurate.

---

## 6. 🔴 Testimonials — FICTIONAL, must be replaced or removed

File: [`src/content/testimonials.ts`](src/content/testimonials.ts)

The three reviews on the home page are **invented**. They are written to sound
plausible and are attributed to "Sample Name".

**Publishing invented testimonials as genuine customer reviews breaches
Australian Consumer Law** (misleading and deceptive conduct, ACL s18) and the
ACCC's guidance on online reviews. The ACCC has taken enforcement action over
exactly this.

Before launch, do one of:

- [ ] **Replace** all three with genuine, attributable reviews (with the
      reviewer's permission), **or**
- [ ] **Delete** `src/content/testimonials.ts` and remove the testimonials
      section from `src/app/(site)/page.tsx`, **or**
- [ ] Pull live reviews from your Google Business Profile instead.

---

## 7. 🔴 Legal pages — need a lawyer's review

`/terms` and `/privacy` are **drafted templates**, not legal advice. Both carry a
visible warning banner saying so — remove that banner (in
`src/components/site/LegalPage.tsx`) once they have been reviewed.

They were written to be Australia-specific and cover:

**Terms & Conditions** — booking is a request not a contract; quote-on-request
pricing; cancellations and no-shows; wheelchair restraint limits; NDIS/TAC/MPTP
billing; passenger conduct; lost property; delays; **Australian Consumer Law
non-excludable guarantees**; complaints (Safe Transport Victoria, Consumer
Affairs Victoria); Victorian governing law.

**Privacy Policy** — Privacy Act 1988 and the Australian Privacy Principles;
exactly what the booking form collects; **sensitive information** (disability,
mobility device, NDIS plan, TAC claim) and the basis for collecting it; Google
reCAPTCHA data handling; cookies and analytics; the Notifiable Data Breaches
scheme; seven-year retention; overseas disclosure; access and correction rights;
OAIC complaints.

- [ ] Have an Australian legal practitioner review both.
- [ ] Confirm the retention period (currently "at least seven years").
- [ ] Confirm the list of who you disclose data to matches reality.
- [ ] Update the "Last updated" date (currently 9 September 2026) in both files.
- [ ] Remove the template warning banner once reviewed.

---

## 8. Blog

Three starter articles are seeded and published:

1. *Melbourne Airport pickup zones, explained without the jargon*
2. *MPTP and NDIS transport: what you can actually claim*
3. *A Peninsula winery day that does not need a designated driver*

- [ ] **Read article 2 carefully.** It describes how MPTP and NDIS transport
      funding work. Scheme rules change and getting this wrong damages trust
      with exactly the customers you most want. It carries a "general
      information, not advice" disclaimer — confirm the substance is right.
- [ ] Article 1 lists Melbourne Airport terminals (T1 Qantas, T2 International,
      T3 Virgin, T4 Jetstar/Rex). Confirm still current.
- [ ] Add your own posts at `/admin/posts` — no developer needed.

---

## 9. Imagery

There are **no photographs anywhere on the site**. Every visual is either the
animated SVG maxi taxi or your logo. That is a deliberate choice — a stock photo
of a generic taxi looks worse than a distinctive illustration, and using photos
of vehicles that aren't yours would be misleading.

- [ ] **Optional but recommended:** photograph your actual fleet, especially a
      WAT vehicle with the ramp deployed. Real photos of real vehicles convert
      better than any illustration, particularly for accessible transport where
      customers want to see the equipment before they book.
- [ ] Add blog cover images via the admin panel (posts without one fall back to
      the animated taxi illustration, which looks fine).

---

## 10. Before you flip the switch

- [ ] Submit `https://taxipeninsula.com.au/sitemap.xml` to Google Search Console
- [ ] Test a real booking end to end and confirm the email arrives
- [ ] Test the booking form on an actual phone
- [ ] Check the Google Business Profile link resolves correctly
- [ ] Confirm HTTPS is working and HTTP redirects to it
- [ ] Confirm `public/uploads` is writable and persists across deploys
- [ ] Set up a database backup schedule — bookings live there
