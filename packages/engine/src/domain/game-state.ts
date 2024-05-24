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

import { createMachine, assign, sendParent , createActor, raise } from 'xstate';
import { GameSeed, Grid, TileBuilding, generateEmptyGrid, generateRandomGrid } from './grid';
import { applyAction, createBuildAction } from './action';


export type GameState = {
  currentTurnMetadata: {
    turn: number,
    playerId: string
  };
  players: any[];
  grid: Grid;
  deck: number[];
}

export type Card = {
    name: 'a'
}
// Define the structure of the deck and the function to draw cards
const deck = Array(52).fill(null).map((_, i) => i + 1);

const drawCards = (count:number) => {
  const cards = [];
  for (let i = 0; i < count; i++) {
    const card = deck.pop();
    if (card) cards.push(card);
  }
  return cards;
};


// model ownership of tiles at game for easier source of truth

// pop up player actions onto game states


// Define the state machine for a player
export const playerMachine = createMachine({
  id: 'player',
  initial: 'waiting',
  context: {
    playerActions: [] as any[],
    hand: [] as Card[],

  },
  states: {
    waiting: {
      entry: 'startPlayer',
      on: {
        always: 'playing',
        DRAW: {
          target: 'playing',
          actions: assign({
            hand: ({context, event}) => [...context.hand, ...event.cards],
            playerActions: ({context, event}) => {
             console.log('playerActions', event)
              const {grid} = event;
              const action = createBuildAction(grid);

              console.log('action', action)
              return [action];
            }
          }),
        },
      },
    },
    playing: {
      entry: 'takeAction',
      on: {
        USE: 'waiting',
        DONE: 'done',
        // actions: ['takeAction']
      },
    },
    done: {
      type: 'final',
    },
  },
}, {
  actions: {
    // drawCards: assign({
    //   deck: (context) => context.deck.slice(3),
    // }),
    startPlayer:  (ctxt)=>{
      console.log('startPlayer')
    },
    takeAction: sendParent(({context})=>({
      type: 'playerAction',
      data: {
        playerAction: context.playerActions[0]
      }
    }))

    // takeAction:  sendParent(async ({context})=>{

    //   const {playerActions} = context;
    //   await raise({type: 'some', data: {
    //     actions: 
    //   }})
    //   // applyAction(context.playerActions[0]);

    //   // deck: (context) => context.deck.slice(3),
    // })
  },
});

const setupPlayer = (id: string) => ({context}:{context:any})=>{
  console.log('setup', id)
  context.currentTurnMetadata.playerId = id;

  // only if not exists
  // const player = createActor(playerMachine);
  // context.players.push(player);
  // player.start();
}


// Define the state machine for the game
export const createGameMachine = (gameSeed: GameSeed) => createMachine({
  id: 'game',
  initial: 'start',
  context: {
    currentTurnMetadata: {
      turn: 0,
      playerId: ''
    },
    players: [
        
    ] as any[],

    grid: generateRandomGrid(gameSeed),
    // TODO 
    tiles: [
        {
            i: 1,
            j: 2,
            building: TileBuilding.City,
            owner: 'player-1'
        },
        {
            i: 2,
            j: 2,
            owner: 'player-1'
        },
        
        {
            i: 2,
            j: 3,
            owner: 'player-1'
        }
    ],
    deck,
  } as GameState,
  on: {
    playerAction: {
      actions: assign(({context, event}):any=>{
        console.log('parent action', event)
        const { data: { playerAction } } = event;
        context.grid = applyAction(context.grid, playerAction)!;
      })
    }
  },
  entry:[
    assign({
      players: ({ spawn }) => [
        spawn(playerMachine, { id: 'player1' }),
        spawn(playerMachine, { id: 'player2' }),
        spawn(playerMachine, { id: 'player3' })
      ]
    })
  ],
  states: {
    start: {
    
        always: 'player1',
    },
    player1: {
      entry: [setupPlayer('player-1'), 'drawCards', 'sendToPlayer1'],
      on: {
        NEXT: 'player2',
      },
    },
    player2: {
      entry: [setupPlayer('player-2'),'drawCards', 'sendToPlayer2'],
      on: {
        NEXT: 'player3',
      },
    },
    player3: {
      entry: [setupPlayer('player-3'),'drawCards', 'sendToPlayer3'],
      on: {
        NEXT: 'endTurn',
      },
    },
    endTurn: {
      entry:  ['wrapUpTurn'],
      on: {
        always: 'player1',
      },
    }
  },
}, {
  actions: {
    drawCards: assign({
      deck: ({context}) => context.deck.slice(3),
    }),
    sendToPlayer1: async ({context}) => {
      const {grid} = context;
      console.log('sendToPlayer1')
      await context.players[0].send({ type: 'DRAW', cards: context.deck.slice(0, 3), grid });
    },
    sendToPlayer2: async ({context}) => {
      const {grid} = context;
      console.log('sendToPlayer1')
      await context.players[0].send({ type: 'DRAW', cards: context.deck.slice(0, 3), grid });
    },
    sendToPlayer3: async ({context}) => {
      const {grid} = context;
      console.log('sendToPlayer1')
      await context.players[0].send({ type: 'DRAW', cards: context.deck.slice(0, 3), grid});
    },
    wrapUpTurn: ({context}) => {
      console.log('wrap up turn', context);
      context.currentTurnMetadata.turn = context.currentTurnMetadata.turn + 1;

    }
  },
});