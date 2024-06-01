import _ from 'lodash';

export type Tile = {
  i: number;
  j: number;
  building?: TileBuilding;
  owner?: string;
  resourceByType: Record<TileResource, number> | {};
};

export type Grid = Tile[][];

export enum TileResource {
  Energy = 'energy',
  // Locked
  Science = 'science',
  Productivity = 'productivity',
  Research = 'research',
}

export enum TileWeatherStation {
  SolarPanel = 'solarPanel',
  WindTurbine = 'windTurbine',
}

export enum TileBuilding {
  Hq = 'hq',
  City = 'city',
  Farm = 'farm',
  Lab = 'lab',
  SolarPanel = 'solar-panel',
  Nuclear = 'nuclear',
}

export const LABEL_BY_TILE_BUILDING = {
  // 🌆

  [TileBuilding.Hq]: '👑',

  [TileBuilding.City]: '🏢',
  // 🌾👨‍🌾🥕
  [TileBuilding.Farm]: '🌱',
  // ⚡🛰️
  [TileBuilding.SolarPanel]: '☀️',

  [TileBuilding.Nuclear]: '☢️',
  //
  [TileBuilding.Lab]: '🔬',
};

export const LABEL_BY_TILE_RESOURCE = {
  [TileResource.Energy]: '⚡',
  [TileResource.Science]: '🧪',
  [TileResource.Research]: '🔬',
  // [TileResource.Productivity]: '⚙️',
};

export const generateEmptyGrid = (rowSize: number, columnSize: number) =>
  Array(columnSize)
    .fill(null)
    .map(() =>
      Array(rowSize)
        .fill(null)
        .map(() => ({
          resourceByType: {} as Record<TileResource, number>,
        })),
    ) as Grid;

/**
 * Distribute and exhaustive on the tiles
 * input is shuffle
 *
 *
 */
export const genearteGridWithNonOverlappingTiles = (
  rowSize: number,
  columnSize: number,
  inputTiles: Partial<Tile>[],
) => {
  const nonOverlappingTiles = [...inputTiles];

  const fillerTiles = Array(
    rowSize * columnSize - nonOverlappingTiles.length,
  ).fill(null);

  const tiles = _.shuffle([...nonOverlappingTiles, ...fillerTiles]);

  let grid = [] as any;
  for (let i = 0; i < rowSize; i++) {
    grid[i] = Array(i * columnSize).fill(null);
    for (let j = 0; j < columnSize; j++) {
      const tile = tiles.pop();
      if (tile) {
        grid[i][j] = {
          ...tile,
          owner: tile?.id,
        };
      }
    }
  }

  return grid;
};

// TODO mor generic tileMaxCountByType
// be exhaustive, so we dont simply use _.random
// simple algo apply total for all instead of individual resource
export const genearteGridWithOverlappingTiles = (
  rowSize: number,
  columnSize: number,
  tileByType: GameSeed['tileByType'],
  tileResourceMax: number,
) => {
  const resourceTiles = _.flatten(
    Object.entries(tileByType).map(([resource, { total }]) => {
      return Array(total).fill({ resource });
    }),
  );

  const fillerTiles = Array(
    rowSize * columnSize * tileResourceMax - resourceTiles.length,
  ).fill(null);

  const resources = _.shuffle([...resourceTiles, ...fillerTiles]);

  const grid = generateEmptyGrid(rowSize, columnSize);

  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < columnSize; j++) {
      const resourceOfTiles = resources.slice(
        (i + j) * tileResourceMax,
        (i + j + 1) * tileResourceMax,
      );

      resourceOfTiles.forEach((resourceOfTile?: { resource: TileResource }) => {
        const { resource } = resourceOfTile || {};
        if (resource) {
          grid[i]![j]!.resourceByType[resource] =
            (grid[i]![j]!.resourceByType[resource] || 0) + 1;
        }
      });
    }
  }

  return grid;
};

// max is by total, not by resources
export type GameSeed = {
  rowSize: number;
  columnSize: number;
  playerCount: number;
  tileResourceMax: number;
  tileByType: {
    [key in TileResource]: {
      total: number;
    };
  };
};

// TODO make it composable pipeline
export const generateRandomGrid = (gameSeed: GameSeed) => {
  const { rowSize, columnSize, playerCount, tileByType, tileResourceMax } =
    gameSeed;

  // const grid = generateEmptyGrid(rowSize, columnSize);

  // ensure no overlap

  const playerTiles = Array.from({ length: 3 }, (_, i) => {
    return {
      id: `player-${i + 1}`,
      building: TileBuilding.Hq,
    };
  });

  const nonOverlappingTiles = [...playerTiles];

  // always zip instead of generate at one-go for easier composability

  let grid = generateEmptyGrid(rowSize, columnSize);

  const playerGrid = genearteGridWithNonOverlappingTiles(
    rowSize,
    columnSize,
    nonOverlappingTiles,
  );

  const resourceGrid = genearteGridWithOverlappingTiles(
    rowSize,
    columnSize,
    tileByType,
    tileResourceMax,
  );

  // const playerGrid = genearteGridWithNonOverlappingTiles(rowSize, columnSize, playerTiles)
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < rowSize; j++) {
      grid[i]![j] = {
        ...playerGrid[i]![j]!,
        ...resourceGrid[i]![j]!,
        i,
        j,
      };
    }
  }

  if (nonOverlappingTiles.length > rowSize * columnSize) {
    throw new Error('invalid game seed: too much');
  }

  return grid;
};
