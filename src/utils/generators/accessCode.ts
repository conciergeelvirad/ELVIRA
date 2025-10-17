/**
 * Access Code Generator
 *
 * Utility for generating random 6-digit access codes for guests
 */

/**
 * Generates a random 6-digit access code
 * @returns A string containing 6 random digits
 */
export const generateAccessCode = (): string => {
  // Generate a random number between 100000 and 999999
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
};

/**
 * Validates if a string is a valid 6-digit access code
 * @param code - The code to validate
 * @returns True if the code is exactly 6 digits
 */
export const isValidAccessCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};
