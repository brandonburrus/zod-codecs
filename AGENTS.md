# Agent Guidelines for zod-codecs

This document provides coding agents with essential information about this repository's structure, conventions, and commands.

## Project Overview

**zod-codecs** is a TypeScript library providing useful pre-built Codecs for Zod validation. The project uses a modern TypeScript setup with strict type checking, Rollup for bundling, and Vitest for testing.

## Build, Lint, and Test Commands

### Building
```bash
npm run build          # Build library (ESM, CJS, and type definitions)
npm run typecheck      # Run TypeScript type checking without emitting files
```

### Testing
```bash
npm test                                      # Run all tests in watch mode
npm run test:run                              # Run all tests once (CI mode)
vitest run tests/string-to-int.test.ts        # Run a single test file
vitest tests/string-to-int.test.ts            # Run single test in watch mode
```

**Key Testing Notes**:
- Use `vitest run <file>` for single test execution
- Test framework: Vitest 4.0.18 with globals enabled
- Tests use `describe`, `it`, `expect` API
- Always test both `parse()` (throws on error) and `safeParse()` (returns result object)

### Package Management
```bash
npm install            # Install dependencies
```

## Code Style Guidelines

### Formatting

**Indentation**: 2 spaces (no tabs)

**Semicolons**: NO semicolons (except in import statements from external packages)
```typescript
import { z } from 'zod';  // Semicolon here only

export const myCodec = {
  decode: (val: string): number => parseInt(val, 10),
  encode: (val: number): string => val.toString(),
}  // No semicolon
```

**Quotes**: Single quotes for strings
```typescript
import { z } from 'zod';
const result = codec.parse('value');
```

**Trailing Commas**: Use trailing commas in multi-line objects/arrays
```typescript
export const coder = {
  decode: (v: string): number => parseInt(v, 10),
  encode: (v: number): string => v.toString(),  // trailing comma
}
```

### Imports

**Named Imports**: Prefer named imports over default imports
```typescript
import { z } from 'zod';
import { describe, it, expect } from 'vitest';
```

**File Extensions**: MUST use `.js` extension for relative imports (required for ESM with `verbatimModuleSyntax`)
```typescript
import { stringToInt } from '../src/string-to-int.js';  // .js not .ts
```

**Barrel Exports**: Use barrel exports in `src/index.ts` for public API
```typescript
export * from './my-codec'  // No file extension for barrel exports
```

### TypeScript Types

**Explicit Type Annotations**: Always annotate function parameters and return types
```typescript
// Good
export const coder = {
  decode: (value: string): number => parseInt(value, 10),
  encode: (value: number): string => value.toString(),
}

// Bad - missing explicit types
export const coder = {
  decode: (value) => parseInt(value, 10),
  encode: (value) => value.toString(),
}
```

**Strict Mode**: Project uses strict TypeScript settings:
- `strict: true` (all strict checks enabled)
- `noUncheckedIndexedAccess: true` (array access returns `T | undefined`)
- `exactOptionalPropertyTypes: true` (distinguishes undefined from missing)

**Type Inference**: Let TypeScript infer variable types from initialization
```typescript
const result = myCodec.parse('42');  // Type inferred from parse()
```

**Type Narrowing in Tests**: Use success checks for type narrowing
```typescript
const result = codec.safeParse('value');
expect(result.success).toBe(true);
if (result.success) {
  expect(result.data).toBe(expected);  // Type narrowed to success case
}
```

### Naming Conventions

**Files**: `kebab-case.ts`
- Source: `my-codec.ts`
- Tests: `my-codec.test.ts`

**Variables/Constants**: `camelCase`
```typescript
export const myCodecCoder = { ... }
export const myCodec = z.codec(...)
```

**Functions**: `camelCase`
```typescript
function parseValue(input: string): number { ... }
```

**Test Descriptions**: Use descriptive 'should' format
```typescript
describe('myCodec', () => {
  describe('parse - valid cases', () => {
    it('should parse valid input correctly', () => {
      // test
    })
  })

  describe('safeParse - invalid cases', () => {
    it('should return error for invalid input', () => {
      // test
    })
  })
})
```

### Error Handling

**In Source Code**: Rely on Zod's built-in validation, define schemas declaratively
```typescript
export const stringToInt = z.codec(
  z.string().regex(/^-?\d+$/),  // Input validation
  z.number().int(),              // Output validation
  coder,
)
```

**In Tests**: Use appropriate assertion methods
```typescript
// For expected errors
expect(() => codec.parse('invalid')).toThrow();

// For graceful error handling
const result = codec.safeParse('invalid');
expect(result.success).toBe(false);
```

**Philosophy**:
- Use `parse()` when errors should throw (fail fast)
- Use `safeParse()` when errors are expected (graceful handling)
- Avoid try-catch blocks, leverage Zod's error system

## Project Structure

```
zod-codecs/
├── src/                  # Source code (TypeScript)
│   ├── index.ts          # Barrel exports (public API)
│   └── *.ts              # Codec implementations
├── tests/                # Test files
│   └── *.test.ts         # Vitest test files
├── dist/                 # Build output (gitignored)
│   ├── index.js          # ESM bundle
│   ├── index.cjs         # CommonJS bundle
│   └── index.d.ts        # TypeScript declarations
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── rollup.config.js      # Rollup bundler config
└── vitest.config.ts      # Vitest test config
```

## Codec Implementation Pattern

When creating new codecs, follow this pattern:

```typescript
import { z } from 'zod';

// 1. Define the coder with explicit types
export const myCodecCoder = {
  decode: (value: InputType): OutputType => {
    // transformation logic
  },
  encode: (value: OutputType): InputType => {
    // reverse transformation logic
  },
}

// 2. Create codec with input schema, output schema, and coder
export const myCodec = z.codec(
  z.inputSchema(),   // Input validation
  z.outputSchema(),  // Output validation
  myCodecCoder,
)
```

## Notes for Agents

1. **Always run type checking** before committing: `npm run typecheck`
2. **Add comprehensive tests** for both valid and invalid cases
3. **Export new codecs** through `src/index.ts` barrel export
4. **Keep codecs focused**: Each codec should do one transformation well
5. **Document edge cases** in test descriptions
6. **Maintain dual module support**: Code must work in both ESM and CJS environments
