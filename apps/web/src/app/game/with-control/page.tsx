'use client';
import _ from 'lodash';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
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
    TileWeatherStation,
} from '@repo/engine';
import { REGION_OFFSET_Y, getOffsetY, mapSnapshotAsNodes } from '../../../../vm/grid';
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

                const labelClassName = count > 2 ? "text-lg m-[-6px]" : 'text-xl m-[-3px]';
                if (count > 0) {
                    return (
                        <div className="flex flex-col" key={"row" + resource}>
                            {Array(count)
                                .fill(null)
                                .map((v, i) => {
                                    return <div key={"tile-" + i} className={labelClassName}>{LABEL_BY_TILE_RESOURCE[resource]}</div>;
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


export const LABEL_BY_WEATHER_STATION = {

    [TileWeatherStation.SolarPanel]: <div>
        <svg fill="#ffffff" width="100%" height="100%" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg"><path d="M431.98 448.01l-47.97.05V416h-128v32.21l-47.98.05c-8.82.01-15.97 7.16-15.98 15.99l-.05 31.73c-.01 8.85 7.17 16.03 16.02 16.02l223.96-.26c8.82-.01 15.97-7.16 15.98-15.98l.04-31.73c.01-8.85-7.17-16.03-16.02-16.02zM585.2 26.74C582.58 11.31 568.99 0 553.06 0H86.93C71 0 57.41 11.31 54.79 26.74-3.32 369.16.04 348.08.03 352c-.03 17.32 14.29 32 32.6 32h574.74c18.23 0 32.51-14.56 32.59-31.79.02-4.08 3.35 16.95-54.76-325.47zM259.83 64h120.33l9.77 96H250.06l9.77-96zm-75.17 256H71.09L90.1 208h105.97l-11.41 112zm16.29-160H98.24l16.29-96h96.19l-9.77 96zm32.82 160l11.4-112h149.65l11.4 112H233.77zm195.5-256h96.19l16.29 96H439.04l-9.77-96zm26.06 256l-11.4-112H549.9l19.01 112H455.33z" /></svg>
    </div>,
    [TileWeatherStation.WindTurbine]: <div>
        <svg fill="#ffffff" width="100%" height="100%" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M15.65625 0.28125C15.367188 0.300781 15.09375 0.375 14.8125 0.5C13.691406 1.003906 13.226563 2.195313 13.0625 3.53125C12.898438 4.867188 12.992188 6.507813 13.3125 8.4375C13.941406 12.230469 15.4375 17.109375 17.59375 22.40625C14.425781 27.160156 12 31.628906 10.625 35.21875C9.925781 37.046875 9.484375 38.660156 9.375 40C9.265625 41.339844 9.46875 42.59375 10.46875 43.3125C11.464844 44.03125 12.734375 43.839844 13.96875 43.3125C15.203125 42.785156 16.585938 41.863281 18.09375 40.625C19.089844 39.804688 20.15625 38.839844 21.25 37.75L20.3125 48.90625C20.28125 49.265625 20.445313 49.613281 20.742188 49.820313C21.039063 50.023438 21.421875 50.054688 21.746094 49.898438C22.070313 49.742188 22.289063 49.421875 22.3125 49.0625L23.46875 35.40625C24.441406 34.339844 25.4375 33.160156 26.4375 31.9375L27.6875 49.0625C27.710938 49.421875 27.929688 49.742188 28.253906 49.898438C28.578125 50.054688 28.960938 50.023438 29.257813 49.820313C29.554688 49.613281 29.71875 49.265625 29.6875 48.90625L28.3125 29.96875C33.90625 30.3125 38.921875 30.160156 42.65625 29.5625C44.585938 29.253906 46.191406 28.828125 47.40625 28.25C48.621094 27.671875 49.59375 26.878906 49.71875 25.65625C49.84375 24.429688 49.042969 23.433594 47.96875 22.625C46.894531 21.816406 45.394531 21.09375 43.5625 20.40625C39.960938 19.054688 35.011719 17.875 29.34375 17.09375C26.8125 11.972656 24.140625 7.636719 21.71875 4.65625C20.488281 3.140625 19.324219 1.949219 18.21875 1.1875C17.664063 0.804688 17.109375 0.519531 16.53125 0.375C16.242188 0.300781 15.945313 0.261719 15.65625 0.28125 Z M 15.8125 2.28125C16.050781 2.285156 16.460938 2.40625 17.09375 2.84375C17.9375 3.425781 19 4.480469 20.15625 5.90625C22.089844 8.285156 24.269531 11.863281 26.40625 15.90625C25.941406 15.816406 25.492188 15.6875 25 15.6875C22.273438 15.6875 19.917969 17.183594 18.625 19.375C17.023438 15.117188 15.8125 11.136719 15.3125 8.125C15.011719 6.308594 14.9375 4.800781 15.0625 3.78125C15.1875 2.761719 15.472656 2.378906 15.625 2.3125C15.664063 2.296875 15.734375 2.28125 15.8125 2.28125 Z M 25 17.6875C26.125 17.6875 27.164063 18.046875 28.03125 18.625C28.0625 18.648438 28.09375 18.667969 28.125 18.6875C28.179688 18.746094 28.242188 18.800781 28.3125 18.84375C29.617188 19.847656 30.46875 21.386719 30.46875 23.15625C30.46875 25.320313 29.191406 27.140625 27.375 28.03125C27.285156 28.070313 27.199219 28.125 27.125 28.1875C27.105469 28.195313 27.082031 28.207031 27.0625 28.21875C26.421875 28.480469 25.726563 28.625 25 28.625C21.972656 28.625 19.53125 26.183594 19.53125 23.15625C19.53125 23.148438 19.574219 23.035156 19.59375 22.78125C19.59375 22.75 19.59375 22.71875 19.59375 22.6875C19.59375 22.65625 19.59375 22.625 19.59375 22.59375C19.609375 22.542969 19.617188 22.492188 19.625 22.4375C19.976563 19.75 22.214844 17.6875 25 17.6875 Z M 25 19C22.800781 19 21 20.800781 21 23C21 25.199219 22.800781 27 25 27C27.199219 27 29 25.199219 29 23C29 20.800781 27.199219 19 25 19 Z M 31.40625 19.5C35.921875 20.242188 40.003906 21.203125 42.875 22.28125C44.597656 22.929688 45.929688 23.601563 46.75 24.21875C47.570313 24.835938 47.734375 25.273438 47.71875 25.4375C47.703125 25.601563 47.457031 25.996094 46.53125 26.4375C45.605469 26.878906 44.160156 27.304688 42.34375 27.59375C39.3125 28.078125 35.136719 28.171875 30.5625 28C31.710938 26.691406 32.46875 25.03125 32.46875 23.15625C32.46875 21.804688 32.039063 20.589844 31.40625 19.5 Z M 25 21C26.117188 21 27 21.882813 27 23C27 24.117188 26.117188 25 25 25C23.882813 25 23 24.117188 23 23C23 21.882813 23.882813 21 25 21 Z M 18.03125 25.53125C19.023438 28.429688 21.664063 30.535156 24.875 30.59375C21.988281 34.105469 19.167969 37.160156 16.8125 39.09375C15.394531 40.257813 14.128906 41.066406 13.1875 41.46875C12.246094 41.871094 11.789063 41.785156 11.65625 41.6875C11.523438 41.589844 11.292969 41.179688 11.375 40.15625C11.457031 39.132813 11.84375 37.65625 12.5 35.9375C13.597656 33.074219 15.59375 29.40625 18.03125 25.53125Z" />
        </svg>
    </div>,
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
        const { grid, region1, region2 } = gameState;
        console.log('nodes update')
        const nodes = mapSnapshotAsNodes(
            {
                context: {
                    grid,
                },
            },
            GRID_TILE_WIDTH,
        );

        // TODO columnSize

        const weatherNodes = _.range(0, 10).map((i: number) => {
            return {
                id: 'weather' + i,
                type: 'weather',
                data: {
                    weatherStation: i % 2 ? TileWeatherStation.SolarPanel : TileWeatherStation.WindTurbine,
                },
                position: {
                    x: -150,
                    y: i * GRID_TILE_WIDTH + 25 + getOffsetY(i, grid.length),
                },
            }
        }
        )

        const weatherLegendNodes = [
            {
                id: 'weather=legend-1',
                type: 'weather-legend',
                data: {
                    ...region1
                },
                position: {
                    x: -380,
                    y: 200,
                },
            },
            {
                id: 'weather=legend-2',
                type: 'weather-legend',
                data: {
                    ...region2
                },
                position: {
                    x: -380,
                    y: 700 + getOffsetY(5, grid.length),
                },
            }
        ]
        // Add more countries as needed

        setNodes([...weatherNodes, ...weatherLegendNodes, ...nodes]);
    }, [gameState]);


    const WeatherLegendNode = (node: WrapNodeProps<any>) => {
        const { data, id, xPos, yPos } = node;

        return (
            <div
                className="text-4xl p-2">
                {data?.name}
            </div>
        )
    }

    const WeatherNode = (node: WrapNodeProps<any>) => {
        const { data, id, xPos, yPos } = node;
        const { weatherStation } = data;



        return (
            <div
                className="bg-black text-xl p-2">
                <div className="flex flex-col">
                    <div className="text-xl">
                        {LABEL_BY_WEATHER_STATION[weatherStation]}
                    </div>
                </div>
            </div>
        )
    }

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
        'weather-legend': WeatherLegendNode,
        weather: WeatherNode,
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
