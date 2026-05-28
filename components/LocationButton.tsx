"use client";

import { useState } from "react";
import { getCurrentPosition } from "@/lib/geolocation";
import type { Station } from "@/lib/types";

interface LocationButtonProps {
  onLocationFound: (station: Station, distanceMeters: number) => void;
  onError: (message: string) => void;
}

type ButtonState = "idle" | "loading" | "error";

export default function LocationButton({
  onLocationFound,
  onError,
}: LocationButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleGetLocation = async () => {
    setState("loading");
    setErrorMessage("");

    try {
      // 1. Get browser GPS coordinates
      const coords = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });

      // 2. Fetch nearest station from our API
      const res = await fetch(
        `/api/nearest?lat=${coords.latitude}&lng=${coords.longitude}`
      );
      
      if (!res.ok) {
        throw new Error("Failed to find nearest station");
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.station) {
        onLocationFound(data.station, data.distanceMeters);
        setState("idle");
      } else {
        throw new Error("No stations found nearby.");
      }
    } catch (err: any) {
      const msg = err.message || "Could not retrieve location.";
      setErrorMessage(msg);
      setState("error");
      onError(msg);

      // Reset to idle after 4 seconds
      setTimeout(() => {
        setState("idle");
        setErrorMessage("");
      }, 4000);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={state === "loading"}
        className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Use my current location"
        title={errorMessage || "Use my current location"}
      >
        {state === "idle" && (
          <svg
            className="w-5 h-5 text-slate-400 hover:text-amber-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx={12} cy={12} r={4} />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M2 12h2M20 12h2" />
          </svg>
        )}

        {state === "loading" && (
          <svg
            className="w-5 h-5 text-amber-500 spinner"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 3v5h-5"
            />
          </svg>
        )}

        {state === "error" && (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx={12} cy={12} r={4} />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M2 12h2M20 12h2M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Tooltip for error state */}
      {state === "error" && errorMessage && (
        <div className="absolute bottom-12 right-0 bg-slate-900 border border-red-500/30 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl z-50 whitespace-nowrap backdrop-blur-md">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
