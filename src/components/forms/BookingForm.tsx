"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Honeypot,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/Field";
import { RecaptchaNotice, useRecaptcha } from "@/components/forms/useRecaptcha";
import { MaxiTaxi } from "@/components/MaxiTaxi";
import { Alert, Button } from "@/components/ui";
import { formatDateLong, formatTime12h } from "@/lib/format";
import { bookingSchema, fieldErrors } from "@/lib/validation";
import { carTypes, site } from "@/lib/site";

type Errors = Record<string, string>;

type Success = {
  reference: string;
  name: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  emailed: boolean;
};

/** Today's date as YYYY-MM-DD in the browser's local timezone. */
function todayLocalIso() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function BookingForm() {
  const params = useSearchParams();
  const executeRecaptcha = useRecaptcha();

  // Deep links from the fleet picker and service pages preselect a vehicle.
  const presetCar = params.get("car");
  const initialCar = useMemo(
    () => (carTypes.some((c) => c.value === presetCar) ? presetCar! : "maxi"),
    [presetCar]
  );

  const [carType, setCarType] = useState(initialCar);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Success | null>(null);

  const selectedCar = carTypes.find((c) => c.value === carType);
  const isWheelchair = carType === "wheelchair";
  const isParcel = carType === "parcel";
  const minDate = todayLocalIso();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrors({});
    setFormError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Validate in the browser first so obvious mistakes never cost a round trip.
    const parsed = bookingSchema.safeParse({ ...data, recaptchaToken: "" });
    if (!parsed.success) {
      const fieldErrs = fieldErrors(parsed.error);
      setErrors(fieldErrs);
      setSubmitting(false);
      // Move focus to the first problem so keyboard and screen-reader users
      // are not left guessing what went wrong.
      const first = Object.keys(fieldErrs)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("booking");

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, recaptchaToken }),
      });

      const body = await res.json();

      if (!res.ok) {
        if (body.fieldErrors) setErrors(body.fieldErrors);
        setFormError(
          body.message ??
            "Something went wrong at our end. Please call us and we will take the booking over the phone."
        );
        setSubmitting(false);
        return;
      }

      setSuccess(body.booking);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError(
        "We could not reach the server. Check your connection, or call us on " +
          site.phone +
          "."
      );
      setSubmitting(false);
    }
  }

  /* ----------------------------------------------------------- success view */
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-2 border-taxi-500 bg-white p-8 text-center sm:p-12"
      >
        <div className="mx-auto w-48">
          <MaxiTaxi rampDown streaks className="h-auto w-full" title="" />
        </div>

        <h2 className="mt-6 font-display text-2xl font-extrabold text-night-900 sm:text-3xl">
          Booking received — we&rsquo;re on it.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-night-500">
          Thanks {success.name.split(" ")[0]}. Keep this reference handy — quote
          it if you call us about this trip.
        </p>

        <p className="mt-6 inline-block rounded-xl bg-night-900 px-6 py-3 font-display text-2xl font-extrabold tracking-wider text-taxi-400">
          {success.reference}
        </p>

        <dl className="mx-auto mt-8 max-w-md space-y-3 text-left">
          <SummaryRow label="Pickup">
            {formatDateLong(success.pickupDate)} at{" "}
            {formatTime12h(success.pickupTime)}
          </SummaryRow>
          <SummaryRow label="From">{success.pickupLocation}</SummaryRow>
          <SummaryRow label="To">{success.dropoffLocation}</SummaryRow>
        </dl>

        <div className="mt-8">
          <Alert tone="info">
            <strong>This is a request, not a confirmed trip.</strong> A dispatcher
            will contact you to confirm the vehicle and driver. If your pickup is
            within the next two hours, please call{" "}
            <a href={`tel:${site.phoneHref}`} className="font-bold underline">
              {site.phone}
            </a>{" "}
            as well.
          </Alert>
        </div>

        {!success.emailed && (
          <p className="mt-4 text-xs text-night-400">
            Note: we could not send a confirmation email, but your booking is
            safely recorded against the reference above.
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-night-900 px-6 py-3 text-sm font-bold text-night-900 transition-colors hover:bg-night-900 hover:text-taxi-400"
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => {
              setSuccess(null);
              setSubmitting(false);
            }}
            className="inline-flex items-center justify-center rounded-full bg-taxi-500 px-6 py-3 text-sm font-bold text-night-900 transition-colors hover:bg-taxi-400"
          >
            Book another trip
          </button>
        </div>
      </motion.div>
    );
  }

  /* -------------------------------------------------------------- form view */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative rounded-3xl border border-night-200 bg-white p-6 shadow-lift sm:p-8 lg:p-10"
    >
      <Honeypot />

      {formError && (
        <div className="mb-6">
          <Alert tone="error" title="We couldn't submit that">
            {formError}
          </Alert>
        </div>
      )}

      {/* ------------------------------------------------------ your details */}
      <Fieldset legend="Your details" step={1}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="name"
            label="Full name"
            required
            autoComplete="name"
            placeholder="Jane Citizen"
            error={errors.name}
          />
          <TextField
            id="phone"
            label="Mobile number"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0412 345 678"
            hint="So the driver can reach you"
            error={errors.phone}
          />
        </div>
        <div className="mt-5">
          <TextField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            hint="For your written confirmation"
            error={errors.email}
          />
        </div>
      </Fieldset>

      {/* ---------------------------------------------------------- the trip */}
      <Fieldset legend="The trip" step={2}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="pickupDate"
            label="Pickup date"
            required
            type="date"
            min={minDate}
            error={errors.pickupDate}
          />
          <TextField
            id="pickupTime"
            label="Pickup time"
            required
            type="time"
            hint="24-hour clock"
            error={errors.pickupTime}
          />
        </div>

        <div className="mt-5 grid gap-5">
          <TextField
            id="pickupLocation"
            label="Pickup location"
            required
            autoComplete="street-address"
            placeholder="12 Jetty Road, Rosebud VIC 3939"
            hint="Street address, or a landmark"
            error={errors.pickupLocation}
          />
          <TextField
            id="dropoffLocation"
            label="Drop-off location"
            required
            placeholder="Melbourne Airport, Terminal 2 departures"
            error={errors.dropoffLocation}
          />
        </div>
      </Fieldset>

      {/* ------------------------------------------------------- the vehicle */}
      <Fieldset legend="The vehicle" step={3}>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id="carType"
            label="Car type"
            required
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            error={errors.carType}
          >
            {carTypes.map((car) => (
              <option key={car.value} value={car.value}>
                {car.label}
                {car.seats > 0 ? ` — up to ${car.seats}` : ""}
              </option>
            ))}
          </SelectField>

          <TextField
            id="passengers"
            label="Number of people"
            required
            type="number"
            inputMode="numeric"
            min={isParcel ? 0 : 1}
            max={11}
            defaultValue={isParcel ? 0 : 1}
            hint={selectedCar ? `Max ${selectedCar.seats}` : undefined}
            error={errors.passengers}
          />
        </div>

        {/* Vehicle preview reacts to the selection above. */}
        <div className="mt-6 flex items-center gap-5 rounded-2xl bg-night-50 p-5">
          <div className="w-28 shrink-0 sm:w-36">
            <MaxiTaxi
              className="h-auto w-full"
              rampDown={isWheelchair}
              title=""
            />
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-night-900">
              {selectedCar?.label}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-night-500">
              {selectedCar?.blurb}
            </p>
          </div>
        </div>

        {/* Wheelchair-specific follow-up, only when it is relevant. */}
        <AnimatePresence initial={false}>
          {isWheelchair && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-5">
                <SelectField
                  id="wheelchairSeats"
                  label="How many wheelchair spaces do you need?"
                  defaultValue="1"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "None — ramp access only" : `${n} wheelchair space${n > 1 ? "s" : ""}`}
                    </option>
                  ))}
                </SelectField>
                <p className="mt-2 text-xs text-night-500">
                  Accessible vehicles are a limited part of the fleet. For same-day
                  wheelchair bookings, please also call{" "}
                  <a href={`tel:${site.phoneHref}`} className="font-bold underline">
                    {site.phone}
                  </a>
                  .
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Fieldset>

      {/* ----------------------------------------------------------- extras */}
      <Fieldset legend="Anything else" step={4} optional>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="flightNumber"
            label="Flight number"
            placeholder="QF 430"
            hint="We track it for delays"
            error={errors.flightNumber}
          />
          <TextField
            id="luggage"
            label="Luggage"
            placeholder="2 large suitcases + a pram"
            error={errors.luggage}
          />
        </div>
        <div className="mt-5">
          <TextArea
            id="notes"
            label="Notes for the driver"
            rows={4}
            maxLength={1500}
            placeholder="Baby seat needed for a 2 year old · Gate code 1234 · Please call on arrival, the doorbell doesn't work"
            error={errors.notes}
          />
        </div>
      </Fieldset>

      {/* ----------------------------------------------------------- submit */}
      <div className="mt-8 border-t border-night-100 pt-8">
        <Alert tone="warning">
          Fares are <strong>quoted on request</strong> — submit this form and a
          dispatcher will confirm the price and the vehicle before your trip.
          Nothing is charged now.
        </Alert>

        <div className="mt-6 flex flex-col gap-4">
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-night-900/30 border-t-night-900" />
                Sending your booking…
              </>
            ) : (
              <>
                Request this booking
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-4" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </Button>

          <RecaptchaNotice />

          <p className="text-xs leading-relaxed text-night-400">
            By submitting you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-night-600">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-night-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </form>
  );
}

function Fieldset({
  legend,
  step,
  optional,
  children,
}: {
  legend: string;
  step: number;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-8 first:mt-0">
      <legend className="mb-5 flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-night-900 font-display text-sm font-extrabold text-taxi-400">
          {step}
        </span>
        <span className="font-display text-lg font-bold text-night-900">
          {legend}
        </span>
        {optional && (
          <span className="rounded-full bg-night-100 px-2.5 py-1 text-[11px] font-bold text-night-500">
            Optional
          </span>
        )}
      </legend>
      {children}
    </fieldset>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border-b border-night-100 pb-3">
      <dt className="w-20 shrink-0 text-sm font-semibold text-night-400">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-night-900">{children}</dd>
    </div>
  );
}
