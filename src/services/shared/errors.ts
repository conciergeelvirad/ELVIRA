/**
 * API Error Class
 *
 * Custom error class for handling API-specific errors with additional context
 */
export class APIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "APIError";

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, APIError.prototype);
  }

  /**
   * Creates an error instance for authentication failures
   */
  static authError(message: string, details?: unknown): APIError {
    return new APIError(message, "AUTH_ERROR", 401, details);
  }

  /**
   * Creates an error instance for rate limiting
   */
  static rateLimitError(message: string, details?: unknown): APIError {
    return new APIError(message, "RATE_LIMIT", 429, details);
  }

  /**
   * Creates an error instance for invalid requests
   */
  static badRequest(message: string, details?: unknown): APIError {
    return new APIError(message, "BAD_REQUEST", 400, details);
  }

  /**
   * Creates an error instance for network failures
   */
  static networkError(message: string, details?: unknown): APIError {
    return new APIError(message, "NETWORK_ERROR", undefined, details);
  }

  /**
   * Determines if the error is retryable
   */
  isRetryable(): boolean {
    return (
      this.code === "NETWORK_ERROR" ||
      this.code === "RATE_LIMIT" ||
      (this.status !== undefined && this.status >= 500)
    );
  }

  /**
   * Creates a user-friendly error message
   */
  toUserMessage(): string {
    switch (this.code) {
      case "AUTH_ERROR":
        return "Authentication failed. Please check your credentials.";
      case "RATE_LIMIT":
        return "Too many requests. Please try again later.";
      case "NETWORK_ERROR":
        return "Network error. Please check your connection and try again.";
      case "BAD_REQUEST":
        return "Invalid request. Please check your input.";
      default:
        return this.message;
    }
  }
}
