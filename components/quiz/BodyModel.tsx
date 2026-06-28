"use client";

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

export default function BodyModel({
  persona = "adult",
  seated = false,
  zones = [],
  garments = [],
  accents = {},
  className = "",
}: BodyModelProps) {
  const headR = persona === "teen" ? 19 : 21;
  const headCy = 86 - (persona === "teen" ? 4 : 0);
  const zoneSet = new Set(zones);
  const garmentSet = new Set(garments);
  const overlays = seated ? ZONES_SEATED : ZONES_STANDING;
  const skinFill = persona === "older" ? "url(#bm-skin-older)" : "url(#bm-skin)";

  return (
    <svg
      viewBox="0 0 220 348"
      className={`bm-root ${className}`}
      role="img"
      aria-label="Adaptive clothing avatar that updates with your answers"
    >
      <defs>
        <radialGradient id="bm-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(118,83,110,.22)" />
          <stop offset="100%" stopColor="rgba(118,83,110,0)" />
        </radialGradient>
        <linearGradient id="bm-garment" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A87FA0" />
          <stop offset=".55" stopColor="#7C5A74" />
          <stop offset="1" stopColor="#5E4357" />
        </linearGradient>
        <linearGradient id="bm-pants" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6E5A66" />
          <stop offset="1" stopColor="#43343D" />
        </linearGradient>
        <radialGradient id="bm-skin" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#F2D8BC" />
          <stop offset="1" stopColor="#DDB994" />
        </radialGradient>
        <radialGradient id="bm-skin-older" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#EFD7C2" />
          <stop offset="1" stopColor="#D9BFA6" />
        </radialGradient>
        <linearGradient id="bm-style" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,.7)" />
          <stop offset=".5" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="bm-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset=".5" stopColor="rgba(255,255,255,.5)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="bm-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <clipPath id="bm-torso-clip">
          <path d="M82 110c8-8 46-8 56 0 6 5 8 18 8 30 0 22-4 40-6 56H80c-2-16-6-34-6-56 0-12 2-25 8-30z" />
        </clipPath>
      </defs>

      {/* soft pedestal */}
      <ellipse cx="110" cy="330" rx="80" ry="15" fill="url(#bm-floor)" />

      {/* idle-bobbing, hover-tilting figure */}
      <g className="bm-figure">
        {/* care-support helper figure behind */}
        {persona === "care" && (
          <g opacity="0.45" filter="url(#bm-soft)">
            <circle cx="170" cy="98" r="15" fill="#A87FA0" />
            <path d="M152 196c0-30 8-58 18-58s18 28 18 58z" fill="#A87FA0" />
            <path d="M152 150c-10 6-16 18-14 30" stroke="#A87FA0" strokeWidth="9" fill="none" strokeLinecap="round" />
          </g>
        )}

        {seated && <Wheelchair />}

        {/* contact shadow under torso for depth */}
        <ellipse cx="113" cy="196" rx="42" ry="30" fill="rgba(41,36,31,.12)" filter="url(#bm-soft)" />

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
          fill="url(#bm-garment)"
        />
        {/* torso inner shadow (right) + highlight (left) for volume */}
        <g clipPath="url(#bm-torso-clip)">
          <rect x="120" y="104" width="40" height="100" fill="rgba(41,36,31,.16)" />
          <rect x="74" y="104" width="22" height="100" fill="rgba(255,255,255,.14)" />
          {/* animated sheen sweep */}
          <rect className="bm-sheen" x="-40" y="100" width="34" height="110" fill="url(#bm-sheen)" />
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
            <path d="M82 196h56c4 0 6 4 6 10v14H76v-14c0-6 2-10 6-10z" fill="url(#bm-pants)" />
            <rect x="120" y="220" width="18" height="44" rx="8" fill="url(#bm-pants)" />
            <rect x="92" y="220" width="18" height="44" rx="8" fill="url(#bm-pants)" />
            <ellipse cx="129" cy="268" rx="13" ry="7" fill="#3E3038" />
            <ellipse cx="101" cy="268" rx="13" ry="7" fill="#3E3038" />
          </>
        ) : (
          <>
            <rect x="86" y="196" width="20" height="108" rx="10" fill="url(#bm-pants)" />
            <rect x="114" y="196" width="20" height="108" rx="10" fill="url(#bm-pants)" />
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
      </g>

      {/* orbiting clothing icons for "not sure" */}
      {garmentSet.has("notsure") && <OrbitingGarments />}

      <style>{`
        .bm-figure { transform-box: fill-box; transform-origin: 50% 100%; animation: bmBob 4.5s ease-in-out infinite; transition: transform .5s ease; }
        .bm-root:hover .bm-figure { transform: rotate(1.4deg) translateY(-2px); }
        .bm-zone { animation: bmPulse 1.8s ease-in-out infinite; }
        .bm-accent { animation: bmPop .45s cubic-bezier(.16,1,.3,1) both; }
        .bm-sheen { animation: bmSheen 5.5s ease-in-out infinite; }
        .bm-orbit { transform-box: view-box; transform-origin: 110px 180px; animation: bmSpin 18s linear infinite; }
        @keyframes bmBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes bmPulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }
        @keyframes bmPop { from { opacity:0; transform: scale(.6); } to { opacity:1; transform: scale(1); } }
        @keyframes bmSheen { 0%,18% { transform: translateX(0); } 38%,100% { transform: translateX(150px); } }
        @keyframes bmSpin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .bm-figure, .bm-zone, .bm-accent, .bm-sheen, .bm-orbit { animation: none; }
          .bm-root:hover .bm-figure { transform: none; }
        }
      `}</style>
    </svg>
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
