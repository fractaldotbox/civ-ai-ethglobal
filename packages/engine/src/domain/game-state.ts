/**
 *
 * Consider
 *
 * each country is an actor
 * Aggregate all data from actors and apply to grid
 *
 * Each turn trigger state transition
 *
 *
 */

import { createMachine, assign, sendParent } from 'xstate';
import {
  GameSeed,
  Grid,
  TileBuilding,
  TileResource,
  generateEmptyGrid,
  generateRandomGrid,
} from './grid';
import {
  Action,
  ActionType,
  applyAsyncAction,
  applySyncAction,
  createBuildAction,
  createResearchAction,
} from './action';
import { asPlayerIndex, asPlayerKey } from './player';
import { calculateScoreByPlayer } from './scorer';
import { LogEvent } from './log';

export type GameState = {
  logs: LogEvent[];
  currentTurnMetadata: {
    turn: number;
    playerKey: string;
  };
  scoreByPlayerKey: Record<string, { [k in TileResource]: number }>;
  scoreCurrentTurnByPlayerKey: Record<string, { [k in TileResource]: number }>;
  players: any[];
  grid: Grid;
  deck: number[];
};

export type Card = {
  name: 'a';
};
// Define the structure of the deck and the function to draw cards
const deck = Array(52)
  .fill(null)
  .map((_, i) => i + 1);

// model ownership of tiles at game for easier source of truth

// pop up player actions onto game states

// Define the state machine for a player
export const playerMachine = createMachine(
  {
    id: 'player',
    initial: 'waiting',
    context: {
      currentTurnMetadata: {} as any,
      playerKey: '',
      playerActions: [] as any[],
      hand: [] as Card[],
    },
    states: {
      waiting: {
        entry: 'startPlayer',
        on: {
          DRAW: {
            target: 'playing',
            actions: assign({
              hand: ({ context, event }) => [...context.hand, ...event.cards],
              playerActions: ({ context, event, self }) => {
                console.log('playerActions', event);
                const { id: playerKey } = self;
                const { grid, currentTurnMetadata } = event;

                const playerId = playerKey.split('-')[1];

                context.currentTurnMetadata = currentTurnMetadata;
                // update turn

                const { turn } = context.currentTurnMetadata;

                console.log('turn', turn);

                const playerIndex = asPlayerIndex(playerKey);

                // TODO math random offset for balance

                const isResearchTurn = ((turn % 3) as number) === playerIndex;

                const buildAction = createBuildAction(grid, playerKey);
                console.log('research-turn', playerKey, playerIndex, turn % 3);
                if (isResearchTurn) {
                  const researchAction = createResearchAction(turn, playerKey);
                  return [buildAction, researchAction];
                }
                return [buildAction];

                console.log(playerKey + ' action');
              },
            }),
          },
        },
      },
      playing: {
        entry: ['takeAction', 'takeResearchAction'],
        always: 'waiting',
      },
      done: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      startPlayer: ({ context, self }) => {
        console.log('startPlayer');
      },
      takeAction: sendParent(({ context }) => ({
        type: 'playerAction',
        data: {
          playerAction: context.playerActions[0],
        },
      })),
      takeResearchAction: sendParent(({ context }) => {
        console.log('research', context.currentTurnMetadata);

        const playerAction = context.playerActions[1];
        if (playerAction) {
          return {
            type: 'playerAction',
            data: {
              playerAction,
            },
          };
        }

        return {
          type: 'empty',
          data: {},
        };
      }),
    },
  },
);

const playerEntry =
  (id: number) =>
  ({ context }: { context: any }) => {
    console.log('player entry', id);
    context.currentTurnMetadata.playerKey = asPlayerKey(id);

    // only if not exists
    // const player = createActor(playerMachine);
    // context.players.push(player);
    // player.start();
  };

const createSendToPlayer =
  (playerIndex: number) =>
  async ({ context }: { context: any }) => {
    const { grid } = context;
    console.log('sendToPlayer' + playerIndex);
    await context.players[playerIndex - 1].send({
      type: 'DRAW',
      cards: context.deck.slice(0, 3),
      grid,
      currentTurnMetadata: context.currentTurnMetadata,
    });
  };

const createByPlayerKey = (playerCount: number) => {
  return Object.fromEntries(
    Array.from({ length: playerCount }, (_, i) => {
      return [asPlayerKey(i + 1), {}];
    }),
  );
};

// Define the state machine for the game
export const createGameMachine = (gameSeed: GameSeed) =>
  createMachine(
    {
      id: 'game',
      initial: 'start',
      context: {
        logs: [],
        currentTurnMetadata: {
          turn: 0,
          playerKey: '',
        },
        players: [] as any[],
        scoreByPlayerKey: createByPlayerKey(gameSeed.playerCount),
        scoreCurrentTurnByPlayerKey: createByPlayerKey(gameSeed.playerCount),
        grid: generateRandomGrid(gameSeed),
        deck,
      } as GameState,
      on: {
        emitLog: {
          actions: assign(({ context, event }): any => {
            context.logs.unshift({
              action: event.action,
            });
          }),
        },
        playerAction: {
          actions: assign(async ({ context, event, self }): any => {
            console.log('player trigger parent action', JSON.stringify(event));
            const {
              data: { playerAction },
            } = event;
            self.send({ type: 'emitLog', action: playerAction });

            if (playerAction.type === ActionType.Build) {
              const { grid } = applySyncAction(context.grid, playerAction)!;
              context.grid = grid;
            }

            if (playerAction.type === ActionType.Research) {
              const { results } = await applyAsyncAction(
                context.grid,
                playerAction,
              )!;

              console.log('Research completed', results);
              // add to chart
              // self.send({ type: 'emitLog', action: playerAction });
            }

            //  emit
          }),
        },
      },
      entry: [
        assign({
          players: ({ spawn }) => [
            spawn(playerMachine, { id: asPlayerKey(1) }),
            spawn(playerMachine, { id: asPlayerKey(2) }),
            spawn(playerMachine, { id: asPlayerKey(3) }),
          ],
        }),
      ],
      states: {
        start: {
          entry: ['wrapUpTurn'],
          always: 'player1',
        },
        player1: {
          entry: [playerEntry(1), 'drawCards', createSendToPlayer(1)],
          on: {
            NEXT: 'player2',
          },
        },
        player2: {
          entry: [playerEntry(2), 'drawCards', createSendToPlayer(2)],
          on: {
            NEXT: 'player3',
          },
        },
        player3: {
          entry: [playerEntry(3), 'drawCards', createSendToPlayer(3)],
          on: {
            NEXT: 'endTurn',
          },
        },
        endTurn: {
          entry: ['wrapUpTurn'],

          always: 'player1',
        },
      },
    },
    {
      actions: {
        drawCards: assign({
          deck: ({ context }) => context.deck.slice(3),
        }),

        wrapUpTurn: ({ context }) => {
          console.log('wrap up turn', context);

          const { grid } = context;
          const { scoreByPlayerKey, scoreCurrentTurnByPlayerKey } =
            calculateScoreByPlayer(grid, context.scoreByPlayerKey);

          context.scoreByPlayerKey = scoreByPlayerKey;
          context.scoreCurrentTurnByPlayerKey = scoreCurrentTurnByPlayerKey;
          context.currentTurnMetadata.turn =
            context.currentTurnMetadata.turn + 1;
        },
      },
    },
  );
