import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAdminCounts } from "@/lib/admin-data";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

const filters = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const { status = "" } = await searchParams;

  const [posts, categories, counts] = await Promise.all([
    prisma.post.findMany({
      where: status ? { status } : undefined,
      orderBy: [{ updatedAt: "desc" }],
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
    getAdminCounts(),
  ]);

  return (
    <AdminShell
      user={user}
      title="Blog posts"
      description={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
      counts={counts}
      actions={
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-night-900 px-5 py-2.5 text-sm font-bold text-taxi-400 transition-colors hover:bg-night-800"
        >
          + Write a new post
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div>
          <nav aria-label="Filter posts" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Link
                key={f.value || "all"}
                href={f.value ? `/admin/posts?status=${f.value}` : "/admin/posts"}
                aria-current={status === f.value ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  status === f.value
                    ? "bg-night-900 text-taxi-400"
                    : "bg-white text-night-600 ring-1 ring-night-200 hover:bg-night-100"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 space-y-3">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-night-300 bg-white p-12 text-center">
                <p className="text-sm text-night-500">
                  No posts yet. Writing one takes about five minutes.
                </p>
                <Link
                  href="/admin/posts/new"
                  className="mt-4 inline-block rounded-full bg-night-900 px-5 py-2.5 text-sm font-bold text-taxi-400"
                >
                  Write the first post
                </Link>
              </div>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="flex items-start gap-4 rounded-2xl border border-night-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-taxi-500 hover:shadow-lift"
                >
                  <div className="grid aspect-[4/3] w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-night-100">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl" aria-hidden="true">🚕</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={post.status} />
                      {post.category && (
                        <span className="rounded-full bg-night-100 px-2.5 py-1 text-[11px] font-bold text-night-600">
                          {post.category.name}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 font-display text-base font-bold text-night-900">
                      {post.title}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-sm text-night-500">
                      {post.excerpt}
                    </p>

                    <p className="mt-2 text-xs text-night-400">
                      {post.publishedAt
                        ? `Published ${formatDateShort(post.publishedAt)}`
                        : "Not published"}
                      {" · "}
                      Updated {formatDateShort(post.updatedAt)}
                      {post.author?.name ? ` · ${post.author.name}` : ""}
                      {post.viewCount > 0 ? ` · ${post.viewCount} views` : ""}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-6">
          <CategoryManager categories={categories} />
        </aside>
      </div>
    </AdminShell>
  );
}
