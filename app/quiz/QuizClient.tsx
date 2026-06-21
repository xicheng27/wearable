"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/Logo";
import { useShoppingLocation } from "@/components/LocationProvider";
import { GLOBAL_LOCATION } from "@/lib/countries";

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
    id: "location",
    title: "Where are you shopping from?",
    subtitle: "This helps us show clothing that ships to you.",
    type: "single",
    options: [
      "Singapore",
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      GLOBAL_LOCATION,
    ],
  },
  {
    id: "forWhom",
    title: "Who is this for?",
    subtitle: "Choose the closest answer. You can skip any question.",
    type: "single",
    options: ["Me", "Parent", "Child", "Friend", "Caregiver"],
  },
  {
    id: "clothing",
    title: "What clothing are you looking for?",
    subtitle: "Pick one or more. If you are unsure, choose Not sure.",
    type: "multi",
    options: ["Tops", "Pants", "Shoes", "Underwear", "Formal", "Not sure"],
  },
  {
    id: "needs",
    title: "What help do you need?",
    subtitle: "Select anything that would make dressing or wearing clothing easier.",
    type: "multi",
    options: [
      "One-handed dressing",
      "Seated fit",
      "Magnetic closures",
      "Easy shoes",
      "Sensory-friendly",
      "Wheelchair-friendly",
      "Arthritis-friendly",
      "Prosthetic-friendly",
    ],
  },
  {
    id: "budget",
    title: "Preferred budget",
    subtitle: "A rough range is enough. Prices should be checked on the official site.",
    type: "single",
    options: ["Under $50", "$50-$100", "$100-$150", "$150+", "No limit"],
  },
  {
    id: "availability",
    title: "How do you want to shop?",
    subtitle: "Most adaptive pieces are online, but some brands also have stores or stockists.",
    type: "single",
    options: ["Online only", "In-store also", "No preference"],
  },
  {
    id: "otherNeeds",
    title: "Anything we did not ask about?",
    subtitle: "Optional. Tell us in your own words if your needs are more specific.",
    type: "text",
    placeholder:
      "For example: trousers that work with a feeding tube, tops that are easy to change while lying down, or shoes that fit braces.",
  },
];

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
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-base font-bold transition-all duration-200 active:scale-[0.98] ${
        selected
          ? "border-primary-700 bg-primary-50 text-primary-900 shadow-soft"
          : "border-ink/15 bg-paper text-ink/78 hover:border-primary-300 hover:bg-sand/35"
      }`}
    >
      <span>{label === GLOBAL_LOCATION ? "View global items" : label}</span>
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
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
  const { setCountry } = useShoppingLocation();
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
          ? selected.filter((value) => value !== option)
          : [...selected, option];
    setAnswers({ ...answers, [current.id]: next });
  }

  function finish() {
    const params = new URLSearchParams();
    const set = (key: string, list?: string[]) => {
      if (list && list.length > 0) {
        params.set(key, list.map(encodeURIComponent).join(","));
      }
    };

    set("needs", answers.needs);
    set("clothing", (answers.clothing ?? []).filter((item) => item !== "Not sure"));

    if (answers.location?.[0]) {
      params.set("location", answers.location[0]);
      setCountry(answers.location[0]);
    }
    if (answers.forWhom?.[0]) params.set("forWhom", answers.forWhom[0]);
    if (answers.availability?.[0]) params.set("availability", answers.availability[0]);
    if (answers.budget?.[0] && answers.budget[0] !== "No limit") {
      params.set("budget", answers.budget[0]);
    }
    if (otherNeeds.trim()) params.set("otherNeeds", otherNeeds.trim());

    router.push(`/quiz/results?${params.toString()}`);
  }

  function next() {
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
        <div key={step} className="animate-fade-up min-h-0 flex-1 overflow-y-auto py-5 pr-1 sm:py-6">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
            {current.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-ink/65">{current.subtitle}</p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                />
              ))
            )}
          </div>
        </div>

        <div className="z-10 flex shrink-0 items-center justify-between gap-4 border-t border-ink/10 bg-paper/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setStep((currentStep) => currentStep - 1)}
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
