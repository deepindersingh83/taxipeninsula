import Link from "next/link";
import { redirect } from "next/navigation";

import { deleteEnquiryAction, updateEnquiryAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAdminCounts } from "@/lib/admin-data";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const filters = [
  { value: "", label: "All" },
  { value: "new", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
];

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const { status = "" } = await searchParams;

  const [enquiries, counts] = await Promise.all([
    prisma.enquiry.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    getAdminCounts(),
  ]);

  return (
    <AdminShell
      user={user}
      title="Enquiries"
      description={`${enquiries.length} message${enquiries.length === 1 ? "" : "s"} from the contact form`}
      counts={counts}
    >
      <nav aria-label="Filter enquiries" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value || "all"}
            href={f.value ? `/admin/enquiries?status=${f.value}` : "/admin/enquiries"}
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

      <div className="mt-6 space-y-4">
        {enquiries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-night-300 bg-white p-12 text-center text-sm text-night-500">
            Nothing here.
          </p>
        ) : (
          enquiries.map((e) => (
            <article
              key={e.id}
              className={`rounded-2xl border-2 bg-white p-5 ${
                e.status === "new" ? "border-taxi-500" : "border-night-200"
              }`}
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-night-900">{e.name}</span>
                    <StatusBadge status={e.status} />
                    {!e.emailSent && (
                      <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-bold text-red-700">
                        Email not sent
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-night-600">
                    {e.subject}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-night-500">
                    <a href={`mailto:${e.email}`} className="hover:underline">
                      {e.email}
                    </a>
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="hover:underline">
                        {e.phone}
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-xs whitespace-nowrap text-night-400">
                  {formatDateTime(e.createdAt)}
                </span>
              </div>

              <p className="mt-4 rounded-xl bg-night-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-night-700">
                {e.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${e.email}?subject=${encodeURIComponent(
                    `Re: ${e.subject || "Your enquiry"}`
                  )}`}
                  className="rounded-full bg-night-900 px-4 py-2 text-xs font-bold text-taxi-400 transition-colors hover:bg-night-800"
                >
                  Reply by email
                </a>

                {["read", "replied"].map((s) => (
                  <form key={s} action={updateEnquiryAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="status" value={s} />
                    <button
                      type="submit"
                      disabled={e.status === s}
                      className="rounded-full bg-white px-4 py-2 text-xs font-bold text-night-600 capitalize ring-1 ring-night-200 transition-colors hover:bg-night-100 disabled:opacity-40"
                    >
                      Mark {s}
                    </button>
                  </form>
                ))}

                <form action={deleteEnquiryAction} className="ml-auto">
                  <input type="hidden" name="id" value={e.id} />
                  <button
                    type="submit"
                    className="rounded-full px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}
