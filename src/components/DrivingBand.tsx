"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { MaxiTaxi } from "@/components/MaxiTaxi";

/**
 * A full-width road on which a maxi taxi drives from left to right *as you
 * scroll*. Tying the position to scroll progress rather than a timer means the
 * movement always feels connected to what the visitor is doing, and it costs
 * nothing when the section is off screen.
 *
 * Used as the divider between major sections so the taxi motif recurs the whole
 * way down every page without ever repeating the same shot.
 */
export function DrivingBand({
  className = "",
  label,
  rampDown = false,
  reverse = false,
}: {
  className?: string;
  label?: string;
  rampDown?: boolean;
  /** Drive right-to-left instead (the taxi is mirrored). */
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ["105%", "-25%"] : ["-25%", "105%"]
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden py-8 ${className}`}
      aria-hidden="true"
    >
      {/* Road surface */}
      <div className="relative mx-auto h-px w-full max-w-none bg-transparent">
        <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-night-900/90" />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center gap-8 overflow-hidden px-2">
          <div className="animate-road flex w-[200%] items-center gap-8">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="h-[2px] w-10 shrink-0 rounded-full bg-taxi-500/70"
              />
            ))}
          </div>
        </div>
      </div>

      {/* The vehicle */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-0 w-40 -translate-y-[62%] sm:w-52 lg:w-64"
        style={reduced ? { left: "8%" } : { x }}
      >
        <MaxiTaxi
          className={`h-auto w-full drop-shadow-[0_10px_24px_rgba(15,18,22,0.28)] ${
            reverse ? "-scale-x-100" : ""
          }`}
          wheelSpeed={0.5}
          rampDown={rampDown}
          streaks
          title=""
        />
      </motion.div>

      {label && (
        <p className="relative mt-10 text-center text-xs font-semibold tracking-[0.3em] text-night-400 uppercase">
          {label}
        </p>
      )}
    </div>
  );
}
