/**
 * Common result type for Server Actions
 * Represents either a successful result with data or a failure with an error message
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
