import "server-only";

import { headers } from "next/headers";

/**
 * Works out the site's public base URL.
 *
 * The goal is that you can clone this repo onto any server, start it, and have
 * it serve correctly on whatever domain it is reached by — no configuration
 * step, no hardcoded taxipeninsula.com.au. So the URL is detected from the
 * incoming request.
 *
 * Resolution order:
 *
 *   1. NEXT_PUBLIC_SITE_URL, if set — an explicit operator override.
 *   2. The request's forwarded host/proto headers — the auto-detected case.
 *   3. http://localhost:<PORT> — for builds, scripts and anything with no
 *      request in scope.
 *
 * ── Two reasons to still set NEXT_PUBLIC_SITE_URL in production ───────────
 *
 * **Performance.** When it is set, nothing here reads request headers, so
 * pages stay statically prerendered. When it is unset, detection needs the
 * request, which opts those pages into dynamic rendering. Correct either way,
 * measurably faster when set.
 *
 * **Host header trust.** `Host` is supplied by the client and a misconfigured
 * proxy can pass a forged one straight through. Detection is fine for the
 * canonical/OG tags it mostly feeds, but the value also reaches the admin link
 * in booking notification emails — so on a production host, pinning the domain
 * removes that class of problem entirely.
 *
 * Both are covered in README.md.
 */

/** Strips a trailing slash and rejects anything that is not a valid URL. */
function normalise(input: string): string | null {
  const trimmed = input.trim().replace(/\/+$/, "");
  if (!trimmed) return null;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withScheme);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

/** The explicit override, or null. Never touches request headers. */
export function configuredSiteUrl(): string | null {
  return normalise(process.env.NEXT_PUBLIC_SITE_URL ?? "");
}

/** Last-resort base URL when there is no request and no configuration. */
export function fallbackSiteUrl(): string {
  return `http://localhost:${process.env.PORT || 3000}`;
}

/**
 * Derives the base URL from a set of request headers.
 *
 * Handles the reverse-proxy case (nginx/Apache/cPanel), where the Node process
 * sees plain HTTP on an internal port and only the `X-Forwarded-*` headers know
 * the real scheme, host and port the visitor used.
 */
export function siteUrlFromHeaders(headerList: Headers): string | null {
  const configured = configuredSiteUrl();
  if (configured) return configured;

  // `x-forwarded-host` can be a comma-separated chain; the first entry is the
  // original client-facing host.
  const forwardedHost = headerList.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || headerList.get("host")?.trim();
  if (!host) return null;

  const forwardedProto = headerList
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  // Assume plain HTTP for loopback and private addresses, HTTPS otherwise —
  // a public host reached over HTTP would still be served correctly, it just
  // gets https:// in its canonical tags, which is where it should end up.
  const isLocal =
    /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/i.test(host) ||
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);

  const proto =
    forwardedProto === "http" || forwardedProto === "https"
      ? forwardedProto
      : isLocal
        ? "http"
        : "https";

  return normalise(`${proto}://${host}`);
}

/**
 * The site's base URL in a server request context.
 *
 * When NEXT_PUBLIC_SITE_URL is set this returns immediately without reading
 * headers, which is what keeps statically generated pages static.
 */
export async function getSiteUrl(): Promise<string> {
  const configured = configuredSiteUrl();
  if (configured) return configured;

  try {
    return siteUrlFromHeaders(await headers()) ?? fallbackSiteUrl();
  } catch {
    // No request in scope — prerendering at build time, a seed script, etc.
    return fallbackSiteUrl();
  }
}

/** Absolute URL for a path, detected from the current request. */
export async function absoluteUrl(path = "/"): Promise<string> {
  const base = await getSiteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute URL for a path, given headers you already hold (API routes). */
export function absoluteUrlFrom(headerList: Headers, path = "/"): string {
  const base = siteUrlFromHeaders(headerList) ?? fallbackSiteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
