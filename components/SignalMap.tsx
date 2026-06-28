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
        <h4 className="font-display text-lg font-semibold text-ink">{c.title}</h4>
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
          className={`h-full rounded-full ${strengthColor(c.strength)}`}
          style={{ width: `${Math.max(c.score, 4)}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary-50 px-2.5 py-1 font-bold text-primary-800">
          {c.strength} signal
        </span>
        <span className="rounded-full bg-sand/60 px-2.5 py-1 font-semibold text-ink/70">
          {c.role}
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
  const top = data.topSignals.length > 0 ? data.topSignals : data.categories.slice(0, 3);

  return (
    <section
      aria-labelledby="signal-map-heading"
      className="paper-panel rounded-[2rem_.8rem_2rem_2rem] p-6 sm:p-8"
    >
      <p className="eyebrow">Your profile</p>
      <h2
        id="signal-map-heading"
        className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl"
      >
        Your adaptive clothing signal map
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-ink/65">
        Built from your fit, mobility, comfort, access, style and shopping
        answers. This is your adaptive clothing profile — the stats behind how
        results are ranked.
      </p>

      {/* Persona + fit signature + uniqueness */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-paper p-6">
          <p className="font-hand text-sm font-semibold text-primary-700">Your profile persona</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
            {data.persona}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white">
            {data.fitSignature.title}
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/68">{data.fitSignature.description}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-paper p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink">Profile uniqueness</p>
            <span className="rounded-full bg-clay/15 px-2.5 py-1 text-xs font-bold text-clay">
              {data.uniqueness.tier}
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">
            {data.uniqueness.label}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-clay"
              style={{ width: `${data.uniqueness.score}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/65">{data.uniqueness.explanation}</p>
        </div>
      </div>

      {/* Recommendation weighting */}
      <div className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-xl font-semibold text-ink">How results are weighted</h3>
          <p className="text-xs text-ink/55">Functional needs come first — style and range refine, never override.</p>
        </div>
        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
          {data.weighting.map((w, i) => (
            <div
              key={w.label}
              className={
                ["bg-primary-700", "bg-primary-500", "bg-sage", "bg-clay", "bg-lavender"][i % 5]
              }
              style={{ width: `${w.pct}%` }}
              title={`${w.label} ${w.pct}%`}
            />
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {data.weighting.map((w, i) => (
            <div key={w.label} className="flex items-center gap-2 text-sm">
              <span
                className={`h-3 w-3 shrink-0 rounded-sm ${
                  ["bg-primary-700", "bg-primary-500", "bg-sage", "bg-clay", "bg-lavender"][i % 5]
                }`}
                aria-hidden="true"
              />
              <span className="text-ink/70">{w.label}</span>
              <span className="ml-auto font-bold text-ink">{w.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top priority signals */}
      <h3 className="mt-8 font-display text-xl font-semibold text-ink">Top priority signals</h3>
      <p className="mt-1 text-sm text-ink/60">
        The strongest drivers behind your recommendations, ordered by signal strength.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((c) => (
          <CategoryRow key={c.id} c={c} />
        ))}
      </div>

      {/* Key tags */}
      {data.keyTags.length > 0 && (
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink/45">Key tags</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.keyTags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <ProfileCard share={data.share} uniqueness={data.uniqueness} />
    </section>
  );
}
