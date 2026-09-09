const tones: Record<string, string> = {
  new: "bg-taxi-500/25 text-taxi-900",
  confirmed: "bg-access-500/15 text-access-700",
  completed: "bg-emerald-500/15 text-emerald-700",
  cancelled: "bg-red-500/15 text-red-700",
  spam: "bg-orange-500/15 text-orange-700",
  read: "bg-night-200 text-night-600",
  replied: "bg-emerald-500/15 text-emerald-700",
  draft: "bg-night-200 text-night-600",
  published: "bg-emerald-500/15 text-emerald-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
        tones[status] ?? "bg-night-200 text-night-600"
      }`}
    >
      {status}
    </span>
  );
}
