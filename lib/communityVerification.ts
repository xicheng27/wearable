import type {
  CommunityVerificationReport,
  CommunityVerificationTag,
  Product,
} from "@/types";

/**
 * Community fit verification: wearers and caregivers confirming, from real
 * use, whether an item did what it claims. The data structure and UI exist
 * now (products carry an optional `communityVerifications` array); the
 * reporting flow itself ships later, so today most products honestly show
 * "no reports yet" rather than invented social proof.
 */

export const COMMUNITY_VERIFICATION_LABELS: Record<CommunityVerificationTag, string> = {
  "worked-for-wheelchair": "Worked for wheelchair use",
  "easy-one-handed": "Easy one-handed dressing",
  "caregiver-friendly": "Caregiver-friendly",
  "sensory-friendly": "Sensory-friendly in practice",
  "afo-orthotic-friendly": "AFO / orthotic-friendly",
  "ships-as-listed": "Shipped as listed",
  "size-runs-small": "Size runs small",
  "size-runs-large": "Size runs large",
  "not-actually-adaptive": "Not actually adaptive",
  "returns-easy": "Returns were easy",
  "returns-difficult": "Returns were difficult",
};

/** Tags that warn rather than reassure — rendered with a caution marker. */
const WARNING_TAGS: CommunityVerificationTag[] = [
  "size-runs-small",
  "size-runs-large",
  "not-actually-adaptive",
  "returns-difficult",
];

export interface VerificationDisplay {
  tag: CommunityVerificationTag;
  label: string;
  count: number;
  isWarning: boolean;
}

export function communityVerificationsFor(product: Product): VerificationDisplay[] {
  return (product.communityVerifications ?? [])
    .filter((report): report is CommunityVerificationReport => report.count > 0)
    .map((report) => ({
      tag: report.tag,
      label: COMMUNITY_VERIFICATION_LABELS[report.tag] ?? report.tag,
      count: report.count,
      isWarning: WARNING_TAGS.includes(report.tag),
    }));
}
