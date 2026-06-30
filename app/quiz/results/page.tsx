import Link from "next/link";
import RecommendationsGrid from "@/components/RecommendationsGrid";
import ResultsViewedTracker from "@/components/ResultsViewedTracker";
import SignalMap from "@/components/SignalMap";
import { buildSignalMap } from "@/lib/signalMap";
import { expandShippingRegions } from "@/lib/countries";
import { findNearbyStores } from "@/lib/mapProvider";
import {
  buildMatchSummary,
  classifyAdaptiveProfiles,
  recommendAdaptiveProducts,
} from "@/lib/recommendationEngine";
import {
  deriveCaregiverInvolvement,
  deriveDressingDifficulty,
  deriveMobilityLevel,
} from "@/lib/userProfile";
import type {
  AgeRange,
  DressingMethod,
  LifestyleSetting,
  MobilityLevel,
  TargetGroup,
} from "@/types";

interface QuizResultsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata = {
  title: "Your Adaptive Clothing Matches | Xi's",
  description:
    "Individual adaptive clothing recommendations matched to accessibility needs, style, location and budget.",
  // Personalised, query-string-driven results — not a stable indexable page.
  robots: { index: false, follow: true },
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

function readValue(value: string | string[] | undefined): string | undefined {
  return readList(value)[0];
}

function normalizeNeeds(
  rawNeeds: string[],
  sensory: string[],
  fastenings: string[],
  seated: string[],
  features: string[]
) {
  const needs = [...rawNeeds, ...features];

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

  [...rawNeeds, ...features].forEach((need) => {
    const value = need.toLowerCase();
    if (value.includes("easy shoes")) {
      needs.push("Hands-free entry", "Wide opening", "Limited mobility");
    }
    if (value.includes("sensory") || value.includes("seam") || value.includes("tag")) {
      needs.push("Sensory processing", "Skin sensitivity");
    }
    if (value.includes("wheelchair") || value.includes("seated")) {
      needs.push("Wheelchair users", "Seated fit");
    }
    if (value.includes("arthritis") || value.includes("dexterity")) {
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

function normalizeBudget(value: string | undefined) {
  const budget = value ?? "";
  if (["Under $50", "$50-$100", "$100-$150", "$150+"].includes(budget)) {
    return budget;
  }
  const lower = budget.toLowerCase();
  if (lower.includes("budget")) return "Under $50";
  if (lower.includes("mid")) return "$50-$100";
  if (lower.includes("premium")) return "$100-$150";
  return budget && !lower.includes("no") ? budget : undefined;
}

function normalizeMobility(value: string | undefined): MobilityLevel | undefined {
  if (!value) return undefined;
  if (value === "wheelchair") return "wheelchair-or-seated";
  if (value === "mostly_seated") return "wheelchair-or-seated";
  if (value === "support") return "some-difficulty";
  if (value === "independent") return "full-mobility";
  return value as MobilityLevel;
}

export default function QuizResultsPage({ searchParams }: QuizResultsPageProps) {
  const rawNeeds = readList(searchParams.needs);
  const features = readList(searchParams.features);
  const sensory = readList(searchParams.sensory);
  const fastenings = [
    ...readList(searchParams.fastenings),
    ...features.filter((feature) => /magnetic|velcro|zip|button|elastic|opening/i.test(feature)),
  ];
  const seated = readList(searchParams.seated);
  const needs = normalizeNeeds(rawNeeds, sensory, fastenings, seated, features);
  const styles = [...readList(searchParams.style), ...readList(searchParams.styles)];
  const budget = normalizeBudget(readValue(searchParams.budget));
  const clothing = readList(searchParams.clothing);
  const availability = readValue(searchParams.availability) ?? "";
  const otherNeeds = readList(searchParams.otherNeeds).join(", ").slice(0, 500);
  const location = readValue(searchParams.location);
  const targetGroup = (readValue(searchParams.targetGroup) ?? readValue(searchParams.forWhom)) as
    | TargetGroup
    | undefined;
  const ageRange = (readValue(searchParams.ageRange) ?? readValue(searchParams.ageGroup)) as
    | AgeRange
    | undefined;
  const lifestyleSetting = readValue(searchParams.lifestyleSetting) as LifestyleSetting | undefined;
  const genderRange = readValue(searchParams.genderRange) ?? readValue(searchParams.genderStyle);
  const dressingMethod = readValue(searchParams.dressingMethod) as DressingMethod | undefined;
  const mobilityLevel =
    normalizeMobility(readValue(searchParams.mobilityLevel)) ??
    normalizeMobility(deriveMobilityLevel(needs));
  const fabricComfortNeeds = sensory.filter((value) =>
    /soft|lightweight|breathable|flat seams|tag/i.test(value)
  );
  // A custom "not listed" need: free text that softly matches product tags.
  const customNeed = readList(searchParams.custom).join(", ").slice(0, 500);
  const openEndedNeed = [otherNeeds, customNeed].filter(Boolean).join(". ");

  const input = {
    targetGroup,
    ageRange,
    needs,
    styles,
    budget,
    openEndedNeed,
    location,
    mobilityLevel,
    dressingDifficulty: deriveDressingDifficulty(needs, fastenings),
    sensoryNeeds: sensory,
    closurePreference: fastenings,
    fabricComfortNeeds,
    lifestyleSetting,
    caregiverInvolvement: deriveCaregiverInvolvement(targetGroup, dressingMethod),
    clothingTypes: clothing.filter((item) => item !== "Not sure"),
    genderRange,
    limit: 9,
  };

  const profiles = classifyAdaptiveProfiles(input);
  const summary = buildMatchSummary(input);
  // The engine strictly filters by the chosen clothing categories already, so
  // results never cross categories (unless the shopper picked "Not sure").
  const allResults = recommendAdaptiveProducts(input);
  const availabilityFiltered = availability.toLowerCase().includes("in-store")
    ? allResults.filter(({ product }) => product.availability.inStore)
    : allResults;
  const visibleResults = availabilityFiltered.length > 0 ? availabilityFiltered : allResults;
  const exactMatches = visibleResults.filter((result) => !result.isFallback);
  const fallbackMatches = visibleResults.filter((result) => result.isFallback);

  const nearbyCountries = location
    ? Array.from(new Set([location, ...expandShippingRegions([location])]))
    : [];
  const nearbyStores = location ? findNearbyStores({ countries: nearbyCountries }) : null;

  const signalMap = buildSignalMap(searchParams);

  return (
    <div className="min-h-screen bg-ivory">
      <ResultsViewedTracker
        exactCount={exactMatches.length}
        fallbackCount={fallbackMatches.length}
      />
      <header className="paper-texture border-b border-ink/10 bg-paper py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Quiz complete</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Your adaptive clothing results
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">
            {summary}
          </p>
          {profiles.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {profiles.slice(0, 6).map((profile) => (
                <span
                  key={profile.id}
                  title={profile.description}
                  className="badge bg-primary-50 text-primary-800"
                >
                  {profile.label}
                </span>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-ink/50">
            We group your self-selected answers into shopping categories only. This
            is not a medical assessment or diagnosis.
          </p>
          {otherNeeds && (
            <div className="paper-panel mt-6 max-w-3xl rounded-[1.2rem_.5rem_1.2rem_1.2rem] px-5 py-4">
              <p className="font-hand text-xs font-semibold text-primary-700">
                What you added
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/70">{otherNeeds}</p>
            </div>
          )}
          {nearbyStores && nearbyStores.places.length > 0 && (
            <div className="mt-4 max-w-3xl rounded-2xl border border-gray-200 bg-white px-5 py-4">
              <p className="text-sm font-semibold text-gray-700">
                {nearbyStores.places.length} demo stockist
                {nearbyStores.places.length === 1 ? "" : "s"} mapped near {location}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Sample locations from our directory, not a live store locator yet.{" "}
                <Link href="/map" className="font-semibold text-primary-700 underline">
                  See the map
                </Link>
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SignalMap data={signalMap} />

        <div className="mt-12 mb-6 max-w-3xl">
          <p className="eyebrow">Matched for you</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
            Your recommended clothing pieces
          </h2>
          <p className="mt-2 text-base leading-7 text-ink/65">
            Ranked by your hard functional needs first, then body-zone fit,
            access, country availability, budget and style. Every card explains
            why it matched.
          </p>
        </div>

        {exactMatches.length > 0 && (
          <section aria-labelledby="exact-matches-heading">
            <h2 id="exact-matches-heading" className="sr-only">
              Best matches
            </h2>
            <RecommendationsGrid
              recommendations={exactMatches}
              showActions={fallbackMatches.length === 0}
            />
          </section>
        )}

        {fallbackMatches.length > 0 && (
          <section aria-labelledby="closest-alternatives-heading" className="mt-14">
            <div className="mb-6 max-w-3xl">
              <h2
                id="closest-alternatives-heading"
                className="font-display text-2xl font-semibold text-ink"
              >
                Closest alternatives
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                We did not have enough pieces that meet every one of your needs,
                so these are the nearest options. Each card shows clearly what it
                does and does not cover.
              </p>
            </div>
            <RecommendationsGrid recommendations={fallbackMatches} />
          </section>
        )}
      </main>
    </div>
  );
}
