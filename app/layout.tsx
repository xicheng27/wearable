import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import CurrencyProvider from "@/components/CurrencyProvider";
import LocationProvider from "@/components/LocationProvider";

export const metadata: Metadata = {
  title: "Xi's | Adaptive Clothing Finder",
  description:
    "Browse individual adaptive clothing items across brands by accessibility need, style, fit and adaptive feature.",
  keywords: [
    "adaptive clothing",
    "wheelchair clothing",
    "magnetic shirts",
    "easy entry shoes",
    "sensory friendly clothing",
  ],
  openGraph: {
    title: "Xi's | Adaptive Clothing Finder",
    description: "Compare individual adaptive clothing pieces across brands.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CurrencyProvider>
          <LocationProvider>
            <SiteChrome>{children}</SiteChrome>
          </LocationProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
