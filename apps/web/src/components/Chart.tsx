'use client'
import React, { createContext, useContext } from 'react';
import dynamic from "next/dynamic";
import { useGameContext } from './GameContextProvider';
import { COLOR_BY_PLAYER, COLOR_CLASS_BY_PLAYER } from '@repo/engine';

// https://github.com/plotly/react-plotly.js/issues/272
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

export type ChartDataWrapper = {
    data: any[]
};

// Create the context
export const ChartDataContext = createContext<ChartDataWrapper | null>(null);


const mapPrimeAsData = (primes: number[], playerKey: string, color: string) => {
    console.log('prime data', primes, playerKey, color)
    return {
        type: "scatterpolargl",
        r: primes,
        theta: primes.map(t => t * 2 * Math.PI),
        mode: "markers",
        name: playerKey,
        marker: {
            color,
            size: 15,
            line: {
                color: "white"
            },
            opacity: 0.7
        },

        cliponaxis: false
    };
}

export const ChartDataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { gameState, send } = useGameContext();
    // const { data } = React.useContext(ChartDataContext);

    if (!gameState) {
        return
    }

    const { primesByPlayerKey } = gameState;

    const data =
        Object.keys(primesByPlayerKey).map((playerKey) => {
            return mapPrimeAsData(primesByPlayerKey[playerKey] || [], playerKey, COLOR_BY_PLAYER[playerKey]!)
        })


    return (
        <ChartDataContext.Provider value={{
            data
        }}>
            {children}
        </ChartDataContext.Provider>
    );

}

export default () => {

    const { data } = useContext(ChartDataContext) || {};

    // const { data, layout } = createChartData();

    const numPoints = 100;
    const theta = [];
    const r = [];

    for (let i = 0; i < numPoints; i++) {
        theta.push(i * 2 * Math.PI / numPoints); // Radian values
        r.push(Math.sin(2 * theta[i]!)); // Example function
    }


    return (
        <div>
            <Plot
                data={data}
                layout={{
                    title: "Chart",
                    font: {
                        size: 12
                    },
                    width: 1024,
                    height: 1024,
                    autosize: true,
                    showlegend: false,
                    polar: {
                        bgcolor: "rgb(223, 223, 223)",
                        angularaxis: {
                            tickwidth: 4,
                            direction: "counterclockwise",
                            // old type not supported
                            // @ts-ignore
                            autosize: true,
                            thetaunit: "radians",
                            // tickmode: 'array',
                            // tickvals: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI],
                            // ticktext: ['0', 'π/2', 'π', '3π/2', '2π']
                        },
                        radialaxis: {
                            // side: "counterclockwise",
                            showline: false,
                            linewidth: 0,
                            // tickwidth: 2,
                            gridcolor: "transparent",
                            gridwidth: 0
                        }
                    },
                    paper_bgcolor: "rgb(223, 223, 223)",
                }}
            />
        </div>
    )
}