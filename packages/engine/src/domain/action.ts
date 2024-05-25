import { Grid, Tile, TileBuilding } from './grid';
import _ from 'lodash';
import { asPlayerKey } from './player';

// prevent error
export const santizeAction = () => {};

export enum ActionType {
  Build = 'build',
  Move = 'move',
}

export type Action = {
  i: number;
  j: number;
  payload: any;
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
    return { i: 0, j: 0 };
  }

  return null;
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
    payload: {
      owner: playerKey,
      building: TileBuilding.City,
    },
  };
};

export const applyAction = (grid: Grid, action?: Action) => {
  if (!action) {
    return grid;
  }

  const { i, j, payload } = action;
  console.log('apply action', i, j);
  grid[i]![j] = {
    i,
    j,
    ...grid[i]![j],
    ...payload,
  };

  return grid;
};
