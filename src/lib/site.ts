/**
 * SINGLE SOURCE OF TRUTH for every business detail on the site.
 *
 * Values here were supplied by the business owner. Anything still marked
 * PLACEHOLDER needs confirming before launch — see CONTENT.md.
 */

export const site = {
  name: "Taxi Peninsula",
  legalName: "Taxi Peninsula",
  abn: "91 637 106 042",

  /** Primary tagline — short, local, and covers 24/7 + airport in five words. */
  tagline: "Rosebud to the runway, around the clock.",
  /** Secondary line used under the tagline in hero/OG contexts. */
  subTagline:
    "Maxi taxis, wheelchair accessible vans and airport transfers across the Mornington Peninsula and south-east Melbourne.",

  description:
    "Taxi Peninsula runs maxi taxis, wheelchair accessible vans (WAT) and airport transfers across the Mornington Peninsula and south-east Melbourne. NDIS registered, RACV and TAC approved. Book online or call 24/7.",

  phone: "0468 323 211",
  phoneHref: "+61468323211",
  email: "support@taxipeninsula.com.au",

  address: {
    /** Service-based business — no shopfront street address published. */
    street: "",
    suburb: "Rosebud",
    state: "VIC",
    postcode: "3939",
    country: "Australia",
  },

  hours: "24 hours a day, 7 days a week — including public holidays",
  /** Explicitly advertised because overnight airport runs are a core service. */
  overnightAirport: true,

  social: {
    facebook: "https://www.facebook.com/taxipeninsula.com.au/",
    instagram: "https://www.instagram.com/taxipeninsula/",
    linkedin: "https://www.linkedin.com/in/taxi-peninsula-285110283/",
    google: "https://share.google/iPdCX1Df57mcgJp9X",
  },

  /** Google Maps embed target for the contact page. */
  map: {
    lat: -38.3567,
    lng: 144.9046,
    embedQuery: "Rosebud+VIC+3939+Australia",
  },

  logo: {
    src: "/brand/logo-dark.png",
    width: 2000,
    height: 1367,
    alt: "Taxi Peninsula",
  },
} as const;

/**
 * Accreditations and approvals. These are displayed as trust badges across the
 * site — they must stay accurate, so if an approval lapses, remove the entry
 * here and it disappears everywhere at once.
 */
export const accreditations = [
  {
    id: "ndis",
    name: "NDIS",
    full: "NDIS registered provider",
    blurb:
      "Registered to deliver transport supports for NDIS participants — plan-managed and self-managed bookings welcome.",
    logo: "/brand/accreditations/ndis.svg",
  },
  {
    id: "tac",
    name: "TAC",
    full: "Transport Accident Commission approved",
    blurb:
      "Approved for TAC client transport, so eligible medical and rehabilitation trips can be billed directly.",
    logo: "/brand/accreditations/tac.svg",
  },
  {
    id: "racv",
    name: "RACV",
    full: "RACV approved operator",
    blurb:
      "Recognised by RACV, Victoria's motoring body, as an approved passenger transport operator.",
    logo: "/brand/accreditations/racv.svg",
  },
] as const;

/** Vehicle options offered in the booking form. */
export const carTypes = [
  {
    value: "sedan",
    label: "Sedan",
    seats: 4,
    luggage: "2 large bags",
    blurb: "The everyday fare — airport runs, school pick-ups and a night out.",
    icon: "sedan",
  },
  {
    value: "wagon",
    label: "Station Wagon",
    seats: 4,
    luggage: "4 large bags",
    blurb: "Same price as a sedan with room for golf clubs and surfboards.",
    icon: "wagon",
  },
  {
    value: "suv",
    label: "SUV",
    seats: 6,
    luggage: "4 large bags",
    blurb: "Extra headroom and a high step-in for easier boarding.",
    icon: "suv",
  },
  {
    value: "maxi",
    label: "Maxi Taxi",
    seats: 11,
    luggage: "8 large bags",
    blurb: "Up to eleven seats. One fare, one van, no convoy of separate cabs.",
    icon: "maxi",
  },
  {
    value: "wheelchair",
    label: "Wheelchair Accessible Maxi (WAT)",
    seats: 10,
    luggage: "6 large bags",
    blurb:
      "Hydraulic rear ramp, certified restraints and a driver trained to use them.",
    icon: "wheelchair",
  },
  {
    value: "baby-seat",
    label: "Sedan with Baby / Booster Seat",
    seats: 4,
    luggage: "2 large bags",
    blurb: "Australian-standard capsule, baby seat or booster — tell us the age.",
    icon: "baby",
  },
  {
    value: "parcel",
    label: "Parcel / Courier Run",
    seats: 0,
    luggage: "Boot or full van",
    blurb: "No passengers — documents, samples or small freight, moved today.",
    icon: "parcel",
  },
] as const;

export type CarTypeValue = (typeof carTypes)[number]["value"];
export const carTypeValues = carTypes.map((c) => c.value) as string[];

/** Primary navigation. */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLegalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
] as const;

export function fullAddress() {
  const a = site.address;
  return [a.street, `${a.suburb} ${a.state} ${a.postcode}`]
    .filter(Boolean)
    .join(", ");
}

/**
 * The site's base URL is NOT hardcoded here — it is detected from the incoming
 * request so a fresh clone serves correctly on whatever domain it is reached
 * by. See `src/lib/site-url.ts` for `absoluteUrl()` and friends.
 */
