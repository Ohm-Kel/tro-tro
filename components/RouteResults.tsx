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

  // 2. Loading State (High-fidelity skeleton cards matching RouteCard shapes)
  if (isLoading) {
    return (
      <div className="fixed bottom-[180px] left-0 right-0 p-4 z-30 max-h-[40vh] overflow-y-auto space-y-3 pointer-events-none sm:absolute sm:top-[280px] sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0">
        {/* Skeleton Card 1 */}
        <div className="glass rounded-2xl p-4 space-y-4 border border-white/5 opacity-80 relative overflow-hidden">
          {/* Top shine animation grid line */}
          <div className="skeleton h-4.5 w-2/3 rounded-lg"></div>
          
          <div className="flex gap-2 pb-2 border-b border-white/5">
            <div className="skeleton h-5.5 w-16 rounded-md"></div>
            <div className="skeleton h-5.5 w-20 rounded-md"></div>
            <div className="skeleton h-5.5 w-24 rounded-md"></div>
          </div>
          
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="skeleton h-4 w-4 rounded-full shrink-0"></div>
              <div className="skeleton h-4 w-1/2 rounded-md"></div>
            </div>
            <div className="pl-7">
              <div className="skeleton h-7 w-5/6 rounded-lg"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="skeleton h-4 w-4 rounded-full shrink-0"></div>
              <div className="skeleton h-4 w-2/5 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Card 2 */}
        <div className="glass rounded-2xl p-4 space-y-3 border border-white/5 opacity-40 relative overflow-hidden">
          <div className="skeleton h-4.5 w-1/2 rounded-lg"></div>
          <div className="flex gap-2">
            <div className="skeleton h-5.5 w-14 rounded-md"></div>
            <div className="skeleton h-5.5 w-16 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Error State (Premium Error boundary widget)
  if (error) {
    return (
      <div className="fixed bottom-[180px] left-0 right-0 p-4 z-30 sm:absolute sm:top-[280px] sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0">
        <div className="glass border-red-500/25 bg-red-950/20 rounded-2xl p-5 flex items-start gap-4 shadow-[0_15px_35px_rgba(244,63,94,0.15)] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-red-500"></div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Route Search Failed</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. Empty State (No options found panel)
  if (options && options.length === 0) {
    return (
      <div className="fixed bottom-[180px] left-0 right-0 p-4 z-30 sm:absolute sm:top-[280px] sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0">
        <div className="glass rounded-2xl p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl border-white/[0.08]">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
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
          <h4 className="font-bold text-white text-sm">No Transit Route Found</h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-[280px] mx-auto">
            We couldn&apos;t establish a tro-tro connection between these terminals. Check for spelling or request another location.
          </p>
        </div>
      </div>
    );
  }

  // 5. Success State (Render results list)
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
          {parseMethod === "exact" && (
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.05)]">
              ⚡ Instant match
            </span>
          )}
          {parseMethod === "fuzzy" && (
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(251,191,36,0.05)]">
              ✨ Fuzzy match
            </span>
          )}
          {parseMethod === "claude" && (
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(139,92,246,0.05)]">
              🤖 AI Parsed
            </span>
          )}
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
              isBest={idx === 0}
            />
          ))}
      </motion.div>
    </div>
  );
}
