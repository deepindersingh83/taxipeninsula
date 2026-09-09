"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  authenticate,
  createSession,
  destroySession,
  hashPassword,
  requireUser,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readingMinutes, sanitizePostHtml, toPlainText } from "@/lib/sanitize";
import { toSlug, uniqueSlug } from "@/lib/posts";
import { postSchema } from "@/lib/validation";

/**
 * Server Actions for the admin panel. Every action that touches data calls
 * `requireUser()` first — middleware is a convenience, not the security
 * boundary, and an action can be invoked directly.
 */

export type ActionState = { error?: string; success?: string } | null;

/* -------------------------------------------------------------------- auth */

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email address and password." };
  }

  const user = await authenticate(email, password);
  if (!user) {
    // Deliberately vague: do not reveal whether the email exists.
    return { error: "Those details don't match an account." };
  }

  await createSession(user);

  // Only ever redirect within this site.
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next.length < 10) {
    return { error: "Your new password must be at least 10 characters." };
  }
  if (next !== confirm) {
    return { error: "The two new passwords don't match." };
  }

  const record = await prisma.user.findUnique({ where: { id: user.id } });
  if (!record || !(await verifyPassword(current, record.passwordHash))) {
    return { error: "Your current password is not correct." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) },
  });

  return { success: "Password changed." };
}

/* ------------------------------------------------------------------- posts */

export async function savePostAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();

  const parsed = postSchema.safeParse({
    title,
    // Fall back to a slug derived from the title if the field was left blank.
    slug: rawSlug || toSlug(title),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    categoryId: String(formData.get("categoryId") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const data = parsed.data;

  // Sanitise before storing, not before rendering — that way the database can
  // never hold dangerous markup, whatever renders it later.
  const content = sanitizePostHtml(data.content);
  const slug = await uniqueSlug(data.slug, id || undefined);

  // Auto-generate an excerpt if the author left it blank.
  const excerpt =
    data.excerpt.trim() || toPlainText(content).slice(0, 200).trim();

  const common = {
    title: data.title,
    slug,
    excerpt,
    content,
    coverImage: data.coverImage || null,
    status: data.status,
    categoryId: data.categoryId || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    readingMinutes: readingMinutes(content),
  };

  let postId = id;

  if (id) {
    const existing = await prisma.post.findUnique({
      where: { id },
      select: { publishedAt: true },
    });

    await prisma.post.update({
      where: { id },
      data: {
        ...common,
        // Stamp publishedAt the first time a post goes live, and keep the
        // original date on every later edit.
        publishedAt:
          data.status === "published"
            ? (existing?.publishedAt ?? new Date())
            : existing?.publishedAt,
      },
    });
  } else {
    const created = await prisma.post.create({
      data: {
        ...common,
        authorId: user.id,
        publishedAt: data.status === "published" ? new Date() : null,
      },
    });
    postId = created.id;
  }

  // Refresh the public pages that show this post.
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/posts");

  redirect(`/admin/posts/${postId}?saved=1`);
}

export async function deletePostAction(formData: FormData) {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const post = await prisma.post.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.post.delete({ where: { id } });

  revalidatePath("/blog");
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/posts");

  redirect("/admin/posts");
}

/* -------------------------------------------------------------- categories */

export async function createCategoryAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (name.length < 2) return { error: "Give the category a name." };

  const slug = toSlug(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: "A category with that name already exists." };

  await prisma.category.create({ data: { name, slug, description } });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");

  return { success: `Category "${name}" created.` };
}

export async function deleteCategoryAction(formData: FormData) {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // Posts keep existing; the relation is set to null by the schema.
  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

/* ---------------------------------------------------------------- bookings */

const BOOKING_STATUSES = ["new", "confirmed", "completed", "cancelled"];

export async function updateBookingAction(formData: FormData) {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminNotes = formData.get("adminNotes");

  if (!id) return;

  await prisma.booking.update({
    where: { id },
    data: {
      ...(BOOKING_STATUSES.includes(status) ? { status } : {}),
      ...(adminNotes !== null ? { adminNotes: String(adminNotes).slice(0, 2000) } : {}),
    },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function deleteBookingAction(formData: FormData) {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.booking.delete({ where: { id } });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

/* --------------------------------------------------------------- enquiries */

export async function updateEnquiryAction(formData: FormData) {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["new", "read", "replied"].includes(status)) return;

  await prisma.enquiry.update({ where: { id }, data: { status } });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function deleteEnquiryAction(formData: FormData) {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.enquiry.delete({ where: { id } });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

/* ------------------------------------------------------------ service areas */

export async function saveAreaAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (name.length < 2) return { error: "Give the area a name." };

  const data = {
    name,
    region: String(formData.get("region") ?? "Mornington Peninsula").trim(),
    headline: String(formData.get("headline") ?? "").trim().slice(0, 250),
    description: String(formData.get("description") ?? "").trim(),
    postcodes: String(formData.get("postcodes") ?? "").trim().slice(0, 120),
    travelTime: String(formData.get("travelTime") ?? "").trim().slice(0, 160),
    featured: formData.get("featured") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };

  const slug = toSlug(name);

  if (id) {
    await prisma.serviceArea.update({ where: { id }, data });
  } else {
    const clash = await prisma.serviceArea.findUnique({ where: { slug } });
    if (clash) return { error: "An area with that name already exists." };
    await prisma.serviceArea.create({ data: { ...data, slug } });
  }

  revalidatePath("/areas");
  revalidatePath(`/areas/${slug}`);
  revalidatePath("/admin/areas");

  return { success: `Saved "${name}".` };
}

export async function deleteAreaAction(formData: FormData) {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const area = await prisma.serviceArea.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.serviceArea.delete({ where: { id } });

  revalidatePath("/areas");
  if (area?.slug) revalidatePath(`/areas/${area.slug}`);
  revalidatePath("/admin/areas");
}

/* ------------------------------------------------------------------ upload */

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Saves an uploaded image to /public/uploads and returns its public URL.
 *
 * NOTE: this writes to the local filesystem, which is correct for a normal
 * server. On a read-only or ephemeral filesystem (serverless), swap this for
 * an object-storage upload — the return value is just a URL string, so nothing
 * else in the codebase needs to change.
 */
export async function uploadImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  await requireUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file was selected." };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only JPG, PNG, WebP, GIF and AVIF images can be uploaded." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "That image is larger than 5 MB. Please resize it first." };
  }

  // Build the filename ourselves rather than trusting file.name — a supplied
  // name could contain path separators or a second extension.
  const extension =
    {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
    }[file.type] ?? "bin";

  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
  } catch (err) {
    console.error("[upload] failed to write file:", err);
    return { error: "Could not save the image. Check server write permissions." };
  }

  return { url: `/uploads/${filename}` };
}
