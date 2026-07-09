import type {
  ProductFeedbackType,
  RecommendationFeedbackEvent,
} from "@/lib/feedback";

/**
 * RECOMMENDATION TUNING (foundation)
 * ----------------------------------
 * The single, UI-free place where collected feedback (lib/feedback.ts) turns
 * into scoring adjustments. It is deliberately simple and rule-based for now —
 * no ML — but structured so the rules can grow or be replaced by a learned
 * model later without changing the recommendation engine's call site.
 *
 * Intended wiring (kept OUT of the live engine for now, because a single
 * device's local feedback should not silently reshape everyone's results):
 *   const agg = aggregateFeedback(readFeedbackLog());
 *   const finalScore = applyFeedbackAdjustment(baseScore, product.id, agg);
 *
 * Example rules this structure supports (see product spec):
 *   • AFO users repeatedly click/save a shoe → raise its weight for AFO users.
 *   • A product often flagged "wrong category" → lower its score in that category.
 *   • SG shoppers ignoring non-SG items → raise Singapore-availability importance.
 *   • Strict matching ON but "not relevant" clicked → its tags need review.
 *   • Certain closure types often saved → raise those closure weights.
 */

export interface ProductSignal {
  clicks: number;
  saves: number;
  compares: number;
  retailerOpens: number;
  dismissals: number;
  positive: number; // "good_match"
  negative: number; // "not_relevant" | "doesnt_fit_need"
  wrongCategory: number;
  doesntShip: number;
}

export interface FeedbackAggregate {
  byProduct: Record<string, ProductSignal>;
}

function emptySignal(): ProductSignal {
  return {
    clicks: 0,
    saves: 0,
    compares: 0,
    retailerOpens: 0,
    dismissals: 0,
    positive: 0,
    negative: 0,
    wrongCategory: 0,
    doesntShip: 0,
  };
}

const NEGATIVE_FEEDBACK: ProductFeedbackType[] = ["not_relevant", "doesnt_fit_need"];

/** Roll raw events up into per-product signal counts. Pure + testable. */
export function aggregateFeedback(
  events: RecommendationFeedbackEvent[]
): FeedbackAggregate {
  const byProduct: Record<string, ProductSignal> = {};
  const bump = (id: string): ProductSignal => (byProduct[id] ??= emptySignal());

  for (const e of events) {
    if (!e.productId) continue;
    const s = bump(e.productId);
    switch (e.actionType) {
      case "product_card_clicked":
        s.clicks++;
        break;
      case "product_saved":
        s.saves++;
        break;
      case "product_compared":
        s.compares++;
        break;
      case "retailer_link_clicked":
        s.retailerOpens++;
        break;
      case "product_dismissed":
        s.dismissals++;
        break;
      case "feedback_given":
        if (e.feedbackType === "good_match") s.positive++;
        else if (e.feedbackType === "wrong_category") s.wrongCategory++;
        else if (e.feedbackType === "doesnt_ship") s.doesntShip++;
        else if (e.feedbackType && NEGATIVE_FEEDBACK.includes(e.feedbackType))
          s.negative++;
        break;
      default:
        break;
    }
  }

  return { byProduct };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * A small, BOUNDED multiplier in [0.8, 1.2] derived from a product's feedback.
 * Positive engagement nudges up; explicit negatives / wrong-category nudge down.
 * Bounded on purpose so feedback refines ranking but never overrides the hard
 * requirement + evidence scoring the engine already does.
 */
export function feedbackWeightMultiplier(
  productId: string,
  agg: FeedbackAggregate
): number {
  const s = agg.byProduct[productId];
  if (!s) return 1;
  const positive = s.saves * 2 + s.positive * 2 + s.clicks + s.compares;
  const negative = s.wrongCategory * 3 + s.negative * 2 + s.dismissals;
  const net = positive - negative;
  // ~5 net signals moves the weight by the full ±0.2.
  return clamp(1 + net * 0.04, 0.8, 1.2);
}

/** THE place to fold feedback into a score. Returns a 0–100 adjusted score. */
export function applyFeedbackAdjustment(
  baseScore: number,
  productId: string,
  agg: FeedbackAggregate
): number {
  return clamp(baseScore * feedbackWeightMultiplier(productId, agg), 0, 100);
}
