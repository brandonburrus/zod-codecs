import { describe, it, expect } from 'vitest';
import { base64ToUint8Array } from '../src/base64-to-uint8array.js';

describe('base64ToUint8Array codec', () => {
  describe('parse - valid cases', () => {
    it('should parse empty string to empty Uint8Array', () => {
      const result = base64ToUint8Array.parse('')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(0)
    })

    it('should parse "SGVsbG8=" to "Hello"', () => {
      const result = base64ToUint8Array.parse('SGVsbG8=')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe('Hello')
    })

    it('should parse "SGVsbG8gV29ybGQh" to "Hello World!"', () => {
      const result = base64ToUint8Array.parse('SGVsbG8gV29ybGQh')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe('Hello World!')
    })

    it('should parse base64 with padding (single =)', () => {
      const result = base64ToUint8Array.parse('YWI=')
      expect(new TextDecoder().decode(result)).toBe('ab')
    })

    it('should parse base64 with padding (double ==)', () => {
      const result = base64ToUint8Array.parse('YQ==')
      expect(new TextDecoder().decode(result)).toBe('a')
    })

    it('should parse base64 without padding', () => {
      const result = base64ToUint8Array.parse('YWJj')
      expect(new TextDecoder().decode(result)).toBe('abc')
    })

    it('should parse base64 with + character', () => {
      const result = base64ToUint8Array.parse('Pz8/')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(3)
    })

    it('should parse base64 with / character', () => {
      const result = base64ToUint8Array.parse('Pz4/')
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(3)
    })

    it('should handle binary data correctly', () => {
      // Base64 for bytes [0, 1, 2, 255]
      const result = base64ToUint8Array.parse('AAEC/w==')
      expect(result).toEqual(new Uint8Array([0, 1, 2, 255]))
    })
  })

  describe('parse - invalid cases', () => {
    it('should reject string with invalid characters', () => {
      expect(() => base64ToUint8Array.parse('Hello!')).toThrow()
    })

    it('should reject string with spaces', () => {
      expect(() => base64ToUint8Array.parse('SGVs bG8=')).toThrow()
    })

    it('should reject string with newlines', () => {
      expect(() => base64ToUint8Array.parse('SGVs\nbG8=')).toThrow()
    })

    it('should reject string with equals sign in wrong position', () => {
      expect(() => base64ToUint8Array.parse('SGVs=bG8=')).toThrow()
    })

    it('should reject string with three equals signs', () => {
      expect(() => base64ToUint8Array.parse('Y===')).toThrow()
    })

    it('should reject string with underscore', () => {
      expect(() => base64ToUint8Array.parse('SGVs_G8=')).toThrow()
    })

    it('should reject string with hyphen', () => {
      expect(() => base64ToUint8Array.parse('SGVs-G8=')).toThrow()
    })
  })

  describe('safeParse - valid cases', () => {
    it('should return success for valid base64 string', () => {
      const result = base64ToUint8Array.safeParse('SGVsbG8=')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeInstanceOf(Uint8Array)
        expect(new TextDecoder().decode(result.data)).toBe('Hello')
      }
    })

    it('should return success for empty string', () => {
      const result = base64ToUint8Array.safeParse('')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.length).toBe(0)
      }
    })

    it('should return success for base64 with padding', () => {
      const result = base64ToUint8Array.safeParse('YQ==')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(new TextDecoder().decode(result.data)).toBe('a')
      }
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for string with invalid characters', () => {
      const result = base64ToUint8Array.safeParse('Hello!')
      expect(result.success).toBe(false)
    })

    it('should return error for string with spaces', () => {
      const result = base64ToUint8Array.safeParse('SGVs bG8=')
      expect(result.success).toBe(false)
    })

    it('should return error for string with newlines', () => {
      const result = base64ToUint8Array.safeParse('SGVs\nbG8=')
      expect(result.success).toBe(false)
    })

    it('should return error for string with invalid padding', () => {
      const result = base64ToUint8Array.safeParse('Y===')
      expect(result.success).toBe(false)
    })
  })

  describe('encode', () => {
    it('should encode empty Uint8Array to empty string', () => {
      const bytes = new Uint8Array([])
      const result = base64ToUint8Array.encode(bytes)
      expect(result).toBe('')
    })

    it('should encode "Hello" to "SGVsbG8="', () => {
      const bytes = new TextEncoder().encode('Hello')
      const result = base64ToUint8Array.encode(bytes)
      expect(result).toBe('SGVsbG8=')
    })

    it('should encode "Hello World!" to "SGVsbG8gV29ybGQh"', () => {
      const bytes = new TextEncoder().encode('Hello World!')
      const result = base64ToUint8Array.encode(bytes)
      expect(result).toBe('SGVsbG8gV29ybGQh')
    })

    it('should encode binary data correctly', () => {
      const bytes = new Uint8Array([0, 1, 2, 255])
      const result = base64ToUint8Array.encode(bytes)
      expect(result).toBe('AAEC/w==')
    })

    it('should round-trip correctly', () => {
      const original = 'The quick brown fox jumps over the lazy dog'
      const bytes = new TextEncoder().encode(original)
      const encoded = base64ToUint8Array.encode(bytes)
      const decoded = base64ToUint8Array.parse(encoded)
      expect(new TextDecoder().decode(decoded)).toBe(original)
    })
  })
})
