import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { MaxiTaxi, RoadStrip } from "@/components/MaxiTaxi";
import { getSessionUser } from "@/lib/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already signed in? Skip the form.
  if (await getSessionUser()) redirect("/admin");

  const { next } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-night-900 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mx-auto w-40">
          <MaxiTaxi className="h-auto w-full" wheelSpeed={0.6} title="" />
        </div>

        <RoadStrip className="mt-3" />

        <h1 className="mt-8 text-center font-display text-2xl font-extrabold text-white">
          {site.name}
        </h1>
        <p className="mt-1.5 text-center text-sm text-night-400">
          Sign in to manage bookings and the blog
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-night-800 p-6 sm:p-8">
          <LoginForm next={next} />
        </div>

        <p className="mt-6 text-center text-xs text-night-500">
          Locked out? Contact whoever set up the site — an administrator can
          reset your password.
        </p>
      </div>
    </div>
  );
}
