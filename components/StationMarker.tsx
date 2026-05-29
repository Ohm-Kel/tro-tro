"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface StationMarkerProps {
  position: [number, number];
  type: "board" | "alight" | "transfer" | "intermediate";
  label: string;
  routeName?: string;
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function StationMarker({
  position,
  type,
  label,
  routeName,
}: StationMarkerProps) {
  const escapedLabel = escapeHtml(label);
  const escapedRouteName = routeName ? escapeHtml(routeName) : "";

  let icon: L.DivIcon;

  if (type === "intermediate") {
    icon = L.divIcon({
      className: "custom-station-marker-intermediate",
      html: `
        <div style="display: flex; align-items: center; justify-content: center; width: 10px; height: 10px;">
          <div style="
            width: 8px;
            height: 8px;
            background-color: #030712;
            border-radius: 50%;
            border: 2px solid #64748b;
            box-shadow: 0 0 8px rgba(100, 116, 139, 0.3);
          "></div>
        </div>
      `,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      popupAnchor: [0, -6],
    });
  } else {
    // board: #10b981, alight: #f43f5e, transfer: #8b5cf6
    let color = "#64748b";
    if (type === "board") color = "#10b981";
    else if (type === "alight") color = "#f43f5e";
    else if (type === "transfer") color = "#8b5cf6";

    icon = L.divIcon({
      className: "custom-station-marker-pin",
      html: `
        <div class="marker-drop" style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          <!-- Pulsing Map Glow Base -->
          <div style="
            position: absolute;
            width: 12px;
            height: 12px;
            bottom: -3px;
            background-color: ${color};
            border-radius: 50%;
            opacity: 0.6;
            box-shadow: 0 0 12px 6px ${color};
            z-index: 1;
          "></div>
          
          <!-- Obsidian Chrome Marker Teardrop -->
          <div style="
            width: 26px;
            height: 26px;
            background: linear-gradient(135deg, ${color} 0%, #030712 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            position: relative;
            box-shadow: 0 6px 12px rgba(0,0,0,0.5), 0 0 8px ${color}30;
            border: 2px solid ${color};
            z-index: 10;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: #ffffff;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
              box-shadow: 0 0 4px #ffffff;
            "></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -34],
    });
  }

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="text-slate-100 font-sans p-1">
          <p className="font-semibold text-sm m-0 leading-tight">
            {type === "board" && "🟢 Board: "}
            {type === "alight" && "🔴 Alight: "}
            {type === "transfer" && "🟣 Transfer: "}
            {label}
          </p>
          {type === "transfer" && routeName && (
            <p className="text-xs text-slate-400 mt-1 mb-0 font-medium">
              Switch to <span className="text-amber-400 font-semibold">{routeName}</span>
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
