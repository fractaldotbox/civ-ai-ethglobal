import { GameState, TileResource, createGameMachine, generateRandomGrid } from '@repo/engine';
import React, { createContext, useEffect, useState } from 'react';
import { createActor } from 'xstate';

import { useActor, useMachine, useSelector } from '@xstate/react';

export type GameStateWrapper = {
    lastEventIndex: number;
    gameState?: GameState;
    autoPlay: NodeJS.Timeout | undefined;
    toggleAutoPlay: (fn?: (x: any) => any) => void;
    setGameState: (gameState: GameState) => void;
    send: (event: any) => any
};


// Create the context
export const GameContext = createContext<GameStateWrapper | undefined>(undefined);

const selectEvents = (snapshot: any) => snapshot.context.events;


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

    const [lastEventIndex, setLastEventIndex] = useState(-1);
    const [autoPlay, setAutoPlay] = React.useState<NodeJS.Timeout | undefined>();


    const toggleAutoPlay = (fn?: () => any) => {
        if (fn) {
            setAutoPlay(setInterval(() => {
                fn();
            }, 1000));
        } else {
            clearInterval(autoPlay as NodeJS.Timeout);
            setAutoPlay(undefined);
        }
    }

    // force create once
    const gameMachine = React.useMemo(() => createGameMachine(gameSeed), []);
    const [snapshot, send, actorRef] = useMachine(gameMachine);

    // avoid multiple events per loop

    const events = useSelector(actorRef, selectEvents);
    if (events.length > lastEventIndex + 1) {
        console.log('show events', lastEventIndex)
        setLastEventIndex(lastEventIndex + 1);
    }
    // TODO listen events

    // TODO lifeclce update only after initialized
    const [gameState, setGameState] = useState<GameState>({
        ...snapshot.context
    });

    useEffect(() => {
        console.log('refresh game state')
        setGameState({ ...snapshot.context });
    }, [snapshot])




    // seems enough to ensure all listeners run
    // game.stop();


    // console.log(game.getSnapshot())

    // const snapshot = game.getSnapshot();


    const value = {
        autoPlay,
        toggleAutoPlay,
        lastEventIndex,
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