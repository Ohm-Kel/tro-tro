"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Station, RouteOption, SearchResponse } from "@/lib/types";
import SearchPanel from "@/components/SearchPanel";
import RouteResults from "@/components/RouteResults";

// Dynamically import MapView with SSR disabled since Leaflet relies heavily on document/window
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="w-32 h-32 rounded-full bg-amber-500/5 animate-ping flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10"></div>
      </div>
    </div>
  ),
});

export default function Home() {
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  
  const [routeOptions, setRouteOptions] = useState<RouteOption[] | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [parseMethod, setParseMethod] = useState<SearchResponse["parseMethod"] | undefined>(undefined);

  const handleSearchSuccess = (
    options: RouteOption[],
    from: Station | null,
    to: Station | null,
    method: SearchResponse["parseMethod"]
  ) => {
    setRouteOptions(options);
    setFromStation(from);
    setToStation(to);
    setParseMethod(method);
    setSearchError(null);
    setIsSearching(false);
    
    // Auto-select the first (best) option if available
    if (options.length > 0) {
      setSelectedRouteIndex(0);
    } else {
      setSelectedRouteIndex(null);
    }
  };

  const handleGPSLocationFound = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
  };

  const handleSearchError = (msg: string) => {
    setSearchError(msg);
    setRouteOptions([]);
    setSelectedRouteIndex(null);
    setIsSearching(false);
  };

  const handleSearchStart = () => {
    setIsSearching(true);
    setSearchError(null);
    setRouteOptions(null);
    setSelectedRouteIndex(null);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Background/Leaflet Map */}
      <div className="absolute inset-0 z-0">
        <MapView
          routeOptions={routeOptions}
          selectedRouteIndex={selectedRouteIndex}
          userLocation={userLocation}
        />
      </div>

      {/* Floating Header Banner */}
      <div className="absolute top-4 left-4 z-40 pointer-events-auto">
        <div className="glass px-4 py-2.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-2.5">
          <span className="text-base select-none">🚐</span>
          <span className="font-extrabold text-xs tracking-wider text-white uppercase select-none">
            Kumasi Tro-Tro Route Finder
          </span>
        </div>
      </div>

      {/* Primary Search Inputs Overlay */}
      <SearchPanel
        onSearch={handleSearchSuccess}
        onLocationFound={handleGPSLocationFound}
        isSearching={isSearching}
        onError={handleSearchError}
      />

      {/* Route Results Overlay */}
      <RouteResults
        options={routeOptions}
        selectedIndex={selectedRouteIndex}
        onSelect={(idx) => setSelectedRouteIndex(idx)}
        isLoading={isSearching}
        error={searchError}
        parseMethod={parseMethod}
      />
    </main>
  );
}
