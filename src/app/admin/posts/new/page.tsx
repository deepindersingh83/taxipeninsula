import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { getAdminCounts } from "@/lib/admin-data";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [categories, counts] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    getAdminCounts(),
  ]);

  return (
    <AdminShell
      user={user}
      title="Write a new post"
      description="It saves as a draft until you set the status to Published."
      counts={counts}
    >
      <PostEditor categories={categories} />
    </AdminShell>
  );
}
