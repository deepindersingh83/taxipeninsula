import type { Metadata } from "next";
import Link from "next/link";

import { DrivingBand } from "@/components/DrivingBand";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/site/PageHero";
import {
  ButtonLink,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { getAreasByRegion } from "@/lib/areas";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "Taxi Peninsula covers the Mornington Peninsula, Frankston and Bayside, south-east Melbourne, the CBD, Melbourne Airport and Avalon. Find your suburb.",
  alternates: { canonical: "/areas" },
};

export const revalidate = 3600;

export default async function AreasPage() {
  const regions = await getAreasByRegion();
  const total = regions.reduce((n, r) => n + r.items.length, 0);

  return (
    <>
      <PageHero
        eyebrow="Where we run"
        title={
          <>
            {total} suburbs, one
            <br />
            <span className="text-taxi-400">local operator.</span>
          </>
        }
        lead="We are based in Rosebud, not in a call centre three states away. That means the driver who picks you up knows that Point Nepean Road is a car park in January and which Martha Cove gate actually opens at midnight."
        breadcrumbs={[{ href: "/areas", label: "Areas" }]}
      >
        <ButtonLink href="/book" size="lg">
          Book from your suburb
        </ButtonLink>
      </PageHero>

      <Section>
        <Container>
          <div className="space-y-16">
            {regions.map((group, gi) => (
              <div key={group.region}>
                <Reveal>
                  <div className="flex items-center gap-4">
                    <h2 className="font-display text-2xl font-extrabold text-night-900 sm:text-3xl">
                      {group.region}
                    </h2>
                    <span className="rounded-full bg-taxi-500/20 px-3 py-1 text-xs font-bold text-taxi-800">
                      {group.items.length} areas
                    </span>
                  </div>
                  <div className="mt-4 h-1 w-16 rounded-full bg-taxi-500" />
                </Reveal>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((area, i) => (
                    <Reveal key={area.id} delay={Math.min(i * 0.05, 0.3)}>
                      <Link
                        href={`/areas/${area.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-night-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-taxi-500 hover:shadow-lift"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display text-lg font-bold text-night-900">
                            {area.name}
                          </h3>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="mt-1 size-4 shrink-0 text-night-300 transition-all group-hover:translate-x-1 group-hover:text-taxi-600"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </div>

                        {area.postcodes && (
                          <p className="mt-1 text-xs font-semibold text-night-400">
                            {area.postcodes}
                          </p>
                        )}

                        <p className="mt-3 flex-1 text-sm leading-relaxed text-night-500">
                          {area.headline}
                        </p>

                        {area.travelTime && (
                          <p className="mt-4 inline-flex items-center gap-1.5 border-t border-night-100 pt-3 text-xs font-semibold text-night-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5" aria-hidden="true">
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 7v5l3 2" strokeLinecap="round" />
                            </svg>
                            {area.travelTime}
                          </p>
                        )}
                      </Link>
                    </Reveal>
                  ))}
                </div>

                {gi < regions.length - 1 && <DrivingBand reverse={gi % 2 === 1} />}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container size="narrow">
          <Reveal>
            <SectionHeading
              eyebrow="Not on the list?"
              title="Ask anyway — the list is not the limit"
              lead={`These are the areas we cover most often, not a boundary fence. If you are somewhere nearby, call ${site.phone} and we will tell you honestly whether we can get a vehicle to you and how long it will take.`}
              align="center"
              className="text-center"
            />
          </Reveal>
          <div className="mx-auto mt-8 flex max-w-sm flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={`tel:${site.phoneHref}`} size="lg">
              Call {site.phone}
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Send a message
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
