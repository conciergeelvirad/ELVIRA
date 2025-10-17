/**
 * Utility functions for Google Places API
 */

import { GOOGLE_PLACES_CONFIG } from "../config";
import { APIError } from "../../shared/errors";
import { withRetry } from "../../shared/api-utils";

let scriptLoadPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  // Return existing promise if script is already loading
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = withRetry(
    () =>
      new Promise<void>((resolve, reject) => {
        // Check if already loaded
        if (window.google?.maps?.places) {
          resolve();
          return;
        }

        // Check if script is already in the DOM
        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]'
        );
        if (existingScript) {
          existingScript.addEventListener("load", () => resolve());
          existingScript.addEventListener("error", () => {
            reject(APIError.networkError("Failed to load Google Maps script"));
          });
          return;
        }

        // Create and load the script
        const script = document.createElement("script");
        const params = new URLSearchParams({
          key: apiKey,
          libraries: GOOGLE_PLACES_CONFIG.libraries.join(","),
        });

        script.src = `${GOOGLE_PLACES_CONFIG.scriptUrl}?${params}`;
        script.async = true;
        script.defer = true;

        script.addEventListener("load", () => resolve());
        script.addEventListener("error", () => {
          reject(APIError.networkError("Failed to load Google Maps script"));
        });

        document.head.appendChild(script);
      }),
    {
      maxAttempts: GOOGLE_PLACES_CONFIG.retry.maxAttempts,
      initialDelay: GOOGLE_PLACES_CONFIG.retry.initialDelay,
      maxDelay: GOOGLE_PLACES_CONFIG.retry.maxDelay,
      shouldRetry: (error) =>
        error instanceof APIError && error.code === "NETWORK_ERROR",
    }
  ).catch((error) => {
    // Clear the promise on failure so future attempts can retry
    scriptLoadPromise = null;
    throw error;
  });

  return scriptLoadPromise;
};

/**
 * Converts PostGIS geography (WKB hex format) to a lat/lng coordinate
 */
export const parseGeographyToLatLng = (hexString: string): number => {
  // Remove any whitespace and '0x' prefix
  const hex = hexString.replace(/\s/g, "").replace(/^0x/, "");

  // Convert hex to bytes
  const bytes = new Uint8Array(
    hex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Create a DataView to read as double
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  // Copy bytes (little-endian)
  bytes.forEach((byte, i) => {
    view.setUint8(i, byte);
  });

  // Read as double (little-endian)
  return view.getFloat64(0, true);
};
