import Link from "next/link";

export default function DisclaimerFooter() {
  return (
    <div className="border-t border-ink/10 bg-[#1F1B16] px-4 py-3 text-center text-xs leading-relaxed text-paper/65">
      Xi&apos;s is an independent adaptive clothing discovery tool. Product names
      and images are used for identification, with links to official retailers
      where available.{" "}
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
