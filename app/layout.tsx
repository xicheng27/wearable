import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Xi's – Adaptive Fashion Finder",
  description:
    "Find adaptive clothing brands that work for your body. Browse by disability type, adaptive features, and more.",
  keywords: [
    "adaptive clothing",
    "disability fashion",
    "wheelchair clothing",
    "sensory clothing",
    "accessible fashion",
  ],
  openGraph: {
    title: "Xi's – Adaptive Fashion Finder",
    description:
      "Find adaptive clothing brands that work for your body.",
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
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
