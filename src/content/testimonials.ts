/**
 * ⚠️ PLACEHOLDER CONTENT — THESE REVIEWS ARE FICTIONAL.
 *
 * Publishing invented testimonials as if they were real customer reviews would
 * breach Australian Consumer Law (misleading and deceptive conduct, ACL s18)
 * and the ACCC's guidance on online reviews. Replace every entry below with
 * genuine, attributable reviews — or delete this file and remove the
 * testimonials section from the home page — BEFORE the site goes live.
 *
 * See CONTENT.md, section 6.
 */

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Booked the wheelchair van for Mum's specialist appointment in the city. The driver had the ramp down before I'd got her jacket on and knew exactly how to secure the chair. First time in months she hasn't arrived stressed.",
    name: "Sample Name",
    detail: "Mount Eliza — wheelchair accessible transfer",
    rating: 5,
  },
  {
    quote:
      "Ten of us from a wedding in Red Hill back to Frankston at midnight. One van, one fare, everyone home. Cheaper than the three cabs we'd have needed and infinitely less argument about who got which car.",
    name: "Sample Name",
    detail: "Red Hill — group transfer",
    rating: 5,
  },
  {
    quote:
      "Flight from Singapore landed ninety minutes late at 2am. I fully expected to be stranded. Driver was waiting at arrivals, no extra charge, no drama about the delay.",
    name: "Sample Name",
    detail: "Melbourne Airport T2 — arrival transfer",
    rating: 5,
  },
];
