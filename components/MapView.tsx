"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import type { RouteOption } from "@/lib/types";
import MapController from "./MapController";
import AnimatedRoute from "./AnimatedRoute";
import StationMarker from "./StationMarker";

interface MapViewProps {
  routeOptions: RouteOption[] | null;
  selectedRouteIndex: number | null;
  userLocation: { lat: number; lng: number } | null;
}

export default function MapView({
  routeOptions,
  selectedRouteIndex,
  userLocation,
}: MapViewProps) {
  const activeRoute =
    routeOptions && selectedRouteIndex !== null
      ? routeOptions[selectedRouteIndex]
      : null;

  // Compute bounds for the active route to fit them on the map
  let bounds: L.LatLngBoundsExpression | null = null;
  if (activeRoute) {
    const points: [number, number][] = [];
    activeRoute.segments.forEach((segment) => {
      segment.stops.forEach((stop) => {
        points.push([stop.lat, stop.lng]);
      });
    });
    if (points.length > 0) {
      bounds = L.latLngBounds(points);
    }
  }

  // Custom User Location Icon
  const userIcon = typeof window !== "undefined"
    ? L.divIcon({
        className: "user-location-pulse",
        html: `<div class="location-dot"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
    : null;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={[6.6885, -1.6244]} // Center on Kumasi
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* CartoDB Positron - Sleek Dark/Light Modern Maps */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* User Location Pulsing Dot */}
        {userLocation && userIcon && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="font-sans text-xs p-1 text-slate-900">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected Route Render */}
        {activeRoute &&
          activeRoute.segments.map((segment, segmentIdx) => {
            const positions = segment.stops.map((s) => [s.lat, s.lng] as [number, number]);
            
            return (
              <AnimatedRoute
                key={`route-polyline-${segment.routeId}-${segmentIdx}`}
                id={`${segment.routeId}-${segmentIdx}`}
                positions={positions}
                color={segment.routeColor}
                weight={5}
                speed={50}
              />
            );
          })}

        {/* Selected Route Stations Render */}
        {activeRoute &&
          activeRoute.segments.flatMap((segment, segmentIdx) => {
            return segment.stops.map((stop, stopIdx) => {
              const isFirst = stopIdx === 0;
              const isLast = stopIdx === segment.stops.length - 1;
              const isLastSegment = segmentIdx === activeRoute.segments.length - 1;

              let type: "board" | "alight" | "transfer" | "intermediate";

              if (isFirst) {
                type = segmentIdx === 0 ? "board" : "transfer";
              } else if (isLast) {
                type = isLastSegment ? "alight" : "transfer";
              } else {
                type = "intermediate";
              }

              // Avoid duplicate transfer marker at the end of segment and start of next
              if (isLast && !isLastSegment) {
                return null;
              }

              return (
                <StationMarker
                  key={`station-marker-${stop.stationId}-${segmentIdx}-${stopIdx}`}
                  position={[stop.lat, stop.lng]}
                  type={type}
                  label={stop.stationName}
                  routeName={type === "transfer" ? segment.routeName : undefined}
                />
              );
            });
          })}

        {/* Map Controller for zoom/pan updates */}
        <MapController bounds={bounds} />
      </MapContainer>
    </div>
  );
}
