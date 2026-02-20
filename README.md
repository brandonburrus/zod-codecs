# zod-codecs

A library of useful pre-built codecs for Zod validation.

## Installation

```bash
npm install zod zod-codecs
```

## Usage

Import codecs from the package and use them with Zod's `codec()` method:

```typescript
import { z } from 'zod';
import { stringToInt } from 'zod-codecs';

// Parse a string as an integer
const result = stringToInt.parse('42');
console.log(result); // 42 (number)

// Encode back to string
const encoded = stringToInt.encode(42);
console.log(encoded); // '42' (string)
```

## Available Codecs

### String to Number Codecs
- `stringToInt` - Converts string to integer number
- `stringToNumber` - Converts string to number (including floats)
- `stringToBigint` - Converts string to bigint

### Date Codecs
- `isoDateTimeToDate` - Converts ISO date-time string to Date object
- `unixSecondsToDate` - Converts Unix timestamp (seconds) to Date object

### Binary Data Codecs
- `base64ToUint8Array` - Converts base64 encoded string to Uint8Array
- `base64urlToUint8Array` - Converts URL-safe base64 encoded string to Uint8Array
- `hexToUint8Array` - Converts hexadecimal string to Uint8Array

### URL Codecs
- `stringToUrl` - Converts URL string to URL object
- `queryStringToMap` - Converts query string to Map<string, string>
- `queryStringToObject` - Converts query string to Record<string, string>
