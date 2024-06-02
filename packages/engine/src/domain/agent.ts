import { create } from 'lodash';
import {
  actionStrategyAsync,
  createBuildAction,
  createNuclearAction,
} from './action';
import { getAgentClient, getAgentContract } from './agent-on-chain';
import { GameState } from './game-state';
import { Grid, TileResource } from './grid';
import { pickRandomPlayer } from './player';
import { createNextActionsPrompt } from './prompt';

export interface Agent {
  deriveSyncActions: (gameState: GameState) => {
    actionStrategyAsync: any[];
  };
  // derive
}

// interface for easily replaceable with actionable for debug
export const createDummyAgent = (playerKey: string) => {
  return {
    deriveSyncActions: (gameState: GameState) => {
      console.log('dummy ai send', playerKey);

      const { grid, scoreByResourceByPlayerKey, researchCountByPlayerKey } =
        gameState;

      const scoreByResource = scoreByResourceByPlayerKey?.[playerKey];
      // const energy = scoreByResource[TileResource.Energy];

      console.log(
        'researchCountByPlayerKey',
        researchCountByPlayerKey?.[playerKey],
      );

      const isUnlocked = researchCountByPlayerKey?.[playerKey] >= 2;

      const isNuclear = isUnlocked && Math.random() > 0.5;

      const buildAction = createBuildAction(grid, playerKey);

      const oppnentPlayerKey = pickRandomPlayer(3);
      const nuclearAction = createNuclearAction(
        grid,
        playerKey,
        oppnentPlayerKey,
      );

      return [isNuclear ? nuclearAction : buildAction];
    },
  };
};

export const createAgent = async (playerKey: string, address: string) => {
  const client = await getAgentClient(address);

  let actions = [];

  return {
    deriveNextActions: async (gameState: GameState) => {
      const { grid, scoreByResourceByPlayerKey } = gameState;

      const scoreByResource = scoreByResourceByPlayerKey[playerKey];

      const prompt = createNextActionsPrompt({
        gameState,
        nextTurnCount: 5,
      });
      const results = await client.chat(prompt);

      console.log('deriveNextActions', results);
      // console.log('runId', runId);
      // const messages = await client.getMessageHistoryContents(runId);

      // console.log('messages', messages);

      return results;
    },

    deriveSyncActions: (gameState: GameState) => {
      console.log('gameState', gameState);
      const { grid, scoreByResourceByPlayerKey } = gameState;

      const scoreByResource = scoreByResourceByPlayerKey[playerKey];
    },
  };
};

// store history per run id in game state for easier retrieve

// run 1 Turn=0 init

// run 2 Turn=5  1st 5 actions

// run 3 Turn=10  2nd 5 actions

// run 4 Turn=10  Collab?

// run 4 Turn=15  3rd 5 actions

// export const createPromptsByRunId = () => {
//   return {
//     0: [createNextActionsPrompt],
//     1: [createNextActionsPrompt],
//     2: [createNextActionsPrompt],
//     3: [createNextActionsPrompt],
//   };
// };
