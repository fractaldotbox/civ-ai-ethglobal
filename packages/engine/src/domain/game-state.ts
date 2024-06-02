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
import {
  createMachine,
  assign,
  sendParent,
  EventObject,
  fromPromise,
} from 'xstate';
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
import { getWeather } from './weather';
import { regionBoost } from './grid-action';
import { createAgent, createDummyAgent } from './agent';

export type GameState = {
  logs: LogEvent[];
  winner: string | null;
  events: GameEvent[];
  currentTurnMetadata: {
    turn: number;
    playerKey: string;
  };
  collabByPlayerKey: Record<string, [string, boolean, string][]>;
  agentRunsByPlayerKey: Record<string, any[]>;
  scoreByResourceByPlayerKey: Record<string, { [k in TileResource]: number }>;
  scoreCurrentTurnByPlayerKey: Record<string, { [k in TileResource]: number }>;
  players: any[];
  grid: Grid;
  researchCountByPlayerKey: Record<string, number>;
  primesByPlayerKey: Record<string, number[]>;
  region1: {
    id?: string;
    name: string;
    wind_speed: number;
    solar_irradiance: number;
  };
  region2: {
    id?: string;
    name: string;
    wind_speed: number;
    solar_irradiance: number;
  };
};

export const randomizeCollabParis = () => {};

const PLAYER_SEEDS = [
  {
    name: 'Nuclear Gandhi',
    address: '0x',
  },
  {
    name: 'Civilized Zuckberg',
    address: '0x',
  },
  {
    name: 'Pacifist Vitalik',
    address: '0x',
  },
  {
    name: 'Ironman Musk',
    address: '0x',
  },
];

// model ownership of tiles at game for easier source of truth

// pop up player actions onto game states

// Define the state machine for a player
export const createPlayerMachine = (
  player: Partial<Player>,
  gameState: GameState,
) =>
  createMachine(
    {
      id: 'player',
      initial: 'creating',
      context: {
        agent: null as any,
        lastGameState: { ...gameState } as GameState,
        currentTurnMetadata: {} as any,
        playerKey: player.playerKey,
        name: player.name,
        address: player.address,
        actionPlans: [] as any[][],
        playerActions: [] as Action[],
      },
      states: {
        creating: {
          entry: sendParent(({ context }) => ({
            type: 'emitLog',
            action: {
              type: ActionType.System,
              playerKey: context.playerKey,
              playerName: context.name,
              payload: {
                message: 'Initializing',
              },
            },
          })),

          invoke: {
            src: fromPromise(async ({ input, self }: any): any => {
              console.log('input', input);
              const agent = await createAgent(input.playerKey, input.address);

              // const agent = createDummyAgent(playerKey);
              // (agent.deriveSyncActions(gameState) as Action[])

              const results = await agent.deriveNextActions(gameState);

              console.log('results', results);

              return {
                agent,
                results,
              };
            }),
            input: ({ context }) => ({
              playerKey: context.playerKey,
              address: context.address,
              gameState: context.lastGameState,
            }),
            onDone: {
              target: 'waiting',
              actions: [
                ({ context, event }) => {
                  const { output } = event;
                  const { agent, results } = output;

                  context.agent = agent;

                  // TODO take care fallback
                  const actionPlans = results?.response?.actions || [];
                  context.actionPlans.push(...actionPlans);
                },
                sendParent(({ context }) => ({
                  type: 'emitLog',
                  action: {
                    type: ActionType.System,
                    playerKey: context.playerKey,
                    playerName: context.name,
                    payload: {
                      message: 'Initialize Completed',
                    },
                  },
                })),
              ],
            },
          },
        },
        waiting: {
          entry: 'startGame',
          on: {
            DRAW: {
              target: 'playing',
              actions: assign(({ context, event, self }): any => {
                // only after it is agent turn and do everything, transit to thinking to avoid race condition
                // require blocked thinking if urgently need action e.g. 1) semaphore style decision (collab or not) 2) action plans if sent async, not arried yet

                const { gameState } = event;
                context.lastGameState = gameState;
                const { currentTurnMetadata, scoreByResourceByPlayerKey } =
                  gameState;
                const { turn } = currentTurnMetadata;

                if (turn === 0) {
                }

                const playerActions = [];
                const { id: playerKey } = self;

                const playerId = playerKey.split('-')[1];

                context.currentTurnMetadata = currentTurnMetadata;
                const scoreByResource = scoreByResourceByPlayerKey[playerKey];
                // update turn

                // TODO take care fallback
                const actionPlanned = context.actionPlans?.[turn]?.[0];

                // TODO fix cost per different action
                const syncActions =
                  scoreByResource[TileResource.Energy] < 5
                    ? [createNoopAction(playerKey)]
                    : actionPlanned;

                const playerIndex = asPlayerIndex(playerKey);

                // TODO math random offset for balance

                const isResearchTurn =
                  ((turn % 3) as number) + 1 === playerIndex;

                // cannot async

                playerActions.push(...syncActions);

                if (isResearchTurn) {
                  const researchAction = createResearchAction(
                    turn + 1,
                    playerKey,
                  );
                  playerActions.push(researchAction);
                }
                console.log('playerActions', playerActions);

                return {
                  playerActions,
                };
              }),
            },
          },
        },

        playing: {
          entry: ['takeAction', 'takeResearchAction'],
          always: 'waiting',
        },
        // thinking: {
        //   invoke: {
        //     src: fromPromise(context.agent),
        //   },
        // },
        done: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        startGame: assign(async ({ context, self }): any => {
          console.log('startGame');

          // TODO ensure async otherwise race conditions

          // await agent.deriveNextActions(context.lastGameState);

          // Pre-trigger first trun
        }),
        takeAction: sendParent(({ context }) => ({
          type: 'playerAction',
          data: {
            playerAction: context.playerActions[0],
          },
        })),
        takeResearchAction: sendParent(({ context }) => {
          const playerAction = context.playerActions?.[1];
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
        planActions: assign(async ({ context }: any): any => {
          const { currentTurnMetadata } = context?.lastGameState;
          console.log('confirm');

          if (currentTurnMetadata.turn % 5 === 2) {
            const results = await context.agent.deriveNextActions(gameState);
          }

          // context
        }),
        confirmCollab: sendParent(async ({ context }): any => {
          const results = await context.agent.confirmCollab(gameState);
          console.log('confirm');

          return {
            type: 'collabResponsed',
            data: {
              collabPairs: results?.results,
            },
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
    console.log('sendToPlayer' + playerIndex);
    await context.players[playerIndex - 1].ref.send({
      type: 'DRAW',
      gameState: { ...context },
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
  console.log('createGameMachine');
  const grid = generateRandomGrid(gameSeed);

  const { regions = [] } = gameSeed;

  const [region1, region2] = regions;
  return createMachine(
    {
      id: 'game',
      initial: 'start',
      context: {
        winner: null,
        logs: [],
        events: [],
        collabByPlayerKey: createByPlayerKey(gameSeed.playerCount, () => []),
        currentTurnMetadata: {
          turn: 0,
          playerKey: '',
        },
        agentRunsByPlayerKey: createByPlayerKey(
          gameSeed.playerCount,
          () => ({}),
        ),
        researchCountByPlayerKey: createByPlayerKey(
          gameSeed.playerCount,
          () => 0,
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
        region1: {
          ...region1,
          wind_speed: 0,
          solar_irradiance: 0,
        },
        region2: {
          ...region2,
          wind_speed: 0,
          solar_irradiance: 0,
        },
      } as GameState,
      on: {
        emitLog: {
          actions: assign(({ context, event }): any => {
            context.logs.unshift({
              action: event.action,
            });
          }),
        },
        collabResponsed: {
          actions: assign(({ context, event }): any => {
            const { playerKey, data } = event;
            context.collabByPlayerKey[playerKey] = data.collabPairs;
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
        weatherUpdated: {
          actions: assign(
            ({ context, event }: { context: any; event: any }): any => {
              const { regionId, weather } = event;
              context[`region${regionId}`]['wind_speed'] =
                weather[0].current_weather.wind_speed;
              context[`region${regionId}`]['solar_irradiance'] =
                weather[0].current_weather.solar_irradiance;
            },
          ),
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
              const score = context.scoreByResourceByPlayerKey[playerKey];

              const energyCurrent =
                context.scoreByResourceByPlayerKey?.[playerKey]?.[
                  TileResource.Energy
                ];

              if (energyCurrent < 5) {
                return;
              }

              context.researchCountByPlayerKey[playerKey] += 1;

              const { results } = await applyAsyncAction(
                context.grid,
                playerAction,
              )!;

              const { n } = payload;

              if (context.scoreByResourceByPlayerKey[playerKey]) {
                context.scoreByResourceByPlayerKey[playerKey][
                  TileResource.Energy
                ] -= 5;
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
          players: ({ context, spawn }) =>
            PLAYER_SEEDS.map((playerSeed, i) => {
              // TODO inject metadata
              const playerIndex = i + 1;
              const { name } = playerSeed;
              const playerKey = asPlayerKey(playerIndex);
              const ref = spawn(
                createPlayerMachine(
                  {
                    ...playerSeed,
                    playerKey,
                  },
                  context,
                ),
                {
                  id: playerKey,
                },
              );

              return {
                playerId: playerIndex,
                name,
                playerKey,
                ref,
              };
            }),
        }),
      ],
      states: {
        start: {
          entry: ['initGame'],
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
            NEXT: 'player4',
          },
        },
        player4: {
          entry: [playerEntry(4), createSendToPlayer(4)],
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
        initGame: ({ context }) => {
          const template = STANDARD_GAME_EVENT_TEMPLATES[0];
          if (context.currentTurnMetadata.turn === 0) {
            context.events.push(template());
          }
          // empty grid to force sum
          const { scoreByResourceByPlayerKey, scoreCurrentTurnByPlayerKey } =
            calculateScoreByPlayer([[]], context.scoreByResourceByPlayerKey);

          context.scoreByResourceByPlayerKey = scoreByResourceByPlayerKey;
        },
        wrapUpTurn: ({ context, self }) => {
          console.log('wrap up turn', context?.currentTurnMetadata?.turn);

          const { grid, primesByPlayerKey } = context;
          const { scoreByResourceByPlayerKey, scoreCurrentTurnByPlayerKey } =
            calculateScoreByPlayer(grid, context.scoreByResourceByPlayerKey);

          context.scoreByResourceByPlayerKey = scoreByResourceByPlayerKey;
          context.scoreCurrentTurnByPlayerKey = scoreCurrentTurnByPlayerKey;

          if (context.currentTurnMetadata.turn === 0) {
            console.log('start');
            // assign region

            const { region1, region2 } = context;
            // TODO by rows

            // get the weather of the 2 random cells
            getWeather(region1.id).then((value) => {
              self.send({
                type: 'weatherUpdated',
                regionId: 1,
                weather: value,
              });
            });

            getWeather(region2.id).then((value) => {
              self.send({
                type: 'weatherUpdated',
                regionId: 2,
                weather: value,
              });
            });
          }

          if (context.currentTurnMetadata.turn === 20) {
            // research
            const playerKeys = context.players.map(
              ({ playerKey }) => playerKey,
            );
            // form pairs
            const pairs = _.chunk(_.shuffle(playerKeys), 2);

            console.log('research pairs', pairs);

            pairs.forEach((pair) => {
              const [playerKey1, playerKey2] = pair;
              const isPlayer1Ok = context.collabByPlayerKey[playerKey1].find(
                ([playerKey, isOk]) => playerKey === playerKey2,
              );
              const isPlayer2Ok = context.collabByPlayerKey[playerKey2].find(
                ([playerKey, isOk]) => playerKey === playerKey1,
              );
              if (isPlayer1Ok && isPlayer2Ok) {
                // carry out collab
                // createResearchAction();
              }
              // carry out collab
            });
          }

          if (context.currentTurnMetadata.turn === 5) {
            context.grid = regionBoost({
              grid: context.grid,
              windSpeed: context.region1.wind_speed,
              solarIrradiance: context.region1.solar_irradiance,
              startRow: 0,
              endRow: context.grid.length / 2,
            });

            const weatherTemplate = STANDARD_GAME_EVENT_TEMPLATES[2];
            context.events.push(
              weatherTemplate({
                regionId: 1,
                name: context.region1.name,
                windSpeed: context.region1.wind_speed,
                solarIrradiance: context.region1.solar_irradiance,
              }),
            );
          }

          if (context.currentTurnMetadata.turn === 10) {
            context.grid = regionBoost({
              grid: context.grid,
              windSpeed: context.region1.wind_speed,
              solarIrradiance: context.region1.solar_irradiance,
              startRow: context.grid.length / 2 + 1,
              endRow: context.grid.length,
            });

            console.log(
              context.grid.map((row) =>
                row.map((cell) => cell?.resourceByType),
              ),
            );
            const weatherTemplate = STANDARD_GAME_EVENT_TEMPLATES[2];
            context.events.push(
              weatherTemplate({
                regionId: 2,
                name: context.region2.name,
                windSpeed: context.region2.wind_speed,
                solarIrradiance: context.region2.solar_irradiance,
              }),
            );
          }

          console.log('increment turn');
          context.currentTurnMetadata.turn =
            context.currentTurnMetadata.turn + 1;

          // TODO extract

          const winner = _.findKey(
            primesByPlayerKey,
            (primes) => primes.length > 1000,
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
