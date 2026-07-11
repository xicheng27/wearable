import "server-only";

import {
  hashValue,
  logError,
  processSubmission,
} from "@/lib/server/submissions";

/**
 * POST /api/submit — receive one product suggestion.
 *
 * Protections: POST-only (GET → 405, so submissions are never publicly
 * readable), JSON content-type required, hard request-body size cap, safe JSON
 * parsing, honeypot + rate limiting + duplicate detection, generic error
 * messages (no stack traces / internals), and redacted server logs.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 8 KB is far more than the form needs; anything larger is rejected. */
const MAX_BODY_BYTES = 8 * 1024;

function json(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status });
}

/** First hop of X-Forwarded-For, or a fallback. Only ever hashed, never stored raw. */
function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "0.0.0.0";
}

export async function POST(req: Request): Promise<Response> {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return json(415, { error: "Unsupported media type." });
    }

    // Reject oversized bodies by declared length up front...
    const declared = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return json(413, { error: "Request too large." });
    }

    // ...and by actual read size (content-length can lie or be absent).
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) {
      return json(413, { error: "Request too large." });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return json(400, { error: "Invalid request." });
    }

    const ipHash = hashValue(clientIp(req));
    const result = await processSubmission({
      body: parsed,
      ipHash,
      requirePersistence: process.env.NODE_ENV === "production",
    });
    return json(result.status, result.body);
  } catch (error) {
    logError("route_unhandled", error);
    return json(500, { error: "Something went wrong. Please try again." });
  }
}

/** No public read of submissions. */
export async function GET(): Promise<Response> {
  return json(405, { error: "Method not allowed." });
}
