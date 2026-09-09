import "server-only";

/**
 * Google reCAPTCHA v3 verification.
 *
 * Behaviour when keys are not configured:
 *   - development: verification is SKIPPED with a console warning, so the site
 *     is usable before you have registered a reCAPTCHA site.
 *   - production: verification FAILS closed. A misconfigured production deploy
 *     must not silently accept unverified form submissions.
 */

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export type RecaptchaResult =
  | { ok: true; score: number | null; skipped: boolean }
  | { ok: false; reason: string };

export async function verifyRecaptcha(
  token: string | undefined | null,
  expectedAction: string,
  remoteIp?: string
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        reason:
          "reCAPTCHA is not configured on the server. Set RECAPTCHA_SECRET_KEY.",
      };
    }
    console.warn(
      "[recaptcha] RECAPTCHA_SECRET_KEY is not set — skipping verification (development only)."
    );
    return { ok: true, score: null, skipped: true };
  }

  if (!token) {
    return { ok: false, reason: "Captcha token missing. Please reload the page and try again." };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  let data: {
    success?: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    data = await res.json();
  } catch {
    return {
      ok: false,
      reason: "Could not reach the captcha service. Please try again in a moment.",
    };
  }

  if (!data.success) {
    const codes = data["error-codes"]?.join(", ") ?? "unknown";
    return { ok: false, reason: `Captcha verification failed (${codes}).` };
  }

  // v3 returns the action the token was generated for; a mismatch means the
  // token was lifted from another form.
  if (data.action && data.action !== expectedAction) {
    return { ok: false, reason: "Captcha action mismatch." };
  }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  const score = typeof data.score === "number" ? data.score : null;

  if (score !== null && score < minScore) {
    return {
      ok: false,
      reason:
        "Your submission looked automated. Please call us instead — we'd rather not lose your booking.",
    };
  }

  return { ok: true, score, skipped: false };
}

/** True when the browser should load and execute the reCAPTCHA script. */
export function recaptchaEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim());
}
