import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { detailRows, emailLayout, esc, sendMail } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { site } from "@/lib/site";
import { contactSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`contact:${ip}`, 4, 600); // 4 messages per 10 minutes

  if (!limit.ok) {
    return NextResponse.json(
      {
        message: `Too many messages in a short time. Please wait ${limit.retryAfterSeconds} seconds, or call ${site.phone}.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
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

  // Honeypot — accept silently, store nothing.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const captcha = await verifyRecaptcha(data.recaptchaToken, "contact", ip);
  if (!captcha.ok) {
    return NextResponse.json({ message: captcha.reason }, { status: 400 });
  }

  let enquiry;
  try {
    enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || "General enquiry",
        message: data.message,
      },
    });
  } catch (err) {
    console.error("[contact] failed to save enquiry:", err);
    return NextResponse.json(
      {
        message: `We couldn't save that message. Please email ${site.email} directly.`,
      },
      { status: 500 }
    );
  }

  const result = await sendMail({
    to: process.env.MAIL_TO_ENQUIRIES || site.email,
    replyTo: data.email,
    subject: `Website enquiry: ${data.subject || "General enquiry"} — ${data.name}`,
    html: emailLayout(
      "New website enquiry",
      `${detailRows([
        ["Name", data.name],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Subject", data.subject],
      ])}
       <div style="margin-top:20px;padding:16px;background:#fafafa;border-radius:8px;font-size:14px;line-height:1.6;color:#3f3f46;white-space:pre-wrap;">${esc(
         data.message
       )}</div>`
    ),
    text:
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n` +
      `Subject: ${data.subject}\n\n${data.message}`,
  });

  if (result.sent) {
    try {
      await prisma.enquiry.update({
        where: { id: enquiry.id },
        data: { emailSent: true },
      });
    } catch {
      // Cosmetic only.
    }
  }

  return NextResponse.json({ ok: true });
}
