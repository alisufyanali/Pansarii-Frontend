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

/**
 * Pakistan phone number regex.
 * Accepts:
 *   03XXXXXXXXX    (11 digits, starts with 03)
 *   +923XXXXXXXXX  (international, +92 followed by 10 digits starting with 3)
 */
export const PAKISTAN_PHONE_REGEX = /^(\+92|0)3[0-9]{9}$/;

/**
 * User-friendly Pakistan phone validation error message.
 */
export const PAKISTAN_PHONE_ERROR =
  'Please enter a valid Pakistan phone number, e.g. 03XXXXXXXXX or +923XXXXXXXXX';

/**
 * Strips common formatting characters (spaces, dashes, parentheses) from a phone
 * number before validation, then tests against the Pakistan phone regex.
 */
export function isValidPakistanPhone(phone: string): boolean {
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return PAKISTAN_PHONE_REGEX.test(clean);
}
