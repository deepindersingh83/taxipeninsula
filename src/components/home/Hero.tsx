"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { MaxiTaxi, RoadStrip } from "@/components/MaxiTaxi";
import { site } from "@/lib/site";

const highlights = [
  { value: "24/7", label: "Every day of the year" },
  { value: "11", label: "Seats in a single maxi" },
  { value: "WAT", label: "Wheelchair accessible fleet" },
];

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-night-900 text-white">
      {/* Ambient background: soft yellow glow + a faint street grid. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -right-32 size-[36rem] rounded-full bg-taxi-500/20 blur-[120px]" />
        <div className="absolute -bottom-48 -left-24 size-[30rem] rounded-full bg-access-500/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 lg:pt-20 lg:pb-28">
        {/* ------------------------------------------------------------ copy */}
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-taxi-500/30 bg-taxi-500/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-taxi-400 uppercase"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-taxi-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-taxi-500" />
            </span>
            Booking now — Melbourne &amp; the Peninsula
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 font-display text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            The maxi taxi that{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-taxi-400">actually fits</span>
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 z-0 h-3 origin-left rounded-full bg-taxi-500/25"
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              />
            </span>{" "}
            everyone.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-night-200"
          >
            Eleven seats, a hydraulic wheelchair ramp and a driver who knows the
            difference between Tullamarine and Avalon. One booking, one vehicle,
            nobody left behind on the kerb.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-taxi-500 px-8 py-4 text-base font-bold text-night-900 shadow-[0_14px_40px_-12px_rgba(255,196,0,0.7)] transition-all hover:bg-taxi-400 active:scale-[0.97]"
            >
              Book your ride
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>

            <a
              href={`tel:${site.phoneHref}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-white/20 px-8 py-4 text-base font-bold text-white transition-all hover:border-taxi-500 hover:text-taxi-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {site.phone}
            </a>
          </motion.div>

          <motion.dl
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
          >
            {highlights.map((h) => (
              <div key={h.label}>
                <dt className="font-display text-3xl font-extrabold text-taxi-400">
                  {h.value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-night-300">
                  {h.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* --------------------------------------------------------- vehicle */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Rotating dashed halo behind the vehicle */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 grid place-items-center"
          >
            <div className="size-[22rem] rounded-full border border-dashed border-white/10 sm:size-[28rem]" />
            <div className="absolute size-[16rem] rounded-full bg-taxi-500/10 blur-3xl sm:size-[20rem]" />
          </div>

          <div className="animate-float">
            <MaxiTaxi
              className="h-auto w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)]"
              wheelSpeed={0.55}
              rampDown
              streaks
              title="A wheelchair accessible maxi taxi with its rear ramp lowered"
            />
          </div>

          {/* Floating fact chips */}
          <FloatingChip
            className="-top-2 left-0 sm:left-6"
            delay={0.7}
            tone="yellow"
            icon="clock"
          >
            Avg. 12 min pickup
          </FloatingChip>

          <FloatingChip
            className="right-0 bottom-10 sm:right-4"
            delay={0.9}
            tone="blue"
            icon="wheelchair"
          >
            Ramp &amp; restraints on board
          </FloatingChip>

          {/* Road under the vehicle */}
          <RoadStrip className="mt-4" tone="light" />
        </motion.div>
      </div>

      {/* Bottom edge: checker band into the cream page below. */}
      <div className="checker-band h-2 w-full" aria-hidden="true" />
    </section>
  );
}

function FloatingChip({
  children,
  className = "",
  delay = 0,
  tone = "yellow",
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tone?: "yellow" | "blue";
  icon: "clock" | "wheelchair";
}) {
  const reduced = useReducedMotion();
  const toneClass =
    tone === "yellow"
      ? "border-taxi-500/40 text-taxi-300"
      : "border-access-500/40 text-access-400";

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`absolute z-10 flex items-center gap-2 rounded-full border bg-night-900/85 px-4 py-2.5 text-xs font-bold whitespace-nowrap backdrop-blur-md ${toneClass} ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0" aria-hidden="true">
        {icon === "clock" ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </>
        ) : (
          <>
            <circle cx="13" cy="4" r="2" />
            <path d="M11 8v6h5l3 6" />
            <path d="M15 14a6 6 0 1 1-6.5-2.2" />
          </>
        )}
      </svg>
      {children}
    </motion.div>
  );
}
