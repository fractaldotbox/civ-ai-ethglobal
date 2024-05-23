import {describe, expect, test } from 'vitest'
import { Grid, generateGrid } from './grid';
import { applyAction, createBuildAction, findAdjacentEmptyTile } from './action';

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

    test('#findAdjacentEmptyTile empty', (done:any)=>{
 
        let grid = generateGrid(2, 2);


        const tile = findAdjacentEmptyTile(grid);
        expect(tile).toEqual({i: 0, j: 0})
    })

    test('execute build action', ()=>{
        const grid = generateGrid(5, 5);
        const action = createBuildAction(grid);

        applyAction(grid, action)
    })
});


