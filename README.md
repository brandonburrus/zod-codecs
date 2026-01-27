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

- `stringToInt` - Converts string to integer number
- `stringToNumber` - Converts string to number
- `stringToBigint` - Converts string to bigint
- `isoDateTimeToDate` - Converts ISO date-time string to Date object
- `unixSecondsToDate` - Converts Unix timestamp (seconds) to Date object
