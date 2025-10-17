/**
 * Cart Validation Utilities
 *
 * Form validation helpers for cart checkout forms
 */

/**
 * Validate delivery/reservation date
 * Ensures date is at least tomorrow
 */
export const validateFutureDate = (date: string): boolean => {
  if (!date) return false;

  const selectedDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate >= tomorrow;
};

/**
 * Validate that all required fields have values
 */
export const validateRequiredFields = (
  fields: Record<string, unknown>
): boolean => {
  return Object.values(fields).every(
    (value) => value !== "" && value !== null && value !== undefined
  );
};

/**
 * Validate time format (HH:MM)
 */
export const validateTimeFormat = (time: string): boolean => {
  if (!time) return false;
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Validate number of guests (1-20)
 */
export const validateGuestCount = (count: number): boolean => {
  return count >= 1 && count <= 20;
};

/**
 * Get tomorrow's date as ISO string (for min date)
 */
export const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if cart has items
 */
export const hasCartItems = (itemCount: number): boolean => {
  return itemCount > 0;
};
