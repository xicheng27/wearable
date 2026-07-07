/**
 * Image reliability guard.
 *
 * Every product image is served through next/image, which only loads remote
 * hosts explicitly allow-listed in next.config.mjs `images.remotePatterns`.
 * If a catalog sync ever introduces an imageUrl on a host that is NOT
 * allow-listed, next/image refuses it and the shopper silently sees the
 * category fallback instead of the real product photo — in production, not
 * just locally. Local ("/...") images must likewise exist on disk.
 *
 * This script fails the build/test when either invariant is broken, so the
 * problem is caught in development rather than by users. Run: node
 * scripts/audit-image-hosts.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "data");
const PUBLIC_DIR = join(ROOT, "public");

/** Allow-listed remote hosts from next.config.mjs. */
function allowedHosts() {
  const cfg = readFileSync(join(ROOT, "next.config.mjs"), "utf8");
  const hosts = new Set();
  for (const m of cfg.matchAll(/hostname:\s*"([^"]+)"/g)) hosts.add(m[1]);
  return hosts;
}

/** Every imageUrl string across the data catalog (quoted or unquoted key). */
function collectImageUrls() {
  const urls = [];
  for (const file of readdirSync(DATA_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const text = readFileSync(join(DATA_DIR, file), "utf8");
    // `\s*` spans newlines so multi-line `imageUrl:\n  "..."` is captured too.
    for (const m of text.matchAll(/"?imageUrl"?\s*:\s*"([^"]*)"/g)) {
      urls.push({ file, value: m[1] });
    }
  }
  return urls;
}

const allowed = allowedHosts();
const urls = collectImageUrls();

const remoteViolations = [];
const missingLocal = [];
let remoteOk = 0;
let localOk = 0;
let emptyCount = 0;
const hostCounts = new Map();

for (const { file, value } of urls) {
  if (!value) {
    emptyCount++;
    continue;
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    let host;
    try {
      host = new URL(value).hostname;
    } catch {
      remoteViolations.push({ file, value, reason: "unparseable URL" });
      continue;
    }
    hostCounts.set(host, (hostCounts.get(host) ?? 0) + 1);
    if (allowed.has(host)) remoteOk++;
    else remoteViolations.push({ file, value, reason: `host "${host}" not in next.config allow-list` });
  } else if (value.startsWith("/")) {
    const abs = resolve(PUBLIC_DIR, "." + value);
    if (existsSync(abs)) localOk++;
    else missingLocal.push({ file, value });
  } else {
    remoteViolations.push({ file, value, reason: "not an http(s) or root-relative path" });
  }
}

console.log("Image reliability audit");
console.log("-----------------------");
console.log(`Allow-listed hosts (${allowed.size}): ${[...allowed].sort().join(", ")}`);
console.log(`Image URLs scanned: ${urls.length}`);
console.log(`  remote OK: ${remoteOk}`);
console.log(`  local OK: ${localOk}`);
console.log(`  empty (intentional category fallback): ${emptyCount}`);
console.log("Remote hosts in catalogue:");
for (const [host, n] of [...hostCounts].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${allowed.has(host) ? "✓" : "✗"} ${host} (${n})`);
}

let failures = 0;
if (remoteViolations.length) {
  failures += remoteViolations.length;
  console.log(`\n✗ ${remoteViolations.length} remote image host violation(s):`);
  for (const v of remoteViolations.slice(0, 20)) {
    console.log(`  [${v.file}] ${v.reason}: ${v.value.slice(0, 90)}`);
  }
  if (remoteViolations.length > 20) console.log(`  …and ${remoteViolations.length - 20} more`);
}
if (missingLocal.length) {
  failures += missingLocal.length;
  console.log(`\n✗ ${missingLocal.length} local image file(s) missing from public/:`);
  for (const v of missingLocal.slice(0, 20)) console.log(`  [${v.file}] ${v.value}`);
  if (missingLocal.length > 20) console.log(`  …and ${missingLocal.length - 20} more`);
}

if (failures === 0) {
  console.log("\nAll product images are servable: every remote host is allow-listed and every local file exists.");
  process.exit(0);
} else {
  console.log(`\n${failures} image reliability issue(s) found. Add the host to next.config.mjs images.remotePatterns, or fix the imageUrl.`);
  process.exit(1);
}
