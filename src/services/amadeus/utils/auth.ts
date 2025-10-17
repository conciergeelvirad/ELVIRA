/**
 * Utility functions for Amadeus API authentication and request handling
 */

import { AMADEUS_CONFIG } from "../config";
import { APIError } from "../../shared/errors";
import {
  checkResponse,
  withRetry,
  createTimeoutController,
} from "../../shared/api-utils";

let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

const getAuthToken = async (
  clientId: string,
  clientSecret: string
): Promise<string> => {
  // Check if we have a valid token
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  const controller = createTimeoutController(AMADEUS_CONFIG.timeouts.default);
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await fetch(
      `${AMADEUS_CONFIG.baseUrl}${AMADEUS_CONFIG.endpoints.auth}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
        signal: controller.signal,
      }
    );

    await checkResponse(response, "Amadeus authentication failed");
    const data = await response.json();

    if (!data.access_token) {
      throw APIError.authError("No access token received from Amadeus API");
    }

    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + data.expires_in * 1000;

    return data.access_token;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw APIError.networkError("Amadeus authentication request timed out");
    }
    throw error;
  }
};

export const makeAmadeusRequest = async <T>(
  url: string,
  clientId: string,
  clientSecret: string,
  params?: Record<string, string>,
  timeoutMs: number = AMADEUS_CONFIG.timeouts.default
): Promise<T> => {
  return withRetry(
    async () => {
      const token = await getAuthToken(clientId, clientSecret);
      const controller = createTimeoutController(timeoutMs);
      const queryString = params ? `?${new URLSearchParams(params)}` : "";

      try {
        const response = await fetch(`${url}${queryString}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        await checkResponse(response, "Amadeus API request failed");
        return response.json();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw APIError.networkError("Amadeus API request timed out");
        }
        throw error;
      }
    },
    {
      maxAttempts: AMADEUS_CONFIG.retry.maxAttempts,
      initialDelay: AMADEUS_CONFIG.retry.initialDelay,
      maxDelay: AMADEUS_CONFIG.retry.maxDelay,
    }
  );
};
