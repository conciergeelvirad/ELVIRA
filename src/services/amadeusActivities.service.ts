/**
 * Amadeus Tours and Activities API Service
 *
 * Provides methods to search for tours and activities using the Amadeus API.
 * API credentials are stored securely in Supabase.
 *
 * @see https://developers.amadeus.com/self-service/category/destination-content/api-doc/tours-and-activities
 */

import { supabase } from "../lib/supabase";

// ============================================================================
// TYPES
// ============================================================================

export interface AmadeusActivity {
  id: string;
  type: string;
  name: string;
  shortDescription?: string;
  description?: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  pictures?: string[];
  bookingLink?: string;
  price?: {
    amount: string;
    currencyCode: string;
  };
  minimumDuration?: string;
}

export interface AmadeusSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers (default: 1)
}

export interface AmadeusApiCredentials {
  clientId: string;
  clientSecret: string;
}

export interface AmadeusAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const AMADEUS_AUTH_URL =
  "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_ACTIVITIES_URL =
  "https://test.api.amadeus.com/v1/shopping/activities";

const SECRET_KEY_NAME = "TEST.API.AMADEUS_API";

// Token cache to avoid repeated authentication
let cachedToken: {
  token: string;
  expiresAt: number;
} | null = null;

// ============================================================================
// API CREDENTIALS
// ============================================================================

/**
 * Retrieve Amadeus API credentials from Supabase secrets or environment variables
 */
async function getAmadeusCredentials(): Promise<AmadeusApiCredentials> {
  try {
    // First, try to get credentials from environment variables (for development)
    const envClientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
    const envClientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

    if (envClientId && envClientSecret) {
      return {
        clientId: envClientId,
        clientSecret: envClientSecret,
      };
    }

    // Fallback to Supabase secrets (for production)
    const { data, error } = await supabase
      .from("secrets")
      .select("secret_value")
      .eq("secret_key", SECRET_KEY_NAME)
      .single();

    if (error) {
      console.error("Error fetching Amadeus API credentials:", error);
      throw new Error(
        "Failed to retrieve Amadeus API credentials from Supabase"
      );
    }

    if (!data?.secret_value) {
      throw new Error(
        "Amadeus API credentials not found in database. Please add them to .env.local or Supabase secrets table."
      );
    }

    // Parse the JSON credentials
    const credentials = JSON.parse(data.secret_value) as AmadeusApiCredentials;

    if (!credentials.clientId || !credentials.clientSecret) {
      throw new Error("Invalid Amadeus API credentials format");
    }

    return credentials;
  } catch (error) {
    console.error("Failed to get Amadeus credentials:", error);
    throw error;
  }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Get access token from Amadeus API
 * Uses cached token if still valid
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const credentials = await getAmadeusCredentials();

    const response = await fetch(AMADEUS_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Amadeus authentication failed:", errorText);
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const tokenData = (await response.json()) as AmadeusAccessToken;

    // Cache the token (subtract 60 seconds for safety margin)
    cachedToken = {
      token: tokenData.access_token,
      expiresAt: Date.now() + (tokenData.expires_in - 60) * 1000,
    };

    return tokenData.access_token;
  } catch (error) {
    console.error("Failed to get Amadeus access token:", error);
    throw error;
  }
}

// ============================================================================
// API METHODS
// ============================================================================

/**
 * Search for tours and activities near a location
 *
 * @param params - Search parameters including latitude, longitude, and optional radius
 * @returns Array of activities found
 *
 * @example
 * const activities = await searchActivities({
 *   latitude: 40.416775,
 *   longitude: -3.703790,
 *   radius: 5
 * });
 */
export async function searchActivities(
  params: AmadeusSearchParams
): Promise<AmadeusActivity[]> {
  try {
    const accessToken = await getAccessToken();

    const searchParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius: (params.radius || 1).toString(),
    });

    const url = `${AMADEUS_ACTIVITIES_URL}?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Amadeus API request failed:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();

    // Map the response to our Activity interface
    const activities: AmadeusActivity[] = (result.data || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        shortDescription: item.shortDescription,
        description: item.description,
        geoCode: {
          latitude: item.geoCode?.latitude || params.latitude,
          longitude: item.geoCode?.longitude || params.longitude,
        },
        rating: item.rating,
        pictures: item.pictures || [],
        bookingLink: item.bookingLink,
        price: item.price
          ? {
              amount: item.price.amount,
              currencyCode: item.price.currencyCode,
            }
          : undefined,
        minimumDuration: item.minimumDuration,
      })
    );

    return activities;
  } catch (error) {
    console.error("Error searching activities:", error);
    throw error;
  }
}

/**
 * Get a specific activity by ID
 *
 * @param activityId - The ID of the activity to retrieve
 * @returns The activity details
 *
 * @example
 * const activity = await getActivityById("ACTIVITY_ID");
 */
export async function getActivityById(
  activityId: string
): Promise<AmadeusActivity | null> {
  try {
    const accessToken = await getAccessToken();

    const url = `${AMADEUS_ACTIVITIES_URL}/${activityId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      console.error("Amadeus API request failed:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    const item = result.data;

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      type: item.type,
      name: item.name,
      shortDescription: item.shortDescription,
      description: item.description,
      geoCode: {
        latitude: item.geoCode?.latitude,
        longitude: item.geoCode?.longitude,
      },
      rating: item.rating,
      pictures: item.pictures || [],
      bookingLink: item.bookingLink,
      price: item.price
        ? {
            amount: item.price.amount,
            currencyCode: item.price.currencyCode,
          }
        : undefined,
      minimumDuration: item.minimumDuration,
    };
  } catch (error) {
    console.error("Error getting activity by ID:", error);
    throw error;
  }
}

/**
 * Search activities by square area
 *
 * @param north - North latitude boundary
 * @param west - West longitude boundary
 * @param south - South latitude boundary
 * @param east - East longitude boundary
 * @returns Array of activities found in the area
 *
 * @example
 * const activities = await searchActivitiesByArea(
 *   41.397158,
 *   2.160873,
 *   41.394582,
 *   2.177181
 * );
 */
export async function searchActivitiesByArea(
  north: number,
  west: number,
  south: number,
  east: number
): Promise<AmadeusActivity[]> {
  try {
    const accessToken = await getAccessToken();

    const searchParams = new URLSearchParams({
      north: north.toString(),
      west: west.toString(),
      south: south.toString(),
      east: east.toString(),
    });

    const url = `${AMADEUS_ACTIVITIES_URL}/by-square?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Amadeus API request failed:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();

    const activities: AmadeusActivity[] = (result.data || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        shortDescription: item.shortDescription,
        description: item.description,
        geoCode: {
          latitude: item.geoCode?.latitude,
          longitude: item.geoCode?.longitude,
        },
        rating: item.rating,
        pictures: item.pictures || [],
        bookingLink: item.bookingLink,
        price: item.price
          ? {
              amount: item.price.amount,
              currencyCode: item.price.currencyCode,
            }
          : undefined,
        minimumDuration: item.minimumDuration,
      })
    );

    return activities;
  } catch (error) {
    console.error("Error searching activities by area:", error);
    throw error;
  }
}

/**
 * Clear the cached access token
 * Useful for testing or when credentials change
 */
export function clearTokenCache(): void {
  cachedToken = null;
}
