import { describe, expect, test } from 'vitest';
import { randomCell } from './cell';

describe('Weather cell', () => {
  test('should be able to get a random cell', () => {
    const cell = randomCell();
    expect(cell).toHaveProperty('id');
    expect(cell).toHaveProperty('name');
    // check if id are in the correct format
    expect(cell.id).toMatch(/^[A-Za-z0-9]*$/);
    // check if the name is a string
    expect(typeof cell.name).toBe("string")
  })
});
