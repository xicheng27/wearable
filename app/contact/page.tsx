import type { Metadata } from "next";
import Link from "next/link";
import { publicConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Xi's about adaptive clothing corrections, brand representation, data deletion requests, accessibility feedback or general questions.",
  alternates: { canonical: "/contact" },
};

const CONTACT_EMAIL = publicConfig.contactEmail;

const reasons = [
  {
    title: "Corrections & brand representation",
    text: "Spotted a wrong price, broken link, or want to change how your brand or product appears? Let us know and we'll update or remove it.",
  },
  {
    title: "Accessibility feedback",
    text: "If anything on the site is hard to read, tap, or navigate with a keyboard or screen reader, tell us — we treat accessibility issues as priority fixes.",
  },
  {
    title: "Privacy & data deletion",
    text: "Your quiz answers and saved items stay on your device — you can clear them yourself from the privacy page. Email us to delete a message you sent us.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="link-underline text-sm">
          Back to home
        </Link>
        <header className="mt-8">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-6xl">
            Get in touch
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
            Questions, corrections, accessibility feedback, or a privacy request?
            Email us and we&apos;ll get back to you. If you want to suggest a new
            adaptive clothing product instead, the{" "}
            <Link href="/submit" className="link-underline">
              submit an item
            </Link>{" "}
            form is the fastest way.
          </p>
        </header>

        <section className="paper-panel mt-10 rounded-[2rem_.9rem_2rem_2rem] p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Email us</h2>
          <p className="mt-3 text-base leading-7 text-ink/72">
            Write to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="link-underline font-bold"
            >
              {CONTACT_EMAIL}
            </a>
            . We read every message but Xi&apos;s is run by a small team, so
            please allow a little time for a reply.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary mt-6 inline-flex">
            Open email
          </a>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-2xl border border-ink/10 bg-paper p-5"
            >
              <h2 className="font-display text-lg font-semibold text-ink">
                {reason.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/70">{reason.text}</p>
            </div>
          ))}
        </section>

        <p className="mt-8 text-sm leading-6 text-ink/60">
          Xi&apos;s is an independent discovery tool and is not a retailer. For
          orders, returns, sizing or medical suitability, please contact the
          official brand directly. See our{" "}
          <Link href="/privacy" className="link-underline">
            privacy page
          </Link>{" "}
          and{" "}
          <Link href="/disclaimer" className="link-underline">
            disclaimer
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
