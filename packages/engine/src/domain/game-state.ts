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
import _ from 'lodash';
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
  createNoopAction,
  createNuclearAction,
  createResearchAction,
} from './action';
import { Player, asPlayerIndex, asPlayerKey, pickRandomPlayer } from './player';
import { calculateScoreByPlayer } from './scorer';
import { LogEvent } from './log';
import { GameEvent, STANDARD_GAME_EVENT_TEMPLATES } from './game-event';
import { createDummyAgent } from './agent';

export type GameState = {
  logs: LogEvent[];
  winner: string | null;
  events: GameEvent[];
  currentTurnMetadata: {
    turn: number;
    playerKey: string;
  };
  agentRunsByPlayerKey: Record<string, any[]>;
  playerNameByKey: Record<string, string>;
  scoreByResourceByPlayerKey: Record<string, { [k in TileResource]: number }>;
  scoreCurrentTurnByPlayerKey: Record<string, { [k in TileResource]: number }>;
  players: any[];
  grid: Grid;
  primesByPlayerKey: Record<string, number[]>;
};

export const randomizeCollabParis = () => {};

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
    },
    states: {
      waiting: {
        entry: 'startGame',
        on: {
          DRAW: {
            target: 'playing',
            actions: assign({
              playerActions: ({ context, event, self }) => {
                const { id: playerKey } = self;
                const {
                  gameState,
                  // currentTurnMetadata,
                  // scoreByResourceByPlayerKey,
                } = event;

                const { currentTurnMetadata, scoreByResourceByPlayerKey } =
                  gameState;

                const playerId = playerKey.split('-')[1];

                context.currentTurnMetadata = currentTurnMetadata;
                const scoreByResource = scoreByResourceByPlayerKey[playerKey];
                // update turn

                const { turn } = context.currentTurnMetadata;

                const agent = createDummyAgent(playerKey);

                const syncActions =
                  scoreByResource[TileResource.Energy] < 5
                    ? [createNoopAction(playerKey)]
                    : (agent.deriveSyncActions(gameState) as Action[]);

                const playerIndex = asPlayerIndex(playerKey);

                // TODO math random offset for balance

                const isResearchTurn =
                  ((turn % 3) as number) + 1 === playerIndex;

                console.log('research-turn', playerKey, playerIndex, turn % 3);
                if (isResearchTurn) {
                  const researchAction = createResearchAction(turn, playerKey);
                  return [...syncActions, researchAction];
                }
                return syncActions;
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
      startGame: ({ context, self }) => {
        console.log('startGame');

        // Pre-trigger first trun
      },
      takeAction: sendParent(({ context }) => ({
        type: 'playerAction',
        data: {
          playerAction: context.playerActions[0],
        },
      })),
      takeResearchAction: sendParent(({ context }) => {
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
  };

const createSendToPlayer =
  (playerIndex: number) =>
  async ({ context }: { context: any }) => {
    console.log('sendToPlayer' + playerIndex);
    await context.players[playerIndex - 1]?.ref.send({
      type: 'DRAW',
      gameState: context,
      // scoreByResourceByPlayerKey: context.scoreByResourceByPlayerKey,
      // grid,
      // currentTurnMetadata: context.currentTurnMetadata,
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
export const createGameMachine = (gameSeed: GameSeed) => {
  const grid = generateRandomGrid(gameSeed);
  return createMachine(
    {
      id: 'game',
      initial: 'start',
      context: {
        winner: null,
        logs: [],
        events: [],
        currentTurnMetadata: {
          turn: 0,
          playerKey: '',
        },
        agentRunsByPlayerKey: createByPlayerKey(
          gameSeed.playerCount,
          () => ({}),
        ),
        primesByPlayerKey: createByPlayerKey(gameSeed.playerCount, () => []),
        // TODO metadata injected
        players: [] as Player[],
        scoreByResourceByPlayerKey: createByPlayerKey(
          gameSeed.playerCount,
          () => ({
            [TileResource.Energy]: 30,
            [TileResource.Science]: 30,
          }),
        ),
        scoreCurrentTurnByPlayerKey: createByPlayerKey(
          gameSeed.playerCount,
          () => ({
            [TileResource.Energy]: 0,
            [TileResource.Science]: 0,
          }),
        ),
        grid,
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
          actions: assign(({ context, event, self }): any => {
            const { playerKey, primes } = event;

            console.log('research results', playerKey, primes);

            context.primesByPlayerKey[playerKey] = _.union(
              primes,
              context.primesByPlayerKey[playerKey],
            );
            // not emit log as delay
          }),
        },

        playerAction: {
          actions: assign(async ({ context, event, self }): any => {
            console.log('player trigger parent action', JSON.stringify(event));
            const {
              data: { playerAction },
            } = event;
            self.send({ type: 'emitLog', action: playerAction } as EventObject);

            const {
              type,
              payload,
              playerKey,
              costByResourceType = {},
            } = playerAction as Action;

            const current = context.scoreByResourceByPlayerKey[
              playerKey
            ] as Record<TileResource, number>;

            Object.keys(costByResourceType).forEach(
              (resourceType: TileResource) => {
                current[resourceType] -= costByResourceType[resourceType];
              },
            );

            context.scoreByResourceByPlayerKey[playerKey] = current;

            if ([ActionType.Build, ActionType.Nuclear].includes(type)) {
              const { grid } = applySyncAction(context.grid, playerAction)!;
              context.grid = grid;
            }

            if (playerAction.type === ActionType.Research) {
              const { results } = await applyAsyncAction(
                context.grid,
                playerAction,
              )!;

              const { scoreByResourceByPlayerKey } = context;

              const { n } = payload;

              const score = scoreByResourceByPlayerKey[playerKey];

              const energyCurrent =
                scoreByResourceByPlayerKey?.[playerKey]?.[TileResource.Energy];

              if (scoreByResourceByPlayerKey[playerKey]) {
                scoreByResourceByPlayerKey[playerKey][TileResource.Energy] = 1;
              }

              if (results) {
                const { primes } = results;
                console.log('Research completed', playerKey, primes);

                self.send({
                  type: 'researchUpdated',
                  playerKey,
                  primes,
                } as EventObject);
              }
            }

            //  emit
          }),
        },
      },
      entry: [
        assign({
          players: ({ spawn }) =>
            _.range(1, 3).map((i) => {
              // TODO inject metadata
              const playerIndex = i;
              const playerKey = asPlayerKey(playerIndex);
              const ref = spawn(playerMachine, { id: playerKey });
              return {
                playerId: playerIndex,
                playerKey,
                ref,
              };
            }),
        }),
      ],
      states: {
        start: {
          entry: ['wrapUpTurn'],
          on: {
            NEXT: 'player1',
          },
        },
        player1: {
          entry: [playerEntry(1), createSendToPlayer(1)],
          on: {
            NEXT: 'player2',
          },
        },
        player2: {
          entry: [playerEntry(2), createSendToPlayer(2)],
          on: {
            NEXT: 'player3',
          },
        },
        player3: {
          entry: [playerEntry(3), createSendToPlayer(3)],
          on: {
            NEXT: 'endTurn',
          },
        },
        endTurn: {
          entry: ['wrapUpTurn'],
          on: {
            END_GAME: 'endGame',
          },
          always: [
            // need the guard so self event take priority
            {
              target: 'player1',
              guard: ({ context }) => !context.winner,
            },
          ],
        },

        endGame: {
          entry: ['showEndResults'],
          type: 'final',
        },
      },
    },
    {
      actions: {
        wrapUpTurn: ({ context, self }) => {
          console.log('wrap up turn', context?.currentTurnMetadata?.turn);

          const { grid, primesByPlayerKey } = context;
          const { scoreByResourceByPlayerKey, scoreCurrentTurnByPlayerKey } =
            calculateScoreByPlayer(grid, context.scoreByResourceByPlayerKey);

          context.scoreByResourceByPlayerKey = scoreByResourceByPlayerKey;
          context.scoreCurrentTurnByPlayerKey = scoreCurrentTurnByPlayerKey;

          const template = STANDARD_GAME_EVENT_TEMPLATES[0];
          if (context.currentTurnMetadata.turn === 0) {
            context.events.push(template());
          }

          context.currentTurnMetadata.turn =
            context.currentTurnMetadata.turn + 1;

          // TODO extract

          const winner = _.findKey(
            primesByPlayerKey,
            (primes) => primes.length > 0,
          );

          console.log('winner', winner);
          if (winner) {
            context.winner = winner;
            self.send({
              type: 'END_GAME',
              playerKey: winner,
            });
            return;
          }

          if (context.currentTurnMetadata.turn > 20) {
            console.log('send end');
            context.winner = 'player-1';
            self.send({
              type: 'END_GAME',
            });
          }
        },
        showEndResults: ({ context }) => {
          console.log('gameover');

          const victoryTemplate = STANDARD_GAME_EVENT_TEMPLATES[1];
          context.events.push(
            victoryTemplate({
              playerKey: context.winner,
            }),
          );
        },
      },
    },
  );
};
