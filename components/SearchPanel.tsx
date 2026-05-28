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
        fromName: fromStation ? undefined : fromValue,
        toName: toStation ? undefined : toValue,
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

  const handleGPSLocationFound = (station: Station, distanceMeters: number) => {
    setFromStation(station);
    setFromValue(station.name);
    onLocationFound(station.lat, station.lng);
  };

  // If user clears the input text, clear the selected station object
  useEffect(() => {
    if (!fromValue) setFromStation(null);
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
      <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08]">
        {/* Header Tabs */}
        <div className="flex border-b border-white/5 bg-slate-900/40">
          <button
            type="button"
            onClick={() => setSearchMode("structured")}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-all ${
              searchMode === "structured"
                ? "text-amber-500 border-b-2 border-amber-500 bg-white/[0.02]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Route Finder
          </button>
          <button
            type="button"
            onClick={() => setSearchMode("natural")}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-all ${
              searchMode === "natural"
                ? "text-amber-500 border-b-2 border-amber-500 bg-white/[0.02]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            AI Chat Search
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="p-4 space-y-4 bg-slate-900/70 backdrop-blur-2xl">
          {searchMode === "structured" ? (
            <div className="space-y-3">
              {/* Origin Station Input */}
              <div className="relative">
                <AutocompleteDropdown
                  value={fromValue}
                  onChange={setFromValue}
                  onSelect={(station) => {
                    setFromStation(station);
                    setFromValue(station.name);
                  }}
                  placeholder="Where are you starting from?"
                  ariaLabel="Starting station"
                  icon={
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <circle cx={12} cy={12} r={3} />
                      <circle cx={12} cy={12} r={9} />
                    </svg>
                  }
                />
                <div className="absolute right-1 top-1.5 z-20">
                  <LocationButton
                    onLocationFound={handleGPSLocationFound}
                    onError={(msg) => onError(msg)}
                  />
                </div>
              </div>

              {/* Destination Station Input */}
              <div>
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
                      className="w-4 h-4 text-red-500"
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
                className="w-full bg-slate-900/60 border border-white/10 hover:border-white/20 focus:border-amber-500 rounded-xl p-3 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all duration-200 resize-none"
              />
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {searchMode === "structured" ? (
              <span className="text-xs text-slate-400">
                Type 2+ chars for stations
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Type Pidgin, Twi or English
              </span>
            )}

            <button
              type="submit"
              disabled={isSearchDisabled || isSearching}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:scale-100 disabled:cursor-not-allowed text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 min-h-[44px]"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
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
