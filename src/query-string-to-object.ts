import { z } from 'zod';

export const queryStringToObjectCoder = {
  decode: (value: string): Record<string, string> => {
    const params = new URLSearchParams(value)
    const obj: Record<string, string> = {}
    for (const [key, val] of params) {
      obj[key] = val
    }
    return obj
  },
  encode: (value: Record<string, string>): string => {
    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(value)) {
      params.set(key, val)
    }
    return params.toString()
  },
}

export const queryStringToObject = z.codec(
  z.string().regex(/^([^=&]+=[^&]*(&[^=&]+=[^&]*)*)?$/),
  z.record(z.string(), z.string()),
  queryStringToObjectCoder,
)
