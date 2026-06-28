"use client";

import { useState } from "react";
import type { ShareableProfile } from "@/lib/signalMap";

function buildSummary(share: ShareableProfile, completeness: number): string {
  return [
    "My Adaptive Clothing Profile",
    `Top need: ${share.topNeed}`,
    `Strongest signal: ${share.strongestSignal}`,
    `Style direction: ${share.styleDirection}`,
    `Key tags: ${share.keyTags.join(", ") || "comfort & fit"}`,
    `Shopping from: ${share.shoppingFrom}`,
    `Profile completeness: ${completeness}%`,
  ].join("\n");
}

function buildSvg(share: ShareableProfile, completeness: number): string {
  const rows = [
    ["Top need", share.topNeed],
    ["Strongest signal", share.strongestSignal],
    ["Style direction", share.styleDirection],
    ["Shopping from", share.shoppingFrom],
  ];
  const tagText = share.keyTags.join("  •  ") || "comfort & fit";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
  <rect width="640" height="400" rx="28" fill="#FCF9F2" stroke="#E7DAC4" stroke-width="2"/>
  <text x="40" y="58" font-family="Georgia, serif" font-size="15" fill="#76536E" letter-spacing="1">XI'S — ADAPTIVE CLOTHING</text>
  <text x="40" y="100" font-family="Georgia, serif" font-size="30" font-weight="600" fill="#29241F">My Adaptive Clothing Profile</text>
  ${rows
    .map(
      (r, i) =>
        `<text x="40" y="${156 + i * 44}" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#9a8f82" letter-spacing="1">${r[0].toUpperCase()}</text>
  <text x="40" y="${176 + i * 44}" font-family="Helvetica, Arial, sans-serif" font-size="19" font-weight="600" fill="#29241F">${escapeXml(r[1])}</text>`
    )
    .join("\n")}
  <text x="40" y="356" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#76536E">${escapeXml(tagText)}</text>
  <circle cx="560" cy="96" r="48" fill="none" stroke="#EDE2EB" stroke-width="10"/>
  <circle cx="560" cy="96" r="48" fill="none" stroke="#76536E" stroke-width="10" stroke-linecap="round"
    stroke-dasharray="${(completeness / 100) * 301.6} 301.6" transform="rotate(-90 560 96)"/>
  <text x="560" y="102" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="600" fill="#29241F">${completeness}%</text>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] ?? c));
}

export default function ProfileCard({
  share,
  completeness,
}: {
  share: ShareableProfile;
  completeness: number;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildSummary(share, completeness));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const blob = new Blob([buildSvg(share, completeness)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adaptive-clothing-profile.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-paper">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-hand text-sm font-semibold text-primary-700">Shareable</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            My Adaptive Clothing Profile
          </h3>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <Row label="Top need" value={share.topNeed} />
            <Row label="Strongest signal" value={share.strongestSignal} />
            <Row label="Style direction" value={share.styleDirection} />
            <Row label="Shopping from" value={share.shoppingFrom} />
          </dl>
          {share.keyTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {share.keyTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-primary-800"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-ink/50">
            Privacy-safe by default — sensitive medical details are softened for sharing.
          </p>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col">
          <button type="button" onClick={copy} className="btn-secondary px-4 py-2 text-sm">
            {copied ? "Copied" : "Copy summary"}
          </button>
          <button type="button" onClick={download} className="btn-primary px-4 py-2 text-sm">
            Download card
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wide text-ink/45">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
    </div>
  );
}
