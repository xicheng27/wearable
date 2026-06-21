import Link from "next/link";

export default function DisclaimerFooter() {
  return (
    <div className="border-t border-ink/10 bg-[#1F1B16] px-4 py-3 text-center text-[11px] leading-relaxed text-paper/55">
      Xi&apos;s is an independent adaptive clothing discovery tool and is not
      affiliated with any brand. All product names and images are used for
      identification purposes only.{" "}
      <Link href="/disclaimer" className="underline underline-offset-2 hover:text-paper">
        Read our disclaimer
      </Link>
    </div>
  );
}
