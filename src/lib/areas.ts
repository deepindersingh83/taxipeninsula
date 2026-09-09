import "server-only";

import { prisma } from "@/lib/db";

/** Service areas are stored in the database so staff can add suburbs without a deploy. */

export async function getServiceAreas({
  featuredOnly = false,
  take,
}: { featuredOnly?: boolean; take?: number } = {}) {
  return prisma.serviceArea.findMany({
    where: featuredOnly ? { featured: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take,
  });
}

export async function getAreaBySlug(slug: string) {
  return prisma.serviceArea.findUnique({ where: { slug } });
}

/** Groups areas by region for the /areas index. */
export async function getAreasByRegion() {
  const areas = await getServiceAreas();
  const groups = new Map<string, typeof areas>();

  for (const area of areas) {
    const list = groups.get(area.region) ?? [];
    list.push(area);
    groups.set(area.region, list);
  }

  return Array.from(groups, ([region, items]) => ({ region, items }));
}

/** Nearby suburbs to cross-link from an area page, for internal SEO. */
export async function getNearbyAreas(slug: string, region: string, take = 6) {
  return prisma.serviceArea.findMany({
    where: { region, slug: { not: slug } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take,
  });
}
