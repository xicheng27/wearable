import type { Metadata } from "next";
import SavedClient from "./SavedClient";

export const metadata: Metadata = {
  title: "Saved Adaptive Clothing",
  description:
    "Your shortlist of saved adaptive clothing pieces, kept on this device so you can compare fit, features and availability later.",
  alternates: { canonical: "/saved" },
  // A per-device shortlist — useful to people, not to search engines.
  robots: { index: false, follow: true },
};

export default function SavedItemsPage() {
  return <SavedClient />;
}
