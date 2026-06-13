import { redirect } from "next/navigation";

interface LegacyResultsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function LegacyResultsPage({
  searchParams,
}: LegacyResultsPageProps) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value) {
      params.set(key, value);
    }
  });

  redirect(`/quiz/results?${params.toString()}`);
}
