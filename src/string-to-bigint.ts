import { z } from 'zod';

export const stringToBigIntCoder = {
  decode: (value: string): bigint => BigInt(value),
  encode: (value: bigint): string => value.toString(),
}

export const stringToBigInt = z.codec(
  z.string().regex(/^-?\d+$/),
  z.bigint(),
  stringToBigIntCoder,
)
