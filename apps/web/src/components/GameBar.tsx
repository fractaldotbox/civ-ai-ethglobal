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
                <div className="col">
                    Events
                    {gameState?.logs?.length}
                    {gameState?.logs.map((log, index) => { return <div key={index}>{mapLogAsMessage(log)}</div> })}
                </div>

                <div className="flex justify-around p-2">
                    <div className="p-2">
                        <button
                            onClick={() => {
                                setAutoPlay(setInterval(() => {
                                    nextTurn();
                                }, 500));
                            }}>Auto Play</button>
                    </div>
                    <div className="p-2">
                        <button onClick={() => {
                            nextTurn();
                        }}>End Turn</button>
                    </div>
                </div>

            </div>
        </div>
    )
}