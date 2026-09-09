import type { Metadata } from "next";

import { DrivingBand } from "@/components/DrivingBand";
import { MaxiTaxi, RoadStrip } from "@/components/MaxiTaxi";
import { Reveal } from "@/components/motion/Reveal";
import { AccreditationList } from "@/components/site/Accreditations";
import { PageHero } from "@/components/site/PageHero";
import {
  ButtonLink,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Taxi Peninsula is a Rosebud-based maxi taxi and wheelchair accessible transport operator serving the Mornington Peninsula and south-east Melbourne. NDIS registered, TAC and RACV approved.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Turn up when we said we would",
    body: "The whole business rests on this. A taxi that arrives at 4:05 for a 4am airport run has failed, however nice the driver is.",
  },
  {
    title: "Quote it honestly",
    body: "We quote before you travel and we stick to it. No surprise surcharges discovered at the kerb with your luggage already loaded.",
  },
  {
    title: "Accessibility is not a favour",
    body: "A wheelchair booking is a booking. Same fleet, same standards, same reliability — not a special request we grudgingly accommodate.",
  },
  {
    title: "Answer the phone",
    body: "A real person, based here, who knows where Tootgarook is. Not a queue, not a chatbot, not an app that has no way to reach a human.",
  },
];

const stats = [
  { value: "24/7", label: "Dispatch, every day of the year" },
  { value: "38", label: "Suburbs regularly serviced" },
  { value: "11", label: "Seats in our largest maxi" },
  { value: "3", label: "Accreditations held" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Based in Rosebud.
            <br />
            <span className="text-taxi-400">Not a call centre.</span>
          </>
        }
        lead={`${site.name} runs maxi taxis, wheelchair accessible vans and airport transfers across the Mornington Peninsula and south-east Melbourne. When you ring the number, you get someone who has actually driven the road you are asking about.`}
        breadcrumbs={[{ href: "/about", label: "About Us" }]}
      >
        <ButtonLink href="/book" size="lg">
          Book a ride
        </ButtonLink>
      </PageHero>

      {/* ------------------------------------------------------------- story */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <div className="max-w-2xl">
                <SectionHeading
                  eyebrow="Who we are"
                  title="A Peninsula operator, doing Peninsula work"
                />
                <div className="mt-6 space-y-5 text-lg leading-relaxed text-night-600">
                  <p>
                    The Mornington Peninsula is a genuinely awkward place to get
                    around without a car. It is long, it is spread out, public
                    transport thins out fast past Frankston, and the airport is
                    the better part of two hours away at the wrong end of the
                    day.
                  </p>
                  <p>
                    That is the gap we fill. Not rideshare, which vanishes at 4am
                    in Rye. Not a city-based fleet that treats everything south
                    of Frankston as somebody else&rsquo;s problem. A local
                    operator with vans big enough for the whole group, and vans
                    that take a wheelchair without anyone having to transfer out
                    of their own chair.
                  </p>
                  <p>
                    We are an NDIS registered provider, approved by the Transport
                    Accident Commission and recognised by RACV. Those
                    accreditations exist because a lot of our work is not
                    holiday-makers — it is people getting to dialysis, to a day
                    program, to a specialist in the city, week in and week out.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.15}>
              <div className="relative rounded-3xl border border-night-200 bg-gradient-to-br from-taxi-500/15 via-white to-night-50 p-8">
                <div className="animate-float">
                  <MaxiTaxi
                    className="h-auto w-full"
                    rampDown
                    title="Taxi Peninsula wheelchair accessible maxi taxi"
                  />
                </div>
                <RoadStrip className="mt-4" tone="dark" />

                <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-night-200 pt-6">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-display text-3xl font-extrabold text-night-900">
                        {s.value}
                      </dt>
                      <dd className="mt-1 text-xs leading-snug text-night-500">
                        {s.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <DrivingBand rampDown />

      {/* ------------------------------------------------------------ values */}
      <Section className="bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title="Four things we refuse to be flexible about"
              align="center"
              className="text-center"
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="flex h-full gap-5 rounded-2xl border border-night-200 bg-cream p-6">
                  <span className="font-display text-4xl font-extrabold text-taxi-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-night-900">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-night-500">
                      {v.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------- accreditations */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Credentials"
              title="Accredited, approved and registered"
              lead="These are not decorations. Each one means an external body has checked how we operate, and each one lets us bill a particular kind of work properly."
              align="center"
              className="text-center"
            />
          </Reveal>

          <div className="mt-12">
            <AccreditationList />
          </div>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-night-400">
              {site.legalName} &middot; ABN {site.abn}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- CTA */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-night-900 px-6 py-14 text-center sm:px-12">
              <div
                aria-hidden="true"
                className="absolute -top-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-taxi-500/25 blur-[100px]"
              />
              <div className="relative">
                <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                  Give us a trip to run.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-night-300">
                  Book online, or call and talk it through with someone who
                  knows the roads.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 left-0 w-32 animate-[tp-drive-across_15s_linear_infinite] sm:w-44"
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
