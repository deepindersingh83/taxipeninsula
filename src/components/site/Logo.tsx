import Image from "next/image";

import { site } from "@/lib/site";

/**
 * The supplied logo is a stacked lockup (icon above a two-line wordmark) with
 * generous whitespace, which does not sit well in a 64px-tall header. So:
 *
 *   - `mark`  crops to the taxi-and-arch icon for tight spaces.
 *   - `full`  uses the whole lockup where there is vertical room.
 *
 * The crop is done with a wrapper + object-position rather than by editing the
 * PNG, so replacing /public/brand/logo-dark.png with an updated file is all
 * that is ever needed.
 */
export function Logo({
  variant = "full",
  className = "",
  priority = false,
}: {
  variant?: "full" | "mark";
  className?: string;
  priority?: boolean;
}) {
  if (variant === "mark") {
    // The source PNG is 2000×1367. The arch-and-cab icon occupies roughly the
    // top 72% of that; the "TAXI PENINSULA" wordmark and the checker blocks sit
    // below it. Cropping to a 2000×985 window (aspect ≈ 2.03) keeps the icon
    // and drops the wordmark, which the adjacent text already provides.
    return (
      <span
        className={`relative block overflow-hidden ${className}`}
        style={{ aspectRatio: "2000 / 985" }}
      >
        <Image
          src={site.logo.src}
          alt=""
          fill
          sizes="64px"
          priority={priority}
          className="object-cover object-top"
        />
      </span>
    );
  }

  return (
    <Image
      src={site.logo.src}
      alt={site.logo.alt}
      width={site.logo.width}
      height={site.logo.height}
      priority={priority}
      className={className}
      sizes="(max-width: 640px) 160px, 220px"
    />
  );
}
