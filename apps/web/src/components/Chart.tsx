'use client'
import React from 'react';
import dynamic from "next/dynamic";

// https://github.com/plotly/react-plotly.js/issues/272
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })


export default () => {

    // const { data, layout } = createChartData();

    const numPoints = 100;
    const theta = [];
    const r = [];

    for (let i = 0; i < numPoints; i++) {
        theta.push(i * 2 * Math.PI / numPoints); // Radian values
        r.push(Math.sin(2 * theta[i]!)); // Example function
    }

    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

    const data = [
        {
            type: "scatterpolargl",
            r: primes,
            theta: primes.map(t => t * 2 * Math.PI),
            mode: "markers",
            name: "Trial 1",
            marker: {
                color: "rgb(27,158,119)",
                size: 15,
                line: {
                    color: "white"
                },
                opacity: 0.7
            },
            cliponaxis: false
        },
    ]

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