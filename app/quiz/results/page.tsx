import Link from "next/link";
import RecommendationsGrid from "@/components/RecommendationsGrid";
import { expandShippingRegions } from "@/lib/countries";
import { findNearbyStores } from "@/lib/mapProvider";
import {
  buildMatchSummary,
  classifyAdaptiveProfiles,
  recommendAdaptiveProducts,
} from "@/lib/recommendationEngine";
import { deriveCaregiverInvolvement, deriveDressingDifficulty, deriveMobilityLevel } from "@/lib/userProfile";
import type { AgeRange, LifestyleSetting, TargetGroup } from "@/types";

interface QuizResultsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata = {
  title: "Your Adaptive Clothing Matches | Xi's",
  description:
    "Individual adaptive clothing recommendations matched to accessibility needs, style, location and budget.",
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

function normalizeNeeds(rawNeeds: string[], sensory: string[], fastenings: string[], seated: string[]) {
  const needs = [...rawNeeds];

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
    if (value.includes("sensory") || value.includes("seam") || value.includes("tag")) {
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

function normalizeBudget(value: string | undefined) {
  const budget = value ?? "";
  if (["Under $50", "$50-$100", "$100-$150", "$150+"].includes(budget)) {
    return budget;
  }
  if (budget.startsWith("$ Â·") || budget.toLowerCase().includes("budget")) {
    return "Under $50";
  }
  const lower = budget.toLowerCase();
  if (lower.includes("budget")) return "Under $50";
  if (lower.includes("mid")) return "$50-$100";
  if (lower.includes("premium")) return "$100-$150";
  return budget && !lower.includes("no limit") ? budget : undefined;
}

const LIFESTYLE_LABELS: Record<LifestyleSetting, string> = {
  school: "School",
  work: "Work",
  home: "Mostly at home",
  outdoor: "Outdoor activities",
  "formal-event": "Formal events",
  "daily-wear": "Everyday, daily wear",
};

export default function QuizResultsPage({ searchParams }: QuizResultsPageProps) {
  const rawNeeds = readList(searchParams.needs);
  const sensory = readList(searchParams.sensory);
  const fastenings = readList(searchParams.fastenings);
  const seated = readList(searchParams.seated);
  const needs = normalizeNeeds(rawNeeds, sensory, fastenings, seated);
  const styles = [...readList(searchParams.style), ...readList(searchParams.styles)];
  const budget = normalizeBudget(readValue(searchParams.budget));
  const clothing = readList(searchParams.clothing);
  const availability = readList(searchParams.availability)[0] ?? "";
  const otherNeeds = readList(searchParams.otherNeeds).join(", ").slice(0, 500);
  const location = readValue(searchParams.location);
  const targetGroup = (readValue(searchParams.targetGroup) ?? readValue(searchParams.forWhom)) as
    | TargetGroup
    | undefined;
  const ageRange = readValue(searchParams.ageRange) as AgeRange | undefined;
  const lifestyleSetting = readValue(searchParams.lifestyleSetting) as LifestyleSetting | undefined;
  const fabricComfortNeeds = sensory.filter((value) => /soft|lightweight|breathable|flat seams/i.test(value));

  const input = {
    targetGroup,
    ageRange,
    needs,
    styles,
    budget,
    openEndedNeed: otherNeeds,
    location,
    mobilityLevel: deriveMobilityLevel(rawNeeds),
    dressingDifficulty: deriveDressingDifficulty(rawNeeds, fastenings),
    sensoryNeeds: sensory,
    closurePreference: fastenings,
    fabricComfortNeeds,
    lifestyleSetting,
    caregiverInvolvement: deriveCaregiverInvolvement(targetGroup),
    clothingTypes: clothing.filter((item) => item !== "Not sure"),
    limit: 9,
  };

  const profiles = classifyAdaptiveProfiles(input);
  const summary = buildMatchSummary(input);
  const allResults = recommendAdaptiveProducts(input);
  const clothingFiltered = clothing.length
    ? allResults.filter(({ product }) =>
        clothing.some((choice) => {
          const normalized = choice.toLowerCase();
          return (
            product.clothingType.toLowerCase().includes(normalized.replace("adaptive ", "")) ||
            normalized.includes(product.clothingType.toLowerCase()) ||
            normalized.includes(product.category)
          );
        })
      )
    : allResults;
  const availabilityFiltered = availability.toLowerCase().includes("in-store")
    ? clothingFiltered.filter(({ product }) => product.availability.inStore)
    : clothingFiltered;
  const visibleResults = availabilityFiltered.length > 0 ? availabilityFiltered : allResults;

  const nearbyCountries = location
    ? Array.from(new Set([location, ...expandShippingRegions([location])]))
    : [];
  const nearbyStores = location ? findNearbyStores({ countries: nearbyCountries }) : null;

  return (
    <div className="min-h-screen bg-ivory">
      <header className="paper-texture border-b border-ink/10 bg-paper py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Quiz complete</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Your recommended clothing pieces
          </h1>

          {profiles.length > 0 && (
            <div className="mt-6 max-w-3xl rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-4">
              <p className="text-sm font-bold text-primary-800">
                Step 1 · We understand your needs
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profiles.map((profile) => (
                  <span
                    key={profile.id}
                    title={profile.description}
                    className="badge bg-white text-primary-800"
                  >
                    {profile.label}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm font-bold text-primary-800">
                Step 2 · Narrowing down suitable adaptive clothing
              </p>
              <p className="mt-1 text-sm text-primary-950">{summary}</p>
              <p className="mt-2 text-xs text-primary-700/80">
                This groups your self-selected answers into shopping categories only — it is not a
                medical assessment or diagnosis.
              </p>
            </div>
          )}

          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">
            Individual items are ranked by your needs, location, clothing type,
            style, budget and dressing preferences. Brands are supporting
            information, not the starting point.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[...needs, ...styles, budget, lifestyleSetting && LIFESTYLE_LABELS[lifestyleSetting]]
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
          {nearbyStores && nearbyStores.places.length > 0 && (
            <div className="mt-4 max-w-3xl rounded-2xl border border-gray-200 bg-white px-5 py-4">
              <p className="text-sm font-semibold text-gray-700">
                {nearbyStores.places.length} demo stockist
                {nearbyStores.places.length === 1 ? "" : "s"} mapped near {location}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Sample locations from our directory — not a live store locator yet.{" "}
                <Link href="/map" className="font-semibold text-primary-700 underline">
                  See the map
                </Link>
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <RecommendationsGrid recommendations={visibleResults} />
      </main>
    </div>
  );
}
