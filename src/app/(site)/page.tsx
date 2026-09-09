import type { Metadata } from "next";
import Link from "next/link";

import { DrivingBand } from "@/components/DrivingBand";
import { FleetCarousel } from "@/components/home/FleetCarousel";
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { MaxiTaxi, RoadStrip } from "@/components/MaxiTaxi";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import {
  ButtonLink,
  Card,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { featuredServices } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { formatDateShort } from "@/lib/format";
import { getServiceAreas } from "@/lib/areas";
import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — Maxi Taxi & Wheelchair Accessible Transport, Melbourne`,
  description: site.description,
  alternates: { canonical: "/" },
};

// Re-render at most once an hour so newly published blog posts and service
// areas appear without a redeploy, while still serving a static page.
export const revalidate = 3600;

const steps = [
  {
    n: "01",
    title: "Tell us the trip",
    body: "Pickup, drop-off, date and time, and how many people are travelling. Sixty seconds, no account required.",
  },
  {
    n: "02",
    title: "We confirm it",
    body: "You get a booking reference straight away, and a real person confirms the vehicle and driver.",
  },
  {
    n: "03",
    title: "We turn up",
    body: "Your driver arrives at the time you asked for, with the vehicle you booked. Ramp down if you need it.",
  },
];

export default async function HomePage() {
  const [posts, areas] = await Promise.all([
    getPublishedPosts({ take: 3 }),
    getServiceAreas({ featuredOnly: true, take: 8 }),
  ]);

  return (
    <>
      <Hero />
      <Ticker />

      {/* ---------------------------------------------------------- services */}
      <Section>
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="What we do"
                title="Three things we are genuinely good at"
                lead="Plenty of operators will take any job. These are the ones we have built the fleet, the training and the dispatch around."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ButtonLink href="/services" variant="outline" size="md">
                All services
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredServices.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.1}>
                <Card className="flex h-full flex-col">
                  <span className="grid size-12 place-items-center rounded-xl bg-night-900 text-taxi-400">
                    <ServiceIcon name={service.icon} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-night-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-night-500">
                    {service.short}
                  </p>
                  <Link
                    href={`/services#${service.id}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-night-900 transition-colors hover:text-taxi-700"
                  >
                    Read more
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-4" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <DrivingBand />

      {/* ------------------------------------------------------------- fleet */}
      <Section className="bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The fleet"
              title="Pick the vehicle before you pick up the phone"
              lead="Every vehicle in the list below is one we actually operate. Choose one and we will carry the selection through to your booking."
              align="center"
              className="text-center"
            />
          </Reveal>

          <div className="mt-14">
            <FleetCarousel />
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------- accessibility */}
      <Section className="relative overflow-hidden bg-night-900 text-white">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 size-96 rounded-full bg-access-500/20 blur-[110px]"
        />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal direction="right">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-access-500/15 px-3.5 py-1.5 text-xs font-bold tracking-[0.16em] text-access-400 uppercase">
                  <span className="size-1.5 rounded-full bg-access-500" />
                  Accessibility first
                </p>
                <h2 className="mt-5 font-display text-3xl font-extrabold sm:text-4xl">
                  A ramp is the easy part.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-night-200">
                  Anyone can bolt a ramp to a van. What actually decides whether
                  a trip works is whether the driver knows how to set the
                  restraints, whether they allow the extra ten minutes at the
                  kerb without sighing about it, and whether the vehicle that
                  turns up is the one you booked.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Four-point restraints checked at the start of every trip",
                    "Drivers accredited and trained on the equipment they carry",
                    "MPTP cards accepted — we handle the paperwork",
                    "Room for a carer plus five other passengers",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-access-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="size-3" aria-hidden="true">
                          <path d="M4 12.5 9.5 18 20 6.5" />
                        </svg>
                      </span>
                      <span className="text-night-200">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap gap-3">
                  <ButtonLink href="/book?car=wheelchair" variant="primary" size="lg">
                    Book an accessible maxi
                  </ButtonLink>
                  <ButtonLink
                    href={`tel:${site.phoneHref}`}
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white hover:text-night-900"
                  >
                    Talk to a person
                  </ButtonLink>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.15}>
              <div className="relative">
                <div className="animate-float">
                  <MaxiTaxi
                    className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                    rampDown
                    title="Maxi taxi with the wheelchair ramp deployed"
                  />
                </div>
                <RoadStrip className="mt-4" tone="accent" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- how it works */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="Three steps, and one of them is just waiting"
              align="center"
              className="text-center"
            />
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.12}>
                <div className="relative">
                  <span className="font-display text-6xl font-extrabold text-taxi-500/30">
                    {step.n}
                  </span>
                  <h3 className="-mt-3 font-display text-xl font-bold text-night-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-night-500">
                    {step.body}
                  </p>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-8 -right-4 hidden text-taxi-500 md:block"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-6">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <DrivingBand reverse rampDown />

      {/* ------------------------------------------------------------- areas */}
      {areas.length > 0 && (
        <Section className="bg-white">
          <Container>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <Reveal>
                <SectionHeading
                  eyebrow="Where we run"
                  title="Melbourne and the whole Peninsula"
                  lead="Booked from one of these? You are in our patch, and the vehicle is probably already nearby."
                />
              </Reveal>
              <Reveal delay={0.1}>
                <ButtonLink href="/areas" variant="outline">
                  All service areas
                </ButtonLink>
              </Reveal>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {areas.map((area, i) => (
                <Reveal key={area.id} delay={i * 0.04} direction="none">
                  <Link
                    href={`/areas/${area.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full border-2 border-night-200 px-5 py-3 text-sm font-bold text-night-700 transition-all hover:-translate-y-0.5 hover:border-taxi-500 hover:text-night-900"
                  >
                    <span className="size-1.5 rounded-full bg-taxi-500 transition-transform group-hover:scale-150" />
                    {area.name}
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ------------------------------------------------------ testimonials */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Passengers"
              title="What people say afterwards"
              align="center"
              className="text-center"
            />
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-2xl border border-night-200 bg-white p-6">
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg
                        key={s}
                        viewBox="0 0 24 24"
                        className={`size-4 ${s < t.rating ? "fill-taxi-500" : "fill-night-200"}`}
                        aria-hidden="true"
                      >
                        <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-night-600">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-night-100 pt-4">
                    <p className="text-sm font-bold text-night-900">{t.name}</p>
                    <p className="text-xs text-night-400">{t.detail}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- blog */}
      {posts.length > 0 && (
        <Section className="bg-white">
          <Container>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <Reveal>
                <SectionHeading
                  eyebrow="From the blog"
                  title="Local knowledge, written down"
                  lead="Airport pickup zones, Peninsula routes, and how the accessible taxi subsidies actually work."
                />
              </Reveal>
              <Reveal delay={0.1}>
                <ButtonLink href="/blog" variant="outline">
                  Read the blog
                </ButtonLink>
              </Reveal>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.1}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-night-200 bg-white transition-all hover:-translate-y-1 hover:border-taxi-500/60 hover:shadow-lift"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-night-100">
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImage}
                          alt=""
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid size-full place-items-center bg-gradient-to-br from-taxi-500/20 to-night-100 p-8">
                          <MaxiTaxi className="h-auto w-40" title="" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold text-night-400">
                        {post.publishedAt ? formatDateShort(post.publishedAt) : "Draft"}
                        {" · "}
                        {post.readingMinutes} min read
                      </p>
                      <h3 className="mt-2 font-display text-lg leading-snug font-bold text-night-900">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-night-500">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* --------------------------------------------------------------- CTA */}
      <Section className="pb-0">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-night-900 px-6 py-14 text-center sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="absolute -top-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-taxi-500/25 blur-[100px]"
              />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold text-white sm:text-4xl">
                  Somewhere to be? Let&rsquo;s get you there.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-night-300">
                  Book online in under a minute, or call the dispatch line and
                  talk to someone who is actually in Melbourne.
                </p>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <ButtonLink href="/book" size="lg">
                    Book a ride
                  </ButtonLink>
                  <ButtonLink
                    href={`tel:${site.phoneHref}`}
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white hover:text-night-900"
                  >
                    {site.phone}
                  </ButtonLink>
                </div>
              </div>

              {/* One last taxi, driving out of frame. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 left-0 w-32 animate-[tp-drive-across_14s_linear_infinite] opacity-90 sm:w-44"
              >
                <MaxiTaxi className="h-auto w-full" streaks title="" />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
