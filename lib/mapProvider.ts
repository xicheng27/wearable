import { MapPlace, mapPlaces } from "@/data/places";

/**
 * Store-locator abstraction. data/places.ts is a small, explicitly-labelled
 * sample dataset (see the comment at the top of that file) — real flagship
 * stores plus a couple of illustrative entries, not a live feed. No Google
 * Maps / Mapbox Places API is connected yet.
 *
 * This module is the placeholder seam for that future integration: callers
 * use `findNearbyStores`, and only this function's body needs to change
 * (to call a real geocoding/places API) once one is wired up. The `source`
 * field on the result makes it clear to any consumer whether the data shown
 * is demo data or a live lookup.
 */

export interface NearbyStoreQuery {
  /** Real country names (after expanding shipping-region aliases), or undefined for all. */
  countries?: string[];
  coords?: { lat: number; lng: number };
}

export interface NearbyStoreResult {
  source: "demo-dataset" | "map-api";
  places: MapPlace[];
}

export function findNearbyStores(query: NearbyStoreQuery): NearbyStoreResult {
  const places = query.countries?.length
    ? mapPlaces.filter((place) => query.countries!.includes(place.country))
    : mapPlaces;

  return { source: "demo-dataset", places };
}
