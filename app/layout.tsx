import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
