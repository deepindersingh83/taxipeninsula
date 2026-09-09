/**
 * Seeds the database with the first admin account, the service areas, blog
 * categories and three starter blog posts.
 *
 * Safe to run more than once — every write is an upsert keyed on a unique
 * field, so re-running updates rather than duplicates.
 *
 *   npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* -------------------------------------------------------------------------- */
/* Service areas                                                              */
/* -------------------------------------------------------------------------- */

type AreaSeed = {
  slug: string;
  name: string;
  region: string;
  headline: string;
  description: string;
  postcodes: string;
  travelTime: string;
  featured?: boolean;
  sortOrder: number;
};

const PENINSULA = "Mornington Peninsula";
const BAYSIDE = "Bayside & Frankston";
const SOUTH_EAST = "South-East Melbourne";
const CITY = "Melbourne City & Airports";

const areas: AreaSeed[] = [
  /* ----------------------------------------------- Mornington Peninsula --- */
  {
    slug: "rosebud",
    name: "Rosebud",
    region: PENINSULA,
    headline: "Our home base — vans on the road in Rosebud around the clock.",
    description:
      "Rosebud is where we are based, so it is where our response times are quickest. Whether it is a 4am run to Tullamarine, a wheelchair accessible trip to Rosebud Hospital, or the foreshore back to the caravan park after dinner, there is usually a vehicle within a few minutes of your door.",
    postcodes: "3939, 3940",
    travelTime: "≈ 1 hr 30 min to Melbourne Airport",
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "rye",
    name: "Rye",
    region: PENINSULA,
    headline: "Back-beach pickups and airport runs from Rye.",
    description:
      "From the Rye foreshore to the back beaches, we cover the whole stretch. Summer holidays mean the Point Nepean Road crawls — we build that into the pickup time so you still make your flight.",
    postcodes: "3941",
    travelTime: "≈ 1 hr 40 min to Melbourne Airport",
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "sorrento",
    name: "Sorrento",
    region: PENINSULA,
    headline: "Sorrento ferry connections, Ocean Beach and the main street.",
    description:
      "We meet the Sorrento–Queenscliff ferry, run the Ocean Beach road, and know that on a January Saturday the only sane way to Ocean Beach Road is the back way. Maxi vans for the whole holiday house, not three separate cabs.",
    postcodes: "3943",
    travelTime: "≈ 1 hr 45 min to Melbourne Airport",
    featured: true,
    sortOrder: 3,
  },
  {
    slug: "portsea",
    name: "Portsea",
    region: PENINSULA,
    headline: "Portsea, Point Nepean and the far end of the Peninsula.",
    description:
      "The furthest point we run to, and one of the busiest in summer. Book Portsea trips ahead where you can — especially anything before 6am — and we will have a driver allocated rather than hoping one is nearby.",
    postcodes: "3944",
    travelTime: "≈ 1 hr 50 min to Melbourne Airport",
    sortOrder: 4,
  },
  {
    slug: "blairgowrie",
    name: "Blairgowrie",
    region: PENINSULA,
    headline: "Blairgowrie marina, back beaches and holiday houses.",
    description:
      "Boat ramp pickups, holiday-house transfers and the run into Sorrento for dinner. Our maxi vans take the whole group plus the eskies.",
    postcodes: "3942",
    travelTime: "≈ 1 hr 45 min to Melbourne Airport",
    sortOrder: 5,
  },
  {
    slug: "dromana",
    name: "Dromana",
    region: PENINSULA,
    headline: "Dromana, Arthurs Seat and the Safety Beach foreshore.",
    description:
      "Arthurs Seat Eagle, the drive-in, the foreshore caravan parks and the wineries just up the hill. Dromana sits right on our main north–south route, so pickups here are quick.",
    postcodes: "3936",
    travelTime: "≈ 1 hr 20 min to Melbourne Airport",
    featured: true,
    sortOrder: 6,
  },
  {
    slug: "mccrae",
    name: "McCrae",
    region: PENINSULA,
    headline: "McCrae lighthouse, the foreshore and up the hill.",
    description:
      "A short hop from our Rosebud base. Regular runs to medical appointments in Frankston and the city, plus the summer airport traffic.",
    postcodes: "3938",
    travelTime: "≈ 1 hr 25 min to Melbourne Airport",
    sortOrder: 7,
  },
  {
    slug: "safety-beach",
    name: "Safety Beach",
    region: PENINSULA,
    headline: "Safety Beach, Martha Cove and the marina.",
    description:
      "Marina berth pickups, the Martha Cove estate and the beach boxes. We know which of the Martha Cove gates actually opens for a taxi at midnight.",
    postcodes: "3936",
    travelTime: "≈ 1 hr 15 min to Melbourne Airport",
    sortOrder: 8,
  },
  {
    slug: "mount-martha",
    name: "Mount Martha",
    region: PENINSULA,
    headline: "Mount Martha village, the Esplanade and Bay Road.",
    description:
      "Steep driveways and long crescents are normal here — tell us the house number and we will find you rather than idling on the corner. Wheelchair accessible vans available on the same day where possible.",
    postcodes: "3934",
    travelTime: "≈ 1 hr 10 min to Melbourne Airport",
    featured: true,
    sortOrder: 9,
  },
  {
    slug: "mornington",
    name: "Mornington",
    region: PENINSULA,
    headline: "Mornington main street, the pier and Peninsula Private.",
    description:
      "One of our busiest areas outside Rosebud. Main Street on a Friday night, Peninsula Private Hospital appointments, the Wednesday market, and airport runs at every hour.",
    postcodes: "3931",
    travelTime: "≈ 1 hr 5 min to Melbourne Airport",
    featured: true,
    sortOrder: 10,
  },
  {
    slug: "mount-eliza",
    name: "Mount Eliza",
    region: PENINSULA,
    headline: "Mount Eliza village, Ranelagh and the Nepean Highway.",
    description:
      "Corporate airport runs, school transport and regular medical appointments. Close enough to Frankston that we can usually be there in under fifteen minutes.",
    postcodes: "3930",
    travelTime: "≈ 1 hr to Melbourne Airport",
    featured: true,
    sortOrder: 11,
  },
  {
    slug: "hastings",
    name: "Hastings",
    region: PENINSULA,
    headline: "Hastings, the marina and the Western Port side.",
    description:
      "The Western Port side of the Peninsula is often forgotten by city-based operators. We are not city-based. Hastings, the marina, the industrial precinct and the rail connection at Frankston.",
    postcodes: "3915",
    travelTime: "≈ 1 hr 10 min to Melbourne Airport",
    sortOrder: 12,
  },
  {
    slug: "somerville",
    name: "Somerville",
    region: PENINSULA,
    headline: "Somerville, Tyabb and the Frankston–Flinders Road.",
    description:
      "School runs, station connections and airport transfers along the Frankston–Flinders Road corridor.",
    postcodes: "3912",
    travelTime: "≈ 1 hr 5 min to Melbourne Airport",
    sortOrder: 13,
  },
  {
    slug: "balnarring",
    name: "Balnarring",
    region: PENINSULA,
    headline: "Balnarring, Merricks and the Western Port beaches.",
    description:
      "Quiet roads, long driveways and a lot of wineries within ten minutes. A popular start and finish point for our Peninsula wine tours.",
    postcodes: "3926",
    travelTime: "≈ 1 hr 20 min to Melbourne Airport",
    sortOrder: 14,
  },
  {
    slug: "flinders",
    name: "Flinders",
    region: PENINSULA,
    headline: "Flinders village, the golf club and the pier.",
    description:
      "The far south-east corner of the Peninsula. Book ahead where you can — it is a long run for a vehicle, so a scheduled booking always beats hoping one is nearby.",
    postcodes: "3929",
    travelTime: "≈ 1 hr 30 min to Melbourne Airport",
    sortOrder: 15,
  },
  {
    slug: "red-hill",
    name: "Red Hill",
    region: PENINSULA,
    headline: "Red Hill cellar doors, the market and Main Ridge.",
    description:
      "The heart of Peninsula wine country and the centre of most of our day tours. Your driver knows which cellar doors need a booking and which will fit you in at short notice.",
    postcodes: "3937",
    travelTime: "≈ 1 hr 20 min to Melbourne Airport",
    featured: true,
    sortOrder: 16,
  },
  {
    slug: "tootgarook",
    name: "Tootgarook",
    region: PENINSULA,
    headline: "Tootgarook, Capel Sound and the wetlands.",
    description:
      "Immediately next door to our Rosebud base, so response times here are among our fastest on the Peninsula.",
    postcodes: "3941",
    travelTime: "≈ 1 hr 35 min to Melbourne Airport",
    sortOrder: 17,
  },

  /* -------------------------------------------------- Bayside & Frankston -- */
  {
    slug: "frankston",
    name: "Frankston",
    region: BAYSIDE,
    headline: "Frankston station, the hospital and the whole CBD.",
    description:
      "Frankston Hospital, the station, Bayside Shopping Centre and Monash Peninsula campus. A major hub for us — wheelchair accessible vans, NDIS transport and airport runs all day and all night.",
    postcodes: "3199",
    travelTime: "≈ 55 min to Melbourne Airport",
    featured: true,
    sortOrder: 20,
  },
  {
    slug: "frankston-south",
    name: "Frankston South",
    region: BAYSIDE,
    headline: "Frankston South, Olivers Hill and Sweetwater Creek.",
    description:
      "The quieter side of Frankston, with the winding roads to match. Regular school runs, medical transport and airport transfers.",
    postcodes: "3199",
    travelTime: "≈ 1 hr to Melbourne Airport",
    sortOrder: 21,
  },
  {
    slug: "seaford",
    name: "Seaford",
    region: BAYSIDE,
    headline: "Seaford station, the wetlands and the foreshore.",
    description:
      "Straight up the Nepean Highway from Frankston. Station connections, airport runs and accessible transport.",
    postcodes: "3198",
    travelTime: "≈ 50 min to Melbourne Airport",
    sortOrder: 22,
  },
  {
    slug: "carrum",
    name: "Carrum",
    region: BAYSIDE,
    headline: "Carrum, Patterson River and the boat ramp.",
    description:
      "Foreshore pickups, the station and the run into Frankston or the city.",
    postcodes: "3197",
    travelTime: "≈ 50 min to Melbourne Airport",
    sortOrder: 23,
  },
  {
    slug: "chelsea",
    name: "Chelsea",
    region: BAYSIDE,
    headline: "Chelsea, Bonbeach and the beachfront strip.",
    description:
      "Station connections, beachfront pickups and airport transfers along the Nepean Highway.",
    postcodes: "3196",
    travelTime: "≈ 45 min to Melbourne Airport",
    sortOrder: 24,
  },
  {
    slug: "mordialloc",
    name: "Mordialloc",
    region: BAYSIDE,
    headline: "Mordialloc pier, Main Street and the creek.",
    description:
      "A regular stop on our northbound airport runs. Group bookings for the Main Street restaurants are a specialty.",
    postcodes: "3195",
    travelTime: "≈ 40 min to Melbourne Airport",
    sortOrder: 25,
  },
  {
    slug: "cheltenham",
    name: "Cheltenham",
    region: BAYSIDE,
    headline: "Cheltenham, Southland and the hospital precinct.",
    description:
      "Southland Shopping Centre, medical appointments and the run up the highway to the city or the airport.",
    postcodes: "3192",
    travelTime: "≈ 35 min to Melbourne Airport",
    sortOrder: 26,
  },
  {
    slug: "brighton",
    name: "Brighton",
    region: BAYSIDE,
    headline: "Brighton, Church Street and the bathing boxes.",
    description:
      "Corporate airport transfers, event transport and accessible vehicles across the Bayside strip.",
    postcodes: "3186",
    travelTime: "≈ 35 min to Melbourne Airport",
    sortOrder: 27,
  },

  /* --------------------------------------------------- South-East Melbourne */
  {
    slug: "cranbourne",
    name: "Cranbourne",
    region: SOUTH_EAST,
    headline: "Cranbourne, the botanic gardens and the racecourse.",
    description:
      "Growing fast, and badly served by cabs at 4am. We run scheduled airport transfers and NDIS transport across the whole Cranbourne area.",
    postcodes: "3977",
    travelTime: "≈ 1 hr to Melbourne Airport",
    featured: true,
    sortOrder: 30,
  },
  {
    slug: "dandenong",
    name: "Dandenong",
    region: SOUTH_EAST,
    headline: "Dandenong station, the market and the hospital.",
    description:
      "Dandenong Hospital, the market, the station and the industrial precinct. Wheelchair accessible vehicles and NDIS transport available daily.",
    postcodes: "3175",
    travelTime: "≈ 50 min to Melbourne Airport",
    featured: true,
    sortOrder: 31,
  },
  {
    slug: "berwick",
    name: "Berwick",
    region: SOUTH_EAST,
    headline: "Berwick village, St John of God and the university campus.",
    description:
      "Hospital appointments, campus runs and early-morning airport transfers from across the Berwick area.",
    postcodes: "3806",
    travelTime: "≈ 1 hr to Melbourne Airport",
    sortOrder: 32,
  },
  {
    slug: "narre-warren",
    name: "Narre Warren",
    region: SOUTH_EAST,
    headline: "Narre Warren, Fountain Gate and the Princes Highway.",
    description:
      "Shopping centre pickups, station connections and airport runs at every hour of the night.",
    postcodes: "3805",
    travelTime: "≈ 1 hr to Melbourne Airport",
    sortOrder: 33,
  },
  {
    slug: "pakenham",
    name: "Pakenham",
    region: SOUTH_EAST,
    headline: "Pakenham, Officer and the far south-east.",
    description:
      "A long way from the airport and a long way from most operators. Book ahead and we will have a driver rostered on for you.",
    postcodes: "3810",
    travelTime: "≈ 1 hr 10 min to Melbourne Airport",
    sortOrder: 34,
  },
  {
    slug: "clayton",
    name: "Clayton",
    region: SOUTH_EAST,
    headline: "Monash Medical Centre, the university and Clayton Road.",
    description:
      "Monash Medical Centre and Monash University generate a lot of accessible and scheduled transport. We do both.",
    postcodes: "3168",
    travelTime: "≈ 45 min to Melbourne Airport",
    sortOrder: 35,
  },
  {
    slug: "springvale",
    name: "Springvale",
    region: SOUTH_EAST,
    headline: "Springvale, the shopping strip and the cemetery.",
    description:
      "Regular NDIS and medical transport, plus airport runs along the Princes Highway.",
    postcodes: "3171",
    travelTime: "≈ 45 min to Melbourne Airport",
    sortOrder: 36,
  },
  {
    slug: "rowville",
    name: "Rowville",
    region: SOUTH_EAST,
    headline: "Rowville, Stud Park and the EastLink corridor.",
    description:
      "EastLink puts Rowville within easy reach of both the airport and the Peninsula. Maxi vans for family and group transfers.",
    postcodes: "3178",
    travelTime: "≈ 45 min to Melbourne Airport",
    sortOrder: 37,
  },

  /* ------------------------------------------ Melbourne City & Airports ---- */
  {
    slug: "melbourne-airport",
    name: "Melbourne Airport (Tullamarine)",
    region: CITY,
    headline: "All four terminals, meet-and-greet, flight tracking included.",
    description:
      "We track your flight number, so a delayed landing does not cost you your ride. Meet you at arrivals with a sign, or kerbside at the pickup zone if you would rather. Maxi vans for families with a mountain of luggage, and wheelchair accessible vehicles booked in advance.",
    postcodes: "3045",
    travelTime: "T1, T2, T3 and T4",
    featured: true,
    sortOrder: 40,
  },
  {
    slug: "avalon-airport",
    name: "Avalon Airport",
    region: CITY,
    headline: "Avalon transfers via the West Gate or the ferry.",
    description:
      "Avalon is a genuinely long run from the Peninsula, and worth booking well ahead. We will tell you honestly whether the Sorrento–Queenscliff ferry route or the West Gate is faster on your date.",
    postcodes: "3212",
    travelTime: "≈ 1 hr 45 min from Rosebud",
    sortOrder: 41,
  },
  {
    slug: "melbourne-cbd",
    name: "Melbourne CBD",
    region: CITY,
    headline: "The city, Southbank, Docklands and the sporting precinct.",
    description:
      "Hotel pickups, the MCG and Marvel Stadium, Crown, and the theatres. One maxi keeps a group of eleven together after a show rather than splitting across three cabs and three fares.",
    postcodes: "3000, 3006, 3008",
    travelTime: "≈ 1 hr 15 min from Rosebud",
    featured: true,
    sortOrder: 42,
  },
  {
    slug: "station-pier",
    name: "Station Pier & Port Melbourne",
    region: CITY,
    headline: "Cruise terminal and Spirit of Tasmania transfers.",
    description:
      "Cruise days at Station Pier are chaos and parking is worse. We drop you at the terminal door with the luggage, and pick up on disembarkation without circling Beacon Cove for twenty minutes.",
    postcodes: "3207",
    travelTime: "≈ 1 hr 10 min from Rosebud",
    sortOrder: 43,
  },
  {
    slug: "st-kilda",
    name: "St Kilda",
    region: CITY,
    headline: "Fitzroy Street, Acland Street and the foreshore.",
    description:
      "Late-night group transfers back down the highway, and airport runs from the St Kilda hotels.",
    postcodes: "3182",
    travelTime: "≈ 1 hr 5 min from Rosebud",
    sortOrder: 44,
  },
];

/* -------------------------------------------------------------------------- */
/* Blog                                                                       */
/* -------------------------------------------------------------------------- */

const categories = [
  {
    slug: "travel-tips",
    name: "Travel Tips",
    description:
      "Practical advice for getting around Melbourne and the Peninsula without the stress.",
  },
  {
    slug: "accessibility",
    name: "Accessibility",
    description:
      "Wheelchair accessible transport, NDIS travel supports and the MPTP subsidy explained.",
  },
  {
    slug: "local-guides",
    name: "Local Guides",
    description:
      "Where to go on the Mornington Peninsula, and how to get there.",
  },
];

const posts = [
  {
    slug: "melbourne-airport-pickup-zones-explained",
    title: "Melbourne Airport pickup zones, explained without the jargon",
    categorySlug: "travel-tips",
    excerpt:
      "T1 to T4, the difference between the express pickup area and the short-stay car park, and where your driver can actually wait without being moved on.",
    content: `<p>Melbourne Airport has quietly reorganised its pickup arrangements several times in recent years, and the signage has not always kept up. If you are landing after a long flight, the last thing you want is a phone call from a driver describing a bollard.</p>
<h2>The short version</h2>
<p>For most arrivals, the simplest thing is to walk out of your terminal and follow the signs to the designated pickup area for your terminal. Tell us your flight number when you book, and we will tell you exactly where to stand — including which door number to walk out of.</p>
<h2>Which terminal is which</h2>
<ul>
<li><strong>T1</strong> — Qantas domestic.</li>
<li><strong>T2</strong> — International arrivals and departures.</li>
<li><strong>T3</strong> — Virgin Australia domestic.</li>
<li><strong>T4</strong> — Jetstar, Rex and other low-cost domestic carriers.</li>
</ul>
<h2>Why we ask for your flight number</h2>
<p>Because we track it. If your flight is ninety minutes late, your driver is ninety minutes later, and you are not charged for the wait. Without a flight number we are guessing, and guessing is how people end up stranded at 1am.</p>
<h2>Travelling with a wheelchair</h2>
<p>Tell us at the time of booking so we allocate a wheelchair accessible vehicle. These vehicles are a limited part of any fleet, including ours, and same-day availability at the airport is genuinely hit and miss. A day's notice makes it near-certain.</p>
<blockquote>If you are unsure where to wait, just call us when you land. We would much rather spend two minutes on the phone than have you walking laps of the terminal with your luggage.</blockquote>`,
  },
  {
    slug: "mptp-and-ndis-transport-explained",
    title: "MPTP and NDIS transport: what you can actually claim",
    categorySlug: "accessibility",
    excerpt:
      "The Multi Purpose Taxi Program and NDIS travel supports are two different things, funded two different ways. Here is how each one works in practice.",
    content: `<p>Two schemes come up constantly when we talk to passengers about accessible transport, and they are regularly confused with each other. They are not the same thing and they do not come out of the same pot.</p>
<h2>The Multi Purpose Taxi Program (MPTP)</h2>
<p>MPTP is a Victorian Government scheme. If you hold an MPTP card, it subsidises a percentage of your commercial passenger vehicle fares up to a set limit per trip, with an annual cap. You present the card at the end of the trip and the subsidy is applied to the fare — you pay the remainder.</p>
<p>Eligibility is assessed by the Victorian Government based on your circumstances, not by us. If you think you may be eligible, the application process runs through the Department of Transport and Planning.</p>
<h2>NDIS transport supports</h2>
<p>NDIS transport funding is Commonwealth-funded and works differently. Depending on how your plan is managed, transport may be:</p>
<ul>
<li><strong>Plan-managed</strong> — we invoice your plan manager directly.</li>
<li><strong>Self-managed</strong> — you pay and claim it back through the myplace portal.</li>
<li><strong>Agency-managed</strong> — arrangements vary; check with your coordinator before booking.</li>
</ul>
<h2>Can you use both?</h2>
<p>In some circumstances, yes — but the rules on stacking subsidies are specific and they do change. Tell us what you hold when you book and we will tell you honestly how we can bill it, rather than surprising you at the end of the trip.</p>
<h2>What we need from you</h2>
<p>Your card or plan details at the time of booking, not at the end of the trip. It takes thirty seconds on the phone and it avoids an awkward conversation on the kerb.</p>
<p><em>This article is general information, not financial or legal advice. Scheme rules change — check the current requirements with the relevant scheme before relying on them.</em></p>`,
  },
  {
    slug: "mornington-peninsula-winery-day-tour",
    title: "A Peninsula winery day that does not need a designated driver",
    categorySlug: "local-guides",
    excerpt:
      "Red Hill, Merricks and Main Ridge in one day, with a route that works, a realistic timing plan, and nobody drawing the short straw.",
    content: `<p>The Mornington Peninsula has somewhere north of fifty cellar doors within a twenty-minute radius of Red Hill. The problem has never been finding one. The problem is that someone has to drive.</p>
<h2>A route that actually works</h2>
<p>Most people try to fit in too many stops and end up rushing every one. Four cellar doors and a long lunch is a genuinely good day. Five is pushing it. Six and you are just visiting car parks.</p>
<h3>Late morning</h3>
<p>Start around 11am. The cellar doors are open, the tasting rooms are quiet, and you have not yet committed to lunch.</p>
<h3>Lunch</h3>
<p>Book it. On a weekend between November and March, walking into a Peninsula restaurant at 1pm without a booking is optimistic. Your driver will know which places tend to have space.</p>
<h3>Afternoon</h3>
<p>Two more stops, then either the hot springs or straight home. The hot springs need to be booked well in advance in peak season.</p>
<h2>Why a maxi makes sense</h2>
<p>An eleven-seat van costs less than the three separate cars you would otherwise need, and everybody gets to taste. There is boot space for the bottles you inevitably buy, and nobody spends the day on soda water resenting the group.</p>
<h2>Booking a charter</h2>
<p>Full-day and half-day charters are quoted on request rather than metered, so you know the cost before you start. Tell us roughly where you want to go and we will put together a route and a price.</p>`,
  },
];

/* -------------------------------------------------------------------------- */

function readingMinutes(html: string) {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function main() {
  /* ---------------------------------------------------------- admin user -- */
  const email = (process.env.SEED_ADMIN_EMAIL || "support@taxipeninsula.com.au")
    .trim()
    .toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe!2026";
  const name = process.env.SEED_ADMIN_NAME || "Taxi Peninsula Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    // Do not silently reset an existing admin's password on re-seed.
    update: { name, role: "admin" },
    create: { email, name, role: "admin", passwordHash },
  });

  console.log(`✔ Admin account ready: ${admin.email}`);

  /* -------------------------------------------------------- service areas -- */
  for (const area of areas) {
    await prisma.serviceArea.upsert({
      where: { slug: area.slug },
      update: area,
      create: area,
    });
  }
  console.log(`✔ ${areas.length} service areas seeded`);

  /* ------------------------------------------------------------ categories -- */
  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryIds.set(category.slug, saved.id);
  }
  console.log(`✔ ${categories.length} blog categories seeded`);

  /* ----------------------------------------------------------------- posts -- */
  for (const [i, post] of posts.entries()) {
    const { categorySlug, ...rest } = post;
    const publishedAt = new Date();
    // Stagger the publish dates so the blog listing is not all one timestamp.
    publishedAt.setDate(publishedAt.getDate() - i * 7);

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        ...rest,
        categoryId: categoryIds.get(categorySlug) ?? null,
        readingMinutes: readingMinutes(post.content),
      },
      create: {
        ...rest,
        status: "published",
        publishedAt,
        authorId: admin.id,
        categoryId: categoryIds.get(categorySlug) ?? null,
        readingMinutes: readingMinutes(post.content),
      },
    });
  }
  console.log(`✔ ${posts.length} blog posts seeded`);

  console.log("\nSeed complete.");
  console.log(`Sign in at /admin/login with ${admin.email}`);
  if (password === "ChangeMe!2026") {
    console.log(
      "\n⚠️  You are using the default seed password. Change SEED_ADMIN_PASSWORD in .env,\n" +
        "   or change the password from the admin panel immediately."
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
