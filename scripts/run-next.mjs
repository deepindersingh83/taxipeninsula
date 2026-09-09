#!/usr/bin/env node
/**
 * Starts Next.js on a configurable port.
 *
 * Why this exists rather than just `next dev -p 3000`:
 *
 *   1. This box runs several apps side by side (3000, 4000, 5000 …), so the
 *      port has to be an operator setting, not a value baked into package.json.
 *   2. `PORT` written into `.env` — where every other setting for this project
 *      lives — would otherwise be ignored, because npm expands `$PORT` from the
 *      shell long before Next.js ever reads `.env`. That trap is worth 60 lines
 *      of script to avoid.
 *   3. Next.js refuses to start on browser-blocked ports with a terse message.
 *      Catching that here lets us say which port was rejected, why, and what to
 *      use instead.
 *
 * Port is resolved from the first of these that is set:
 *
 *   1. --port / -p on the command line     npm start -- --port 4500
 *   2. the PORT environment variable       PORT=4500 npm start
 *   3. PORT in .env / .env.local           PORT=4500
 *   4. DEFAULT_PORT below                  3000
 *
 * Shell environment beats .env deliberately: managed hosts (cPanel/Passenger,
 * Docker, systemd) assign a port that way and the app must honour it.
 */

import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const DEFAULT_PORT = 3000;

/**
 * Ports Chromium and Firefox refuse to connect to, and which Next.js therefore
 * rejects outright. 6000 (X11) is the one people actually hit.
 * Source: https://chromium.googlesource.com/chromium/src/+/main/net/base/port_util.cc
 */
const BLOCKED_PORTS = new Set([
  1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 69, 77, 79,
  87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135, 137,
  139, 143, 161, 179, 389, 427, 465, 512, 513, 514, 515, 526, 530, 531, 532,
  540, 548, 554, 556, 563, 587, 601, 636, 989, 990, 993, 995, 1719, 1720, 1723,
  2049, 3659, 4045, 4190, 5060, 5061, 6000, 6566, 6665, 6666, 6667, 6668, 6669,
  6679, 6697, 10080,
]);

/** Minimal `.env` reader — we only need PORT, before Next.js boots. */
function portFromEnvFile() {
  // Same precedence Next.js uses: .env.local overrides .env.
  for (const file of [".env.local", ".env"]) {
    const full = path.join(process.cwd(), file);
    if (!existsSync(full)) continue;

    for (const raw of readFileSync(full, "utf8").split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;

      const match = line.match(/^(?:export\s+)?PORT\s*=\s*(.*)$/);
      if (!match) continue;

      // Strip surrounding quotes and any trailing comment.
      const value = match[1]
        .replace(/\s+#.*$/, "")
        .trim()
        .replace(/^["'](.*)["']$/, "$1")
        .trim();

      if (value) return { value, source: file };
    }
  }
  return null;
}

function fail(message) {
  console.error(`\n\x1b[31m✖ ${message}\x1b[0m\n`);
  process.exit(1);
}

/* ------------------------------------------------------------------ resolve */

const args = process.argv.slice(2);
const command = args[0]; // "dev" or "start"

if (command !== "dev" && command !== "start") {
  fail(`Unknown command "${command ?? ""}". Expected "dev" or "start".`);
}

// Anything after the command is passed through to Next untouched.
const passthrough = args.slice(1);

let port;
let source;

// 1. --port / -p on the command line.
const flagIndex = passthrough.findIndex((a) => a === "--port" || a === "-p");
if (flagIndex !== -1) {
  port = passthrough[flagIndex + 1];
  source = "the --port flag";
  passthrough.splice(flagIndex, 2);
} else {
  const inline = passthrough.find((a) => a.startsWith("--port="));
  if (inline) {
    port = inline.split("=")[1];
    source = "the --port flag";
    passthrough.splice(passthrough.indexOf(inline), 1);
  }
}

// 2. Shell environment.
if (!port && process.env.PORT) {
  port = process.env.PORT;
  source = "the PORT environment variable";
}

// 3. .env file.
if (!port) {
  const fromFile = portFromEnvFile();
  if (fromFile) {
    port = fromFile.value;
    source = `PORT in ${fromFile.source}`;
  }
}

// 4. Fall back.
if (!port) {
  port = String(DEFAULT_PORT);
  source = "the default";
}

/* ----------------------------------------------------------------- validate */

const parsed = Number(port);

if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
  fail(
    `Invalid port "${port}" (from ${source}).\n` +
      `  A port must be a whole number between 1 and 65535.`
  );
}

if (BLOCKED_PORTS.has(parsed)) {
  fail(
    `Port ${parsed} cannot be used (set via ${source}).\n\n` +
      `  Chrome and Firefox refuse to open this port — it is on their blocked\n` +
      `  list of well-known service ports — and Next.js rejects it for the same\n` +
      `  reason. A site served there is unreachable in a browser.\n\n` +
      `  Pick another port, for example ${parsed + 1}, 8080 or 8000:\n\n` +
      `    PORT=${parsed + 1} npm run ${command}\n` +
      `    npm run ${command} -- --port ${parsed + 1}\n` +
      `    or set PORT in .env\n`
  );
}

if (parsed < 1024 && process.getuid && process.getuid() !== 0) {
  console.warn(
    `\x1b[33m⚠ Port ${parsed} is privileged — binding it usually needs root.\x1b[0m`
  );
}

/* -------------------------------------------------------------------- start */

console.log(
  `\x1b[2m→ ${command === "dev" ? "Development" : "Production"} server on port ` +
    `${parsed} (from ${source})\x1b[0m`
);

// Pass the port to Next both ways: the flag is what it actually uses, and PORT
// keeps anything else in the process reading the same value.
const child = spawn(
  process.execPath,
  [
    path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next"),
    command,
    "-p",
    String(parsed),
    ...passthrough,
  ],
  { stdio: "inherit", env: { ...process.env, PORT: String(parsed) } }
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

// Forward Ctrl-C and container stop signals so Next shuts down cleanly.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
