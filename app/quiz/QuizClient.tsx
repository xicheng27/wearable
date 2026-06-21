"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/Logo";
import Photo from "@/components/Photo";
import { useCountry } from "@/components/CountryProvider";
import {
  disabilityOptionsList,
  shippingLocationsList,
} from "@/data/brands";
import { quizClothingOptions } from "@/data/categories";
import {
  ageRangeOptions,
  lifestyleSettingOptions,
  personalityOptions,
  targetGroupOptions,
} from "@/data/profileOptions";
import { useUserProfile } from "@/components/UserProfileProvider";
import {
  deriveBudgetRange,
  deriveCaregiverInvolvement,
  deriveDressingDifficulty,
  deriveMobilityLevel,
  shippingLocationCurrency,
} from "@/lib/userProfile";

interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  type: "single" | "multi" | "text";
  options?: string[];
  placeholder?: string;
  layout?: "grid" | "list";
}

const steps: StepDef[] = [
  {
    id: "targetGroup",
    title: "Who are you shopping for?",
    subtitle: "This helps us show the right fit and features first.",
    type: "single",
    layout: "list",
    options: targetGroupOptions.map((option) => option.label),
  },
  {
    id: "ageRange",
    title: "What's your age range?",
    subtitle: "We'll tailor sizing and fit suggestions accordingly.",
    type: "single",
    options: ageRangeOptions.map((option) => option.label),
  },
  {
    id: "location",
    title: "Where are you shopping from?",
    subtitle: "We'll only show brands that deliver to you.",
    type: "single",
    options: shippingLocationsList,
  },
  {
    id: "needs",
    title: "Which of these best describe your physical or functional needs?",
    subtitle: "Select all that apply. This helps us match the right products.",
    type: "multi",
    options: disabilityOptionsList,
  },
  {
    id: "otherNeeds",
    title: "Is there anything else clothing needs to do for you?",
    subtitle:
      "Describe anything we have not covered, in your own words. This is optional.",
    type: "text",
    placeholder:
      "For example: I need trousers that work with a feeding tube, or tops that are easy to change while lying down.",
  },
  {
    id: "sensory",
    title: "Any sensory preferences?",
    subtitle: "We'll prioritise fabrics and finishes that feel right.",
    type: "multi",
    options: [
      "Soft, tag-free fabrics",
      "Flat seams",
      "Loose, non-restrictive fits",
      "Lightweight, breathable fabrics",
      "No sensory preferences",
    ],
  },
  {
    id: "fastenings",
    title: "Which closures or fastenings work best for you?",
    subtitle: "Pick whatever makes dressing easier.",
    type: "multi",
    options: [
      "Magnetic buttons",
      "Velcro",
      "Easy zippers",
      "Slip-on / no fastenings",
      "No preference",
    ],
  },
  {
    id: "clothing",
    title: "What are you shopping for?",
    subtitle: "Choose one or more clothing pieces.",
    type: "multi",
    options: quizClothingOptions.map((option) => option.label),
  },
  {
    id: "lifestyleSetting",
    title: "Where will you wear this most?",
    subtitle: "This helps us weigh practicality alongside style.",
    type: "single",
    options: lifestyleSettingOptions.map((option) => option.label),
  },
  {
    id: "style",
    title: "What's your style?",
    subtitle: "Pick the looks you love. You can choose more than one.",
    type: "multi",
    options: [
      "Swedish style",
      "Clean / minimal",
      "Old money",
      "Streetwear",
      "Formal",
      "Casual",
      "Sporty",
      "Vintage",
      "Smart casual",
    ],
  },
  {
    id: "personality",
    title: "What's your style personality?",
    subtitle: "Pick the vibe that feels most like you.",
    type: "single",
    options: personalityOptions,
  },
  {
    id: "budget",
    title: "What's your budget?",
    subtitle: "A rough range is fine. Always check final prices on the official site.",
    type: "single",
    options: ["$ · Budget-friendly", "$$ · Mid-range", "$$$ · Premium", "No limit"],
  },
  {
    id: "availability",
    title: "How do you want to shop?",
    subtitle: "Most adaptive pieces are online, but some brands also have stores or stockists.",
    type: "single",
    options: ["Online only", "In-store also", "No preference"],
  },
];

const styleImages: Record<string, string> = {
  "Swedish style": "/images/style-swedish.svg",
  "Clean / minimal": "/images/style-minimal.svg",
  "Old money": "/images/style-oldmoney.svg",
  Streetwear: "/images/style-streetwear.svg",
  Formal: "/images/style-formal.svg",
  Casual: "/images/style-casual.svg",
  Sporty: "/images/style-sporty.svg",
  Vintage: "/images/style-vintage.svg",
  "Smart casual": "/images/style-smartcasual.svg",
};

function getAcknowledgment(
  stepId: string,
  values: string[],
  otherNeedsText: string
): string | null {
  const lower = values.map((value) => value.toLowerCase());

  switch (stepId) {
    case "targetGroup":
      if (values.length === 0) return null;
      return lower[0].startsWith("myself")
        ? "Got it — I'll tailor fit and recommendations for you."
        : "Got it — I'll tailor fit and recommendations for the person you're supporting.";
    case "ageRange":
      return values.length ? "Noted — I'll fine-tune sizing for that age range." : null;
    case "location":
      return values.length
        ? `Got it — I'll show ${values[0]}-friendly options first and use local pricing where possible.`
        : null;
    case "needs": {
      if (values.length === 0) return null;
      const bits: string[] = [];
      if (lower.some((value) => value.includes("wheelchair") || value.includes("seated")))
        bits.push("seated comfort");
      if (lower.some((value) => value.includes("dexterity") || value.includes("arthritis")))
        bits.push("easy closures");
      if (lower.some((value) => value.includes("prosthetic") || value.includes("limb")))
        bits.push("prosthetic-friendly openings");
      if (bits.length === 0) bits.push("clothes that fit your needs");
      return `Got it — I'll prioritise ${bits.join(" and ")}.`;
    }
    case "otherNeeds":
      return otherNeedsText.trim() ? "Thanks for the detail — I'll factor that in too." : null;
    case "sensory":
      if (values.length === 0 || lower.some((value) => value.includes("no sensory"))) return null;
      return "Noted — I'll lean toward soft, tag-free fabrics that feel right.";
    case "fastenings":
      if (values.length === 0 || lower.some((value) => value.includes("no preference"))) return null;
      return `Got it — I'll favour ${values[0].toLowerCase()} where I can.`;
    case "clothing":
      return values.length
        ? `Searching for ${values.map((value) => value.toLowerCase()).join(", ")}.`
        : null;
    case "lifestyleSetting":
      return values.length ? `Good to know — I'll weigh practicality for ${values[0].toLowerCase()}.` : null;
    case "style":
      return values.length ? "Love it — I'll lean into that look." : null;
    case "personality":
      return values.length ? `Got it, ${values[0].toLowerCase()} it is.` : null;
    case "budget":
      return values.length ? `Noted — I'll keep things around ${values[0]}.` : null;
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

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  image?: string;
}

function OptionButton({ label, selected, onClick, image }: OptionButtonProps) {
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
        {image && (
          <Photo src={image} alt="" className="h-12 w-12 flex-shrink-0 rounded-xl" />
        )}
        {label}
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

  function next() {
    setAcknowledgment(getAcknowledgment(current.id, selected, otherNeeds));
    if (isLastStep) {
      const targetGroup = targetGroupOptions.find(
        (option) => option.label === answers.targetGroup?.[0]
      )?.value;
      const ageRange = ageRangeOptions.find(
        (option) => option.label === answers.ageRange?.[0]
      )?.value;
      const location = answers.location?.[0];
      const lifestyleSetting = lifestyleSettingOptions.find(
        (option) => option.label === answers.lifestyleSetting?.[0]
      )?.value;

      if (location) setCountry(location);

      setProfile({
        targetGroup,
        ageRange,
        location,
        preferredCurrency: location ? shippingLocationCurrency[location] : undefined,
        stylePreference: answers.style,
        personalityType: answers.personality?.[0],
        bodyNeeds: answers.needs,
        closurePreference: answers.fastenings,
        dressingDifficulty: deriveDressingDifficulty(answers.needs ?? [], answers.fastenings ?? []),
        mobilityLevel: deriveMobilityLevel(answers.needs ?? []),
        sensoryNeeds: answers.sensory,
        fabricComfortNeeds: (answers.sensory ?? []).filter((value) =>
          /soft|lightweight|breathable|flat seams/i.test(value)
        ),
        lifestyleSetting,
        caregiverInvolvement: deriveCaregiverInvolvement(targetGroup),
        budgetRange: deriveBudgetRange(answers.budget?.[0] ?? ""),
      });

      const params = new URLSearchParams();
      const set = (key: string, list?: string[]) => {
        if (list && list.length > 0) {
          params.set(key, list.map(encodeURIComponent).join(","));
        }
      };
      set("needs", answers.needs);
      set("sensory", answers.sensory);
      set("fastenings", answers.fastenings);
      set("clothing", answers.clothing);
      if (location) params.set("location", location);
      set("styles", answers.style);
      if (answers.budget?.[0]) params.set("budget", answers.budget[0]);
      if (answers.availability?.[0]) params.set("availability", answers.availability[0]);
      if (otherNeeds.trim()) params.set("otherNeeds", otherNeeds.trim());
      if (targetGroup) params.set("targetGroup", targetGroup);
      if (ageRange) params.set("ageRange", ageRange);
      if (answers.personality?.[0]) params.set("personality", answers.personality[0]);
      if (lifestyleSetting) params.set("lifestyleSetting", lifestyleSetting);
      router.push(`/quiz/results?${params.toString()}`);
    } else {
      setStep((currentStep) => currentStep + 1);
    }
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
          <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
            {current.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-ink/65">{current.subtitle}</p>

          <div
            className={`mt-6 grid grid-cols-1 gap-3 ${
              current.layout === "list" ? "" : "sm:grid-cols-2"
            }`}
          >
            {current.type === "text" ? (
              <div className="sm:col-span-2">
                <label htmlFor="other-needs" className="mb-2 block text-sm font-bold text-ink">
                  Optional notes
                </label>
                <textarea
                  id="other-needs"
                  value={otherNeeds}
                  onChange={(event) => setOtherNeeds(event.target.value.slice(0, 500))}
                  placeholder={current.placeholder}
                  rows={5}
                  className="paper-panel w-full resize-y rounded-[1.4rem_.6rem_1.4rem_1.4rem] border-ink/15 px-5 py-4 text-base leading-7 text-ink placeholder:text-ink/40 focus:border-primary-400 focus:ring-primary-300"
                />
                <div className="mt-2 flex items-center justify-between gap-4 text-xs text-ink/50">
                  <p>Use everyday language. A short sentence is enough.</p>
                  <p aria-live="polite">{otherNeeds.length}/500</p>
                </div>
              </div>
            ) : (
              current.options?.map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={selected.includes(option)}
                  onClick={() => select(option)}
                  image={current.id === "style" ? styleImages[option] : undefined}
                />
              ))
            )}
          </div>
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
            {isLastStep
              ? "Show my matches"
              : current.type === "text"
                ? otherNeeds.trim()
                  ? "Continue"
                  : "Skip"
                : selected.length > 0
                  ? "Continue"
                  : "Skip"}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
