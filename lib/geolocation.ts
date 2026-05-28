"use client";

import { useState, useCallback } from "react";
import type { GeoLocationResult, GeoErrorCode } from "./types";

export class GeoLocationError extends Error {
  code: GeoErrorCode;

  constructor(code: GeoErrorCode, message: string) {
    super(message);
    this.name = "GeoLocationError";
    this.code = code;
  }
}

/**
 * Request current GPS position from the browser.
 * Returns a promise that resolves with lat/lng or rejects with a typed error.
 */
export function getCurrentPosition(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  }
): Promise<GeoLocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new GeoLocationError(
          "NOT_SUPPORTED",
          "Geolocation is not supported by this browser."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            reject(
              new GeoLocationError(
                "PERMISSION_DENIED",
                "Location permission was denied. Please enable location access."
              )
            );
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            reject(
              new GeoLocationError(
                "POSITION_UNAVAILABLE",
                "Location information is unavailable."
              )
            );
            break;
          case GeolocationPositionError.TIMEOUT:
            reject(
              new GeoLocationError(
                "TIMEOUT",
                "Location request timed out. Please try again."
              )
            );
            break;
          default:
            reject(
              new GeoLocationError(
                "POSITION_UNAVAILABLE",
                "An unknown geolocation error occurred."
              )
            );
        }
      },
      options
    );
  });
}

/**
 * React hook for geolocation.
 * Returns location state and a function to request the user's position.
 */
export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocationResult | null>(null);
  const [error, setError] = useState<GeoLocationError | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCurrentPosition();
      setLocation(result);
      return result;
    } catch (err) {
      const geoError =
        err instanceof GeoLocationError
          ? err
          : new GeoLocationError("POSITION_UNAVAILABLE", "Unknown error");
      setError(geoError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, error, loading, requestLocation };
}
