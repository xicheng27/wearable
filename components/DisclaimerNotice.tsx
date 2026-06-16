import Link from "next/link";

const disclaimerText =
  "This website is an independent adaptive fashion discovery tool and is not affiliated with any brand. All product names, brand names, and images are used for identification and accessibility reference purposes only.";

export default function DisclaimerNotice({
  compact = false,
}: {
  compact?: boolean;
}) {
  if (compact) {
    return (
      <footer className="border-t border-ink/10 bg-paper px-4 py-2 text-center text-[11px] leading-4 text-ink/55">
        <span>{disclaimerText}</span>{" "}
        <Link href="/disclaimer" className="font-semibold underline underline-offset-2">
          Disclaimer
        </Link>
      </footer>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-paper/10 bg-paper/5 px-4 py-4 text-xs leading-6 text-paper/55">
      <p>{disclaimerText}</p>
      <Link
        href="/disclaimer"
        className="mt-2 inline-flex font-semibold text-paper/75 underline underline-offset-4 hover:text-paper"
      >
        Read the full disclaimer
      </Link>
    </div>
  );
}
