import { getGraph, getStations, getRoutes, getStationMap } from "./cache";
import type { RouteOption, RouteSegment, BFSState, StationPoint, Station } from "./types";

/**
 * Finds optimal routes between two stations using a depth-capped BFS.
 * Supports up to 1 transfer (2 routes total).
 */
export async function findRoutes(
  fromId: string,
  toId: string,
  maxResults = 3
): Promise<RouteOption[]> {
  // 1. Validation checks
  if (fromId === toId) {
    return [];
  }

  const graph = await getGraph();
  const stationMap = await getStationMap();
  const routes = await getRoutes();
  
  const routeMap = new Map(routes.map((r) => [r.id, r]));

  if (!graph.has(fromId) || !graph.has(toId)) {
    return [];
  }

  // 2. BFS Queues and Visited Tracker
  // Visited format: "stationId:routeId:transfers" -> best fare
  const visited = new Map<string, number>();
  const queue: BFSState[] = [];
  const candidates: BFSState[] = [];

  // Seed BFS queue with starting board options for all routes serving origin
  const originEdges = graph.get(fromId) || [];
  const originRoutes = new Set(originEdges.map((e) => e.routeId));

  originRoutes.forEach((routeId) => {
    const key = `${fromId}:${routeId}:0`;
    visited.set(key, 0);
    queue.push({
      stationId: fromId,
      routeId: routeId,
      transfers: 0,
      path: [{ stationId: fromId, routeId: routeId, action: "board" }],
      totalFare: 0,
      totalStops: 0,
    });
  });

  // 3. BFS Loop
  while (queue.length > 0) {
    const curr = queue.shift()!;

    // Reached destination!
    if (curr.stationId === toId) {
      candidates.push(curr);
      continue;
    }

    // Depth cap to prevent runaway routing on dense networks
    if (curr.totalStops >= 30) {
      continue;
    }

    // --- OPTION 1: Continue riding on the current route ---
    const edges = graph.get(curr.stationId) || [];
    const sameRouteEdges = edges.filter((e) => e.routeId === curr.routeId);

    sameRouteEdges.forEach((edge) => {
      const nextFare = curr.totalFare + edge.fare;
      const nextStops = curr.totalStops + 1;
      const visitedKey = `${edge.toStationId}:${curr.routeId}:${curr.transfers}`;

      const prevBestFare = visited.get(visitedKey);
      if (prevBestFare === undefined || nextFare < prevBestFare) {
        visited.set(visitedKey, nextFare);
        queue.push({
          stationId: edge.toStationId,
          routeId: curr.routeId,
          transfers: curr.transfers,
          path: [
            ...curr.path,
            { stationId: edge.toStationId, routeId: curr.routeId, action: "ride" },
          ],
          totalFare: nextFare,
          totalStops: nextStops,
        });
      }
    });

    // --- OPTION 2: Transfer to a different route at the current station ---
    // Limit to 1 transfer max to match typical transit usability constraints
    if (curr.transfers === 0) {
      // Find all routes serving this transfer station
      const transferRoutes = new Set(edges.map((e) => e.routeId));
      
      transferRoutes.forEach((newRouteId) => {
        if (newRouteId === curr.routeId) return; // Skip current route

        const visitedKey = `${curr.stationId}:${newRouteId}:1`;
        const prevBestFare = visited.get(visitedKey);
        
        // Transfer does not add stops or fare immediately (0 cost transition)
        if (prevBestFare === undefined || curr.totalFare < prevBestFare) {
          visited.set(visitedKey, curr.totalFare);
          queue.push({
            stationId: curr.stationId,
            routeId: newRouteId,
            transfers: 1,
            path: [
              ...curr.path,
              { stationId: curr.stationId, routeId: newRouteId, action: "transfer" },
            ],
            totalFare: curr.totalFare,
            totalStops: curr.totalStops,
          });
        }
      });
    }
  }

  // 4. Ranking Candidates: Fewest transfers -> Lowest fare -> Fewest stops
  candidates.sort((a, b) => {
    if (a.transfers !== b.transfers) {
      return a.transfers - b.transfers;
    }
    if (a.totalFare !== b.totalFare) {
      return a.totalFare - b.totalFare;
    }
    return a.totalStops - b.totalStops;
  });

  // Limit candidate options
  const topCandidates = candidates.slice(0, maxResults);

  // 5. Post-Process Paths into Segmented RouteOptions
  return topCandidates.map((c) => {
    const segments: RouteSegment[] = [];
    let currentSegment: Partial<RouteSegment> | null = null;
    let currentStops: StationPoint[] = [];

    for (let idx = 0; idx < c.path.length; idx++) {
      const node = c.path[idx];
      const station = stationMap.get(node.stationId)!;
      const route = routeMap.get(node.routeId)!;

      const stationPt: StationPoint = {
        stationId: station.id,
        stationName: station.name,
        lat: station.lat,
        lng: station.lng,
      };

      if (node.action === "board") {
        currentSegment = {
          routeId: route.id,
          routeName: route.name,
          routeColor: route.color,
          vehicleNote: route.vehicle_note || "",
          boardAt: stationPt,
          fare: 0,
        };
        currentStops = [stationPt];
      } else if (node.action === "ride") {
        currentStops.push(stationPt);
        
        // Deduce edge fare from previous station to this station on this route
        const prevNode = c.path[idx - 1];
        const prevEdges = graph.get(prevNode.stationId) || [];
        const matchingEdge = prevEdges.find(
          (e) => e.toStationId === node.stationId && e.routeId === node.routeId
        );
        
        if (matchingEdge && currentSegment) {
          currentSegment.fare = (currentSegment.fare || 0) + matchingEdge.fare;
        }
      } else if (node.action === "transfer") {
        // Finalize previous segment
        if (currentSegment) {
          currentSegment.alightAt = currentStops[currentStops.length - 1];
          currentSegment.stops = currentStops;
          segments.push(currentSegment as RouteSegment);
        }
        
        // Start next segment after transfer
        currentSegment = {
          routeId: route.id,
          routeName: route.name,
          routeColor: route.color,
          vehicleNote: route.vehicle_note || "",
          boardAt: stationPt,
          fare: 0,
        };
        currentStops = [stationPt];
      }
    }

    // Finalize the last segment of the path
    if (currentSegment) {
      currentSegment.alightAt = currentStops[currentStops.length - 1];
      currentSegment.stops = currentStops;
      segments.push(currentSegment as RouteSegment);
    }

    // Heuristic: ~4 minutes per stop, plus 5 minutes transfer penalty
    const estimatedMinutes = c.totalStops * 4 + c.transfers * 5;

    return {
      segments,
      totalFare: c.totalFare,
      totalStops: c.totalStops,
      transferCount: c.transfers,
      transferStation: segments.length > 1 ? segments[0].alightAt : undefined,
      estimatedMinutes,
    };
  });
}
