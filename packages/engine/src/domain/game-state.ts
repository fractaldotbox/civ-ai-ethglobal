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

import { createMachine, assign, interpret, createActor } from 'xstate';
import { TileBuilding } from './grid';


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
 
    hand: [] as Card[],
  },
  states: {
    waiting: {
      on: {
        DRAW: {
          target: 'drawing',
          actions: assign({
            hand: ({context, event}) => [...context.hand, ...event.cards],
          }),
        },
      },
    },
    drawing: {
      on: {
        USE: 'waiting',
        DONE: 'done',
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
    takeAction: (ctx)=>{
      console.log('ctx', ctx)
      // deck: (context) => context.deck.slice(3),
    }
  },
});

const setupPlayer = (id: string) => ({context})=>{
  console.log('setup', id)
  context.currentState = id;

  // only if not exists
  const player = createActor(playerMachine);
  context.players.push(player);
}


// Define the state machine for the game
export const gameMachine = createMachine({
  id: 'game',
  initial: 'start',
  context: {
    currentTurn:0,
    currentState: '',
    players: [
        
    ] as any[],
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
  },
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
    takeAction: assign({
        // deck: (context) => context.deck.slice(3),
    }),
    sendToPlayer1: ({context}) => {
      context.players[0].send({ type: 'DRAW', cards: context.deck.slice(0, 3) });
    },
    sendToPlayer2: ({context}) => {
      context.players[1].send({ type: 'DRAW', cards: context.deck.slice(0, 3) });
    },
    sendToPlayer3: ({context}) => {
      context.players[2].send({ type: 'DRAW', cards: context.deck.slice(0, 3) });
    },
    wrapUpTurn: ({context}) => {
      console.log('wrap up turn', context);
      context.currentTurn = context.currentTurn + 1;

    }
  },
});