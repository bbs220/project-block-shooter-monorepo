// explicit types
export interface MapWall {
  name: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

export interface MapData {
  name: string;
  floor: {
    width: number;
    depth: number;
    thickness: number;
    x: number;
    y: number;
    z: number;
  };
  walls: MapWall[];
}

// reusable factory function that generates perfect X/Y/Z math for ANY size box arena!
export function createBoxArena(
  name: string,
  floorWidth: number,
  floorDepth: number,
  floorThick: number,
  wallHeight: number,
  wallThick: number,
): MapData {
  const halfHeight = wallHeight / 2;

  return {
    name,
    floor: {
      width: floorWidth,
      depth: floorDepth,
      thickness: floorThick,
      x: 0,
      y: -floorThick / 2,
      z: 0,
    },
    walls: [
      {
        name: "north",
        x: 0,
        y: halfHeight,
        z: -floorDepth / 2,
        width: floorWidth,
        height: wallHeight,
        depth: wallThick,
      },
      {
        name: "south",
        x: 0,
        y: halfHeight,
        z: floorDepth / 2,
        width: floorWidth,
        height: wallHeight,
        depth: wallThick,
      },
      {
        name: "east",
        x: floorWidth / 2,
        y: halfHeight,
        z: 0,
        width: wallThick,
        height: wallHeight,
        depth: floorDepth,
      },
      {
        name: "west",
        x: -floorWidth / 2,
        y: halfHeight,
        z: 0,
        width: wallThick,
        height: wallHeight,
        depth: floorDepth,
      },
    ],
  };
}

export const MAPS: Record<string, MapData> = {
  // generates a 100x100 map with 10m high walls instantly
  arena_01: createBoxArena("The Grid", 100, 100, 1, 10, 1),
};
