import LocationAwareRecommendations from "@/components/LocationAwareRecommendations";
import { products } from "@/data/products";
import { rankProductRecommendations } from "@/lib/recommendations";

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
  needs.forEach((need) => {
    const value = need.toLowerCase();
    if (value.includes("easy shoes")) {
      needs.push("Hands-free entry", "Wide opening", "Limited mobility");
    }
    if (value.includes("sensory")) {
      needs.push("Sensory processing", "Skin sensitivity");
    }
    if (value.includes("wheelchair") || value.includes("seated")) {
      needs.push("Wheelchair users", "Seated fit");
    }
    if (value.includes("arthritis")) {
      needs.push("Arthritis", "Limited dexterity");
    }
    if (value.includes("prosthetic")) {
      needs.push("Prosthetic users", "Orthotics and AFOs", "Limb differences");
    }
    if (value.includes("magnetic")) {
      needs.push("Magnetic closures", "One-handed dressing");
    }
  });

  return Array.from(new Set(needs));
}

function normalizeBudget(value: string | string[] | undefined) {
  const budget = readList(value)[0] ?? "";
  if (["Under $50", "$50-$100", "$100-$150", "$150+"].includes(budget)) {
    return budget;
  }
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

function inferClosureTypes(needs: string[]) {
  const closures: string[] = [];
  needs.forEach((need) => {
    const value = need.toLowerCase();
    if (value.includes("magnetic")) closures.push("Magnetic closures");
    if (value.includes("zip") || value.includes("easy shoes")) closures.push("Zip access", "Hands-free entry");
    if (value.includes("velcro") || value.includes("easy closure")) closures.push("Velcro / touch closures");
    if (value.includes("snap")) closures.push("Snap closures");
  });
  return Array.from(new Set(closures));
}

function inferSensoryNeeds(needs: string[]) {
  return needs.some((need) => /sensory|skin|autism|tag|seam/i.test(need))
    ? ["Sensory-friendly", "Skin sensitivity"]
    : [];
}

function inferMobilityNeeds(needs: string[]) {
  const mobility: string[] = [];
  needs.forEach((need) => {
    const value = need.toLowerCase();
    if (value.includes("wheelchair") || value.includes("seated")) {
      mobility.push("Wheelchair-friendly", "Seated fit");
    }
    if (value.includes("one-handed") || value.includes("arthritis") || value.includes("dexterity")) {
      mobility.push("One-handed dressing", "Limited dexterity");
    }
    if (value.includes("prosthetic") || value.includes("orthotic") || value.includes("afo")) {
      mobility.push("Prosthetic-friendly", "Orthotics / AFOs");
    }
    if (value.includes("easy shoes") || value.includes("limited mobility")) {
      mobility.push("Limited mobility");
    }
  });
  return Array.from(new Set(mobility));
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
  const availability = readList(searchParams.availability)[0] ?? "";
  const otherNeeds = readList(searchParams.otherNeeds).join(", ").slice(0, 500);
  const country = readList(searchParams.location)[0];
  const targetGroup = readList(searchParams.forWhom)[0];
  const ageRange = readList(searchParams.ageRange)[0];
  const personality = [
    ...readList(searchParams.personality),
    ...readList(searchParams.personalityType),
  ];

  const recommendations = rankProductRecommendations(products, {
    targetGroup,
    bodyNeeds: needs,
    country,
    stylePreference: styles,
    ageRange,
    personalityType: personality,
    budgetRange: budget,
    closureTypes: inferClosureTypes(needs),
    sensoryNeeds: inferSensoryNeeds(needs),
    mobilityNeeds: inferMobilityNeeds(needs),
    clothingTypes: clothing.filter((item) => item !== "Not sure"),
    availabilityPreference: availability,
    openEndedNeed: otherNeeds,
    limit: 9,
  }).filter(({ product }) => {
    if (clothing.length === 0) return true;
    return clothing.some((choice) => {
      const normalized = choice.toLowerCase();
      if (normalized === "not sure") return true;
      return (
        product.clothingType.toLowerCase().includes(normalized.replace("adaptive ", "")) ||
        normalized.includes(product.clothingType.toLowerCase()) ||
        normalized.includes(product.category)
      );
    });
  }).filter(({ product }) => {
    if (availability.toLowerCase().includes("in-store")) {
      return product.availability.inStore;
    }
    return true;
  });

  const visibleRecommendations =
    recommendations.length > 0
      ? recommendations
      : rankProductRecommendations(products, {
          targetGroup,
          bodyNeeds: needs,
          country,
          stylePreference: styles,
          ageRange,
          personalityType: personality,
          budgetRange: budget,
          closureTypes: inferClosureTypes(needs),
          sensoryNeeds: inferSensoryNeeds(needs),
          mobilityNeeds: inferMobilityNeeds(needs),
          openEndedNeed: otherNeeds,
          limit: 9,
        });

  return (
    <div className="min-h-screen bg-ivory">
      <header className="paper-texture border-b border-ink/10 bg-paper py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Quiz complete</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Your recommended clothing pieces
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">
            Individual items are ranked by your needs, location, clothing type,
            style, budget and dressing preferences. Brands are supporting
            information, not the starting point.
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
        <LocationAwareRecommendations recommendations={visibleRecommendations} />
      </main>
    </div>
  );
}
