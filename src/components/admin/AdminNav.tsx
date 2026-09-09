"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "grid", exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: "car", badge: "bookings" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "mail", badge: "enquiries" },
  { href: "/admin/posts", label: "Blog posts", icon: "pen" },
  { href: "/admin/areas", label: "Service areas", icon: "pin" },
] as const;

export function AdminNav({
  counts,
}: {
  counts?: { bookings: number; enquiries: number };
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="px-3">
      <ul className="space-y-1">
        {links.map((link) => {
          const active =
            "exact" in link && link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

          const badgeCount =
            "badge" in link && counts
              ? link.badge === "bookings"
                ? counts.bookings
                : counts.enquiries
              : 0;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                  active
                    ? "bg-taxi-500 text-night-900"
                    : "text-night-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon name={link.icon} />
                <span className="flex-1">{link.label}</span>
                {badgeCount > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                      active ? "bg-night-900 text-taxi-400" : "bg-taxi-500 text-night-900"
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Icon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      {name === "grid" && (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      )}
      {name === "car" && (
        <>
          <path d="M5 17h14M3 13l2-6h14l2 6v4H3z" />
          <circle cx="7.5" cy="17" r="1.6" />
          <circle cx="16.5" cy="17" r="1.6" />
        </>
      )}
      {name === "mail" && (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 6 10-6" />
        </>
      )}
      {name === "pen" && (
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
      )}
      {name === "pin" && (
        <>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </>
      )}
    </svg>
  );
}
