import type { Station } from "./types";

/**
 * Calculates the geodetic distance between two points in meters using the Haversine formula.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the nearest station within 2km (2000m) limit.
 */
export function findNearestStation(
  lat: number,
  lng: number,
  stations: Station[]
): { station: Station | null; distanceMeters: number } {
  let nearestStation: Station | null = null;
  let minDistance = Infinity;

  for (const station of stations) {
    const dist = haversineDistance(lat, lng, station.lat, station.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestStation = station;
    }
  }

  // Cap at 2km as per the brief requirement
  if (minDistance > 2000) {
    return { station: null, distanceMeters: minDistance };
  }

  return { station: nearestStation, distanceMeters: Math.round(minDistance) };
}

/**
 * Sort stations by distance from reference point.
 */
export function sortByDistance(
  lat: number,
  lng: number,
  stations: Station[]
): { station: Station; distanceMeters: number }[] {
  return stations
    .map((station) => ({
      station,
      distanceMeters: Math.round(haversineDistance(lat, lng, station.lat, station.lng)),
    }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}
