import { z } from 'zod';

export const stringToUrlCoder = {
  decode: (value: string): URL => new URL(value),
  encode: (value: URL): string => value.href,
}

export const stringToUrl = z.codec(
  z.url(),
  z.instanceof(URL),
  stringToUrlCoder,
)
