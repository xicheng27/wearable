"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/Logo";
import Photo from "@/components/Photo";
import {
  disabilityOptionsList,
  shippingLocationsList,
} from "@/data/brands";
import { quizClothingOptions } from "@/data/categories";

interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  type: "single" | "multi" | "text";
  options?: string[];
  placeholder?: string;
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
    id: "otherNeeds",
    title: "Is there anything else clothing needs to do for you?",
    subtitle:
      "Describe anything we have not covered, in your own words. This is optional.",
    type: "text",
    placeholder:
      "For example: I need trousers that work with a feeding tube, or tops that are easy to change while lying down.",
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
    subtitle: "Choose one or more clothing pieces.",
    type: "multi",
    options: quizClothingOptions.map((o) => o.label),
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
      className={`flex min-h-11 items-center justify-between gap-3 rounded-xl border text-left text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
        image ? "p-2 pr-3" : "px-4 py-2.5"
      } ${
        selected
          ? "border-primary-600 bg-primary-50 text-primary-700"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <span className="flex items-center gap-3">
        {image && (
          <Photo src={image} alt="" className="h-12 w-12 flex-shrink-0 rounded-xl" />
        )}
        {label}
      </span>
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
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [otherNeeds, setOtherNeeds] = useState("");

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
      const params = new URLSearchParams();
      const set = (key: string, list?: string[]) => {
        if (list && list.length > 0) params.set(key, list.map(encodeURIComponent).join(","));
      };
      set("needs", answers.needs);
      if (answers.seated?.[0]) params.set("seated", answers.seated[0]);
      set("sensory", answers.sensory);
      set("fastenings", answers.fastenings);
      set("clothing", answers.clothing);
      if (answers.location?.[0]) params.set("location", answers.location[0]);
      set("styles", answers.style);
      if (answers.budget?.[0]) params.set("budget", answers.budget[0]);
      if (otherNeeds.trim()) params.set("otherNeeds", otherNeeds.trim());
      router.push(`/quiz/results?${params.toString()}`);
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-paper">
      <header className="mx-auto flex w-full max-w-3xl shrink-0 items-center justify-between px-5 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Xi's home">
          <LogoMark size={32} />
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

      <div className="mx-auto w-full max-w-3xl shrink-0 px-5 sm:px-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary-600 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-5 sm:px-6">
        <div
          key={step}
          className="animate-fade-up min-h-0 flex-1 overflow-y-auto py-5 pr-1 sm:py-6"
        >
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.75rem]">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">{current.subtitle}</p>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {current.type === "text" ? (
              <div className="sm:col-span-2">
                <label htmlFor="other-needs" className="sr-only">
                  Other clothing or accessibility needs
                </label>
                <textarea
                  id="other-needs"
                  value={otherNeeds}
                  onChange={(event) => setOtherNeeds(event.target.value.slice(0, 500))}
                  placeholder={current.placeholder}
                  rows={6}
                  className="paper-panel w-full resize-y rounded-[1.4rem_.6rem_1.4rem_1.4rem] border-ink/15 px-5 py-4 text-base leading-7 text-ink placeholder:text-ink/40 focus:border-primary-400 focus:ring-primary-300"
                />
                <div className="mt-2 flex items-center justify-between gap-4 text-xs text-ink/50">
                  <p>Use everyday language. A short sentence is enough.</p>
                  <p aria-live="polite">{otherNeeds.length}/500</p>
                </div>
              </div>
            ) : (
              current.options?.map((opt) => (
                <OptionButton
                  key={opt}
                  label={opt}
                  selected={selected.includes(opt)}
                  onClick={() => select(opt)}
                  image={current.id === "style" ? styleImages[opt] : undefined}
                />
              ))
            )}
          </div>
        </div>

        <div className="z-10 flex shrink-0 items-center justify-between gap-4 border-t border-ink/10 bg-paper/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
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
