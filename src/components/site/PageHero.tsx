import Link from "next/link";

import { MaxiTaxi } from "@/components/MaxiTaxi";
import { Container } from "@/components/ui";

/**
 * Shared hero for every interior page: dark band, breadcrumb, headline, and a
 * taxi driving across the bottom edge so the motif carries through the site.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs = [],
  children,
  rampDown = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  breadcrumbs?: Array<{ href: string; label: string }>;
  children?: React.ReactNode;
  rampDown?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-night-900 pt-12 pb-24 text-white sm:pt-16 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -right-24 size-[32rem] rounded-full bg-taxi-500/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Container className="relative">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-night-400">
              <li>
                <Link href="/" className="transition-colors hover:text-taxi-400">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  <span aria-hidden="true">/</span>
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-night-200" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-taxi-400"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-taxi-500/30 bg-taxi-500/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-taxi-400 uppercase">
            <span className="size-1.5 rounded-full bg-taxi-500" />
            {eyebrow}
          </p>
        )}

        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] font-extrabold sm:text-5xl">
          {title}
        </h1>

        {lead && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-night-200">
            {lead}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </Container>

      {/* Taxi driving out along the bottom edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 -bottom-3 left-0 h-24 overflow-hidden"
      >
        <div className="absolute inset-x-0 bottom-8 h-[2px] bg-white/10" />
        <div className="absolute bottom-4 left-0 w-32 animate-[tp-drive-across_18s_linear_infinite] sm:w-40">
          <MaxiTaxi className="h-auto w-full" rampDown={rampDown} title="" />
        </div>
      </div>

      <div className="checker-band absolute inset-x-0 bottom-0 h-2" aria-hidden="true" />
    </section>
  );
}
