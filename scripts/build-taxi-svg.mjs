#!/usr/bin/env node
/**
 * Generates the maxi taxi artwork into public/brand/ as standalone SVG files.
 *
 * WHY THESE ARE FILES AND NOT AN INLINE REACT COMPONENT
 *
 * The taxi appears up to a dozen times on a page. Inlined, each copy cost about
 * 6 KB of markup — and React serialises the tree a second time into the RSC
 * payload, so it was closer to 12 KB each. The home page was 310 KB of HTML and
 * the services page 448 KB, roughly half of it the same vehicle over and over.
 *
 * As files, the browser fetches one ~4 KB SVG, caches it, and every further
 * instance costs one `<img>` tag. CSS animations declared inside an SVG still
 * run when it is loaded through `<img>`, and the `prefers-reduced-motion` query
 * inside it still honours the viewer's system setting — so nothing about the
 * behaviour changes.
 *
 * Run after editing the artwork:
 *   npm run build:taxi
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "brand");

/* ------------------------------------------------------------------ pieces */

const defs = `
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffd63d"/>
      <stop offset="55%" stop-color="#ffc400"/>
      <stop offset="100%" stop-color="#e0a800"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#cfe6ff"/>
      <stop offset="55%" stop-color="#8ec2f5"/>
      <stop offset="100%" stop-color="#5fa3e0"/>
    </linearGradient>
    <linearGradient id="tyre" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2c333c"/>
      <stop offset="100%" stop-color="#12161b"/>
    </linearGradient>
    <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#fffef0"/>
      <stop offset="100%" stop-color="#ffe57a"/>
    </radialGradient>
    <pattern id="checker" x="16" y="76" width="18" height="9" patternUnits="userSpaceOnUse">
      <rect width="18" height="9" fill="#111418"/>
      <rect width="9" height="4.5" fill="#faf9f6"/>
      <rect x="9" y="4.5" width="9" height="4.5" fill="#faf9f6"/>
    </pattern>
  </defs>`;

// SVG is XML, so stylesheet content must be CDATA-wrapped — otherwise any "<"
// or "&" inside the CSS (including in a comment) is parsed as markup.
const style = `
  <style><![CDATA[
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes bob {
      0%,100% { transform: translateY(0); }
      25%     { transform: translateY(-1.5px); }
      75%     { transform: translateY(1.5px); }
    }
    @keyframes rooflight {
      0%,100% { opacity: 1; }
      50%     { opacity: 0.55; }
    }
    @keyframes streak {
      0%   { opacity: 0; transform: translateX(12px) scaleX(0.4); }
      40%  { opacity: 0.8; }
      100% { opacity: 0; transform: translateX(-70px) scaleX(1.4); }
    }
    .bob   { animation: bob 1.1s ease-in-out infinite; }
    .roof  { animation: rooflight 1.8s ease-in-out infinite; }
    .wheel { transform-box: view-box; animation: spin 0.6s linear infinite; }
    .wheel-r { transform-origin: 62px 95px; }
    .wheel-f { transform-origin: 190px 95px; }
    .streak { animation: streak 1.1s ease-out infinite; }
    .streak-2 { animation-delay: 0.25s; }
    .streak-3 { animation-delay: 0.5s; }

    /* The viewer's own system setting still applies to an embedded SVG. */
    @media (prefers-reduced-motion: reduce) {
      .bob, .roof, .wheel, .streak {
        animation: none !important;
      }
    }
  ]]></style>`;

const streaksMarkup = `
  <g stroke="#ffc400" stroke-linecap="round" opacity="0.75" stroke-width="3">
    <line class="streak" x1="4" y1="46" x2="30" y2="46"/>
    <line class="streak streak-2" x1="4" y1="62" x2="42" y2="62"/>
    <line class="streak streak-3" x1="4" y1="78" x2="26" y2="78"/>
  </g>`;

const rampDownMarkup = `
    <g>
      <path d="M17 87 L2 106 L9 111 L25 93 Z" fill="#4c5765" stroke="#232a33" stroke-width="1.2" stroke-linejoin="round"/>
      <line x1="6" y1="105" x2="19" y2="90" stroke="#ffc400" stroke-width="1.6" stroke-dasharray="3 2" stroke-linecap="round"/>
    </g>`;

const rampUpMarkup = `    <rect x="12" y="86" width="8" height="6" rx="1.5" fill="#4c5765"/>`;

const wheel = (cx, cls) => `
  <g>
    <circle cx="${cx}" cy="95" r="20" fill="#0f1216" opacity="0.12"/>
    <circle cx="${cx}" cy="95" r="17" fill="url(#tyre)"/>
    <circle cx="${cx}" cy="95" r="10" fill="#e7eaee"/>
    <circle cx="${cx}" cy="95" r="9" fill="#cfd6de"/>
    <g class="wheel ${cls}">
      ${[0, 72, 144, 216, 288]
        .map(
          (deg) =>
            `<rect x="${cx - 0.9}" y="86" width="1.8" height="4.6" rx="0.9" fill="#9aa4b0" transform="rotate(${deg} ${cx} 95)"/>`
        )
        .join("\n      ")}
      <rect x="${cx - 1.4}" y="79" width="2.8" height="4.5" rx="1.2" fill="#414b57"/>
    </g>
    <circle cx="${cx}" cy="95" r="3.6" fill="#f2f5f8"/>
    <circle cx="${cx}" cy="95" r="1.6" fill="#aab3c0"/>
  </g>`;

function build({ rampDown, streaks }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 130" width="260" height="130" role="img">
  <title>Wheelchair accessible maxi taxi</title>${defs}${style}
${streaks ? streaksMarkup : ""}
  <g class="bob">
    <g class="roof">
      <rect x="104" y="14" width="52" height="16" rx="4" fill="#111418"/>
      <rect x="107" y="17" width="46" height="10" rx="2.5" fill="#ffc400"/>
      <text x="130" y="25.2" text-anchor="middle" font-size="8" font-weight="800" font-family="ui-sans-serif, system-ui, sans-serif" fill="#111418" letter-spacing="0.5">TAXI</text>
    </g>
    <path d="M14 46 C14 38 19 33 27 33 L168 33 C174 33 179 35 183 39 L212 62 C220 64 232 66 236 70 C240 74 241 80 241 86 C241 92 238 95 232 95 L20 95 C15 95 14 92 14 88 Z" fill="url(#body)" stroke="#8a6300" stroke-width="1.6" stroke-linejoin="round"/>
    <rect x="16" y="76" width="215" height="9" fill="url(#checker)"/>
    <rect x="24" y="41" width="42" height="27" rx="4" fill="url(#glass)" opacity="0.95"/>
    <rect x="72" y="41" width="46" height="27" rx="4" fill="url(#glass)" opacity="0.95"/>
    <rect x="124" y="41" width="40" height="27" rx="4" fill="url(#glass)" opacity="0.95"/>
    <path d="M170 41 L182 41 C185 41 187 42 189 44 L205 58 C206 59 205 61 203 61 L170 61 Z" fill="url(#glass)" opacity="0.95"/>
    <path d="M28 44 L44 44 L30 64 L24 64 Z" fill="#ffffff" opacity="0.28"/>
    <path d="M128 44 L142 44 L130 64 L124 64 Z" fill="#ffffff" opacity="0.22"/>
    <line x1="69" y1="36" x2="69" y2="76" stroke="#b88400" stroke-width="1.4"/>
    <line x1="121" y1="36" x2="121" y2="76" stroke="#b88400" stroke-width="1.4"/>
    <rect x="103" y="70" width="13" height="3" rx="1.5" fill="#8a6300"/>
    <g transform="translate(84 62) scale(0.115)">
      <circle cx="128" cy="128" r="122" fill="#0a84ff" stroke="#ffffff" stroke-width="14"/>
      <circle cx="106" cy="62" r="22" fill="#ffffff"/>
      <path d="M96 96 C112 92 126 100 129 116 L136 156 L182 156 C193 156 199 164 197 174 C195 183 187 188 178 188 L120 188 C108 188 100 180 98 170 L88 118 C86 106 88 99 96 96 Z" fill="#ffffff"/>
      <path d="M96 150 A56 56 0 1 0 186 196" fill="none" stroke="#ffffff" stroke-width="17" stroke-linecap="round"/>
      <path d="M150 196 L188 214" stroke="#ffffff" stroke-width="17" stroke-linecap="round"/>
    </g>
${rampDown ? rampDownMarkup : rampUpMarkup}
    <ellipse cx="233" cy="72" rx="6.5" ry="5" fill="url(#lamp)"/>
    <rect x="228" y="82" width="12" height="3" rx="1.5" fill="#343d49"/>
    <rect x="14" y="48" width="4" height="12" rx="1.5" fill="#e0342b"/>
    <path d="M204 56 L214 52 L214 58 L205 60 Z" fill="#232a33"/>
    <path d="M236 90 L241 90 L241 94 L236 94 Z" fill="#8a6300" opacity="0.6"/>
  </g>${wheel(62, "wheel-r")}${wheel(190, "wheel-f")}
</svg>
`;
}

const variants = [
  { file: "taxi.svg", rampDown: false, streaks: false },
  { file: "taxi-ramp.svg", rampDown: true, streaks: false },
  { file: "taxi-streaks.svg", rampDown: false, streaks: true },
  { file: "taxi-ramp-streaks.svg", rampDown: true, streaks: true },
];

await mkdir(OUT_DIR, { recursive: true });

for (const v of variants) {
  const svg = build(v);
  await writeFile(path.join(OUT_DIR, v.file), svg, "utf8");
  console.log(`  ${v.file.padEnd(24)} ${(svg.length / 1024).toFixed(1)} KB`);
}

console.log(`\nWrote ${variants.length} variants to public/brand/`);
