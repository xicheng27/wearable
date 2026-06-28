import type { SignalCategory, SignalMap as SignalMapData } from "@/lib/signalMap";
import ProfileCard from "@/components/ProfileCard";

function strengthColor(strength: SignalCategory["strength"]): string {
  switch (strength) {
    case "High":
      return "bg-primary-700";
    case "Strong":
      return "bg-primary-500";
    case "Medium":
      return "bg-clay";
    default:
      return "bg-ink/25";
  }
}

function CategoryRow({ c }: { c: SignalCategory }) {
  return (
    <article className="card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-ink">{c.title}</h3>
        <span className="font-display text-2xl font-semibold tabular-nums text-ink">
          {c.score}%
        </span>
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/10"
        role="img"
        aria-label={`${c.title} signal strength ${c.score} percent`}
      >
        <div
          className={`h-full rounded-full ${strengthColor(c.strength)} transition-all`}
          style={{ width: `${Math.max(c.score, 4)}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary-50 px-2.5 py-1 font-bold text-primary-800">
          Signal: {c.strength}
        </span>
        <span className="rounded-full bg-sand/60 px-2.5 py-1 font-semibold text-ink/70">
          Data: {c.confidence}
        </span>
      </div>

      {c.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-ink/10 bg-paper px-2 py-0.5 text-[11px] font-semibold text-ink/65"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm leading-6 text-ink/65">{c.explanation}</p>
    </article>
  );
}

export default function SignalMap({ data }: { data: SignalMapData }) {
  return (
    <section
      aria-labelledby="signal-map-heading"
      className="paper-panel rounded-[2rem_.8rem_2rem_2rem] p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Your profile</p>
          <h2
            id="signal-map-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl"
          >
            Your adaptive clothing signal map
          </h2>
          <p className="mt-3 text-base leading-7 text-ink/65">
            Built from your fit, mobility, comfort, access, style and shopping
            answers. Percentages show signal strength, not accuracy.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-primary-100 bg-primary-50/70 px-5 py-4">
          <div
            className="relative grid h-20 w-20 place-items-center rounded-full"
            style={{
              background: `conic-gradient(#76536E ${data.completeness * 3.6}deg, rgba(118,83,110,.15) 0deg)`,
            }}
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-paper">
              <span className="font-display text-lg font-semibold text-ink">
                {data.completeness}%
              </span>
            </div>
          </div>
          <div className="max-w-[12rem]">
            <p className="text-sm font-bold text-primary-900">Profile completeness</p>
            <p className="mt-1 text-xs leading-5 text-primary-800/80">
              {data.completenessMessage}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.categories.map((c) => (
          <CategoryRow key={c.id} c={c} />
        ))}
      </div>

      <ProfileCard share={data.share} completeness={data.completeness} />
    </section>
  );
}
