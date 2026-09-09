"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import {
  Honeypot,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/Field";
import { RecaptchaNotice, useRecaptcha } from "@/components/forms/useRecaptcha";
import { MaxiTaxi } from "@/components/MaxiTaxi";
import { Alert, Button } from "@/components/ui";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { site } from "@/lib/site";

const subjects = [
  "General enquiry",
  "Booking question",
  "Wheelchair accessible transport",
  "NDIS transport",
  "Corporate account",
  "Winery or day tour quote",
  "Parcel / courier run",
  "Feedback or complaint",
];

export function ContactForm() {
  const executeRecaptcha = useRecaptcha();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrors({});
    setFormError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const parsed = contactSchema.safeParse({ ...data, recaptchaToken: "" });
    if (!parsed.success) {
      const fieldErrs = fieldErrors(parsed.error);
      setErrors(fieldErrs);
      setSubmitting(false);
      form.querySelector<HTMLElement>(`[name="${Object.keys(fieldErrs)[0]}"]`)?.focus();
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("contact");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, recaptchaToken }),
      });

      const body = await res.json();

      if (!res.ok) {
        if (body.fieldErrors) setErrors(body.fieldErrors);
        setFormError(body.message ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSent(true);
    } catch {
      setFormError(
        `We could not reach the server. Please call us on ${site.phone}.`
      );
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-2 border-taxi-500 bg-white p-8 text-center sm:p-10"
      >
        <div className="mx-auto w-40">
          <MaxiTaxi className="h-auto w-full" streaks title="" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-extrabold text-night-900">
          Message sent.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-night-500">
          We read everything that comes through here and usually reply the same
          day. If it is urgent, call{" "}
          <a
            href={`tel:${site.phoneHref}`}
            className="font-bold text-night-900 underline"
          >
            {site.phone}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setSubmitting(false);
          }}
          className="mt-7 inline-flex items-center justify-center rounded-full border-2 border-night-900 px-6 py-3 text-sm font-bold text-night-900 transition-colors hover:bg-night-900 hover:text-taxi-400"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-night-200 bg-white p-6 shadow-lift sm:p-8"
    >
      <Honeypot />

      {formError && (
        <div className="mb-6">
          <Alert tone="error" title="We couldn't send that">
            {formError}
          </Alert>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="name"
          label="Your name"
          required
          autoComplete="name"
          placeholder="Jane Citizen"
          error={errors.name}
        />
        <TextField
          id="email"
          label="Email address"
          required
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          error={errors.email}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <TextField
          id="phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0412 345 678"
          error={errors.phone}
        />
        <SelectField id="subject" label="What is it about?" defaultValue={subjects[0]}>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-5">
        <TextArea
          id="message"
          label="Message"
          required
          rows={6}
          maxLength={3000}
          placeholder="Tell us what you need — dates, locations, how many people, and anything else that matters."
          error={errors.message}
        />
      </div>

      <div className="mt-7 flex flex-col gap-4">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-night-900/30 border-t-night-900" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
            </>
          )}
        </Button>

        <RecaptchaNotice />

        <p className="text-xs leading-relaxed text-night-400">
          We use your details only to answer your enquiry — see our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-night-600">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
