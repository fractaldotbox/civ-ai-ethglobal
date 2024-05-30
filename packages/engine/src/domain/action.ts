import { Grid, Tile, TileBuilding } from './grid';
import _ from 'lodash';
import { asPlayerKey } from './player';
import { findNPrimes } from './prime';

import PQueue from 'p-queue';
// prevent error
export const santizeAction = () => {};

export enum ActionType {
  Build = 'build',
  Research = 'research',
  Nuclear = 'nuclear',
}

export type Action = {
  i?: number;
  j?: number;
  payload: any;
  playerKey: string;
  type: ActionType;
};

export const findAdjacentEmptyTile = (
  grid: Grid,
  predicateStart: (tile: Tile) => boolean,
) => {
  const predicate = (tile: Tile) => {
    return !tile.owner;
  };

  return findAdjacentTile(grid, predicateStart, predicate);
};

// set hard rules only, leave ai for search optimization
export const findAdjacentTile = (
  grid: Grid,
  predicateStart: (x: Tile) => boolean,
  predicate: (x: Tile) => boolean,
) => {
  // itereate from the edge of grid and stop at first non empty, then BFS
  const rows = grid.length;
  const cols = grid[0]!.length;

  const di = [-1, 0, 1, 0];
  const dj = [0, 1, 0, -1];

  const visited = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(false)) as boolean[][];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (predicateStart(grid[i]![j])) {
        // assuming non-null represents a non-empty cell
        // BFS from the non-empty cell
        const queue = [{ i, j }];
        visited[i]![j] = true;

        while (queue.length > 0) {
          const { i, j } = queue.shift()!;

          for (let k = 0; k < di.length; k++) {
            const ni = i + di[k]!;
            const nj = j + dj[k]!;

            if (
              ni >= 0 &&
              ni < rows &&
              nj >= 0 &&
              nj < cols &&
              !visited[ni]![nj]
            ) {
              visited[ni]![nj] = true;

              if (predicate(grid[ni]![nj])) {
                return { i: ni, j: nj };
              } else {
                queue.push({ i: ni, j: nj });
              }
            }
          }
        }
      }
    }
  }

  if (_.flatten(visited).every((isVisited: boolean) => !isVisited)) {
    console.log('visited all');
    return { i: 0, j: 0 };
  }

  return null;
};

export const createNuclearAction = (
  grid: Grid,
  playerKey: string,
  oppnentPlayerKey: string,
): Action => {
  // const tile = findAdjacentEmptyTile(grid, (tile) => tile.owner === playerKey);

  // TODO find oppnent tile

  const tile = {
    i: _.random(0, grid.length - 1),
    j: _.random(0, grid.length - 1),
  };

  const { i, j } = tile;
  return {
    type: ActionType.Nuclear,
    i,
    j,
    playerKey,
    payload: {
      // owner: playerKey,
      resourceByType: {},
      building: TileBuilding.Nuclear,
    },
  };
};
export const createBuildAction = (grid: Grid, playerKey: string): Action => {
  const tile = findAdjacentEmptyTile(grid, (tile) => tile.owner === playerKey);

  if (!tile) {
    console.log('createBuildAction missing tile');
    return;
  }
  const { i, j } = tile;
  return {
    type: ActionType.Build,
    i,
    j,
    playerKey,
    payload: {
      owner: playerKey,
      building: TileBuilding.City,
    },
  };
};

// consume more = make more sense?
// smaller job = faster iterations

// interval = 1e2
export const createResearchAction = (
  resourceCount: number,
  playerKey: string,
): Action => {
  return {
    type: ActionType.Research,
    playerKey,
    payload: {
      n: resourceCount * 1e2,
    },
  };
};

export const actionStrategySync = {
  [ActionType.Build]: (grid: Grid, action?: Action) => {
    const { i, j, payload } = action;
    grid[i]![j] = {
      i,
      j,
      ...grid[i]![j],
      ...payload,
    };
    return grid;
  },
  [ActionType.Nuclear]: (grid: Grid, action?: Action) => {
    const { i, j, payload } = action;
    grid[i]![j] = {
      i,
      j,
      ...grid[i]![j],
      ...payload,
    };
    return grid;
  },
};

export const actionStrategyAsync = {
  [ActionType.Research]: async (grid: Grid, action?: Action) => {
    if (!action) {
      return;
    }
    const {
      playerKey,
      payload: { n },
    } = action;

    console.log('playerKey, research', n);

    // TODO iterate start
    const { results: primes } = await findNPrimes(n, n % 100);

    console.log('playerKey, research done', primes);

    return {
      primes,
    };
    // do not await
  },
};

export const applySyncAction = (grid: Grid, action?: Action) => {
  if (!action) {
    return { grid };
  }

  const { type } = action;

  console.log('apply action', action.type);
  return {
    grid: actionStrategySync[type as ActionType.Build](grid, action),
  };
};

const queue = new PQueue({ concurrency: 1 });

// Do not change the grid as eventually consistency
export const applyAsyncAction = async (grid: Grid, action?: Action) => {
  if (!action) {
    return { grid };
  }

  const { type } = action;

  const results = await queue.add(async () => {
    return actionStrategyAsync[type as ActionType.Research](grid, action);
  });

  return {
    results,
  };
};
