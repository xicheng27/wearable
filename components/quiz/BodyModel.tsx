"use client";

import { useId } from "react";
import { buildAvatarAriaLabel } from "@/lib/avatar";

/**
 * Fit Signal Map — a calm, minimal body silhouette used as the quiz's
 * "live profile mirror". Deliberately closer to a modern UX diagram than an
 * illustration: one flat figure, at most a few glowing signal dots anchored
 * to body zones, a soft dotted aura for skin/sensory comfort, and a clean
 * side-profile wheelchair when seated posture is active. All labels live
 * OUTSIDE the graphic (as text chips in the surrounding card), never on the
 * body itself.
 */

export type Persona = "adult" | "teen" | "older" | "care";

export type BodyZone =
  | "shoulders"
  | "arms"
  | "hands"
  | "chest"
  | "waist"
  | "hips"
  | "legs"
  | "feet"
  | "skin";

export type Garment =
  | "top"
  | "bottoms"
  | "dress"
  | "outerwear"
  | "baselayer"
  | "footwear"
  | "notsure";

export interface BodyModelProps {
  persona?: Persona;
  seated?: boolean;
  /** Body zones to mark with a signal dot ("skin" renders as a soft aura). */
  zones?: BodyZone[];
  /** Accepted for API compatibility; garments are shown as text chips, not overlays. */
  garments?: Garment[];
  /** Active aesthetic style id (e.g. "old-money") — tints the torso subtly. */
  style?: string;
  /** Caregiver-assisted dressing: announced to screen readers; shown as a chip outside. */
  helper?: boolean;
  /** Accepted for API compatibility; the location chip is rendered by the card header. */
  locationFlag?: string;
  /** When true, body zones become tappable hotspots on the figure. */
  interactive?: boolean;
  /** The currently focused zone (gets a stronger ring). */
  focusZone?: BodyZone;
  /** Called when a body zone hotspot is tapped/activated. */
  onZoneClick?: (zone: BodyZone) => void;
  /** Legacy accents map onto zones so older call sites keep working. */
  accents?: {
    soft?: boolean;
    oneHanded?: boolean;
    brace?: boolean;
    medical?: boolean;
    style?: boolean;
  };
  className?: string;
}

/** Single anchor point per zone — one clean dot per active signal. */
type Anchor = { x: number; y: number };

const ANCHORS_STANDING: Record<Exclude<BodyZone, "skin">, Anchor> = {
  shoulders: { x: 80, y: 98 },
  arms: { x: 66, y: 146 },
  hands: { x: 66, y: 202 },
  chest: { x: 110, y: 122 },
  waist: { x: 110, y: 162 },
  hips: { x: 110, y: 196 },
  legs: { x: 95, y: 252 },
  feet: { x: 94, y: 300 },
};

const ANCHORS_SEATED: Record<Exclude<BodyZone, "skin">, Anchor> = {
  shoulders: { x: 112, y: 96 },
  arms: { x: 127, y: 136 },
  hands: { x: 141, y: 163 },
  chest: { x: 120, y: 118 },
  waist: { x: 115, y: 158 },
  hips: { x: 112, y: 190 },
  legs: { x: 136, y: 189 },
  feet: { x: 158, y: 260 },
};

const ZONE_LABELS: Record<BodyZone, string> = {
  shoulders: "Shoulders",
  arms: "Arms",
  hands: "Hands",
  chest: "Chest",
  waist: "Waist / abdomen",
  hips: "Hips / seated area",
  legs: "Legs",
  feet: "Feet",
  skin: "Skin / full body",
};

const HOTSPOT_ORDER: BodyZone[] = [
  "shoulders",
  "arms",
  "hands",
  "chest",
  "waist",
  "hips",
  "legs",
  "feet",
];

/** Subtle torso tint per aesthetic style — an accent, never a costume. */
const STYLE_TINT: Record<string, string> = {
  "old-money": "#38465C",
  clean: "#D9D2C4",
  chic: "#3A3442",
  streetwear: "#46587B",
  minimal: "#A29B92",
  sporty: "#3A7C74",
  formal: "#3E3D47",
  y2k: "#DE9ABC",
  "soft-cozy": "#C29B77",
  elegant: "#755272",
  casual: "#75839A",
  modest: "#64716F",
  trendy: "#B56A59",
};

const SILHOUETTE = "#DCD2DA";
const SIGNAL = "#76536E";
const AURA = "#B97861";
const CHAIR = "#8D7D89";

export default function BodyModel({
  persona = "adult",
  seated = false,
  zones = [],
  style,
  helper = false,
  interactive = false,
  focusZone,
  onZoneClick,
  accents = {},
  className = "",
}: BodyModelProps) {
  // Unique per-instance ids so multiple mirrors on one page never share defs.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  // Fold legacy accents into zones so existing call sites stay meaningful.
  const zoneSet = new Set<BodyZone>(zones);
  if (accents.soft) zoneSet.add("skin");
  if (accents.oneHanded) zoneSet.add("hands");
  if (accents.brace) zoneSet.add("feet");
  if (accents.medical) zoneSet.add("waist");

  const aura = zoneSet.has("skin");
  // At most three signal dots at a time — the card's chips carry the rest.
  const dotZones = Array.from(zoneSet)
    .filter((z): z is Exclude<BodyZone, "skin"> => z !== "skin")
    .slice(0, 3);

  const anchors = seated ? ANCHORS_SEATED : ANCHORS_STANDING;
  const tint = style ? STYLE_TINT[style] : undefined;
  // Teens read slightly smaller; everyone else shares the same calm figure.
  const scale = persona === "teen" ? 0.93 : 1;

  return (
    <svg
      viewBox="0 0 220 340"
      className={`fsm-root ${className}`}
      role="img"
      aria-label={buildAvatarAriaLabel(Array.from(zoneSet), { seated, helper })}
    >
      <defs>
        <radialGradient id={`${uid}-floor`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(118,83,110,.16)" />
          <stop offset="100%" stopColor="rgba(118,83,110,0)" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(118,83,110,.30)" />
          <stop offset="70%" stopColor="rgba(118,83,110,.10)" />
          <stop offset="100%" stopColor="rgba(118,83,110,0)" />
        </radialGradient>
      </defs>

      {/* soft ground shadow keeps the figure anchored */}
      <ellipse cx="110" cy={seated ? 292 : 316} rx="72" ry="12" fill={`url(#${uid}-floor)`} />

      <g
        transform={scale === 1 ? undefined : `translate(${110 * (1 - scale)} ${330 * (1 - scale)}) scale(${scale})`}
      >
        {/* sensory / skin comfort: one quiet dotted aura around the figure */}
        {aura && (
          <rect
            x={seated ? 56 : 48}
            y="30"
            width={seated ? 134 : 124}
            height={seated ? 262 : 292}
            rx="62"
            fill="none"
            stroke={AURA}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.5 9"
            opacity=".75"
            className="fsm-aura"
          />
        )}

        {seated ? <SeatedFigure uid={uid} tint={tint} /> : <StandingFigure uid={uid} tint={tint} />}

        {/* signal dots — one per active zone, max three */}
        {dotZones.map((zone) => {
          const a = anchors[zone];
          const active = focusZone === zone;
          return (
            <g key={zone} className="fsm-sig" data-active={active}>
              <circle className="fsm-sig-glow" cx={a.x} cy={a.y} r="15" fill={`url(#${uid}-glow)`} />
              <circle
                cx={a.x}
                cy={a.y}
                r={active ? 10.5 : 8.5}
                fill="rgba(118,83,110,.14)"
                stroke={SIGNAL}
                strokeWidth={active ? 2.5 : 2}
              />
              <circle cx={a.x} cy={a.y} r="3" fill={SIGNAL} />
            </g>
          );
        })}

        {/* tappable zone hotspots (body-map step) */}
        {interactive && (
          <g>
            {HOTSPOT_ORDER.map((zone) => {
              const a = anchors[zone as Exclude<BodyZone, "skin">];
              return (
                <g
                  key={zone}
                  className="fsm-hotspot"
                  role="button"
                  tabIndex={0}
                  data-active={focusZone === zone}
                  aria-label={ZONE_LABELS[zone]}
                  aria-pressed={focusZone === zone}
                  onClick={() => onZoneClick?.(zone)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onZoneClick?.(zone);
                    }
                  }}
                >
                  <title>{ZONE_LABELS[zone]}</title>
                  <circle className="fsm-hit" cx={a.x} cy={a.y} r="17" />
                </g>
              );
            })}
          </g>
        )}
      </g>

      <style>{`
        .fsm-sig { animation: fsmPop .5s cubic-bezier(.16,1,.3,1) both; }
        .fsm-sig[data-active="true"] .fsm-sig-glow { animation: fsmBreath 2.6s ease-in-out infinite; }
        .fsm-aura { animation: fsmFade .6s ease both; }
        .fsm-hotspot { cursor: pointer; outline: none; }
        .fsm-hit { fill: rgba(118,83,110,0); stroke: rgba(118,83,110,0); stroke-width: 1.5; transition: fill .18s ease, stroke .18s ease; }
        .fsm-hotspot:hover .fsm-hit, .fsm-hotspot:focus-visible .fsm-hit { fill: rgba(118,83,110,.12); stroke: rgba(118,83,110,.5); }
        .fsm-hotspot:focus-visible .fsm-hit { stroke-width: 2.5; }
        .fsm-hotspot[data-active="true"] .fsm-hit { stroke: rgba(118,83,110,.55); }
        @keyframes fsmPop { from { opacity: 0; transform: scale(.7); transform-box: fill-box; transform-origin: center; } to { opacity: 1; transform: scale(1); } }
        @keyframes fsmBreath { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        @keyframes fsmFade { from { opacity: 0; } to { opacity: .75; } }
        @media (prefers-reduced-motion: reduce) {
          .fsm-sig, .fsm-sig[data-active="true"] .fsm-sig-glow, .fsm-aura { animation: none; }
        }
        /* Honour the site's accessibility panel toggle too. */
        html[data-reduce-motion="true"] .fsm-sig,
        html[data-reduce-motion="true"] .fsm-sig[data-active="true"] .fsm-sig-glow,
        html[data-reduce-motion="true"] .fsm-aura { animation: none; }
      `}</style>
    </svg>
  );
}

/** Flat front-facing figure: head, capsule torso, parallel limbs. One tone. */
function StandingFigure({ uid, tint }: { uid: string; tint?: string }) {
  return (
    <g fill={SILHOUETTE}>
      <circle cx="110" cy="58" r="20" />
      <rect x="102" y="76" width="16" height="16" rx="5" />
      {/* arms */}
      <rect x="58" y="96" width="16" height="102" rx="8" />
      <rect x="146" y="96" width="16" height="102" rx="8" />
      {/* legs */}
      <rect x="84" y="192" width="22" height="106" rx="11" />
      <rect x="114" y="192" width="22" height="106" rx="11" />
      {/* feet */}
      <rect x="78" y="292" width="32" height="13" rx="6.5" />
      <rect x="110" y="292" width="32" height="13" rx="6.5" />
      {/* torso capsule */}
      <rect x="80" y="88" width="60" height="114" rx="26" />
      {/* subtle style tint on the torso only */}
      {tint && <rect x="80" y="88" width="60" height="114" rx="26" fill={tint} opacity=".55" data-uid={uid} />}
    </g>
  );
}

/** Side-profile seated figure with a minimal, clean wheelchair. */
function SeatedFigure({ uid, tint }: { uid: string; tint?: string }) {
  return (
    <g>
      {/* wheelchair — one wheel, one caster, three quiet frame strokes */}
      <g fill="none" stroke={CHAIR} strokeWidth="3" strokeLinecap="round">
        <circle cx="104" cy="240" r="40" />
        <circle cx="104" cy="240" r="4.5" fill={CHAIR} stroke="none" />
        <circle cx="170" cy="270" r="9" />
        <path d="M90 148q-8 0-8 8v50" />
        <path d="M90 206h62l16 55" />
      </g>
      {/* figure */}
      <g fill={SILHOUETTE}>
        <circle cx="120" cy="60" r="18" />
        <rect x="110" y="74" width="15" height="16" rx="5" />
        {/* torso */}
        <rect x="98" y="86" width="34" height="112" rx="17" />
        {tint && <rect x="98" y="86" width="34" height="112" rx="17" fill={tint} opacity=".55" data-uid={uid} />}
        {/* arm resting toward the lap */}
        <path
          d="M114 102 C116 132 122 148 140 160"
          fill="none"
          stroke={SILHOUETTE}
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* thigh, lower leg, foot */}
        <rect x="100" y="176" width="64" height="26" rx="13" />
        <rect x="146" y="196" width="18" height="62" rx="9" />
        <rect x="142" y="252" width="34" height="13" rx="6.5" />
      </g>
    </g>
  );
}
