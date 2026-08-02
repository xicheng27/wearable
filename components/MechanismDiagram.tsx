import type { MechanismId } from "@/lib/adaptiveFeatures";

/**
 * Reusable, clearly-labelled illustrative diagrams for common adaptive
 * mechanisms. These are explanatory schematics — NOT product photos — so they
 * are always captioned as such and given descriptive titles for screen readers.
 * No real product imagery is manufactured or AI-generated.
 */

const META: Record<MechanismId, { title: string; desc: string }> = {
  "open-back": {
    title: "Open-back construction",
    desc: "A garment shown from behind with a full-length back opening that overlaps closed.",
  },
  magnetic: {
    title: "Magnetic closures",
    desc: "A placket where hidden magnets align and snap together instead of buttons.",
  },
  "side-opening": {
    title: "Side-opening trousers",
    desc: "Trousers with a full-length side seam that opens for dressing while seated or lying down.",
  },
  "seated-rise": {
    title: "Seated-fit rise",
    desc: "Trousers with a higher back rise and lower front so fabric stays comfortable when sitting.",
  },
  "touch-close": {
    title: "Touch-and-close fastening",
    desc: "A flap fastened with hook-and-loop tape that presses closed without small buttons.",
  },
  "afo-wide": {
    title: "AFO / wide-opening footwear",
    desc: "A shoe with a wide, fully-opening entry and removable insole for braces or orthotics.",
  },
};

function Glyph({ id }: { id: MechanismId }) {
  const common = {
    viewBox: "0 0 80 80",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-16 w-16 text-primary-700",
    "aria-hidden": true as const,
  };
  switch (id) {
    case "open-back":
      return (
        <svg {...common}>
          <path d="M26 14h28l-4 10v40H30V24l-4-10Z" />
          <path d="M40 20v44" strokeDasharray="4 4" />
          <path d="M34 32c3 2 9 2 12 0" />
        </svg>
      );
    case "magnetic":
      return (
        <svg {...common}>
          <path d="M30 12v56M50 12v56" />
          <path d="M36 26h8M36 40h8M36 54h8" />
          <circle cx="40" cy="33" r="3" />
          <circle cx="40" cy="47" r="3" />
        </svg>
      );
    case "side-opening":
      return (
        <svg {...common}>
          <path d="M28 12h24l-3 56h-8l-4-30-4 30h-8L28 12Z" />
          <path d="M28 16v50" strokeDasharray="3 3" />
        </svg>
      );
    case "seated-rise":
      return (
        <svg {...common}>
          <path d="M26 20h28v10l-4 38h-9l-5-26-5 26h-9l-1-38 5-10Z" />
          <path d="M26 30h28" strokeDasharray="3 3" />
        </svg>
      );
    case "touch-close":
      return (
        <svg {...common}>
          <rect x="24" y="20" width="32" height="40" rx="3" />
          <path d="M24 34h32" />
          <path d="M30 27h4M38 27h4M46 27h4" />
        </svg>
      );
    case "afo-wide":
      return (
        <svg {...common}>
          <path d="M18 52c0-8 6-10 10-14l6 4h20a6 6 0 0 1 6 6v6H18Z" />
          <path d="M34 42l4 6M42 42l4 6" />
        </svg>
      );
  }
}

export function MechanismDiagram({ id }: { id: MechanismId }) {
  const meta = META[id];
  return (
    <figure className="flex flex-col items-center rounded-2xl border border-ink/10 bg-paper p-4 text-center">
      <div role="img" aria-label={`Illustrative diagram: ${meta.desc}`}>
        <Glyph id={id} />
      </div>
      <figcaption className="mt-2">
        <span className="block text-sm font-bold text-ink">{meta.title}</span>
        <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-ink/45">
          Illustrative diagram
        </span>
      </figcaption>
    </figure>
  );
}

export function MechanismDiagrams({ ids }: { ids: MechanismId[] }) {
  if (ids.length === 0) return null;
  return (
    <div>
      <p className="text-sm leading-6 text-ink/60">
        How these mechanisms typically work (explanatory diagrams, not photos of
        this exact item):
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ids.map((id) => (
          <MechanismDiagram key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
