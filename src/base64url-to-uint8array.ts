import { z } from 'zod';

export const base64urlToUint8ArrayCoder = {
  decode: (value: string): Uint8Array<ArrayBuffer> => {
    // Convert URL-safe base64 to standard base64
    let base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    // Add padding if needed
    const padding = value.length % 4
    if (padding === 2) {
      base64 += '=='
    } else if (padding === 3) {
      base64 += '='
    }
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  },
  encode: (value: Uint8Array<ArrayBuffer>): string => {
    let binaryString = ''
    for (let i = 0; i < value.length; i++) {
      binaryString += String.fromCharCode(value[i]!)
    }
    // Convert to standard base64, then make URL-safe
    return btoa(binaryString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  },
}

export const base64urlToUint8Array = z.codec(
  z.base64url(),
  z.instanceof(Uint8Array),
  base64urlToUint8ArrayCoder,
)
