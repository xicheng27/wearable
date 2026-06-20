import RecommendationsGrid from "@/components/RecommendationsGrid";
import { recommendProducts } from "@/data/products";

interface QuizResultsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata = {
  title: "Your Adaptive Clothing Matches | Xi's",
  description:
    "Individual adaptive clothing recommendations matched to accessibility needs, style and budget.",
};

function readList(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  return raw
    .split(",")
    .map((item) => {
      try {
        return decodeURIComponent(item).trim();
      } catch {
        return item.trim();
      }
    })
    .filter(Boolean);
}

function normalizeNeeds(searchParams: QuizResultsPageProps["searchParams"]) {
  const needs = [
    ...readList(searchParams.need),
    ...readList(searchParams.needs),
  ];
  const seated = readList(searchParams.seated);
  const sensory = readList(searchParams.sensory);
  const fastenings = readList(searchParams.fastenings);

  if (seated.some((value) => value.toLowerCase().includes("yes"))) {
    needs.push("Wheelchair users", "Seated fit");
  }
  if (sensory.some((value) => !value.toLowerCase().includes("no sensory"))) {
    needs.push("Sensory processing");
  }
  if (fastenings.some((value) => value.toLowerCase().includes("magnetic"))) {
    needs.push("Magnetic closures", "One-handed dressing");
  }
  if (fastenings.some((value) => value.toLowerCase().includes("zipper"))) {
    needs.push("Easy entry");
  }

  return Array.from(new Set(needs));
}

function normalizeBudget(value: string | string[] | undefined) {
  const budget = readList(value)[0] ?? "";
  if (budget.startsWith("$ Â·") || budget.toLowerCase().includes("budget")) {
    return "Under $50";
  }
  if (budget.startsWith("$$ Â·") || budget.toLowerCase().includes("mid")) {
    return "$50-$100";
  }
  if (budget.startsWith("$$$ Â·") || budget.toLowerCase().includes("premium")) {
    return "$100-$150";
  }
  return budget || undefined;
}

export default function QuizResultsPage({
  searchParams,
}: QuizResultsPageProps) {
  const needs = normalizeNeeds(searchParams);
  const styles = [
    ...readList(searchParams.style),
    ...readList(searchParams.styles),
  ];
  const budget = normalizeBudget(searchParams.budget);
  const clothing = readList(searchParams.clothing);
  const otherNeeds = readList(searchParams.otherNeeds).join(", ").slice(0, 500);

  const recommendations = recommendProducts({
    needs,
    styles,
    budget,
    openEndedNeed: otherNeeds,
    limit: 9,
  }).filter(({ product }) => {
    if (clothing.length === 0) return true;
    return clothing.some((choice) => {
      const normalized = choice.toLowerCase();
      return (
        product.clothingType.toLowerCase().includes(normalized.replace("adaptive ", "")) ||
        normalized.includes(product.clothingType.toLowerCase()) ||
        normalized.includes(product.category)
      );
    });
  });

  const visibleRecommendations =
    recommendations.length > 0
      ? recommendations
      : recommendProducts({
          needs,
          styles,
          budget,
          limit: 9,
        });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Quiz complete
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-950">
            Your recommended clothing pieces
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            Individual items are ranked by accessibility features, style and
            budget. Brands are supporting information, not the starting point.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[...needs, ...styles, budget]
              .filter(Boolean)
              .slice(0, 10)
              .map((item) => (
                <span key={item} className="badge bg-primary-50 text-primary-800">
                  {item}
                </span>
              ))}
          </div>
          {otherNeeds && (
            <div className="paper-panel mt-6 max-w-3xl rounded-[1.2rem_.5rem_1.2rem_1.2rem] px-5 py-4">
              <p className="font-hand text-xs font-semibold text-primary-700">
                What you added
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/70">{otherNeeds}</p>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <RecommendationsGrid recommendations={visibleRecommendations} />
      </main>
    </div>
  );
}
