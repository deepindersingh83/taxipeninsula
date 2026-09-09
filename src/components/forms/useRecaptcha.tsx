"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Returns a function that mints a fresh reCAPTCHA v3 token for a given action.
 *
 * v3 tokens expire after two minutes, so the token must be generated at submit
 * time rather than on page load — a visitor who fills in a long form slowly
 * would otherwise be rejected.
 *
 * If no site key is configured the hook resolves to `undefined` and the server
 * decides what to do (skip in development, reject in production).
 */
export function useRecaptcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return useCallback(
    async (action: string): Promise<string | undefined> => {
      if (!siteKey) return undefined;

      // The script is loaded lazily, so it may not have arrived yet.
      const grecaptcha = await waitForGrecaptcha();
      if (!grecaptcha) return undefined;

      return new Promise<string | undefined>((resolve) => {
        grecaptcha.ready(() => {
          grecaptcha
            .execute(siteKey, { action })
            .then(resolve)
            .catch(() => resolve(undefined));
        });
      });
    },
    [siteKey]
  );
}

/** Polls for up to ~5 seconds for the reCAPTCHA script to finish loading. */
async function waitForGrecaptcha() {
  for (let i = 0; i < 50; i++) {
    if (typeof window !== "undefined" && window.grecaptcha) return window.grecaptcha;
    await new Promise((r) => setTimeout(r, 100));
  }
  return null;
}

/**
 * Google's terms require visible attribution wherever the v3 badge is hidden.
 * Render this next to every submit button.
 */
export function RecaptchaNotice() {
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) return null;
  return (
    <p className="text-xs leading-relaxed text-night-400">
      This site is protected by reCAPTCHA and the Google{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-night-600"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-night-600"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
