import { GameState, TileResource, createGameMachine, gameMachine, generateRandomGrid } from '@repo/engine';
import React, { createContext, useState } from 'react';
import { createActor } from 'xstate';

import { useActor, useMachine } from '@xstate/react';

export type GameStateWrapper = {
    gameState?: GameState;
    setGameState: (gameState: GameState) => void;
    send: (event: any) => any
};


// Create the context
export const GameContext = createContext<GameStateWrapper | undefined>(undefined);


// Create the provider component
export const GameContextProvider = ({ children }: { children: React.ReactNode }) => {

    const gameSeed = {
        rowSize: 10,
        columnSize: 10,
        playerCount: 2,
        tileResourceMax: 3,
        tileByType: {
            [TileResource.Food]: {
                total: 100
            },
            [TileResource.Science]: {
                total: 100
            }
        }
    }

    // force create once
    const gameMachine = React.useMemo(() => createGameMachine(gameSeed), []);
    const [snapshot, send, actorRef] = useMachine(gameMachine);


    const [gameState, setGameState] = useState<GameState>({
        grid: snapshot.context.grid,
        currentTurnMetadata: {
            turn: 0,
            playerId: ''
        },
        players: [],
        deck: []
    });


    // expect(game.getSnapshot().context.currentTurn).toBe(0);

    // await game.send({ type: "DRAW" })



    // await game.send({ type: "DRAW" })
    // await game.send({ type: "NEXT" })
    // seems enough to ensure all listeners run
    // game.stop();


    // console.log(game.getSnapshot())

    // const snapshot = game.getSnapshot();


    // TODO create machine


    const value = {
        gameState,
        setGameState,
        send
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = React.useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameContextProvider');
    }
    return context;
};