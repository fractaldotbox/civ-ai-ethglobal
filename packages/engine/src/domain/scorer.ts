import _ from 'lodash';
import { Grid, Tile, TileResource } from './grid';
import { asPlayerKey } from './player';

export const sumScore = (currentScoreByPlayer: any) => {};

export const calculateScoreCurrentTurnByPlayerKey = (
  grid: Grid,
  playerKeys: string[],
) => {
  const acc = Object.fromEntries(
    playerKeys.map((playerKey) => [
      playerKey,
      {
        [TileResource.Energy]: 0,
        [TileResource.Science]: 0,
      },
    ]),
  );

  return grid.flat().reduce((acc: any, tile: Tile) => {
    if (tile.owner) {
      const { resourceByType } = tile as {
        resourceByType: Record<TileResource, number>;
      };

      _.keys(resourceByType).forEach((resourceType: TileResource) => {
        acc[tile.owner][resourceType] += resourceByType[resourceType] || 0;
      });
    }
    return acc;
  }, acc);
};

function zipObjectsSum(
  obj1: Record<string, number>,
  obj2: Record<string, number>,
): Record<string, number> {
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  return Array.from(allKeys).reduce(
    (acc: Record<string, number>, key: string) => {
      acc[key] = (obj1[key] || 0) + (obj2[key] || 0);
      return acc;
    },
    {},
  );
}

// TODO ensure immutable
export const calculateScoreByPlayer = (
  grid: Grid,
  currentscoreByResourceByPlayerKey: Record<string, any>,
) => {
  const playerKeys = Object.keys(currentscoreByResourceByPlayerKey);
  const scoreCurrentTurnByPlayerKey = calculateScoreCurrentTurnByPlayerKey(
    grid,
    playerKeys,
  );
  // iterate score to see anyone become winner

  const scoreByResourceByPlayerKey: Record<
    string,
    Record<TileResource, number>
  > = Object.fromEntries(
    playerKeys.map((playerKey: string) => {
      return [
        playerKey,
        zipObjectsSum(
          currentscoreByResourceByPlayerKey[playerKey],
          scoreCurrentTurnByPlayerKey[playerKey],
        ),
      ];
    }),
  );

  return {
    scoreByResourceByPlayerKey,
    scoreCurrentTurnByPlayerKey,
  };
};
