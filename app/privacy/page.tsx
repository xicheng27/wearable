import type { Metadata } from "next";
import Link from "next/link";
import ClearDataButton from "@/components/ClearDataButton";
import { publicConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Xi's handles your data: everything is stored on your own device, what the app does and does not collect, the analytics and country lookup used, and how to delete your data.",
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = publicConfig.contactEmail;

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
            Xi&apos;s is a free adaptive clothing discovery tool. It has no user
            accounts and no database. Almost everything the app remembers is
            stored <strong>only in your browser, on your own device</strong> —
            it is not uploaded to us or linked to your identity.
          </p>
        </header>

        <div className="mt-10 space-y-8 text-base leading-7 text-ink/78">
          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              What stays on your device
            </h2>
            <p className="mt-3">
              These are saved in your browser&apos;s local storage and never sent
              to a server:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Quiz answers and your Adaptive Fit Passport</strong> —
                including any accessibility needs you select and anything you type
                in the free-text boxes. This never leaves your device.
              </li>
              <li>
                <strong>Saved items</strong> (the products you heart) and your{" "}
                <strong>region, currency and accessibility settings</strong>.
              </li>
              <li>
                <strong>Product suggestions.</strong> If you use the{" "}
                <Link href="/submit" className="link-underline">
                  suggest an item
                </Link>{" "}
                form, the details you enter — and the optional email — are saved{" "}
                <strong>only in your browser</strong>. We do not receive a copy,
                and no one can review it unless you contact us and send it
                yourself.
              </li>
              <li>
                <strong>Anonymous interaction signals</strong> (which filters and
                cards you use) with a random, per-device id — used to improve
                recommendations. No names, emails or free text.
              </li>
            </ul>
          </section>

          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              What is sent off your device
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Approximate country.</strong> On your first visit the app
                asks an IP-geolocation service (<span className="font-mono text-sm">api.country.is</span>{" "}
                or <span className="font-mono text-sm">ipapi.co</span>) for your{" "}
                <em>country only</em>, so it can default the shopping region. Your
                IP is visible to that provider as part of the request; we only
                read the country back, we don&apos;t store your IP or precise
                location, and the answer is cached on your device so it runs at
                most once. You can override it with the region picker.
              </li>
              <li>
                <strong>Currency rates</strong> are fetched from{" "}
                <span className="font-mono text-sm">api.frankfurter.app</span>{" "}
                (European Central Bank data). This request contains no personal
                data.
              </li>
              <li>
                <strong>Product images</strong> load from the official retailer
                and brand image hosts.
              </li>
              <li>
                <strong>Anonymous usage analytics.</strong> We use Vercel Web
                Analytics and Speed Insights to count page views and measure
                performance. They do not use cookies to identify you and never
                receive your name, email, quiz answers or anything you type — we
                also strip query strings from analytics so quiz details can&apos;t
                leak through a URL. Like any web host, Vercel processes basic
                request metadata (such as IP address and user agent) to serve and
                secure the site.
              </li>
            </ul>
          </section>

          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              What we do not do
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>We do not have accounts, logins or passwords.</li>
              <li>We do not sell or share your data, or build advertising profiles.</li>
              <li>
                We do not store your quiz answers, saved items or product
                suggestions on a server — there isn&apos;t one for this data.
              </li>
              <li>
                We do not send your accessibility selections or free-text needs to
                analytics or any third party.
              </li>
            </ul>
          </section>

          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Deleting your data
            </h2>
            <p className="mt-3">
              Because everything lives on your device, you are always in control.
              Clearing your browser storage removes it instantly, or use this
              button to delete your quiz answers, Fit Passport, saved items and
              any saved product suggestions from this browser:
            </p>
            <div className="mt-4">
              <ClearDataButton label="Delete my data on this device" />
            </div>
            <p className="mt-4 text-sm text-ink/65">
              This does not change your currency or accessibility preferences. If
              you emailed us a suggestion or a question, you can ask us to delete
              that message at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline font-bold">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section className="rounded-[1.5rem_.6rem_1.5rem_1.5rem] border border-clay/40 bg-clay/10 p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Not a medical service
            </h2>
            <p className="mt-3">
              Xi&apos;s is a discovery tool, not a shop and not a medical service.
              Please <strong>don&apos;t enter medical records, diagnosis
              documents or other identifying health information</strong> in the
              quiz or submission form. Always confirm price, stock, sizing,
              returns and accessibility suitability on the official retailer&apos;s
              page before purchasing. See our{" "}
              <Link href="/disclaimer" className="link-underline">
                disclaimer
              </Link>
              .
            </p>
          </section>

          <section className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Contact
            </h2>
            <p className="mt-3">
              Questions about privacy? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline font-bold">
                {CONTACT_EMAIL}
              </a>{" "}
              or use the{" "}
              <Link href="/contact" className="link-underline">
                contact page
              </Link>
              .
            </p>
          </section>

          <p className="text-sm text-ink/55">
            This page may be updated as the site changes. Last reviewed July 2026.
          </p>
        </div>
      </div>
    </main>
  );
}
