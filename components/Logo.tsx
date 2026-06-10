import Link from "next/link";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * Xi's brand mark: a thread-like monogram "X" with the apostrophe dot,
 * on a deep-green gradient tile. Reused for navbar, favicon (app/icon.svg),
 * loading screens, and app icons.
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
          <stop offset="0" stopColor="#23A87D" />
          <stop offset="1" stopColor="#116B4E" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="17" fill="url(#xis-tile)" />
      <path
        d="M21 21 L43 43"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M43 21 L21 43"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.62"
      />
      <circle cx="47.5" cy="18.5" r="4" fill="#C5EBD9" />
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
          className={`text-lg font-bold tracking-tight ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          Xi
          <span className={dark ? "text-primary-300" : "text-primary-600"}>
            &apos;s
          </span>
        </span>
      )}
    </Link>
  );
}
