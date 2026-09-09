import type { Metadata } from "next";
import Link from "next/link";

import { DrivingBand } from "@/components/DrivingBand";
import { MaxiTaxi, RoadStrip } from "@/components/MaxiTaxi";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { AccreditationStrip } from "@/components/site/Accreditations";
import { PageHero } from "@/components/site/PageHero";
import {
  ButtonLink,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { services } from "@/content/services";
import { site } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Airport transfers, wheelchair accessible transport, NDIS travel, group and event transfers, corporate accounts, winery tours, school runs and parcel delivery across Melbourne and the Mornington Peninsula.",
  alternates: { canonical: "/services" },
};

function servicesJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.name} services`,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.short,
        url: `${siteUrl}/services#${s.id}`,
        provider: { "@type": "TaxiService", name: site.name },
        areaServed: { "@type": "AdministrativeArea", name: "Mornington Peninsula, Victoria" },
      },
    })),
  };
}

export default async function ServicesPage() {
  const siteUrl = await getSiteUrl();

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title={
          <>
            Nine services.
            <br />
            <span className="text-taxi-400">One number to call.</span>
          </>
        }
        lead="From a 4am run to Tullamarine to a full-day winery charter, it is the same fleet, the same drivers and the same dispatch line. Fares are quoted on request — you will know the cost before the trip starts."
        breadcrumbs={[{ href: "/services", label: "Services" }]}
      >
        <div className="flex flex-wrap gap-3">
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
      </PageHero>

      {/* Quick jump list — nine services is a lot to scroll past. */}
      <div className="border-b border-night-200 bg-white">
        <Container>
          <nav aria-label="Services" className="flex gap-2 overflow-x-auto py-4">
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 rounded-full border border-night-200 px-4 py-2 text-xs font-bold whitespace-nowrap text-night-600 transition-colors hover:border-taxi-500 hover:text-night-900"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      <Section>
        <Container>
          <div className="space-y-20 lg:space-y-28">
            {services.map((service, i) => {
              const flip = i % 2 === 1;
              return (
                <article
                  key={service.id}
                  id={service.id}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  <Reveal direction={flip ? "left" : "right"}>
                    <div className={flip ? "lg:order-2" : ""}>
                      <span className="inline-grid size-14 place-items-center rounded-2xl bg-night-900 text-taxi-400">
                        <ServiceIcon name={service.icon} className="size-7" />
                      </span>

                      <h2 className="mt-6 font-display text-3xl font-extrabold text-night-900 sm:text-[2.1rem]">
                        {service.title}
                      </h2>

                      <p className="mt-4 text-lg leading-relaxed text-night-600">
                        {service.description}
                      </p>

                      <ul className="mt-7 space-y-3">
                        {service.points.map((point) => (
                          <li key={point} className="flex items-start gap-3">
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-taxi-500">
                              <svg viewBox="0 0 24 24" fill="none" stroke="#111418" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="size-3" aria-hidden="true">
                                <path d="M4 12.5 9.5 18 20 6.5" />
                              </svg>
                            </span>
                            <span className="text-[15px] leading-relaxed text-night-600">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <ButtonLink href={bookHref(service.id)} variant="dark">
                          Book this
                        </ButtonLink>
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-night-600 transition-colors hover:text-night-900"
                        >
                          Ask a question
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-4" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal direction={flip ? "right" : "left"} delay={0.1}>
                    <div className={flip ? "lg:order-1" : ""}>
                      <div className="relative overflow-hidden rounded-3xl border border-night-200 bg-gradient-to-br from-taxi-500/15 via-white to-night-50 p-8 sm:p-12">
                        <div className="animate-float">
                          <MaxiTaxi
                            className="h-auto w-full"
                            rampDown={service.id === "wheelchair" || service.id === "ndis"}
                            streaks={i % 2 === 0}
                            title={service.title}
                          />
                        </div>
                        <RoadStrip className="mt-4" tone="dark" />
                      </div>
                    </div>
                  </Reveal>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <DrivingBand rampDown />

      <Section className="bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Pricing"
              title="Quoted on request, agreed before you travel"
              lead="Every trip is different — distance, time of day, vehicle, number of stops. Rather than publish a table that is wrong for your trip, we quote it. Ask for a price and you will get one, in writing, before anything is booked."
              align="center"
              className="text-center"
            />
          </Reveal>

          <div className="mx-auto mt-10 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/book" size="lg">
              Request a booking
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Ask for a quote
            </ButtonLink>
          </div>

          <div className="mt-16">
            <AccreditationStrip />
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd(siteUrl)) }}
      />
    </>
  );
}

/** Map a service to the vehicle it most often needs. */
function bookHref(serviceId: string) {
  const map: Record<string, string> = {
    wheelchair: "/book?car=wheelchair",
    ndis: "/book?car=wheelchair",
    events: "/book?car=maxi",
    tours: "/book?car=maxi",
    school: "/book?car=baby-seat",
    parcel: "/book?car=parcel",
  };
  return map[serviceId] ?? "/book";
}
