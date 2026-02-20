import { describe, it, expect } from 'vitest';
import { stringToUrl } from '../src/string-to-url.js';

describe('stringToUrl codec', () => {
  describe('parse - valid cases', () => {
    it('should parse simple https URL', () => {
      const result = stringToUrl.parse('https://example.com')
      expect(result).toBeInstanceOf(URL)
      expect(result.href).toBe('https://example.com/')
    })

    it('should parse http URL', () => {
      const result = stringToUrl.parse('http://example.com')
      expect(result).toBeInstanceOf(URL)
      expect(result.protocol).toBe('http:')
    })

    it('should parse URL with path', () => {
      const result = stringToUrl.parse('https://example.com/path/to/resource')
      expect(result).toBeInstanceOf(URL)
      expect(result.pathname).toBe('/path/to/resource')
    })

    it('should parse URL with query string', () => {
      const result = stringToUrl.parse('https://example.com?foo=bar&baz=qux')
      expect(result).toBeInstanceOf(URL)
      expect(result.search).toBe('?foo=bar&baz=qux')
      expect(result.searchParams.get('foo')).toBe('bar')
      expect(result.searchParams.get('baz')).toBe('qux')
    })

    it('should parse URL with hash fragment', () => {
      const result = stringToUrl.parse('https://example.com#section')
      expect(result).toBeInstanceOf(URL)
      expect(result.hash).toBe('#section')
    })

    it('should parse URL with port', () => {
      const result = stringToUrl.parse('https://example.com:8080')
      expect(result).toBeInstanceOf(URL)
      expect(result.port).toBe('8080')
    })

    it('should parse URL with username and password', () => {
      const result = stringToUrl.parse('https://user:pass@example.com')
      expect(result).toBeInstanceOf(URL)
      expect(result.username).toBe('user')
      expect(result.password).toBe('pass')
    })

    it('should parse URL with all components', () => {
      const result = stringToUrl.parse('https://user:pass@example.com:8080/path?query=value#hash')
      expect(result).toBeInstanceOf(URL)
      expect(result.protocol).toBe('https:')
      expect(result.username).toBe('user')
      expect(result.password).toBe('pass')
      expect(result.hostname).toBe('example.com')
      expect(result.port).toBe('8080')
      expect(result.pathname).toBe('/path')
      expect(result.search).toBe('?query=value')
      expect(result.hash).toBe('#hash')
    })

    it('should parse URL with subdomain', () => {
      const result = stringToUrl.parse('https://www.example.com')
      expect(result).toBeInstanceOf(URL)
      expect(result.hostname).toBe('www.example.com')
    })

    it('should parse URL with encoded characters', () => {
      const result = stringToUrl.parse('https://example.com/path%20with%20spaces')
      expect(result).toBeInstanceOf(URL)
      expect(result.pathname).toBe('/path%20with%20spaces')
    })

    it('should parse localhost URL', () => {
      const result = stringToUrl.parse('http://localhost:3000')
      expect(result).toBeInstanceOf(URL)
      expect(result.hostname).toBe('localhost')
      expect(result.port).toBe('3000')
    })

    it('should parse IP address URL', () => {
      const result = stringToUrl.parse('http://192.168.1.1:8080')
      expect(result).toBeInstanceOf(URL)
      expect(result.hostname).toBe('192.168.1.1')
    })

    it('should parse file protocol URL', () => {
      const result = stringToUrl.parse('file:///path/to/file.txt')
      expect(result).toBeInstanceOf(URL)
      expect(result.protocol).toBe('file:')
    })

    it('should parse ftp protocol URL', () => {
      const result = stringToUrl.parse('ftp://ftp.example.com/file.txt')
      expect(result).toBeInstanceOf(URL)
      expect(result.protocol).toBe('ftp:')
    })
  })

  describe('parse - invalid cases', () => {
    it('should reject empty string', () => {
      expect(() => stringToUrl.parse('')).toThrow()
    })

    it('should reject string without protocol', () => {
      expect(() => stringToUrl.parse('example.com')).toThrow()
    })

    it('should reject string with only protocol', () => {
      expect(() => stringToUrl.parse('https://')).toThrow()
    })

    it('should reject malformed URL', () => {
      expect(() => stringToUrl.parse('not a url')).toThrow()
    })

    it('should reject URL with spaces', () => {
      expect(() => stringToUrl.parse('https://example .com')).toThrow()
    })

    it('should reject relative path', () => {
      expect(() => stringToUrl.parse('/path/to/resource')).toThrow()
    })

    it('should reject protocol-relative URL', () => {
      expect(() => stringToUrl.parse('//example.com')).toThrow()
    })
  })

  describe('safeParse - valid cases', () => {
    it('should return success for valid URL', () => {
      const result = stringToUrl.safeParse('https://example.com')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeInstanceOf(URL)
        expect(result.data.hostname).toBe('example.com')
      }
    })

    it('should return success for URL with path and query', () => {
      const result = stringToUrl.safeParse('https://example.com/api?key=value')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.pathname).toBe('/api')
        expect(result.data.searchParams.get('key')).toBe('value')
      }
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for empty string', () => {
      const result = stringToUrl.safeParse('')
      expect(result.success).toBe(false)
    })

    it('should return error for string without protocol', () => {
      const result = stringToUrl.safeParse('example.com')
      expect(result.success).toBe(false)
    })

    it('should return error for malformed URL', () => {
      const result = stringToUrl.safeParse('not a url')
      expect(result.success).toBe(false)
    })

    it('should return error for relative path', () => {
      const result = stringToUrl.safeParse('/path/to/resource')
      expect(result.success).toBe(false)
    })
  })

  describe('encode', () => {
    it('should encode URL to string', () => {
      const url = new URL('https://example.com')
      const result = stringToUrl.encode(url)
      expect(result).toBe('https://example.com/')
    })

    it('should encode URL with path', () => {
      const url = new URL('https://example.com/path/to/resource')
      const result = stringToUrl.encode(url)
      expect(result).toBe('https://example.com/path/to/resource')
    })

    it('should encode URL with query string', () => {
      const url = new URL('https://example.com?foo=bar')
      const result = stringToUrl.encode(url)
      expect(result).toBe('https://example.com/?foo=bar')
    })

    it('should encode URL with hash', () => {
      const url = new URL('https://example.com#section')
      const result = stringToUrl.encode(url)
      expect(result).toBe('https://example.com/#section')
    })

    it('should encode URL with port', () => {
      const url = new URL('https://example.com:8080')
      const result = stringToUrl.encode(url)
      expect(result).toBe('https://example.com:8080/')
    })

    it('should encode URL with all components', () => {
      const url = new URL('https://user:pass@example.com:8080/path?query=value#hash')
      const result = stringToUrl.encode(url)
      expect(result).toBe('https://user:pass@example.com:8080/path?query=value#hash')
    })

    it('should round-trip correctly', () => {
      const original = 'https://user:pass@example.com:8080/path?query=value#hash'
      const url = stringToUrl.parse(original)
      const encoded = stringToUrl.encode(url)
      expect(encoded).toBe(original)
    })

    it('should normalize URL during round-trip', () => {
      const original = 'https://example.com'
      const url = stringToUrl.parse(original)
      const encoded = stringToUrl.encode(url)
      // URL adds trailing slash
      expect(encoded).toBe('https://example.com/')
    })
  })
})
