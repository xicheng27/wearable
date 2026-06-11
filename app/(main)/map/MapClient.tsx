"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import MapCanvas from "@/components/MapCanvas";
import {
  categoryLabels,
  distanceKm,
  filterPlaces,
  mapFilters,
  mapPlaces,
} from "@/data/places";

type Coords = { lat: number; lng: number };

export default function MapClient() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "list">("map");
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");

  const places = useMemo(() => {
    const filtered = filterPlaces(mapPlaces, activeFilters);
    if (!userPos) return filtered;
    return [...filtered].sort(
      (a, b) => distanceKm(userPos, a) - distanceKm(userPos, b)
    );
  }, [activeFilters, userPos]);

  function toggleFilter(f: string) {
    setSelectedId(null);
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((v) => v !== f) : [...prev, f]
    );
  }

  function locateMe() {
    setLocateError("");
    if (!("geolocation" in navigator)) {
      setLocateError("Location isn't available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocateError("We couldn't access your location.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  const listPanel = (
    <div className="space-y-3">
      {places.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <p className="text-sm font-medium text-gray-900">No places match those filters</p>
          <p className="mt-1 text-sm text-gray-500">Try removing a filter or two.</p>
          <button onClick={() => setActiveFilters([])} className="btn-secondary mt-5">
            Clear filters
          </button>
        </div>
      ) : (
        places.map((p) => {
          const isSelected = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(isSelected ? null : p.id);
                setView("map");
              }}
              className={`card w-full p-5 text-left transition-all duration-200 hover:border-gray-200 ${
                isSelected ? "border-primary-300 ring-1 ring-primary-200" : ""
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-primary-600">
                    {categoryLabels[p.category]}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-gray-900">{p.name}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {p.address} · {p.city}, {p.country}
                  </p>
                </div>
                {userPos && (
                  <span className="flex-shrink-0 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                    {Math.round(distanceKm(userPos, p)).toLocaleString()} km
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {p.tags
                  .filter((t) => t !== "Online-only")
                  .map((t) => (
                    <span key={t} className="badge bg-gray-50 text-gray-500">
                      {t}
                    </span>
                  ))}
              </div>
              {p.brandId && (
                <Link
                  href={`/brands/${p.brandId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  View brand
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </button>
          );
        })
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Adaptive fashion near you
              </h1>
              <p className="mt-1.5 text-sm text-gray-500">
                Stores, stockists and alteration services with an accessibility focus.
              </p>
            </div>
            <button
              onClick={locateMe}
              disabled={locating}
              className="btn-secondary disabled:opacity-60"
            >
              {locating ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600" aria-hidden="true" />
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {userPos ? "Location set" : "Use my location"}
            </button>
          </div>
          {locateError && (
            <p className="mt-2 text-sm text-amber-600" role="status">
              {locateError}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {mapFilters.map((f) => {
              const active = activeFilters.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleFilter(f)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                    active
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile: map/list tabs */}
        <div className="mb-4 flex rounded-full border border-gray-200 bg-white p-1 lg:hidden" role="tablist" aria-label="Map or list view">
          {(["map", "list"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-all duration-200 ${
                view === v ? "bg-primary-600 text-white shadow-sm" : "text-gray-500"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className={`lg:block lg:w-[380px] lg:flex-shrink-0 ${view === "list" ? "" : "hidden"}`}>
            <p className="mb-3 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{places.length}</span>{" "}
              {places.length === 1 ? "place" : "places"}
              {userPos ? " · sorted by distance" : ""}
            </p>
            <div className="lg:max-h-[640px] lg:overflow-y-auto lg:pr-1">{listPanel}</div>
          </div>

          <div className={`min-w-0 flex-1 lg:block ${view === "map" ? "" : "hidden"}`}>
            <MapCanvas
              places={places}
              selectedId={selectedId}
              onSelect={setSelectedId}
              className="aspect-[4/3] lg:sticky lg:top-24 lg:aspect-auto lg:h-[700px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
