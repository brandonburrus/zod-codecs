import { describe, it, expect } from 'vitest';
import { queryStringToObject } from '../src/query-string-to-object.js';

describe('queryStringToObject codec', () => {
  describe('parse - valid cases', () => {
    it('should parse empty string to empty object', () => {
      const result = queryStringToObject.parse('')
      expect(result).toEqual({})
    })

    it('should parse single key-value pair', () => {
      const result = queryStringToObject.parse('foo=bar')
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should parse multiple key-value pairs', () => {
      const result = queryStringToObject.parse('foo=bar&baz=qux')
      expect(result).toEqual({ foo: 'bar', baz: 'qux' })
    })

    it('should parse key with empty value', () => {
      const result = queryStringToObject.parse('foo=')
      expect(result).toEqual({ foo: '' })
    })

    it('should parse multiple keys with empty values', () => {
      const result = queryStringToObject.parse('foo=&bar=')
      expect(result).toEqual({ foo: '', bar: '' })
    })

    it('should parse URL-encoded values', () => {
      const result = queryStringToObject.parse('message=hello%20world')
      expect(result).toEqual({ message: 'hello world' })
    })

    it('should parse URL-encoded keys', () => {
      const result = queryStringToObject.parse('my%20key=value')
      expect(result).toEqual({ 'my key': 'value' })
    })

    it('should parse special characters when encoded', () => {
      const result = queryStringToObject.parse('data=%26%3D%3F')
      expect(result).toEqual({ data: '&=?' })
    })

    it('should parse numeric values as strings', () => {
      const result = queryStringToObject.parse('count=42&price=19.99')
      expect(result).toEqual({ count: '42', price: '19.99' })
    })

    it('should handle plus signs as spaces', () => {
      const result = queryStringToObject.parse('message=hello+world')
      expect(result).toEqual({ message: 'hello world' })
    })

    it('should parse complex query string', () => {
      const result = queryStringToObject.parse('name=John%20Doe&age=30&city=New%20York')
      expect(result).toEqual({ name: 'John Doe', age: '30', city: 'New York' })
    })
  })

  describe('parse - duplicate keys', () => {
    it('should keep last value for duplicate keys', () => {
      const result = queryStringToObject.parse('foo=first&foo=second')
      expect(result).toEqual({ foo: 'second' })
    })
  })

  describe('parse - invalid cases', () => {
    it('should reject string with leading ampersand', () => {
      expect(() => queryStringToObject.parse('&foo=bar')).toThrow()
    })

    it('should reject string with trailing ampersand', () => {
      expect(() => queryStringToObject.parse('foo=bar&')).toThrow()
    })

    it('should reject string with double ampersand', () => {
      expect(() => queryStringToObject.parse('foo=bar&&baz=qux')).toThrow()
    })

    it('should reject key without value', () => {
      expect(() => queryStringToObject.parse('foo')).toThrow()
    })

    it('should reject key without equals sign', () => {
      expect(() => queryStringToObject.parse('foo&bar=baz')).toThrow()
    })
  })

  describe('safeParse - valid cases', () => {
    it('should return success for valid query string', () => {
      const result = queryStringToObject.safeParse('foo=bar&baz=qux')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ foo: 'bar', baz: 'qux' })
      }
    })

    it('should return success for empty string', () => {
      const result = queryStringToObject.safeParse('')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({})
      }
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for leading ampersand', () => {
      const result = queryStringToObject.safeParse('&foo=bar')
      expect(result.success).toBe(false)
    })

    it('should return error for trailing ampersand', () => {
      const result = queryStringToObject.safeParse('foo=bar&')
      expect(result.success).toBe(false)
    })

    it('should return error for key without value', () => {
      const result = queryStringToObject.safeParse('foo')
      expect(result.success).toBe(false)
    })
  })

  describe('encode', () => {
    it('should encode empty object to empty string', () => {
      const result = queryStringToObject.encode({})
      expect(result).toBe('')
    })

    it('should encode single key-value pair', () => {
      const result = queryStringToObject.encode({ foo: 'bar' })
      expect(result).toBe('foo=bar')
    })

    it('should encode multiple key-value pairs', () => {
      const result = queryStringToObject.encode({ foo: 'bar', baz: 'qux' })
      expect(result).toBe('foo=bar&baz=qux')
    })

    it('should encode key with empty value', () => {
      const result = queryStringToObject.encode({ foo: '' })
      expect(result).toBe('foo=')
    })

    it('should URL-encode special characters in values', () => {
      const result = queryStringToObject.encode({ data: '&=?' })
      expect(result).toBe('data=%26%3D%3F')
    })

    it('should URL-encode spaces in values', () => {
      const result = queryStringToObject.encode({ message: 'hello world' })
      expect(result).toBe('message=hello+world')
    })

    it('should URL-encode special characters in keys', () => {
      const result = queryStringToObject.encode({ 'my key': 'value' })
      expect(result).toBe('my+key=value')
    })

    it('should round-trip correctly', () => {
      const original = 'name=John+Doe&age=30&city=New+York'
      const obj = queryStringToObject.parse(original)
      const encoded = queryStringToObject.encode(obj)
      expect(encoded).toBe(original)
    })

    it('should round-trip with encoded characters', () => {
      const obj = {
        key1: 'value with spaces',
        key2: 'special&chars=here',
      }
      const encoded = queryStringToObject.encode(obj)
      const decoded = queryStringToObject.parse(encoded)
      expect(decoded).toEqual(obj)
    })
  })
})
