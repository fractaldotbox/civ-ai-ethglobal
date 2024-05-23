import { Grid, TileBuilding } from "./grid";
import _ from 'lodash';

// prevent error 
export const santizeAction = ()=>{

}

export enum ActionType {
    Build = 'build',
    Move = 'move'
}

export type Action = {
    i: number,
    j: number,
    payload: any,
    type: ActionType   
}

// set hard rules only, leave ai for search optimization
export const findAdjacentEmptyTile = (grid:Grid)=>{
    // itereate from the edge of grid and stop at first non empty, then BFS
    const rows = grid.length;
    const cols = grid[0]!.length;

    const di = [-1, 0, 1, 0];
    const dj = [0, 1, 0, -1];

    const visited = Array(rows).fill(0).map(() => Array(cols).fill(false)) as boolean[][];

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(grid[i]![j] !== null) { // assuming non-null represents a non-empty cell
                // BFS from the non-empty cell
                const queue = [{ i, j}];
                visited[i]![j] = true;

                while(queue.length > 0) {
                    const {i, j} = queue.shift()!;

                    for(let k = 0; k < 4; k++) {
                        const ni = i + di[k]!;
                        const nj = j + dj[k]!;

                        if(ni >= 0 && ni < rows && nj >= 0 && nj < cols && !visited[ni]![nj]) {
                            visited[ni]![nj] = true;

                            if(grid[ni]![nj] === null) {
                                return {i: ni, j: nj};
                            } else {
                                queue.push({i: ni, j: nj});
                            }
                        }
                    }
                }
            }
        }
    }

    if(_.flatten(visited).every((isVisited:boolean) => !isVisited)) {
        return {i:0, j:0}
    }

    return null;
}


export const createBuildAction = (grid:Grid)=>{

    const tile = findAdjacentEmptyTile(grid)

    if(!tile){
        return null;
    }
    const { i, j }= tile;
    return {
        type: ActionType.Build,
        i,
        j,
        payload: {
            owner: 'player-1',
            building: TileBuilding.City
        }
    }
}

export const applyAction = (grid:Grid, action:Action)=>{
    if(!action){
        return  grid;
    }

    const {i, j , payload}= action

    grid[i]![j] = {
        i,
        j,
        ...grid[i]![j],
        ...payload
    }

    return grid;
}