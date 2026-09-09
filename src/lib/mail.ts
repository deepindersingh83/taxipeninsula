import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

import { site } from "@/lib/site";

/**
 * SMTP transport. Deliberately provider-agnostic: Resend, SendGrid, Postmark,
 * Mailgun, Gmail and cPanel mail all expose SMTP, so switching providers is a
 * matter of changing four environment variables and nothing else.
 *
 * If SMTP_HOST is blank, sending is disabled and every call returns
 * `{ sent: false }` without throwing. Form submissions are always persisted to
 * the database first, so a mail outage never loses a booking.
 */

let cached: Transporter | null = null;

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST?.trim());
}

function transport(): Transporter | null {
  if (!mailConfigured()) return null;
  if (cached) return cached;

  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      : undefined,
  });

  return cached;
}

export type SendResult = { sent: boolean; error?: string };

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  const t = transport();
  if (!t) {
    console.warn(
      `[mail] SMTP_HOST is not set — skipped sending "${opts.subject}" to ${opts.to}`
    );
    return { sent: false, error: "SMTP not configured" };
  }

  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || `${site.name} <no-reply@localhost>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
    });
    return { sent: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[mail] send failed:", error);
    return { sent: false, error };
  }
}

/** Minimal HTML escaping for values interpolated into email templates. */
export function esc(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Shared wrapper so operator and customer emails look consistent. */
export function emailLayout(heading: string, bodyHtml: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
      <tr>
        <td style="background:#111418;padding:20px 24px;">
          <span style="color:#ffc400;font-size:20px;font-weight:700;letter-spacing:-0.02em;">${esc(site.name)}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">${esc(heading)}</h1>
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background:#fafafa;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a;">
          ${esc(site.name)} &middot; ${esc(site.phone)} &middot; ${esc(site.email)}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Renders a label/value table used by both booking emails. */
export function detailRows(rows: Array<[string, string | number | null | undefined]>) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
    ${rows
      .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
      .map(
        ([label, value]) =>
          `<tr>
            <td style="padding:8px 12px 8px 0;color:#71717a;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f4f4f5;">${esc(label)}</td>
            <td style="padding:8px 0;font-weight:600;border-bottom:1px solid #f4f4f5;">${esc(value)}</td>
          </tr>`
      )
      .join("")}
  </table>`;
}
