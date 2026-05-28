import type { Route, RouteStop, RouteGraph, TransferIndex } from "./types";

/**
 * Builds the routing graph and transfer indexes from raw routes and stops.
 * This is loaded once on startup and cached.
 */
export function buildGraph(
  routes: Route[],
  routeStops: RouteStop[]
): { graph: RouteGraph; transferIndex: TransferIndex } {
  const graph: RouteGraph = new Map();
  const transferIndex: TransferIndex = new Map();

  // 1. Group route stops by route ID
  const stopsByRoute = new Map<string, RouteStop[]>();
  routeStops.forEach((stop) => {
    if (!stopsByRoute.has(stop.route_id)) {
      stopsByRoute.set(stop.route_id, []);
    }
    stopsByRoute.get(stop.route_id)!.push(stop);
  });

  // Create quick route lookup map
  const routeMap = new Map<string, Route>();
  routes.forEach((r) => routeMap.set(r.id, r));

  // Helper to add directed edge to graph
  const addEdge = (fromStationId: string, toStationId: string, routeId: string, fare: number) => {
    if (!graph.has(fromStationId)) {
      graph.set(fromStationId, []);
    }
    
    const edges = graph.get(fromStationId)!;
    // Deduplicate: prevent duplicate (from, to, route) entries
    const isDuplicate = edges.some(
      (e) => e.toStationId === toStationId && e.routeId === routeId
    );
    
    if (!isDuplicate) {
      edges.push({ toStationId, routeId, fare });
    }

    // Index station to route relationship for transfer checking
    if (!transferIndex.has(fromStationId)) {
      transferIndex.set(fromStationId, new Set());
    }
    transferIndex.get(fromStationId)!.add(routeId);

    if (!transferIndex.has(toStationId)) {
      transferIndex.set(toStationId, new Set());
    }
    transferIndex.get(toStationId)!.add(routeId);
  };

  // 2. Build edges between consecutive stops
  stopsByRoute.forEach((stops, routeId) => {
    const route = routeMap.get(routeId);
    if (!route || stops.length < 2) return; // Skip invalid or single-stop routes

    // Sort by sequence to ensure correct ordering
    stops.sort((a, b) => a.sequence - b.sequence);

    for (let i = 0; i < stops.length - 1; i++) {
      const stopA = stops[i];
      const stopB = stops[i + 1];
      
      // Calculate fare for this segment (incremental)
      const fare = Math.max(0, stopB.fare_from_start - stopA.fare_from_start);

      // Add forward edge
      addEdge(stopA.station_id, stopB.station_id, routeId, fare);

      // Add reverse edge if the route is bidirectional
      if (route.bidirectional) {
        addEdge(stopB.station_id, stopA.station_id, routeId, fare);
      }
    }
  });

  return { graph, transferIndex };
}
