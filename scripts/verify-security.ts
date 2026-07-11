/**
 * Security-behaviour verification.
 *
 * Run with:  npm run verify:security
 * (bundled by esbuild with the `@/` alias, then run under node)
 *
 * Covers the security-sensitive pure logic that protects the app:
 *  - safe external-URL validation (scheme allowlist, control chars, length)
 *  - submission validation (fields, caps, email, URL, HTML/mass-assignment)
 *  - text sanitisation & email normalisation
 *  - on-device data deletion keys
 *  - quiz free-text is NOT written into the results URL
 */

import { safeExternalUrl, isSafeExternalUrl, hostOf } from "@/lib/security/url";
import { cleanText, cleanLine, normalizeEmail, looksLikeHtml } from "@/lib/security/sanitize";
import { validateSubmission, SUBMISSION_LIMITS } from "@/lib/security/submission";
import { clearPersonalData, PERSONAL_DATA_KEYS } from "@/lib/clearUserData";
import { buildResultParams } from "@/lib/quiz/config";

let failures = 0;
function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ✓ ${name}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log("\nSafe external URL");
{
  check("accepts a normal https url", isSafeExternalUrl("https://example.com/x"));
  check("accepts http url", isSafeExternalUrl("http://example.com"));
  check("rejects javascript: scheme", !isSafeExternalUrl("javascript:alert(1)"));
  check("rejects data: scheme", !isSafeExternalUrl("data:text/html,<script>1</script>"));
  check("rejects file: scheme", !isSafeExternalUrl("file:///etc/passwd"));
  check("rejects ftp: scheme", !isSafeExternalUrl("ftp://example.com"));
  check("rejects blob: scheme", !isSafeExternalUrl("blob:https://example.com/abc"));
  check("rejects vbscript: scheme", !isSafeExternalUrl("vbscript:msgbox(1)"));
  check("rejects mailto in link position", !isSafeExternalUrl("mailto:a@b.com"));
  check("rejects control chars in url", !isSafeExternalUrl("https://exam\x00ple.com"));
  check("rejects malformed url", !isSafeExternalUrl("not a url"));
  check("rejects empty/undefined", !isSafeExternalUrl("") && !isSafeExternalUrl(undefined));
  check(
    "rejects over-long url",
    !isSafeExternalUrl("https://e.com/" + "a".repeat(3000), { maxLength: 2048 })
  );
  check("httpsOnly rejects http", !isSafeExternalUrl("http://example.com", { httpsOnly: true }));
  check("hostOf strips www", hostOf("https://www.example.com/x") === "example.com");
  check("hostOf on junk is 'unknown'", hostOf("nope") === "unknown");
  check(
    "normalises/returns string on success",
    safeExternalUrl("https://Example.com") === "https://example.com/"
  );
}

console.log("\nText sanitisation");
{
  check("cleanText trims + caps length", cleanText("  hello world  ", 5) === "hello");
  check(
    "cleanText strips control chars",
    cleanText("a\x00b\x07c", 50) === "abc"
  );
  check("cleanText keeps normal newlines", cleanText("a\nb", 50) === "a\nb");
  check("cleanLine collapses whitespace", cleanLine("a   b\tc", 50) === "a b c");
  check("cleanText on non-string is empty", cleanText(undefined, 10) === "");
  check("normalizeEmail lowercases + trims", normalizeEmail("  A@B.CoM ") === "a@b.com");
  check("normalizeEmail rejects invalid", normalizeEmail("nope") === null);
  check("normalizeEmail rejects too long", normalizeEmail("a@" + "b".repeat(260) + ".com") === null);
  check("looksLikeHtml detects tags", looksLikeHtml("<script>") && looksLikeHtml("<b>"));
  check("looksLikeHtml passes plain text", !looksLikeHtml("magnetic buttons"));
}

console.log("\nSubmission validation");
{
  const ok = validateSubmission({
    productName: "  Magnetic Shirt ",
    brandName: "MagnaReady",
    productUrl: "https://magnaready.com/x",
    country: "US",
    notes: "easy one-handed dressing",
    contact: "Buyer@Example.com",
  });
  check("accepts a valid submission", ok.ok === true);
  if (ok.ok) {
    check("trims product name", ok.value.productName === "Magnetic Shirt");
    check("normalises email", ok.value.contact === "buyer@example.com");
    check("keeps safe url", ok.value.productUrl === "https://magnaready.com/x");
  }

  check(
    "rejects missing required fields",
    validateSubmission({ productName: "", brandName: "" }).ok === false
  );
  check(
    "rejects unsafe url scheme",
    validateSubmission({
      productName: "x",
      brandName: "y",
      productUrl: "javascript:alert(1)",
    }).ok === false
  );
  check(
    "rejects invalid email",
    validateSubmission({ productName: "x", brandName: "y", contact: "not-an-email" }).ok === false
  );
  check(
    "rejects HTML in product name",
    validateSubmission({ productName: "<img src=x onerror=1>", brandName: "y" }).ok === false
  );

  // Mass-assignment: unknown fields must be ignored, not persisted.
  const attacker: Record<string, unknown> = {
    productName: "x",
    brandName: "y",
    isAdmin: true,
    submittedAt: "hacked",
  };
  const extra = validateSubmission(attacker);
  check("drops unknown fields (no mass assignment)", extra.ok === true && !("isAdmin" in extra.value));

  // Length caps enforced.
  const long = validateSubmission({
    productName: "p".repeat(500),
    brandName: "b".repeat(500),
    notes: "n".repeat(5000),
  });
  check(
    "caps oversized fields",
    long.ok === true &&
      long.value.productName.length === SUBMISSION_LIMITS.productName &&
      long.value.brandName.length === SUBMISSION_LIMITS.brandName &&
      long.value.notes.length === SUBMISSION_LIMITS.notes
  );
}

console.log("\nOn-device data deletion");
{
  const store: Record<string, string> = {};
  PERSONAL_DATA_KEYS.forEach((k) => (store[k] = "x"));
  store["xis-display-currency"] = "keep-me"; // a preference, must survive
  const fakeWindow = {
    localStorage: {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    },
  };
  (globalThis as unknown as { window: unknown }).window = fakeWindow;

  const result = clearPersonalData();
  check("removes all personal keys", PERSONAL_DATA_KEYS.every((k) => !(k in store)));
  check("keeps preference keys by default", store["xis-display-currency"] === "keep-me");
  check("reports removed keys", result.removed.length === PERSONAL_DATA_KEYS.length);

  delete (globalThis as unknown as { window?: unknown }).window;
}

console.log("\nQuiz free-text stays out of the results URL");
{
  const params = buildResultParams(
    { help: ["Getting dressed is hard"], clothing: ["Tops"] },
    "I have a port on my chest that needs access",
    "waistband must not press on my stoma"
  );
  const qs = params.toString();
  check("otherNeeds not in URL", !params.has("otherNeeds"));
  check("custom free text not in URL", !params.has("custom"));
  check(
    "no free-text substring leaks into query string",
    !/port|stoma|chest/i.test(decodeURIComponent(qs))
  );
  check("presence flag still set", params.get("customflag") === "1");
}

console.log(
  failures === 0
    ? "\nAll security verification cases passed."
    : `\n${failures} security verification case(s) FAILED.`
);
process.exit(failures === 0 ? 0 : 1);
