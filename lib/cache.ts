import { createClient } from "@/utils/supabase/server";
import { buildGraph } from "./graph";
import type { Station, Route, RouteStop, RouteGraph, TransferIndex } from "./types";

let stationsCache: Station[] | null = null;
let routesCache: Route[] | null = null;
let routeStopsCache: RouteStop[] | null = null;
let graphCache: RouteGraph | null = null;
let transferIndexCache: TransferIndex | null = null;
let stationMapCache: Map<string, Station> | null = null;
let lastLoaded = 0;

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Initializes the in-memory cache. Fetches all transit data from Supabase in parallel
 * and builds the graph on cold starts or cache expiration.
 */
export async function initCache(force = false) {
  const now = Date.now();
  if (!force && stationsCache && now - lastLoaded < CACHE_TTL) {
    return;
  }

  try {
    const supabase = createClient();

    // Fetch tables concurrently
    const [stationsRes, routesRes, stopsRes] = await Promise.all([
      supabase.from("stations").select("*"),
      supabase.from("routes").select("*"),
      supabase.from("route_stops").select("*"),
    ]);

    if (stationsRes.error) throw stationsRes.error;
    if (routesRes.error) throw routesRes.error;
    if (stopsRes.error) throw stopsRes.error;

    // Map to domain interfaces
    stationsCache = stationsRes.data.map((s: any) => ({
      id: s.id,
      name: s.name,
      aliases: s.aliases || [],
      lat: Number(s.lat),
      lng: Number(s.lng),
      city: s.city,
    }));

    routesCache = routesRes.data.map((r: any) => ({
      id: r.id,
      name: r.name,
      color: r.color || "#f59e0b",
      vehicle_note: r.vehicle_note || "",
      bidirectional: r.bidirectional ?? true,
    }));

    routeStopsCache = stopsRes.data.map((s: any) => ({
      route_id: s.route_id,
      station_id: s.station_id,
      sequence: Number(s.sequence),
      fare_from_start: Number(s.fare_from_start || 0),
    }));

    // Build helper indexes
    stationMapCache = new Map();
    stationsCache.forEach((station) => stationMapCache!.set(station.id, station));

    const { graph, transferIndex } = buildGraph(routesCache!, routeStopsCache!);
    graphCache = graph;
    transferIndexCache = transferIndex;

    lastLoaded = Date.now();
  } catch (error) {
    console.error("Cache initialization failed:", error);
    throw error;
  }
}

export function invalidateCache() {
  stationsCache = null;
  routesCache = null;
  routeStopsCache = null;
  graphCache = null;
  transferIndexCache = null;
  stationMapCache = null;
  lastLoaded = 0;
}

export function isReady(): boolean {
  return stationsCache !== null;
}

export async function getStations(): Promise<Station[]> {
  await initCache();
  return stationsCache!;
}

export async function getRoutes(): Promise<Route[]> {
  await initCache();
  return routesCache!;
}

export async function getRouteStops(): Promise<RouteStop[]> {
  await initCache();
  return routeStopsCache!;
}

export async function getGraph(): Promise<RouteGraph> {
  await initCache();
  return graphCache!;
}

export async function getTransferIndex(): Promise<TransferIndex> {
  await initCache();
  return transferIndexCache!;
}

export async function getStationMap(): Promise<Map<string, Station>> {
  await initCache();
  return stationMapCache!;
}

/**
 * Perform exact match search against station names and aliases
 */
export async function getStationByName(name: string): Promise<Station | null> {
  const stations = await getStations();
  const normalized = name.toLowerCase().trim();

  // 1. Check exact name match
  let found = stations.find((s) => s.name.toLowerCase() === normalized);
  if (found) return found;

  // 2. Check exact alias match
  found = stations.find((s) =>
    s.aliases.some((alias) => alias.toLowerCase() === normalized)
  );

  return found || null;
}

/**
 * Searches stations and aliases using substring matches for autocomplete.
 */
export async function searchStationsLocal(query: string): Promise<Station[]> {
  if (!query) return [];
  const stations = await getStations();
  const normalized = query.toLowerCase().trim();

  return stations.filter(
    (s) =>
      s.name.toLowerCase().includes(normalized) ||
      s.aliases.some((alias) => alias.toLowerCase().includes(normalized))
  );
}
