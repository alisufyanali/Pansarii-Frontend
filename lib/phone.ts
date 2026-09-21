/**
 * lib/phone.ts
 * Pakistan phone number normalization and validation.
 *
 * normalizePkPhone(input) -> "923XXXXXXXXX" or null.
 *
 * Accepted input shapes (with optional spaces, dashes, parens, dots):
 *   03XXXXXXXXX      → 923XXXXXXXXX
 *   3XXXXXXXXX       → 923XXXXXXXXX  (implied 92 prefix)
 *   923XXXXXXXXX     → 923XXXXXXXXX
 *   +923XXXXXXXXX    → 923XXXXXXXXX
 *   00923XXXXXXXXX   → 923XXXXXXXXX
 */

const PAK_PHONE_AFTER_PREFIX_REGEX = /^3[0-9]{9}$/;

export function normalizePkPhone(input: string | null | undefined): string | null {
  if (input == null) return null;
  const raw = typeof input === 'string' ? input : String(input);
  const clean = raw.replace(/[\s\-\(\)\.]/g, '');
  if (!clean) return null;

  if (clean.startsWith('+923') && clean.length === 13) {
    const rest = clean.slice(4);
    if (PAK_PHONE_AFTER_PREFIX_REGEX.test('3' + rest)) return '923' + rest;
  }
  if (clean.startsWith('00923') && clean.length === 14) {
    const rest = clean.slice(5);
    if (PAK_PHONE_AFTER_PREFIX_REGEX.test('3' + rest)) return '923' + rest;
  }
  if (clean.startsWith('923') && clean.length === 12) {
    const rest = clean.slice(3);
    if (PAK_PHONE_AFTER_PREFIX_REGEX.test('3' + rest)) return '923' + rest;
  }
  if (clean.startsWith('03') && clean.length === 11) {
    const rest = clean.slice(2);
    if (PAK_PHONE_AFTER_PREFIX_REGEX.test('3' + rest)) return '923' + rest;
  }
  if (clean.startsWith('3') && clean.length === 10) {
    if (PAK_PHONE_AFTER_PREFIX_REGEX.test(clean)) return '92' + clean;
  }

  return null;
}

export function isValidPkPhone(input: string | null | undefined): boolean {
  return normalizePkPhone(input) !== null;
}

export const PAK_PHONE_ERROR =
  'Please enter a valid Pakistan mobile number, e.g. 03XXXXXXXXX or +923XXXXXXXXX';
