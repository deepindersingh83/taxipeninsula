"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { changePasswordAction } from "@/app/admin/actions";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          {state.success}
        </p>
      )}

      <PasswordField
        id="currentPassword"
        label="Current password"
        autoComplete="current-password"
      />
      <PasswordField
        id="newPassword"
        label="New password"
        autoComplete="new-password"
        hint="At least 10 characters. A short sentence works well and is easy to remember."
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
      />

      <SubmitButton />
    </form>
  );
}

function PasswordField({
  id,
  label,
  hint,
  autoComplete,
}: {
  id: string;
  label: string;
  hint?: string;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-night-800">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="password"
        required
        autoComplete={autoComplete}
        className="w-full rounded-xl border-2 border-night-200 bg-white px-4 py-2.5 text-sm transition-colors focus:border-night-900 focus:outline-none"
      />
      {hint && <p className="mt-1.5 text-xs text-night-400">{hint}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-night-900 px-5 py-3 text-sm font-bold text-taxi-400 transition-colors hover:bg-night-800 disabled:opacity-60"
    >
      {pending ? "Changing…" : "Change password"}
    </button>
  );
}
