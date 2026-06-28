/**
 * Proper SVG graphics for the quiz: country flags, a globe, and adaptive-need
 * icons. No emoji are used anywhere as core UI graphics.
 */

type IconProps = { className?: string; size?: number };

function frame(size: number, children: React.ReactNode, rounded = true) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      role="img"
      aria-hidden="true"
      className="block"
    >
      {rounded && (
        <defs>
          <clipPath id="flag-rounded">
            <rect x="4" y="8" width="28" height="20" rx="3" />
          </clipPath>
        </defs>
      )}
      {children}
    </svg>
  );
}

/* ----------------------------- Country flags ----------------------------- */

export function FlagSingapore({ size = 36 }: IconProps) {
  return frame(
    size,
    <g clipPath="url(#flag-rounded)">
      <rect x="4" y="8" width="28" height="10" fill="#EE2536" />
      <rect x="4" y="18" width="28" height="10" fill="#fff" />
      <circle cx="12" cy="13" r="3.4" fill="#fff" />
      <circle cx="13.4" cy="13" r="3.4" fill="#EE2536" />
      {[
        [15.7, 10.8],
        [18.1, 11.6],
        [13.9, 11.6],
        [17.2, 14],
        [14.8, 14],
      ].map(([cx, cy], i) => (
        <Star key={i} cx={cx} cy={cy} r={0.9} fill="#fff" />
      ))}
      <rect x="4" y="8" width="28" height="20" rx="3" fill="none" stroke="rgba(41,36,31,.18)" />
    </g>
  );
}

export function FlagUnitedStates({ size = 36 }: IconProps) {
  return frame(
    size,
    <g clipPath="url(#flag-rounded)">
      <rect x="4" y="8" width="28" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8].map((i) => (
        <rect key={i} x="4" y={8 + i * 2} width="28" height="2" fill="#B22234" />
      ))}
      <rect x="4" y="8" width="12" height="11" fill="#3C3B6E" />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle
          key={i}
          cx={5.6 + (i % 4) * 3}
          cy={9.8 + Math.floor(i / 4) * 3}
          r={0.55}
          fill="#fff"
        />
      ))}
      <rect x="4" y="8" width="28" height="20" rx="3" fill="none" stroke="rgba(41,36,31,.18)" />
    </g>
  );
}

export function FlagUnitedKingdom({ size = 36 }: IconProps) {
  return frame(
    size,
    <g clipPath="url(#flag-rounded)">
      <rect x="4" y="8" width="28" height="20" fill="#012169" />
      <path d="M4 8 32 28M32 8 4 28" stroke="#fff" strokeWidth="4" />
      <path d="M4 8 32 28M32 8 4 28" stroke="#C8102E" strokeWidth="1.8" />
      <path d="M18 8V28M4 18H32" stroke="#fff" strokeWidth="6" />
      <path d="M18 8V28M4 18H32" stroke="#C8102E" strokeWidth="3" />
      <rect x="4" y="8" width="28" height="20" rx="3" fill="none" stroke="rgba(41,36,31,.18)" />
    </g>
  );
}

export function FlagCanada({ size = 36 }: IconProps) {
  return frame(
    size,
    <g clipPath="url(#flag-rounded)">
      <rect x="4" y="8" width="28" height="20" fill="#fff" />
      <rect x="4" y="8" width="7" height="20" fill="#D80621" />
      <rect x="25" y="8" width="7" height="20" fill="#D80621" />
      <path
        d="M18 12.4l1 2 2-.6-1 2 1.8 1.2-2 .4.1 2-1.9-1.2-1.9 1.2.1-2-2-.4 1.8-1.2-1-2 2 .6z"
        fill="#D80621"
      />
      <rect x="4" y="8" width="28" height="20" rx="3" fill="none" stroke="rgba(41,36,31,.18)" />
    </g>
  );
}

export function FlagAustralia({ size = 36 }: IconProps) {
  return frame(
    size,
    <g clipPath="url(#flag-rounded)">
      <rect x="4" y="8" width="28" height="20" fill="#00247D" />
      <g transform="translate(4 8) scale(.5)">
        <rect width="24" height="20" fill="#00247D" />
        <path d="M0 0 24 20M24 0 0 20" stroke="#fff" strokeWidth="3" />
        <path d="M12 0V20M0 10H24" stroke="#fff" strokeWidth="4" />
        <path d="M12 0V20M0 10H24" stroke="#C8102E" strokeWidth="2" />
      </g>
      <Star cx={10} cy={24} r={1.4} fill="#fff" />
      <Star cx={24} cy={13} r={1.1} fill="#fff" />
      <Star cx={27} cy={18} r={1.1} fill="#fff" />
      <Star cx={24} cy={23} r={1.1} fill="#fff" />
      <Star cx={28.5} cy={21} r={0.9} fill="#fff" />
      <rect x="4" y="8" width="28" height="20" rx="3" fill="none" stroke="rgba(41,36,31,.18)" />
    </g>
  );
}

export function FlagOther({ size = 36 }: IconProps) {
  return frame(
    size,
    <g clipPath="url(#flag-rounded)">
      <rect x="4" y="8" width="28" height="20" fill="#EDE2EB" />
      <path
        d="M18 11.5c3.6 0 6.5 2.9 6.5 6.5S21.6 24.5 18 24.5 11.5 21.6 11.5 18 14.4 11.5 18 11.5Z"
        fill="none"
        stroke="#76536E"
        strokeWidth="1.4"
      />
      <path d="M18 11.5v13M11.5 18h13" stroke="#76536E" strokeWidth="1.1" />
      <rect x="4" y="8" width="28" height="20" rx="3" fill="none" stroke="rgba(41,36,31,.18)" />
    </g>
  );
}

export function GlobeGraphic({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" role="img" aria-hidden="true">
      <circle cx="18" cy="18" r="12" fill="#EFE6F0" stroke="#76536E" strokeWidth="1.5" />
      <ellipse cx="18" cy="18" rx="5.2" ry="12" fill="none" stroke="#76536E" strokeWidth="1.2" />
      <path d="M6.4 14.5h23.2M6.4 21.5h23.2M6 18h24" stroke="#76536E" strokeWidth="1.2" />
      <path
        d="M11 11c3 1.6 2 4 4.5 4.8 2 .6 1.4 2.8 3 3.6 1.7.9 1 3.2 3 3.6"
        fill="none"
        stroke="#9D7594"
        strokeWidth="1.1"
        opacity=".7"
      />
    </svg>
  );
}

function Star({
  cx,
  cy,
  r,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}) {
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const outer = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    pts.push(`${cx + Math.cos(outer) * r},${cy + Math.sin(outer) * r}`);
  }
  return <polygon points={pts.join(" ")} fill={fill} />;
}

export const COUNTRY_FLAGS: Record<string, (p: IconProps) => JSX.Element> = {
  Singapore: FlagSingapore,
  "United States": FlagUnitedStates,
  "United Kingdom": FlagUnitedKingdom,
  Canada: FlagCanada,
  Australia: FlagAustralia,
};

/* ------------------------------ Need icons ------------------------------- */

function iconBase(size: number, children: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconSeated({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <circle cx="9" cy="4.5" r="1.8" />
      <path d="M9 7v5h5l2 4" />
      <path d="M9 12H6v6" />
      <circle cx="13" cy="19" r="3.4" />
      <path d="M5 19h3" />
    </>
  );
}

export function IconDressing({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <path d="M8 3l4 3 4-3 4 3-2 3-2-1v10H8V8L6 9 4 6z" />
    </>
  );
}

export function IconHand({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M11 10V4.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M14 10.5V6a1.5 1.5 0 0 1 3 0v7c0 3.5-2 7-5.5 7S6 17 6 14.5l-1.6-2.4a1.4 1.4 0 0 1 2.2-1.7L8 12" />
    </>
  );
}

export function IconCaregiver({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <circle cx="8" cy="5" r="2" />
      <circle cx="16" cy="5" r="2" />
      <path d="M5 21v-5a3 3 0 0 1 3-3M19 21v-5a3 3 0 0 0-3-3" />
      <path d="M9 13c1 1 5 1 6 0" />
    </>
  );
}

export function IconShoulder({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <circle cx="12" cy="5" r="2.2" />
      <path d="M5 18c0-4 3-7 7-7s7 3 7 7" />
      <path d="M5 18l-1 2M19 18l1 2" />
    </>
  );
}

export function IconSensory({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <path d="M3 12c2-3 5-5 9-5s7 2 9 5c-2 3-5 5-9 5s-7-2-9-5z" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  );
}

export function IconMedical({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <rect x="4" y="6" width="16" height="14" rx="3" />
      <path d="M12 10v6M9 13h6" />
    </>
  );
}

export function IconBrace({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <path d="M10 3l1 7-1 5 2 6" />
      <path d="M7 8h6M6.5 12h6M8 16h6" />
      <path d="M13 20h4" />
    </>
  );
}

export function IconStyle({ size = 24 }: IconProps) {
  return iconBase(
    size,
    <>
      <path d="M9 3l3 2 3-2 5 4-2.5 3L18 9v12H6V9l-1.5 1L2 7z" />
    </>
  );
}

export const NEED_ICONS: Record<string, (p: IconProps) => JSX.Element> = {
  seated: IconSeated,
  dressing: IconDressing,
  hand: IconHand,
  caregiver: IconCaregiver,
  shoulder: IconShoulder,
  sensory: IconSensory,
  medical: IconMedical,
  brace: IconBrace,
  style: IconStyle,
};
