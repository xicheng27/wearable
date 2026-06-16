import Link from "next/link";

export const metadata = {
  title: "Disclaimer | Xi's",
  description:
    "How Xi's uses brand names, product names, logos, and product images for adaptive fashion discovery.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <section className="paper-texture border-b border-ink/10 bg-[#EEE5D5] py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Independent discovery tool</p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-.04em] text-ink sm:text-6xl">
            Disclaimer
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/65">
            Xi&apos;s helps people discover adaptive fashion and compare
            clothing features. It is not a retailer and does not sell products
            directly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="paper-panel space-y-7 rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-6 text-base leading-8 text-ink/75 sm:p-8">
          <p>
            This website is an independent adaptive fashion discovery tool. It
            is not affiliated with, sponsored by, or endorsed by any fashion,
            footwear, or adaptive clothing brand unless explicitly stated.
          </p>

          <p>
            Brand names, product names, logos, and product images may appear on
            Xi&apos;s only to identify the relevant item, support accessibility
            reference, make recommendations easier to understand, and provide
            useful shopping information.
          </p>

          <p>
            Official product links may be provided so users can visit the
            original brand, retailer, or authorized seller. Users should confirm
            current prices, sizing, availability, shipping, return policies, and
            accessibility details directly with the official retailer before
            purchasing.
          </p>

          <p>
            All trademarks, copyrights, product images, brand names, and product
            names belong to their respective owners.
          </p>

          <div className="border-t border-ink/10 pt-7">
            <Link href="/" className="btn-primary">
              Back to Xi&apos;s
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
