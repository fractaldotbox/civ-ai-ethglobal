import { Grid } from "./grid";

// prevent error 
export const santizeAction = ()=>{

}


export const generateGrid =  (rowSize:number, columnSize:number)=> Array(columnSize).fill(null).map(() => Array(rowSize).fill(null)) as Grid;

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
    return null;
}