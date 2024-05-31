import { beforeEach, describe, expect, test } from 'vitest';
import { createActor, assign } from 'xstate';
import { TileResource, generateEmptyGrid } from './grid';
import {
  calculateScoreByPlayer,
  calculateScoreCurrentTurnByPlayerKey,
} from './scorer';
import { asPlayerKey } from './player';

describe('scorer', () => {
  const rowSize = 5;
  const columnSize = 5;

  let grid;
  const playerKeys = [1, 2, 3].map(asPlayerKey);

  const expectedScoreCurrentTurnByPlayerKey = {
    [asPlayerKey(1)]: {
      science: 3,
      food: 4,
    },
    [asPlayerKey(2)]: {
      science: 2,
      food: 0,
    },
    [asPlayerKey(3)]: {
      science: 0,
      food: 0,
    },
  };

  beforeEach(() => {
    grid = generateEmptyGrid(rowSize, columnSize);
    grid[0][0] = {
      ...grid[0][0],
      owner: 'player-1',
      resourceByType: {
        [TileResource.Energy]: 2,
      },
    };
    grid[0][1] = {
      ...grid[0][0],
      owner: 'player-1',
      resourceByType: {
        [TileResource.Science]: 3,
      },
    };
    grid[1][3] = {
      ...grid[0][0],
      owner: 'player-1',
      resourceByType: {
        [TileResource.Energy]: 2,
      },
    };
    grid[1][2] = {
      ...grid[0][0],
      owner: 'player-2',
      resourceByType: {
        [TileResource.Science]: 2,
      },
    };
  });

  test('#calculateScoreCurrentTurnByPlayerKey', () => {
    const scoreByResourceByPlayerKey = calculateScoreCurrentTurnByPlayerKey(
      grid,
      playerKeys,
    );

    expect(scoreByResourceByPlayerKey).toEqual(
      expectedScoreCurrentTurnByPlayerKey,
    );
  });
  test('score by players', () => {
    const { scoreByResourceByPlayerKey, scoreCurrentTurnByPlayerKey } =
      calculateScoreByPlayer(grid, {
        [asPlayerKey(1)]: {
          science: 1,
          food: 1,
        },
        [asPlayerKey(2)]: {
          science: 2,
          food: 2,
        },
        [asPlayerKey(3)]: {
          science: 3,
          food: 3,
        },
      });

    expect(scoreCurrentTurnByPlayerKey).toEqual(
      expectedScoreCurrentTurnByPlayerKey,
    );

    expect(scoreByResourceByPlayerKey).toEqual({
      [asPlayerKey(1)]: {
        food: 5,
        science: 4,
      },
      [asPlayerKey(2)]: {
        food: 2,
        science: 4,
      },
      [asPlayerKey(3)]: {
        food: 3,
        science: 3,
      },
    });
  });
});
