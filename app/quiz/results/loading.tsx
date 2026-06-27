export default function QuizResultsLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="paper-panel max-w-xl rounded-[2rem_.9rem_2rem_2rem] p-8 text-center">
        <p className="eyebrow">Building recommendations</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Matching your needs to clothing features...
        </h1>
        <div className="mt-6 space-y-2 text-left text-base leading-7 text-ink/70">
          <p>Prioritising accessibility needs first...</p>
          <p>Filtering by style, fit and availability...</p>
          <p>Preparing explained product matches...</p>
        </div>
      </div>
    </main>
  );
}
