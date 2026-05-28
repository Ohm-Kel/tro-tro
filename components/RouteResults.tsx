"use client";

import { motion } from "motion/react";
import type { RouteOption } from "@/lib/types";
import RouteCard from "./RouteCard";

interface RouteResultsProps {
  options: RouteOption[] | null;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isLoading: boolean;
  error: string | null;
  parseMethod?: "exact" | "fuzzy" | "claude" | "direct";
}

export default function RouteResults({
  options,
  selectedIndex,
  onSelect,
  isLoading,
  error,
  parseMethod,
}: RouteResultsProps) {
  // 1. Initial State (No search yet)
  if (options === null && !isLoading && !error) {
    return null;
  }

  // 2. Loading State (Skeleton loading)
  if (isLoading) {
    return (
      <div className="fixed bottom-[180px] left-0 right-0 p-4 z-30 max-h-[40vh] overflow-y-auto space-y-3 pointer-events-none sm:absolute sm:top-[280px] sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-32 w-full opacity-60"></div>
      </div>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <div className="fixed bottom-[180px] left-0 right-0 p-4 z-30 sm:absolute sm:top-[280px] sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0">
        <div className="glass border-red-500/30 bg-red-500/5 rounded-2xl p-4 flex items-start gap-3 shadow-xl backdrop-blur-xl">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">Route Finder Error</h4>
            <p className="text-xs text-slate-400 mt-1 leading-normal">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. Empty State (No options found)
  if (options && options.length === 0) {
    return (
      <div className="fixed bottom-[180px] left-0 right-0 p-4 z-30 sm:absolute sm:top-[280px] sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0">
        <div className="glass rounded-2xl p-6 text-center shadow-xl backdrop-blur-xl border-white/[0.08]">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <circle cx={12} cy={10} r={2} />
            </svg>
          </div>
          <h4 className="font-semibold text-slate-100 text-sm">No Route Found</h4>
          <p className="text-xs text-slate-400 mt-1 leading-normal max-w-xs mx-auto">
            We couldn&apos;t find a tro-tro connection between these stations. They might not be directly connected.
          </p>
        </div>
      </div>
    );
  }

  // 5. Success State (Render results)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="fixed bottom-[180px] left-0 right-0 p-4 z-30 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pointer-events-auto sm:absolute sm:top-[280px] sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0">
      {parseMethod && parseMethod !== "direct" && (
        <div className="flex items-center gap-1.5 justify-end mb-2 pr-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
            {parseMethod === "exact" && "⚡ Instant match"}
            {parseMethod === "fuzzy" && "✨ Fuzzy match"}
            {parseMethod === "claude" && "🤖 AI Parsed"}
          </span>
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {options &&
          options.map((option, idx) => (
            <RouteCard
              key={`route-option-${idx}`}
              option={option}
              index={idx}
              isSelected={selectedIndex === idx}
              onSelect={() => onSelect(idx)}
              isBest={idx === 0} // Rank 1 is always the Best Route
            />
          ))}
      </motion.div>
    </div>
  );
}
