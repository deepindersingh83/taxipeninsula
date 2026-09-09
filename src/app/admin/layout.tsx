import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — Taxi Peninsula",
    template: "%s | Taxi Peninsula Admin",
  },
  // The admin panel must never be indexed.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-night-50">{children}</div>;
}
