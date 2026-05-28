"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

interface MapControllerProps {
  bounds: LatLngBoundsExpression | null;
}

export default function MapController({ bounds }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 1.0,
      });
    }
  }, [bounds, map]);

  return null;
}
