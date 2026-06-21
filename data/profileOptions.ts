import type { AgeRange, TargetGroup } from "@/types";

/** "Who are you shopping for?" — the three target groups for Phase 1 segmentation. */
export const targetGroupOptions: { value: TargetGroup; label: string }[] = [
  { value: "elderly", label: "Myself — I'm an older adult" },
  {
    value: "disability",
    label: "Myself — I have a physical disability or mobility limitation",
  },
  {
    value: "caregiver",
    label: "Someone else — I'm a caregiver or family member",
  },
];

export const ageRangeOptions: { value: AgeRange; label: string }[] = [
  { value: "under-40", label: "Under 40" },
  { value: "40-59", label: "40 – 59" },
  { value: "60-74", label: "60 – 74" },
  { value: "75-plus", label: "75 and over" },
];

export const personalityOptions: string[] = [
  "Practical & comfortable",
  "Classic & elegant",
  "Bold & expressive",
  "Relaxed & easygoing",
];
