export type Tile = {
    i: number
    j: number
    build?: TileBuilding,
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