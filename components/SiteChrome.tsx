"use client";

import { usePathname } from "next/navigation";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullScreen = pathname === "/quiz" || pathname === "/";

  if (isFullScreen) {
    return (
      <>
        <main id="main-content" className="h-[calc(100dvh-2.25rem)] min-h-0 overflow-hidden">
          {children}
        </main>
        <AccessibilityPanel />
      </>
    );
  }

  // Content pages render their own <main> landmark, so this wrapper is a plain
  // focus target for the skip link (avoids nesting two <main> elements).
  return (
    <>
      <Navbar />
      <div id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </div>
      <AccessibilityPanel />
      <Footer />
    </>
  );
}
