import { describe, it, expect } from 'vitest';
import { queryStringToMap } from '../src/query-string-to-map.js';

describe('queryStringToMap codec', () => {
  describe('parse - valid cases', () => {
    it('should parse empty string to empty Map', () => {
      const result = queryStringToMap.parse('')
      expect(result).toBeInstanceOf(Map)
      expect(result.size).toBe(0)
    })

    it('should parse single key-value pair', () => {
      const result = queryStringToMap.parse('foo=bar')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('foo')).toBe('bar')
      expect(result.size).toBe(1)
    })

    it('should parse multiple key-value pairs', () => {
      const result = queryStringToMap.parse('foo=bar&baz=qux')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('foo')).toBe('bar')
      expect(result.get('baz')).toBe('qux')
      expect(result.size).toBe(2)
    })

    it('should parse key with empty value', () => {
      const result = queryStringToMap.parse('foo=')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('foo')).toBe('')
      expect(result.size).toBe(1)
    })

    it('should parse multiple keys with empty values', () => {
      const result = queryStringToMap.parse('foo=&bar=')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('foo')).toBe('')
      expect(result.get('bar')).toBe('')
    })

    it('should parse URL-encoded values', () => {
      const result = queryStringToMap.parse('message=hello%20world')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('message')).toBe('hello world')
    })

    it('should parse URL-encoded keys', () => {
      const result = queryStringToMap.parse('my%20key=value')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('my key')).toBe('value')
    })

    it('should parse special characters when encoded', () => {
      const result = queryStringToMap.parse('data=%26%3D%3F')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('data')).toBe('&=?')
    })

    it('should parse numeric values as strings', () => {
      const result = queryStringToMap.parse('count=42&price=19.99')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('count')).toBe('42')
      expect(result.get('price')).toBe('19.99')
    })

    it('should handle plus signs as spaces', () => {
      const result = queryStringToMap.parse('message=hello+world')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('message')).toBe('hello world')
    })

    it('should parse complex query string', () => {
      const result = queryStringToMap.parse('name=John%20Doe&age=30&city=New%20York')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('name')).toBe('John Doe')
      expect(result.get('age')).toBe('30')
      expect(result.get('city')).toBe('New York')
      expect(result.size).toBe(3)
    })
  })

  describe('parse - duplicate keys', () => {
    it('should keep last value for duplicate keys', () => {
      const result = queryStringToMap.parse('foo=first&foo=second')
      expect(result).toBeInstanceOf(Map)
      expect(result.get('foo')).toBe('second')
      expect(result.size).toBe(1)
    })
  })

  describe('parse - invalid cases', () => {
    it('should reject string with leading ampersand', () => {
      expect(() => queryStringToMap.parse('&foo=bar')).toThrow()
    })

    it('should reject string with trailing ampersand', () => {
      expect(() => queryStringToMap.parse('foo=bar&')).toThrow()
    })

    it('should reject string with double ampersand', () => {
      expect(() => queryStringToMap.parse('foo=bar&&baz=qux')).toThrow()
    })

    it('should reject key without value', () => {
      expect(() => queryStringToMap.parse('foo')).toThrow()
    })

    it('should reject key without equals sign', () => {
      expect(() => queryStringToMap.parse('foo&bar=baz')).toThrow()
    })
  })

  describe('safeParse - valid cases', () => {
    it('should return success for valid query string', () => {
      const result = queryStringToMap.safeParse('foo=bar&baz=qux')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeInstanceOf(Map)
        expect(result.data.get('foo')).toBe('bar')
      }
    })

    it('should return success for empty string', () => {
      const result = queryStringToMap.safeParse('')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.size).toBe(0)
      }
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for leading ampersand', () => {
      const result = queryStringToMap.safeParse('&foo=bar')
      expect(result.success).toBe(false)
    })

    it('should return error for trailing ampersand', () => {
      const result = queryStringToMap.safeParse('foo=bar&')
      expect(result.success).toBe(false)
    })

    it('should return error for key without value', () => {
      const result = queryStringToMap.safeParse('foo')
      expect(result.success).toBe(false)
    })
  })

  describe('encode', () => {
    it('should encode empty Map to empty string', () => {
      const map = new Map<string, string>()
      const result = queryStringToMap.encode(map)
      expect(result).toBe('')
    })

    it('should encode single key-value pair', () => {
      const map = new Map<string, string>([['foo', 'bar']])
      const result = queryStringToMap.encode(map)
      expect(result).toBe('foo=bar')
    })

    it('should encode multiple key-value pairs', () => {
      const map = new Map<string, string>([['foo', 'bar'], ['baz', 'qux']])
      const result = queryStringToMap.encode(map)
      expect(result).toBe('foo=bar&baz=qux')
    })

    it('should encode key with empty value', () => {
      const map = new Map<string, string>([['foo', '']])
      const result = queryStringToMap.encode(map)
      expect(result).toBe('foo=')
    })

    it('should URL-encode special characters in values', () => {
      const map = new Map<string, string>([['data', '&=?']])
      const result = queryStringToMap.encode(map)
      expect(result).toBe('data=%26%3D%3F')
    })

    it('should URL-encode spaces in values', () => {
      const map = new Map<string, string>([['message', 'hello world']])
      const result = queryStringToMap.encode(map)
      expect(result).toBe('message=hello+world')
    })

    it('should URL-encode special characters in keys', () => {
      const map = new Map<string, string>([['my key', 'value']])
      const result = queryStringToMap.encode(map)
      expect(result).toBe('my+key=value')
    })

    it('should round-trip correctly', () => {
      const original = 'name=John+Doe&age=30&city=New+York'
      const map = queryStringToMap.parse(original)
      const encoded = queryStringToMap.encode(map)
      expect(encoded).toBe(original)
    })

    it('should round-trip with encoded characters', () => {
      const map = new Map<string, string>([
        ['key1', 'value with spaces'],
        ['key2', 'special&chars=here'],
      ])
      const encoded = queryStringToMap.encode(map)
      const decoded = queryStringToMap.parse(encoded)
      expect(decoded.get('key1')).toBe('value with spaces')
      expect(decoded.get('key2')).toBe('special&chars=here')
    })
  })
})
