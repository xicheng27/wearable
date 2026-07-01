import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Start the Adaptive Clothing Quiz",
  description:
    "Answer a few quick visual questions about mobility, comfort, access needs, clothing type, style and location, and get adaptive clothing recommendations matched to you.",
  alternates: { canonical: "/quiz" },
  openGraph: {
    title: "Start the Adaptive Clothing Quiz | Xi's",
    description:
      "Get adaptive clothing recommendations matched to your body, needs, style and location in about two minutes.",
    url: "/quiz",
    type: "website",
  },
};

export default function QuizPage() {
  return <QuizClient />;
}
