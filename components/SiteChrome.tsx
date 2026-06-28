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
        <main className="h-[calc(100dvh-2.25rem)] min-h-0 overflow-hidden">
          {children}
        </main>
        <AccessibilityPanel />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <AccessibilityPanel />
      <Footer />
    </>
  );
}
