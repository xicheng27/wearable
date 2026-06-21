import Link from "next/link";
import SubmitItemForm from "@/components/SubmitItemForm";

export const metadata = {
  title: "Submit an Adaptive Clothing Item | Xi's",
  description:
    "Suggest adaptive clothing products, brands, or resources for Xi's to review.",
};

export default function SubmitItemPage() {
  return (
    <main className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="link-underline text-sm">
          Back to home
        </Link>
        <header className="mt-8">
          <p className="eyebrow">Help improve Xi&apos;s</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-6xl">
            Submit an adaptive clothing item
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
            Tell us about a product, brand, or resource that could help disabled
            users, older adults, caregivers, or anyone who needs easier dressing.
            We review suggestions before adding them to the catalogue.
          </p>
        </header>

        <div className="mt-8">
          <SubmitItemForm />
        </div>

        <p className="mt-6 text-sm leading-6 text-ink/60">
          Please include official links where possible. Prices, stock, sizing,
          shipping, and return policies should always be checked on the official
          retailer site.
        </p>
      </div>
    </main>
  );
}
