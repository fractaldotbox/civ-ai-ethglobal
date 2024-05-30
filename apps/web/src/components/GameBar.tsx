import React from "react";
import { GameContextProvider, useGameContext } from "./GameContextProvider";
import { mapLogAsMessage } from "@repo/engine";

export default () => {
    const [autoPlay, setAutoPlay] = React.useState<NodeJS.Timeout | undefined>();

    const { send, gameState } = useGameContext();

    const nextTurn = () => {
        console.log('next');
        send({
            type: 'NEXT'
        });
    }



    return (

        <div className="h-12" >
            {/* <div>Next</div> */}
            <div className="flex flex-row justify-between">
                <div className="col h-32">
                    Current Turn {gameState?.currentTurnMetadata.turn}
                    {/* {gameState?.logs?.length} */}
                    {gameState?.logs.map((log, index) => { return <div key={index}>{mapLogAsMessage(log)}</div> })}
                </div>

                <div className="flex justify-around p-2">
                    <div className="p-2 justify-center items-center">
                        <button
                            onClick={() => {
                                if (autoPlay) {
                                    clearInterval(autoPlay as NodeJS.Timeout);
                                    setAutoPlay(undefined);
                                } else {
                                    setAutoPlay(setInterval(() => {
                                        nextTurn();
                                    }, 1000));
                                }

                            }}>
                            {autoPlay && <span className="loading loading-spinner loading-sm"></span>}
                            Auto Play</button>
                    </div>
                    <div className="p-2  justify-center items-center">
                        <button onClick={() => {
                            nextTurn();
                        }}>End Turn</button>
                    </div>
                </div>

            </div>
        </div>
    )
}