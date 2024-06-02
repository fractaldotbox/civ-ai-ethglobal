import React from "react";
import { GameContextProvider, useGameContext } from "./GameContextProvider";
import { mapLogAsMessage } from "@repo/engine";
import Button from "./Button";
import Prompt from "./Prompt";

export default () => {

    const { send, gameState, autoPlay, toggleAutoPlay } = useGameContext();

    const nextTurn = () => {
        send({
            type: 'NEXT'
        });
    }



    return (

        <div className="h-12" >
            <div className="flex flex-row justify-between">
                <div className="col h-32">
                    {gameState?.logs.map((log, index) => { return <div key={index}>{mapLogAsMessage(log)}</div> })}
                </div>
                <div className="flex justify-around p-2">
                    <div className="p-2 justify-center items-center">
                        <Button
                            onClick={() => {
                                if (autoPlay) {
                                    toggleAutoPlay();
                                } else {
                                    toggleAutoPlay(() => {
                                        nextTurn();
                                    });
                                }

                            }}>
                            {autoPlay && <span className="loading loading-spinner loading-sm"></span>}
                            Auto Play</Button>
                    </div>
                    <div className="p-2  justify-center items-center">
                        <Button onClick={() => {
                            nextTurn();
                        }}>End Turn</Button>
                    </div>
                </div>

            </div>
        </div>
    )
}