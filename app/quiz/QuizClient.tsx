"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/Logo";
import Photo from "@/components/Photo";
import { useCountry } from "@/components/CountryProvider";
import { useUserProfile } from "@/components/UserProfileProvider";
import { GLOBAL } from "@/lib/countries";
import {
  ageGroupOptions,
  budgetOptions,
  dressingMethodOptions,
  functionalFeatureOptions,
  genderStyleOptions,
  mainChallengeOptions,
  mobilityOptions,
  personalityOptions,
  quizStyleOptions,
  sensoryOptions,
  userTypeOptions,
} from "@/data/profileOptions";
import {
  deriveBudgetRange,
  deriveCaregiverInvolvement,
  deriveDressingDifficulty,
  deriveMobilityLevel,
  mapDressingMethod,
  mapGenderStylePreference,
  mapUserType,
  shippingLocationCurrency,
} from "@/lib/userProfile";

interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  type: "single" | "multi" | "text";
  options?: string[];
  layout?: "grid" | "list";
  placeholder?: string;
}

const countryOptions = [
  "Singapore",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Malaysia",
  "India",
  GLOBAL,
];

const clothingOptions = [
  "Tops",
  "Pants",
  "Dresses / skirts",
  "Jackets / outerwear",
  "Shoes",
  "Undergarments",
  "Workwear / formalwear",
  "Everyday wear",
  "Sleepwear",
  "Not sure",
];

const steps: StepDef[] = [
  {
    id: "userType",
    title: "Who are we helping?",
    subtitle: "Choose the closest answer. You can still adjust the results later.",
    type: "single",
    layout: "list",
    options: userTypeOptions.map((option) => option.label),
  },
  {
    id: "ageGroup",
    title: "What age group should we consider?",
    subtitle: "This helps us avoid age-inappropriate fits and styles.",
    type: "single",
    options: ageGroupOptions.map((option) => option.label),
  },
  {
    id: "country",
    title: "Where are you shopping from?",
    subtitle: "We use this as a hard filter for availability and currency.",
    type: "single",
    options: countryOptions,
  },
  {
    id: "mainChallenges",
    title: "What help do you need?",
    subtitle: "Pick all that matter. Accessibility needs are filtered first.",
    type: "multi",
    layout: "list",
    options: mainChallengeOptions,
  },
  {
    id: "otherNeeds",
    title: "Anything else clothing needs to do?",
    subtitle: "Optional. Use your own words if your need was not listed.",
    type: "text",
    placeholder:
      "For example: trousers that work with a feeding tube, or tops that are easy to change while lying down.",
  },
  {
    id: "mobilityLevel",
    title: "What is the mobility situation?",
    subtitle: "This helps us prioritise seated fit, easy access, or simpler dressing.",
    type: "single",
    layout: "list",
    options: mobilityOptions.map((option) => option.label),
  },
  {
    id: "dressingMethod",
    title: "How does dressing usually happen?",
    subtitle: "This tells us whether to prioritise self-dressing or caregiver access.",
    type: "single",
    layout: "list",
    options: dressingMethodOptions.map((option) => option.label),
  },
  {
    id: "clothingCategories",
    title: "What clothing are you looking for?",
    subtitle: "Choose one or more categories.",
    type: "multi",
    options: clothingOptions,
  },
  {
    id: "requiredFeatures",
    title: "Which features would help?",
    subtitle: "These become strong filters when they relate to access or comfort.",
    type: "multi",
    layout: "list",
    options: functionalFeatureOptions,
  },
  {
    id: "sensory",
    title: "Any sensory comfort needs?",
    subtitle: "Pick what matters, or skip if this is not relevant.",
    type: "multi",
    options: sensoryOptions,
  },
  {
    id: "stylePreferences",
    title: "What style should we look for?",
    subtitle: "Choose anything that feels right, or choose no preference.",
    type: "multi",
    options: quizStyleOptions,
  },
  {
    id: "genderStylePreference",
    title: "Which clothing range should we prioritise?",
    subtitle: "This helps avoid showing items from the wrong range.",
    type: "single",
    layout: "list",
    options: genderStyleOptions.map((option) => option.label),
  },
  {
    id: "personalityVibe",
    title: "What vibe feels most like you?",
    subtitle: "This is used after accessibility needs are already matched.",
    type: "multi",
    options: personalityOptions,
  },
  {
    id: "budget",
    title: "What budget should we keep in mind?",
    subtitle: "Prices change on official sites, so this is a guide.",
    type: "single",
    options: budgetOptions.map((option) => option.label),
  },
];

const styleImages: Record<string, string> = {
  Minimalist: "/images/style-minimal.svg",
  Streetwear: "/images/style-streetwear.svg",
  "Smart casual": "/images/style-smartcasual.svg",
  Formal: "/images/style-formal.svg",
  Sporty: "/images/style-sporty.svg",
  Classic: "/images/style-oldmoney.svg",
  Trendy: "/images/style-vintage.svg",
};

function getAcknowledgment(
  stepId: string,
  values: string[],
  otherNeedsText: string
): string | null {
  const lower = values.map((value) => value.toLowerCase());

  switch (stepId) {
    case "userType":
      if (values.length === 0) return null;
      return lower[0].includes("myself")
        ? "Got it. I will tailor fit and recommendations for you."
        : "Got it. I will tailor fit and recommendations for the person you are supporting.";
    case "ageGroup":
      return values.length ? "Noted. I will fine-tune recommendations for that age range." : null;
    case "country":
      return values.length
        ? `Got it. I will show ${values[0]}-friendly options first.`
        : null;
    case "mainChallenges": {
      if (values.length === 0) return null;
      const bits: string[] = [];
      if (lower.some((value) => value.includes("wheelchair") || value.includes("seated"))) {
        bits.push("seated comfort");
      }
      if (lower.some((value) => value.includes("dexterity") || value.includes("one-handed"))) {
        bits.push("easy dressing");
      }
      if (lower.some((value) => value.includes("sensory"))) {
        bits.push("sensory comfort");
      }
      if (bits.length === 0) bits.push("clothes that fit your needs");
      return `Got it. I will prioritise ${bits.join(" and ")}.`;
    }
    case "otherNeeds":
      return otherNeedsText.trim() ? "Thanks for the detail. I will factor that in too." : null;
    case "requiredFeatures":
      return values.length ? "Good. I will use those features as strong signals." : null;
    case "sensory":
      if (values.length === 0 || lower.some((value) => value.includes("no sensory"))) return null;
      return "Noted. I will lean toward soft, low-irritation pieces.";
    case "clothingCategories":
      return values.length
        ? `Searching for ${values.map((value) => value.toLowerCase()).join(", ")}.`
        : null;
    case "stylePreferences":
      return values.length ? "Got it. I will layer style after the accessibility match." : null;
    case "budget":
      return values.length ? `Noted. I will keep things around ${values[0].toLowerCase()}.` : null;
    default:
      return null;
  }
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
  image,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  image?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border text-left text-base font-semibold leading-snug transition-all duration-200 active:scale-[0.98] ${
        image ? "p-2 pr-3" : "px-5 py-3.5"
      } ${
        selected
          ? "border-primary-700 bg-primary-50 text-primary-900 shadow-soft"
          : "border-ink/15 bg-paper text-ink/78 hover:border-primary-300 hover:bg-sand/35"
      }`}
    >
      <span className="flex items-center gap-3">
        {image && <Photo src={image} alt="" className="h-12 w-12 flex-shrink-0 rounded-xl" />}
        {label === GLOBAL ? "View globally available items" : label}
      </span>
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
          selected ? "bg-primary-700 text-white" : "border border-ink/25 text-transparent"
        }`}
        aria-hidden="true"
      >
        <CheckIcon />
      </span>
    </button>
  );
}

function valueForLabel<T extends string>(
  label: string | undefined,
  options: { value: T; label: string }[]
): T | undefined {
  return options.find((option) => option.label === label)?.value;
}

function deriveTargetGroup(answers: Record<string, string[]>) {
  const userType = mapUserType(answers.userType?.[0]);
  const ageGroup = valueForLabel(answers.ageGroup?.[0], ageGroupOptions);
  const challenges = answers.mainChallenges ?? [];
  const dressing = mapDressingMethod(answers.dressingMethod?.[0]);
  const text = [...challenges, userType ?? "", dressing ?? ""].join(" ").toLowerCase();

  if (userType === "family" || ageGroup === "65_plus") return "elderly";
  if (userType === "patient" || text.includes("caregiver")) return "caregiver";
  return "disability";
}

export default function QuizClient() {
  const router = useRouter();
  const { setProfile } = useUserProfile();
  const { setCountry } = useCountry();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [otherNeeds, setOtherNeeds] = useState("");
  const [acknowledgment, setAcknowledgment] = useState<string | null>(null);

  const current = steps[step];
  const selected = answers[current.id] ?? [];
  const isLastStep = step === steps.length - 1;

  function select(option: string) {
    const next =
      current.type === "single"
        ? selected.includes(option)
          ? []
          : [option]
        : selected.includes(option)
          ? selected.filter((value) => value !== option)
          : [...selected, option];
    setAnswers({ ...answers, [current.id]: next });
  }

  function finish() {
    const userType = mapUserType(answers.userType?.[0]);
    const ageGroup = valueForLabel(answers.ageGroup?.[0], ageGroupOptions);
    const country = answers.country?.[0];
    const mobilityLevel = valueForLabel(answers.mobilityLevel?.[0], mobilityOptions);
    const dressingMethod = mapDressingMethod(answers.dressingMethod?.[0]);
    const genderStylePreference = mapGenderStylePreference(
      answers.genderStylePreference?.[0]
    );
    const budget = deriveBudgetRange(answers.budget?.[0] ?? "");
    const targetGroup = deriveTargetGroup(answers);
    const mainChallenges = answers.mainChallenges ?? [];
    const requiredFeatures = answers.requiredFeatures ?? [];
    const sensoryNeeds = [
      ...(answers.sensory ?? []).filter((value) => !/no sensory/i.test(value)),
      ...mainChallenges.filter((value) => /sensory/i.test(value)),
      ...requiredFeatures.filter((value) => /tagless|soft|breathable/i.test(value)),
    ];
    const resolvedMobilityLevel = deriveMobilityLevel(mainChallenges, mobilityLevel);
    const dressingDifficulty = deriveDressingDifficulty(mainChallenges, requiredFeatures);

    if (country) setCountry(country);

    setProfile({
      userType,
      targetGroup,
      ageRange: ageGroup,
      country,
      location: country,
      preferredCurrency: country ? shippingLocationCurrency[country] : undefined,
      mobilityLevel: resolvedMobilityLevel,
      dressingMethod,
      mainChallenges,
      bodyNeeds: mainChallenges,
      clothingCategories: answers.clothingCategories,
      requiredFeatures,
      closurePreference: requiredFeatures,
      dressingDifficulty,
      stylePreference: answers.stylePreferences,
      genderStylePreference,
      personalityVibe: answers.personalityVibe,
      personalityType: answers.personalityVibe?.[0],
      budget,
      budgetRange: budget,
      sensoryNeeds,
      fabricComfortNeeds: sensoryNeeds.filter((value) =>
        /soft|lightweight|breathable|flat seams|tag/i.test(value)
      ),
      caregiverInvolvement: deriveCaregiverInvolvement(targetGroup, dressingMethod),
    });

    const params = new URLSearchParams();
    const set = (key: string, list?: string[]) => {
      if (list && list.length > 0) {
        params.set(key, list.join(","));
      }
    };
    if (userType) params.set("userType", userType);
    if (targetGroup) params.set("targetGroup", targetGroup);
    if (ageGroup) {
      params.set("ageGroup", ageGroup);
      params.set("ageRange", ageGroup);
    }
    if (country) params.set("location", country);
    if (resolvedMobilityLevel) params.set("mobilityLevel", resolvedMobilityLevel);
    if (dressingMethod) params.set("dressingMethod", dressingMethod);
    if (genderStylePreference) params.set("genderStyle", genderStylePreference);
    if (budget) params.set("budget", budget);
    if (otherNeeds.trim()) params.set("otherNeeds", otherNeeds.trim());
    set("needs", mainChallenges);
    set("features", requiredFeatures);
    set("fastenings", requiredFeatures);
    set("clothing", answers.clothingCategories);
    set("styles", answers.stylePreferences);
    set("style", answers.stylePreferences);
    set("personality", answers.personalityVibe);
    set("sensory", sensoryNeeds);

    router.push(`/quiz/results?${params.toString()}`);
  }

  function next() {
    setAcknowledgment(getAcknowledgment(current.id, selected, otherNeeds));
    if (isLastStep) finish();
    else setStep((currentStep) => currentStep + 1);
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-paper">
      <header className="mx-auto flex w-full max-w-3xl shrink-0 items-center justify-between px-5 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Xi's home">
          <LogoMark size={32} />
        </Link>
        <p className="text-sm font-semibold text-ink/45">
          {step + 1} of {steps.length}
        </p>
        <Link
          href="/"
          className="rounded-full p-2 text-ink/45 transition-colors hover:bg-sand/45 hover:text-ink"
          aria-label="Exit quiz"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </header>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-5 sm:px-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary-700 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-5 sm:px-6">
        <div
          key={step}
          className="animate-fade-up min-h-0 flex-1 overflow-y-auto py-5 pr-1 sm:py-6"
        >
          {acknowledgment && (
            <p
              className="mb-4 inline-flex max-w-full items-center rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800"
              aria-live="polite"
            >
              {acknowledgment}
            </p>
          )}
          <p className="eyebrow">Personalisation quiz</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
            {current.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-ink/65">{current.subtitle}</p>

          {step === 0 && (
            <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm leading-6 text-primary-950">
              Xi&apos;s recommends clothing by matching your daily-life needs,
              mobility, dressing method, sensory comfort, style, age, budget and
              country with tagged adaptive clothing data.
            </div>
          )}

          {current.type === "text" ? (
            <div className="mt-6">
              <label htmlFor="other-needs" className="text-sm font-bold text-ink">
                Describe anything we missed
              </label>
              <textarea
                id="other-needs"
                value={otherNeeds}
                onChange={(event) => setOtherNeeds(event.target.value)}
                placeholder={current.placeholder}
                className="mt-2 min-h-40 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base leading-7 text-ink shadow-paper outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
              />
            </div>
          ) : (
            <div
              className={`mt-6 grid grid-cols-1 gap-3 ${
                current.layout === "list" ? "" : "sm:grid-cols-2"
              }`}
            >
              {(current.options ?? []).map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={selected.includes(option)}
                  onClick={() => select(option)}
                  image={current.id === "stylePreferences" ? styleImages[option] : undefined}
                />
              ))}
            </div>
          )}
        </div>

        <div className="z-10 flex shrink-0 items-center justify-between gap-4 border-t border-ink/10 bg-paper/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          <button
            type="button"
            onClick={() => {
              setAcknowledgment(null);
              setStep((currentStep) => currentStep - 1);
            }}
            className={`rounded-xl px-5 py-3 text-sm font-bold text-ink/55 transition-colors duration-200 hover:bg-sand/45 hover:text-ink ${
              step === 0 ? "invisible" : ""
            }`}
          >
            Back
          </button>
          <button type="button" onClick={next} className="btn-primary px-8 py-3.5 text-base">
            {isLastStep ? "Build my recommendations" : selected.length > 0 || current.type === "text" ? "Continue" : "Skip"}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
