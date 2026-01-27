import { z } from 'zod';

export const unixSecondsToDateCoder = {
  decode: (value: number): Date => new Date(value * 1000),
  encode: (value: Date): number => Math.floor(value.getTime() / 1000),
}

export const unixSecondsToDate = z.codec(
  z.number(),
  z.date(),
  unixSecondsToDateCoder,
)
