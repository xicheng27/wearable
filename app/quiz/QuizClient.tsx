"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { trackEvent } from "@/lib/analytics";
import { useCountry } from "@/components/CountryProvider";
import { usePassport } from "@/components/PassportProvider";
import { useUserProfile } from "@/components/UserProfileProvider";
import { GLOBAL } from "@/lib/countries";
import BodyModel, { type BodyZone } from "@/components/quiz/BodyModel";
import { buildAvatarAriaLabel } from "@/lib/avatar";
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
  exampleChips,
  fitSignals,
  helpOptions,
  modelState,
  NOT_LISTED,
  NOT_LISTED_ISSUE,
  type Answers,
  type ExampleChip,
  type StepGroup,
} from "@/lib/quiz/config";

/* ------------------------------- Helpers --------------------------------- */

const ZONE_LABEL = Object.fromEntries(
  bodyZoneGroups.map((g) => [g.zone, g.title])
) as Record<BodyZone, string>;

// The named regions the quiz offers as one-tap options.
const NAMED_REGIONS = [
  "Singapore",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
];

/** Map the shared shopping-region (from the header) to a quiz option. */
function regionToOption(country: string | null): string {
  if (!country) return "";
  if (country === GLOBAL) return GLOBAL;
  if (NAMED_REGIONS.includes(country)) return country;
  return "Other country";
}

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

function leadingFor(key: string, option: string): React.ReactNode {
  if (key === "country") {
    if (option === GLOBAL) return <GlobeGraphic size={34} />;
    if (option === "Other country") return <FlagOther size={34} />;
    const Flag = COUNTRY_FLAGS[option];
    return Flag ? <Flag size={34} /> : <FlagOther size={34} />;
  }
  if (key === "help") {
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
      <p className="mb-3 text-sm leading-6 text-ink/65">
        Select a body area to see what clothing needs to support, then choose
        what makes dressing harder there. You can pick more than one. Tapping a
        zone also highlights it on the avatar.
      </p>
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
        <OptionCard
          label={NOT_LISTED}
          multi
          selected={selected.has(NOT_LISTED_ISSUE)}
          onClick={() => toggleIssue(NOT_LISTED_ISSUE)}
        />
      </div>
    </div>
  );
}

/* ----------------------------- Model panel ------------------------------- */

/** The single location indicator: one small chip in the card header. */
function LocationChip({ country }: { country: string }) {
  const isGlobal = country === GLOBAL;
  const Flag = isGlobal
    ? GlobeGraphic
    : country === "Other country"
      ? FlagOther
      : COUNTRY_FLAGS[country] ?? FlagOther;
  const label = isGlobal ? "Global" : country === "Other country" ? "Other region" : country;
  return (
    <span className="inline-flex max-w-[11rem] items-center gap-1.5 rounded-full border border-ink/10 bg-sand/40 py-1 pl-1.5 pr-2.5 text-xs font-bold text-ink/70">
      <Flag size={18} />
      <span className="truncate">{label}</span>
    </span>
  );
}

const ROTATION_LIMIT = 34;

function clampRotation(value: number): number {
  return Math.max(-ROTATION_LIMIT, Math.min(ROTATION_LIMIT, value));
}

/**
 * Live profile mirror — a calm fit dashboard: header with title + one
 * location chip, a minimal fit-signal silhouette in the centre (drag or
 * arrow keys to rotate), a one-line feedback message, and an "Active
 * signals" chip row. Tapping a chip previews its body zones on the map;
 * signals beyond the first few fold behind "+N more".
 */
function ModelPanel({
  answers,
  stepId,
  compact = false,
  focusZone,
  onZoneClick,
}: {
  answers: Answers;
  stepId: string;
  compact?: boolean;
  focusZone?: BodyZone;
  onZoneClick?: (zone: BodyZone) => void;
}) {
  const state = modelState(answers, stepId);
  const signals = useMemo(() => fitSignals(answers), [answers]);
  const country = answers.country?.[0];
  const interactive = stepId === "bodymap";

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  // Mobile: the map is collapsible so it never forces long scrolling.
  // null = automatic (open only on the body-map step, where it's tappable).
  const [mapOpen, setMapOpen] = useState<boolean | null>(null);
  const showMap = !compact || (mapOpen ?? interactive);

  // When a quiz answer adds a new signal, softly bring it into focus so the
  // mirror visibly responds to the selection.
  const signalKey = signals.map((s) => s.id).join("|");
  const prevIdsRef = useRef<string[] | null>(null);
  useEffect(() => {
    const ids = signalKey ? signalKey.split("|") : [];
    const prev = prevIdsRef.current;
    prevIdsRef.current = ids;
    if (prev === null) return; // initial render: no selection jump
    const added = ids.filter((id) => !prev.includes(id));
    if (added.length) setSelectedId(added[added.length - 1]);
    else setSelectedId((curr) => (curr && ids.includes(curr) ? curr : null));
  }, [signalKey]);

  const selectedSignal = signals.find((s) => s.id === selectedId);
  // At most 3 highlight zones at once: the focused body-map zone, the
  // previewed signal's zones, or an overview of the top signals.
  const zones: BodyZone[] = interactive
    ? focusZone
      ? [focusZone]
      : []
    : selectedSignal
      ? selectedSignal.zones
      : Array.from(new Set(signals.flatMap((s) => s.zones))).slice(0, 3);

  const feedback = interactive
    ? focusZone
      ? `Checking ${ZONE_LABEL[focusZone].toLowerCase()} fit`
      : "Tap a body area to check its fit"
    : selectedSignal?.detail ??
      signals[0]?.detail ??
      (country && country !== "Other country"
        ? `Filtering for ${country === GLOBAL ? "global" : country} availability`
        : "Your answers update this preview as you go");

  const maxChips = compact ? 3 : 4;
  const visibleSignals = showAll ? signals : signals.slice(0, maxChips);
  const hiddenCount = signals.length - visibleSignals.length;

  // Manual rotation of the fit preview: pointer drag (with a small threshold
  // so body-map taps still register) or arrow keys. Direct manipulation, so
  // it stays available under reduced motion; only idle animations stop.
  const [rotation, setRotation] = useState(0);
  const dragRef = useRef<{ startX: number; startRot: number; active: boolean } | null>(null);
  const ariaLabel = `${buildAvatarAriaLabel(zones, {
    seated: state.seated,
    helper: state.helper,
  })} Drag, or use the left and right arrow keys, to rotate the preview.`;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = { startX: e.clientX, startRot: rotation, active: false };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    if (!drag.active) {
      if (Math.abs(dx) < 6) return;
      drag.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setRotation(clampRotation(drag.startRot + dx * 0.35));
  }
  function onPointerEnd() {
    dragRef.current = null;
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setRotation((r) => clampRotation(r - 8));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setRotation((r) => clampRotation(r + 8));
    } else if (e.key === "Home") {
      e.preventDefault();
      setRotation(0);
    }
  }

  return (
    <section
      aria-label="Live profile mirror"
      className={`flex h-full w-full flex-col rounded-3xl border border-ink/10 bg-paper shadow-soft ${
        compact ? "p-3" : "p-4"
      }`}
    >
      {/* Header: title + the one and only location indicator */}
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-800">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="fsm-live-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-600" />
          </span>
          Live profile mirror
        </p>
        <div className="flex items-center gap-1.5">
          {country && <LocationChip country={country} />}
          {compact && (
            <button
              type="button"
              onClick={() => setMapOpen(!showMap)}
              aria-expanded={showMap}
              className="inline-flex min-h-8 items-center gap-1 rounded-full border border-ink/15 px-2.5 py-1 text-xs font-bold text-ink/60 transition hover:border-primary-300 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              {showMap ? "Hide map" : "Show map"}
              <svg
                className={`h-3.5 w-3.5 transition-transform ${showMap ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Fit map stage */}
      {showMap && (
        <div
          className={`relative mt-2 flex items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(125%_92%_at_50%_16%,#FCF9F2_0%,#F3ECDE_66%,#EADFCD_100%)] ring-1 ring-inset ring-ink/5 ${
            compact ? "py-1" : "min-h-0 flex-1 p-2"
          }`}
        >
          <div
            className={`relative rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 ${
              compact ? "h-[30vh] max-h-64" : "h-full max-h-[46vh]"
            }`}
            style={{
              aspectRatio: "220 / 340",
              perspective: "900px",
              // Vertical swipes keep scrolling the page — no scroll trap.
              touchAction: "pan-y",
            }}
            role="group"
            tabIndex={0}
            aria-label={ariaLabel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onPointerLeave={onPointerEnd}
            onKeyDown={onKeyDown}
          >
            <div
              className="h-full w-full"
              style={{ transform: `rotateY(${rotation}deg)`, transformStyle: "preserve-3d" }}
            >
              <BodyModel
                persona={state.persona}
                seated={state.seated}
                zones={zones}
                style={state.style}
                helper={state.helper}
                interactive={interactive}
                focusZone={interactive ? focusZone : undefined}
                onZoneClick={onZoneClick}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* One-line feedback: what the matching is prioritising right now */}
      <p
        aria-live="polite"
        className={`${showMap ? "mt-2.5" : "mt-3"} flex items-start gap-2 text-sm font-semibold leading-5 text-primary-800`}
      >
        <span
          className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clay"
          aria-hidden="true"
        />
        <span>{feedback}</span>
      </p>

      {/* Active signals */}
      <div className="mt-2.5">
        <p className="panel-eyebrow">Active signals</p>
        {signals.length === 0 ? (
          <p className="mt-1.5 text-xs leading-5 text-ink/55">
            None yet — pick options and they&apos;ll appear here.
          </p>
        ) : (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {visibleSignals.map((signal) => {
              const on = signal.id === selectedId;
              return (
                <button
                  key={signal.id}
                  type="button"
                  onClick={() => setSelectedId(on ? null : signal.id)}
                  aria-pressed={on}
                  className={`min-h-9 rounded-full border px-3 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 ${
                    on
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-primary-100 bg-primary-50 text-primary-800 hover:border-primary-400"
                  }`}
                >
                  {signal.label}
                </button>
              );
            })}
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="min-h-9 rounded-full border border-dashed border-ink/25 px-3 py-1 text-xs font-semibold text-ink/60 transition hover:border-primary-400 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                +{hiddenCount} more fit signal{hiddenCount > 1 ? "s" : ""}
              </button>
            )}
            {showAll && signals.length > maxChips && (
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="min-h-9 rounded-full px-2.5 py-1 text-xs font-semibold text-ink/50 transition hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                Show fewer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer hint */}
      {showMap && !compact && (
        <p className="mt-3 border-t border-ink/10 pt-2.5 text-center text-[11px] font-semibold text-ink/45">
          Tap a signal to preview · Drag to rotate
        </p>
      )}
    </section>
  );
}

/* ------------------------------ Quiz client ------------------------------ */

export default function QuizClient() {
  const router = useRouter();
  const { setProfile } = useUserProfile();
  const { savePassport } = usePassport();
  const { country: regionCountry, setCountry, openPicker } = useCountry();

  const [answers, setAnswers] = useState<Answers>({});
  const [otherNeeds, setOtherNeeds] = useState("");
  const [customNeed, setCustomNeed] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [focusZone, setFocusZone] = useState<BodyZone>("shoulders");

  // Fire quiz_started exactly once, when the quiz first renders.
  const startedRef = useRef(false);
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("quiz_started");
    }
  }, []);

  // One shared source of truth for shopping region: mirror the header's
  // CountryProvider into the quiz answer (storing the real country, even one
  // not in our one-tap list), so the header and quiz can never silently differ.
  useEffect(() => {
    const value = regionCountry ?? "";
    setAnswers((prev) =>
      (prev.country?.[0] ?? "") === value ? prev : { ...prev, country: value ? [value] : [] }
    );
  }, [regionCountry]);

  // Selecting a region in the quiz updates the shared region (and the header).
  function chooseRegion(option: string) {
    if (option === GLOBAL) setCountry(GLOBAL);
    else if (option === "Other country") openPicker();
    else setCountry(option);
  }

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

  // One-tap example chips pre-fill the matching answers (and undo them again).
  function chipApplied(chip: ExampleChip, a: Answers): boolean {
    return Object.entries(chip.set).every(([key, values]) =>
      values.every((v) => (a[key] ?? []).includes(v))
    );
  }

  function toggleChip(chip: ExampleChip) {
    setAnswers((prev) => {
      const on = chipApplied(chip, prev);
      const next = { ...prev };
      Object.entries(chip.set).forEach(([key, values]) => {
        const curr = next[key] ?? [];
        next[key] = on
          ? curr.filter((v) => !values.includes(v))
          : Array.from(new Set([...curr, ...values]));
      });
      return next;
    });
  }

  function goNext() {
    if (isLast) return finish();
    // step id is a non-identifying question key (e.g. "country", "clothing").
    trackEvent("quiz_step_completed", { step: current.id, index: clampedIndex });
    setStepIndex(clampedIndex + 1);
  }

  function goBack() {
    setStepIndex(Math.max(0, clampedIndex - 1));
  }

  function finish() {
    const params = buildResultParams(answers, otherNeeds, customNeed);
    const country = answers.country?.[0];
    // Coarse, non-identifying completion signal (counts + which categories).
    trackEvent("quiz_completed", {
      clothingCount: (answers.clothing ?? []).length,
      needsCount: (answers.help ?? []).length,
      hasLocation: Boolean(country && country !== "Other country"),
    });
    if (country && country !== "Other country" && country !== GLOBAL) setCountry(country);

    setProfile({
      country: country && country !== "Other country" ? country : undefined,
      location: country && country !== "Other country" ? country : undefined,
      clothingCategories: answers.clothing,
      mainChallenges: answers.help,
      bodyNeeds: answers.help,
      stylePreference: answers.style,
    });

    // The answers become the shopper's reusable Adaptive Fit Passport,
    // stored on this device and reused across results, browse and saved.
    savePassport(answers, otherNeeds, customNeed);

    router.push(`/quiz/results?${params.toString()}`);
  }

  const visibleGroups: StepGroup[] =
    current.type === "grouped"
      ? (current.groups ?? []).filter((g) => g.active?.(answers) ?? true)
      : [];
  const groupSelections = visibleGroups.flatMap((g) => answers[g.key] ?? []);
  const canContinue =
    current.optional ||
    current.type === "bodymap" ||
    (current.type === "grouped" ? groupSelections.length > 0 : selected.length > 0) ||
    Boolean(current.freeText && otherNeeds.trim());
  const showCustomField =
    current.type === "bodymap"
      ? (answers.bodyIssues ?? []).includes(NOT_LISTED_ISSUE)
      : current.type === "grouped"
        ? groupSelections.includes(NOT_LISTED)
        : selected.includes(NOT_LISTED);

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
            <ModelPanel
              answers={answers}
              stepId={current.id}
              focusZone={focusZone}
              onZoneClick={setFocusZone}
            />
          </div>
        </aside>

        {/* Model — mobile compact band (collapsible fit map, chips always visible) */}
        <div className="min-h-0 px-4 py-2 lg:hidden">
          <ModelPanel
            answers={answers}
            stepId={current.id}
            compact
            focusZone={focusZone}
            onZoneClick={setFocusZone}
          />
        </div>

        {/* Question column */}
        <section className="flex min-h-0 flex-col">
          <div key={current.id} className="animate-fade-up min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
              {current.title}
            </h1>
            <p className="mt-2 text-base leading-7 text-ink/65">{current.subtitle}</p>

            {current.id === "whoWhere" && regionCountry && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-800">
                <span className="h-2 w-2 rounded-full bg-primary-600" aria-hidden="true" />
                Using your site setting:{" "}
                {regionCountry === GLOBAL ? "Global" : regionCountry}
              </p>
            )}

            {current.showExampleChips && (
              <div className="mt-4">
                <p className="panel-eyebrow">Quick examples</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {exampleChips.map((chip) => {
                    const on = chipApplied(chip, answers);
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => toggleChip(chip)}
                        aria-pressed={on}
                        className={`min-h-10 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                          on
                            ? "border-primary-700 bg-primary-700 text-white"
                            : "border-ink/15 bg-paper text-ink/70 hover:border-primary-300 hover:bg-sand/30"
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-5">
              {current.type === "bodymap" ? (
                <BodyFitMap
                  answers={answers}
                  focusZone={focusZone}
                  setFocusZone={setFocusZone}
                  toggleIssue={toggleIssue}
                />
              ) : current.type === "grouped" ? (
                <div className="grid gap-8">
                  {visibleGroups.map((group) => (
                    <fieldset key={group.key}>
                      <legend className="text-base font-bold text-ink">
                        {group.title}
                      </legend>
                      {group.subtitle && (
                        <p className="mt-1 text-sm leading-6 text-ink/60">
                          {group.subtitle}
                        </p>
                      )}
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {group.options.map((option) => (
                          <OptionCard
                            key={option}
                            label={option === GLOBAL ? "View globally available items" : option}
                            multi={!group.single}
                            selected={
                              group.key === "country"
                                ? regionToOption(answers.country?.[0] ?? null) === option
                                : (answers[group.key] ?? []).includes(option)
                            }
                            onClick={() =>
                              group.key === "country"
                                ? chooseRegion(option)
                                : toggle(group.key, option, Boolean(group.single))
                            }
                            leading={leadingFor(group.key, option)}
                          />
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(current.options ?? []).map((option) => (
                    <OptionCard
                      key={option}
                      label={option === GLOBAL ? "View globally available items" : option}
                      multi={current.type === "multi"}
                      selected={selected.includes(option)}
                      onClick={() => toggle(current.id, option, current.type !== "multi")}
                      leading={leadingFor(current.id, option)}
                    />
                  ))}
                </div>
              )}
            </div>

            {showCustomField && (
              <div className="animate-fade-in mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-4">
                <label htmlFor="custom-need" className="text-sm font-bold text-ink">
                  Tell us what clothing needs to work better for you. (optional)
                </label>
                <p className="mt-1 text-xs leading-5 text-ink/60">
                  What clothing need is not listed here? Describe it in terms of
                  comfort, access, movement or fit — you don&apos;t need to share
                  any diagnosis.
                </p>
                <textarea
                  id="custom-need"
                  value={customNeed}
                  onChange={(e) => setCustomNeed(e.target.value)}
                  placeholder="For example: I need a waistband that doesn't press on a sensitive area, or sleeves that open fully."
                  className="mt-2 min-h-24 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base leading-7 text-ink outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
                />
              </div>
            )}

            {current.freeText && (
              <div className="mt-6">
                <label htmlFor="other-needs" className="text-sm font-bold text-ink">
                  Or describe it in your own words (optional)
                </label>
                <textarea
                  id="other-needs"
                  value={otherNeeds}
                  onChange={(e) => setOtherNeeds(e.target.value)}
                  placeholder="For example: tops that are easy to change while lying down, or pants that don't press when seated."
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
              aria-hidden={clampedIndex === 0}
              tabIndex={clampedIndex === 0 ? -1 : 0}
              className={`inline-flex min-h-[3rem] items-center gap-2 rounded-full border-2 border-primary-300 bg-primary-50 px-5 py-2.5 text-base font-bold text-primary-800 transition hover:border-primary-500 hover:bg-primary-100 hover:text-primary-900 active:scale-[0.98] ${
                clampedIndex === 0 ? "pointer-events-none invisible" : ""
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
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
