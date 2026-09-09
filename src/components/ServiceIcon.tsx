import type { IconName } from "@/content/services";

/** Line icons for the service cards. One component, one switch, no icon library. */
export function ServiceIcon({
  name,
  className = "size-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const paths: Record<IconName, React.ReactNode> = {
  plane: (
    <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.7.7 0 0 0-.7 1.1l4.4 4.4-2.2 2.2-2.4-.5a.6.6 0 0 0-.6 1l2 2.6 2.6 2a.6.6 0 0 0 1-.6l-.5-2.4 2.2-2.2 4.4 4.4a.7.7 0 0 0 1.1-.7Z" />
  ),
  wheelchair: (
    <>
      <circle cx="14" cy="3.5" r="1.8" />
      <path d="M12 7.5v5.5h5l3.2 6.5" />
      <path d="M16.5 13.5a6.5 6.5 0 1 1-7.4-2.6" />
    </>
  ),
  support: (
    <>
      <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l1.7 1.7L12 21.5l7.1-7.1 1.7-1.7a5 5 0 0 0 0-7.1Z" />
    </>
  ),
  group: (
    <>
      <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
      <circle cx="10" cy="7.5" r="3.5" />
      <path d="M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4" />
      <path d="M15.5 4.2a3.5 3.5 0 0 1 0 6.6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A2.5 2.5 0 0 1 11 3h2a2.5 2.5 0 0 1 2.5 2.5V7" />
      <path d="M2.5 12.5h19" />
      <path d="M10 12.5v2h4v-2" />
    </>
  ),
  grape: (
    <>
      <path d="M12 3v3" />
      <path d="M12 6c2 0 3.5-1 4.5-2.5" />
      <circle cx="9" cy="9.5" r="2.2" />
      <circle cx="15" cy="9.5" r="2.2" />
      <circle cx="12" cy="13.5" r="2.2" />
      <circle cx="7.5" cy="15" r="2.2" />
      <circle cx="16.5" cy="15" r="2.2" />
      <circle cx="12" cy="19" r="2.2" />
    </>
  ),
  school: (
    <>
      <path d="M12 3 2.5 8 12 13l9.5-5L12 3Z" />
      <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
      <path d="M21.5 8v6" />
    </>
  ),
  ship: (
    <>
      <path d="M3 18.5c1.6 0 1.6 1.5 3.2 1.5s1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5 1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5" />
      <path d="M4.5 15.5 6 10h12l1.5 5.5" />
      <path d="M12 10V5" />
      <path d="M9 5h6" />
    </>
  ),
  parcel: (
    <>
      <path d="M21 8.5 12 3.5 3 8.5v7L12 20.5l9-5v-7Z" />
      <path d="M3 8.5 12 13.5l9-5" />
      <path d="M12 13.5v7" />
      <path d="M7.5 6 16.5 11" />
    </>
  ),
};
