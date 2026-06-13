import Link from "next/link";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * Xi's brand mark: a stitched X monogram inside a garment-label shape.
 */
export function LogoMark({ size = 32, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="xis-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8E6986" />
          <stop offset="1" stopColor="#52364C" />
        </linearGradient>
      </defs>
      <path d="M10 8h38l6 8v40H10z" fill="url(#xis-tile)" />
      <path d="M15 13h30l4 5v32H15z" stroke="#F7F2E8" strokeDasharray="2 3" opacity=".55" />
      <path
        d="M21 22 L42 43"
        stroke="#FCF9F2"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M42 22 L21 43"
        stroke="#FCF9F2"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.68"
      />
      <circle cx="47.5" cy="17.5" r="3.5" fill="#E7DAC4" />
    </svg>
  );
}

interface LogoProps {
  href?: string;
  dark?: boolean;
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export default function Logo({
  href = "/",
  dark = false,
  size = 32,
  withWordmark = true,
  className = "",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-shrink-0 items-center gap-2.5 ${className}`}
      aria-label="Xi's home"
    >
      <LogoMark
        size={size}
        className="transition-transform duration-200 group-hover:scale-105"
      />
      {withWordmark && (
        <span
          className={`font-display text-2xl font-semibold tracking-[-0.04em] ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          Xi
          <span className={dark ? "text-lavender" : "text-primary-700"}>
            &apos;s
          </span>
        </span>
      )}
    </Link>
  );
}
