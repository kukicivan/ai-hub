/**
 * SRS 12.2 Standardized API Response Utilities
 *
 * Success format:
 * { success: true, data: {...}, message: "Operation successful" }
 *
 * Error format:
 * { success: false, message: "Error description", errors: { field_name: ["Validation error"] } }
 */

// ============================================================================
// Types
// ============================================================================

/**
 * SRS 12.2 standardized API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * SRS 12.2 standardized paginated response
 */
export interface PaginatedApiResponse<T> {
  success: boolean;
  data: {
    items: T;
    meta: PaginationMeta;
  };
  message: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * SRS 12.2 standardized error response
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if the response is wrapped in SRS 12.2 format: { success, data, message }
 */
export function isWrappedResponse<T>(response: T | ApiResponse<T>): response is ApiResponse<T> {
  return (
    typeof response === "object" && response !== null && "data" in response && "success" in response
  );
}

/**
 * Check if response has 'data' property (for backwards compatibility)
 */
export function hasDataProperty<T>(response: T | { data: T }): response is { data: T } {
  return (
    typeof response === "object" &&
    response !== null &&
    "data" in (response as Record<string, unknown>)
  );
}

// ============================================================================
// Response Unwrappers
// ============================================================================

/**
 * Unwrap SRS 12.2 response to extract data
 * Handles both wrapped { success, data, message } and direct responses
 */
export function unwrapResponse<T>(response: T | ApiResponse<T>): T {
  if (isWrappedResponse(response)) {
    return response.data;
  }
  return response;
}

/**
 * Unwrap response with backwards compatibility for legacy formats
 * Tries multiple unwrap strategies
 */
export function unwrapResponseCompat<T>(response: T | ApiResponse<T> | { data: T }): T {
  // First try SRS 12.2 format
  if (isWrappedResponse(response)) {
    return response.data;
  }
  // Then try a simple {data: T } wrapper
  if (hasDataProperty(response)) {
    return response.data;
  }
  // Return as-is if not wrapped
  return response;
}

/**
 * Extract message from SRS 12.2 response
 */
export function extractMessage(response: ApiResponse<unknown> | { message: string }): {
  message: string;
} {
  if ("success" in response && "message" in response) {
    return { message: response.message };
  }
  return response as { message: string };
}

// ============================================================================
// Error Helpers
// ============================================================================

/**
 * Extract validation errors from API error response
 */
export function extractValidationErrors(error: unknown): Record<string, string[]> | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: unknown }).data === "object"
  ) {
    const data = (error as { data: { errors?: Record<string, string[]> } }).data;
    if (data.errors) {
      return data.errors;
    }
  }
  return null;
}

/**
 * Extract error message from API error response
 */
export function extractErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: unknown }).data === "object"
  ) {
    const data = (error as { data: { message?: string } }).data;
    if (data.message) {
      return data.message;
    }
  }
  return "An unexpected error occurred";
}

/**
 * Get the first validation error for a field
 */
export function getFieldError(
  errors: Record<string, string[]> | null | undefined,
  field: string
): string | undefined {
  return errors?.[field]?.[0];
}

/**
 * Convert validation errors object to flat array of messages
 */
export function flattenValidationErrors(
  errors: Record<string, string[]> | null | undefined
): string[] {
  if (!errors) return [];
  return Object.values(errors).flat();
}

/**
 * Extract error message from auth API response
 * Handles multiple error formats from Laravel:
 * 1. errors.error (string) - for auth errors like "Invalid credentials"
 * 2. errors[field] (string[]) - for validation errors
 * 3. message - general error message
 */
export function extractAuthError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: unknown }).data === "object"
  ) {
    const data = (
      error as {
        data: { errors?: Record<string, string | string[]>; message?: string };
      }
    ).data;

    // Priority 1: Check for errors.error (auth error string)
    if (data.errors && "error" in data.errors) {
      const errorValue = data.errors.error;
      if (typeof errorValue === "string") {
        return errorValue;
      }
      if (Array.isArray(errorValue) && errorValue.length > 0) {
        return errorValue[0];
      }
    }

    // Priority 2: Check for validation errors (first field error)
    if (data.errors) {
      const firstField = Object.keys(data.errors)[0];
      if (firstField && firstField !== "error") {
        const errorValue = data.errors[firstField];
        if (Array.isArray(errorValue) && errorValue.length > 0) {
          return errorValue[0];
        }
        if (typeof errorValue === "string") {
          return errorValue;
        }
      }
    }

    // Priority 3: Check for a general message
    if (data.message) {
      return data.message;
    }
  }

  return "An unexpected error occurred";
}
