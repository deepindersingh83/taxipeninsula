const items = [
  "Melbourne Airport (T1–T4)",
  "Avalon Airport",
  "Wheelchair accessible",
  "Baby & booster seats",
  "11-seat maxi vans",
  "Corporate accounts",
  "Winery day tours",
  "NDIS friendly",
  "Cruise terminal transfers",
  "24/7 dispatch",
];

/**
 * An infinite marquee of the things this business actually does. Pauses on
 * hover so anyone reading it can finish the sentence, and is duplicated in the
 * DOM so the loop has no visible seam — the copy is marked aria-hidden so
 * screen readers hear each item exactly once.
 */
export function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-night-200 bg-white py-4">
      {/* Fade the edges so items appear to emerge from nowhere. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />

      <div className="pause-on-hover flex">
        <ul className="marquee-track flex shrink-0 items-center gap-8 pr-8">
          {items.map((item) => (
            <TickerItem key={item}>{item}</TickerItem>
          ))}
        </ul>
        <ul className="marquee-track flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
          {items.map((item) => (
            <TickerItem key={item}>{item}</TickerItem>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TickerItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex shrink-0 items-center gap-8 text-sm font-bold tracking-tight whitespace-nowrap text-night-600">
      {children}
      <span className="size-1.5 shrink-0 rotate-45 bg-taxi-500" aria-hidden="true" />
    </li>
  );
}
