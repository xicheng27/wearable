"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Primary "Start quiz" call-to-action. Wraps next/link so the quiz-start
 * funnel event fires consistently wherever the CTA appears, while the page
 * hosting it can stay a server component.
 */
export default function QuizCtaLink({
  children,
  className,
  location,
  href = "/quiz",
}: {
  children: React.ReactNode;
  className?: string;
  location: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent("cta_quiz_start", { location })}
    >
      {children}
    </Link>
  );
}
