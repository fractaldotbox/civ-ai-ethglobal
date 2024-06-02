import { describe, expect, test } from 'vitest';

import { createActor, assign } from 'xstate';
import { createPlayerMachine, createGameMachine } from './game-state';
import { TileBuilding, TileResource } from './grid';
import { createGameState, gameSeedFixture } from './game-state.fixture';

describe('Game State Machine', () => {
  // test('createPlayerMachine', ()=>{

  //     const player = createActor(createPlayerMachine);

  //     player.subscribe((snapshot) => {
  //         console.log(snapshot);

  //     });
  //     player.start();

  //     player.send({ type: 'someEvent' });
  //     player.stop();
  // })
  test('should go through a turn ', async (done: any) => {
    const game = await createGameState(gameSeedFixture, 1);
    // seems enough to ensure all listeners run
    game.stop();

    const snapshot = game.getSnapshot();

    snapshot.context.players.forEach((player: any) => {
      // const snapshot = player.ref.getSnapshot();
    });

    console.log(snapshot.context);

    const { grid } = snapshot.context;

    expect(grid[0]![0]!.building).toEqual(TileBuilding.City);
    expect(grid[0]![0]!.owner).toEqual('player-1');

    // expect(game.getSnapshot().context.currentTurn).toBe(1);

    //   const service = gameMachine.start({
    //     invoke: {
    //       onEntry: [
    //         assign((context) => {
    //           originalDeckLength = context.deck.length;
    //         }),
    //       ],
    //     },
    //   });

    //   const nextState = await service.send('NEXT');

    //   if (nextState.matches('player1')) {
    //     expect(nextState.context.deck.length).toBeLessThan(originalDeckLength);
    //   }
  });

  test('build only at adjacent free tiles', () => {});

  // TODO mock the findNPrimes to avoid int test
  test.only('victory condition', async () => {
    const game = await createGameState(gameSeedFixture, 1);

    await game.send({
      type: 'researchUpdated',
      playerKey: 'player-2',
      primes: Array.from({ length: 999 }, (i) => 1),
    });

    await game.send({ type: 'NEXT' });

    await game.send({ type: 'NEXT' });

    await game.send({ type: 'NEXT' });

    await game.send({ type: 'NEXT' });

    const snapshot = game.getSnapshot();
    expect(snapshot.context.winner).toEqual('player-2');
    expect(snapshot.value).toEqual('endGame');
  });
});
