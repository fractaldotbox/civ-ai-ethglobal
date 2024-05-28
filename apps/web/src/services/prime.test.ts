import { describe, expect, test } from 'vitest';
import { findNPrimes } from './prime';

describe('prime api', () => {
  test('#findNPrimes', async () => {
    const result = await findNPrimes(100);
    expect(result).toEqual(5);
  });
});
