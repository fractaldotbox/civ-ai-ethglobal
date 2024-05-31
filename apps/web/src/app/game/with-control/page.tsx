'use client';
import _ from 'lodash';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
    Node,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    Background,
    WrapNodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    generateRandomGrid,
    LABEL_BY_TILE_BUILDING,
    LABEL_BY_TILE_RESOURCE,
    Tile,
    TileBuilding,
    TileResource,
} from '@repo/engine';
import { mapSnapshotAsNodes } from '../../../../vm/grid';
import { useGameContext } from '../../../components/GameContextProvider';
import { COLOR_CLASS_BY_PLAYER, asPlayerKey } from '@repo/engine';
import Chart, { ChartDataContextProvider } from '../../../components/Chart';
import EventModal from '../../../components/EventModal';

const GRID_TILE_WIDTH = 100;
const GRID_TILE_WIDTH_PX = GRID_TILE_WIDTH + 'px';

const GRID_SIZE = 10;

export const ChartModal = () => {
    return (
        <ChartDataContextProvider>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg">Research Progress</h3>
                    <Chart />
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </ChartDataContextProvider>
    )
}

export const asCardLabel = () => '🃏'

const mapBuildingAsLabel = (tile: Tile) => {
    const { building } = tile;
    if (!building) {
        return <></>
    }

    // stable order
    return (
        <div className="flex flex-row text-xl">
            {LABEL_BY_TILE_BUILDING[building]}
        </div>
    );
}

const mapResourceAsLabel = (tile: Tile) => {
    const { resourceByType } = tile;

    // stable order
    return (
        <div className="flex flex-row">
            {_.values(TileResource).map((resource: TileResource) => {
                const count = resourceByType?.[resource] || 0;
                if (count > 0) {
                    return (
                        <div className="flex flex-col">
                            {Array(count)
                                .fill(null)
                                .map((v, i) => {
                                    return <div key={"tile-" + i}>{LABEL_BY_TILE_RESOURCE[resource]}</div>;
                                })}
                        </div>
                    );
                }
                return;
            })}
        </div>
    );
};

export const deriveTileBgColor = (tile: Tile) => {
    const { owner = '', resourceByType } = tile;
    if (tile.building === TileBuilding.Nuclear) {
        return 'bg-black'
    }
    return "bg-" + (COLOR_CLASS_BY_PLAYER[owner] || COLOR_CLASS_BY_PLAYER.default);
}

// TODO add log events

export default function GamePage(): JSX.Element {
    const [nodes, setNodes]: any = useState([]);
    const [currentEvent, setCurrentEvent]: any = useState({});
    // TODO transform mapping

    const { gameState, lastEventIndex, send, toggleAutoPlay } = useGameContext();

    useEffect(() => {

        if (lastEventIndex < 0) {
            return;
        }

        console.log('setCurrentEvent', lastEventIndex)
        // stop the auto play
        setCurrentEvent(gameState?.events?.[lastEventIndex] || {})
        toggleAutoPlay();

        document.getElementById('my_modal_3').showModal();
    }, [lastEventIndex])


    useEffect(() => {
        if (!gameState) return;
        // TODO use snapshot
        const { grid, } = gameState;
        console.log('nodes update')
        const nodes = mapSnapshotAsNodes(
            {
                context: {
                    grid,
                },
            },
            GRID_TILE_WIDTH,
        );

        // Add more countries as needed

        setNodes([...nodes]);
    }, [gameState]);

    const HexagonNode = (node: WrapNodeProps<Tile>) => {
        const { data: tile, id, xPos, yPos } = node;
        const { owner = '', resourceByType } = tile;

        const backgroundClassName = deriveTileBgColor(tile);

        const resourceLabel = mapResourceAsLabel(tile);

        const buildingLabel = mapBuildingAsLabel(tile);


        return (

            <div
                key={id}
                className={backgroundClassName}
                style={{
                    width: GRID_TILE_WIDTH_PX,
                    height: GRID_TILE_WIDTH_PX,
                    // background,
                    clipPath:
                        'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'black',
                }}
            >
                <div className="flex flex-col justify-center">
                    <div className="text-sm">
                        {resourceLabel}
                    </div>
                    {/* <div className="text-xs">{xPos},{yPos}</div> */}

                    <div className="flex justify-center mb-[5]"> {buildingLabel}</div>
                </div>
            </div>

        );
    };

    const nodeTypes = {
        // default: DefaultNode,
        default: HexagonNode,
    };

    const styles = {
        background: 'transparent',
        width: '100%',
        height: '80vh',
    };

    // TODO modal button for chart

    return (
        <div style={styles}>
            <EventModal event={currentEvent} />
            {/* <Chart /> */}
            <ChartModal />
            <ReactFlow
                nodes={nodes}
                edges={[]}
                // onNodesChange={onNodesChange}
                // onEdgesChange={onEdgesChange}
                // onConnect={onConnect}
                style={styles}
                nodeTypes={nodeTypes}
                // connectionLineStyle={connectionLineStyle}
                // snapToGrid={true}
                // snapGrid={snapGrid}
                // defaultViewport={defaultViewport}
                fitView
                minZoom={0}
                attributionPosition="bottom-left"
            >
                {/* <div className="react-flow__panel react-flow__minimap top right w-60 h-60"></div> */}
                <MiniMap />
                <Controls />

                <Background />
            </ReactFlow>
        </div>
    );
}
