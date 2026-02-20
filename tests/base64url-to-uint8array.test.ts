import { describe, it, expect } from 'vitest';
import { base64urlToUint8Array } from '../src/base64url-to-uint8array.js';

describe('base64urlToUint8Array codec', () => {
  describe('parse - valid cases', () => {
    it('should parse empty string to empty Uint8Array', () => {
      const result = base64urlToUint8Array.parse('')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(0)
    })

    it('should parse "SGVsbG8" to "Hello"', () => {
      const result = base64urlToUint8Array.parse('SGVsbG8')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe('Hello')
    })

    it('should parse "SGVsbG8gV29ybGQh" to "Hello World!"', () => {
      const result = base64urlToUint8Array.parse('SGVsbG8gV29ybGQh')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe('Hello World!')
    })

    it('should parse base64url without padding (1 char result)', () => {
      const result = base64urlToUint8Array.parse('YQ')
      expect(new TextDecoder().decode(result)).toBe('a')
    })

    it('should parse base64url without padding (2 char result)', () => {
      const result = base64urlToUint8Array.parse('YWI')
      expect(new TextDecoder().decode(result)).toBe('ab')
    })

    it('should parse base64url without padding (3 char result)', () => {
      const result = base64urlToUint8Array.parse('YWJj')
      expect(new TextDecoder().decode(result)).toBe('abc')
    })

    it('should parse base64url with - character (URL-safe +)', () => {
      // Standard base64 "Pz8/" becomes "Pz8_" in base64url (without padding)
      const result = base64urlToUint8Array.parse('Pz8_')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(3)
    })

    it('should parse base64url with _ character (URL-safe /)', () => {
      const result = base64urlToUint8Array.parse('Pz4_')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(3)
    })

    it('should handle binary data correctly', () => {
      // Base64url for bytes [0, 1, 2, 255] - "AAEC/w==" in standard becomes "AAEC_w" in base64url
      const result = base64urlToUint8Array.parse('AAEC_w')
      expect(result).toEqual(new Uint8Array([0, 1, 2, 255]))
    })

    it('should parse base64url with mixed - and _ characters', () => {
      // Test data that would have both + and / in standard base64
      const result = base64urlToUint8Array.parse('Pz4-Pz8_')
      expect(result).toBeInstanceOf(Uint8Array)
    })
  })

  describe('parse - invalid cases', () => {
    it('should reject string with + character (not URL-safe)', () => {
      expect(() => base64urlToUint8Array.parse('SGVs+G8')).toThrow()
    })

    it('should reject string with / character (not URL-safe)', () => {
      expect(() => base64urlToUint8Array.parse('SGVs/G8')).toThrow()
    })

    it('should reject string with padding', () => {
      expect(() => base64urlToUint8Array.parse('YQ==')).toThrow()
    })

    it('should reject string with spaces', () => {
      expect(() => base64urlToUint8Array.parse('SGVs bG8')).toThrow()
    })

    it('should reject string with newlines', () => {
      expect(() => base64urlToUint8Array.parse('SGVs\nbG8')).toThrow()
    })

    it('should reject string with invalid characters', () => {
      expect(() => base64urlToUint8Array.parse('Hello!')).toThrow()
    })
  })

  describe('safeParse - valid cases', () => {
    it('should return success for valid base64url string', () => {
      const result = base64urlToUint8Array.safeParse('SGVsbG8')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeInstanceOf(Uint8Array)
        expect(new TextDecoder().decode(result.data)).toBe('Hello')
      }
    })

    it('should return success for empty string', () => {
      const result = base64urlToUint8Array.safeParse('')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.length).toBe(0)
      }
    })

    it('should return success for base64url with URL-safe characters', () => {
      const result = base64urlToUint8Array.safeParse('AAEC_w')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(new Uint8Array([0, 1, 2, 255]))
      }
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for string with + character', () => {
      const result = base64urlToUint8Array.safeParse('SGVs+G8')
      expect(result.success).toBe(false)
    })

    it('should return error for string with / character', () => {
      const result = base64urlToUint8Array.safeParse('SGVs/G8')
      expect(result.success).toBe(false)
    })

    it('should return error for string with padding', () => {
      const result = base64urlToUint8Array.safeParse('YQ==')
      expect(result.success).toBe(false)
    })

    it('should return error for string with spaces', () => {
      const result = base64urlToUint8Array.safeParse('SGVs bG8')
      expect(result.success).toBe(false)
    })
  })

  describe('encode', () => {
    it('should encode empty Uint8Array to empty string', () => {
      const bytes = new Uint8Array([])
      const result = base64urlToUint8Array.encode(bytes)
      expect(result).toBe('')
    })

    it('should encode "Hello" to "SGVsbG8" (no padding)', () => {
      const bytes = new TextEncoder().encode('Hello')
      const result = base64urlToUint8Array.encode(bytes)
      expect(result).toBe('SGVsbG8')
    })

    it('should encode "Hello World!" to "SGVsbG8gV29ybGQh"', () => {
      const bytes = new TextEncoder().encode('Hello World!')
      const result = base64urlToUint8Array.encode(bytes)
      expect(result).toBe('SGVsbG8gV29ybGQh')
    })

    it('should encode single byte to base64url without padding', () => {
      const bytes = new TextEncoder().encode('a')
      const result = base64urlToUint8Array.encode(bytes)
      expect(result).toBe('YQ')
      expect(result).not.toContain('=')
    })

    it('should encode two bytes to base64url without padding', () => {
      const bytes = new TextEncoder().encode('ab')
      const result = base64urlToUint8Array.encode(bytes)
      expect(result).toBe('YWI')
      expect(result).not.toContain('=')
    })

    it('should encode binary data with URL-safe characters', () => {
      const bytes = new Uint8Array([0, 1, 2, 255])
      const result = base64urlToUint8Array.encode(bytes)
      expect(result).toBe('AAEC_w')
      expect(result).not.toContain('+')
      expect(result).not.toContain('/')
      expect(result).not.toContain('=')
    })

    it('should use - instead of + for URL safety', () => {
      // Bytes that produce + in standard base64: 0xFB, 0xEF = "++8" in base64
      const bytes = new Uint8Array([251, 239])
      const result = base64urlToUint8Array.encode(bytes)
      expect(result).not.toContain('+')
      expect(result).toContain('-')
    })

    it('should use _ instead of / for URL safety', () => {
      // Bytes that produce / in standard base64
      const bytes = new Uint8Array([255, 255])
      const result = base64urlToUint8Array.encode(bytes)
      expect(result).not.toContain('/')
      expect(result).toContain('_')
    })

    it('should round-trip correctly', () => {
      const original = 'The quick brown fox jumps over the lazy dog'
      const bytes = new TextEncoder().encode(original)
      const encoded = base64urlToUint8Array.encode(bytes)
      const decoded = base64urlToUint8Array.parse(encoded)
      expect(new TextDecoder().decode(decoded)).toBe(original)
    })

    it('should round-trip binary data correctly', () => {
      const original = new Uint8Array([0, 1, 2, 63, 64, 127, 128, 254, 255])
      const encoded = base64urlToUint8Array.encode(original)
      const decoded = base64urlToUint8Array.parse(encoded)
      expect(decoded).toEqual(original)
    })
  })
})
