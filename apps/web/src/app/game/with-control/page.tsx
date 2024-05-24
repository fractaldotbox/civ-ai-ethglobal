'use client';
import _ from 'lodash'
import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Node, useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, WrapNodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { generateRandomGrid, LABEL_BY_TILE_RESOURCE, Tile, TileResource } from '@repo/engine';
import { mapSnapshotAsNodes } from '../../../../vm/grid';
import { useGameContext } from '../../../components/GameContextProvider';


const GRID_TILE_WIDTH = 100;
const GRID_TILE_WIDTH_PX = GRID_TILE_WIDTH + 'px';

const GRID_SIZE = 10;

const COLOR_MAPPING = {
    'player-1': 'blue',
    'player-2': 'red',
    'player-3': 'green',
    default: 'white'
} as Record<string, string>

const mapResourceAsLabel = (tile: Tile) => {
    const { resourceByType } = tile;

    // stable order
    return (
        <div className="flex flex-row" >
            {
                _.values(TileResource).map(
                    (resource: TileResource) => {
                        const count = resourceByType?.[resource] || 0;
                        if (count > 0) {
                            return (
                                <div className="flex flex-col">
                                    {
                                        Array(count).fill(null).map(
                                            () => {
                                                return (
                                                    <div>
                                                        {LABEL_BY_TILE_RESOURCE[resource]}
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            )
                        }
                        return
                    }
                )
            }
        </div>
    )
}



export default function GamePage(): JSX.Element {
    const [nodes, setNodes]: any = useState([]);

    // TODO transform mapping

    const { gameState, send } = useGameContext();

    useEffect(() => {

        // TODO use snapshot
        const gridSource = generateRandomGrid({
            rowSize: 10,
            columnSize: 10,
            playerCount: 2,
            tileResourceMax: 3,
            tileByType: {
                [TileResource.Food]: {
                    total: 100
                },
                [TileResource.Science]: {
                    total: 100
                }
            }
        })

        const nodes = mapSnapshotAsNodes({
            context: {
                grid: gridSource
            }
        }, GRID_TILE_WIDTH)

        // Add more countries as needed

        setNodes([...nodes]);
    }, []);



    const HexagonNode = (node: WrapNodeProps<Tile>) => {
        const { data: tile, id, xPos, yPos } = node;
        const { owner = '', resourceByType } = tile;
        const background = COLOR_MAPPING[owner] || COLOR_MAPPING.default;

        const resourceLabel = mapResourceAsLabel(tile);

        return (
            <div
                style={{
                    width: GRID_TILE_WIDTH_PX,
                    height: GRID_TILE_WIDTH_PX,
                    background,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'black'
                }}
            >
                <div className="text-sm">
                    {resourceLabel}
                    {owner}
                </div>
                {/* <div className="text-xs">{xPos},{yPos}</div> */}
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
        height: '90vh',
    };

    return (
        <div style={styles}>
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
                <MiniMap
                />
                <Controls />

                <Background />
            </ReactFlow>
        </div>
    );
}