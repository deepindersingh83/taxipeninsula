import Link from "next/link";

import { MaxiTaxi, RoadStrip } from "@/components/MaxiTaxi";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-night-900 px-6 py-20 text-center text-white">
      <div className="w-full max-w-sm">
        <MaxiTaxi
          className="h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          streaks
          title=""
        />
      </div>

      <RoadStrip className="mt-4 w-full max-w-sm" />

      <p className="mt-10 font-display text-6xl font-extrabold text-taxi-400">404</p>

      <h1 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
        Wrong turn somewhere.
      </h1>

      <p className="mt-3 max-w-sm text-night-300">
        That page does not exist — but the phone still works and the vans are
        still running.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-taxi-500 px-7 py-3.5 text-sm font-bold text-night-900 transition-colors hover:bg-taxi-400"
        >
          Back to home
        </Link>
        <Link
          href="/book"
          className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-taxi-500 hover:text-taxi-400"
        >
          Book a ride
        </Link>
        <a
          href={`tel:${site.phoneHref}`}
          className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold text-night-300 transition-colors hover:text-white"
        >
          {site.phone}
        </a>
      </div>
    </div>
  );
}
