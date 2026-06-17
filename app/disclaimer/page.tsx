import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Xi's",
  description: "How Xi's uses brand names, product images and links.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-950">
          Disclaimer
        </h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            Xi&apos;s is an independent adaptive clothing discovery tool. We are
            not affiliated with, sponsored by, or endorsed by any of the
            brands listed on this site.
          </p>
          <p>
            Brand and product names, logos and images shown on Xi&apos;s are
            used solely for identification purposes, so that you can
            recognize and compare items across brands. They remain the
            property of their respective owners, and all trademarks belong
            to their respective owners.
          </p>
          <p>
            Prices, availability and product details are checked periodically
            but can change without notice. Please purchase directly from the
            official brand or retailer, and confirm current stock, pricing,
            sizing and delivery details on their website before buying.
          </p>
          <p>
            Where available, we provide a link to the official product or
            brand page. These links are provided for convenience only and do
            not imply any partnership with Xi&apos;s.
          </p>
          <p>
            If you have a question about how your brand or product is
            represented on this site, please get in touch and we will be
            happy to help.
          </p>
        </div>
      </main>
    </div>
  );
}
