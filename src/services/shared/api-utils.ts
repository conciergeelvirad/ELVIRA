/**
 * Utility functions for handling API responses and errors
 */
import { APIError } from "./errors";

/**
 * Type guard to check if an error is an instance of APIError
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

/**
 * Checks if a response is ok and throws an APIError if not
 */
export async function checkResponse(
  response: Response,
  errorContext?: string
): Promise<Response> {
  if (!response.ok) {
    let errorMessage: string;
    let details: unknown;

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
      details = errorData;
    } catch {
      errorMessage = response.statusText;
      details = { status: response.status };
    }

    const contextMessage = errorContext
      ? `${errorContext}: ${errorMessage}`
      : errorMessage;

    if (response.status === 401) {
      throw APIError.authError(contextMessage, details);
    } else if (response.status === 429) {
      throw APIError.rateLimitError(contextMessage, details);
    } else if (response.status >= 400 && response.status < 500) {
      throw APIError.badRequest(contextMessage, details);
    } else {
      throw new APIError(
        contextMessage,
        "SERVER_ERROR",
        response.status,
        details
      );
    }
  }

  return response;
}

/**
 * Retries a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => isAPIError(error) && error.isRetryable(),
  } = options;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Creates an AbortController with a timeout
 */
export function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // Cleanup timeout when controller is aborted
  controller.signal.addEventListener("abort", () => clearTimeout(timeout));

  return controller;
}
