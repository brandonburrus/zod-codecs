import { z } from 'zod';

export const base64ToUint8ArrayCoder = {
  decode: (value: string): Uint8Array<ArrayBuffer> => {
    const binaryString = atob(value)
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
    return btoa(binaryString)
  },
}

export const base64ToUint8Array = z.codec(
  z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/),
  z.instanceof(Uint8Array),
  base64ToUint8ArrayCoder,
)
