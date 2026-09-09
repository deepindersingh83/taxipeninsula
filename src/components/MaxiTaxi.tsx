import { type CSSProperties } from "react";

/**
 * The site's signature illustration: a wheelchair-accessible maxi taxi,
 * drawn entirely in SVG so it stays razor sharp at any size, animates without
 * a single image request, and can be recoloured from the theme.
 *
 * Animation is pure CSS (see globals.css) rather than a JS motion library, so
 * it runs on the compositor, costs nothing on the main thread, and stops dead
 * for anyone with `prefers-reduced-motion: reduce`.
 */

export type MaxiTaxiProps = {
  className?: string;
  /** Seconds per wheel rotation. Lower = faster. */
  wheelSpeed?: number;
  /** Bounce the body as if on suspension. */
  driving?: boolean;
  /** Deploy the rear wheelchair ramp. */
  rampDown?: boolean;
  /** Draw motion streaks trailing behind. */
  streaks?: boolean;
  /** Text shown on the roof sign. Keep it to ~4 characters. */
  roofLabel?: string;
  title?: string;
};

export function MaxiTaxi({
  className = "",
  wheelSpeed = 0.6,
  driving = true,
  rampDown = false,
  streaks = false,
  roofLabel = "TAXI",
  title = "Wheelchair accessible maxi taxi",
}: MaxiTaxiProps) {
  const wheelStyle: CSSProperties = { animationDuration: `${wheelSpeed}s` };

  return (
    <svg
      viewBox="0 0 260 130"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      <defs>
        <linearGradient id="tp-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd63d" />
          <stop offset="55%" stopColor="#ffc400" />
          <stop offset="100%" stopColor="#e0a800" />
        </linearGradient>
        <linearGradient id="tp-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cfe6ff" />
          <stop offset="55%" stopColor="#8ec2f5" />
          <stop offset="100%" stopColor="#5fa3e0" />
        </linearGradient>
        <linearGradient id="tp-tyre" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c333c" />
          <stop offset="100%" stopColor="#12161b" />
        </linearGradient>
        <radialGradient id="tp-headlight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fffef0" />
          <stop offset="100%" stopColor="#ffe57a" />
        </radialGradient>
        <clipPath id="tp-band">
          <rect x="16" y="76" width="215" height="9" />
        </clipPath>
      </defs>

      {/* Motion streaks — drawn first so the vehicle sits on top. */}
      {streaks && (
        <g stroke="#ffc400" strokeLinecap="round" opacity="0.75">
          {[
            { y: 46, w: 26, delay: "0s" },
            { y: 62, w: 38, delay: "0.25s" },
            { y: 78, w: 22, delay: "0.5s" },
          ].map((s) => (
            <line
              key={s.y}
              x1={4}
              y1={s.y}
              x2={4 + s.w}
              y2={s.y}
              strokeWidth="3"
              className="animate-[tp-speed-streak_1.1s_ease-out_infinite]"
              style={{ animationDelay: s.delay }}
            />
          ))}
        </g>
      )}

      {/* Everything that bobs on the suspension. */}
      <g className={driving ? "animate-bob" : undefined}>
        {/* Roof sign */}
        <g className="animate-rooflight">
          <rect x="104" y="14" width="52" height="16" rx="4" fill="#111418" />
          <rect x="107" y="17" width="46" height="10" rx="2.5" fill="#ffc400" />
          <text
            x="130"
            y="25.2"
            textAnchor="middle"
            fontSize="8"
            fontWeight="800"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fill="#111418"
            letterSpacing="0.5"
          >
            {roofLabel}
          </text>
        </g>

        {/* Main body shell */}
        <path
          d="M14 46
             C14 38 19 33 27 33
             L168 33
             C174 33 179 35 183 39
             L212 62
             C220 64 232 66 236 70
             C240 74 241 80 241 86
             C241 92 238 95 232 95
             L20 95
             C15 95 14 92 14 88
             Z"
          fill="url(#tp-body)"
          stroke="#8a6300"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Signature taxi checker band along the flank */}
        <g clipPath="url(#tp-band)">
          <rect x="16" y="76" width="215" height="9" fill="#111418" />
          {Array.from({ length: 25 }).map((_, i) => (
            <rect
              key={i}
              x={16 + i * 9}
              y={i % 2 === 0 ? 76 : 80.5}
              width="9"
              height="4.5"
              fill="#faf9f6"
            />
          ))}
        </g>

        {/* Glass: rear quarter, sliding door, and windscreen */}
        <rect x="24" y="41" width="42" height="27" rx="4" fill="url(#tp-glass)" opacity="0.95" />
        <rect x="72" y="41" width="46" height="27" rx="4" fill="url(#tp-glass)" opacity="0.95" />
        <rect x="124" y="41" width="40" height="27" rx="4" fill="url(#tp-glass)" opacity="0.95" />
        <path
          d="M170 41 L182 41 C185 41 187 42 189 44 L205 58 C206 59 205 61 203 61 L170 61 Z"
          fill="url(#tp-glass)"
          opacity="0.95"
        />

        {/* Glass highlight streak, for a bit of gloss */}
        <path d="M28 44 L44 44 L30 64 L24 64 Z" fill="#ffffff" opacity="0.28" />
        <path d="M128 44 L142 44 L130 64 L124 64 Z" fill="#ffffff" opacity="0.22" />

        {/* Sliding-door seam and handle */}
        <line x1="69" y1="36" x2="69" y2="76" stroke="#b88400" strokeWidth="1.4" />
        <line x1="121" y1="36" x2="121" y2="76" stroke="#b88400" strokeWidth="1.4" />
        <rect x="103" y="70" width="13" height="3" rx="1.5" fill="#8a6300" />

        {/* Wheelchair accessibility roundel — the whole point of the fleet. */}
        <g transform="translate(84 62) scale(0.115)">
          <circle cx="128" cy="128" r="122" fill="#0a84ff" stroke="#ffffff" strokeWidth="14" />
          {/* Head */}
          <circle cx="106" cy="62" r="22" fill="#ffffff" />
          {/* Body + arm reaching to the wheel */}
          <path
            d="M96 96
               C112 92 126 100 129 116
               L136 156
               L182 156
               C193 156 199 164 197 174
               C195 183 187 188 178 188
               L120 188
               C108 188 100 180 98 170
               L88 118
               C86 106 88 99 96 96 Z"
            fill="#ffffff"
          />
          {/* Wheel rim */}
          <path
            d="M96 150 A56 56 0 1 0 186 196"
            fill="none"
            stroke="#ffffff"
            strokeWidth="17"
            strokeLinecap="round"
          />
          {/* Footplate */}
          <path
            d="M150 196 L188 214"
            stroke="#ffffff"
            strokeWidth="17"
            strokeLinecap="round"
          />
        </g>

        {/* Wheelchair-accessible rear ramp. Kept entirely inside the viewBox so
            it is never clipped, whatever size the SVG is rendered at. */}
        {rampDown ? (
          <g>
            <path
              d="M17 87 L2 106 L9 111 L25 93 Z"
              fill="#4c5765"
              stroke="#232a33"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* High-visibility edge marking, as real ramps carry. */}
            <line
              x1="6"
              y1="105"
              x2="19"
              y2="90"
              stroke="#ffc400"
              strokeWidth="1.6"
              strokeDasharray="3 2"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <rect x="12" y="86" width="8" height="6" rx="1.5" fill="#4c5765" />
        )}

        {/* Front lamp + grille */}
        <ellipse cx="233" cy="72" rx="6.5" ry="5" fill="url(#tp-headlight)" />
        <rect x="228" y="82" width="12" height="3" rx="1.5" fill="#343d49" />
        {/* Rear lamp */}
        <rect x="14" y="48" width="4" height="12" rx="1.5" fill="#e0342b" />

        {/* Mirror */}
        <path d="M204 56 L214 52 L214 58 L205 60 Z" fill="#232a33" />

        {/* Front bumper shadow */}
        <path d="M236 90 L241 90 L241 94 L236 94 Z" fill="#8a6300" opacity="0.6" />
      </g>

      {/* Wheels — outside the bobbing group so they stay planted on the road. */}
      {[
        { cx: 62, label: "rear" },
        { cx: 190, label: "front" },
      ].map((w) => (
        <g key={w.label}>
          {/* Arch shadow */}
          <circle cx={w.cx} cy={95} r="20" fill="#0f1216" opacity="0.12" />
          {/* Tyre, then the alloy rim face, then the hub cap. */}
          <circle cx={w.cx} cy={95} r="17" fill="url(#tp-tyre)" />
          <circle cx={w.cx} cy={95} r="10" fill="#e7eaee" />
          <circle cx={w.cx} cy={95} r="9" fill="#cfd6de" />
          {/* Spokes rotate; keeping them in their own group means only this
              small subtree is animated.
              They start outside the hub cap radius so the wheel reads as an
              alloy rim rather than an asterisk. */}
          <g
            className={driving ? "animate-wheel" : undefined}
            style={
              driving
                ? { ...wheelStyle, transformOrigin: `${w.cx}px 95px` }
                : undefined
            }
          >
            {[0, 72, 144, 216, 288].map((deg) => (
              <rect
                key={deg}
                x={w.cx - 0.9}
                y={86}
                width="1.8"
                height="4.6"
                rx="0.9"
                fill="#9aa4b0"
                transform={`rotate(${deg} ${w.cx} 95)`}
              />
            ))}
            {/* Tread marker on the tyre itself, so rotation stays legible even
                when the rim detail is too small to see. */}
            <rect
              x={w.cx - 1.4}
              y={79}
              width="2.8"
              height="4.5"
              rx="1.2"
              fill="#414b57"
            />
          </g>
          {/* Hub cap sits above the spokes and does not rotate. */}
          <circle cx={w.cx} cy={95} r="3.6" fill="#f2f5f8" />
          <circle cx={w.cx} cy={95} r="1.6" fill="#aab3c0" />
        </g>
      ))}
    </svg>
  );
}

/**
 * A strip of road with dashes sliding underneath — pair with <MaxiTaxi /> to
 * sell the illusion that a stationary vehicle is moving.
 *
 * IMPORTANT: the dash track is absolutely positioned. It is far wider than the
 * viewport (that is what makes the loop seamless), and a statically positioned
 * track contributes its full width to the parent's min-content size — which
 * silently blows out any grid or flex column it sits in. Absolute positioning
 * takes it out of intrinsic sizing entirely.
 */
export function RoadStrip({
  className = "",
  tone = "light",
}: {
  className?: string;
  /** "light" = pale track for dark backgrounds; "dark" = grey track for light ones. */
  tone?: "light" | "dark" | "accent";
}) {
  const track = {
    light: "bg-white/10",
    dark: "bg-night-200",
    accent: "bg-white/10",
  }[tone];

  const dash = {
    light: "bg-taxi-500/70",
    dark: "bg-night-400",
    accent: "bg-access-500/60",
  }[tone];

  return (
    <div
      className={`relative h-2 overflow-hidden rounded-full ${track} ${className}`}
      aria-hidden="true"
    >
      <div className="animate-road absolute inset-y-0 left-0 flex w-max items-center gap-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className={`h-[2px] w-12 shrink-0 rounded-full ${dash}`} />
        ))}
      </div>
    </div>
  );
}
