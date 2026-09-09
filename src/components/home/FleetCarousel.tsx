"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { MaxiTaxi, RoadStrip } from "@/components/MaxiTaxi";
import { carTypes } from "@/lib/site";

/**
 * Fleet picker. Selecting a vehicle swaps the illustration and deep-links into
 * the booking form with that vehicle preselected, so the visitor never has to
 * make the same choice twice.
 */
export function FleetCarousel() {
  const [active, setActive] = useState(0);
  const vehicle = carTypes[active];
  const isWheelchair = vehicle.value === "wheelchair";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
      {/* Selector */}
      <div
        role="tablist"
        aria-label="Vehicle types"
        aria-orientation="vertical"
        className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {carTypes.map((car, i) => {
          const selected = i === active;
          return (
            <button
              key={car.value}
              role="tab"
              type="button"
              id={`fleet-tab-${car.value}`}
              aria-selected={selected}
              aria-controls="fleet-panel"
              onClick={() => setActive(i)}
              className={`relative shrink-0 rounded-xl border-2 px-4 py-3.5 text-left transition-all lg:w-full ${
                selected
                  ? "border-night-900 bg-night-900 text-white"
                  : "border-night-200 bg-white text-night-700 hover:border-taxi-500"
              }`}
            >
              <span className="block text-sm font-bold whitespace-nowrap lg:whitespace-normal">
                {car.label}
              </span>
              <span
                className={`mt-0.5 block text-xs ${
                  selected ? "text-taxi-400" : "text-night-400"
                }`}
              >
                Up to {car.seats} passengers
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div
        role="tabpanel"
        id="fleet-panel"
        aria-labelledby={`fleet-tab-${vehicle.value}`}
        className="relative overflow-hidden rounded-3xl border border-night-200 bg-gradient-to-br from-white to-night-50 p-6 sm:p-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={vehicle.value}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-taxi-500 px-3 py-1 text-xs font-bold text-night-900">
                {vehicle.seats} seats
              </span>
              <span className="rounded-full bg-night-900 px-3 py-1 text-xs font-bold text-white">
                {vehicle.luggage}
              </span>
              {isWheelchair && (
                <span className="rounded-full bg-access-500 px-3 py-1 text-xs font-bold text-white">
                  Wheelchair accessible
                </span>
              )}
            </div>

            <h3 className="mt-5 font-display text-2xl font-extrabold text-night-900 sm:text-3xl">
              {vehicle.label}
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-night-500">
              {vehicle.blurb}
            </p>

            <div className="mt-8 max-w-md">
              <MaxiTaxi
                className="h-auto w-full"
                rampDown={isWheelchair}
                title={vehicle.label}
              />
              <RoadStrip className="mt-4" tone="dark" />
            </div>

            <Link
              href={`/book?car=${vehicle.value}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-night-900 px-6 py-3 text-sm font-bold text-taxi-400 transition-all hover:bg-night-800 active:scale-95"
            >
              Book a {vehicle.label.toLowerCase()}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
