import {describe, expect, test } from 'vitest'

import { createActor, assign } from 'xstate';
import { playerMachine, gameMachine } from './game-state';


describe('Game State Machine', () => {

    // test('playerMachine', ()=>{

    //     const player = createActor(playerMachine);

    //     player.subscribe((snapshot) => {
    //         console.log(snapshot);
       
    //     });
    //     player.start();

    //     player.send({ type: 'someEvent' });
    //     player.stop();
    // })
    test('should go through a turn ', async (done:any) => {


      const game = createActor(gameMachine);



      game.start();
      // expect(game.getSnapshot().context.currentTurn).toBe(0);
      
      await game.send({ type: "NEXT" })
      await game.send({ type: "NEXT" })
      // seems enough to ensure all listeners run
      game.stop();

      console.log('xxx')

      console.log(game.getSnapshot())
      // expect(game.getSnapshot().context.currentTurn).toBe(1);


    //   const service = gameMachine.start({
    //     invoke: {
    //       onEntry: [
    //         assign((context) => {
    //           originalDeckLength = context.deck.length;
    //         }),
    //       ],
    //     },
    //   });
  
    //   const nextState = await service.send('NEXT');
  
    //   if (nextState.matches('player1')) {
    //     expect(nextState.context.deck.length).toBeLessThan(originalDeckLength);
    //   }
    });

    test('build only at adjacent free tiles', ()=>{

    })
  });