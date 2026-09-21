import { normalizePkPhone, isValidPkPhone } from '../../../lib/phone';

const EXPECTED = '923123456789';

describe('lib/phone — normalizePkPhone', () => {
  test('03XXXXXXXXX (11-digit local format)', () => {
    expect(normalizePkPhone('03123456789')).toBe(EXPECTED);
  });

  test('3XXXXXXXXX (10-digit — no prefix)', () => {
    expect(normalizePkPhone('3123456789')).toBe(EXPECTED);
  });

  test('923XXXXXXXXX (12-digit — E.164 without +)', () => {
    expect(normalizePkPhone('923123456789')).toBe(EXPECTED);
  });

  test('+923XXXXXXXXX (international with +)', () => {
    expect(normalizePkPhone('+923123456789')).toBe(EXPECTED);
  });

  test('00923XXXXXXXXX (00-prefixed international)', () => {
    expect(normalizePkPhone('00923123456789')).toBe(EXPECTED);
  });

  test('accepts spaces between digits', () => {
    expect(normalizePkPhone('03 12 345 6789')).toBe(EXPECTED);
    expect(normalizePkPhone('+92 312 345 6789')).toBe(EXPECTED);
  });

  test('accepts dashes between digits', () => {
    expect(normalizePkPhone('03-1234-56789')).toBe(EXPECTED);
    expect(normalizePkPhone('+92-312-345-6789')).toBe(EXPECTED);
  });

  test('accepts parens around the 3-digit group', () => {
    expect(normalizePkPhone('+92 (312) 345 6789')).toBe(EXPECTED);
    expect(normalizePkPhone('(0312) 345-6789')).toBe(EXPECTED);
  });

  test('accepts dots as separators', () => {
    expect(normalizePkPhone('03.123.456789')).toBe(EXPECTED);
    expect(normalizePkPhone('+92.312.345.6789')).toBe(EXPECTED);
  });

  test('mixed separators: spaces + dashes + parens + dots', () => {
    expect(normalizePkPhone(' (+92) 3.1-2 3(4)5-6.7-8 9 ')).toBe(EXPECTED);
  });

  test('rejects 03 with only 8 trailing digits (10 chars total)', () => {
    expect(normalizePkPhone('0312345678')).toBeNull();
  });

  test('rejects plain 10-digit numbers that don\\'t start with 3', () => {
    expect(normalizePkPhone('1234567890')).toBeNull();
    expect(normalizePkPhone('02123456789')).toBeNull();
  });

  test('rejects +92 with 9 trailing digits (wrong length)', () => {
    expect(normalizePkPhone('+92312345678')).toBeNull();
  });

  test('rejects +92 number not starting with 3 after prefix', () => {
    expect(normalizePkPhone('+922123456789')).toBeNull();
    expect(normalizePkPhone('922123456789')).toBeNull();
    expect(normalizePkPhone('00922123456789')).toBeNull();
    expect(normalizePkPhone('02123456789')).toBeNull();
  });

  test('rejects empty strings and null/undefined', () => {
    expect(normalizePkPhone('')).toBeNull();
    expect(normalizePkPhone('   ')).toBeNull();
    expect(normalizePkPhone(null)).toBeNull();
    expect(normalizePkPhone(undefined)).toBeNull();
  });

  test('rejects clearly invalid inputs', () => {
    expect(normalizePkPhone('abcdef')).toBeNull();
    expect(normalizePkPhone('12345')).toBeNull();
    expect(normalizePkPhone('+12025551234')).toBeNull();
  });

  test('real-world shape: +92 (304) 577-9900', () => {
    expect(normalizePkPhone('+92 (304) 577-9900')).toBe('923045779900');
  });

  test('real-world shape: 03045779900', () => {
    expect(normalizePkPhone('03045779900')).toBe('923045779900');
  });
});

describe('lib/phone — isValidPkPhone', () => {
  test('returns true for valid inputs', () => {
    expect(isValidPkPhone('03123456789')).toBe(true);
    expect(isValidPkPhone('+923123456789')).toBe(true);
    expect(isValidPkPhone('3123456789')).toBe(true);
    expect(isValidPkPhone('923123456789')).toBe(true);
    expect(isValidPkPhone('00923123456789')).toBe(true);
    expect(isValidPkPhone('03 12 345 6789')).toBe(true);
  });

  test('returns false for invalid inputs', () => {
    expect(isValidPkPhone('1234567890')).toBe(false);
    expect(isValidPkPhone('0331234567')).toBe(false);
    expect(isValidPkPhone('')).toBe(false);
    expect(isValidPkPhone(null)).toBe(false);
  });
});
