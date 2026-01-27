import { describe, it, expect } from 'vitest';
import { isoDateTimeToDate } from '../src/iso-date-time-to-date.js';

describe('isoDateTimeToDate codec', () => {
  describe('parse - valid cases', () => {
    it('should parse ISO 8601 datetime string with Z timezone to Date', () => {
      const result = isoDateTimeToDate.parse('2024-01-15T10:30:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should parse ISO 8601 datetime string with milliseconds', () => {
      const result = isoDateTimeToDate.parse('2024-01-15T10:30:00.123Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2024-01-15T10:30:00.123Z');
    });

    it('should parse ISO 8601 datetime string with positive timezone offset', () => {
      const result = isoDateTimeToDate.parse('2024-01-15T10:30:00+05:30');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(new Date('2024-01-15T10:30:00+05:30').getTime());
    });

    it('should parse ISO 8601 datetime string with negative timezone offset', () => {
      const result = isoDateTimeToDate.parse('2024-01-15T10:30:00-08:00');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(new Date('2024-01-15T10:30:00-08:00').getTime());
    });

    it('should parse midnight time', () => {
      const result = isoDateTimeToDate.parse('2024-01-15T00:00:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2024-01-15T00:00:00.000Z');
    });

    it('should parse end of day time', () => {
      const result = isoDateTimeToDate.parse('2024-01-15T23:59:59Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2024-01-15T23:59:59.000Z');
    });

    it('should parse leap year date', () => {
      const result = isoDateTimeToDate.parse('2024-02-29T12:00:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2024-02-29T12:00:00.000Z');
    });

    it('should parse date with microseconds precision', () => {
      const result = isoDateTimeToDate.parse('2024-01-15T10:30:00.123456Z');
      expect(result).toBeInstanceOf(Date);
      // JavaScript Date only supports millisecond precision
      expect(result.toISOString()).toBe('2024-01-15T10:30:00.123Z');
    });
  });

  describe('parse - invalid cases', () => {
    it('should reject date-only string without time', () => {
      expect(() => isoDateTimeToDate.parse('2024-01-15')).toThrow();
    });

    it('should reject invalid date format', () => {
      expect(() => isoDateTimeToDate.parse('01/15/2024 10:30:00')).toThrow();
    });

    it('should reject non-ISO format with slashes', () => {
      expect(() => isoDateTimeToDate.parse('2024/01/15 10:30:00')).toThrow();
    });

    it('should reject empty string', () => {
      expect(() => isoDateTimeToDate.parse('')).toThrow();
    });

    it('should reject random text', () => {
      expect(() => isoDateTimeToDate.parse('not a date')).toThrow();
    });

    it('should reject time without date', () => {
      expect(() => isoDateTimeToDate.parse('10:30:00')).toThrow();
    });

    it('should reject datetime without timezone', () => {
      expect(() => isoDateTimeToDate.parse('2024-01-15T10:30:00')).toThrow();
    });

    it('should reject datetime with invalid month', () => {
      expect(() => isoDateTimeToDate.parse('2024-13-15T10:30:00Z')).toThrow();
    });

    it('should reject datetime with invalid day', () => {
      expect(() => isoDateTimeToDate.parse('2024-01-32T10:30:00Z')).toThrow();
    });

    it('should reject datetime with invalid hour', () => {
      expect(() => isoDateTimeToDate.parse('2024-01-15T25:30:00Z')).toThrow();
    });

    it('should reject datetime with invalid minute', () => {
      expect(() => isoDateTimeToDate.parse('2024-01-15T10:61:00Z')).toThrow();
    });

    it('should reject datetime with invalid second', () => {
      expect(() => isoDateTimeToDate.parse('2024-01-15T10:30:61Z')).toThrow();
    });

    it('should reject datetime with spaces', () => {
      expect(() => isoDateTimeToDate.parse('2024-01-15 10:30:00Z')).toThrow();
    });

    it('should reject partial datetime', () => {
      expect(() => isoDateTimeToDate.parse('2024-01-15T10:')).toThrow();
    });
  });

  describe('safeParse - valid cases', () => {
    it('should return success for valid ISO datetime string', () => {
      const result = isoDateTimeToDate.safeParse('2024-01-15T10:30:00Z');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
        expect(result.data.toISOString()).toBe('2024-01-15T10:30:00.000Z');
      }
    });

    it('should return success for datetime with milliseconds', () => {
      const result = isoDateTimeToDate.safeParse('2024-01-15T10:30:00.500Z');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
        expect(result.data.toISOString()).toBe('2024-01-15T10:30:00.500Z');
      }
    });

    it('should return success for datetime with timezone offset', () => {
      const result = isoDateTimeToDate.safeParse('2024-01-15T10:30:00+02:00');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
        expect(result.data.getTime()).toBe(new Date('2024-01-15T10:30:00+02:00').getTime());
      }
    });
  });

  describe('safeParse - invalid cases', () => {
    it('should return error for date-only string', () => {
      const result = isoDateTimeToDate.safeParse('2024-01-15');
      expect(result.success).toBe(false);
    });

    it('should return error for invalid format', () => {
      const result = isoDateTimeToDate.safeParse('01/15/2024');
      expect(result.success).toBe(false);
    });

    it('should return error for empty string', () => {
      const result = isoDateTimeToDate.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should return error for random text', () => {
      const result = isoDateTimeToDate.safeParse('invalid date');
      expect(result.success).toBe(false);
    });

    it('should return error for datetime without timezone', () => {
      const result = isoDateTimeToDate.safeParse('2024-01-15T10:30:00');
      expect(result.success).toBe(false);
    });

    it('should return error for invalid date values', () => {
      const result = isoDateTimeToDate.safeParse('2024-02-30T10:30:00Z');
      expect(result.success).toBe(false);
    });
  });
});
