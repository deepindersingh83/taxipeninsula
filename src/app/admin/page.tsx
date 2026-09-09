import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAdminCounts, getDashboardData } from "@/lib/admin-data";
import { getSessionUser } from "@/lib/auth";
import { carTypeLabel, formatDateShort, formatDateTime, formatTime12h } from "@/lib/format";
import { mailConfigured } from "@/lib/mail";
import { recaptchaEnabled } from "@/lib/recaptcha";
import { smsEnabled } from "@/lib/sms";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [counts, data] = await Promise.all([getAdminCounts(), getDashboardData()]);
  const { stats, recentBookings, recentEnquiries } = data;

  // Surface configuration gaps here rather than letting staff discover them
  // when a booking notification silently fails to arrive.
  const warnings: string[] = [];
  if (!mailConfigured()) {
    warnings.push(
      `Email is NOT configured, so no booking notifications are reaching ${
        process.env.MAIL_TO_BOOKINGS || "support@taxipeninsula.com.au"
      }. Every booking is still being saved and is listed below — nothing is lost — but you have to check this page rather than your inbox. To fix it, set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD in .env and restart.`
    );
  }
  if (!recaptchaEnabled()) {
    warnings.push(
      "reCAPTCHA is not configured. In production the public forms will refuse to submit until the keys are set."
    );
  }

  return (
    <AdminShell
      user={user}
      title={`Good day, ${user.name.split(" ")[0]}`}
      description="Everything that came in through the website."
      counts={counts}
    >
      {warnings.length > 0 && (
        <div className="mb-6 space-y-3">
          {warnings.map((w) => (
            <p
              key={w}
              className="rounded-xl border border-taxi-600/40 bg-taxi-500/15 px-4 py-3 text-sm font-semibold text-taxi-900"
            >
              ⚠️ {w}
            </p>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------ stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="New bookings"
          value={stats.newBookings}
          href="/admin/bookings?status=new"
          tone={stats.newBookings > 0 ? "alert" : "default"}
        />
        <StatCard label="Upcoming trips" value={stats.upcoming} href="/admin/bookings" />
        <StatCard label="Bookings this week" value={stats.weekBookings} href="/admin/bookings" />
        <StatCard
          label="Unread enquiries"
          value={stats.newEnquiries}
          href="/admin/enquiries?status=new"
          tone={stats.newEnquiries > 0 ? "alert" : "default"}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Published posts" value={stats.publishedPosts} href="/admin/posts" small />
        <StatCard label="Drafts" value={stats.draftPosts} href="/admin/posts?status=draft" small />
        <StatCard label="Service areas" value={stats.areaCount} href="/admin/areas" small />
      </div>

      {/* -------------------------------------------------------- bookings */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-extrabold text-night-900">
            Latest bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm font-bold text-night-600 transition-colors hover:text-night-900"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-night-200 bg-white">
          {recentBookings.length === 0 ? (
            <p className="p-8 text-center text-sm text-night-500">
              No bookings yet. They will appear here the moment one comes in.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-night-50 text-left text-xs font-bold tracking-wide text-night-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Ref</th>
                    <th className="px-4 py-3">Passenger</th>
                    <th className="px-4 py-3">Pickup</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-night-100">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="transition-colors hover:bg-night-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/bookings#${b.reference}`}
                          className="font-mono text-xs font-bold text-night-900 hover:underline"
                        >
                          {b.reference}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="block font-semibold text-night-900">{b.name}</span>
                        <a href={`tel:${b.phone}`} className="text-xs text-night-500 hover:underline">
                          {b.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="block font-semibold text-night-900">
                          {formatDateShort(new Date(`${b.pickupDate}T00:00:00`))}
                        </span>
                        <span className="text-xs text-night-500">
                          {formatTime12h(b.pickupTime)}
                        </span>
                      </td>
                      <td className="max-w-[16rem] px-4 py-3">
                        <span className="block truncate text-xs text-night-600">
                          {b.pickupLocation}
                        </span>
                        <span className="block truncate text-xs text-night-400">
                          ↓ {b.dropoffLocation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-night-600">
                        {carTypeLabel(b.carType)}
                        <span className="block text-night-400">{b.passengers} pax</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------- enquiries */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-extrabold text-night-900">
            Latest enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="text-sm font-bold text-night-600 transition-colors hover:text-night-900"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {recentEnquiries.length === 0 ? (
            <p className="rounded-2xl border border-night-200 bg-white p-8 text-center text-sm text-night-500">
              No enquiries yet.
            </p>
          ) : (
            recentEnquiries.map((e) => (
              <div key={e.id} className="rounded-2xl border border-night-200 bg-white p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-night-900">{e.name}</span>
                  <StatusBadge status={e.status} />
                  <span className="ml-auto text-xs text-night-400">
                    {formatDateTime(e.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-night-500">{e.subject}</p>
                <p className="mt-2 line-clamp-2 text-sm text-night-600">{e.message}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* -------------------------------------------------- system status */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-extrabold text-night-900">
          Integrations
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <IntegrationCard
            name="Email (SMTP)"
            on={mailConfigured()}
            onText="Notifications are being sent"
            offText="Not configured — set SMTP_HOST in .env"
          />
          <IntegrationCard
            name="Google reCAPTCHA"
            on={recaptchaEnabled()}
            onText="Forms are protected"
            offText="Not configured — set the reCAPTCHA keys in .env"
          />
          <IntegrationCard
            name="Driver SMS (Twilio)"
            on={smsEnabled()}
            onText="Driver alerts are being sent"
            offText="Off — set ENABLE_SMS=true and the Twilio keys to enable"
          />
        </div>
      </section>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  href,
  tone = "default",
  small = false,
}: {
  label: string;
  value: number;
  href: string;
  tone?: "default" | "alert";
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl border-2 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift ${
        tone === "alert" ? "border-taxi-500" : "border-night-200 hover:border-taxi-500"
      }`}
    >
      <p className="text-xs font-bold tracking-wide text-night-500 uppercase">
        {label}
      </p>
      <p
        className={`mt-2 font-display font-extrabold text-night-900 ${
          small ? "text-2xl" : "text-4xl"
        }`}
      >
        {value}
      </p>
    </Link>
  );
}

function IntegrationCard({
  name,
  on,
  onText,
  offText,
}: {
  name: string;
  on: boolean;
  onText: string;
  offText: string;
}) {
  return (
    <div className="rounded-2xl border border-night-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <span
          className={`size-2.5 rounded-full ${on ? "bg-emerald-500" : "bg-night-300"}`}
        />
        <p className="text-sm font-bold text-night-900">{name}</p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-night-500">
        {on ? onText : offText}
      </p>
    </div>
  );
}
