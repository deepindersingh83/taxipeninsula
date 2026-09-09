import type { MetadataRoute } from "next";

import { getServiceAreas } from "@/lib/areas";
import { getAllPublishedSlugs } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Generated per request rather than at build time, so the URLs always match the
 * domain the sitemap was actually fetched from. Cached for an hour.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getSiteUrl();
  const url = (path: string) => `${base}${path}`;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/book"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/areas"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // The database may be unreachable during a build on a fresh server; a partial
  // sitemap is far better than a failed build.
  let areaRoutes: MetadataRoute.Sitemap = [];
  let postRoutes: MetadataRoute.Sitemap = [];

  try {
    const areas = await getServiceAreas();
    areaRoutes = areas.map((area) => ({
      url: url(`/areas/${area.slug}`),
      lastModified: area.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("[sitemap] could not load service areas:", err);
  }

  try {
    const posts = await getAllPublishedSlugs();
    postRoutes = posts.map((post) => ({
      url: url(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("[sitemap] could not load blog posts:", err);
  }

  return [...staticRoutes, ...areaRoutes, ...postRoutes];
}
