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
      playerKey: 'player-1',
      nextTurnCount: 5,
      gameState,
    });

    expect(!!result.match(/This is turn 3/)).toBe(true);
  });

  test('#createCollabConfirmationPrompt', async () => {
    const game = await createGameState(gameSeedFixture, 3);
    const gameState = game.getSnapshot().context;
    const prompt = createCollabConfirmationPrompt({
      playerKey: 'player-1',
      playerKeys: ['player-4', 'player-2', 'player-3'],
      gameState,
    });

    console.log('prompt', prompt);

    expect(!!prompt.match(/Current Game/)).toEqual(true);
  });
});
