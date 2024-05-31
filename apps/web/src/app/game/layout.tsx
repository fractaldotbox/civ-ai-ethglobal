'use client';
import { LABEL_BY_TILE_RESOURCE, TileResource } from "@repo/engine";
import { GameContextProvider, useGameContext } from "../../components/GameContextProvider";
import GameBar from "../../components/GameBar";
import PlayerStat from "../../components/PlayerStat";


const PlayerBar = () => {
    const { gameState } = useGameContext();
    if (!gameState) {
        return
    }

    const { currentTurnMetadata, scoreByResourceByPlayerKey, scoreCurrentTurnByPlayerKey } = gameState;

    const playerKeys = Object.keys(scoreByResourceByPlayerKey);



    console.log('scoreByResourceByPlayerKey', scoreByResourceByPlayerKey)

    return (
        <div className="w-full flex pt-4 justify-between items-center">
            <div className="flex flex-row items-center">
                <div className="px-2">
                    <span className="px-2">Turn</span>
                    <button className="btn">{currentTurnMetadata.turn}</button>
                </div>
                {
                    playerKeys.map((player, i) => (
                        <PlayerStat
                            key={"player-" + i}
                            player={{
                                playerIndex: i + 1,
                            }}
                            scoreByResourceByPlayerKey={scoreByResourceByPlayerKey}
                            scoreCurrentTurnByPlayerKey={scoreCurrentTurnByPlayerKey}
                        />
                    )
                    )
                }
            </div>
            <div className="flex-end  justify-around flex flex-row items-center px-2">

                <button className="btn bg-blue-500 text-white" onClick={() => document.getElementById('my_modal_1').showModal()}>Research</button>
            </div>
        </div>
    )

}

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    // TODO get players from context
    return (
        <GameContextProvider>
            <div className="flex flex-row">
                <PlayerBar />
            </div>
            {children}
            <GameBar />

        </GameContextProvider>
    );
}
