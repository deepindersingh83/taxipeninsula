import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { getAdminCounts } from "@/lib/admin-data";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const { saved } = await searchParams;

  const [post, categories, counts] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    getAdminCounts(),
  ]);

  if (!post) notFound();

  return (
    <AdminShell
      user={user}
      title="Edit post"
      description={`Last updated ${formatDateTime(post.updatedAt)}${
        post.viewCount > 0 ? ` · ${post.viewCount} views` : ""
      }`}
      counts={counts}
    >
      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          status: post.status,
          categoryId: post.categoryId,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
        }}
        categories={categories}
        saved={saved === "1"}
      />
    </AdminShell>
  );
}
