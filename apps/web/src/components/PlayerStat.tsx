import { LABEL_BY_TILE_RESOURCE, TileResource } from '@repo/engine';
import React, { createContext, useEffect, useState } from 'react';
import { COLOR_CLASS_BY_PLAYER, asPlayerKey } from '@repo/engine';


const ResourceScore = ({
    resource,
    playerKey,
    scoreByResourceByPlayerKey,
    scoreCurrentTurnByPlayerKey
}: {
    resource: TileResource,
    playerKey: string,
    scoreByResourceByPlayerKey: any,
    scoreCurrentTurnByPlayerKey: any
}) => {

    return (
        <span className="text-xs">
            {LABEL_BY_TILE_RESOURCE[resource]}
            {scoreCurrentTurnByPlayerKey[playerKey][resource]} /
            {scoreByResourceByPlayerKey[playerKey][resource]}
        </span>
    )
}

export default (params: {
    player: { playerIndex: number },
    scoreByResourceByPlayerKey: any,
    scoreCurrentTurnByPlayerKey: any
}) => {


    const {
        player,
        scoreByResourceByPlayerKey,
        scoreCurrentTurnByPlayerKey
    } = params


    const { playerIndex } = player;
    const playerKey = asPlayerKey(playerIndex)

    const playerClassName = "text-" + COLOR_CLASS_BY_PLAYER[playerKey] as string;
    // const playerColorClass = ["text", playerColor, "500"].join('-')

    // TODO context obj
    return (
        <div className="p-4 pt-1 flex flex-row items-center">
            <span className={playerClassName}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clipRule="evenodd" />
                </svg>
            </span>
            Player {playerIndex}
            <ResourceScore
                resource={TileResource.Compute}
                playerKey={playerKey}
                {...params}

            />
            <ResourceScore
                resource={TileResource.Science}
                playerKey={playerKey}
                {...params}

            />
        </div>
    )

}
