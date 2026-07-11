/**
 * Serialise a JSON-LD object for embedding inside an inline
 * <script type="application/ld+json"> tag.
 *
 * `JSON.stringify` does not escape `<`, `>` or `&`, so a value containing the
 * literal `</script>` (or `<!--`) could break out of the script element. We
 * escape those characters to their unicode escapes, which are valid inside JSON
 * strings and render identically, closing that injection vector even though our
 * JSON-LD is built from trusted catalogue data.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
