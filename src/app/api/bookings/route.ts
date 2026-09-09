import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { carTypeLabel, formatDateLong, formatTime12h, generateReference } from "@/lib/format";
import { detailRows, emailLayout, esc, sendMail } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendDriverSms, smsEnabled } from "@/lib/sms";
import { site } from "@/lib/site";
import { absoluteUrlFrom } from "@/lib/site-url";
import { bookingSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
// Never cache a mutation endpoint.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  /* ------------------------------------------------------------ rate limit */
  const ip = clientIp(request.headers);
  const limit = rateLimit(`booking:${ip}`, 5, 600); // 5 bookings per 10 minutes

  if (!limit.ok) {
    return NextResponse.json(
      {
        message: `That's a lot of bookings in a short time. Please wait ${limit.retryAfterSeconds} seconds, or call us on ${site.phone}.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  /* -------------------------------------------------------------- validate */
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields.",
        fieldErrors: fieldErrors(parsed.error),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  /**
   * Honeypot.
   *
   * This deliberately does NOT discard the submission. An earlier version did,
   * and it lost real bookings: the field was named `company`, browser autofill
   * filled it in for genuine customers, and they got a booking reference for a
   * trip that was never recorded.
   *
   * For a taxi business the asymmetry is stark — a false positive costs a real
   * fare, a false negative costs one junk row someone deletes in two seconds.
   * So a tripped honeypot is saved like any other booking, flagged `spam` so it
   * stays out of the "new" queue and the dashboard counts, and reviewable under
   * the Spam filter in the admin panel. The response is the normal success
   * shape, so an actual bot still learns nothing.
   */
  const suspectedBot = Boolean(data.tp_hp_ref);
  if (suspectedBot) {
    console.warn(
      `[bookings] honeypot tripped by ${ip} — saving as spam for review, not discarding`
    );
  }

  /* ------------------------------------------------------------- reCAPTCHA */
  const captcha = await verifyRecaptcha(data.recaptchaToken, "booking", ip);
  if (!captcha.ok) {
    return NextResponse.json({ message: captcha.reason }, { status: 400 });
  }

  /* --------------------------------------------------------------- persist */
  // Save FIRST, notify second. If SMTP is down we still have the booking.
  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        reference: generateReference(),
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        carType: data.carType,
        passengers: data.passengers,
        wheelchairSeats: data.wheelchairSeats,
        luggage: data.luggage,
        flightNumber: data.flightNumber,
        notes: data.notes,
        status: suspectedBot ? "spam" : "new",
        adminNotes: suspectedBot
          ? "Flagged automatically: the hidden anti-spam field was filled in. " +
            "Usually a bot — but check before deleting, because a browser " +
            "extension can occasionally do the same to a genuine booking."
          : "",
      },
    });
  } catch (err) {
    console.error("[bookings] failed to save booking:", err);
    return NextResponse.json(
      {
        message: `We couldn't save that booking. Please call us on ${site.phone} and we'll take it over the phone.`,
      },
      { status: 500 }
    );
  }

  /* ---------------------------------------------------------------- notify */
  const vehicle = carTypeLabel(data.carType);
  const when = `${formatDateLong(data.pickupDate)} at ${formatTime12h(data.pickupTime)}`;
  // Built from this request, so the link works on whatever domain the site is
  // served from — unless NEXT_PUBLIC_SITE_URL pins it, which it should in
  // production (see lib/site-url.ts on host header trust).
  const adminUrl = absoluteUrlFrom(request.headers, "/admin/bookings");

  const rows: Array<[string, string | number]> = [
    ["Reference", booking.reference],
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email || "—"],
    ["Pickup", when],
    ["From", data.pickupLocation],
    ["To", data.dropoffLocation],
    ["Vehicle", vehicle],
    ["Passengers", data.passengers],
    ["Wheelchair spaces", data.wheelchairSeats || ""],
    ["Flight", data.flightNumber],
    ["Luggage", data.luggage],
    ["Notes", data.notes],
  ];

  // Suspected bots are recorded but never notified about — no operator email,
  // no customer confirmation, no driver SMS. Staff review them under the Spam
  // filter instead.
  const operatorEmail = suspectedBot
    ? Promise.resolve({ sent: false })
    : sendMail({
    to: process.env.MAIL_TO_BOOKINGS || site.email,
    replyTo: data.email || undefined,
    subject: `New booking ${booking.reference} — ${when} — ${vehicle}`,
    html: emailLayout(
      `New booking request: ${booking.reference}`,
      `${detailRows(rows)}
       <p style="margin-top:20px;font-size:13px;color:#71717a;">
         Manage this booking in the admin panel:
         <a href="${esc(adminUrl)}">${esc(adminUrl)}</a>
       </p>`
    ),
    text: rows
      .filter(([, v]) => String(v).trim() !== "")
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
  });

  const customerEmail =
    !suspectedBot && data.email && process.env.SEND_CUSTOMER_CONFIRMATION !== "false"
      ? sendMail({
          to: data.email,
          subject: `We've got your booking — ${booking.reference}`,
          html: emailLayout(
            `Thanks ${esc(data.name.split(" ")[0])}, we've got it.`,
            `<p style="font-size:14px;line-height:1.6;color:#3f3f46;">
               Your booking reference is
               <strong style="font-size:18px;letter-spacing:1px;">${esc(booking.reference)}</strong>.
               Here is what you asked for:
             </p>
             ${detailRows([
               ["Pickup", when],
               ["From", data.pickupLocation],
               ["To", data.dropoffLocation],
               ["Vehicle", vehicle],
               ["Passengers", data.passengers],
             ])}
             <p style="margin-top:20px;padding:12px 16px;background:#fff8e1;border-left:4px solid #ffc400;font-size:13px;line-height:1.6;color:#3f3f46;">
               <strong>This is a request, not a confirmed trip.</strong>
               One of our dispatchers will contact you to confirm the vehicle,
               the driver and the fare. If your pickup is within the next two
               hours, please also call us on
               <a href="tel:${esc(site.phoneHref)}">${esc(site.phone)}</a>.
             </p>
             <p style="margin-top:16px;font-size:13px;color:#71717a;">
               Need to change or cancel? Call ${esc(site.phone)} and quote your
               reference.
             </p>`
          ),
          text:
            `Thanks ${data.name.split(" ")[0]}, we've received your booking request.\n\n` +
            `Reference: ${booking.reference}\n` +
            `Pickup: ${when}\nFrom: ${data.pickupLocation}\nTo: ${data.dropoffLocation}\n` +
            `Vehicle: ${vehicle}\nPassengers: ${data.passengers}\n\n` +
            `This is a request, not a confirmed trip — a dispatcher will contact you to confirm.\n` +
            `Questions? Call ${site.phone} and quote your reference.`,
        })
      : Promise.resolve({ sent: false });

  const driverSms = !suspectedBot && smsEnabled()
    ? sendDriverSms(
        `NEW ${booking.reference}: ${when}. ${data.pickupLocation} -> ${data.dropoffLocation}. ` +
          `${vehicle}, ${data.passengers} pax. ${data.name} ${data.phone}`
      )
    : Promise.resolve({ sent: false });

  // Send all three concurrently; none of them may block the response on failure.
  const [operatorResult, , smsResult] = await Promise.all([
    operatorEmail,
    customerEmail,
    driverSms,
  ]);

  // Record what actually went out, so staff can see it in the admin panel.
  try {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { emailSent: operatorResult.sent, smsSent: smsResult.sent },
    });
  } catch {
    // Cosmetic only — the booking itself is already saved.
  }

  return NextResponse.json({
    booking: {
      reference: booking.reference,
      name: booking.name,
      pickupDate: booking.pickupDate,
      pickupTime: booking.pickupTime,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      emailed: operatorResult.sent,
    },
  });
}
