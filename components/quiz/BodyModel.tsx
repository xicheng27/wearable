"use client";

import { useId } from "react";
import { buildAvatarAriaLabel } from "@/lib/avatar";

/**
 * Fit Signal Map — the quiz's "live profile mirror".
 *
 * A calm, editorial adaptive-fit figure: one smoothly-shaded silhouette (soft
 * 2.5D gradient + a single quiet highlight, never flat rectangles), at most a
 * few elegant signal rings anchored to body zones, a soft sensory aura, and a
 * clean side-profile figure with a minimal wheelchair when seated. Every label
 * lives OUTSIDE the graphic (as text chips in the surrounding card) so the body
 * itself stays uncluttered. Premium, minimal, fashion-oriented — never a toy,
 * never medical, never a placeholder.
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
  /** Body zones to mark with a signal ring ("skin" renders as a soft aura). */
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

/** Single anchor point per zone — one clean ring per active signal. */
type Anchor = { x: number; y: number };

const ANCHORS_STANDING: Record<Exclude<BodyZone, "skin">, Anchor> = {
  shoulders: { x: 82, y: 100 },
  arms: { x: 70, y: 150 },
  hands: { x: 68, y: 200 },
  chest: { x: 110, y: 122 },
  waist: { x: 110, y: 166 },
  hips: { x: 110, y: 200 },
  legs: { x: 100, y: 252 },
  feet: { x: 96, y: 300 },
};

const ANCHORS_SEATED: Record<Exclude<BodyZone, "skin">, Anchor> = {
  shoulders: { x: 110, y: 96 },
  arms: { x: 128, y: 138 },
  hands: { x: 144, y: 164 },
  chest: { x: 118, y: 116 },
  waist: { x: 112, y: 156 },
  hips: { x: 110, y: 188 },
  legs: { x: 138, y: 192 },
  feet: { x: 160, y: 258 },
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

const SIGNAL = "#76536E";
const AURA = "#B97861";
const CHAIR = "#9B8B97";

/**
 * The standing silhouette outline (torso → waist → hips → pelvis), symmetric
 * around x=110. Reused for the fill, the soft top sheen and the style tint so
 * they always share the exact same premium shape.
 */
const TORSO_PATH =
  "M102 82 C92 84 80 88 80 98 C80 104 85 108 85 114 " +
  "C85 132 84 151 93 168 C88 182 84 192 85 204 " +
  "C86 212 92 216 100 216 L120 216 " +
  "C128 216 134 212 135 204 C136 192 132 182 127 168 " +
  "C136 151 135 132 135 114 C135 108 140 104 140 98 " +
  "C140 88 128 84 118 82 Z";

const LEG_LEFT = "M92 210 C90 240 92 270 94 296 L106 296 C106 270 106 240 105 210 Z";
const LEG_RIGHT = "M128 210 C130 240 128 270 126 296 L114 296 C114 270 114 240 115 210 Z";

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
  // At most three signal rings at a time — the card's chips carry the rest.
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
        {/* Soft vertical body shading gives the flat figure a premium 2.5D feel. */}
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ECE4EB" />
          <stop offset="52%" stopColor="#DCD1DA" />
          <stop offset="100%" stopColor="#C7B8C5" />
        </linearGradient>
        {/* Slightly deeper tone so arms/limbs recede behind the torso. */}
        <linearGradient id={`${uid}-limb`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E1D6E0" />
          <stop offset="100%" stopColor="#CBBCC9" />
        </linearGradient>
        {/* A single quiet upper-left highlight — the only "lighting" on the body. */}
        <radialGradient id={`${uid}-sheen`} cx="38%" cy="30%" r="62%">
          <stop offset="0%" stopColor="rgba(255,255,255,.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={`${uid}-floor`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(80,55,74,.18)" />
          <stop offset="100%" stopColor="rgba(80,55,74,0)" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(118,83,110,.34)" />
          <stop offset="65%" stopColor="rgba(118,83,110,.10)" />
          <stop offset="100%" stopColor="rgba(118,83,110,0)" />
        </radialGradient>
      </defs>

      {/* soft ground shadow keeps the figure anchored */}
      <ellipse cx="110" cy={seated ? 292 : 316} rx="70" ry="11" fill={`url(#${uid}-floor)`} />

      <g
        transform={scale === 1 ? undefined : `translate(${110 * (1 - scale)} ${330 * (1 - scale)}) scale(${scale})`}
      >
        {/* sensory / skin comfort: one quiet dotted aura around the figure */}
        {aura && (
          <rect
            x={seated ? 56 : 50}
            y="30"
            width={seated ? 132 : 120}
            height={seated ? 262 : 292}
            rx="60"
            fill="none"
            stroke={AURA}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="0.5 8"
            opacity=".7"
            className="fsm-aura"
          />
        )}

        {seated ? (
          <SeatedFigure uid={uid} tint={tint} />
        ) : (
          <StandingFigure uid={uid} tint={tint} />
        )}

        {/* signal rings — one per active zone, max three */}
        {dotZones.map((zone) => {
          const a = anchors[zone];
          const active = focusZone === zone;
          return (
            <g key={zone} className="fsm-sig" data-active={active}>
              <circle className="fsm-sig-glow" cx={a.x} cy={a.y} r="16" fill={`url(#${uid}-glow)`} />
              <circle
                cx={a.x}
                cy={a.y}
                r={active ? 11 : 9}
                fill="rgba(252,249,242,.55)"
                stroke={SIGNAL}
                strokeWidth={active ? 2.4 : 1.8}
              />
              <circle cx={a.x} cy={a.y} r="2.6" fill={SIGNAL} />
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
        @keyframes fsmFade { from { opacity: 0; } to { opacity: .7; } }
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

/**
 * Front-facing editorial silhouette: smoothly-tapered torso, slim curved arms
 * and legs, gently shaded with one soft sheen. Reads as a premium fit form.
 */
function StandingFigure({ uid, tint }: { uid: string; tint?: string }) {
  return (
    <g>
      {/* arms sit behind the torso and use the slightly deeper limb tone */}
      <path
        d="M82 102 C74 120 68 150 67 180 C67 190 67 196 68 202"
        fill="none"
        stroke={`url(#${uid}-limb)`}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M138 102 C146 120 152 150 153 180 C153 190 153 196 152 202"
        fill="none"
        stroke={`url(#${uid}-limb)`}
        strokeWidth="13"
        strokeLinecap="round"
      />

      {/* legs */}
      <path d={LEG_LEFT} fill={`url(#${uid}-limb)`} />
      <path d={LEG_RIGHT} fill={`url(#${uid}-limb)`} />
      {/* feet */}
      <ellipse cx="93" cy="300" rx="15" ry="7" fill={`url(#${uid}-limb)`} />
      <ellipse cx="127" cy="300" rx="15" ry="7" fill={`url(#${uid}-limb)`} />

      {/* neck + head */}
      <rect x="104" y="70" width="12" height="18" rx="6" fill={`url(#${uid}-limb)`} />
      <circle cx="110" cy="54" r="17" fill={`url(#${uid}-body)`} />
      <ellipse cx="104" cy="48" rx="9" ry="11" fill={`url(#${uid}-sheen)`} />

      {/* torso — the hero shape */}
      <path d={TORSO_PATH} fill={`url(#${uid}-body)`} />
      {/* one soft upper-left sheen for depth */}
      <ellipse cx="99" cy="120" rx="26" ry="42" fill={`url(#${uid}-sheen)`} />
      {/* subtle style tint on the torso only — an accent, never a costume */}
      {tint && <path d={TORSO_PATH} fill={tint} opacity=".34" />}
      {/* barely-there top sheen line */}
      <path d={TORSO_PATH} fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="1" />
    </g>
  );
}

/** Side-profile seated figure with a minimal, refined wheelchair. */
function SeatedFigure({ uid, tint }: { uid: string; tint?: string }) {
  const TORSO = "M100 88 C96 92 95 104 96 120 C97 140 100 158 104 174 " +
    "C104 184 108 192 118 194 L134 196 C124 198 112 198 104 196 " +
    "C97 194 94 186 94 174 C93 150 92 118 94 104 C95 96 97 90 100 88 Z";
  return (
    <g>
      {/* wheelchair — a large hand-rimmed wheel, a caster and a quiet frame */}
      <g fill="none" stroke={CHAIR} strokeLinecap="round">
        <circle cx="104" cy="242" r="42" strokeWidth="2.4" />
        <circle cx="104" cy="242" r="34" strokeWidth="1.2" opacity=".6" />
        <circle cx="104" cy="242" r="4" fill={CHAIR} stroke="none" />
        <circle cx="172" cy="272" r="9" strokeWidth="2.4" />
        <path d="M172 272 L162 232" strokeWidth="2.4" />
        <path d="M90 150 q-8 0 -8 8 v52" strokeWidth="2.6" />
        <path d="M90 206 h64 l12 44" strokeWidth="2.6" />
      </g>

      {/* figure */}
      <circle cx="118" cy="60" r="17" fill={`url(#${uid}-body)`} />
      <ellipse cx="112" cy="54" rx="8" ry="10" fill={`url(#${uid}-sheen)`} />
      <rect x="110" y="74" width="13" height="16" rx="6" fill={`url(#${uid}-limb)`} />

      {/* torso */}
      <path d={TORSO} fill={`url(#${uid}-body)`} />
      <ellipse cx="106" cy="118" rx="16" ry="34" fill={`url(#${uid}-sheen)`} />
      {tint && <path d={TORSO} fill={tint} opacity=".34" />}

      {/* arm resting toward the lap */}
      <path
        d="M112 104 C114 132 120 150 140 162"
        fill="none"
        stroke={`url(#${uid}-limb)`}
        strokeWidth="13"
        strokeLinecap="round"
      />

      {/* thigh, lower leg, foot */}
      <path
        d="M104 178 C120 176 150 178 164 186 C158 196 130 196 108 196 C100 194 100 182 104 178 Z"
        fill={`url(#${uid}-limb)`}
      />
      <path
        d="M150 188 C154 210 156 234 158 256"
        fill="none"
        stroke={`url(#${uid}-limb)`}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <ellipse cx="162" cy="260" rx="16" ry="7" fill={`url(#${uid}-limb)`} />
    </g>
  );
}
