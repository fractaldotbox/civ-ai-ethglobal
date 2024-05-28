import { describe, expect, test } from 'vitest';
import { Grid, Tile, TileBuilding, generateEmptyGrid } from './grid';
import { createBuildAction, findAdjacentEmptyTile } from './action';
import { asPlayerIndex, asPlayerKey } from './player';

describe('Grid', () => {
  const defaultTile = {
    resourceByType: {},
  };

  const predicateStart = (tile: Tile) => tile.owner === 'player-1';

  test('#findAdjacentEmptyTile middle', (done: any) => {
    let grid = generateEmptyGrid(5, 5);

    grid[1]![1] = {
      ...defaultTile,
      i: 1,
      j: 1,
      owner: 'player-1',
    };

    grid[3]![3] = {
      ...defaultTile,
      i: 3,
      j: 3,
    };

    const tile = findAdjacentEmptyTile(grid, predicateStart);
    expect(tile).toEqual({ i: 0, j: 1 });
  });
  test('#findAdjacentEmptyTile edge', (done: any) => {
    let grid = generateEmptyGrid(5, 5);

    grid[4]![4] = {
      ...defaultTile,
      i: 4,
      j: 4,
      owner: 'player-1',
    };

    const tile = findAdjacentEmptyTile(grid, predicateStart);
    expect(tile).toEqual({ i: 3, j: 4 });
  });
  test('#findAdjacentEmptyTile full', (done: any) => {
    let grid = generateEmptyGrid(2, 2);

    [0, 1].forEach((i) => {
      [0, 1].forEach((j) => {
        grid[i]![j] = {
          ...defaultTile,
          owner: 'player-1',
          i,
          j,
        };
      });
    });

    const tile = findAdjacentEmptyTile(grid, predicateStart);
    expect(tile).toEqual(null);
  });

  test('#findAdjacentEmptyTile empty', (done: any) => {
    let grid = generateEmptyGrid(2, 2);

    const tile = findAdjacentEmptyTile(grid, predicateStart);
    expect(tile).toEqual({ i: 0, j: 0 });
  });

  test('execute build action', async () => {
    const grid = generateEmptyGrid(5, 5);
    grid[0]![3] = {
      ...defaultTile,
      i: 0,
      j: 0,
      owner: 'player-1',
    };
    const action = createBuildAction(grid, asPlayerKey(1));

    const { grid: gridResult } = await applyAction(grid, action);
    expect({ gridResult }[0]![4]!.building).toEqual(TileBuilding.City);
  });
});
