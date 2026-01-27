import { describe, it, expect } from 'vitest';
import { stringToBigInt } from '../src/string-to-bigint.js';

describe('stringToBigInt codec', () => {
  describe('parse - valid cases', () => {
    it('should parse positive integer string to bigint', () => {
      const result = stringToBigInt.parse('42');
      expect(result).toBe(42n);
    });

    it('should parse negative integer string to bigint', () => {
      const result = stringToBigInt.parse('-17');
      expect(result).toBe(-17n);
    });

    it('should parse zero', () => {
      const result = stringToBigInt.parse('0');
      expect(result).toBe(0n);
    });

    it('should parse negative zero', () => {
      const result = stringToBigInt.parse('-0');
      expect(result).toBe(0n);
    });

    it('should parse large integer string beyond Number.MAX_SAFE_INTEGER', () => {
      const result = stringToBigInt.parse('9007199254740992');
      expect(result).toBe(9007199254740992n);
    });

    it('should parse very large integer string', () => {
      const result = stringToBigInt.parse('999999999999999999999999999999');
      expect(result).toBe(999999999999999999999999999999n);
    });

    it('should parse large negative integer string', () => {
      const result = stringToBigInt.parse('-999999999999999999999999999999');
      expect(result).toBe(-999999999999999999999999999999n);
    });

    it('should parse integer string with many digits', () => {
      const result = stringToBigInt.parse('123456789012345678901234567890');
      expect(result).toBe(123456789012345678901234567890n);
    });
  });

  describe('parse - invalid cases', () => {
    it('should reject decimal number string', () => {
      expect(() => stringToBigInt.parse('123.45')).toThrow();
    });

    it('should reject string with only letters', () => {
      expect(() => stringToBigInt.parse('abc')).toThrow();
    });

    it('should reject string with mixed alphanumeric (numbers first)', () => {
      expect(() => stringToBigInt.parse('123abc')).toThrow();
    });

    it('should reject string with mixed alphanumeric (letters first)', () => {
      expect(() => stringToBigInt.parse('abc123')).toThrow();
    });

    it('should reject empty string', () => {
      expect(() => stringToBigInt.parse('')).toThrow();
    });

    it('should reject string with only whitespace', () => {
      expect(() => stringToBigInt.parse('   ')).toThrow();
    });

    it('should reject string with leading spaces', () => {
      expect(() => stringToBigInt.parse(' 123')).toThrow();
    });

    it('should reject string with trailing spaces', () => {
      expect(() => stringToBigInt.parse('123 ')).toThrow();
    });

    it('should reject string with spaces in the middle', () => {
      expect(() => stringToBigInt.parse('12 3')).toThrow();
    });

    it('should reject multiple negative signs', () => {
      expect(() => stringToBigInt.parse('--123')).toThrow();
    });

    it('should reject positive sign', () => {
      expect(() => stringToBigInt.parse('+123')).toThrow();
    });

    it('should reject mixed signs', () => {
      expect(() => stringToBigInt.parse('+-123')).toThrow();
    });

    it('should reject string with special characters', () => {
      expect(() => stringToBigInt.parse('12$34')).toThrow();
    });

    it('should reject string with comma separators', () => {
      expect(() => stringToBigInt.parse('1,234')).toThrow();
    });

    it('should reject string with underscore separators', () => {
      expect(() => stringToBigInt.parse('1_234')).toThrow();
    });

    it('should reject scientific notation', () => {
      expect(() => stringToBigInt.parse('1e10')).toThrow();
    });

    it('should reject hexadecimal notation', () => {
      expect(() => stringToBigInt.parse('0x1A')).toThrow();
    });

    it('should reject binary notation', () => {
      expect(() => stringToBigInt.parse('0b1010')).toThrow();
    });

    it('should reject octal notation', () => {
      expect(() => stringToBigInt.parse('0o755')).toThrow();
    });
  });

  describe('safeParse - valid cases', () => {
    it('should return success for valid positive integer string', () => {
      const result = stringToBigInt.safeParse('42');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42n);
      }
    });

    it('should return success for valid negative integer string', () => {
      const result = stringToBigInt.safeParse('-99');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(-99n);
      }
    });

    it('should return success for zero', () => {
      const result = stringToBigInt.safeParse('0');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(0n);
      }
    });

    it('should return success for very large integer string', () => {
      const result = stringToBigInt.safeParse('999999999999999999999999999999');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(999999999999999999999999999999n);
      }
    });
  });

  describe('safeParse - invalid cases', () => {
    it('should return error for decimal string', () => {
      const result = stringToBigInt.safeParse('12.34');
      expect(result.success).toBe(false);
    });

    it('should return error for invalid string', () => {
      const result = stringToBigInt.safeParse('invalid');
      expect(result.success).toBe(false);
    });

    it('should return error for empty string', () => {
      const result = stringToBigInt.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should return error for string with spaces', () => {
      const result = stringToBigInt.safeParse('123 456');
      expect(result.success).toBe(false);
    });

    it('should return error for positive sign', () => {
      const result = stringToBigInt.safeParse('+123');
      expect(result.success).toBe(false);
    });

    it('should return error for scientific notation', () => {
      const result = stringToBigInt.safeParse('1e10');
      expect(result.success).toBe(false);
    });

    it('should return error for hexadecimal notation', () => {
      const result = stringToBigInt.safeParse('0xFF');
      expect(result.success).toBe(false);
    });
  });
});
