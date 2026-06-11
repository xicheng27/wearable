"use client";

import { MapPlace, categoryLabels } from "@/data/places";
import Link from "next/link";

/**
 * Stylised preview map. Pins are projected from real lat/lng with an
 * equirectangular projection, so this component can be replaced 1:1 with a
 * Mapbox GL / Google Maps implementation later — keep the same props
 * (places, selectedId, onSelect) and swap the canvas internals.
 */

const BOUNDS = { minLng: -130, maxLng: 120, minLat: -8, maxLat: 62 };
const W = 1000;
const H = 560;

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * (W - 120) + 60;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * (H - 120) + 60;
  return { x, y };
}

interface MapCanvasProps {
  places: MapPlace[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  interactive?: boolean;
  className?: string;
}

export default function MapCanvas({
  places,
  selectedId = null,
  onSelect,
  interactive = true,
  className = "",
}: MapCanvasProps) {
  const selected = places.find((p) => p.id === selectedId) ?? null;
  const selectedPos = selected ? project(selected.lat, selected.lng) : null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-gray-100 bg-[#F5F4F9] ${className}`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        role="img"
        aria-label="Map of adaptive fashion locations"
        onClick={() => interactive && onSelect?.(null)}
      >
        {/* Abstract coastline shapes — decorative only */}
        <g fill="#EAE7F2">
          <path d="M40 110 C140 60 230 100 290 150 C350 200 330 290 270 340 C210 390 130 380 80 320 C30 260 -20 160 40 110 Z" />
          <path d="M610 90 C700 50 800 70 870 120 C940 170 960 250 900 300 C840 350 760 330 700 290 C640 250 540 130 610 90 Z" />
          <path d="M180 420 C250 390 330 410 360 460 C390 510 340 560 270 555 C200 550 110 460 180 420 Z" />
        </g>
        {/* Grid */}
        <g stroke="#DFDBEB" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2={H} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * 100} x2={W} y2={(i + 1) * 100} />
          ))}
        </g>
        {/* Pins */}
        {places.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          const isSelected = p.id === selectedId;
          return (
            <g
              key={p.id}
              transform={`translate(${x}, ${y})`}
              className={interactive ? "cursor-pointer" : ""}
              onClick={(e) => {
                if (!interactive) return;
                e.stopPropagation();
                onSelect?.(isSelected ? null : p.id);
              }}
              role={interactive ? "button" : undefined}
              aria-label={`${p.name}, ${p.city}`}
            >
              <circle r="16" fill="#7C3AED" opacity={isSelected ? 0.25 : 0.12}>
                {isSelected && (
                  <animate attributeName="r" values="14;20;14" dur="1.6s" repeatCount="indefinite" />
                )}
              </circle>
              <path
                d="M0 8 C-7 0 -9 -4 -9 -9 a9 9 0 1 1 18 0 c0 5 -2 9 -9 17 Z"
                transform="translate(0,-6)"
                fill={isSelected ? "#5B21B6" : "#7C3AED"}
                stroke="white"
                strokeWidth="2.5"
              />
              <circle cy="-15" r="3.4" fill="white" />
            </g>
          );
        })}
      </svg>

      {/* Selected place popup */}
      {selected && selectedPos && (
        <div
          className="animate-fade-up absolute z-10 w-60 -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-4 shadow-lift"
          style={{
            left: `${(selectedPos.x / W) * 100}%`,
            top: `${(selectedPos.y / H) * 100}%`,
            transform: "translate(-50%, 14px)",
          }}
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-primary-600">
            {categoryLabels[selected.category]}
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{selected.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {selected.address} · {selected.city}
          </p>
          {selected.brandId && (
            <Link
              href={`/brands/${selected.brandId}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              View brand
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      )}

      <span className="absolute bottom-3 right-4 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-gray-500 backdrop-blur-sm">
        Preview map · live map coming soon
      </span>
    </div>
  );
}
