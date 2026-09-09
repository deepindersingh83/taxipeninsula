import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

/** Generated per request so the sitemap URL matches the serving domain. */
export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin panel and API endpoints have nothing useful to index and
        // should not appear in search results.
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
