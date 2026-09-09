/**
 * Service copy.
 *
 * The list of services is the one the business confirmed. The supporting
 * detail in each `points` array was drafted here and should be read once for
 * accuracy — particularly anything that reads as a commitment (wait times,
 * inclusions, what is and is not charged). See CONTENT.md, section 3.
 */

export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  points: string[];
  icon: IconName;
  featured?: boolean;
};

export type IconName =
  | "plane"
  | "wheelchair"
  | "support"
  | "group"
  | "briefcase"
  | "grape"
  | "school"
  | "ship"
  | "parcel";

export const services: Service[] = [
  {
    id: "airport",
    title: "Airport transfers",
    short: "Tullamarine, Avalon and Essendon Fields — met at the door, on time.",
    description:
      "We track your flight number, so a delayed landing does not mean a cancelled cab. Your driver waits in the designated pickup zone with your name on a sign, helps with the bags, and knows which terminal actually has the short-stay lift working.",
    points: [
      "Melbourne Airport (T1, T2, T3, T4) and Avalon",
      "Flight tracking — we adjust for delays at no charge",
      "Meet-and-greet at arrivals, or kerbside if you prefer",
      "Fixed quotes available for regular corporate runs",
    ],
    icon: "plane",
    featured: true,
  },
  {
    id: "wheelchair",
    title: "Wheelchair accessible transport",
    short: "Hydraulic ramp, certified restraints, and drivers trained to use both.",
    description:
      "Our WAT vehicles take most manual and powered chairs without the passenger transferring seats. Every driver holds the required accreditation and has been trained on the four-point restraint system — because a ramp is only half the job.",
    points: [
      "Rear hydraulic ramp with a low-gradient approach",
      "Four-point wheelchair restraints, fitted and checked every trip",
      "Room for a carer and up to five other passengers",
      "Multi Purpose Taxi Program (MPTP) cards accepted",
    ],
    icon: "wheelchair",
    featured: true,
  },
  {
    id: "ndis",
    title: "NDIS transport",
    short: "Registered NDIS provider — plan-managed and self-managed welcome.",
    description:
      "Getting to a day program, an appointment or a shift should not be the hardest part of the week. We are a registered NDIS provider, so transport supports in your plan can be used with us directly — and we will tell you honestly up front how your particular plan can be billed.",
    points: [
      "Registered NDIS provider",
      "Plan-managed bookings invoiced directly to your plan manager",
      "Self-managed and agency-managed arrangements supported",
      "Regular standing bookings with a consistent driver where possible",
      "Wheelchair accessible vehicles available on request",
    ],
    icon: "support",
    featured: true,
  },
  {
    id: "events",
    title: "Group & event transfers",
    short: "Eleven seats. One fare. No splitting the party across three cabs.",
    description:
      "Weddings, footy at the 'G, a birthday dinner in Fitzroy or a hens weekend down the Peninsula — one maxi keeps the group together and the conversation going, and costs less than the cabs it replaces.",
    points: [
      "Up to 11 passengers in a single vehicle",
      "Multiple pickup points on the way through",
      "Late-night returns — we are dispatching at 3am",
      "Weddings, corporate functions, race days and concerts",
      "Quoted up front so the cost is agreed before the night starts",
    ],
    icon: "group",
  },
  {
    id: "corporate",
    title: "Corporate accounts",
    short: "Monthly invoicing, named drivers, and a number that answers.",
    description:
      "Set up an account and your team books by name and cost centre instead of chasing receipts. One consolidated invoice at month end, itemised by passenger and trip, ready to hand straight to finance.",
    points: [
      "Consolidated monthly invoicing with per-trip breakdown",
      "Cost-centre and reference tagging on every booking",
      "Priority dispatch during peak periods",
      "Regular driver where the schedule allows",
    ],
    icon: "briefcase",
  },
  {
    id: "tours",
    title: "Winery & day tours",
    short: "The Peninsula's cellar doors, at your pace, with a sober driver.",
    description:
      "Book the van for the day and build your own route — Red Hill, Merricks, Main Ridge, a long lunch, and the hot springs on the way home. Your driver knows which cellar doors need a booking and which ones will squeeze you in.",
    points: [
      "Half-day and full-day charter rates",
      "Custom itineraries across the Mornington Peninsula",
      "Esky-friendly boot space for the bottles you buy",
      "Hot springs, Arthurs Seat and Sorrento ferry drop-offs",
    ],
    icon: "grape",
  },
  {
    id: "school",
    title: "School & regular runs",
    short: "The same driver, the same time, every school day.",
    description:
      "A standing booking for the school run, medical appointments or day programs. You get a consistent driver your family recognises, and we call you if anything changes rather than leaving anyone waiting at a gate.",
    points: [
      "Standing weekly or daily bookings",
      "Australian-standard baby capsules, seats and boosters",
      "Consistent driver wherever rostering allows",
      "Direct SMS when the vehicle is on its way",
    ],
    icon: "school",
  },
  {
    id: "cruise",
    title: "Cruise & ferry transfers",
    short: "Station Pier and the Sorrento–Queenscliff ferry, luggage and all.",
    description:
      "Cruise days at Station Pier are chaos. We book you a window, take the bags, and get you to the terminal without circling Beacon Cove for twenty minutes looking for a park.",
    points: [
      "Station Pier and Docklands cruise terminals",
      "Sorrento–Queenscliff ferry connections",
      "Generous luggage capacity in the maxi fleet",
      "Group rates for travelling parties",
    ],
    icon: "ship",
  },
  {
    id: "parcel",
    title: "Parcel & courier runs",
    short: "Urgent documents and freight, moved by a driver you can call.",
    description:
      "Sometimes it is not a person that needs to be across town in forty minutes. We run time-critical documents, medical samples and small freight with proof of delivery on arrival.",
    points: [
      "Same-day point-to-point delivery",
      "Proof of delivery photographed and sent",
      "Suitable for documents, samples and small freight",
      "Account billing available",
    ],
    icon: "parcel",
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function getService(id: string) {
  return services.find((s) => s.id === id);
}
