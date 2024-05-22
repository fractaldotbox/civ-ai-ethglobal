import {describe, expect, test } from 'vitest'
import { Grid } from './grid';
import { findAdjacentEmptyTile, generateGrid } from './action';

describe('Grid', () => {

    test('#findAdjacentEmptyTile middle', (done:any)=>{

        let grid = generateGrid(5, 5);

        grid[1]![1] = {
            i: 1,
            j: 1
        };

        grid[3]![3] = {
            i: 3,
            j: 3
        };

        const tile = findAdjacentEmptyTile(grid);
        expect(tile).toEqual({i: 0, j: 1})
    })
    test('#findAdjacentEmptyTile edge', (done:any)=>{
 
        let grid = generateGrid(5, 5);

        grid[4]![4] = {
            i: 4,
            j: 4
        };

        const tile = findAdjacentEmptyTile(grid);
        expect(tile).toEqual({i: 3, j: 4})
    })
    test('#findAdjacentEmptyTile full', (done:any)=>{
 
        let grid = generateGrid(2, 2);

        [0,1].forEach(i=>{
            [0,1].forEach(j=>{
                grid[i]![j] = {
                    i,
                    j
                };
            })
        })

        const tile = findAdjacentEmptyTile(grid);
        expect(tile).toEqual(null)
    })
});


