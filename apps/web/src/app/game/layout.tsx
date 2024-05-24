'use client';
import { LABEL_BY_TILE_RESOURCE, TileResource } from "@repo/engine";
import { GameContextProvider, useGameContext } from "../../components/GameContextProvider";
import GameBar from "../../components/GameBar";

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {

    return (
        <GameContextProvider>
            <div className="flex flex-row">
                {
                    [1, 2, 3, 4].map(
                        i => (
                            <div>
                                Player {i}
                                <span>
                                    {LABEL_BY_TILE_RESOURCE[TileResource.Food]}
                                </span>
                                <span>
                                    {LABEL_BY_TILE_RESOURCE[TileResource.Science]}
                                </span>
                            </div>
                        )
                    )
                }
            </div>
            {children}
            <GameBar />

        </GameContextProvider>
    );
}
