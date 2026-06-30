import Link from "next/link";

export default function DisclaimerFooter() {
  return (
    <div className="border-t border-ink/10 bg-[#1F1B16] px-4 py-3 text-center text-[11px] leading-relaxed text-paper/55">
      Independent discovery tool — not affiliated with any brand. Verify details
      on the official retailer.{" "}
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
