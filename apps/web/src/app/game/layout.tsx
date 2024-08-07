/* global document */
'use client';
import _ from 'lodash';
import { LABEL_BY_TILE_RESOURCE, TileResource } from "@repo/engine";
import { GameContextProvider, useGameContext } from "../../components/GameContextProvider";
import GameBar from "../../components/GameBar";
import PlayerStat from "../../components/PlayerStat";
import PromptHistoryModal from "../../components/PromptHistoryModal";
import PromptHistory from "../../components/PromptHistory";


const PlayerBar = () => {
    const { gameState } = useGameContext();
    if (!gameState) {
        return
    }

    const { currentTurnMetadata, scoreByResourceByPlayerKey, players, scoreCurrentTurnByPlayerKey } = gameState;



    console.log('scoreByResourceByPlayerKey', scoreByResourceByPlayerKey)

    return (
        <div className="w-full flex pt-4 justify-between items-center">
            <div className="flex flex-row items-center">
                <div className="px-2">
                    <span className="px-2">Turn</span>
                    <button className="btn">{currentTurnMetadata.turn}</button>
                </div>
                {
                    players.map((player, i) => (
                        <PlayerStat
                            key={"player-" + i}
                            player={
                                _.omit(player, ['ref'])
                            }
                            scoreByResourceByPlayerKey={scoreByResourceByPlayerKey}
                            scoreCurrentTurnByPlayerKey={scoreCurrentTurnByPlayerKey}
                        />
                    )
                    )
                }
            </div>
            <div className="flex-end  justify-around flex flex-row items-center px-2">
                {/* @ts-ignore */}
                <button className="btn bg-blue-500 text-white mx-2" onClick={() => document && document.getElementById('modal_prompt')!.showModal()}>Prompts</button>
                {/* @ts-ignore */}
                <button className="btn bg-blue-500 text-white mx-2" onClick={() => document && document.getElementById('my_modal_1')!.showModal()}>Research</button>
            </div>
        </div>
    )

}

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {

    const playerKeys = ['player-1', 'player-2'];
    // TODO get players from context
    return (
        <GameContextProvider>
            <div className="flex flex-row">
                <PlayerBar />
            </div>
            {children}
            <GameBar />
            <PromptHistory />

        </GameContextProvider>
    );
}
