import { z } from 'zod';

export const stringToIntCoder = {
  decode: (value: string): number => parseInt(value, 10),
  encode: (value: number): string => value.toString(),
}

export const stringToInt = z.codec(
  z.string().regex(/^-?\d+$/),
  z.number().int(),
  stringToIntCoder,
)
