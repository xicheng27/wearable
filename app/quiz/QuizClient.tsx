"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { disabilityOptionsList, shippingLocationsList } from "@/data/brands";

const styleOptions = [
  "Swedish style",
  "Clean / minimal",
  "Old money",
  "Streetwear",
  "Formal",
  "Casual",
  "Sporty",
  "Vintage",
  "Smart casual",
];

// Styles that map onto an existing clothing-type filter.
const styleToClothing: Record<string, string> = {
  Formal: "Formal wear",
  "Old money": "Formal wear",
  "Smart casual": "Formal wear",
  Sporty: "Activewear",
};

const steps = [
  {
    title: "What are your accessibility needs?",
    subtitle: "Select all that apply — this helps us match the right brands.",
  },
  {
    title: "Where should brands ship to?",
    subtitle: "We'll only show brands that deliver to you.",
  },
  {
    title: "What's your style?",
    subtitle: "Pick the looks you love. You can choose more than one.",
  },
];

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

export default function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [needs, setNeeds] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [styles, setStyles] = useState<string[]>([]);

  const isLastStep = step === steps.length - 1;
  const stepHasSelection =
    step === 0 ? needs.length > 0 : step === 1 ? location !== "" : styles.length > 0;

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function finish() {
    const params = new URLSearchParams();
    if (needs[0]) params.set("disability", needs[0]);
    if (location) params.set("location", location);
    const clothing = styles.map((s) => styleToClothing[s]).find(Boolean);
    if (clothing) params.set("clothing", clothing);
    params.set("from", "quiz");
    router.push(`/search?${params.toString()}`);
  }

  function next() {
    if (isLastStep) {
      finish();
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
            {steps[step].title}
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">{steps[step].subtitle}</p>

          <div className="mt-8">
            {step === 0 && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {disabilityOptionsList.map((opt) => (
                  <OptionButton
                    key={opt}
                    label={opt}
                    selected={needs.includes(opt)}
                    onClick={() => toggle(needs, opt, setNeeds)}
                  />
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {shippingLocationsList.map((opt) => (
                  <OptionButton
                    key={opt}
                    label={opt}
                    selected={location === opt}
                    onClick={() => setLocation(location === opt ? "" : opt)}
                  />
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {styleOptions.map((opt) => (
                  <OptionButton
                    key={opt}
                    label={opt}
                    selected={styles.includes(opt)}
                    onClick={() => toggle(styles, opt, setStyles)}
                  />
                ))}
              </div>
            )}
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
            {isLastStep
              ? "Show my matches"
              : stepHasSelection
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
