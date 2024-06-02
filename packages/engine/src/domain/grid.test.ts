import _ from 'lodash';
import { describe, expect, test } from 'vitest';
import {
  generateEmptyGrid,
  generateRandomGrid,
  GameSeed,
  TileResource,
  TileBuilding,
  encodedGrid,
} from './grid';

describe('Grid', () => {
  test('should generate an empty grid', () => {
    const rowSize = 5;
    const columnSize = 5;
    const grid = generateEmptyGrid(rowSize, columnSize);
    expect(grid.length).toBe(columnSize);
    grid.forEach((row) => {
      expect(row.length).toBe(rowSize);
      row.forEach((cell) => {
        expect(cell?.resourceByType).toEqual({});
      });
    });
  });

  //   TODO replace _.shuffle that accept determinsitc seed / e.g. with seedrandom
  test('should randomize grid', () => {
    const gameSeed: GameSeed = {
      rowSize: 10,
      columnSize: 10,
      playerCount: 2,
      tileResourceMax: 3,
      tileByType: {
        [TileResource.Energy]: {
          total: 25,
        },
        [TileResource.Science]: {
          total: 25,
        },
      },
    };
    const grid = generateRandomGrid(gameSeed);
    expect(grid.length).toBe(gameSeed.rowSize);

    // TODO check resource assigned

    grid[0][0].building = TileBuilding.City;

    grid[0][0].resourceByType[TileResource.Energy] = 3;
    grid[0][0].owner = 'player-1';

    const encoded = encodedGrid(grid);
    expect(encoded[0]).toEqual('i:0j:0o:player-1r:science-1,energy-3');
    // expect(_.every(grid[0], (row:any)=>_.sum(_.values(row?.resourceByType)) < 5* gameSeed.rowSize)).toBe(true);
    // expect(_.every(grid[0], (row:any)=>_.every(row, i => i.resourceByType < gameSeed.tileResourceMax))).toBe(true);
  });
});
