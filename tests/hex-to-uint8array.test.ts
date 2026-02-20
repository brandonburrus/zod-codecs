import { describe, it, expect } from 'vitest';
import { hexToUint8Array } from '../src/hex-to-uint8array.js';

describe('hexToUint8Array codec', () => {
  describe('parse - valid cases', () => {
    it('should parse empty string to empty Uint8Array', () => {
      const result = hexToUint8Array.parse('')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(0)
    })

    it('should parse "48656c6c6f" to "Hello"', () => {
      const result = hexToUint8Array.parse('48656c6c6f')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe('Hello')
    })

    it('should parse "48656c6c6f20576f726c6421" to "Hello World!"', () => {
      const result = hexToUint8Array.parse('48656c6c6f20576f726c6421')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe('Hello World!')
    })

    it('should parse single byte "00"', () => {
      const result = hexToUint8Array.parse('00')
      expect(result).toEqual(new Uint8Array([0]))
    })

    it('should parse single byte "ff"', () => {
      const result = hexToUint8Array.parse('ff')
      expect(result).toEqual(new Uint8Array([255]))
    })

    it('should parse uppercase hex "FF"', () => {
      const result = hexToUint8Array.parse('FF')
      expect(result).toEqual(new Uint8Array([255]))
    })

    it('should parse mixed case hex "FfAa00"', () => {
      const result = hexToUint8Array.parse('FfAa00')
      expect(result).toEqual(new Uint8Array([255, 170, 0]))
    })

    it('should handle binary data correctly', () => {
      const result = hexToUint8Array.parse('000102ff')
      expect(result).toEqual(new Uint8Array([0, 1, 2, 255]))
    })

    it('should parse all hex digits', () => {
      const result = hexToUint8Array.parse('0123456789abcdef')
      expect(result).toEqual(new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]))
    })
  })

  describe('parse - invalid cases', () => {
    it('should reject odd-length string', () => {
      expect(() => hexToUint8Array.parse('abc')).toThrow()
    })

    it('should reject single character', () => {
      expect(() => hexToUint8Array.parse('a')).toThrow()
    })

    it('should reject string with invalid hex character "g"', () => {
      expect(() => hexToUint8Array.parse('0g')).toThrow()
    })

    it('should reject string with invalid hex character "z"', () => {
      expect(() => hexToUint8Array.parse('zz')).toThrow()
    })

    it('should reject string with spaces', () => {
      expect(() => hexToUint8Array.parse('00 ff')).toThrow()
    })

    it('should reject string with newlines', () => {
      expect(() => hexToUint8Array.parse('00\nff')).toThrow()
    })

    it('should reject string with 0x prefix', () => {
      expect(() => hexToUint8Array.parse('0xff')).toThrow()
    })

    it('should reject string with special characters', () => {
      expect(() => hexToUint8Array.parse('00!f')).toThrow()
    })
  })

  describe('safeParse - valid cases', () => {
    it('should return success for valid hex string', () => {
      const result = hexToUint8Array.safeParse('48656c6c6f')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeInstanceOf(Uint8Array)
        expect(new TextDecoder().decode(result.data)).toBe('Hello')
      }
    })

    it('should return success for empty string', () => {
      const result = hexToUint8Array.safeParse('')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.length).toBe(0)
      }
    })

    it('should return success for uppercase hex', () => {
      const result = hexToUint8Array.safeParse('AABBCC')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(new Uint8Array([170, 187, 204]))
      }
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for odd-length string', () => {
      const result = hexToUint8Array.safeParse('abc')
      expect(result.success).toBe(false)
    })

    it('should return error for invalid hex characters', () => {
      const result = hexToUint8Array.safeParse('gg')
      expect(result.success).toBe(false)
    })

    it('should return error for string with spaces', () => {
      const result = hexToUint8Array.safeParse('00 ff')
      expect(result.success).toBe(false)
    })

    it('should return error for 0x prefix', () => {
      const result = hexToUint8Array.safeParse('0xff')
      expect(result.success).toBe(false)
    })
  })

  describe('encode', () => {
    it('should encode empty Uint8Array to empty string', () => {
      const bytes = new Uint8Array([])
      const result = hexToUint8Array.encode(bytes)
      expect(result).toBe('')
    })

    it('should encode "Hello" to "48656c6c6f"', () => {
      const bytes = new TextEncoder().encode('Hello')
      const result = hexToUint8Array.encode(bytes)
      expect(result).toBe('48656c6c6f')
    })

    it('should encode "Hello World!" to "48656c6c6f20576f726c6421"', () => {
      const bytes = new TextEncoder().encode('Hello World!')
      const result = hexToUint8Array.encode(bytes)
      expect(result).toBe('48656c6c6f20576f726c6421')
    })

    it('should encode single byte 0 with leading zero', () => {
      const bytes = new Uint8Array([0])
      const result = hexToUint8Array.encode(bytes)
      expect(result).toBe('00')
    })

    it('should encode single byte 15 with leading zero', () => {
      const bytes = new Uint8Array([15])
      const result = hexToUint8Array.encode(bytes)
      expect(result).toBe('0f')
    })

    it('should encode single byte 255 as "ff"', () => {
      const bytes = new Uint8Array([255])
      const result = hexToUint8Array.encode(bytes)
      expect(result).toBe('ff')
    })

    it('should encode binary data correctly', () => {
      const bytes = new Uint8Array([0, 1, 2, 255])
      const result = hexToUint8Array.encode(bytes)
      expect(result).toBe('000102ff')
    })

    it('should use lowercase hex digits', () => {
      const bytes = new Uint8Array([170, 187, 204, 221, 238, 255])
      const result = hexToUint8Array.encode(bytes)
      expect(result).toBe('aabbccddeeff')
    })

    it('should round-trip correctly', () => {
      const original = 'The quick brown fox jumps over the lazy dog'
      const bytes = new TextEncoder().encode(original)
      const encoded = hexToUint8Array.encode(bytes)
      const decoded = hexToUint8Array.parse(encoded)
      expect(new TextDecoder().decode(decoded)).toBe(original)
    })

    it('should round-trip binary data correctly', () => {
      const original = new Uint8Array([0, 1, 2, 63, 64, 127, 128, 254, 255])
      const encoded = hexToUint8Array.encode(original)
      const decoded = hexToUint8Array.parse(encoded)
      expect(decoded).toEqual(original)
    })
  })
})
