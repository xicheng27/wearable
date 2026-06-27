import type {
  AgeRange,
  BudgetRange,
  DressingMethod,
  GenderStylePreference,
  MobilityLevel,
  TargetGroup,
  UserType,
} from "@/types";

export const userTypeOptions: { value: UserType; label: string }[] = [
  { value: "self", label: "Myself" },
  { value: "family", label: "A parent or elderly family member" },
  { value: "child", label: "A child or teen" },
  { value: "patient", label: "A patient or client" },
  { value: "other", label: "Someone else" },
];

export const ageGroupOptions: { value: AgeRange; label: string }[] = [
  { value: "under_18", label: "Under 18" },
  { value: "18_30", label: "18-30" },
  { value: "31_50", label: "31-50" },
  { value: "51_65", label: "51-65" },
  { value: "65_plus", label: "65+" },
];

export const mobilityOptions: { value: MobilityLevel; label: string }[] = [
  { value: "independent", label: "Walk independently" },
  { value: "support", label: "Walk with support" },
  { value: "mostly_seated", label: "Mostly seated" },
  { value: "wheelchair", label: "Wheelchair user" },
  { value: "bedridden", label: "Bedridden or mostly lying down" },
  { value: "prefer_not_say", label: "Prefer not to say" },
];

export const dressingMethodOptions: {
  value: DressingMethod;
  label: string;
}[] = [
  { value: "independent", label: "Dress independently" },
  { value: "slow_independent", label: "Dress independently, but slowly" },
  { value: "occasional_help", label: "Need occasional help" },
  { value: "caregiver_often", label: "Need caregiver help often" },
  { value: "fully_caregiver", label: "Fully caregiver-assisted" },
];

export const mainChallengeOptions = [
  "Wheelchair or seated comfort",
  "Limited hand dexterity",
  "One-handed dressing",
  "Difficulty bending",
  "Difficulty lifting arms",
  "Caregiver-assisted dressing",
  "Sensory discomfort",
  "Medical device access",
  "General comfort and ease",
];

export const functionalFeatureOptions = [
  "Magnetic closures",
  "Velcro",
  "Elastic waistband",
  "Side openings",
  "Open-back design",
  "Front opening",
  "Large zipper pulls",
  "No buttons",
  "No back pockets",
  "Seated fit",
  "Tagless / soft fabric",
  "Medical port or tube access",
  "Easy wash",
  "Breathable fabric",
];

export const quizStyleOptions = [
  "Minimalist",
  "Streetwear",
  "Smart casual",
  "Formal",
  "Feminine",
  "Masculine",
  "Androgynous",
  "Sporty",
  "Classic",
  "Trendy",
  "No preference",
];

export const genderStyleOptions: {
  value: GenderStylePreference;
  label: string;
}[] = [
  { value: "womenswear", label: "Womenswear" },
  { value: "menswear", label: "Menswear" },
  { value: "gender_neutral", label: "Gender-neutral" },
  { value: "children_teen", label: "Adaptive children / teen" },
  { value: "no_preference", label: "No preference" },
];

export const personalityOptions = [
  "Quiet and simple",
  "Bold and expressive",
  "Professional",
  "Comfortable first",
  "Fashion-forward",
  "Practical",
  "Elegant",
  "Sporty",
];

export const budgetOptions: { value: BudgetRange; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "mid_range", label: "Mid-range" },
  { value: "premium", label: "Premium" },
  { value: "no_preference", label: "No preference" },
];

export const targetGroupOptions: { value: TargetGroup; label: string }[] = [
  { value: "elderly", label: "Elderly user / caregiver-assisted dressing" },
  { value: "disability", label: "Physical disability or mobility limitation" },
  { value: "caregiver", label: "Caregiver or family member" },
];

export const ageRangeOptions = ageGroupOptions;
