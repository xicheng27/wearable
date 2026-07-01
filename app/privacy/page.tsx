import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Xi's handles your data: what is collected, why, whether submissions are reviewed manually, optional emails, and how to request deletion.",
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = "wangxicheng2007@gmail.com";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="link-underline text-sm">
          Back to home
        </Link>
        <header className="mt-8">
          <p className="eyebrow">Privacy</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-6xl">
            Privacy at Xi&apos;s
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/72">
            Xi&apos;s is a free adaptive clothing discovery tool. We try to
            collect as little as possible, and we never sell your data.
          </p>
        </header>

        <div className="mt-10 space-y-8 text-base leading-7 text-ink/78">
          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              What we collect
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Quiz answers, saved items and preferences</strong> are
                stored only in your browser (local storage) on your own device.
                They are not sent to a server or linked to your identity.
              </li>
              <li>
                <strong>Approximate country</strong> may be detected from your IP
                address (via a third-party lookup) so we can show clothing that
                ships to you. You can always override it with the region picker,
                and your choice is saved on your device.
              </li>
              <li>
                <strong>Item submissions.</strong> If you use the{" "}
                <Link href="/submit" className="link-underline">
                  submit an item
                </Link>{" "}
                form, the product details you enter — and your email, only if you
                choose to add it — are saved so we can review the suggestion.
              </li>
              <li>
                <strong>Anonymous usage analytics.</strong> We use privacy-friendly
                Vercel Web Analytics and Speed Insights to count page views and
                measure performance. These do not use cookies to identify you and
                do not receive your name, email or anything you type.
              </li>
            </ul>
          </section>

          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Why we collect it
            </h2>
            <p className="mt-3">
              Only to make the tool work: to remember your region and saved
              items, to match you with suitable clothing, to review the products
              people suggest, and to understand which pages are useful so we can
              improve them. We do not build advertising profiles.
            </p>
          </section>

          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Are submissions reviewed manually?
            </h2>
            <p className="mt-3">
              Yes. Every submitted item is read by a person before anything is
              added to the catalogue. Adding your email is{" "}
              <strong>optional</strong> — we only use it to follow up on your
              suggestion if needed, never for marketing.
            </p>
          </section>

          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Deleting your data
            </h2>
            <p className="mt-3">
              Quiz answers and saved items live on your device — clearing your
              browser storage removes them instantly. To request deletion of a
              submission you sent, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline font-bold">
                {CONTACT_EMAIL}
              </a>{" "}
              and we&apos;ll remove it. You can also reach us through the{" "}
              <Link href="/contact" className="link-underline">
                contact page
              </Link>
              .
            </p>
          </section>

          <section className="rounded-[1.5rem_.6rem_1.5rem_1.5rem] border border-clay/40 bg-clay/10 p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Please verify before you buy
            </h2>
            <p className="mt-3">
              Xi&apos;s is a discovery tool, not a shop and not a medical service.
              Always confirm <strong>price, stock, sizing, returns and medical
              or accessibility suitability</strong> on the official retailer&apos;s
              page before purchasing. See our{" "}
              <Link href="/disclaimer" className="link-underline">
                disclaimer
              </Link>{" "}
              for more.
            </p>
          </section>

          <p className="text-sm text-ink/55">
            This page may be updated as the site changes. Last reviewed June 2026.
          </p>
        </div>
      </div>
    </main>
  );
}
