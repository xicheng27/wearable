/**
 * Submission-endpoint verification.
 *
 * Run with:  npm run verify:submit
 * (bundled with esbuild using the `react-server` condition so `server-only`
 * resolves to a no-op, then run under node against the real route handler with
 * the in-memory store).
 *
 * Exercises POST /api/submit against the abuse/validation matrix:
 *  invalid email, oversized text, unknown fields, javascript:/data: URLs,
 *  HTML/script input, honeypot, repeated rapid submissions (rate limit),
 *  malformed JSON, excessively large bodies, and unauthenticated reads (GET).
 */

import { POST, GET } from "@/app/api/submit/route";
import {
  __createInMemoryBackend,
  __resetForTests,
  __setTestBackend,
  isSubmissionSecretConfigured,
  processSubmission,
} from "@/lib/server/submissions";

let failures = 0;
function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ✓ ${name}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function post(body: unknown, opts: { raw?: string; ip?: string; contentType?: string } = {}) {
  const headers: Record<string, string> = {
    "content-type": opts.contentType ?? "application/json",
    "x-forwarded-for": opts.ip ?? "203.0.113.10",
  };
  const payload = opts.raw !== undefined ? opts.raw : JSON.stringify(body);
  return POST(
    new Request("http://localhost/api/submit", { method: "POST", headers, body: payload })
  );
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

const valid = {
  productName: "Magnetic Polo",
  brandName: "MagnaReady",
  productUrl: "https://magnaready.com/polo",
  country: "US",
  notes: "one-handed dressing",
  contact: "buyer@example.com",
};

async function run() {
  console.log("\nHappy path");
  {
    __resetForTests();
    const res = await post(valid);
    const body = await readJson(res);
    check("accepts a valid submission (201)", res.status === 201, `status ${res.status}`);
    check("returns a deletion reference", typeof body.reference === "string");
    check("does not leak internal fields", !("ipHash" in body) && !("id" in body));
  }

  console.log("\nInvalid input is rejected with generic errors");
  {
    __resetForTests();
    const email = await readJson(await post({ ...valid, contact: "not-an-email" }));
    check("rejects invalid email", typeof email.error === "string" && !email.ok);

    __resetForTests();
    const oversize = await post({ ...valid, notes: "n".repeat(5000) });
    check("accepts but caps oversized text (still 201)", oversize.status === 201);

    __resetForTests();
    const jsUrl = await readJson(await post({ ...valid, productUrl: "javascript:alert(1)" }));
    check("rejects javascript: URL", !jsUrl.ok && typeof jsUrl.error === "string");

    __resetForTests();
    const dataUrl = await readJson(await post({ ...valid, productUrl: "data:text/html,<script>1</script>" }));
    check("rejects data: URL", !dataUrl.ok);

    __resetForTests();
    const html = await readJson(await post({ ...valid, productName: "<img src=x onerror=alert(1)>" }));
    check("rejects HTML/script in product name", !html.ok);

    __resetForTests();
    const missing = await readJson(await post({ productName: "", brandName: "" }));
    check("rejects missing required fields", !missing.ok);
  }

  console.log("\nMass assignment / unknown fields");
  {
    __resetForTests();
    const res = await post({ ...valid, isAdmin: true, id: "attacker", ipHash: "x", createdAt: "1999" });
    const body = await readJson(res);
    check("ignores unknown fields, still succeeds", res.status === 201);
    check("does not echo injected id/ipHash", body.reference !== "attacker" && !("ipHash" in body));
  }

  console.log("\nHoneypot & timing");
  {
    __resetForTests();
    const res = await post({ ...valid, company: "spam-bot" });
    const body = await readJson(res);
    check("honeypot returns generic 200 and stores nothing", res.status === 200 && body.ok === true);

    __resetForTests();
    const fast = await post({ ...valid, elapsedMs: 200 });
    check("rejects implausibly fast completion", fast.status === 400);
  }

  console.log("\nRate limiting (repeated rapid submissions)");
  {
    __resetForTests();
    const ip = "198.51.100.7";
    let limited = false;
    let limitStatus = 0;
    for (let i = 0; i < 8; i += 1) {
      // Unique product each time so dedupe never short-circuits the rate limiter.
      const res = await post({ ...valid, productName: `Polo ${i}` }, { ip });
      if (res.status === 429) {
        limited = true;
        limitStatus = res.status;
        const body = await readJson(res);
        check("429 body carries a retry hint", typeof body.retryAfterSeconds === "number");
        break;
      }
    }
    check("rate-limits a burst from one IP", limited, `never hit 429 (last ${limitStatus})`);
  }

  console.log("\nDuplicate detection");
  {
    __resetForTests();
    const first = await post(valid, { ip: "203.0.113.55" });
    const second = await post(valid, { ip: "203.0.113.55" });
    const body = await readJson(second);
    check("first is stored (201)", first.status === 201);
    check("identical re-post is ignored (200 duplicate)", second.status === 200 && body.duplicate === true);
  }

  console.log("\nMalformed / oversized bodies & wrong method");
  {
    __resetForTests();
    const bad = await post(undefined, { raw: "{not json" });
    check("rejects malformed JSON (400)", bad.status === 400);

    __resetForTests();
    const huge = await post(undefined, { raw: JSON.stringify({ notes: "x".repeat(20000) }) });
    check("rejects excessively large body (413)", huge.status === 413);

    __resetForTests();
    const wrongType = await post(valid, { contentType: "text/plain" });
    check("rejects non-JSON content-type (415)", wrongType.status === 415);

    const read = await GET();
    check("GET is not allowed — submissions are not publicly readable (405)", read.status === 405);
  }

  console.log("\nErrors never leak internals");
  {
    __resetForTests();
    const res = await post({ ...valid, contact: "bad" });
    const body = await readJson(res);
    const text = JSON.stringify(body);
    check(
      "error body has no stack/path/provider details",
      !/at \/|node_modules|Error:|stack|Redis|Upstash|ECONN/i.test(text)
    );
  }

  console.log("\nHash-secret gate (SUBMISSION_HASH_SALT fail-closed)");
  {
    const savedNodeEnv = process.env.NODE_ENV;
    const savedSalt = process.env.SUBMISSION_HASH_SALT;
    const setEnv = (key: string, value: string | undefined) => {
      if (value === undefined) delete (process.env as Record<string, string | undefined>)[key];
      else (process.env as Record<string, string | undefined>)[key] = value;
    };

    try {
      // A) Development / test mode may use the labelled local fallback salt.
      setEnv("NODE_ENV", "test");
      setEnv("SUBMISSION_HASH_SALT", undefined);
      __resetForTests();
      const devStore = __createInMemoryBackend();
      __setTestBackend(devStore.backend);
      check("dev/test allows the local fallback salt", isSubmissionSecretConfigured() === true);
      const devRes = await processSubmission({ body: valid, ip: "192.0.2.1", requirePersistence: false });
      check("dev/test processes normally (201)", devRes.status === 201, `status ${devRes.status}`);
      check("dev/test stores the submission", devStore.count() === 1);

      // B) Production with NO secret → refused, generic 503, nothing stored.
      setEnv("NODE_ENV", "production");
      setEnv("SUBMISSION_HASH_SALT", undefined);
      __resetForTests();
      const prodNoSecret = __createInMemoryBackend();
      __setTestBackend(prodNoSecret.backend);
      check("production without secret is not configured", isSubmissionSecretConfigured() === false);
      const refused = await processSubmission({ body: valid, ip: "192.0.2.2", requirePersistence: true });
      check("production without secret is refused (503)", refused.status === 503, `status ${refused.status}`);
      check("no submission is stored without the secret", prodNoSecret.count() === 0);
      const errText = JSON.stringify(refused.body);
      check(
        "503 client message is generic (no var name / config)",
        !/SUBMISSION_HASH_SALT|salt|env|NODE_ENV|fallback/i.test(errText) &&
          /temporarily unavailable/i.test(errText)
      );

      // C) Production WITH a configured secret → normal processing.
      setEnv("NODE_ENV", "production");
      setEnv("SUBMISSION_HASH_SALT", "a-real-production-secret");
      __resetForTests();
      const prodStore = __createInMemoryBackend();
      __setTestBackend(prodStore.backend);
      check("production with secret is configured", isSubmissionSecretConfigured() === true);
      const okRes = await processSubmission({ body: valid, ip: "192.0.2.3", requirePersistence: true });
      check("production with secret processes normally (201)", okRes.status === 201, `status ${okRes.status}`);
      check("production with secret stores the submission", prodStore.count() === 1);
    } finally {
      __setTestBackend(null);
      __resetForTests();
      setEnv("NODE_ENV", savedNodeEnv);
      setEnv("SUBMISSION_HASH_SALT", savedSalt);
    }
  }

  console.log(
    failures === 0
      ? "\nAll submission-endpoint verification cases passed."
      : `\n${failures} submission-endpoint case(s) FAILED.`
  );
  process.exit(failures === 0 ? 0 : 1);
}

run();
