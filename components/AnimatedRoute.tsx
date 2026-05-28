"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface AnimatedRouteProps {
  positions: [number, number][];
  color?: string;
  weight?: number;
  speed?: number; // ms interval between points
  id: string;
}

export default function AnimatedRoute({
  positions,
  color = "#f59e0b",
  weight = 5,
  speed = 50,
  id,
}: AnimatedRouteProps) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Create shadow polyline
    const shadowPolyline = L.polyline(positions, {
      color: "#000000",
      weight: weight + 3,
      opacity: 0.15,
      interactive: false,
    }).addTo(map);

    let activePolyline: L.Polyline;

    if (prefersReducedMotion) {
      // Draw all at once
      activePolyline = L.polyline(positions, {
        color,
        weight,
        opacity: 0.85,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);
    } else {
      // Animated snake drawing
      const currentPositions: L.LatLngExpression[] = [positions[0]];
      activePolyline = L.polyline(currentPositions, {
        color,
        weight,
        opacity: 0.85,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      let index = 1;
      const intervalId = setInterval(() => {
        if (index >= positions.length) {
          clearInterval(intervalId);
          return;
        }

        currentPositions.push(positions[index]);
        activePolyline.setLatLngs(currentPositions);
        index++;
      }, speed);

      return () => {
        clearInterval(intervalId);
        shadowPolyline.remove();
        activePolyline.remove();
      };
    }

    return () => {
      shadowPolyline.remove();
      activePolyline.remove();
    };
  }, [map, positions, color, weight, speed, id]);

  return null;
}
