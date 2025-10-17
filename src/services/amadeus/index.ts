/**
 * Amadeus Activities API Service
 *
 * Provides methods to search for tours and activities using Amadeus API
 */

import { makeAmadeusRequest } from "./utils/auth";
import type {
  AmadeusActivity,
  AmadeusSearchParams,
  AmadeusSearchResponse,
} from "./types";

const ACTIVITIES_API_URL =
  "https://test.api.amadeus.com/v1/shopping/activities";

export const searchActivities = async (
  params: AmadeusSearchParams,
  clientId: string,
  clientSecret: string
): Promise<AmadeusActivity[]> => {
  try {
    const queryParams: Record<string, string> = {
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius: params.radius?.toString() || "20",
      offset: params.offset?.toString() || "0",
      limit: params.limit?.toString() || "20",
    };

    if (params.categories && params.categories.length > 0) {
      queryParams.categories = params.categories.join(",");
    }

    const response = await makeAmadeusRequest<AmadeusSearchResponse>(
      ACTIVITIES_API_URL,
      clientId,
      clientSecret,
      queryParams
    );

    return response.data;
  } catch (error) {
    console.error("Error searching activities:", error);
    return [];
  }
};
