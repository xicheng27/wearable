import Link from "next/link";

export default function DisclaimerFooter() {
  return (
    <div className="border-t border-ink/10 bg-[#1F1B16] px-4 py-3 text-center text-xs leading-relaxed text-paper/65">
      Xi&apos;s helps you discover adaptive clothing options based on the needs
      you state — it is an independent discovery tool, not a retailer. Product
      details, availability, prices and shipping may change. Always confirm
      fit, sizing, medical-device compatibility and return policies on the
      official retailer&apos;s site before purchasing.{" "}
      <Link href="/disclaimer" className="underline underline-offset-2 hover:text-paper">
        Disclaimer
      </Link>{" "}
      ·{" "}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-paper">
        Privacy
      </Link>
    </div>
  );
}
