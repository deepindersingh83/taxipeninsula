import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Gate for /admin.
 *
 * This runs on the Edge runtime, so it deliberately does NOT import
 * `lib/auth.ts` — that module pulls in Prisma and bcrypt, neither of which run
 * on the Edge. All it does is check that the session cookie carries a valid,
 * unexpired signature. Every admin page and action re-checks the session
 * server-side as well; middleware is the cheap first gate, not the only one.
 */

const COOKIE_NAME = "tp_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.AUTH_SECRET;

  if (!token || !secret) return redirectToLogin(request);

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    // Expired or tampered — clear it so the browser stops sending it.
    const response = redirectToLogin(request);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  // Remember where they were headed so login can send them back.
  url.search = `?next=${encodeURIComponent(
    request.nextUrl.pathname + request.nextUrl.search
  )}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
