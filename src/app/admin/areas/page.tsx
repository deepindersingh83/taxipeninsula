import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { AreaManager } from "@/components/admin/AreaManager";
import { getAdminCounts } from "@/lib/admin-data";
import { getSessionUser } from "@/lib/auth";
import { getServiceAreas } from "@/lib/areas";

export const dynamic = "force-dynamic";

export default async function AdminAreasPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [areas, counts] = await Promise.all([getServiceAreas(), getAdminCounts()]);

  return (
    <AdminShell
      user={user}
      title="Service areas"
      description="Each area gets its own page on the website — good for local search. Adding one here publishes it."
      counts={counts}
    >
      <AreaManager
        areas={areas.map((a) => ({
          id: a.id,
          slug: a.slug,
          name: a.name,
          region: a.region,
          headline: a.headline,
          description: a.description,
          postcodes: a.postcodes,
          travelTime: a.travelTime,
          featured: a.featured,
          sortOrder: a.sortOrder,
        }))}
      />
    </AdminShell>
  );
}
