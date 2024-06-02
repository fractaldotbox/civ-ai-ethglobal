import { beforeEach, describe, expect, test } from 'vitest';
import {
  createBuildActionsPrompt,
  createCollaborateConfirmationPrompt,
} from './prompt';
import { createGameState, gameSeedFixture } from './game-state.fixture';

describe.only('prompt', () => {
  test('#createBuildActionsPrompt', async () => {
    const game = await createGameState(gameSeedFixture, 3);

    const gameState = game.getSnapshot().context;
    const result = createBuildActionsPrompt({
      nextTurnCount: 5,
      gameState,
    });

    expect(!!result.match(/This is turn 3/)).toBe(true);
  });

  test('#createCollaborateConfirmationPrompt', async () => {
    const game = await createGameState(gameSeedFixture, 3);
    const gameState = game.getSnapshot().context;
    const prompt = createCollaborateConfirmationPrompt({
      collaboratePlayerKey: 'player-2',
      gameState,
    });

    console.log('prompt', prompt);

    expect(!!prompt.match(/Current Game/)).toEqual(true);
  });
});
