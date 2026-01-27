import { z } from 'zod';

export const stringToNumberCoder = {
  decode: (value: string): number => parseFloat(value),
  encode: (value: number): string => value.toString(),
}

export const stringToNumber = z.codec(
  z.string().regex(/^-?(\d+\.?\d*|\.\d+)$/),
  z.number(),
  stringToNumberCoder,
)
