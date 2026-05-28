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
        <div style="display: flex; align-items: center; justify-content: center; width: 8px; height: 8px;">
          <div style="
            width: 8px;
            height: 8px;
            background-color: #6b7280;
            border-radius: 50%;
            border: 1.5px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          "></div>
        </div>
      `,
      iconSize: [8, 8],
      iconAnchor: [4, 4],
      popupAnchor: [0, -6],
    });
  } else {
    // board: #16a34a, alight: #dc2626, transfer: #d97706
    let color = "#6b7280";
    if (type === "board") color = "#16a34a";
    else if (type === "alight") color = "#dc2626";
    else if (type === "transfer") color = "#d97706";

    icon = L.divIcon({
      className: "custom-station-marker-pin",
      html: `
        <div class="marker-drop" style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">
          <div style="
            width: 24px;
            height: 24px;
            background-color: ${color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            position: relative;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "></div>
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -32],
    });
  }

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="text-slate-900 font-sans p-1">
          <p className="font-semibold text-sm m-0 leading-tight">
            {type === "board" && "🟢 Board: "}
            {type === "alight" && "🔴 Alight: "}
            {type === "transfer" && "🟡 Transfer: "}
            {label}
          </p>
          {type === "transfer" && routeName && (
            <p className="text-xs text-slate-500 mt-1 mb-0">
              Switch to <span className="font-medium">{routeName}</span>
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
