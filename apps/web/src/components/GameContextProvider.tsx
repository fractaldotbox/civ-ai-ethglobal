import { GameState, TileResource, createGameMachine, generateRandomGrid } from '@repo/engine';
import React, { createContext, useEffect, useState } from 'react';
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
        playerCount: 3,
        tileResourceMax: 3,
        tileByType: {
            [TileResource.Compute]: {
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

    console.log('machine snapshot updated', snapshot);

    // TODO lifeclce update only after initialized
    const [gameState, setGameState] = useState<GameState>({
        ...snapshot.context
    });

    useEffect(() => {
        console.log('refresh game state')
        setGameState({ ...snapshot.context });
    }, [snapshot])


    // expect(game.getSnapshot().context.currentTurn).toBe(0);


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