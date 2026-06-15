"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import MapCanvas from "@/components/MapCanvas";
import {
  categoryLabels,
  distanceKm,
  filterPlaces,
  filterPlacesByRegion,
  mapFilters,
  mapPlaces,
  mapRegions,
  MapRegionId,
  regionForCoordinates,
} from "@/data/places";

type Coords = { lat: number; lng: number };

export default function MapClient() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [region, setRegion] = useState<MapRegionId>("global");
  const [view, setView] = useState<"map" | "list">("map");
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");

  const filteredPlaces = useMemo(
    () => filterPlaces(mapPlaces, activeFilters),
    [activeFilters]
  );
  const places = useMemo(() => {
    const regional = filterPlacesByRegion(filteredPlaces, region);
    if (!userPos) return regional;
    return [...regional].sort(
      (a, b) => distanceKm(userPos, a) - distanceKm(userPos, b)
    );
  }, [filteredPlaces, region, userPos]);
  const regionCounts = useMemo(
    () =>
      Object.fromEntries(
        mapRegions.map((item) => [
          item.id,
          filterPlacesByRegion(filteredPlaces, item.id).length,
        ])
      ) as Record<MapRegionId, number>,
    [filteredPlaces]
  );

  const countries = new Set(places.map((place) => place.country)).size;
  const currentRegion =
    mapRegions.find((item) => item.id === region) ?? mapRegions[0];

  function selectRegion(nextRegion: MapRegionId) {
    setRegion(nextRegion);
    setSelectedId(null);
  }

  function toggleFilter(filter: string) {
    setSelectedId(null);
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((value) => value !== filter)
        : [...current, filter]
    );
  }

  function locateMe() {
    setLocateError("");
    if (!("geolocation" in navigator)) {
      setLocateError("Location is not available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPos(coordinates);
        setRegion(regionForCoordinates(coordinates));
        setSelectedId(null);
        setLocating(false);
      },
      () => {
        setLocateError("We could not access your location.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  const listPanel = (
    <div className="space-y-3">
      {places.length === 0 ? (
        <div className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            No locations in this view yet
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink/55">
            Try the global view or remove a filter. Directory coverage is still growing.
          </p>
          <button
            onClick={() => {
              setActiveFilters([]);
              setRegion("global");
            }}
            className="btn-secondary mt-5"
          >
            Show global map
          </button>
        </div>
      ) : (
        places.map((place) => {
          const isSelected = place.id === selectedId;
          return (
            <button
              key={place.id}
              onClick={() => {
                setSelectedId(isSelected ? null : place.id);
                setView("map");
              }}
              className={`paper-panel w-full rounded-[1.35rem_.55rem_1.35rem_1.35rem] p-5 text-left transition duration-200 motion-safe:hover:-translate-y-0.5 ${
                isSelected
                  ? "border-primary-400 ring-2 ring-primary-200"
                  : "hover:border-primary-200"
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-hand text-[11px] font-semibold text-primary-700">
                    {categoryLabels[place.category]}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-ink">
                    {place.name}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-ink/50">
                    {place.city}, {place.country}
                  </p>
                </div>
                {userPos && (
                  <span className="sticker flex-shrink-0">
                    {Math.round(distanceKm(userPos, place)).toLocaleString()} km
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {place.tags
                  .filter((tag) => tag !== "Online-only")
                  .map((tag) => (
                    <span key={tag} className="badge bg-sand/45 text-ink/60">
                      {tag}
                    </span>
                  ))}
              </div>
              {place.brandId && (
                <Link
                  href={`/brands/${place.brandId}`}
                  onClick={(event) => event.stopPropagation()}
                  className="link-underline mt-3 inline-block text-xs"
                >
                  View brand &rarr;
                </Link>
              )}
            </button>
          );
        })
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <header className="paper-texture border-b border-ink/10 bg-[#EEE5D5] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Global adaptive fashion directory</p>
              <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-[.98] tracking-[-.04em] text-ink sm:text-6xl">
                Find access-minded fashion, wherever you are.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">
                Explore adaptive clothing stores, stockists, online services and
                alteration specialists by region.
              </p>
            </div>
            <button
              onClick={locateMe}
              disabled={locating}
              className="btn-secondary disabled:opacity-60"
            >
              {locating ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-primary-700" aria-hidden="true" />
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
              {userPos ? "Location set" : "Use my location"}
            </button>
          </div>

          {locateError && <p className="mt-3 text-sm font-medium text-clay" role="status">{locateError}</p>}

          <div className="mt-10 grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Map region">
            {mapRegions.map((item, index) => {
              const active = region === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectRegion(item.id)}
                  className={`rounded-[1.35rem_.55rem_1.35rem_1.35rem] border p-4 text-left transition duration-200 ${
                    active
                      ? "border-primary-700 bg-primary-800 text-paper shadow-paper"
                      : "border-ink/10 bg-paper/75 text-ink hover:border-primary-300"
                  }`}
                >
                  <span className={`font-hand text-xs font-semibold ${active ? "text-lavender" : "text-primary-700"}`}>
                    0{index + 1}
                  </span>
                  <span className="mt-2 flex items-end justify-between gap-3">
                    <span className="font-display text-xl font-semibold">{item.shortLabel}</span>
                    <span className={`text-xs ${active ? "text-paper/65" : "text-ink/45"}`}>
                      {regionCounts[item.id]} places
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {mapFilters.map((filter) => {
              const active = activeFilters.includes(filter);
              return (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  aria-pressed={active}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-ink/10 bg-paper text-ink/65 hover:border-primary-300"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 grid gap-4 rounded-2xl border border-ink/10 bg-paper/70 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="font-display text-xl font-semibold text-ink">{currentRegion.label}</p>
            <p className="mt-1 text-sm text-ink/55">{currentRegion.description}</p>
          </div>
          <div className="flex gap-5 text-sm">
            <span><strong className="font-display text-2xl text-primary-800">{places.length}</strong><small className="ml-1 text-ink/50">places</small></span>
            <span><strong className="font-display text-2xl text-primary-800">{countries}</strong><small className="ml-1 text-ink/50">countries</small></span>
          </div>
        </div>

        <div className="mb-4 flex rounded-xl border border-ink/10 bg-paper p-1 lg:hidden" role="tablist" aria-label="Map or list view">
          {(["map", "list"] as const).map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={view === item}
              onClick={() => setView(item)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize ${
                view === item ? "bg-primary-700 text-white shadow-sm" : "text-ink/55"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className={`lg:block lg:w-[370px] lg:flex-shrink-0 ${view === "list" ? "" : "hidden"}`}>
            <p className="mb-3 text-sm text-ink/50">
              {userPos ? "Sorted by distance from you" : "Select a place to highlight it on the map"}
            </p>
            <div className="lg:max-h-[680px] lg:overflow-y-auto lg:pr-2">{listPanel}</div>
          </aside>

          <section className={`min-w-0 flex-1 lg:block ${view === "map" ? "" : "hidden"}`} aria-label="Location map">
            <MapCanvas
              places={places}
              region={region}
              selectedId={selectedId}
              onSelect={setSelectedId}
              className="aspect-[4/3] sm:aspect-[16/10] lg:sticky lg:top-24 lg:h-[700px] lg:aspect-auto"
            />
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Directory coverage is growing. Confirm details with the store before visiting.</p>
          <Link href="/search" className="link-underline w-fit text-sm">
            Browse items available online &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
