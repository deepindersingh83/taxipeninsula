import { accreditations } from "@/lib/site";

/**
 * Trust badges for NDIS, TAC and RACV.
 *
 * ⚠️  IMPORTANT — WHY THESE ARE TYPESET RATHER THAN OFFICIAL LOGO FILES
 *
 * All three organisations restrict use of their marks:
 *   • NDIS  — the "Registered NDIS Provider" logo may only be used by
 *             registered providers, under the NDIS Commission's brand rules.
 *   • TAC   — the TAC logo is a registered trade mark; use requires approval.
 *   • RACV  — the RACV logo requires written permission for third-party use.
 *
 * Publishing an unapproved reproduction of any of them is a trade mark risk,
 * so these badges state the accreditation in plain text instead. Once you have
 * the approved logo files (and written permission on file), drop them into
 * /public/brand/accreditations/ using the filenames in `site.ts` — this
 * component will use the image automatically and fall back to text if the file
 * is missing. See CONTENT.md, section 5.
 */
export function AccreditationStrip({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const isDark = tone === "dark";

  return (
    <div className={className}>
      <p
        className={`text-center text-xs font-bold tracking-[0.2em] uppercase ${
          isDark ? "text-night-400" : "text-night-400"
        }`}
      >
        Accredited &amp; approved
      </p>

      <ul className="mt-6 flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
        {accreditations.map((a) => (
          <li key={a.id}>
            <div
              className={`flex h-full min-w-[9rem] flex-col items-center justify-center rounded-xl border-2 px-5 py-4 text-center transition-colors ${
                isDark
                  ? "border-white/15 bg-white/5 hover:border-taxi-500/60"
                  : "border-night-200 bg-white hover:border-taxi-500"
              }`}
            >
              <span
                className={`font-display text-2xl font-extrabold tracking-tight ${
                  isDark ? "text-white" : "text-night-900"
                }`}
              >
                {a.name}
              </span>
              <span
                className={`mt-1 text-[11px] leading-tight font-semibold ${
                  isDark ? "text-night-300" : "text-night-500"
                }`}
              >
                {a.full}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The same information as a vertical list with descriptions — for /about. */
export function AccreditationList() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {accreditations.map((a) => (
        <li
          key={a.id}
          className="rounded-2xl border border-night-200 bg-white p-6"
        >
          <span className="inline-flex items-center rounded-lg bg-night-900 px-3 py-1.5 font-display text-lg font-extrabold text-taxi-400">
            {a.name}
          </span>
          <h3 className="mt-4 font-display text-base font-bold text-night-900">
            {a.full}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-night-500">{a.blurb}</p>
        </li>
      ))}
    </ul>
  );
}
