"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { useCountry } from "@/components/CountryProvider";
import { useUserProfile } from "@/components/UserProfileProvider";
import { GLOBAL } from "@/lib/countries";
import BodyModel, { type BodyZone } from "@/components/quiz/BodyModel";
import {
  COUNTRY_FLAGS,
  FlagOther,
  GlobeGraphic,
  NEED_ICONS,
} from "@/components/quiz/QuizGraphics";
import {
  activeSteps,
  bodyZoneGroups,
  buildResultParams,
  helpOptions,
  modelState,
  profileChips,
  type Answers,
  type Step,
} from "@/lib/quiz/config";

/* ------------------------------- Helpers --------------------------------- */

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function OptionCard({
  label,
  selected,
  multi,
  onClick,
  leading,
}: {
  label: string;
  selected: boolean;
  multi: boolean;
  onClick: () => void;
  leading?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-[3.75rem] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-base font-semibold leading-snug transition-all duration-150 active:scale-[0.99] ${
        selected
          ? "border-primary-700 bg-primary-50 text-primary-900 shadow-soft"
          : "border-ink/15 bg-paper text-ink/80 hover:border-primary-300 hover:bg-sand/30"
      }`}
    >
      <span className="flex items-center gap-3">
        {leading}
        <span>{label}</span>
      </span>
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center transition-all ${
          multi ? "rounded-md" : "rounded-full"
        } ${
          selected ? "bg-primary-700 text-white" : "border border-ink/25 text-transparent"
        }`}
        aria-hidden="true"
      >
        <CheckIcon />
      </span>
    </button>
  );
}

function leadingFor(step: Step, option: string): React.ReactNode {
  if (step.id === "country") {
    if (option === GLOBAL) return <GlobeGraphic size={34} />;
    if (option === "Other country") return <FlagOther size={34} />;
    const Flag = COUNTRY_FLAGS[option];
    return Flag ? <Flag size={34} /> : <FlagOther size={34} />;
  }
  if (step.id === "help") {
    const meta = helpOptions.find((o) => o.value === option);
    const Icon = meta ? NEED_ICONS[meta.icon] : undefined;
    return Icon ? (
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
        <Icon size={22} />
      </span>
    ) : null;
  }
  return null;
}

/* ----------------------------- Body fit map ------------------------------ */

function BodyFitMap({
  answers,
  focusZone,
  setFocusZone,
  toggleIssue,
}: {
  answers: Answers;
  focusZone: BodyZone;
  setFocusZone: (z: BodyZone) => void;
  toggleIssue: (id: string) => void;
}) {
  const selected = new Set(answers.bodyIssues ?? []);
  const group = bodyZoneGroups.find((g) => g.zone === focusZone) ?? bodyZoneGroups[0];

  function countFor(zone: BodyZone): number {
    const g = bodyZoneGroups.find((x) => x.zone === zone);
    return g ? g.issues.filter((i) => selected.has(i.id)).length : 0;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Body areas">
        {bodyZoneGroups.map((g) => {
          const active = g.zone === focusZone;
          const count = countFor(g.zone);
          return (
            <button
              key={g.zone}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFocusZone(g.zone)}
              className={`min-h-10 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                active
                  ? "border-primary-700 bg-primary-700 text-white"
                  : count > 0
                    ? "border-primary-300 bg-primary-50 text-primary-800"
                    : "border-ink/15 bg-paper text-ink/70 hover:border-primary-300"
              }`}
            >
              {g.title}
              {count > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 text-xs ${
                    active ? "bg-white/25" : "bg-primary-700 text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3">
        {group.issues.map((issue) => (
          <OptionCard
            key={issue.id}
            label={issue.label}
            multi
            selected={selected.has(issue.id)}
            onClick={() => toggleIssue(issue.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Model panel ------------------------------- */

function CountryBadge({ country, compact }: { country: string; compact: boolean }) {
  const isGlobal = country === GLOBAL;
  const Flag = isGlobal
    ? GlobeGraphic
    : country === "Other country"
      ? FlagOther
      : COUNTRY_FLAGS[country] ?? FlagOther;
  const label = isGlobal
    ? "Global availability"
    : country === "Other country"
      ? "Shopping worldwide"
      : `Shopping from ${country}`;
  return (
    <span
      className={`absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper/90 py-1 pl-1.5 pr-3 font-bold text-ink/80 shadow-soft backdrop-blur ${
        compact ? "text-[11px]" : "text-xs"
      }`}
    >
      <Flag size={compact ? 24 : 28} />
      {label}
    </span>
  );
}

/** A floating location marker pinned over the avatar with the country's flag. */
function FlagPin({ country, compact }: { country: string; compact: boolean }) {
  const isGlobal = country === GLOBAL;
  const Flag = isGlobal
    ? GlobeGraphic
    : country === "Other country"
      ? FlagOther
      : COUNTRY_FLAGS[country] ?? FlagOther;
  const size = compact ? 34 : 46;
  return (
    <span
      className="animate-floaty pointer-events-none absolute left-1/2 top-[10%] z-10 flex -translate-x-1/2 flex-col items-center"
      aria-hidden="true"
    >
      <span
        className="grid place-items-center overflow-hidden rounded-full border-2 border-paper bg-paper shadow-lift"
        style={{ width: size, height: size }}
      >
        <Flag size={size + 8} />
      </span>
      <span className="-mt-1 h-3 w-3 rotate-45 border-b-2 border-r-2 border-paper bg-paper shadow-soft" />
    </span>
  );
}

function ModelPanel({
  answers,
  stepId,
  extraZones = [],
  compact = false,
}: {
  answers: Answers;
  stepId: string;
  extraZones?: BodyZone[];
  compact?: boolean;
}) {
  const state = modelState(answers, stepId);
  const zones = Array.from(new Set([...state.zones, ...extraZones]));
  const chips = profileChips(answers);
  const country = answers.country?.[0];

  return (
    <div className="flex h-full flex-col">
      <div
        className={`relative flex flex-1 items-center justify-center overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-b from-ivory to-paper ${
          compact ? "min-h-0 py-2" : "p-4"
        }`}
      >
        <BodyModel
          persona={state.persona}
          seated={state.seated}
          zones={zones}
          garments={state.garments}
          style={state.style}
          accents={state.accents}
          className={compact ? "h-[34vh] w-auto" : "h-full max-h-[52vh] w-auto"}
        />
        <span className="absolute left-4 top-4 rounded-full bg-paper/80 px-3 py-1 text-xs font-bold text-primary-800 shadow-soft backdrop-blur">
          Live profile mirror
        </span>
        {country && <CountryBadge country={country} compact={compact} />}
        {country && <FlagPin country={country} compact={compact} />}
      </div>

      {chips.length > 0 && (
        <div className={`${compact ? "mt-2" : "mt-4"} flex flex-wrap gap-1.5`} aria-label="Your profile so far">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Quiz client ------------------------------ */

export default function QuizClient() {
  const router = useRouter();
  const { setProfile } = useUserProfile();
  const { setCountry } = useCountry();

  const [answers, setAnswers] = useState<Answers>({});
  const [otherNeeds, setOtherNeeds] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [focusZone, setFocusZone] = useState<BodyZone>("shoulders");

  const visible = useMemo(() => activeSteps(answers), [answers]);
  const clampedIndex = Math.min(stepIndex, visible.length - 1);
  const current = visible[clampedIndex];
  const selected = answers[current.id] ?? [];
  const isLast = clampedIndex === visible.length - 1;

  function setField(id: string, value: string[]) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggle(id: string, option: string, single: boolean) {
    const curr = answers[id] ?? [];
    if (single) {
      setField(id, curr.includes(option) ? [] : [option]);
    } else {
      setField(id, curr.includes(option) ? curr.filter((v) => v !== option) : [...curr, option]);
    }
  }

  function toggleIssue(issueId: string) {
    const curr = answers.bodyIssues ?? [];
    setField(
      "bodyIssues",
      curr.includes(issueId) ? curr.filter((v) => v !== issueId) : [...curr, issueId]
    );
  }

  function goNext() {
    if (isLast) return finish();
    setStepIndex(clampedIndex + 1);
  }

  function goBack() {
    setStepIndex(Math.max(0, clampedIndex - 1));
  }

  function finish() {
    const params = buildResultParams(answers, otherNeeds);
    const country = answers.country?.[0];
    if (country && country !== "Other country" && country !== GLOBAL) setCountry(country);

    setProfile({
      country: country && country !== "Other country" ? country : undefined,
      location: country && country !== "Other country" ? country : undefined,
      clothingCategories: answers.clothing,
      mainChallenges: answers.help,
      bodyNeeds: answers.help,
      stylePreference: answers.style,
    });

    router.push(`/quiz/results?${params.toString()}`);
  }

  const canContinue = current.optional || selected.length > 0 || current.type === "bodymap";
  const bodymapZones: BodyZone[] = current.type === "bodymap" ? [focusZone] : [];

  return (
    <div className="flex h-full min-h-0 flex-col bg-paper">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Xi's home">
          <LogoMark size={30} />
        </Link>
        <p className="text-sm font-semibold text-ink/45">
          Step {clampedIndex + 1} of {visible.length}
        </p>
        <Link
          href="/"
          className="rounded-full p-2 text-ink/45 transition hover:bg-sand/45 hover:text-ink"
          aria-label="Exit quiz"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </header>

      {/* Progress */}
      <div className="shrink-0 px-4 sm:px-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary-700 transition-all duration-500 ease-out"
            style={{ width: `${((clampedIndex + 1) / visible.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Two-pane body */}
      <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:grid-rows-1">
        {/* Model — desktop sticky panel */}
        <aside className="hidden min-h-0 px-6 py-4 lg:flex">
          <div className="w-full">
            <ModelPanel answers={answers} stepId={current.id} extraZones={bodymapZones} />
          </div>
        </aside>

        {/* Model — mobile compact band */}
        <div className="min-h-0 border-b border-ink/10 px-4 pb-2 pt-1 lg:hidden">
          <ModelPanel answers={answers} stepId={current.id} extraZones={bodymapZones} compact />
        </div>

        {/* Question column */}
        <section className="flex min-h-0 flex-col">
          <div key={current.id} className="animate-fade-up min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
              {current.title}
            </h1>
            <p className="mt-2 text-base leading-7 text-ink/65">{current.subtitle}</p>

            <div className="mt-5">
              {current.type === "bodymap" ? (
                <BodyFitMap
                  answers={answers}
                  focusZone={focusZone}
                  setFocusZone={setFocusZone}
                  toggleIssue={toggleIssue}
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(current.options ?? []).map((option) => (
                    <OptionCard
                      key={option}
                      label={option === GLOBAL ? "View globally available items" : option}
                      multi={current.type === "multi"}
                      selected={selected.includes(option)}
                      onClick={() => toggle(current.id, option, current.type !== "multi")}
                      leading={leadingFor(current, option)}
                    />
                  ))}
                </div>
              )}
            </div>

            {isLast && (
              <div className="mt-6">
                <label htmlFor="other-needs" className="text-sm font-bold text-ink">
                  Anything we missed? (optional)
                </label>
                <textarea
                  id="other-needs"
                  value={otherNeeds}
                  onChange={(e) => setOtherNeeds(e.target.value)}
                  placeholder="In your own words — e.g. tops that are easy to change while lying down."
                  className="mt-2 min-h-24 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base leading-7 text-ink outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
                />
              </div>
            )}

            {/* spacer so content is never hidden behind sticky controls */}
            <div className="h-4" />
          </div>

          {/* Sticky controls */}
          <div className="z-10 flex shrink-0 items-center justify-between gap-3 border-t border-ink/10 bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-6">
            <button
              type="button"
              onClick={goBack}
              className={`min-h-[3rem] rounded-xl px-5 py-3 text-sm font-bold text-ink/60 transition hover:bg-sand/45 hover:text-ink ${
                clampedIndex === 0 ? "invisible" : ""
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="btn-primary flex-1 px-6 py-3.5 text-base sm:flex-none sm:px-8"
            >
              {isLast ? "Build my recommendations" : canContinue ? "Continue" : "Skip"}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
