"use client";

import { useState } from "react";
import type { ShareableProfile, Uniqueness } from "@/lib/signalMap";

function buildSummary(share: ShareableProfile, uniqueness: Uniqueness): string {
  return [
    "My Adaptive Clothing Profile",
    `Persona: ${share.persona}`,
    `Top need: ${share.topNeed}`,
    `Strongest signal: ${share.strongestSignal}`,
    `Style direction: ${share.styleDirection}`,
    `Shopping region: ${share.shoppingFrom}`,
    `Profile uniqueness: ${uniqueness.tier} — ${uniqueness.label}`,
    `Key tags: ${share.keyTags.join(", ") || "comfort & fit"}`,
  ].join("\n");
}

function buildSvg(share: ShareableProfile, uniqueness: Uniqueness): string {
  const rows = [
    ["Top need", share.topNeed],
    ["Strongest signal", share.strongestSignal],
    ["Style direction", share.styleDirection],
    ["Shopping region", share.shoppingFrom],
  ];
  const tagText = share.keyTags.join("  •  ") || "comfort & fit";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
  <rect width="640" height="420" rx="28" fill="#FCF9F2" stroke="#E7DAC4" stroke-width="2"/>
  <text x="40" y="56" font-family="Georgia, serif" font-size="15" fill="#76536E" letter-spacing="1">XI'S — ADAPTIVE CLOTHING</text>
  <text x="40" y="92" font-family="Georgia, serif" font-size="17" fill="#9a8f82">My Adaptive Clothing Profile</text>
  <text x="40" y="128" font-family="Georgia, serif" font-size="30" font-weight="600" fill="#29241F">${escapeXml(share.persona)}</text>
  ${rows
    .map(
      (r, i) =>
        `<text x="40" y="${182 + i * 44}" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#9a8f82" letter-spacing="1">${r[0].toUpperCase()}</text>
  <text x="40" y="${202 + i * 44}" font-family="Helvetica, Arial, sans-serif" font-size="19" font-weight="600" fill="#29241F">${escapeXml(r[1])}</text>`
    )
    .join("\n")}
  <text x="40" y="384" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#76536E">${escapeXml(tagText)}</text>
  <rect x="430" y="150" width="170" height="64" rx="14" fill="#EDE2EB"/>
  <text x="515" y="178" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#76536E" letter-spacing="1">PROFILE UNIQUENESS</text>
  <text x="515" y="200" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="600" fill="#29241F">${escapeXml(uniqueness.tier)}</text>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] ?? c));
}

export default function ProfileCard({
  share,
  uniqueness,
}: {
  share: ShareableProfile;
  uniqueness: Uniqueness;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildSummary(share, uniqueness));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const blob = new Blob([buildSvg(share, uniqueness)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adaptive-clothing-profile.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-paper">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-hand text-sm font-semibold text-primary-700">Shareable</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            My Adaptive Clothing Profile
          </h3>
          <p className="mt-1 font-display text-lg font-semibold text-primary-800">
            {share.persona}
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <Row label="Top need" value={share.topNeed} />
            <Row label="Strongest signal" value={share.strongestSignal} />
            <Row label="Style direction" value={share.styleDirection} />
            <Row label="Shopping region" value={share.shoppingFrom} />
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
