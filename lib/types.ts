// ============================================
// DATABASE MODELS
// ============================================

export interface Station {
  id: string;
  name: string;
  aliases: string[];
  lat: number;
  lng: number;
  city: string;
}

export interface Route {
  id: string;
  name: string;
  color: string;
  vehicle_note: string;
  bidirectional: boolean;
}

export interface RouteStop {
  route_id: string;
  station_id: string;
  sequence: number;
  fare_from_start: number;
}

// ============================================
// GRAPH STRUCTURES
// ============================================

export interface GraphEdge {
  toStationId: string;
  routeId: string;
  fare: number;
}

export type RouteGraph = Map<string, GraphEdge[]>;

/** stationId → Set of routeIds that serve this station */
export type TransferIndex = Map<string, Set<string>>;

// ============================================
// BFS STATE (internal to router)
// ============================================

export interface BFSState {
  stationId: string;
  routeId: string;
  transfers: number;
  path: PathNode[];
  totalFare: number;
  totalStops: number;
}

export interface PathNode {
  stationId: string;
  routeId: string;
  action: "board" | "ride" | "alight" | "transfer";
}

// ============================================
// STATION POINT (for display + map)
// ============================================

export interface StationPoint {
  stationId: string;
  stationName: string;
  lat: number;
  lng: number;
}

// ============================================
// ROUTE RESULT (what the user sees)
// ============================================

export interface RouteSegment {
  routeId: string;
  routeName: string;
  routeColor: string;
  vehicleNote: string;
  boardAt: StationPoint;
  alightAt: StationPoint;
  stops: StationPoint[];
  fare: number;
}

export interface RouteOption {
  segments: RouteSegment[];
  totalFare: number;
  totalStops: number;
  transferCount: number;
  transferStation?: StationPoint;
  estimatedMinutes: number;
}

// ============================================
// SEARCH API
// ============================================

export interface SearchRequest {
  /** Natural language text input, e.g. "How do I get from Tech to Adum?" */
  text?: string;
  /** Station ID for origin (if already resolved by client) */
  fromId?: string;
  /** Station ID for destination (if already resolved by client) */
  toId?: string;
  /** Station name for origin (resolved server-side) */
  fromName?: string;
  /** Station name for destination (resolved server-side) */
  toName?: string;
}

export interface SearchResponse {
  options: RouteOption[];
  fromStation: Station | null;
  toStation: Station | null;
  parseMethod: "exact" | "fuzzy" | "claude" | "direct";
  error?: string;
}

// ============================================
// NEAREST STATION API
// ============================================

export interface NearestStationResponse {
  station: Station | null;
  distanceMeters: number;
  warning?: string;
}

// ============================================
// GEOLOCATION (client-side)
// ============================================

export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export type GeoErrorCode =
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "NOT_SUPPORTED";
