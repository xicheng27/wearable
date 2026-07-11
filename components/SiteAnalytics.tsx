"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Wraps Vercel Web Analytics with a `beforeSend` scrubber.
 *
 * The quiz-results page carries coded answer tokens in its query string. We
 * strip the query string from every analytics event URL so those tokens (and
 * anything else in a URL) never reach analytics — only the pathname is kept.
 * `beforeSend` is a function prop, so this must be a client component.
 */
export default function SiteAnalytics() {
  return (
    <>
      <Analytics
        beforeSend={(event) => {
          try {
            const url = new URL(event.url);
            // Drop the query string and hash entirely.
            url.search = "";
            url.hash = "";
            return { ...event, url: url.toString() };
          } catch {
            return event;
          }
        }}
      />
      <SpeedInsights />
    </>
  );
}
