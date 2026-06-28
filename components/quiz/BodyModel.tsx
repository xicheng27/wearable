"use client";

/**
 * Lightweight pseudo-3D adaptive-clothing model. A soft, stylised, inclusive
 * figure (never hyper-realistic) that changes with the user's answers:
 *  - persona  → adult / teen / older / care-support
 *  - seated   → switches to a seated posture with a wheelchair
 *  - zones    → highlights body regions the clothing needs to work for
 *  - accents  → soft fabric overlay, one-handed focus, brace, style sheen
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

export interface BodyModelProps {
  persona?: Persona;
  seated?: boolean;
  zones?: BodyZone[];
  accents?: {
    soft?: boolean;
    oneHanded?: boolean;
    brace?: boolean;
    medical?: boolean;
    style?: boolean;
  };
  className?: string;
}

const GARMENT = "#7C5A74";
const GARMENT_LIGHT = "#9D7594";
const SKIN = "#E7C9A9";
const SKIN_OLDER = "#E4CDB6";
const PANTS = "#5C4A55";

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

export default function BodyModel({
  persona = "adult",
  seated = false,
  zones = [],
  accents = {},
  className = "",
}: BodyModelProps) {
  const skin = persona === "older" ? SKIN_OLDER : SKIN;
  const headR = persona === "teen" ? 19 : 21;
  const zoneSet = new Set(zones);
  const overlays = seated ? ZONES_SEATED : ZONES_STANDING;

  return (
    <svg
      viewBox="0 0 220 340"
      className={className}
      role="img"
      aria-label="Adaptive clothing model that updates with your answers"
    >
      <defs>
        <radialGradient id="bm-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(118,83,110,.18)" />
          <stop offset="100%" stopColor="rgba(118,83,110,0)" />
        </radialGradient>
        <linearGradient id="bm-garment" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GARMENT_LIGHT} />
          <stop offset="1" stopColor={GARMENT} />
        </linearGradient>
        <linearGradient id="bm-style" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,.6)" />
          <stop offset=".5" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* soft pedestal */}
      <ellipse cx="110" cy="322" rx="78" ry="16" fill="url(#bm-floor)" />

      {/* care-support helper figure behind */}
      {persona === "care" && (
        <g opacity="0.5">
          <circle cx="168" cy="96" r="15" fill={GARMENT_LIGHT} />
          <path d="M150 196c0-30 8-58 18-58s18 28 18 58z" fill={GARMENT_LIGHT} />
          <path d="M150 150c-10 6-16 18-14 30" stroke={GARMENT_LIGHT} strokeWidth="9" fill="none" strokeLinecap="round" />
        </g>
      )}

      {seated && <Wheelchair />}

      {/* head */}
      <circle cx="110" cy={86 - (persona === "teen" ? 4 : 0)} r={headR} fill={skin} />
      {persona === "older" && (
        <path
          d={`M${110 - headR} ${80} a${headR} ${headR} 0 0 1 ${headR * 2} 0`}
          fill="#E9E4DD"
        />
      )}
      {persona === "teen" && (
        <path d="M92 74c4-10 32-10 36 0-6-3-30-3-36 0z" fill="#5C4A55" />
      )}

      {/* torso garment */}
      <path
        d="M82 110c8-8 46-8 56 0 6 5 8 18 8 30 0 22-4 40-6 56H80c-2-16-6-34-6-56 0-12 2-25 8-30z"
        fill="url(#bm-garment)"
      />

      {/* arms */}
      {seated ? (
        <>
          <path d="M84 120c-16 4-26 18-28 40l16 4c4-18 10-28 20-32z" fill={skin} />
          <path d="M136 120c16 4 26 18 28 40l-16 4c-4-18-10-28-20-32z" fill={skin} />
          <circle cx="62" cy="196" r="9" fill={skin} />
          <circle cx="158" cy="196" r="9" fill={skin} />
        </>
      ) : (
        <>
          <path d="M82 116c-18 2-26 16-28 78l16 2c4-44 8-58 18-66z" fill={skin} />
          <path d="M138 116c18 2 26 16 28 78l-16 2c-4-44-8-58-18-66z" fill={skin} />
          <circle cx="62" cy="206" r="10" fill={skin} />
          <circle cx="158" cy="206" r="10" fill={skin} />
        </>
      )}

      {/* lower body */}
      {seated ? (
        <>
          {/* seat / thighs */}
          <path d="M82 196h56c4 0 6 4 6 10v14H76v-14c0-6 2-10 6-10z" fill={PANTS} />
          {/* shins down to footplate */}
          <rect x="120" y="220" width="18" height="44" rx="8" fill={PANTS} />
          <rect x="92" y="220" width="18" height="44" rx="8" fill={PANTS} />
          <ellipse cx="129" cy="268" rx="13" ry="7" fill="#3E3038" />
          <ellipse cx="101" cy="268" rx="13" ry="7" fill="#3E3038" />
        </>
      ) : (
        <>
          <rect x="86" y="196" width="20" height="108" rx="10" fill={PANTS} />
          <rect x="114" y="196" width="20" height="108" rx="10" fill={PANTS} />
          <ellipse cx="95" cy="308" rx="15" ry="8" fill="#3E3038" />
          <ellipse cx="125" cy="308" rx="15" ry="8" fill="#3E3038" />
        </>
      )}

      {/* style sheen overlay */}
      {accents.style && (
        <path
          d="M82 110c8-8 46-8 56 0 6 5 8 18 8 30 0 22-4 40-6 56H80c-2-16-6-34-6-56 0-12 2-25 8-30z"
          fill="url(#bm-style)"
        />
      )}

      {/* soft-fabric accent: gentle dashed comfort outline */}
      {accents.soft && (
        <path
          d="M76 108c10-12 58-12 68 0 8 8 10 24 10 38 0 26-6 48-8 64H74c-2-16-8-38-8-64 0-14 2-30 10-38z"
          fill="none"
          stroke="#B97861"
          strokeWidth="2"
          strokeDasharray="3 5"
          opacity=".8"
        />
      )}

      {/* medical access marker on torso */}
      {accents.medical && (
        <g>
          <circle cx="124" cy="170" r="9" fill="#FCF9F2" stroke="#76536E" strokeWidth="2" />
          <path d="M124 165v10M119 170h10" stroke="#76536E" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* brace accent on lower leg */}
      {accents.brace && (
        <g stroke="#29241F" strokeWidth="2" opacity=".8" fill="none">
          {seated ? (
            <>
              <path d="M122 226h14M122 234h14M122 244h14" />
            </>
          ) : (
            <>
              <path d="M116 250h16M116 262h16M116 276h16" />
            </>
          )}
        </g>
      )}

      {/* one-handed focus ring */}
      {accents.oneHanded && (
        <circle
          cx={seated ? 62 : 62}
          cy={seated ? 196 : 206}
          r="16"
          fill="none"
          stroke="#B97861"
          strokeWidth="2.5"
        />
      )}

      {/* zone highlights */}
      <g className="bm-zones">
        {Array.from(zoneSet).map((zone) => (
          <g
            key={zone}
            fill={zone === "skin" ? "rgba(185,120,97,.18)" : "rgba(118,83,110,.32)"}
            stroke={zone === "skin" ? "#B97861" : "#76536E"}
            strokeWidth="2"
            className="bm-zone"
          >
            {overlays[zone]}
          </g>
        ))}
      </g>

      <style>{`
        .bm-zone { animation: bmPulse 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .bm-zone { animation: none; } }
        @keyframes bmPulse {
          0%, 100% { opacity: .55; }
          50% { opacity: 1; }
        }
      `}</style>
    </svg>
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
