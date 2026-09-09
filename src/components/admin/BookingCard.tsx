"use client";

import { useState } from "react";

import { deleteBookingAction, updateBookingAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { carTypeLabel, formatDateLong, formatDateTime, formatTime12h } from "@/lib/format";

export type AdminBooking = {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  carType: string;
  passengers: number;
  wheelchairSeats: number;
  luggage: string;
  flightNumber: string;
  notes: string;
  status: string;
  adminNotes: string;
  emailSent: boolean;
  smsSent: boolean;
  createdAt: Date;
};

const statuses = ["new", "confirmed", "completed", "cancelled"];

export function BookingCard({ booking }: { booking: AdminBooking }) {
  const [open, setOpen] = useState(booking.status === "new");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isWheelchair = booking.carType === "wheelchair" || booking.wheelchairSeats > 0;

  return (
    <article
      id={booking.reference}
      className={`scroll-mt-6 overflow-hidden rounded-2xl border-2 bg-white transition-colors ${
        booking.status === "new" ? "border-taxi-500" : "border-night-200"
      }`}
    >
      {/* ----------------------------------------------------------- header */}
      <div className="flex flex-wrap items-start gap-4 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-extrabold text-night-900">
              {booking.reference}
            </span>
            <StatusBadge status={booking.status} />
            {isWheelchair && (
              <span className="rounded-full bg-access-500 px-2.5 py-1 text-[11px] font-bold text-white">
                Wheelchair
              </span>
            )}
            {booking.flightNumber && (
              <span className="rounded-full bg-night-900 px-2.5 py-1 text-[11px] font-bold text-taxi-400">
                ✈ {booking.flightNumber}
              </span>
            )}
          </div>

          <p className="mt-2.5 font-display text-lg font-bold text-night-900">
            {formatDateLong(booking.pickupDate)} at {formatTime12h(booking.pickupTime)}
          </p>

          <div className="mt-3 space-y-1.5 text-sm">
            <p className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-taxi-500" />
              <span className="text-night-700">{booking.pickupLocation}</span>
            </p>
            <p className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-night-900" />
              <span className="text-night-700">{booking.dropoffLocation}</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-bold text-night-900">{booking.name}</p>
          <a
            href={`tel:${booking.phone}`}
            className="block text-sm font-semibold text-access-600 hover:underline"
          >
            {booking.phone}
          </a>
          {booking.email && (
            <a
              href={`mailto:${booking.email}`}
              className="block max-w-[14rem] truncate text-xs text-night-500 hover:underline"
            >
              {booking.email}
            </a>
          )}
          <p className="mt-2 text-xs text-night-400">
            {carTypeLabel(booking.carType)} · {booking.passengers} pax
          </p>
        </div>
      </div>

      {/* --------------------------------------------------------- controls */}
      <div className="flex flex-wrap items-center gap-2 border-t border-night-100 bg-night-50 px-5 py-3">
        {statuses.map((s) => (
          <form key={s} action={updateBookingAction}>
            <input type="hidden" name="id" value={booking.id} />
            <input type="hidden" name="status" value={s} />
            <button
              type="submit"
              disabled={booking.status === s}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition-colors ${
                booking.status === s
                  ? "cursor-default bg-night-900 text-taxi-400"
                  : "bg-white text-night-600 ring-1 ring-night-200 hover:bg-night-100"
              }`}
            >
              {s}
            </button>
          </form>
        ))}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="ml-auto rounded-full px-3.5 py-1.5 text-xs font-bold text-night-600 transition-colors hover:bg-night-200"
        >
          {open ? "Hide details" : "Show details"}
        </button>
      </div>

      {/* ---------------------------------------------------------- details */}
      {open && (
        <div className="border-t border-night-100 p-5">
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <Detail label="Booked">{formatDateTime(booking.createdAt)}</Detail>
            <Detail label="Vehicle">{carTypeLabel(booking.carType)}</Detail>
            <Detail label="Passengers">{booking.passengers}</Detail>
            {booking.wheelchairSeats > 0 && (
              <Detail label="Wheelchair spaces">{booking.wheelchairSeats}</Detail>
            )}
            {booking.luggage && <Detail label="Luggage">{booking.luggage}</Detail>}
            {booking.flightNumber && (
              <Detail label="Flight">{booking.flightNumber}</Detail>
            )}
            <Detail label="Email notification">
              {booking.emailSent ? "✅ Sent" : "❌ Not sent"}
            </Detail>
            <Detail label="Driver SMS">
              {booking.smsSent ? "✅ Sent" : "— Off or not sent"}
            </Detail>
          </dl>

          {booking.notes && (
            <div className="mt-5 rounded-xl bg-taxi-500/10 p-4">
              <p className="text-xs font-bold tracking-wide text-taxi-900 uppercase">
                Notes from the customer
              </p>
              <p className="mt-1.5 text-sm whitespace-pre-wrap text-night-700">
                {booking.notes}
              </p>
            </div>
          )}

          {/* Internal notes */}
          <form action={updateBookingAction} className="mt-5">
            <input type="hidden" name="id" value={booking.id} />
            <input type="hidden" name="status" value={booking.status} />
            <label
              htmlFor={`notes-${booking.id}`}
              className="mb-1.5 block text-xs font-bold tracking-wide text-night-500 uppercase"
            >
              Internal notes (not visible to the customer)
            </label>
            <textarea
              id={`notes-${booking.id}`}
              name="adminNotes"
              rows={3}
              defaultValue={booking.adminNotes}
              placeholder="Driver allocated, quoted fare, call-back notes…"
              className="w-full rounded-xl border-2 border-night-200 px-4 py-3 text-sm transition-colors focus:border-night-900 focus:outline-none"
            />
            <div className="mt-3 flex items-center gap-2">
              <button
                type="submit"
                className="rounded-full bg-night-900 px-5 py-2 text-xs font-bold text-taxi-400 transition-colors hover:bg-night-800"
              >
                Save notes
              </button>

              {confirmingDelete ? (
                <span className="flex items-center gap-2">
                  <button
                    type="submit"
                    formAction={deleteBookingAction}
                    className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700"
                  >
                    Yes, delete permanently
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-full px-3 py-2 text-xs font-bold text-night-500 hover:text-night-900"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="ml-auto rounded-full px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete booking
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </article>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <dt className="w-36 shrink-0 text-xs font-bold tracking-wide text-night-400 uppercase">
        {label}
      </dt>
      <dd className="font-semibold text-night-800">{children}</dd>
    </div>
  );
}
