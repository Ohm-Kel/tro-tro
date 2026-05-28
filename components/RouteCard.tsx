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
      className={`glass cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left focus-visible:ring-2 focus-visible:ring-amber-500 select-none ${
        isSelected
          ? "border-amber-500/60 bg-white/[0.10] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08]"
      }`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="font-semibold text-slate-100 text-sm md:text-base truncate">
          {routeSummary}
        </h3>
        {isBest && (
          <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
            Best Route
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-xs md:text-sm text-slate-400 mb-4 border-b border-white/5 pb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-amber-400 font-semibold text-base font-mono-fare">
            ₵{totalFare.toFixed(2)}
          </span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
        <div>{totalStops} stops</div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
        <div>~{estimatedMinutes} mins</div>
      </div>

      {/* Segment Breakdown */}
      <div className="space-y-3 pl-1 mb-3">
        {segments.map((segment, segIdx) => {
          const isFirstSegment = segIdx === 0;
          const isLastSegment = segIdx === segments.length - 1;
          const stopCount = segment.stops.length - 1;

          return (
            <div key={`seg-${segIdx}`} className="relative pl-6">
              {/* Step indicator line */}
              <div
                className="absolute left-[7px] top-[18px] bottom-[-16px] w-[2px] border-l-2 border-dashed border-slate-600"
                style={{
                  display: isLastSegment ? "none" : "block",
                }}
              ></div>

              {/* Board Point */}
              <div className="relative mb-2">
                <span
                  className={`absolute left-[-24px] top-1 w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 border-slate-900 ${
                    isFirstSegment ? "bg-green-500" : "bg-amber-500"
                  }`}
                ></span>
                <p className="text-xs font-semibold text-slate-200">
                  {isFirstSegment ? "Board at" : "Transfer at"}{" "}
                  <span className="text-white text-sm">
                    {segment.boardAt.stationName}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Take <span className="text-amber-400 font-medium">{segment.routeName}</span>
                </p>
              </div>

              {/* Ride segment stop count */}
              <div className="relative my-2 pl-1">
                <p className="text-xs text-slate-400 flex items-center gap-1.5 py-1">
                  <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                  Ride {stopCount} stop{stopCount > 1 ? "s" : ""}
                  {segment.vehicleNote && (
                    <span className="text-slate-500 italic">
                      ({segment.vehicleNote})
                    </span>
                  )}
                </p>
              </div>

              {/* Alight point for direct or last segment */}
              {isLastSegment && (
                <div className="relative mt-2">
                  <span className="absolute left-[-24px] top-1 w-[16px] h-[16px] rounded-full bg-red-500 flex items-center justify-center border-2 border-slate-900"></span>
                  <p className="text-xs font-semibold text-slate-200">
                    Alight at{" "}
                    <span className="text-white text-sm">
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
        <div className="mt-2 text-xs text-slate-500 text-right font-mono-fare">
          Fare breakdown:{" "}
          {segments.map((s, i) => `₵${s.fare.toFixed(2)}`).join(" + ")}
        </div>
      )}
    </motion.div>
  );
}
