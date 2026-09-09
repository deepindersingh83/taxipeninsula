"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { site } from "@/lib/site";

/**
 * A sticky call/book bar on small screens. Most taxi traffic is mobile and
 * often urgent — burying the phone number in the footer costs fares.
 *
 * Hidden on the booking page itself (where the form is the call to action) and
 * until the visitor has scrolled past the hero, so it never covers the first
 * thing they see.
 */
export function MobileBookBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/book") || pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-night-800 bg-night-900/95 backdrop-blur-lg sm:hidden"
        >
          <div className="flex items-stretch gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <a
              href={`tel:${site.phoneHref}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-taxi-500 px-4 py-3 text-sm font-bold text-taxi-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Call now
            </a>
            <Link
              href="/book"
              className="flex flex-1 items-center justify-center rounded-xl bg-taxi-500 px-4 py-3 text-sm font-bold text-night-900"
            >
              Book online
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
