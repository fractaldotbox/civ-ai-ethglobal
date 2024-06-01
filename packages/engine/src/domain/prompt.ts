import { GameState } from './game-state';

export const createBuildActionsPrompt = ({
  currentTurn,
  gameState,
  turns,
}: {
  currentTurn: number;
  gameState: GameState;
  turns: number;
}) => {
  return `
This is turn ${currentTurn}. Generate actions for next ${turns} turns.

Give your reponse in json format where explanations is embeded in it {'actions':[ [ // action of turn 1 ], [ // action of turn 2]  ], 'explanations': 'My strategy is...' }

Current Game State:  ${JSON.stringify(gameState)}

 `;
};

export const createCollaborateConfirmationPrompt = ({
  currentTurn,
  collaboratePlayerKey,
  gameState,
}: {
  currentTurn: number;
  collaboratePlayerKey: string;
  gameState: GameState;
}) => {
  return `
This is turn ${currentTurn}.

You are assigned ${collaboratePlayerKey} and you can decide whether you will collaborate or not.
Recap both of you will spend 10 science, to research for project where results is split equally.

Give your reponse in json format where explanations is embeded in it {'isCollaborate': true, 'explanations': 'My strategy is...' }

Current Game State:  ${JSON.stringify(gameState)}

 `;
};
