import "server-only";

import slugify from "slugify";

import { prisma } from "@/lib/db";

/**
 * Read helpers for the blog. Every public query filters on
 * `status: "published"` AND a `publishedAt` in the past, so a draft can never
 * leak onto the live site even if someone guesses its URL.
 */

const publishedWhere = () => ({
  status: "published",
  publishedAt: { not: null, lte: new Date() },
});

const listSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
  readingMinutes: true,
  category: { select: { name: true, slug: true } },
  author: { select: { name: true } },
} as const;

export async function getPublishedPosts({
  take,
  skip = 0,
  categorySlug,
}: {
  take?: number;
  skip?: number;
  categorySlug?: string;
} = {}) {
  return prisma.post.findMany({
    where: {
      ...publishedWhere(),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    select: listSelect,
    take,
    skip,
  });
}

export async function countPublishedPosts(categorySlug?: string) {
  return prisma.post.count({
    where: {
      ...publishedWhere(),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, ...publishedWhere() },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true } },
    },
  });
}

/** Posts to show under an article — same category first, newest otherwise. */
export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  take = 3
) {
  const sameCategory = categoryId
    ? await prisma.post.findMany({
        where: { ...publishedWhere(), categoryId, id: { not: postId } },
        orderBy: { publishedAt: "desc" },
        select: listSelect,
        take,
      })
    : [];

  if (sameCategory.length >= take) return sameCategory;

  // Top up with the most recent posts that are not already in the list.
  const exclude = [postId, ...sameCategory.map((p) => p.id)];
  const filler = await prisma.post.findMany({
    where: { ...publishedWhere(), id: { notIn: exclude } },
    orderBy: { publishedAt: "desc" },
    select: listSelect,
    take: take - sameCategory.length,
  });

  return [...sameCategory, ...filler];
}

export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { posts: { where: publishedWhere() } } },
    },
  });
  // Hide categories that have nothing published in them.
  return categories.filter((c) => c._count.posts > 0);
}

/** Slugs for `generateStaticParams`. */
export async function getAllPublishedSlugs() {
  const posts = await prisma.post.findMany({
    where: publishedWhere(),
    select: { slug: true, updatedAt: true },
  });
  return posts;
}

/** Records a view. Failures are swallowed — a counter is not worth a 500. */
export async function incrementViewCount(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Non-critical.
  }
}

/** URL-safe slug from a title. */
export function toSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true }).slice(0, 90);
}

/**
 * Returns a slug that is not already taken, appending -2, -3 … as needed.
 * `ignoreId` lets an existing post keep its own slug while being edited.
 */
export async function uniqueSlug(base: string, ignoreId?: string) {
  const root = toSlug(base) || "post";
  let candidate = root;
  let n = 1;

  // Bounded so a pathological case cannot spin forever.
  while (n < 100) {
    const clash = await prisma.post.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!clash || clash.id === ignoreId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }

  return `${root}-${Date.now()}`;
}
