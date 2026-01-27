import { describe, it, expect } from 'vitest';
import { unixSecondsToDate } from '../src/unix-seconds-to-date.js';

describe('unixSecondsToDate', () => {
  describe('parse - valid cases', () => {
    it('should parse Unix epoch (0) to 1970-01-01T00:00:00.000Z', () => {
      const result = unixSecondsToDate.parse(0)
      expect(result).toEqual(new Date('1970-01-01T00:00:00.000Z'))
      expect(result.getTime()).toBe(0)
    })

    it('should parse positive Unix timestamp correctly', () => {
      const unixSeconds = 1609459200 // 2021-01-01T00:00:00.000Z
      const result = unixSecondsToDate.parse(unixSeconds)
      expect(result).toEqual(new Date('2021-01-01T00:00:00.000Z'))
      expect(result.getTime()).toBe(unixSeconds * 1000)
    })

    it('should parse negative Unix timestamp (before epoch)', () => {
      const unixSeconds = -86400 // 1969-12-31T00:00:00.000Z
      const result = unixSecondsToDate.parse(unixSeconds)
      expect(result).toEqual(new Date('1969-12-31T00:00:00.000Z'))
      expect(result.getTime()).toBe(unixSeconds * 1000)
    })

    it('should parse fractional seconds by truncating to integer milliseconds', () => {
      const unixSeconds = 1609459200.999
      const result = unixSecondsToDate.parse(unixSeconds)
      expect(result.getTime()).toBe(1609459200999)
    })

    it('should parse large timestamp (year 2038 problem boundary)', () => {
      const unixSeconds = 2147483647 // 2038-01-19T03:14:07.000Z
      const result = unixSecondsToDate.parse(unixSeconds)
      expect(result).toEqual(new Date('2038-01-19T03:14:07.000Z'))
    })

    it('should parse recent timestamp', () => {
      const unixSeconds = 1700000000 // 2023-11-14T22:13:20.000Z
      const result = unixSecondsToDate.parse(unixSeconds)
      expect(result).toEqual(new Date('2023-11-14T22:13:20.000Z'))
    })
  })

  describe('safeParse - valid cases', () => {
    it('should safely parse valid Unix timestamp', () => {
      const result = unixSecondsToDate.safeParse(1609459200)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(new Date('2021-01-01T00:00:00.000Z'))
      }
    })

    it('should safely parse zero', () => {
      const result = unixSecondsToDate.safeParse(0)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(new Date('1970-01-01T00:00:00.000Z'))
      }
    })
  })

  describe('parse - invalid cases', () => {
    it('should throw for string input', () => {
      expect(() => unixSecondsToDate.parse('1609459200' as any)).toThrow()
    })

    it('should throw for null input', () => {
      expect(() => unixSecondsToDate.parse(null as any)).toThrow()
    })

    it('should throw for undefined input', () => {
      expect(() => unixSecondsToDate.parse(undefined as any)).toThrow()
    })

    it('should throw for boolean input', () => {
      expect(() => unixSecondsToDate.parse(true as any)).toThrow()
    })

    it('should throw for object input', () => {
      expect(() => unixSecondsToDate.parse({} as any)).toThrow()
    })

    it('should throw for array input', () => {
      expect(() => unixSecondsToDate.parse([] as any)).toThrow()
    })

    it('should throw for NaN', () => {
      expect(() => unixSecondsToDate.parse(NaN)).toThrow()
    })

    it('should throw for Infinity', () => {
      expect(() => unixSecondsToDate.parse(Infinity)).toThrow()
    })

    it('should throw for negative Infinity', () => {
      expect(() => unixSecondsToDate.parse(-Infinity)).toThrow()
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for string input', () => {
      const result = unixSecondsToDate.safeParse('1609459200' as any)
      expect(result.success).toBe(false)
    })

    it('should return error for null input', () => {
      const result = unixSecondsToDate.safeParse(null as any)
      expect(result.success).toBe(false)
    })

    it('should return error for NaN', () => {
      const result = unixSecondsToDate.safeParse(NaN)
      expect(result.success).toBe(false)
    })

    it('should return error for Infinity', () => {
      const result = unixSecondsToDate.safeParse(Infinity)
      expect(result.success).toBe(false)
    })
  })

  describe('encode - Date to Unix seconds', () => {
    it('should encode Date to Unix seconds', () => {
      const date = new Date('2021-01-01T00:00:00.000Z')
      const result = unixSecondsToDate.encode(date)
      expect(result).toBe(1609459200)
    })

    it('should encode epoch Date to 0', () => {
      const date = new Date('1970-01-01T00:00:00.000Z')
      const result = unixSecondsToDate.encode(date)
      expect(result).toBe(0)
    })

    it('should encode pre-epoch Date to negative Unix seconds', () => {
      const date = new Date('1969-12-31T00:00:00.000Z')
      const result = unixSecondsToDate.encode(date)
      expect(result).toBe(-86400)
    })

    it('should floor milliseconds when encoding', () => {
      const date = new Date('2021-01-01T00:00:00.999Z')
      const result = unixSecondsToDate.encode(date)
      expect(result).toBe(1609459200) // Should floor, not round
    })

    it('should encode recent date correctly', () => {
      const date = new Date('2023-11-14T22:13:20.000Z')
      const result = unixSecondsToDate.encode(date)
      expect(result).toBe(1700000000)
    })
  })

  describe('round-trip conversions', () => {
    it('should maintain value through decode->encode cycle', () => {
      const unixSeconds = 1609459200
      const decoded = unixSecondsToDate.parse(unixSeconds)
      const encoded = unixSecondsToDate.encode(decoded)
      expect(encoded).toBe(unixSeconds)
    })

    it('should maintain value through encode->decode cycle (without milliseconds)', () => {
      const date = new Date('2021-01-01T00:00:00.000Z')
      const encoded = unixSecondsToDate.encode(date)
      const decoded = unixSecondsToDate.parse(encoded)
      expect(decoded).toEqual(date)
    })

    it('should lose milliseconds precision in round-trip', () => {
      const dateWithMs = new Date('2021-01-01T00:00:00.999Z')
      const encoded = unixSecondsToDate.encode(dateWithMs)
      const decoded = unixSecondsToDate.parse(encoded)
      expect(decoded).toEqual(new Date('2021-01-01T00:00:00.000Z'))
      expect(decoded).not.toEqual(dateWithMs)
    })
  })
})
