import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingForm } from "@/components/forms/BookingForm";
import { MaxiTaxi, RoadStrip } from "@/components/MaxiTaxi";
import { AccreditationStrip } from "@/components/site/Accreditations";
import { Container, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Ride",
  description:
    "Book a maxi taxi, wheelchair accessible van or airport transfer across the Mornington Peninsula and south-east Melbourne. Online booking, 24/7, fares quoted on request.",
  alternates: { canonical: "/book" },
};

const reassurances = [
  {
    title: "No payment now",
    body: "Fares are quoted on request. Nothing is charged through this form.",
  },
  {
    title: "A person confirms it",
    body: "A dispatcher checks the vehicle and driver, then comes back to you.",
  },
  {
    title: "Any hour, any day",
    body: "Overnight airport runs included. We are dispatching at 3am.",
  },
];

export default function BookPage() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden bg-night-900 py-14 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-20 size-[30rem] rounded-full bg-taxi-500/20 blur-[110px]"
        />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-taxi-500/30 bg-taxi-500/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-taxi-400 uppercase">
                <span className="size-1.5 rounded-full bg-taxi-500" />
                Online booking
              </p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl">
                Tell us the trip.
                <br />
                <span className="text-taxi-400">We&rsquo;ll take it from there.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-night-200">
                One short form and you are done. If your pickup is in the next
                two hours, call{" "}
                <a
                  href={`tel:${site.phoneHref}`}
                  className="font-bold text-taxi-400 underline underline-offset-4"
                >
                  {site.phone}
                </a>{" "}
                instead — it is faster.
              </p>

              <dl className="mt-9 grid gap-5 sm:grid-cols-3">
                {reassurances.map((r) => (
                  <div key={r.title}>
                    <dt className="flex items-center gap-2 text-sm font-bold text-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#ffc400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0" aria-hidden="true">
                        <path d="M4 12.5 9.5 18 20 6.5" />
                      </svg>
                      {r.title}
                    </dt>
                    <dd className="mt-1.5 text-xs leading-relaxed text-night-300">
                      {r.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative hidden lg:block">
              <div className="animate-float">
                <MaxiTaxi
                  className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                  wheelSpeed={0.5}
                  rampDown
                  streaks
                  title="Wheelchair accessible maxi taxi ready for booking"
                />
              </div>
              <RoadStrip className="mt-4" tone="light" />
            </div>
          </div>
        </Container>
        <div className="checker-band mt-14 h-2 w-full" aria-hidden="true" />
      </section>

      {/* ------------------------------------------------------------- form */}
      <Section className="pt-12 sm:pt-16">
        <Container size="narrow">
          <Suspense
            fallback={
              <div className="rounded-3xl border border-night-200 bg-white p-10 text-center">
                <div className="mx-auto w-40">
                  <MaxiTaxi className="h-auto w-full" wheelSpeed={0.4} title="" />
                </div>
                <p className="mt-4 text-sm font-semibold text-night-500">
                  Loading the booking form…
                </p>
              </div>
            }
          >
            <BookingForm />
          </Suspense>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <AccreditationStrip />
        </Container>
      </Section>
    </>
  );
}
