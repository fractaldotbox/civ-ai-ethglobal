import { GameState } from './game-state';

export const createBuildActionsPrompt = ({
  nextTurnCount,
  gameState,
}: {
  nextTurnCount: number;
  gameState: GameState;
}) => {
  const { currentTurnMetadata } = gameState;
  const { turn } = currentTurnMetadata;
  return `
This is turn ${turn}. Generate actions for next ${nextTurnCount} turns.

Give your reponse in json format where explanations is embeded in it {'actions':[ [ // action of turn 1 ], [ // action of turn 2]  ], 'explanations': 'My strategy is...' }

Current Game State:  ${JSON.stringify(gameState)}

 `;
};

export const createCollabConfirmationPrompt = ({
  collabPlayerKey,
  gameState,
}: {
  collabPlayerKey: string;
  gameState: GameState;
}) => {
  const { currentTurnMetadata } = gameState;
  const { turn } = currentTurnMetadata;
  return `
This is turn ${turn}.

You are assigned ${collabPlayerKey} and you can decide whether you will collaborate with that player on research or not.
Recap both of you will spend 10 science, to research for project where results is split equally.

Give your reponse in json format where explanations is embeded in it {'isCollaborate': true, 'explanations': 'My strategy is...' }

Current Game State:  ${JSON.stringify(gameState)}

 `;
};
