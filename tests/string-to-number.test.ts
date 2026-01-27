import { describe, it, expect } from 'vitest';
import { stringToNumber } from '../src/string-to-number.js';

describe('stringToNumber', () => {
  describe('parse - valid cases', () => {
    it('should parse positive integers', () => {
      expect(stringToNumber.parse('42')).toBe(42)
      expect(stringToNumber.parse('0')).toBe(0)
      expect(stringToNumber.parse('999')).toBe(999)
    })

    it('should parse negative integers', () => {
      expect(stringToNumber.parse('-42')).toBe(-42)
      expect(stringToNumber.parse('-1')).toBe(-1)
    })

    it('should parse positive floats', () => {
      expect(stringToNumber.parse('3.14')).toBe(3.14)
      expect(stringToNumber.parse('0.5')).toBe(0.5)
      expect(stringToNumber.parse('123.456')).toBe(123.456)
    })

    it('should parse negative floats', () => {
      expect(stringToNumber.parse('-3.14')).toBe(-3.14)
      expect(stringToNumber.parse('-0.5')).toBe(-0.5)
    })

    it('should parse numbers starting with decimal point', () => {
      expect(stringToNumber.parse('.5')).toBe(0.5)
      expect(stringToNumber.parse('.123')).toBe(0.123)
    })

    it('should parse numbers ending with decimal point', () => {
      expect(stringToNumber.parse('5.')).toBe(5)
      expect(stringToNumber.parse('123.')).toBe(123)
    })

    it('should parse negative numbers with decimal point', () => {
      expect(stringToNumber.parse('-.5')).toBe(-0.5)
      expect(stringToNumber.parse('-5.')).toBe(-5)
    })
  })

  describe('safeParse - valid cases', () => {
    it('should successfully parse valid number strings', () => {
      const result = stringToNumber.safeParse('42.5')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(42.5)
      }
    })
  })

  describe('parse - invalid cases', () => {
    it('should throw for non-numeric strings', () => {
      expect(() => stringToNumber.parse('abc')).toThrow()
      expect(() => stringToNumber.parse('12a')).toThrow()
      expect(() => stringToNumber.parse('a12')).toThrow()
    })

    it('should throw for strings with spaces', () => {
      expect(() => stringToNumber.parse('12 34')).toThrow()
      expect(() => stringToNumber.parse(' 12')).toThrow()
      expect(() => stringToNumber.parse('12 ')).toThrow()
    })

    it('should throw for empty strings', () => {
      expect(() => stringToNumber.parse('')).toThrow()
    })

    it('should throw for multiple decimal points', () => {
      expect(() => stringToNumber.parse('1.2.3')).toThrow()
      expect(() => stringToNumber.parse('..5')).toThrow()
    })

    it('should throw for multiple negative signs', () => {
      expect(() => stringToNumber.parse('--5')).toThrow()
    })

    it('should throw for invalid formats', () => {
      expect(() => stringToNumber.parse('.')).toThrow()
      expect(() => stringToNumber.parse('-')).toThrow()
      expect(() => stringToNumber.parse('-.')).toThrow()
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for invalid input', () => {
      const result = stringToNumber.safeParse('invalid')
      expect(result.success).toBe(false)
    })
  })

  describe('encode', () => {
    it('should encode integers to strings', () => {
      const encoded = stringToNumber.encode(42)
      expect(encoded).toBe('42')
      expect(stringToNumber.parse(encoded)).toBe(42)
    })

    it('should encode floats to strings', () => {
      const encoded = stringToNumber.encode(3.14)
      expect(encoded).toBe('3.14')
      expect(stringToNumber.parse(encoded)).toBe(3.14)
    })

    it('should encode negative numbers to strings', () => {
      const encoded = stringToNumber.encode(-42.5)
      expect(encoded).toBe('-42.5')
      expect(stringToNumber.parse(encoded)).toBe(-42.5)
    })

    it('should encode zero to string', () => {
      const encoded = stringToNumber.encode(0)
      expect(encoded).toBe('0')
      expect(stringToNumber.parse(encoded)).toBe(0)
    })
  })
})
