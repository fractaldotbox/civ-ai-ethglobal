import { findAdjacentEmptyTile } from "./action"
import { Grid } from "./grid"




export const buildAction = (grid:Grid)=>{

    const tile = findAdjacentEmptyTile(grid)

    if(!tile){
        return null;
    }
    const { i, j }= tile;
    return {
        type: 'build',
        payload: {
            x: 1,
            y: 2,
            building: 'city'
        }
    }
}