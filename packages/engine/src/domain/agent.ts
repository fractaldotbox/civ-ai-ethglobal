import { createBuildAction, createNuclearAction } from './action';
import { Grid, TileResource } from './grid';
import { pickRandomPlayer } from './player';

// interface for easily replaceable with actionable for debug
export const createDummyAgent = () => {
  return {
    deriveSyncActions: (
      grid: Grid,
      playerKey: string,
      scoreByResource: any,
    ) => {
      console.log('dummy ai send');

      const energy = scoreByResource[TileResource.Energy];

      const isNuclear = Math.random() > 0.5;

      const buildAction = createBuildAction(grid, playerKey);

      const oppnentPlayerKey = pickRandomPlayer(3);
      const nuclearAction = createNuclearAction(
        grid,
        playerKey,
        oppnentPlayerKey,
      );

      return [isNuclear ? nuclearAction : buildAction];
    },

    deriveCollab: (playerKey: string) => {},
  };
};
