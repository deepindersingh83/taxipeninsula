import Link from "next/link";

import { MaxiTaxi } from "@/components/MaxiTaxi";
import { AccreditationStrip } from "@/components/site/Accreditations";
import { Logo } from "@/components/site/Logo";
import { footerLegalLinks, fullAddress, navLinks, site } from "@/lib/site";

const serviceLinks = [
  { href: "/services#airport", label: "Airport transfers" },
  { href: "/services#wheelchair", label: "Wheelchair accessible" },
  { href: "/services#ndis", label: "NDIS transport" },
  { href: "/services#groups", label: "Group & event transport" },
  { href: "/services#corporate", label: "Corporate accounts" },
  { href: "/services#tours", label: "Winery & day tours" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden bg-night-900 text-night-200">
      {/* A last taxi driving across the top edge of the footer. */}
      <div className="relative h-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-x-0 bottom-6 h-[3px] bg-white/10" />
        <div className="absolute bottom-2 left-0 w-36 animate-[tp-drive-across_16s_linear_infinite] sm:w-44">
          <MaxiTaxi className="h-auto w-full" wheelSpeed={0.5} title="" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="h-auto w-36" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-night-300">
            {site.subTagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <SocialLink href={site.social.facebook} label="Taxi Peninsula on Facebook">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </SocialLink>
            <SocialLink href={site.social.instagram} label="Taxi Peninsula on Instagram">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </SocialLink>
            <SocialLink href={site.social.linkedin} label="Taxi Peninsula on LinkedIn">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </SocialLink>
            <SocialLink href={site.social.google} label="Taxi Peninsula on Google">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </SocialLink>
          </div>
        </div>

        <FooterColumn title="Explore">
          {navLinks.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
          <FooterLink href="/book">Book a ride</FooterLink>
        </FooterColumn>

        <FooterColumn title="Services">
          {serviceLinks.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Get in touch">
          <li>
            <a
              href={`tel:${site.phoneHref}`}
              className="font-display text-xl font-bold text-taxi-400 transition-colors hover:text-taxi-300"
            >
              {site.phone}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${site.email}`}
              className="text-sm transition-colors hover:text-white"
            >
              {site.email}
            </a>
          </li>
          <li className="text-sm text-night-300">{fullAddress()}</li>
          <li className="flex items-start gap-2 pt-1 text-sm text-night-300">
            <span className="mt-1.5 inline-block size-2 shrink-0 animate-pulse rounded-full bg-taxi-500" />
            {site.hours}
          </li>
        </FooterColumn>
      </div>

      {/* Accreditations */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <AccreditationStrip tone="dark" />
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-night-400">
          <p>
            {site.legalName} &middot; ABN {site.abn} &middot; NDIS registered
            &middot; TAC approved &middot; RACV approved
          </p>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-night-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex gap-5">
            {footerLegalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/sitemap.xml" className="transition-colors hover:text-white">
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold tracking-[0.18em] text-white uppercase">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-night-300 transition-colors hover:text-taxi-400"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-white/10 text-night-300 transition-all hover:border-taxi-500 hover:text-taxi-400"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        {children}
      </svg>
    </a>
  );
}
