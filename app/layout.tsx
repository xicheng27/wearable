import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import CurrencyProvider from "@/components/CurrencyProvider";
import CountryProvider from "@/components/CountryProvider";
import CountryPicker from "@/components/CountryPicker";
import DisclaimerFooter from "@/components/DisclaimerFooter";

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
          <CountryProvider>
            <SiteChrome>{children}</SiteChrome>
            <CountryPicker />
            <DisclaimerFooter />
          </CountryProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
