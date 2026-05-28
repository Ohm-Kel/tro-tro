import { NextResponse } from "next/server";
import { getStations } from "@/lib/cache";
import { findNearestStation } from "@/lib/haversine";
import type { NearestStationResponse } from "@/lib/types";

// Kumasi Metro Bounding Box
const KUMASI_MIN_LAT = 6.50;
const KUMASI_MAX_LAT = 6.85;
const KUMASI_MIN_LNG = -1.80;
const KUMASI_MAX_LNG = -1.45;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    if (!latStr || !lngStr) {
      return NextResponse.json(
        { error: "Query parameters 'lat' and 'lng' are required." },
        { status: 400 }
      );
    }

    const lat = Number(latStr);
    const lng = Number(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Coordinates 'lat' and 'lng' must be numbers." },
        { status: 400 }
      );
    }

    // Check if the user is outside Kumasi metro area
    if (
      lat < KUMASI_MIN_LAT ||
      lat > KUMASI_MAX_LAT ||
      lng < KUMASI_MIN_LNG ||
      lng > KUMASI_MAX_LNG
    ) {
      return NextResponse.json<NearestStationResponse>({
        station: null,
        distanceMeters: 0,
        warning: "You appear to be outside Kumasi. Auto-location only works within Kumasi. Please type your starting station.",
      });
    }

    const stations = await getStations();
    const nearestResult = findNearestStation(lat, lng, stations);

    if (!nearestResult.station) {
      return NextResponse.json<NearestStationResponse>({
        station: null,
        distanceMeters: nearestResult.distanceMeters,
        warning: `Too far from any known station (${(nearestResult.distanceMeters / 1000).toFixed(1)}km). Please type your starting station.`,
      });
    }

    return NextResponse.json<NearestStationResponse>(nearestResult);
  } catch (error: any) {
    console.error("Nearest station API handler error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
