import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * LIGHTWEIGHT RECOMMENDATION FEEDBACK / SIGNAL COLLECTION
 * ------------------------------------------------------
 * A privacy-conscious foundation for improving recommendation accuracy over
 * time. This is NOT machine learning — it just captures the real interaction
 * signals we'd want to tune scoring against later:
 *   • what the shopper asked for (needs / category / location),
 *   • what we showed them,
 *   • what they did (clicked, saved, compared, opened the retailer, dismissed),
 *   • and explicit feedback ("good match", "wrong category", …).
 *
 * Design goals (see acceptance criteria):
 *   • No login — every event is tagged with an ANONYMOUS, random session id.
 *   • No sensitive data — only coarse, controlled tag values. Never store the
 *     free-text needs the shopper typed, diagnoses, names or precise location.
 *   • Easily replaceable storage — call sites only ever call captureFeedback().
 *     Today it writes a capped localStorage ring buffer and mirrors a coarse
 *     event into the analytics layer; swap the body for a POST to a collection
 *     endpoint / PostHog / GA later without touching any call site.
 *
 * How this data improves recommendations later: feed readFeedbackLog() into
 * lib/recommendationTuning.ts, which turns aggregated signals into small,
 * bounded scoring-weight nudges (e.g. AFO users repeatedly saving a shoe →
 * raise its weight for AFO; many "wrong category" flags → lower it there).
 */

const SESSION_KEY = "xis-session-id";
const LOG_KEY = "xis-feedback-log";
const CONTEXT_KEY = "xis-feedback-context";
const MAX_EVENTS = 500;

/**
 * Session-level context (what the shopper is currently looking for) so every
 * captured event carries the quiz needs / category / location / strict flag
 * without threading them through every component. Only coarse, controlled
 * values — never the free-text a shopper typed.
 */
export interface FeedbackContext {
  selectedNeeds?: string[];
  selectedCategory?: string | null;
  selectedLocation?: string | null;
  strictMatchingEnabled?: boolean;
}

function readContext(): FeedbackContext {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CONTEXT_KEY);
    return raw ? (JSON.parse(raw) as FeedbackContext) : {};
  } catch {
    return {};
  }
}

/** Merge/update the current feedback context (e.g. on results load). */
export function setFeedbackContext(ctx: FeedbackContext): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CONTEXT_KEY,
      JSON.stringify({ ...readContext(), ...ctx })
    );
  } catch {
    /* storage disabled — ignore */
  }
}

/** What the shopper did. Controlled set so aggregation stays consistent. */
export type FeedbackActionType =
  | "results_shown"
  | "no_results"
  | "product_card_clicked"
  | "product_saved"
  | "product_unsaved"
  | "product_compared"
  | "retailer_link_clicked"
  | "product_dismissed"
  | "feedback_given"
  | "strict_matching_toggled"
  | "filter_used";

/** Explicit per-product feedback the shopper can give on a card. */
export type ProductFeedbackType =
  | "good_match"
  | "not_relevant"
  | "wrong_category"
  | "doesnt_fit_need"
  | "doesnt_ship";

export interface RecommendationFeedbackEvent {
  userSessionId: string;
  timestamp: number;
  actionType: FeedbackActionType;
  feedbackType?: ProductFeedbackType;
  productId?: string;
  /** Controlled adaptive tags (never free text). */
  productTags?: string[];
  matchScoreShown?: number | null;
  strictMatchingEnabled?: boolean;
  selectedNeeds?: string[];
  selectedCategory?: string | null;
  selectedLocation?: string | null;
}

/** Coarse, non-identifying mirror of a subset of actions into web analytics. */
const ACTION_TO_ANALYTICS: Partial<Record<FeedbackActionType, AnalyticsEvent>> = {
  product_card_clicked: "product_card_clicked",
  no_results: "no_results_seen",
  strict_matching_toggled: "strict_matching_toggled",
  product_compared: "compare_added",
  product_saved: "product_saved",
  product_unsaved: "product_unsaved",
  retailer_link_clicked: "official_link_clicked",
  filter_used: "filter_applied",
};

/** Anonymous, per-device session id. Random — carries no personal information. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/**
 * Record one interaction signal. Safe to call from anywhere — it never throws
 * and is a no-op on the server. Storage here is intentionally a thin, swappable
 * layer: replace the localStorage body with a network call when a backend
 * exists; call sites do not change.
 */
export function captureFeedback(
  event: Omit<RecommendationFeedbackEvent, "userSessionId" | "timestamp">
): void {
  if (typeof window === "undefined") return;

  // Context supplies defaults (needs / category / location / strict); anything
  // the caller passes on the event itself takes precedence.
  const full: RecommendationFeedbackEvent = {
    ...readContext(),
    ...event,
    userSessionId: getSessionId(),
    timestamp: Date.now(),
  };

  // 1) Replaceable local store — a capped ring buffer so it never grows unbounded.
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    const log: RecommendationFeedbackEvent[] = raw ? JSON.parse(raw) : [];
    log.push(full);
    if (log.length > MAX_EVENTS) log.splice(0, log.length - MAX_EVENTS);
    window.localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    // storage disabled / full — analytics must never break the interaction
  }

  // 2) Coarse analytics mirror (no PII in the payload).
  const analyticsName = ACTION_TO_ANALYTICS[event.actionType];
  if (analyticsName) {
    trackEvent(analyticsName, {
      feedback: event.feedbackType ?? null,
      productId: event.productId ?? null,
      strict: event.strictMatchingEnabled ?? null,
    });
  }
}

/** Read the local feedback log (for future aggregation / tuning). */
export function readFeedbackLog(): RecommendationFeedbackEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
