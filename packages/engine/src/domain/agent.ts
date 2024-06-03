import { create } from 'lodash';
import {
  actionStrategyAsync,
  createBuildAction,
  createNuclearAction,
} from './action';
import { getAgentClient } from './agent-on-chain';
import { GameState } from './game-state';
import { Grid, TileResource } from './grid';
import { pickRandomPlayer } from './player';
import {
  createCollabConfirmationPrompt,
  createNextActionsPrompt,
} from './prompt';

import { privateKeyToAccount } from 'viem/accounts';
export interface Agent {
  deriveSyncActions: (gameState: GameState) => {
    actionStrategyAsync: any[];
  };
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

// TODO migrate to lit actions
export const masterKeyByPlayerKey = {
  'player-1': process.env.NEXT_PUBLIC_AGENT1_PRIVATE_KEY,
  'player-2': process.env.NEXT_PUBLIC_AGENT2_PRIVATE_KEY,
  'player-3': process.env.NEXT_PUBLIC_AGENT3_PRIVATE_KEY,
  'player-4': process.env.NEXT_PUBLIC_AGENT4_PRIVATE_KEY,
} as Record<string, `0x${string}`>;

export const createAgent = async (playerKey: string, address: string) => {
  const account = privateKeyToAccount(masterKeyByPlayerKey[playerKey]);

  const client = await getAgentClient(address, account);

  let actions = [];

  return {
    confirmCollab: async (gameState: GameState) => {
      const playerKeys = gameState.players.map((player) => player.playerKey);
      const prompt = createCollabConfirmationPrompt({
        playerKey,
        playerKeys,
        gameState,
      });
      const results = await client.chat(prompt);

      console.log('confirmCollab', results);

      return results;
    },
    deriveNextActions: async (gameState: GameState) => {
      const { grid, scoreByResourceByPlayerKey } = gameState;

      const scoreByResource = scoreByResourceByPlayerKey[playerKey];

      const prompt = createNextActionsPrompt({
        playerKey,
        gameState,
        nextTurnCount: 5,
      });

      const results = await client.chat(prompt);

      console.log('deriveNextActions', results);

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
