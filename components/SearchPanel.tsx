"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { Station, RouteOption, SearchResponse } from "@/lib/types";
import AutocompleteDropdown from "./AutocompleteDropdown";
import LocationButton from "./LocationButton";

interface SearchPanelProps {
  onSearch: (
    options: RouteOption[],
    fromStation: Station | null,
    toStation: Station | null,
    parseMethod: SearchResponse["parseMethod"]
  ) => void;
  onLocationFound: (lat: number, lng: number) => void;
  isSearching: boolean;
  onError: (message: string) => void;
}

export default function SearchPanel({
  onSearch,
  onLocationFound,
  isSearching,
  onError,
}: SearchPanelProps) {
  const [searchMode, setSearchMode] = useState<"structured" | "natural">("structured");
  
  // Structured Search State
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Natural Language Search State
  const [nlText, setNlText] = useState("");

  // Smooth scroll input into view on focus (helps on mobile)
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearching) return;

    let payload: any = {};

    if (searchMode === "structured") {
      if (!fromValue || !toValue) {
        onError("Please fill in both starting point and destination.");
        return;
      }
      payload = {
        fromId: fromStation?.id,
        toId: toStation?.id,
        fromName: fromStation ? undefined : (fromValue === "Current Location" ? undefined : fromValue),
        toName: toStation ? undefined : toValue,
        fromLat: fromCoords?.lat,
        fromLng: fromCoords?.lng,
      };
    } else {
      if (!nlText.trim()) {
        onError("Please type a question or destination description.");
        return;
      }
      payload = { text: nlText };
    }

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to process routing search.");
      }

      const data: SearchResponse = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      onSearch(data.options, data.fromStation, data.toStation, data.parseMethod);
    } catch (err: any) {
      onError(err.message || "An unexpected search error occurred.");
    }
  };

  const handleGPSLocationFound = (lat: number, lng: number) => {
    setFromStation(null);
    setFromCoords({ lat, lng });
    setFromValue("Current Location");
    onLocationFound(lat, lng);
  };

  // If user clears the input text or types something else, clear GPS coords and station
  useEffect(() => {
    if (!fromValue) {
      setFromStation(null);
      setFromCoords(null);
    } else if (fromValue !== "Current Location") {
      setFromCoords(null);
    }
  }, [fromValue]);

  useEffect(() => {
    if (!toValue) setToStation(null);
  }, [toValue]);

  const isSearchDisabled =
    searchMode === "structured"
      ? !fromValue.trim() || !toValue.trim()
      : !nlText.trim();

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-40 p-4 safe-bottom sm:absolute sm:top-4 sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0"
    >
      <div className="glass-heavy rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/[0.08] relative">
        {/* Top visual glow bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>

        {/* Header Tabs Tray */}
        <div className="flex border-b border-white/[0.04] bg-slate-950/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setSearchMode("structured")}
            className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-widest text-center transition-all duration-300 rounded-xl cursor-pointer ${
              searchMode === "structured"
                ? "text-amber-400 bg-white/[0.05] shadow-[0_0_15px_rgba(251,191,36,0.08)] border border-white/5"
                : "text-slate-500 hover:text-white"
            }`}
          >
            Route Finder
          </button>
          <button
            type="button"
            onClick={() => setSearchMode("natural")}
            className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-widest text-center transition-all duration-300 rounded-xl cursor-pointer ${
              searchMode === "natural"
                ? "text-amber-400 bg-white/[0.05] shadow-[0_0_15px_rgba(251,191,36,0.08)] border border-white/5"
                : "text-slate-500 hover:text-white"
            }`}
          >
            AI Chat Search
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="p-5 space-y-5 bg-slate-950/30 backdrop-blur-3xl">
          {searchMode === "structured" ? (
            <div className="space-y-4 relative">
              {/* Visual connecting line between From/To inputs (Transit UI detail) */}
              <div className="absolute left-[21px] top-[34px] bottom-[34px] w-[2px] border-l-2 border-dashed border-slate-700/60 pointer-events-none z-10"></div>

              {/* Origin Station Input */}
              <div className="relative z-20">
                <AutocompleteDropdown
                  value={fromValue}
                  onChange={setFromValue}
                  onSelect={(station) => {
                    setFromStation(station);
                    setFromValue(station.name);
                  }}
                  placeholder="Starting Location"
                  ariaLabel="Starting station"
                  icon={
                    <svg
                      className="w-4 h-4 text-[#10b981] drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <circle cx={12} cy={12} r={3} />
                      <circle cx={12} cy={12} r={8} />
                    </svg>
                  }
                />
                <div className="absolute right-1.5 top-1.5 z-30">
                  <LocationButton
                    onLocationFound={handleGPSLocationFound}
                    onError={(msg) => onError(msg)}
                  />
                </div>
              </div>

              {/* Destination Station Input */}
              <div className="relative z-20">
                <AutocompleteDropdown
                  value={toValue}
                  onChange={setToValue}
                  onSelect={(station) => {
                    setToStation(station);
                    setToValue(station.name);
                  }}
                  placeholder="Where do you want to go?"
                  ariaLabel="Destination station"
                  icon={
                    <svg
                      className="w-4 h-4 text-[#f43f5e] drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <circle cx={12} cy={10} r={2} />
                    </svg>
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              {/* Natural Language Textarea */}
              <textarea
                value={nlText}
                onChange={(e) => setNlText(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Ask like: 'How do I get to KATH from Tech Junction?' or 'take me from KNUST Gate to Kejetia'"
                aria-label="Natural language search"
                rows={3}
                className="w-full bg-slate-950/60 border border-white/[0.06] hover:border-white/12 rounded-xl p-4 text-white placeholder-slate-500 font-sans text-xs focus:outline-none transition-all duration-200 resize-none shadow-inner"
              />
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {searchMode === "structured" ? (
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 select-none">
                Type 2+ characters
              </span>
            ) : (
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 select-none">
                English, Pidgin, or Twi
              </span>
            )}

            <button
              type="submit"
              disabled={isSearchDisabled || isSearching}
              className="btn-premium-glow bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 hover:shadow-[0_0_25px_rgba(251,191,36,0.3)] active:scale-[0.97] disabled:from-slate-900 disabled:to-slate-900 disabled:text-slate-600 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] cursor-pointer border border-amber-300/10"
            >
              {isSearching ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
                  Searching
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Find Route
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
