import { describe, expect, test } from 'vitest';
import { createAgent } from './agent';
import { createGameState, gameSeedFixture } from './game-state.fixture';

describe.only('agent', () => {
  test('#createAgent and chat', async () => {
    const game = await createGameState(gameSeedFixture, 3);
    const gameState = game.getSnapshot().context;

    const address = '0xfA48970C65616d91891A2E0e33D17F0e7189c5D8';
    const playerKey = 'player-1';
    const agent = await createAgent(playerKey, address);
    const results = await agent.deriveNextActions(gameState);
    // const results = await agent.

    console.log('results', results);

    expect(results.messages.length).toEqual(2);
  });
});
