import { beforeEach, describe, expect, test } from 'vitest';
import { createPrompt } from './prompt';

describe('createPrompt', () => {
  test('should return the correct prompt message', () => {
    // TODO fixture
    const gameState = {};
    const result = createPrompt({
      currentTurn: 0,
      gameState,
    });

    expect(result).toBe('');
  });
});
