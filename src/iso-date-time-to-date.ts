import { z } from 'zod';

export const isoDateTimeToDateCoder = {
  decode: (value: string): Date => new Date(value),
  encode: (value: Date): string => value.toISOString(),
}

export const isoDateTimeToDate = z.codec(
  z.string().datetime({ offset: true }),
  z.date(),
  isoDateTimeToDateCoder,
)
