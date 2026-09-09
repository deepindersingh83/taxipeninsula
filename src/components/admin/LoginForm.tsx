"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction } from "@/app/admin/actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next ?? "/admin"} />

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-night-200">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="w-full rounded-xl border-2 border-white/10 bg-night-900 px-4 py-3 text-[15px] text-white transition-colors placeholder:text-night-500 focus:border-taxi-500 focus:outline-none"
          placeholder="you@taxipeninsula.com.au"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-night-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border-2 border-white/10 bg-night-900 px-4 py-3 text-[15px] text-white transition-colors placeholder:text-night-500 focus:border-taxi-500 focus:outline-none"
          placeholder="••••••••••"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-taxi-500 px-5 py-3.5 text-sm font-bold text-night-900 transition-colors hover:bg-taxi-400 disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-night-900/30 border-t-night-900" />
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}
