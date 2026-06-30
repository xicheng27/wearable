import type { Metadata } from "next";
import SingaporeCatalogue from "./SingaporeCatalogue";

export const metadata: Metadata = {
  title: "Adaptive Clothing in Singapore — Buying Guide",
  description:
    "Find adaptive clothing that ships to Singapore: disability-friendly, mobility-friendly and sensory-friendly pieces, plus local services and stockists, filterable by need and category.",
  alternates: { canonical: "/singapore" },
  openGraph: {
    title: "Adaptive Clothing in Singapore — Buying Guide | Xi's",
    description:
      "Adaptive, accessible clothing available to Singapore shoppers, filterable by accessibility need and category.",
    url: "/singapore",
    type: "website",
  },
};

export default function SingaporeCataloguePage() {
  return <SingaporeCatalogue />;
}
