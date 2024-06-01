import { describe, expect, test } from 'vitest';
import { regionBoost } from './grid-action';
import { Grid, generateRandomGrid, TileResource, GameSeed } from './grid';

describe(
  'grid action',
  () => {
    const rowSize = 10;
    const columnSize = 10;
    const gameSeed: GameSeed = {
      rowSize: rowSize,
      columnSize: columnSize,
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

    test('# test if the solar panel are boosted under normal weather', () => {
      const boostedGrid = regionBoost({grid: grid, windSpeed: 0, solarIrradiance: 0, startRow: 0, endRow: 5});

      for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < columnSize; j++) {
          if (i % 2 === 0) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          } else {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          }
          expect(boostedGrid[i][j].resourceByType[TileResource.Science]).toBe(grid[i][j].resourceByType[TileResource.Science]);
        }
      }
    });

    test('# test if the solar panel are boosted under windy weather', () => {
      const boostedGrid = regionBoost({grid: grid, windSpeed: 5.1, solarIrradiance: 0, startRow: 0, endRow: 5});

      for (let i = 0; i < 5 ; i++) {
        for (let j = 0; j < columnSize ; j++) {
          if (i % 2 === 0 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy] * 2);
          } else {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          }
          expect(boostedGrid[i][j].resourceByType[TileResource.Science]).toBe(grid[i][j].resourceByType[TileResource.Science]);
        }
      }

      for (let i = 5; i < rowSize; i++) {
        for (let j = 0; j < columnSize; j++) {
          if (i % 2 === 0 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          } else if (i % 2 === 1 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          }
          expect(boostedGrid[i][j].resourceByType[TileResource.Science]).toBe(grid[i][j].resourceByType[TileResource.Science]);
        }
      }
    });

    test('# test if the solar panel are boosted under sunny weather', () => {
      const boostedGrid = regionBoost({grid: grid, windSpeed: 0, solarIrradiance: 501, startRow: 0, endRow: 5});

      for (let i = 0; i < 5 ; i++) {
        for (let j = 0; j < columnSize ; j++) {
          if (i % 2 === 0 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          } else if (i % 2 === 1 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy] * 2);
          }
          expect(boostedGrid[i][j].resourceByType[TileResource.Science]).toBe(grid[i][j].resourceByType[TileResource.Science]);
        }
      }

      for (let i = 5; i < rowSize; i++) {
        for (let j = 0; j < columnSize; j++) {
          if (i % 2 === 0 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          } else if (i % 2 === 1 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          }
          expect(boostedGrid[i][j].resourceByType[TileResource.Science]).toBe(grid[i][j].resourceByType[TileResource.Science]);
        }
      }
    });

    test('# test if the solar panel are boosted under windy and sunny weather', () => {
      const boostedGrid = regionBoost({grid: grid, windSpeed: 5.1, solarIrradiance: 501, startRow: 0, endRow: 5});

      for (let i = 0; i < 5 ; i++) {
        for (let j = 0; j < columnSize ; j++) {
          if (i % 2 === 0 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy] * 2);
          } else if (i % 2 === 1 && boostedGrid[i][j].resourceByType[TileResource.Energy] !== undefined) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy] * 2);
          }
          expect(boostedGrid[i][j].resourceByType[TileResource.Science]).toBe(grid[i][j].resourceByType[TileResource.Science]);
        }
      }

      for (let i = 5; i < rowSize; i++) {
        for (let j = 0; j < columnSize; j++) {
          if (i % 2 === 0) {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          } else {
            expect(boostedGrid[i][j].resourceByType[TileResource.Energy]).toBe(grid[i][j].resourceByType[TileResource.Energy]);
          }
          expect(boostedGrid[i][j].resourceByType[TileResource.Science]).toBe(grid[i][j].resourceByType[TileResource.Science]);
        }
      }
    });
  }
);
