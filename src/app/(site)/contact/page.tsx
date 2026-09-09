import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { MaxiTaxi } from "@/components/MaxiTaxi";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, Container, Section } from "@/components/ui";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Call ${site.phone} or email ${site.email}. Taxi Peninsula operates 24/7 across the Mornington Peninsula and south-east Melbourne.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    site.map.embedQuery
  )}&output=embed`;

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Talk to a person.
            <br />
            <span className="text-taxi-400">Any hour.</span>
          </>
        }
        lead="For anything urgent — a pickup in the next couple of hours, a driver running late, a change to today's booking — call. The form is for everything that can wait a few hours."
        breadcrumbs={[{ href: "/contact", label: "Contact" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`tel:${site.phoneHref}`} size="lg">
            Call {site.phone}
          </ButtonLink>
          <ButtonLink href="/book" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-night-900">
            Book online instead
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
            {/* ------------------------------------------------ details rail */}
            <Reveal direction="right">
              <div className="space-y-4">
                <ContactCard
                  label="Phone — fastest"
                  icon="phone"
                  href={`tel:${site.phoneHref}`}
                  value={site.phone}
                  note="Answered 24 hours a day, including public holidays."
                  highlight
                />
                <ContactCard
                  label="Email"
                  icon="mail"
                  href={`mailto:${site.email}`}
                  value={site.email}
                  note="We usually reply the same day."
                />
                <ContactCard
                  label="Based in"
                  icon="pin"
                  value={fullAddress()}
                  note="We are a service-based operator — vehicles come to you, there is no shopfront to visit."
                />
                <ContactCard
                  label="Hours"
                  icon="clock"
                  value="24 hours, 7 days"
                  note="Overnight airport transfers are a core part of what we do."
                />

                <div className="rounded-2xl border border-night-200 bg-white p-6">
                  <p className="text-xs font-bold tracking-[0.14em] text-night-400 uppercase">
                    Follow us
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SocialPill href={site.social.facebook}>Facebook</SocialPill>
                    <SocialPill href={site.social.instagram}>Instagram</SocialPill>
                    <SocialPill href={site.social.linkedin}>LinkedIn</SocialPill>
                    <SocialPill href={site.social.google}>Google</SocialPill>
                  </div>
                </div>

                <div className="rounded-2xl border border-night-200 bg-night-900 p-6 text-center">
                  <div className="mx-auto w-36">
                    <MaxiTaxi className="h-auto w-full" rampDown title="" />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-night-300">
                    Need a wheelchair accessible vehicle today? Call rather than
                    emailing — accessible vans are limited and we will tell you
                    straight away what is available.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* -------------------------------------------------------- form */}
            <Reveal direction="left" delay={0.1}>
              <div>
                <h2 className="font-display text-2xl font-extrabold text-night-900 sm:text-3xl">
                  Send us a message
                </h2>
                <p className="mt-3 text-night-500">
                  Quotes, corporate accounts, NDIS arrangements, feedback — all
                  of it lands in the same inbox and gets read.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- map */}
      <section aria-label="Our service area on a map" className="border-t border-night-200">
        <div className="h-[380px] w-full bg-night-100 sm:h-[460px]">
          <iframe
            src={mapSrc}
            title={`Map of ${site.address.suburb}, ${site.address.state}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full border-0"
            allowFullScreen
          />
        </div>
      </section>
    </>
  );
}

function ContactCard({
  label,
  value,
  note,
  href,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  note?: string;
  href?: string;
  icon: "phone" | "mail" | "pin" | "clock";
  highlight?: boolean;
}) {
  const content = (
    <>
      <div className="flex items-start gap-4">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${
            highlight ? "bg-taxi-500 text-night-900" : "bg-night-900 text-taxi-400"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
            {icon === "phone" && (
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            )}
            {icon === "mail" && (
              <>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </>
            )}
            {icon === "pin" && (
              <>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </>
            )}
            {icon === "clock" && (
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </>
            )}
          </svg>
        </span>

        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.14em] text-night-400 uppercase">
            {label}
          </p>
          <p className="mt-1 font-display text-lg leading-snug font-bold break-words text-night-900">
            {value}
          </p>
          {note && (
            <p className="mt-1.5 text-sm leading-relaxed text-night-500">{note}</p>
          )}
        </div>
      </div>
    </>
  );

  const className = `block rounded-2xl border bg-white p-6 transition-all ${
    highlight ? "border-taxi-500" : "border-night-200"
  } ${href ? "hover:-translate-y-0.5 hover:border-taxi-500 hover:shadow-lift" : ""}`;

  return href ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

function SocialPill({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-night-200 px-4 py-2 text-xs font-bold text-night-600 transition-colors hover:border-taxi-500 hover:text-night-900"
    >
      {children}
    </a>
  );
}
