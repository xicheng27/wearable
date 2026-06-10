"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  clothingTypesList,
  disabilityOptionsList,
  searchBrands,
  shippingLocationsList,
} from "@/data/brands";

interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  type: "single" | "multi";
  options: string[];
}

const steps: StepDef[] = [
  {
    id: "needs",
    title: "Which of these best describe your needs?",
    subtitle: "Select all that apply — this helps us match the right brands.",
    type: "multi",
    options: disabilityOptionsList,
  },
  {
    id: "seated",
    title: "Do you need seated-fit clothing?",
    subtitle:
      "Seated-fit cuts are designed for wheelchair users and anyone who spends most of the day sitting.",
    type: "single",
    options: ["Yes, most of the time", "Sometimes", "No"],
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
      "No sensory preferences",
    ],
  },
  {
    id: "fastenings",
    title: "Which fastenings work best for you?",
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
    subtitle: "Choose one or more clothing categories.",
    type: "multi",
    options: clothingTypesList,
  },
  {
    id: "location",
    title: "Where should brands ship to?",
    subtitle: "We'll only show brands that deliver to you.",
    type: "single",
    options: shippingLocationsList,
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
    id: "budget",
    title: "What's your budget?",
    subtitle: "A rough range is fine — you can always change it later.",
    type: "single",
    options: ["$ · Budget-friendly", "$$ · Mid-range", "$$$ · Premium", "No limit"],
  },
];

const fasteningToFeature: Record<string, string> = {
  "Magnetic buttons": "Magnetic closures",
  Velcro: "Velcro fastenings",
  "Easy zippers": "Zipper",
  "Slip-on / no fastenings": "Slip-on",
};

const styleToClothing: Record<string, string> = {
  Formal: "Formal wear",
  "Old money": "Formal wear",
  "Smart casual": "Formal wear",
  Sporty: "Activewear",
};

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
}

function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
        selected
          ? "border-primary-600 bg-primary-50 text-primary-700"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
          selected ? "bg-primary-600 text-white" : "border border-gray-300 text-transparent"
        }`}
        aria-hidden="true"
      >
        <CheckIcon />
      </span>
    </button>
  );
}

/**
 * Builds search params from quiz answers, then relaxes the least important
 * filters until at least one brand matches — so the quiz never dead-ends
 * on an empty results page.
 */
function buildResultParams(answers: Record<string, string[]>): URLSearchParams {
  const needs = answers.needs ?? [];
  const seated = answers.seated?.[0] ?? "";
  const sensory = (answers.sensory ?? []).filter((s) => s !== "No sensory preferences");
  const fastenings = (answers.fastenings ?? []).filter((f) => f !== "No preference");
  const clothing = answers.clothing ?? [];
  const location = answers.location?.[0] ?? "";
  const styles = answers.style ?? [];
  const budget = answers.budget?.[0] ?? "";

  let feature = "";
  if (seated.startsWith("Yes")) feature = "Seated fit";
  else if (fastenings[0]) feature = fasteningToFeature[fastenings[0]] ?? "";
  else if (sensory.length > 0) feature = "Sensory-friendly";

  const clothingFilter =
    clothing[0] ?? styles.map((s) => styleToClothing[s]).find(Boolean) ?? "";

  const price = budget.startsWith("$") ? budget.split(" ")[0] : "";

  const filters: Record<string, string> = {};
  if (needs[0]) filters.disability = needs[0];
  if (location) filters.location = location;
  if (clothingFilter) filters.clothing = clothingFilter;
  if (feature) filters.feature = feature;
  if (price) filters.price = price;

  const matches = (f: Record<string, string>) =>
    searchBrands({
      disabilityType: f.disability,
      clothingType: f.clothing,
      adaptiveFeature: f.feature,
      country: f.location,
      priceRange: f.price,
    }).length;

  for (const key of ["price", "feature", "clothing", "location", "disability"]) {
    if (matches(filters) > 0) break;
    delete filters[key];
  }

  const params = new URLSearchParams(filters);
  params.set("from", "quiz");
  return params;
}

export default function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

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
          ? selected.filter((v) => v !== option)
          : [...selected, option];
    setAnswers({ ...answers, [current.id]: next });
  }

  function next() {
    if (isLastStep) {
      router.push(`/search?${buildResultParams(answers).toString()}`);
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2" aria-label="Xi's home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="select-none text-sm font-bold text-white">X</span>
          </span>
        </Link>
        <p className="text-sm text-gray-400">
          {step + 1} of {steps.length}
        </p>
        <Link
          href="/"
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Exit quiz"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </header>

      <div className="mx-auto w-full max-w-2xl px-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary-600 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10">
        <div key={step} className="animate-fade-up flex flex-1 flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">{current.subtitle}</p>

          <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {current.options.map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={selected.includes(opt)}
                onClick={() => select(opt)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 pb-4">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className={`rounded-full px-5 py-3 text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-700 ${
              step === 0 ? "invisible" : ""
            }`}
          >
            Back
          </button>
          <button type="button" onClick={next} className="btn-primary px-8">
            {isLastStep ? "Show my matches" : selected.length > 0 ? "Continue" : "Skip"}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
