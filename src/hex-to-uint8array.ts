import { z } from 'zod';

export const hexToUint8ArrayCoder = {
  decode: (value: string): Uint8Array<ArrayBuffer> => {
    const bytes = new Uint8Array(value.length / 2)
    for (let i = 0; i < value.length; i += 2) {
      bytes[i / 2] = parseInt(value.slice(i, i + 2), 16)
    }
    return bytes
  },
  encode: (value: Uint8Array<ArrayBuffer>): string => {
    let hex = ''
    for (let i = 0; i < value.length; i++) {
      hex += value[i]!.toString(16).padStart(2, '0')
    }
    return hex
  },
}

export const hexToUint8Array = z.codec(
  z.string().regex(/^([0-9a-fA-F]{2})*$/),
  z.instanceof(Uint8Array),
  hexToUint8ArrayCoder,
)
