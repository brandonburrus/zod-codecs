import { z } from 'zod';

export const queryStringToMapCoder = {
  decode: (value: string): Map<string, string> => {
    const params = new URLSearchParams(value)
    const map = new Map<string, string>()
    for (const [key, val] of params) {
      map.set(key, val)
    }
    return map
  },
  encode: (value: Map<string, string>): string => {
    const params = new URLSearchParams()
    for (const [key, val] of value) {
      params.set(key, val)
    }
    return params.toString()
  },
}

export const queryStringToMap = z.codec(
  z.string().regex(/^([^=&]+=[^&]*(&[^=&]+=[^&]*)*)?$/),
  z.map(z.string(), z.string()),
  queryStringToMapCoder,
)
