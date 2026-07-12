import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { validateSubmission } from "@/lib/security/submission";

/**
 * Server-side handling of product-suggestion submissions.
 *
 * Storage: Upstash Redis (provisioned via Vercel KV or the Upstash
 * integration). Each suggestion is written under `submission:<id>` with a TTL
 * so it auto-expires after the retention window, and its id is pushed onto a
 * capped `submissions:index` list the site owner can enumerate from the Upstash
 * console. There is deliberately NO public read path (see the route: GET → 405).
 *
 * Privacy: we store the product fields the person typed, a server timestamp and
 * a SALTED HASH of the IP (for rate-limiting / dedupe only — never the raw IP),
 * and nothing else (no user agent, no cookies). Nothing here is logged in full;
 * see `logEvent`.
 *
 * This module is `server-only`, so it can never be pulled into a client bundle.
 */

export const RETENTION_DAYS = 180;
const RETENTION_SECONDS = RETENTION_DAYS * 24 * 60 * 60;

/** Rate limit: at most this many accepted POSTs per window, per IP hash. */
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 600; // 10 minutes
const DEDUPE_TTL_SECONDS = 30 * 24 * 60 * 60; // ignore identical re-posts for 30 days
const INDEX_CAP = 5000;

/**
 * Clearly-labelled, development-only fallback salt. It is INSECURE and is only
 * ever used outside production so local dev / tests work without configuration.
 * Production must supply a real `SUBMISSION_HASH_SALT` (we fail closed if not).
 */
const DEV_ONLY_INSECURE_SALT = "xis-dev-only-insecure-salt";

/**
 * Resolve the IP-hash salt at call time (never at module load, so `next build`
 * never throws just because the production secret is absent at build time):
 *   • configured `SUBMISSION_HASH_SALT` → use it;
 *   • outside production → a labelled dev-only fallback;
 *   • production with no secret → `null` (fail closed — callers must refuse).
 */
export function resolveHashSalt(): string | null {
  const configured = process.env.SUBMISSION_HASH_SALT?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return DEV_ONLY_INSECURE_SALT;
  return null;
}

/** True when a usable salt exists (configured, or the dev fallback is allowed). */
export function isSubmissionSecretConfigured(): boolean {
  return resolveHashSalt() !== null;
}

/**
 * Salted SHA-256, hex — used so we never persist a raw IP. Throws if no salt is
 * available; callers gate on {@link isSubmissionSecretConfigured} first, so in
 * production a missing secret becomes a 503 before this is ever reached (we
 * never hash/store an IP with a public fallback in production).
 */
export function hashValue(input: string): string {
  const salt = resolveHashSalt();
  if (salt === null) throw new Error("submission secret unavailable");
  return createHash("sha256").update(`${salt}:${input}`).digest("hex");
}

export interface CleanSubmissionRecord {
  id: string;
  productName: string;
  brandName: string;
  productUrl: string;
  country: string;
  notes: string;
  contact: string;
  createdAt: string;
  ipHash: string;
}

/* -------------------------------------------------------------------------- */
/*  Storage / rate-limit backends                                             */
/* -------------------------------------------------------------------------- */

interface Backend {
  /** Returns false when the caller has exceeded the limit. */
  rateLimit(ipHash: string): Promise<{ success: boolean; retryAfterSeconds: number }>;
  /** Marks a fingerprint as seen; returns true if it was ALREADY seen. */
  seenFingerprint(fingerprint: string): Promise<boolean>;
  save(record: CleanSubmissionRecord): Promise<void>;
}

let redisClient: Redis | null | undefined;

/** Lazily build a Redis client from Vercel KV or Upstash env vars, or null. */
function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

/** True when a real, persistent store is configured (or injected in tests). */
export function isPersistenceConfigured(): boolean {
  return testBackend !== null || getRedis() !== null;
}

class UpstashBackend implements Backend {
  private limiter: Ratelimit;
  constructor(private redis: Redis) {
    this.limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT, `${RATE_WINDOW_SECONDS} s`),
      prefix: "xis:submit:rl",
    });
  }
  async rateLimit(ipHash: string) {
    const res = await this.limiter.limit(ipHash);
    return {
      success: res.success,
      retryAfterSeconds: Math.max(0, Math.ceil((res.reset - Date.now()) / 1000)),
    };
  }
  async seenFingerprint(fingerprint: string) {
    // SET NX: returns "OK" when newly set, null when it already existed.
    const set = await this.redis.set(`xis:submit:fp:${fingerprint}`, 1, {
      nx: true,
      ex: DEDUPE_TTL_SECONDS,
    });
    return set === null;
  }
  async save(record: CleanSubmissionRecord) {
    await this.redis.set(`submission:${record.id}`, JSON.stringify(record), {
      ex: RETENTION_SECONDS,
    });
    await this.redis.lpush("submissions:index", record.id);
    await this.redis.ltrim("submissions:index", 0, INDEX_CAP - 1);
  }
}

/**
 * In-memory fallback for local dev / tests only. Per-instance and ephemeral, so
 * it is NOT used to accept submissions in production (the route returns 503 when
 * no real store is configured in production).
 */
class InMemoryBackend implements Backend {
  private hits = new Map<string, number[]>();
  private fingerprints = new Map<string, number>();
  private records: CleanSubmissionRecord[] = [];

  async rateLimit(ipHash: string) {
    const now = Date.now();
    const windowMs = RATE_WINDOW_SECONDS * 1000;
    const recent = (this.hits.get(ipHash) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= RATE_LIMIT) {
      const retryAfterSeconds = Math.ceil((recent[0] + windowMs - now) / 1000);
      this.hits.set(ipHash, recent);
      return { success: false, retryAfterSeconds };
    }
    recent.push(now);
    this.hits.set(ipHash, recent);
    return { success: true, retryAfterSeconds: 0 };
  }
  async seenFingerprint(fingerprint: string) {
    const now = Date.now();
    const prev = this.fingerprints.get(fingerprint);
    if (prev && now - prev < DEDUPE_TTL_SECONDS * 1000) return true;
    this.fingerprints.set(fingerprint, now);
    return false;
  }
  async save(record: CleanSubmissionRecord) {
    this.records.push(record);
  }
  /** Test helper. */
  __count() {
    return this.records.length;
  }
}

let backend: Backend | null | undefined;
let inMemory: InMemoryBackend | null = null;
let testBackend: Backend | null = null;

function getBackend(): Backend {
  if (testBackend) return testBackend;
  if (backend) return backend;
  const redis = getRedis();
  if (redis) {
    backend = new UpstashBackend(redis);
  } else {
    inMemory = new InMemoryBackend();
    backend = inMemory;
  }
  return backend;
}

/** Reset in-memory state between tests. No effect on Redis. */
export function __resetForTests() {
  redisClient = undefined;
  backend = undefined;
  inMemory = null;
  testBackend = null;
}

/** Inject an in-memory store for tests (also satisfies persistence checks). */
export function __setTestBackend(b: Backend | null) {
  testBackend = b;
}

/** Build a fresh in-memory store plus a count accessor, for tests. */
export function __createInMemoryBackend(): { backend: Backend; count: () => number } {
  const b = new InMemoryBackend();
  return { backend: b, count: () => b.__count() };
}

/* -------------------------------------------------------------------------- */
/*  Logging (redacted)                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Structured, redacted logging. Only coarse, non-identifying facts are ever
 * logged — never the submission body, email, notes, raw IP, or headers.
 */
export function logEvent(event: string, meta: Record<string, string | number | boolean> = {}) {
  // eslint-disable-next-line no-console
  console.info(JSON.stringify({ scope: "submit", event, ...meta }));
}

export function logError(event: string, error: unknown) {
  const message = error instanceof Error ? error.name : "unknown";
  // Log only the error class, never the message/stack (may contain internals).
  // eslint-disable-next-line no-console
  console.error(JSON.stringify({ scope: "submit", event, error: message }));
}

/* -------------------------------------------------------------------------- */
/*  Orchestration                                                             */
/* -------------------------------------------------------------------------- */

export interface ProcessResult {
  status: number;
  body: Record<string, unknown>;
}

/** Generic, non-leaking client message for unexpected failures. */
const GENERIC_ERROR = "Something went wrong. Please try again.";

export interface ProcessInput {
  body: unknown;
  /** Raw client IP — hashed internally (never stored raw), only after the salt gate. */
  ip: string;
  /** true in production so a missing secret / store is refused (fail closed). */
  requirePersistence: boolean;
}

/**
 * Validate + rate-limit + de-duplicate + store one submission. Returns a status
 * code and a body safe to send to the client (no internals ever leak).
 */
export async function processSubmission(input: ProcessInput): Promise<ProcessResult> {
  const { body, ip, requirePersistence } = input;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { status: 400, body: { error: "Invalid request." } };
  }
  const record = body as Record<string, unknown>;

  // Honeypot: a hidden field only bots fill. Pretend success so we don't teach
  // the bot what tripped it, but store nothing. (No hashing/storage happens.)
  if (typeof record.company === "string" && record.company.trim() !== "") {
    logEvent("honeypot_rejected");
    return { status: 200, body: { ok: true } };
  }

  // Minimum completion time (best-effort bot signal from the client).
  const elapsedMs = typeof record.elapsedMs === "number" ? record.elapsedMs : 0;
  if (elapsedMs > 0 && elapsedMs < 1500) {
    return { status: 400, body: { error: "Please take a moment, then submit again." } };
  }

  // FAIL CLOSED: in production we must never hash or store an IP with the
  // public dev fallback salt. If the secret is absent, refuse before any
  // hashing happens. The client sees only a generic 503; the log is redacted
  // and never names the missing variable.
  if (requirePersistence && !isSubmissionSecretConfigured()) {
    logError("hash_secret_unconfigured", new Error("secret unavailable"));
    return {
      status: 503,
      body: { error: "Submissions are temporarily unavailable. Please try again later." },
    };
  }

  // Safe to hash now (salt is guaranteed present).
  const ipHash = hashValue(ip);
  const store = getBackend();

  // Rate limit BEFORE doing any real work.
  const rl = await store.rateLimit(ipHash);
  if (!rl.success) {
    logEvent("rate_limited", { retryAfterSeconds: rl.retryAfterSeconds });
    return {
      status: 429,
      body: {
        error: `You've sent a few suggestions already. Please try again in about ${Math.max(
          1,
          Math.ceil(rl.retryAfterSeconds / 60)
        )} minute(s).`,
        retryAfterSeconds: rl.retryAfterSeconds,
      },
    };
  }

  // Validate + normalise (explicit fields only, caps, safe URL, email, no HTML).
  const validated = validateSubmission(record);
  if (!validated.ok) {
    return { status: 400, body: { error: validated.error } };
  }
  const clean = validated.value;

  // Refuse to silently drop data in production when no real store is set up.
  if (requirePersistence && !isPersistenceConfigured()) {
    logError("persistence_unconfigured", new Error("no store"));
    return { status: 503, body: { error: "Submissions are temporarily unavailable. Please try again later." } };
  }

  // Duplicate detection (same product + brand + url).
  const fingerprint = hashValue(
    `${clean.productName.toLowerCase()}|${clean.brandName.toLowerCase()}|${clean.productUrl}`
  );
  if (await store.seenFingerprint(fingerprint)) {
    logEvent("duplicate_ignored");
    return { status: 200, body: { ok: true, duplicate: true } };
  }

  const id = randomUUID();
  const stored: CleanSubmissionRecord = {
    id,
    ...clean,
    createdAt: new Date().toISOString(),
    ipHash,
  };

  try {
    await store.save(stored);
  } catch (error) {
    logError("store_failed", error);
    return { status: 500, body: { error: GENERIC_ERROR } };
  }

  logEvent("stored", { hasContact: Boolean(clean.contact) });
  // Return a short reference the person can quote to request deletion.
  return { status: 201, body: { ok: true, reference: id.slice(0, 8) } };
}
