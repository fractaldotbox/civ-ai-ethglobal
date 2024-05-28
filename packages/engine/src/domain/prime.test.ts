import { describe, expect, test } from 'vitest';
import { findNPrimes } from './prime';

describe(
  'prime api',
  () => {
    test.only('#findNPrimes', async () => {
      const result = await findNPrimes(100);
      const { output } = result;
      expect(parseInt(output)).toEqual([
        '2',
        '3',
        '5',
        '7',
        '11',
        '13',
        '17',
        '19',
        '23',
        '29',
        '31',
        '37',
        '41',
        '43',
        '47',
        '53',
        '59',
        '61',
        '67',
        '71',
        '73',
        '79',
        '83',
        '89',
        '97',
      ]);
    });
    test.only('#findNthPrimes', async () => {
      const result = await findNPrimes(1e10);
      const { output } = result;
      expect(parseInt(output)).toEqual(455052511);
    });
  },
  60 * 1000,
);
