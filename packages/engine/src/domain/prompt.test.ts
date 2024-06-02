import { beforeEach, describe, expect, test } from 'vitest';
import {
  createNextActionsPrompt,
  createCollabConfirmationPrompt,
} from './prompt';
import { createGameState, gameSeedFixture } from './game-state.fixture';

describe('prompt', () => {
  test('#createNextActionsPrompt', async () => {
    const game = await createGameState(gameSeedFixture, 3);

    const gameState = game.getSnapshot().context;
    const result = createNextActionsPrompt({
      nextTurnCount: 5,
      gameState,
    });

    expect(!!result.match(/This is turn 3/)).toBe(true);
  });

  test('#createCollabConfirmationPrompt', async () => {
    const game = await createGameState(gameSeedFixture, 3);
    const gameState = game.getSnapshot().context;
    const prompt = createCollabConfirmationPrompt({
      collabPlayerKey: 'player-2',
      gameState,
    });

    console.log('prompt', prompt);

    expect(!!prompt.match(/Current Game/)).toEqual(true);
  });
});
