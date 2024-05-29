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

import { createMachine, assign, sendParent, EventObject } from 'xstate';
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
  scoreByResourceByPlayerKey: Record<string, { [k in TileResource]: number }>;
  scoreCurrentTurnByPlayerKey: Record<string, { [k in TileResource]: number }>;
  players: any[];
  grid: Grid;
  deck: number[];
  primesByPlayerKey: Record<string, number[]>;
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
      playerActions: [] as Action[],
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

                const isResearchTurn =
                  ((turn % 3) as number) + 1 === playerIndex;

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
        console.log('takeResearchAction', context);
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

const createByPlayerKey = (
  playerCount: number,
  defaultValueFactory = () => ({}),
) => {
  return Object.fromEntries(
    Array.from({ length: playerCount }, (_, i) => {
      return [asPlayerKey(i + 1), defaultValueFactory()];
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
        primesByPlayerKey: createByPlayerKey(gameSeed.playerCount, () => []),
        players: [] as any[],
        scoreByResourceByPlayerKey: createByPlayerKey(
          gameSeed.playerCount,
          () => ({
            [TileResource.Compute]: 0,
            [TileResource.Science]: 0,
          }),
        ),
        scoreCurrentTurnByPlayerKey: createByPlayerKey(
          gameSeed.playerCount,
          () => ({
            [TileResource.Compute]: 0,
            [TileResource.Science]: 0,
          }),
        ),
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
        researchUpdated: {
          actions: assign(({ context, event }): any => {
            const { playerKey, results } = event;

            console.log('research results', playerKey, results);
            // union
            results.forEach((result: any) => {
              context.primesByPlayerKey[playerKey] =
                context.primesByPlayerKey[playerKey] || [];
              context.primesByPlayerKey[playerKey].push(result);
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

            const { type, payload } = playerAction;

            if (playerAction.type === ActionType.Build) {
              const { grid } = applySyncAction(context.grid, playerAction)!;
              context.grid = grid;
            }

            if (playerAction.type === ActionType.Research) {
              // const { results } = await applyAsyncAction(
              //   context.grid,
              //   playerAction,
              // )!;

              const { scoreByResourceByPlayerKey } = context;

              const { n, playerKey } = payload;

              const score = scoreByResourceByPlayerKey[playerKey];

              const computeCurrent =
                scoreByResourceByPlayerKey?.[playerKey]?.[TileResource.Compute];

              if (scoreByResourceByPlayerKey[playerKey]) {
                scoreByResourceByPlayerKey[playerKey][TileResource.Compute] = 1;
              }

              const cut = n / 100;

              // fixture
              const results = {
                'player-1': [2, 3, 5],
                'player-2': [7, 11, 13],
                'player-3': [19, 23, 29, 31],
              }[playerKey];

              console.log('Research completed', playerKey, results);

              // add to chart
              self.send({
                type: 'researchUpdated',
                playerKey,
                results,
              } as EventObject);
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
          const { scoreByResourceByPlayerKey, scoreCurrentTurnByPlayerKey } =
            calculateScoreByPlayer(grid, context.scoreByResourceByPlayerKey);

          context.scoreByResourceByPlayerKey = scoreByResourceByPlayerKey;
          context.scoreCurrentTurnByPlayerKey = scoreCurrentTurnByPlayerKey;
          context.currentTurnMetadata.turn =
            context.currentTurnMetadata.turn + 1;
        },
      },
    },
  );
