import { Suspense } from "react";
import ResultsClient from "./ResultsClient";
import { LogoMark } from "@/components/Logo";

export const metadata = {
  title: "Your matches – Xi's",
  description: "Adaptive brands ranked by how well they fit your needs and style.",
};

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
          <LogoMark size={44} className="animate-pulse" />
          <p className="text-sm text-gray-400">Finding your matches…</p>
        </div>
      }
    >
      <ResultsClient />
    </Suspense>
  );
}
