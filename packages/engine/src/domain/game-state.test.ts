import { describe, expect, test } from 'vitest';

import { createActor, assign } from 'xstate';
import { playerMachine, createGameMachine } from './game-state';
import { TileBuilding, TileResource } from './grid';
import { createGameState, gameSeedFixture } from './game-state.fixture';

describe('Game State Machine', () => {
  // test('playerMachine', ()=>{

  //     const player = createActor(playerMachine);

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
      const snapshot = player.getSnapshot();
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
});
