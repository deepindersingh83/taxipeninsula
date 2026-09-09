import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MaxiTaxi } from "@/components/MaxiTaxi";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { AccreditationStrip } from "@/components/site/Accreditations";
import { PageHero } from "@/components/site/PageHero";
import {
  ButtonLink,
  Card,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { services } from "@/content/services";
import { getAreaBySlug, getNearbyAreas, getServiceAreas } from "@/lib/areas";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

/** Pre-render every area page at build time for the best possible SEO. */
export async function generateStaticParams() {
  const areas = await getServiceAreas();
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);

  if (!area) return { title: "Area not found" };

  const title = `Maxi Taxi & Wheelchair Accessible Transport in ${area.name}`;
  const description =
    area.headline ||
    `Book a maxi taxi, wheelchair accessible van or airport transfer in ${area.name}. ${site.name} — 24/7, NDIS registered.`;

  return {
    title,
    description,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: await absoluteUrl(`/areas/${area.slug}`),
    },
  };
}

const highlightedServices = ["airport", "wheelchair", "ndis", "events"];

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);

  if (!area) notFound();

  const nearby = await getNearbyAreas(area.slug, area.region);
  const featured = services.filter((s) => highlightedServices.includes(s.id));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: `${site.name} — ${area.name}`,
    description: area.description || area.headline,
    url: await absoluteUrl(`/areas/${area.slug}`),
    telephone: site.phoneHref,
    email: site.email,
    areaServed: {
      "@type": "Place",
      name: `${area.name}, Victoria, Australia`,
      ...(area.postcodes
        ? { address: { "@type": "PostalAddress", postalCode: area.postcodes.split(",")[0].trim(), addressCountry: "AU" } }
        : {}),
    },
    provider: { "@type": "Organization", name: site.legalName },
  };

  return (
    <>
      <PageHero
        eyebrow={area.region}
        title={
          <>
            Maxi taxis in{" "}
            <span className="text-taxi-400">{area.name}</span>
          </>
        }
        lead={area.headline}
        breadcrumbs={[
          { href: "/areas", label: "Areas" },
          { href: `/areas/${area.slug}`, label: area.name },
        ]}
        rampDown
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/book" size="lg">
            Book from {area.name}
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

        {(area.postcodes || area.travelTime) && (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {area.postcodes && (
              <div>
                <dt className="text-xs font-bold tracking-[0.14em] text-night-400 uppercase">
                  Postcodes
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-white">
                  {area.postcodes}
                </dd>
              </div>
            )}
            {area.travelTime && (
              <div>
                <dt className="text-xs font-bold tracking-[0.14em] text-night-400 uppercase">
                  Airport run
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-white">
                  {area.travelTime}
                </dd>
              </div>
            )}
          </dl>
        )}
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <Reveal>
                <h2 className="font-display text-2xl font-extrabold text-night-900 sm:text-3xl">
                  Getting around {area.name}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-night-600">
                  {area.description}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h3 className="mt-12 font-display text-xl font-bold text-night-900">
                  What we run in {area.name}
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {featured.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services#${service.id}`}
                      className="group flex gap-4 rounded-2xl border border-night-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-taxi-500 hover:shadow-lift"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-night-900 text-taxi-400">
                        <ServiceIcon name={service.icon} className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-base font-bold text-night-900">
                          {service.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-night-500">
                          {service.short}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Sticky booking rail */}
            <Reveal direction="left" delay={0.15}>
              <aside className="lg:sticky lg:top-28">
                <Card className="hover:translate-y-0">
                  <div className="mx-auto w-40">
                    <MaxiTaxi className="h-auto w-full" wheelSpeed={0.55} rampDown title="" />
                  </div>

                  <h3 className="mt-5 text-center font-display text-xl font-bold text-night-900">
                    Need a ride in {area.name}?
                  </h3>
                  <p className="mt-2 text-center text-sm leading-relaxed text-night-500">
                    Book online in under a minute, or call and speak to a
                    dispatcher who knows the area.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <ButtonLink href="/book" className="w-full">
                      Book online
                    </ButtonLink>
                    <ButtonLink
                      href={`tel:${site.phoneHref}`}
                      variant="outline"
                      className="w-full"
                    >
                      {site.phone}
                    </ButtonLink>
                  </div>

                  <ul className="mt-6 space-y-2.5 border-t border-night-100 pt-5">
                    {[
                      "24/7, including public holidays",
                      "Wheelchair accessible vans",
                      "NDIS registered provider",
                      "Fares quoted on request",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-night-600">
                        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-taxi-500">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#111418" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="size-2.5" aria-hidden="true">
                            <path d="M4 12.5 9.5 18 20 6.5" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>

      {nearby.length > 0 && (
        <Section className="bg-white">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Nearby"
                title={`Also serving these ${area.region} suburbs`}
              />
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-3">
              {nearby.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.05} direction="none">
                  <Link
                    href={`/areas/${n.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full border-2 border-night-200 px-5 py-3 text-sm font-bold text-night-700 transition-all hover:-translate-y-0.5 hover:border-taxi-500 hover:text-night-900"
                  >
                    <span className="size-1.5 rounded-full bg-taxi-500 transition-transform group-hover:scale-150" />
                    {n.name}
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="mt-14">
              <AccreditationStrip />
            </div>
          </Container>
        </Section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
