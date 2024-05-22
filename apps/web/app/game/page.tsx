'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, DefaultNode, addEdge, MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import _ from 'lodash'


const GRID_CELL_WIDTH = 50;
const GRID_CELL_WIDTH_PX = GRID_CELL_WIDTH + 'px';

const GRID_SIZE = 10;

const COLOR_MAPPING = {
    'player-1': 'blue',
    'player-2': 'red',
    default: 'white'
} as Record<string, string>

export default function GamePage(): JSX.Element {
    const [nodes, setNodes]: any = useState([]);



    // TODO transform mapping

    useEffect(() => {

        const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                console.log('add node', i, j)
                grid[i]![j] = { id: 'id ' + i + j, data: { label: 'Country ' + i + j, owner: null }, position: { x: i * GRID_CELL_WIDTH, y: j * GRID_CELL_WIDTH } }
            }

        }

        const country1NodeSelectors = [
            {
                x: 1,
                y: 2
            },
            {
                x: 2,
                y: 2
            },
            {
                x: 3,
                y: 2
            },
        ]
        const country2NodeSelectors = [
            {
                x: 5,
                y: 2
            },

            {
                x: 5,
                y: 2
            },
        ]


        country1NodeSelectors.forEach(selector => {
            console.log('select', selector)
            grid[selector.x]![selector.y].data.owner = 'player-1'
        })
        country2NodeSelectors.forEach(selector => {
            grid[selector.x]![selector.y].data.owner = 'player-2'
        })


        // Add more countries as needed

        setNodes([..._.flatten(grid)]);
    }, []);



    const HexagonNode = ({ data }: { data: any }) => {

        const { owner } = data;

        const background = COLOR_MAPPING[owner] || COLOR_MAPPING.default;

        return (
            <div
                style={{
                    width: GRID_CELL_WIDTH_PX,
                    height: GRID_CELL_WIDTH_PX,
                    background,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                }}
            >
                <div className="text-sm">
                    {data.label}
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
        height: '95vh',
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