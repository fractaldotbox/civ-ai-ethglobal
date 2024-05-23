export type Tile = {
    i: number
    j: number
    building?: TileBuilding,
    owner?: string
}

export type Grid = Tile[][]



export enum TileResource {
   Food = 'food',
   Science = 'science'
} 

export enum TileBuilding {
    City = 'city',
    SolarPanel = 'solar-panel'
}


export const LABEL_BY_TILE_RESOURCE = {
    [TileResource.Food]: '🌽',
    [TileResource.Science]: '🧪',
}



export const generateGrid =  (rowSize:number, columnSize:number)=> Array(columnSize).fill(null).map(() => Array(rowSize).fill(null)) as Grid;
