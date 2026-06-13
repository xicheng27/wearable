"use client";

import Link from "next/link";
import {
  categoryLabels,
  MapPlace,
  MapRegionId,
} from "@/data/places";

const W = 1200;
const H = 620;

const viewBoxes: Record<MapRegionId, string> = {
  global: `0 0 ${W} ${H}`,
  "north-america": "20 55 500 300",
  europe: "500 55 320 192",
};

function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

const categoryColors = {
  flagship: "#76536E",
  stockist: "#81907A",
  alterations: "#B97861",
  online: "#29241F",
} as const;

interface MapCanvasProps {
  places: MapPlace[];
  region?: MapRegionId;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  interactive?: boolean;
  className?: string;
}

export default function MapCanvas({
  places,
  region = "global",
  selectedId = null,
  onSelect,
  interactive = true,
  className = "",
}: MapCanvasProps) {
  const selected = places.find((place) => place.id === selectedId) ?? null;

  return (
    <div
      className={`paper-texture relative overflow-hidden rounded-[2rem_.75rem_2rem_2rem] border border-ink/15 bg-[#E9E0CE] shadow-paper ${className}`}
    >
      <svg
        viewBox={viewBoxes[region]}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full transition-all duration-500"
        role="img"
        aria-label={`${region === "global" ? "Global" : region === "europe" ? "European" : "North American"} map of adaptive fashion locations`}
        onClick={() => interactive && onSelect?.(null)}
      >
        <rect width={W} height={H} fill="#E9E0CE" />

        <g stroke="#9C917F" strokeWidth="1" opacity=".22" strokeDasharray="4 7">
          {Array.from({ length: 11 }).map((_, index) => (
            <line key={`v-${index}`} x1={(index + 1) * 100} y1="0" x2={(index + 1) * 100} y2={H} />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <line key={`h-${index}`} x1="0" y1={(index + 1) * 100} x2={W} y2={(index + 1) * 100} />
          ))}
        </g>

        <g fill="#C8CDBF" stroke="#AEB4A7" strokeWidth="2">
          <path d="M70 170 112 108 190 80 265 92 326 130 354 184 320 222 275 217 244 252 201 267 172 235 129 226 94 205Z" />
          <path d="m280 260 40 30 28 61-10 78-32 91-30-31 6-85-18-70Z" />
          <path d="m538 125 54-27 82 7 36 36-31 28-54-5-31 22-49-17Z" />
          <path d="m573 190 67-15 69 40 25 83-42 112-58 43-40-71-18-88-40-55Z" />
          <path d="m683 103 97-37 144 18 111 62 86 53-28 58-93-3-54 34-91-14-63-55-74-25Z" />
          <path d="m947 405 67-25 79 30 20 55-67 42-81-29Z" />
          <path d="m386 72 32-25 42 10-9 31-42 13Z" />
        </g>

        <g fill="none" stroke="#B97861" strokeLinecap="round" opacity=".5">
          <path d="M355 190C465 110 555 105 635 135" strokeWidth="2.5" strokeDasharray="7 9" />
          <path d="M280 210C390 270 485 245 575 190" strokeWidth="1.5" strokeDasharray="5 10" />
        </g>

        <g fill="#635C52" fontFamily="Aptos, sans-serif" fontSize="15" opacity=".7">
          <text x="155" y="155">NORTH AMERICA</text>
          <text x="286" y="375">SOUTH AMERICA</text>
          <text x="582" y="145">EUROPE</text>
          <text x="620" y="285">AFRICA</text>
          <text x="835" y="160">ASIA</text>
          <text x="991" y="453">OCEANIA</text>
        </g>

        {places.map((place) => {
          const { x, y } = project(place.lat, place.lng);
          const isSelected = place.id === selectedId;
          const color = categoryColors[place.category];
          return (
            <g
              key={place.id}
              transform={`translate(${x}, ${y})`}
              className={interactive ? "cursor-pointer outline-none" : ""}
              onClick={(event) => {
                if (!interactive) return;
                event.stopPropagation();
                onSelect?.(isSelected ? null : place.id);
              }}
              onKeyDown={(event) => {
                if (!interactive || !["Enter", " "].includes(event.key)) return;
                event.preventDefault();
                onSelect?.(isSelected ? null : place.id);
              }}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={`${place.name}, ${place.city}, ${place.country}`}
              aria-pressed={interactive ? isSelected : undefined}
            >
              <circle r={isSelected ? 24 : 18} fill={color} opacity={isSelected ? ".22" : ".12"} />
              <path
                d="M0 9C-8 0-10-5-10-11a10 10 0 1 1 20 0c0 6-2 11-10 20Z"
                transform="translate(0,-7)"
                fill={color}
                stroke="#FCF9F2"
                strokeWidth="3"
              />
              <circle cy="-18" r="3.6" fill="#FCF9F2" />
            </g>
          );
        })}
      </svg>

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-ink/10 bg-paper/90 px-3 py-2 text-xs font-semibold text-ink/65 shadow-sm backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
        {region === "global" ? "Global directory" : region === "europe" ? "Europe focus" : "North America focus"}
      </div>

      {selected && (
        <div className="paper-panel animate-fade-up absolute bottom-5 left-5 z-10 w-[min(19rem,calc(100%-2.5rem))] rounded-[1.25rem_.5rem_1.25rem_1.25rem] p-4 shadow-lift">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-hand text-[11px] font-semibold text-primary-700">
                {categoryLabels[selected.category]}
              </p>
              <p className="mt-1 font-display text-lg font-semibold leading-tight text-ink">
                {selected.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect?.(null)}
              className="rounded-md p-1 text-ink/45 hover:bg-sand/50 hover:text-ink"
              aria-label="Close location details"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-ink/55">
            {selected.address} &middot; {selected.city}, {selected.country}
          </p>
          {selected.brandId && (
            <Link href={`/brands/${selected.brandId}`} className="link-underline mt-3 inline-block text-xs">
              View brand &rarr;
            </Link>
          )}
        </div>
      )}

      <div className="absolute bottom-4 right-4 hidden rounded-lg border border-ink/10 bg-paper/90 p-2.5 text-[10px] text-ink/60 shadow-sm backdrop-blur sm:block">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {Object.entries(categoryLabels).map(([category, label]) => (
            <span key={category} className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
