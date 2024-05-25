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

    const { scoreByPlayerKey, scoreCurrentTurnByPlayerKey } = gameState;

    const playerKeys = Object.keys(scoreByPlayerKey);

    return (
        <div className="flex flex-row">
            {
                playerKeys.map((player, i) => (
                    <PlayerStat
                        player={{
                            playerIndex: i + 1,
                        }}
                        scoreByPlayerKey={scoreByPlayerKey}
                        scoreCurrentTurnByPlayerKey={scoreCurrentTurnByPlayerKey}
                    />
                )
                )
            }
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
