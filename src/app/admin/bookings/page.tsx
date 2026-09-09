import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { BookingCard } from "@/components/admin/BookingCard";
import { getAdminCounts } from "@/lib/admin-data";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const filters = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "upcoming", label: "Upcoming trips" },
];

const PER_PAGE = 25;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const { status = "", q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const todayIso = new Date().toISOString().slice(0, 10);

  const where = {
    ...(status === "upcoming"
      ? { pickupDate: { gte: todayIso }, status: { in: ["new", "confirmed"] } }
      : status
        ? { status }
        : {}),
    ...(q
      ? {
          OR: [
            { reference: { contains: q } },
            { name: { contains: q } },
            { phone: { contains: q } },
            { pickupLocation: { contains: q } },
            { dropoffLocation: { contains: q } },
          ],
        }
      : {}),
  };

  const [bookings, total, counts] = await Promise.all([
    prisma.booking.findMany({
      where,
      // Upcoming trips read best in chronological order; everything else is
      // most-recent-first.
      orderBy:
        status === "upcoming"
          ? [{ pickupDate: "asc" }, { pickupTime: "asc" }]
          : { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.booking.count({ where }),
    getAdminCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const href = (opts: { status?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = opts.status ?? status;
    if (s) params.set("status", s);
    if (q) params.set("q", q);
    if (opts.page && opts.page > 1) params.set("page", String(opts.page));
    const qs = params.toString();
    return qs ? `/admin/bookings?${qs}` : "/admin/bookings";
  };

  return (
    <AdminShell
      user={user}
      title="Bookings"
      description={`${total} booking${total === 1 ? "" : "s"}${status ? ` · ${status}` : ""}`}
      counts={counts}
    >
      {/* --------------------------------------------------------- controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter bookings" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.value || "all"}
              href={href({ status: f.value, page: 1 })}
              aria-current={status === f.value ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                status === f.value
                  ? "bg-night-900 text-taxi-400"
                  : "bg-white text-night-600 ring-1 ring-night-200 hover:bg-night-100"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>

        <form action="/admin/bookings" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search reference, name, phone, address…"
            aria-label="Search bookings"
            className="w-full rounded-full border-2 border-night-200 bg-white px-4 py-2 text-sm transition-colors focus:border-night-900 focus:outline-none lg:w-80"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-night-900 px-5 py-2 text-xs font-bold text-taxi-400 transition-colors hover:bg-night-800"
          >
            Search
          </button>
        </form>
      </div>

      {/* --------------------------------------------------------- listing */}
      <div className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-night-300 bg-white p-12 text-center text-sm text-night-500">
            {q || status
              ? "No bookings match that filter."
              : "No bookings yet. They will appear here as soon as one comes in through the website."}
          </p>
        ) : (
          bookings.map((b) => <BookingCard key={b.id} booking={b} />)
        )}
      </div>

      {/* ------------------------------------------------------ pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <Link
                key={n}
                href={href({ page: n })}
                aria-current={n === page ? "page" : undefined}
                className={`grid size-9 place-items-center rounded-full text-sm font-bold transition-colors ${
                  n === page
                    ? "bg-night-900 text-taxi-400"
                    : "bg-white text-night-600 ring-1 ring-night-200 hover:bg-night-100"
                }`}
              >
                {n}
              </Link>
            );
          })}
        </nav>
      )}
    </AdminShell>
  );
}
