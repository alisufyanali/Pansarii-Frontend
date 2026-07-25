/**
 * lib/validation.ts
 * Shared validation helpers.
 */

/**
 * Validates whether the given string is a correctly formatted email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
