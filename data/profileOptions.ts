import type { AgeRange, LifestyleSetting, TargetGroup } from "@/types";

/** "Who are you shopping for?" — the three target groups for Phase 1 segmentation. */
export const targetGroupOptions: { value: TargetGroup; label: string }[] = [
  { value: "elderly", label: "Myself — I'm an older adult" },
  {
    value: "disability",
    label: "Myself — I have a physical disability or mobility limitation",
  },
  {
    value: "caregiver",
    label: "Someone else — a parent, child, friend or patient I support",
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

/** "Where will you wear this most?" — lets practicality and style weighting reflect real-world setting. */
export const lifestyleSettingOptions: { value: LifestyleSetting; label: string }[] = [
  { value: "daily-wear", label: "Everyday, daily wear" },
  { value: "work", label: "Work" },
  { value: "school", label: "School" },
  { value: "home", label: "Mostly at home" },
  { value: "outdoor", label: "Outdoor activities" },
  { value: "formal-event", label: "Formal events" },
];
