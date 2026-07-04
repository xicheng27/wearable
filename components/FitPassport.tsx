"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCountry } from "@/components/CountryProvider";
import { usePassport } from "@/components/PassportProvider";
import {
  passportEditSections,
  passportMissingInfo,
  passportMustHaves,
  passportResultsHref,
  passportSections,
  passportToMarkdown,
  passportWearer,
} from "@/lib/passport";
import { GLOBAL } from "@/lib/countries";
import type { Answers } from "@/lib/quiz/config";

/**
 * The Adaptive Fit Passport card: a personal, reusable summary of what
 * clothing needs to do for this person. Editable in place — no quiz retake
 * needed — and stored only on this device.
 */

const SECTION_ICONS: Record<string, string> = {
  fit: "📐",
  dressing: "🤝",
  zones: "🧍",
  sensory: "🖐️",
  medical: "➕",
  location: "📍",
  style: "🎨",
  words: "💬",
};

function OptionChip({
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
      className={`min-h-11 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-primary-200 ${
        selected
          ? "border-primary-700 bg-primary-700 text-white"
          : "border-ink/20 bg-paper text-ink/75 hover:border-primary-400"
      }`}
    >
      <span aria-hidden="true" className="mr-1">
        {selected ? "✓" : "+"}
      </span>
      {label}
    </button>
  );
}

function PassportEditor({
  answers,
  onChange,
}: {
  answers: Answers;
  onChange: (next: Answers) => void;
}) {
  function toggle(key: string, option: string, single?: boolean) {
    const current = answers[key] ?? [];
    const has = current.includes(option);
    const next = single
      ? has
        ? []
        : [option]
      : has
        ? current.filter((v) => v !== option)
        : [...current, option];
    onChange({ ...answers, [key]: next });
  }

  return (
    <div className="grid gap-4">
      {passportEditSections.map((section) => (
        <details
          key={section.id}
          className="rounded-2xl border border-ink/15 bg-paper open:border-primary-300"
        >
          <summary className="min-h-12 cursor-pointer list-none rounded-2xl px-4 py-3 text-base font-bold text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="mr-2 inline-block text-primary-700">
              ▸
            </span>
            {section.title}
          </summary>
          <div className="grid gap-4 px-4 pb-4">
            {section.groups.map((group) => (
              <fieldset key={group.key}>
                <legend className="text-sm font-bold text-ink/70">{group.title}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <OptionChip
                      key={option}
                      label={option === GLOBAL ? "Global" : option}
                      selected={(answers[group.key] ?? []).includes(option)}
                      onClick={() => toggle(group.key, option, group.single)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

export default function FitPassport() {
  const { passport, hydrated, updateAnswers, clearPassport } = usePassport();
  const { setCountry } = useCountry();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Answers | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const sections = useMemo(
    () => (passport ? passportSections(passport) : []),
    [passport]
  );
  const mustHaves = useMemo(
    () => (passport ? passportMustHaves(passport) : []),
    [passport]
  );
  const missingInfo = useMemo(
    () => (passport ? passportMissingInfo(passport) : []),
    [passport]
  );

  async function copyPassport() {
    if (!passport) return;
    try {
      await navigator.clipboard.writeText(passportToMarkdown(passport));
      setExportStatus("Passport summary copied to your clipboard.");
    } catch {
      setExportStatus("Couldn't access the clipboard — use Download instead.");
    }
  }

  function downloadPassport() {
    if (!passport) return;
    const blob = new Blob([passportToMarkdown(passport)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "adaptive-fit-passport.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportStatus("Passport downloaded as adaptive-fit-passport.md.");
  }

  if (!hydrated) {
    return (
      <div className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] px-6 py-10 text-center text-ink/60">
        Loading your passport…
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] px-6 py-14 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">
          You don&apos;t have an Adaptive Fit Passport yet
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-ink/65">
          Take the short quiz once and we&apos;ll turn your answers into a
          reusable passport — your fit needs, dressing support, sensory
          comfort and location, used everywhere on the site.
        </p>
        <Link href="/quiz" className="btn-primary mt-6 inline-flex">
          Create my passport
        </Link>
      </div>
    );
  }

  const wearer = passportWearer(passport);
  const updated = new Date(passport.updatedAt);

  function startEditing() {
    setDraft({ ...passport!.answers });
    setEditing(true);
  }

  function saveEdits() {
    if (draft) {
      updateAnswers(draft);
      // Keep the shared shopping region in sync (like the quiz does), so
      // results and browse grids never filter against a stale header country.
      const country = draft.country?.[0];
      if (country && country !== "Other country") setCountry(country);
    }
    setEditing(false);
    setDraft(null);
  }

  function cancelEdits() {
    setEditing(false);
    setDraft(null);
  }

  return (
    <div className="paper-panel overflow-hidden rounded-[1.5rem_.6rem_1.5rem_1.5rem]">
      {/* Passport header */}
      <div className="border-b border-ink/10 bg-primary-50/60 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Adaptive Fit Passport</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
              {wearer ? `Clothing profile · ${wearer}` : "Your clothing profile"}
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Saved on this device only · Updated{" "}
              {updated.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          {!editing && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={startEditing} className="btn-secondary px-4 py-2.5 text-sm">
                Edit passport
              </button>
              <Link href={passportResultsHref(passport)} className="btn-primary px-4 py-2.5 text-sm">
                See my matches
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {editing && draft ? (
          <>
            <p className="mb-4 text-sm leading-6 text-ink/65">
              Change anything below — no need to retake the quiz. Your matches
              everywhere on the site update as soon as you save.
            </p>
            <PassportEditor answers={draft} onChange={setDraft} />
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={saveEdits} className="btn-primary">
                Save changes
              </button>
              <button type="button" onClick={cancelEdits} className="btn-secondary">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Must-have requirements — the engine's hard filters, verbatim */}
            {mustHaves.length > 0 && (
              <section aria-labelledby="passport-must-haves" className="mb-6">
                <h3
                  id="passport-must-haves"
                  className="text-sm font-bold uppercase tracking-wider text-primary-800"
                >
                  Must-have requirements
                </h3>
                <p className="mt-1 text-sm leading-6 text-ink/60">
                  These are never traded away for style or budget.
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {mustHaves.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-3 py-1.5 text-sm font-bold text-white"
                    >
                      <span aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {sections.map((section) => (
                <section
                  key={section.id}
                  aria-label={section.title}
                  className="rounded-2xl border border-ink/10 bg-ivory/60 px-4 py-4"
                >
                  <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                    <span aria-hidden="true">{SECTION_ICONS[section.id] ?? "•"}</span>
                    {section.title}
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-ink/10 bg-paper px-2 py-1 text-sm text-ink/80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {missingInfo.length > 0 && (
              <section
                aria-label="Not specified yet"
                className="mt-4 rounded-2xl border border-dashed border-ink/20 bg-ivory/40 px-4 py-4"
              >
                <h3 className="text-sm font-bold text-ink/60">Not specified yet</h3>
                <p className="mt-1 text-xs leading-5 text-ink/55">
                  The matching engine can&apos;t use these for you until you add
                  them — everything here is optional.
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {missingInfo.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-ink/15 bg-paper px-2 py-1 text-sm text-ink/60"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5">
              <Link href="/search" className="btn-secondary px-4 py-2.5 text-sm">
                Browse with my passport
              </Link>
              <button type="button" onClick={copyPassport} className="btn-secondary px-4 py-2.5 text-sm">
                Copy summary
              </button>
              <button type="button" onClick={downloadPassport} className="btn-secondary px-4 py-2.5 text-sm">
                Download as Markdown
              </button>
              <Link href="/quiz" className="link-underline text-sm font-semibold text-ink/70">
                Retake the quiz instead
              </Link>
              <div className="ml-auto">
                {confirmingReset ? (
                  <span className="inline-flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-ink/75">
                      Delete your saved answers?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearPassport();
                        setConfirmingReset(false);
                      }}
                      className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 font-bold text-red-800 hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-200"
                    >
                      Yes, reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(false)}
                      className="rounded-lg border border-ink/20 px-3 py-2 font-bold text-ink/70 hover:bg-sand/40 focus:outline-none focus:ring-4 focus:ring-primary-200"
                    >
                      Keep it
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(true)}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-ink/55 underline underline-offset-2 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-primary-200"
                  >
                    Reset passport
                  </button>
                )}
              </div>
            </div>
            {exportStatus && (
              <p role="status" className="mt-3 text-sm font-semibold text-primary-800">
                {exportStatus}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
