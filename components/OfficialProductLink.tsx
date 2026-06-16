import type { ReactNode } from "react";

type OfficialProductLinkProps = {
  href?: string | null;
  exact?: boolean;
  className?: string;
  children?: ReactNode;
};

export function isValidOfficialUrl(href?: string | null) {
  if (!href) return false;
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function OfficialProductLink({
  href,
  exact = true,
  className = "",
  children,
}: OfficialProductLinkProps) {
  if (!isValidOfficialUrl(href)) return null;

  return (
    <a
      href={href as string}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children ?? (exact ? "View official product \u2192" : "View official source \u2192")}
    </a>
  );
}
