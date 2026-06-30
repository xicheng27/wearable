import type { Metadata } from "next";
import MapClient from "./MapClient";

export const metadata: Metadata = {
  title: "Global Adaptive Fashion Map",
  description:
    "Explore adaptive clothing stores, stockists, online services and alteration specialists by global region on an interactive accessibility-focused map.",
  alternates: { canonical: "/map" },
  openGraph: {
    title: "Global Adaptive Fashion Map | Xi's",
    description:
      "Adaptive clothing stores, stockists and services by global region.",
    url: "/map",
    type: "website",
  },
};

export default function MapPage() {
  return <MapClient />;
}
