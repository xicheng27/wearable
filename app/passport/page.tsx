import FitPassport from "@/components/FitPassport";

export const metadata = {
  title: "Your Adaptive Fit Passport | Xi's",
  description:
    "Your reusable adaptive clothing profile: fit needs, dressing support, sensory comfort, location and style — used to match every product on the site.",
  // The passport is personal, on-device data — not an indexable page.
  robots: { index: false, follow: true },
};

export default function PassportPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="paper-texture border-b border-ink/10 bg-paper py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Your profile</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Adaptive Fit Passport
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">
            One reusable profile of what clothing needs to do for you — matched
            against every product on the site. Edit it any time without
            retaking the quiz. It stays on this device and is never uploaded.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <FitPassport />
        <p className="mt-6 text-xs leading-5 text-ink/50">
          Your passport groups the answers you chose into shopping categories
          only. It is not a medical record or assessment, and you can reset it
          at any time.
        </p>
      </main>
    </div>
  );
}
