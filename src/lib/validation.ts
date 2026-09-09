import { z } from "zod";

import { carTypeValues } from "@/lib/site";

/**
 * Shared schemas. The booking form validates against these in the browser for
 * instant feedback, and the API route validates against the same schemas again
 * — client-side validation is a convenience, never a control.
 */

/** Accepts the shapes Australians actually type: 0412 345 678, +61 412 345 678, (03) 9123 4567. */
const auPhone = z
  .string()
  .trim()
  .min(6, "Please enter a phone number")
  .max(24, "That phone number looks too long")
  .refine((v) => {
    const digits = v.replace(/[^\d]/g, "");
    // 8 digits (landline without area code) through 15 (E.164 maximum).
    return digits.length >= 8 && digits.length <= 15;
  }, "Please enter a valid Australian phone number, e.g. 0412 345 678");

const optionalEmail = z
  .union([z.literal(""), z.string().trim().email("Please check the email address")])
  .optional()
  .transform((v) => (v ? v.toLowerCase() : ""));

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: auPhone,
  email: optionalEmail,

  pickupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a pickup date")
    .refine((v) => {
      // Reject dates in the past, allowing for the customer's own timezone by
      // comparing against yesterday rather than today.
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return new Date(`${v}T00:00:00`) >= new Date(yesterday.toDateString());
    }, "Pickup date cannot be in the past"),

  pickupTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Please choose a pickup time"),

  pickupLocation: z
    .string()
    .trim()
    .min(3, "Where should we pick you up?")
    .max(300),
  dropoffLocation: z
    .string()
    .trim()
    .min(3, "Where are you heading?")
    .max(300),

  carType: z.string().refine((v) => carTypeValues.includes(v), "Please choose a vehicle"),

  passengers: z.coerce
    .number()
    .int("Whole numbers only")
    .min(1, "At least one passenger")
    .max(11, "For more than 11 passengers please call us — we'll arrange multiple vans"),

  wheelchairSeats: z.coerce.number().int().min(0).max(4).default(0),
  luggage: z.string().trim().max(120).default(""),
  flightNumber: z.string().trim().max(40).default(""),
  notes: z.string().trim().max(1500).default(""),

  /**
   * Honeypot. Deliberately NOT constrained here: if the schema rejected a
   * filled-in value, the bot would get a 400 naming this field and simply stop
   * filling it in. Instead the value is allowed through validation and the API
   * route silently discards the submission, so the bot sees a success response
   * and never learns it was caught.
   */
  company: z.string().max(200).optional().default(""),

  recaptchaToken: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please check the email address").max(200),
  phone: z.string().trim().max(24).default(""),
  subject: z.string().trim().max(160).default(""),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more — at least 10 characters")
    .max(3000),
  /** Honeypot — see the note on `bookingSchema.company`. */
  company: z.string().max(200).optional().default(""),
  recaptchaToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const postSchema = z.object({
  title: z.string().trim().min(3, "A title is required").max(200),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "The URL can only contain lowercase letters, numbers and hyphens"
    )
    .max(200),
  excerpt: z.string().trim().max(400).default(""),
  content: z.string().default(""),
  coverImage: z.string().trim().max(500).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  categoryId: z.string().trim().default(""),
  seoTitle: z.string().trim().max(200).default(""),
  seoDescription: z.string().trim().max(300).default(""),
});

export type PostInput = z.infer<typeof postSchema>;

/** Flattens a Zod error into `{ fieldName: "first message" }` for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
