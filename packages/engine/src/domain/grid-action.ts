import { Grid, TileBuilding, TileResource } from './grid';

// trim numbers
export function regionBoost(region: {
  grid: Grid;
  windSpeed: number;
  solarIrradiance: number;
  startRow: number;
  endRow: number;
}
) {
  let updatedRegion = structuredClone(region);
  for (let i = 0; i < updatedRegion.grid.length / 2; i++) {
    for (let j = 0; j < updatedRegion.grid[i].length; j++) {

      if (((i % 2 === 0 && updatedRegion.windSpeed > 5) ||
        (i % 2 === 1 && updatedRegion.solarIrradiance > 500))) {
        const resource = updatedRegion.grid[i][j].resourceByType;

        if (resource[TileResource.Energy] !== undefined) {
          resource[TileResource.Energy] *= 2;
        }
        updatedRegion.grid[i][j].resourceByType = resource;
      }
    }
  }

  return updatedRegion.grid;
}
