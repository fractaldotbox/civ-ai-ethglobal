import { createActor } from 'xstate';
import { TileResource } from './grid';
import { createGameMachine } from './game-state';
import _ from 'lodash';

export const gameSeedFixture = {
  rowSize: 10,
  columnSize: 10,
  playerCount: 3,
  tileResourceMax: 3,
  tileByType: {
    [TileResource.Energy]: {
      total: 100,
    },
    [TileResource.Science]: {
      total: 100,
    },
  },
};

export const createGameState = async (gameSeed: any, turn: number) => {
  const game = createActor(createGameMachine(gameSeed));

  game.start();

  await Promise.all(
    _.range(0, turn * 3).map(async () => {
      // await game.send({ type: 'DRAW' });
      await game.send({ type: 'NEXT' });
    }),
  );

  return game;
};
