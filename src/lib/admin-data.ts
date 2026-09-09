import "server-only";

import { prisma } from "@/lib/db";

/** Counts shown as badges in the admin sidebar. */
export async function getAdminCounts() {
  const [bookings, enquiries] = await Promise.all([
    prisma.booking.count({ where: { status: "new" } }),
    prisma.enquiry.count({ where: { status: "new" } }),
  ]);
  return { bookings, enquiries };
}

/** Everything the dashboard needs, in one round of queries. */
export async function getDashboardData() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const todayIso = startOfToday.toISOString().slice(0, 10);

  const [
    newBookings,
    weekBookings,
    upcoming,
    recentBookings,
    newEnquiries,
    recentEnquiries,
    publishedPosts,
    draftPosts,
    areaCount,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: "new" } }),
    prisma.booking.count({ where: { createdAt: { gte: weekAgo } } }),
    // Trips scheduled for today or later that have not been completed.
    prisma.booking.count({
      where: {
        pickupDate: { gte: todayIso },
        status: { in: ["new", "confirmed"] },
      },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.enquiry.count({ where: { status: "new" } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.serviceArea.count(),
  ]);

  return {
    stats: {
      newBookings,
      weekBookings,
      upcoming,
      newEnquiries,
      publishedPosts,
      draftPosts,
      areaCount,
    },
    recentBookings,
    recentEnquiries,
  };
}
