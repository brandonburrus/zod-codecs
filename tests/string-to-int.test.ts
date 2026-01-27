import { describe, it, expect } from 'vitest';
import { stringToInt } from '../src/string-to-int.js';

describe('stringToInt codec', () => {
  describe('parse - valid cases', () => {
    it('should parse positive integer string to number', () => {
      const result = stringToInt.parse('42');
      expect(result).toBe(42);
    });

    it('should parse negative integer string to number', () => {
      const result = stringToInt.parse('-17');
      expect(result).toBe(-17);
    });

    it('should parse zero', () => {
      const result = stringToInt.parse('0');
      expect(result).toBe(0);
    });

    it('should parse negative zero', () => {
      const result = stringToInt.parse('-0');
      expect(result).toBe(-0);
    });

    it('should parse large integer string', () => {
      const result = stringToInt.parse('999999999');
      expect(result).toBe(999999999);
    });

    it('should parse large negative integer string', () => {
      const result = stringToInt.parse('-999999999');
      expect(result).toBe(-999999999);
    });
  });

  describe('parse - invalid cases', () => {
    it('should reject decimal number string', () => {
      expect(() => stringToInt.parse('123.45')).toThrow();
    });

    it('should reject string with only letters', () => {
      expect(() => stringToInt.parse('abc')).toThrow();
    });

    it('should reject string with mixed alphanumeric (numbers first)', () => {
      expect(() => stringToInt.parse('123abc')).toThrow();
    });

    it('should reject string with mixed alphanumeric (letters first)', () => {
      expect(() => stringToInt.parse('abc123')).toThrow();
    });

    it('should reject empty string', () => {
      expect(() => stringToInt.parse('')).toThrow();
    });

    it('should reject string with only whitespace', () => {
      expect(() => stringToInt.parse('   ')).toThrow();
    });

    it('should reject string with leading spaces', () => {
      expect(() => stringToInt.parse(' 123')).toThrow();
    });

    it('should reject string with trailing spaces', () => {
      expect(() => stringToInt.parse('123 ')).toThrow();
    });

    it('should reject string with spaces in the middle', () => {
      expect(() => stringToInt.parse('12 3')).toThrow();
    });

    it('should reject multiple negative signs', () => {
      expect(() => stringToInt.parse('--123')).toThrow();
    });

    it('should reject positive sign', () => {
      expect(() => stringToInt.parse('+123')).toThrow();
    });

    it('should reject mixed signs', () => {
      expect(() => stringToInt.parse('+-123')).toThrow();
    });

    it('should reject string with special characters', () => {
      expect(() => stringToInt.parse('12$34')).toThrow();
    });

    it('should reject string with comma separators', () => {
      expect(() => stringToInt.parse('1,234')).toThrow();
    });

    it('should reject string with underscore separators', () => {
      expect(() => stringToInt.parse('1_234')).toThrow();
    });
  });

  describe('safeParse - valid cases', () => {
    it('should return success for valid positive integer string', () => {
      const result = stringToInt.safeParse('42');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it('should return success for valid negative integer string', () => {
      const result = stringToInt.safeParse('-99');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(-99);
      }
    });

    it('should return success for zero', () => {
      const result = stringToInt.safeParse('0');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(0);
      }
    });
  });

  describe('safeParse - invalid cases', () => {
    it('should return error for decimal string', () => {
      const result = stringToInt.safeParse('12.34');
      expect(result.success).toBe(false);
    });

    it('should return error for invalid string', () => {
      const result = stringToInt.safeParse('invalid');
      expect(result.success).toBe(false);
    });

    it('should return error for empty string', () => {
      const result = stringToInt.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should return error for string with spaces', () => {
      const result = stringToInt.safeParse('123 456');
      expect(result.success).toBe(false);
    });

    it('should return error for positive sign', () => {
      const result = stringToInt.safeParse('+123');
      expect(result.success).toBe(false);
    });
  });
});
