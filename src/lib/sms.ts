import "server-only";

/**
 * Driver SMS alerts via Twilio.
 *
 * Disabled by default (`ENABLE_SMS=false`). No Twilio SDK is bundled — the
 * REST API is called directly with fetch, so there is no extra dependency to
 * install or keep patched, and the whole feature is inert until you set the
 * four environment variables.
 */

export type SmsResult = { sent: boolean; error?: string };

export function smsEnabled() {
  return (
    process.env.ENABLE_SMS === "true" &&
    Boolean(process.env.TWILIO_ACCOUNT_SID?.trim()) &&
    Boolean(process.env.TWILIO_AUTH_TOKEN?.trim()) &&
    Boolean(process.env.TWILIO_FROM_NUMBER?.trim()) &&
    Boolean(process.env.DRIVER_SMS_NUMBER?.trim())
  );
}

export async function sendDriverSms(body: string): Promise<SmsResult> {
  if (!smsEnabled()) {
    return { sent: false, error: "SMS disabled" };
  }

  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_FROM_NUMBER!;
  const to = process.env.DRIVER_SMS_NUMBER!;

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // Twilio charges per 160-character segment; keep the alert short.
        body: new URLSearchParams({ To: to, From: from, Body: body.slice(0, 480) }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("[sms] Twilio rejected the message:", res.status, detail);
      return { sent: false, error: `Twilio ${res.status}` };
    }

    return { sent: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[sms] send failed:", error);
    return { sent: false, error };
  }
}
