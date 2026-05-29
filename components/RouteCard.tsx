"use client";

import { motion } from "motion/react";
import type { RouteOption } from "@/lib/types";

interface RouteCardProps {
  option: RouteOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  isBest: boolean;
}

export default function RouteCard({
  option,
  index,
  isSelected,
  onSelect,
  isBest,
}: RouteCardProps) {
  const { segments, totalFare, totalStops, estimatedMinutes } = option;

  // Build a summary name for the route, e.g. "Direct Tech–Adum" or "Via Tech Junction"
  const routeSummary =
    segments.length === 1
      ? `${segments[0].routeName} (Direct)`
      : `Transfer at ${option.transferStation?.stationName || "intermediate station"}`;

  // Card motion variants for staggered entrance
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      onClick={onSelect}
      className={`glass cursor-pointer rounded-2xl p-4 transition-all duration-300 border text-left focus-visible:ring-2 focus-visible:ring-amber-500 select-none relative ${
        isSelected
          ? "border-amber-500/80 bg-slate-900/60 shadow-[0_0_30px_rgba(251,191,36,0.12)]"
          : "border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]"
      }`}
    >
      {/* Selection border indicator */}
      {isSelected && (
        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-amber-500 rounded-l-2xl"></div>
      )}

      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-slate-100 text-sm md:text-base leading-tight truncate">
            {routeSummary}
          </h3>
          
          {/* Visual Chips for Route properties */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {segments.length === 1 ? (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md">
                ⚡ Direct Route
              </span>
            ) : (
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md">
                🔄 {segments.length - 1} Transfer{segments.length > 2 ? "s" : ""}
              </span>
            )}
            
            {isBest && (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md">
                ₵ Best Fare
              </span>
            )}
          </div>
        </div>

        {isBest && (
          <span className="bg-amber-500 text-slate-950 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-widest select-none shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
            RANK 1
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 border-b border-white/5 pb-2.5">
        <div className="flex items-baseline gap-1">
          <span className="text-amber-400 font-bold text-lg font-mono-fare">
            ₵{totalFare.toFixed(2)}
          </span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
        <div className="font-semibold text-slate-300">{totalStops} stops</div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
        <div className="font-semibold text-slate-300">~{estimatedMinutes} mins</div>
      </div>

      {/* Segment Breakdown */}
      <div className="space-y-4 pl-1 mb-2">
        {segments.map((segment, segIdx) => {
          const isFirstSegment = segIdx === 0;
          const isLastSegment = segIdx === segments.length - 1;
          const stopCount = segment.stops.length - 1;

          return (
            <div key={`seg-${segIdx}`} className="relative pl-6">
              {/* Step indicator line - Color coded to match the route! */}
              <div
                className="absolute left-[7px] top-[18px] bottom-[-22px] w-[2px]"
                style={{
                  display: isLastSegment ? "none" : "block",
                  backgroundColor: segment.routeColor,
                }}
              ></div>

              {/* Board Point */}
              <div className="relative mb-2">
                <span
                  className="absolute left-[-24px] top-1 w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 bg-slate-950"
                  style={{
                    borderColor: isFirstSegment ? "#10b981" : "#8b5cf6",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: isFirstSegment ? "#10b981" : "#8b5cf6",
                    }}
                  ></span>
                </span>
                <p className="text-xs font-bold text-slate-400">
                  {isFirstSegment ? "Board at" : "Transfer at"}{" "}
                  <span className="text-white text-sm font-bold">
                    {segment.boardAt.stationName}
                  </span>
                </p>
                
                {/* Visual Route indicator tag */}
                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/8 px-2 py-0.5 rounded-md mt-1">
                  <span
                    className="w-2.5 h-1.5 rounded-full"
                    style={{ backgroundColor: segment.routeColor }}
                  ></span>
                  <span className="text-[10px] text-slate-300 font-semibold">
                    {segment.routeName}
                  </span>
                </div>
              </div>

              {/* Ride segment stop count details box */}
              <div className="relative my-2 pl-1.5 py-1.5 pr-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs shrink-0">🚐</span>
                  Ride <span className="text-slate-200 font-bold font-mono">{stopCount} stops</span>
                  {segment.vehicleNote && (
                    <span className="text-slate-500 text-[10px] italic">
                      — {segment.vehicleNote}
                    </span>
                  )}
                </p>
              </div>

              {/* Alight point for direct or last segment */}
              {isLastSegment && (
                <div className="relative mt-2">
                  <span className="absolute left-[-24px] top-1 w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 border-[#f43f5e] bg-slate-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
                  </span>
                  <p className="text-xs font-bold text-slate-400">
                    Alight at{" "}
                    <span className="text-white text-sm font-bold">
                      {segment.alightAt.stationName}
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fare Breakdown / Details Footer */}
      {segments.length > 1 && (
        <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-slate-500 text-right font-mono-fare">
          Fare breakdown:{" "}
          <span className="text-slate-400">
            {segments.map((s, i) => `₵${s.fare.toFixed(2)}`).join(" + ")}
          </span>
        </div>
      )}
    </motion.div>
  );
}
