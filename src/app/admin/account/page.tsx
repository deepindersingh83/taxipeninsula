import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { getAdminCounts } from "@/lib/admin-data";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const counts = await getAdminCounts();

  return (
    <AdminShell
      user={user}
      title="Account settings"
      description="Your sign-in details."
      counts={counts}
    >
      <div className="grid max-w-4xl gap-6 lg:grid-cols-2 lg:items-start">
        <section className="rounded-2xl border border-night-200 bg-white p-6">
          <h2 className="text-xs font-bold tracking-wide text-night-500 uppercase">
            Your details
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-bold text-night-400">Name</dt>
              <dd className="font-semibold text-night-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-night-400">Email</dt>
              <dd className="font-semibold text-night-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-night-400">Role</dt>
              <dd className="font-semibold text-night-900 capitalize">{user.role}</dd>
            </div>
          </dl>
          <p className="mt-5 border-t border-night-100 pt-4 text-xs leading-relaxed text-night-400">
            To add another staff member, or to change a name or email address,
            ask your developer — accounts are created from the server for
            security.
          </p>
        </section>

        <section className="rounded-2xl border border-night-200 bg-white p-6">
          <h2 className="text-xs font-bold tracking-wide text-night-500 uppercase">
            Change password
          </h2>
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
