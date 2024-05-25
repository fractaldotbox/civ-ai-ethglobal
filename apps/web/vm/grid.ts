import { Node } from 'reactflow';
import { Tile } from '@repo/engine';

export const mapSnapshotAsNodes = (
  snapshot: any,
  positionScale: number,
): Node<Tile>[][] => {
  const { grid } = snapshot.context;

  const margin = positionScale / 5;
  const nodes = grid.map((row: Tile[]) => {
    return row.map((tile: any) => {
      const { i, j } = tile;

      const xOffset = j % 2 === 0 ? 0 : (positionScale + margin) / 2;

      return {
        id: 'id' + i + j,
        data: {
          ...tile,
        },
        position: {
          x: i * (positionScale + margin) + xOffset,
          y: j * positionScale,
        },
      };
    });
  });

  return nodes.flat();
};
