"use client";

import { useId } from "react";
import { COUNTRY_FLAGS, FlagOther, GlobeGraphic } from "@/components/quiz/QuizGraphics";

/**
 * Pseudo-3D adaptive-clothing avatar. A soft, stylised, inclusive figure
 * (never hyper-realistic) that reads as dimensional through gradient shading,
 * depth shadows, an animated sheen, gentle idle motion and a hover tilt. It
 * mirrors the user's answers:
 *  - persona   → adult / teen / older / care-support
 *  - seated    → seated posture with a wheelchair
 *  - zones     → glowing body regions the clothing needs to work for
 *  - garments  → clothing-type overlays (top / bottoms / dress / outerwear /
 *                base layer / footwear / not-sure orbiting icons)
 *  - accents   → soft fabric, one-handed, brace, medical, style sheen
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
  zones?: BodyZone[];
  garments?: Garment[];
  /** Active aesthetic style id (e.g. "old-money", "streetwear", "y2k"). */
  style?: string;
  /** Show a supportive helper figure (caregiver-assisted dressing). */
  helper?: boolean;
  /**
   * Country name / "Global" / "Other country" for the floating location badge,
   * drawn on the avatar's exact vertical centre line (independent of the helper).
   */
  locationFlag?: string;
  /** When true, body zones become tappable hotspots on the avatar. */
  interactive?: boolean;
  /** The currently focused zone (gets a stronger outline). */
  focusZone?: BodyZone;
  /** Called when a body zone hotspot is tapped/activated. */
  onZoneClick?: (zone: BodyZone) => void;
  accents?: {
    soft?: boolean;
    oneHanded?: boolean;
    brace?: boolean;
    medical?: boolean;
    style?: boolean;
  };
  className?: string;
}

// Highlight overlay coordinates for the STANDING figure.
const ZONES_STANDING: Record<BodyZone, JSX.Element> = {
  shoulders: (
    <>
      <ellipse cx="82" cy="118" rx="16" ry="11" />
      <ellipse cx="138" cy="118" rx="16" ry="11" />
    </>
  ),
  arms: (
    <>
      <rect x="56" y="120" width="16" height="74" rx="8" />
      <rect x="148" y="120" width="16" height="74" rx="8" />
    </>
  ),
  hands: (
    <>
      <circle cx="62" cy="206" r="12" />
      <circle cx="158" cy="206" r="12" />
    </>
  ),
  chest: <ellipse cx="110" cy="140" rx="34" ry="22" />,
  waist: <ellipse cx="110" cy="182" rx="30" ry="18" />,
  hips: <ellipse cx="110" cy="214" rx="34" ry="18" />,
  legs: (
    <>
      <rect x="86" y="226" width="18" height="74" rx="9" />
      <rect x="116" y="226" width="18" height="74" rx="9" />
    </>
  ),
  feet: (
    <>
      <ellipse cx="95" cy="306" rx="14" ry="9" />
      <ellipse cx="125" cy="306" rx="14" ry="9" />
    </>
  ),
  skin: <rect x="56" y="86" width="108" height="232" rx="40" />,
};

const ZONES_SEATED: Record<BodyZone, JSX.Element> = {
  shoulders: (
    <>
      <ellipse cx="82" cy="118" rx="16" ry="11" />
      <ellipse cx="138" cy="118" rx="16" ry="11" />
    </>
  ),
  arms: (
    <>
      <rect x="56" y="120" width="16" height="64" rx="8" />
      <rect x="148" y="120" width="16" height="64" rx="8" />
    </>
  ),
  hands: (
    <>
      <circle cx="62" cy="196" r="12" />
      <circle cx="158" cy="196" r="12" />
    </>
  ),
  chest: <ellipse cx="110" cy="140" rx="34" ry="22" />,
  waist: <ellipse cx="110" cy="182" rx="30" ry="16" />,
  hips: <ellipse cx="110" cy="210" rx="36" ry="16" />,
  legs: <rect x="84" y="208" width="68" height="22" rx="11" />,
  feet: (
    <>
      <ellipse cx="150" cy="262" rx="12" ry="14" />
      <ellipse cx="132" cy="262" rx="12" ry="14" />
    </>
  ),
  skin: <rect x="56" y="86" width="108" height="180" rx="40" />,
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

// Render order so smaller zones sit on top and stay tappable.
const HOTSPOT_ORDER: BodyZone[] = [
  "chest",
  "waist",
  "hips",
  "legs",
  "shoulders",
  "arms",
  "hands",
  "feet",
];

export default function BodyModel({
  persona = "adult",
  seated = false,
  zones = [],
  garments = [],
  style,
  helper = false,
  locationFlag,
  interactive = false,
  focusZone,
  onZoneClick,
  accents = {},
  className = "",
}: BodyModelProps) {
  // Unique per-instance id prefix so the two avatars on screen (desktop aside
  // + mobile band) never share gradient/filter/clip ids. Sharing ids made the
  // hidden instance's defs win and the visible avatar render unpainted.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const headR = persona === "teen" ? 19 : 21;
  const headCy = 86 - (persona === "teen" ? 4 : 0);
  const zoneSet = new Set(zones);
  const garmentSet = new Set(garments);
  const overlays = seated ? ZONES_SEATED : ZONES_STANDING;
  const skinFill = persona === "older" ? `url(#${uid}-skin-older)` : `url(#${uid}-skin)`;

  return (
    <svg
      viewBox="0 0 220 348"
      className={`bm-root ${className}`}
      role="img"
      aria-label="Adaptive clothing avatar that updates with your answers"
    >
      <defs>
        <radialGradient id={`${uid}-floor`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(118,83,110,.22)" />
          <stop offset="100%" stopColor="rgba(118,83,110,0)" />
        </radialGradient>
        <linearGradient id={`${uid}-garment`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A87FA0" />
          <stop offset=".55" stopColor="#7C5A74" />
          <stop offset="1" stopColor="#5E4357" />
        </linearGradient>
        <linearGradient id={`${uid}-pants`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6E5A66" />
          <stop offset="1" stopColor="#43343D" />
        </linearGradient>
        <radialGradient id={`${uid}-skin`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#F2D8BC" />
          <stop offset="1" stopColor="#DDB994" />
        </radialGradient>
        <radialGradient id={`${uid}-skin-older`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#EFD7C2" />
          <stop offset="1" stopColor="#D9BFA6" />
        </radialGradient>
        <radialGradient id={`${uid}-hl`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255,255,255,.16)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id={`${uid}-soft-lg`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id={`${uid}-torso-clip`}>
          <path d="M82 110c8-8 46-8 56 0 6 5 8 18 8 30 0 22-4 40-6 56H80c-2-16-6-34-6-56 0-12 2-25 8-30z" />
        </clipPath>
        <clipPath id={`${uid}-loc-clip`}>
          <circle cx="110" cy="36" r="16" />
        </clipPath>
      </defs>

      {/* soft pedestal */}
      <ellipse cx="110" cy="330" rx="80" ry="15" fill={`url(#${uid}-floor)`} />

      {/* idle-bobbing, hover-tilting figure */}
      <g className="bm-figure">
        {/* supportive helper figure (care persona or caregiver-assisted dressing) */}
        {(persona === "care" || helper) && (
          <g className="bm-accent">
            {/* soft "support" link between helper hand and the main avatar */}
            <path
              d="M168 150c-14 4-26 12-34 22"
              stroke="#B97861"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />
            <g opacity="0.5">
              <circle cx="176" cy="96" r="15" fill="#9D7594" />
              <path d="M158 200c0-32 8-62 18-62s18 30 18 62z" fill="#9D7594" />
              {/* extended supporting arm reaching toward the avatar */}
              <path d="M160 150c-10 4-18 12-22 22" stroke="#9D7594" strokeWidth="9" fill="none" strokeLinecap="round" />
              <circle cx="138" cy="172" r="5.5" fill="#E7C9A9" />
            </g>
            <text x="176" y="222" textAnchor="middle" className="bm-helper-label">
              support
            </text>
          </g>
        )}

        {seated && <Wheelchair />}

        {/* contact shadow under torso for depth */}
        <ellipse cx="113" cy="196" rx="42" ry="30" fill="rgba(41,36,31,.12)" filter={`url(#${uid}-soft)`} />

        {/* head with soft shading */}
        <circle cx="110" cy={headCy} r={headR} fill={skinFill} />
        <ellipse cx={104} cy={headCy - 5} rx={headR * 0.45} ry={headR * 0.5} fill="rgba(255,255,255,.28)" />
        {persona === "older" && (
          <path d={`M${110 - headR} ${headCy - 6} a${headR} ${headR} 0 0 1 ${headR * 2} 0`} fill="#ECE7E0" />
        )}
        {persona === "teen" && <path d="M92 74c4-10 32-10 36 0-6-3-30-3-36 0z" fill="#5C4A55" />}

        {/* torso garment */}
        <path
          d="M82 110c8-8 46-8 56 0 6 5 8 18 8 30 0 22-4 40-6 56H80c-2-16-6-34-6-56 0-12 2-25 8-30z"
          fill={`url(#${uid}-garment)`}
        />
        {/* soft, intentional torso shading — gentle right-side shadow and a
            diffuse left highlight (no hard white patch) */}
        <g clipPath={`url(#${uid}-torso-clip)`}>
          <ellipse cx="138" cy="156" rx="26" ry="52" fill="rgba(41,36,31,.18)" filter={`url(#${uid}-soft-lg)`} />
          <ellipse cx="96" cy="138" rx="20" ry="38" fill={`url(#${uid}-hl)`} filter={`url(#${uid}-soft-lg)`} />
        </g>

        {/* arms */}
        {seated ? (
          <>
            <path d="M84 120c-16 4-26 18-28 40l16 4c4-18 10-28 20-32z" fill={skinFill} />
            <path d="M136 120c16 4 26 18 28 40l-16 4c-4-18-10-28-20-32z" fill={skinFill} />
            <circle cx="62" cy="196" r="9" fill={skinFill} />
            <circle cx="158" cy="196" r="9" fill={skinFill} />
          </>
        ) : (
          <>
            <path d="M82 116c-18 2-26 16-28 78l16 2c4-44 8-58 18-66z" fill={skinFill} />
            <path d="M138 116c18 2 26 16 28 78l-16 2c-4-44-8-58-18-66z" fill={skinFill} />
            <circle cx="62" cy="206" r="10" fill={skinFill} />
            <circle cx="158" cy="206" r="10" fill={skinFill} />
          </>
        )}

        {/* lower body */}
        {seated ? (
          <>
            <path d="M82 196h56c4 0 6 4 6 10v14H76v-14c0-6 2-10 6-10z" fill={`url(#${uid}-pants)`} />
            <rect x="120" y="220" width="18" height="44" rx="8" fill={`url(#${uid}-pants)`} />
            <rect x="92" y="220" width="18" height="44" rx="8" fill={`url(#${uid}-pants)`} />
            <ellipse cx="129" cy="268" rx="13" ry="7" fill="#3E3038" />
            <ellipse cx="101" cy="268" rx="13" ry="7" fill="#3E3038" />
          </>
        ) : (
          <>
            <rect x="86" y="196" width="20" height="108" rx="10" fill={`url(#${uid}-pants)`} />
            <rect x="114" y="196" width="20" height="108" rx="10" fill={`url(#${uid}-pants)`} />
            <ellipse cx="95" cy="308" rx="15" ry="8" fill="#3E3038" />
            <ellipse cx="125" cy="308" rx="15" ry="8" fill="#3E3038" />
          </>
        )}

        {/* ---- aesthetic style transformation ---- */}
        {style && <StyleLayer style={style} seated={seated} headCy={headCy} uid={uid} />}

        {/* ---- clothing-type overlays ---- */}
        <GarmentOverlays garments={garmentSet} seated={seated} />

        {/* soft-fabric accent */}
        {accents.soft && (
          <path
            d="M76 108c10-12 58-12 68 0 8 8 10 24 10 38 0 26-6 48-8 64H74c-2-16-8-38-8-64 0-14 2-30 10-38z"
            fill="none"
            stroke="#B97861"
            strokeWidth="2"
            strokeDasharray="3 5"
            opacity=".85"
          />
        )}

        {/* medical access marker */}
        {accents.medical && (
          <g className="bm-accent">
            <circle cx="124" cy="170" r="9" fill="#FCF9F2" stroke="#76536E" strokeWidth="2" />
            <path d="M124 165v10M119 170h10" stroke="#76536E" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* brace accent */}
        {accents.brace && (
          <g stroke="#29241F" strokeWidth="2" opacity=".85" fill="none" className="bm-accent">
            {seated ? (
              <path d="M122 226h14M122 234h14M122 244h14" />
            ) : (
              <path d="M116 250h16M116 262h16M116 276h16" />
            )}
          </g>
        )}

        {/* one-handed focus ring */}
        {accents.oneHanded && (
          <circle cx="62" cy={seated ? 196 : 206} r="16" fill="none" stroke="#B97861" strokeWidth="2.5" className="bm-accent" />
        )}

        {/* zone highlights */}
        <g>
          {Array.from(zoneSet).map((zone) => (
            <g
              key={zone}
              fill={zone === "skin" ? "rgba(185,120,97,.16)" : "rgba(118,83,110,.34)"}
              stroke={zone === "skin" ? "#B97861" : "#76536E"}
              strokeWidth="2"
              className="bm-zone"
            >
              {overlays[zone]}
            </g>
          ))}
        </g>

        {/* interactive tappable hotspots on the avatar */}
        {interactive && (
          <g>
            {HOTSPOT_ORDER.map((zone) => (
              <g
                key={zone}
                className="bm-hotspot"
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
                <g className="bm-hit">{overlays[zone]}</g>
              </g>
            ))}
          </g>
        )}
      </g>

      {/* orbiting clothing icons for "not sure" */}
      {garmentSet.has("notsure") && <OrbitingGarments />}

      {/* Floating location badge, drawn in the avatar's own coordinate space at
          x=110 — the exact vertical centre line of head/torso/legs/shadow. It
          sits OUTSIDE the figure group so it never tilts or shifts with the
          helper figure, guaranteeing it stays centred over the main avatar. */}
      {locationFlag && <LocationBadge country={locationFlag} uid={uid} />}

      <style>{`
        .bm-figure { transform-box: fill-box; transform-origin: 50% 100%; animation: bmBob 4.5s ease-in-out infinite; transition: transform .5s ease; }
        .bm-root:hover .bm-figure { transform: rotate(1.4deg) translateY(-2px); }
        .bm-zone { animation: bmPulse 1.8s ease-in-out infinite; }
        .bm-accent { animation: bmPop .45s cubic-bezier(.16,1,.3,1) both; }
        .bm-orbit { transform-box: view-box; transform-origin: 110px 180px; animation: bmSpin 18s linear infinite; }
        .bm-hotspot { cursor: pointer; outline: none; }
        .bm-hit { pointer-events: all; fill: rgba(118,83,110,0); stroke: rgba(118,83,110,0); stroke-width: 2; transition: fill .18s ease, stroke .18s ease; }
        .bm-hotspot:hover > .bm-hit, .bm-hotspot:focus-visible > .bm-hit { fill: rgba(118,83,110,.16); stroke: rgba(118,83,110,.55); }
        .bm-hotspot[data-active="true"] > .bm-hit { fill: rgba(118,83,110,.26); stroke: #76536E; }
        .bm-helper-label { font: 600 9px Helvetica, Arial, sans-serif; fill: #9D7594; letter-spacing: .08em; text-transform: uppercase; opacity: .7; }
        .bm-locbadge { transform-box: view-box; transform-origin: 110px 36px; animation: bmFloat 3.6s ease-in-out infinite; }
        @keyframes bmBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes bmFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes bmPulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }
        @keyframes bmPop { from { opacity:0; transform: scale(.6); } to { opacity:1; transform: scale(1); } }
        @keyframes bmSpin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .bm-figure, .bm-zone, .bm-accent, .bm-orbit, .bm-locbadge { animation: none; }
          .bm-root:hover .bm-figure { transform: none; }
        }
      `}</style>
    </svg>
  );
}

/** Location badge drawn at the avatar's centre line (x=110), above the head. */
function LocationBadge({ country, uid }: { country: string; uid: string }) {
  const Flag =
    country === "Global"
      ? GlobeGraphic
      : country === "Other country"
        ? FlagOther
        : COUNTRY_FLAGS[country] ?? FlagOther;
  return (
    <g className="bm-locbadge">
      {/* soft drop shadow */}
      <ellipse cx="110" cy="40" rx="18" ry="18" fill="rgba(41,36,31,.16)" filter={`url(#${uid}-soft)`} />
      {/* downward pointer toward the head */}
      <path d="M110 62 L103 49 L117 49 Z" fill="#FCF9F2" stroke="rgba(41,36,31,.12)" strokeWidth="1" />
      {/* badge plate */}
      <circle cx="110" cy="36" r="18" fill="#FCF9F2" />
      {/* flag, centred in the badge and clipped to a circle */}
      <g clipPath={`url(#${uid}-loc-clip)`}>
        <g transform="translate(90 16)">
          <Flag size={40} />
        </g>
      </g>
      {/* crisp ring */}
      <circle cx="110" cy="36" r="18" fill="none" stroke="#FCF9F2" strokeWidth="2.5" />
      <circle cx="110" cy="36" r="18" fill="none" stroke="rgba(41,36,31,.14)" strokeWidth="1" />
    </g>
  );
}

function GarmentOverlays({ garments, seated }: { garments: Set<Garment>; seated: boolean }) {
  const accent = "#B97861";
  return (
    <g className="bm-accent" fill="none" stroke={accent} strokeWidth="2.4" strokeLinejoin="round">
      {garments.has("top") && (
        <>
          {/* collar + sleeve caps highlight */}
          <path d="M96 112q14-9 28 0" />
          <path d="M84 116l-8 16M136 116l8 16" />
          <path d="M84 150h52" opacity=".6" />
        </>
      )}
      {garments.has("bottoms") &&
        (seated ? (
          <path d="M88 206h44M92 220v40M128 220v40" />
        ) : (
          <path d="M90 200h40M96 206v96M124 206v96" />
        ))}
      {garments.has("dress") && !seated && (
        <path d="M86 118q24-10 48 0l14 96q-38 14-76 0z" stroke={accent} fill="rgba(185,120,97,.12)" />
      )}
      {garments.has("outerwear") && (
        <>
          <path d="M104 112l-16 8 4 84M116 112l16 8-4 84" />
          <path d="M104 112l6 12 6-12" />
        </>
      )}
      {garments.has("baselayer") && (
        <path
          d="M88 116q22-8 44 0l4 80q-26 8-52 0z"
          strokeDasharray="2 4"
          opacity=".8"
        />
      )}
      {garments.has("footwear") &&
        (seated ? (
          <>
            <path d="M118 262h22a4 4 0 0 1 4 4M90 262h22a4 4 0 0 1 4 4" stroke={accent} />
            <ellipse cx="129" cy="268" rx="15" ry="9" stroke={accent} />
            <ellipse cx="101" cy="268" rx="15" ry="9" stroke={accent} />
          </>
        ) : (
          <>
            <path d="M82 302h26a6 6 0 0 1 6 6M112 302h26a6 6 0 0 1 6 6" stroke={accent} />
            <ellipse cx="95" cy="308" rx="17" ry="10" stroke={accent} />
            <ellipse cx="125" cy="308" rx="17" ry="10" stroke={accent} />
          </>
        ))}
    </g>
  );
}

function OrbitingGarments() {
  const icons = [
    { x: 168, y: 120, d: "M-7 -5 l4 -3 6 0 4 3 -3 4 -2 -1 0 9 -8 0 0 -9 -2 1z" }, // top
    { x: 176, y: 196, d: "M-6 -8 h12 v4 l-3 12 h-2 l-1 -10 -1 10 h-2 l-3 -12z" }, // bottoms
    { x: 150, y: 254, d: "M-8 -2 h10 a3 3 0 0 1 3 3 h-13z" }, // shoe
    { x: 52, y: 150, d: "M-6 -6 l3 -2 6 0 3 2 -2 3 -2 -1 0 8 -6 0 0 -8 -2 1z" }, // top 2
  ];
  return (
    <g className="bm-orbit">
      {icons.map((ic, i) => (
        <g key={i} transform={`translate(${ic.x} ${ic.y})`}>
          <circle r="13" fill="#FCF9F2" stroke="#E7DAC4" strokeWidth="1.5" />
          <path d={ic.d} fill="none" stroke="#76536E" strokeWidth="1.6" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}

/* ----------------------- aesthetic style transformation ------------------ */

const TORSO_PATH =
  "M82 110c8-8 46-8 56 0 6 5 8 18 8 30 0 22-4 40-6 56H80c-2-16-6-34-6-56 0-12 2-25 8-30z";

interface Palette {
  base: string;
  dark: string;
  light: string;
  accent: string;
}

const STYLE_PALETTE: Record<string, Palette> = {
  "old-money": { base: "#2D3B50", dark: "#1F2A3B", light: "#41526B", accent: "#C9A24A" },
  clean: { base: "#E8E3D9", dark: "#CBC3B4", light: "#F5F1E9", accent: "#9A9082" },
  chic: { base: "#2A2630", dark: "#191620", light: "#3C3645", accent: "#C9A24A" },
  streetwear: { base: "#3C4F73", dark: "#2A3A57", light: "#52688F", accent: "#E8B04B" },
  minimal: { base: "#9C958C", dark: "#827B72", light: "#B6B0A7", accent: "#6E665E" },
  sporty: { base: "#2F726B", dark: "#205049", light: "#3FA093", accent: "#E8B04B" },
  formal: { base: "#33323B", dark: "#222129", light: "#45444F", accent: "#B8B2C0" },
  y2k: { base: "#E58FB5", dark: "#C76E99", light: "#F7BBD6", accent: "#6FA8E5" },
  "soft-cozy": { base: "#C49A74", dark: "#A87E59", light: "#DEBA96", accent: "#7C5034" },
  elegant: { base: "#6E4B66", dark: "#523649", light: "#90698A", accent: "#E0D2E0" },
  casual: { base: "#6E7E94", dark: "#566379", light: "#8E9DB1", accent: "#E7DAC4" },
  modest: { base: "#5E6B6A", dark: "#45504F", light: "#788481", accent: "#C9BCA9" },
  trendy: { base: "#B5604F", dark: "#8E4639", light: "#D27C68", accent: "#E8B04B" },
  default: { base: "#7C5A74", dark: "#5E4357", light: "#A87FA0", accent: "#B97861" },
};

function Star({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI) / 4 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad}`);
  }
  return <polygon points={pts.join(" ")} fill={fill} />;
}

function StyleLayer({
  style,
  seated,
  headCy,
  uid,
}: {
  style: string;
  seated: boolean;
  headCy: number;
  uid: string;
}) {
  const p = STYLE_PALETTE[style] ?? STYLE_PALETTE.default;
  const feet = seated
    ? [
        { x: 101, y: 268 },
        { x: 129, y: 268 },
      ]
    : [
        { x: 95, y: 308 },
        { x: 125, y: 308 },
      ];

  const Sneakers = (
    <g>
      {feet.map((f, i) => (
        <g key={i}>
          <ellipse cx={f.x} cy={f.y} rx="16" ry="9" fill="#F4F0E8" stroke={p.dark} strokeWidth="1.5" />
          <path d={`M${f.x - 12} ${f.y} h24`} stroke={p.accent} strokeWidth="2.5" />
        </g>
      ))}
    </g>
  );

  return (
    <g className="bm-accent">
      {/* longline / coat styles paint a longer body first */}
      {style === "modest" && (
        <path d="M80 110q30-8 60 0l5 150h-70z" fill={p.base} />
      )}

      {/* recoloured torso for the chosen aesthetic, with soft diffuse shading */}
      <path d={TORSO_PATH} fill={p.base} />
      <g clipPath={`url(#${uid}-torso-clip)`}>
        <ellipse cx="138" cy="156" rx="26" ry="52" fill="rgba(0,0,0,.20)" filter={`url(#${uid}-soft-lg)`} />
        <ellipse cx="96" cy="138" rx="20" ry="38" fill={`url(#${uid}-hl)`} filter={`url(#${uid}-soft-lg)`} />
      </g>

      {/* signature overlay per style */}
      {(style === "old-money" || style === "formal") && (
        <g>
          <path d="M110 112 94 112 90 158 106 150Z" fill={p.dark} />
          <path d="M110 112 126 112 130 158 114 150Z" fill={p.dark} />
          <path d="M104 116 110 152 116 116Z" fill="#EDE7DA" />
          {style === "formal" ? (
            <path d="M107 120 113 120 112 152 110 160 108 152Z" fill={p.accent} />
          ) : (
            <>
              <circle cx="110" cy="160" r="2" fill={p.accent} />
              <circle cx="110" cy="170" r="2" fill={p.accent} />
              <rect x="120" y="150" width="9" height="6" fill={p.accent} />
            </>
          )}
        </g>
      )}

      {style === "clean" && (
        <g fill="none" stroke={p.accent} strokeWidth="2">
          <path d="M101 114q9 6 18 0" />
          <rect x="119" y="150" width="11" height="12" rx="1" />
        </g>
      )}

      {style === "chic" && (
        <g>
          <path d="M101 114q9 6 18 0" fill="none" stroke={p.dark} strokeWidth="2" />
          <rect x="80" y="178" width="60" height="5" fill={p.dark} />
          <rect x="106" y="178" width="8" height="5" fill={p.accent} />
          {/* sleek sunglasses */}
          <g>
            <rect x={110 - 13} y={headCy - 2} width="10" height="6" rx="2" fill={p.dark} />
            <rect x={110 + 3} y={headCy - 2} width="10" height="6" rx="2" fill={p.dark} />
            <path d={`M${110 - 3} ${headCy + 1}h6`} stroke={p.dark} strokeWidth="1.5" />
          </g>
        </g>
      )}

      {style === "streetwear" && (
        <g>
          {/* hood */}
          <path d="M90 110q20-17 40 0q-20 9-40 0z" fill={p.dark} />
          {/* drawstrings */}
          <path d="M104 122v18M116 122v18" stroke={p.accent} strokeWidth="2" />
          <circle cx="104" cy="142" r="2.2" fill={p.accent} />
          <circle cx="116" cy="142" r="2.2" fill={p.accent} />
          {/* kangaroo pocket */}
          <path d="M90 166h40v16H90z" fill="rgba(0,0,0,.20)" />
          {/* graphic patch */}
          <rect x="100" y="148" width="20" height="13" rx="2" fill={p.accent} opacity="0.85" />
          {Sneakers}
        </g>
      )}

      {style === "sporty" && (
        <g>
          <path d="M80 148 140 136" stroke={p.accent} strokeWidth="4" fill="none" />
          <path d="M80 158 140 146" stroke={p.light} strokeWidth="3" fill="none" />
          <path d="M50 150h-9M50 160h-12M50 170h-9" stroke={p.accent} strokeWidth="2" />
          {Sneakers}
        </g>
      )}

      {style === "y2k" && (
        <g>
          <ellipse cx="100" cy="142" rx="9" ry="18" fill="rgba(255,255,255,.28)" />
          <path d="M82 150 140 162" stroke={p.accent} strokeWidth="4" fill="none" />
          <Star cx={124} cy={148} r={5} fill={p.accent} />
          <Star cx={94} cy={170} r={4} fill="#FCF9F2" />
          <Star cx={118} cy={178} r={3} fill={p.accent} />
        </g>
      )}

      {style === "soft-cozy" && (
        <g>
          <path d={TORSO_PATH} fill="none" stroke={p.light} strokeWidth="3" strokeDasharray="2 4" />
          <path d="M104 114 110 130 116 114" fill="none" stroke={p.dark} strokeWidth="2.5" />
          <path d="M105 114v82M115 114v82" stroke={p.dark} strokeWidth="2" />
          <circle cx="110" cy="146" r="2" fill={p.accent} />
          <circle cx="110" cy="160" r="2" fill={p.accent} />
          <circle cx="110" cy="174" r="2" fill={p.accent} />
        </g>
      )}

      {style === "elegant" && (
        <g>
          <path d="M84 176q26 10 52 0l9 58q-35 16-70 0z" fill={p.base} opacity="0.92" />
          <path d="M84 176q26 10 52 0" fill="none" stroke={p.light} strokeWidth="2" />
          <path d="M102 116q8 9 16 0" fill="none" stroke={p.accent} strokeWidth="1.5" />
          <circle cx="110" cy="125" r="2" fill={p.accent} />
        </g>
      )}

      {style === "casual" && (
        <g>
          <path d="M101 114q9 6 18 0" fill="none" stroke={p.dark} strokeWidth="2" />
          <path d="M80 150h60" stroke={p.light} strokeWidth="3" opacity="0.55" />
        </g>
      )}

      {style === "modest" && (
        <g>
          <path d="M100 108q10-4 20 0v9q-10 4-20 0z" fill={p.dark} />
          <path d="M110 120v138" stroke={p.dark} strokeWidth="2" />
          <path d="M80 196h60" stroke={p.dark} strokeWidth="2" opacity="0.5" />
        </g>
      )}

      {style === "minimal" && (
        <g>
          <path d="M101 114q9 6 18 0" fill="none" stroke={p.dark} strokeWidth="2" />
        </g>
      )}

      {style === "trendy" && (
        <g>
          <path d="M110 110 138 120 138 174 110 196Z" fill={p.accent} opacity="0.8" />
          <path d="M88 114 142 188" stroke={p.dark} strokeWidth="4" fill="none" />
          <rect x="134" y="182" width="15" height="13" rx="3" fill={p.dark} />
        </g>
      )}
    </g>
  );
}

function Wheelchair() {
  return (
    <g stroke="#4A3A44" strokeWidth="3.5" fill="none" strokeLinecap="round">
      <circle cx="129" cy="262" r="34" fill="rgba(74,58,68,.06)" />
      <circle cx="129" cy="262" r="10" fill="#4A3A44" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={129}
            y1={262}
            x2={129 + Math.cos(a) * 32}
            y2={262 + Math.sin(a) * 32}
            strokeWidth="1.5"
          />
        );
      })}
      <circle cx="92" cy="286" r="12" fill="#4A3A44" />
      <path d="M76 196v40M76 236h70" />
      <path d="M146 220l8 30" />
    </g>
  );
}
