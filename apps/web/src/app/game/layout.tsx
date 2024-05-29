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

    const { scoreByResourceByPlayerKey, scoreCurrentTurnByPlayerKey } = gameState;

    const playerKeys = Object.keys(scoreByResourceByPlayerKey);



    console.log('scoreByResourceByPlayerKey', scoreByResourceByPlayerKey)

    return (
        <div className="w-full flex  justify-between">
            <div className="flex flex-row">
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
            <div className="flex-end">
                <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>Research</button>
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
