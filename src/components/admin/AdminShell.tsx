import Link from "next/link";

import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { MaxiTaxi } from "@/components/MaxiTaxi";
import type { SessionUser } from "@/lib/auth";
import { site } from "@/lib/site";

/**
 * Chrome shared by every signed-in admin page: sidebar navigation, the page
 * title bar, and the sign-out control.
 */
export function AdminShell({
  user,
  title,
  description,
  actions,
  counts,
  children,
}: {
  user: SessionUser;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  counts?: { bookings: number; enquiries: number };
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* ---------------------------------------------------------- sidebar */}
      <aside className="shrink-0 bg-night-900 lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="w-12 shrink-0">
            <MaxiTaxi className="h-auto w-full" wheelSpeed={0.6} title="" />
          </span>
          <span>
            <span className="block font-display text-sm font-extrabold text-white">
              {site.name}
            </span>
            <span className="text-[10px] font-bold tracking-[0.16em] text-taxi-500 uppercase">
              Admin
            </span>
          </span>
        </div>

        <AdminNav counts={counts} />

        <div className="mt-6 border-t border-white/10 px-5 py-5">
          <p className="text-xs font-semibold text-night-400">Signed in as</p>
          <p className="mt-1 truncate text-sm font-bold text-white">{user.name}</p>
          <p className="truncate text-xs text-night-400">{user.email}</p>

          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/admin/account"
              className="rounded-lg px-3 py-2 text-center text-xs font-bold text-night-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Account settings
            </Link>
            <Link
              href="/"
              target="_blank"
              className="rounded-lg px-3 py-2 text-center text-xs font-bold text-night-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              View the website ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-night-300 transition-colors hover:border-red-500/40 hover:text-red-300"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-night-200 bg-white">
          <div className="flex flex-col gap-4 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-extrabold text-night-900">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-night-500">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
