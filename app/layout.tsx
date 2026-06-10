import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}
