"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Logo } from "@/components/site/Logo";
import { MaxiTaxi } from "@/components/MaxiTaxi";
import { navLinks, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Shrink and solidify the header once the hero is behind us.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Contact strip — visible on desktop, where there is room for it. */}
      <div className="hidden bg-night-900 text-night-100 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-xs">
          <p className="flex items-center gap-2">
            <span className="inline-block size-2 animate-pulse rounded-full bg-taxi-500" />
            {site.hours}
          </p>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${site.phoneHref}`}
              className="font-semibold text-taxi-400 transition-colors hover:text-taxi-300"
            >
              Call {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-white"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-cream/90 shadow-[0_8px_30px_-12px_rgba(15,18,22,0.25)] backdrop-blur-lg"
            : "bg-cream/60 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 py-3"
            aria-label={`${site.name} — home`}
          >
            <Logo
              variant="mark"
              priority
              className="w-11 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 sm:w-12"
            />
            <span className="leading-none">
              <span className="block font-display text-lg font-extrabold tracking-tight text-night-900 sm:text-xl">
                {site.name}
              </span>
              {/* Hidden on the narrowest screens: the tracking makes it wide
                  enough to force the header onto two lines on a small phone. */}
              <span className="mt-1 hidden text-[10px] font-semibold tracking-[0.16em] text-night-400 uppercase min-[400px]:block">
                Maxi &middot; Wheelchair &middot; Airport
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? "text-night-900"
                    : "text-night-500 hover:text-night-900"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-taxi-500"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${site.phoneHref}`}
              className="rounded-full p-2.5 text-night-700 transition-colors hover:bg-night-100 lg:hidden"
              aria-label={`Call ${site.phone}`}
            >
              <PhoneIcon className="size-5" />
            </a>

            <Link
              href="/book"
              className="hidden rounded-full bg-night-900 px-5 py-2.5 text-sm font-bold text-taxi-400 shadow-lift transition-all hover:bg-night-800 hover:text-taxi-300 active:scale-95 sm:inline-flex"
            >
              Book a ride
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2.5 text-night-900 transition-colors hover:bg-night-100 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
            </button>
          </div>
        </div>

        {/* Thin checker rule, always present, so the brand reads even when the
            header is translucent over a photo. */}
        <div className="checker-band h-1 w-full opacity-90" />

        <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-h-[calc(100dvh-8rem)] overflow-y-auto bg-cream px-4 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
                    isActive(link.href)
                      ? "bg-taxi-500/15 text-night-900"
                      : "text-night-600 hover:bg-night-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/book"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-night-900 px-5 py-4 text-base font-bold text-taxi-400"
            >
              Book a ride
            </Link>

            <a
              href={`tel:${site.phoneHref}`}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border-2 border-night-900 px-5 py-4 text-base font-bold text-night-900"
            >
              <PhoneIcon className="size-5" />
              {site.phone}
            </a>

            <div className="mt-6 w-32 pb-8">
              <MaxiTaxi className="h-auto w-full" wheelSpeed={0.55} rampDown title="" />
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </header>
    </>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
