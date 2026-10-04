import type { Position } from "../domain/types";

export type Tile = "floor" | "wall" | "grass" | "hut" | "grove" | "meadow" | "water";

export interface MapObject {
  readonly id: string;
  readonly kind: "professor" | "sign" | "healer" | "blocker";
  readonly position: Position;
  readonly message: string;
}

export interface GameMap {
  readonly width: number;
  readonly height: number;
  readonly tiles: readonly Tile[];
  readonly start: Position;
  readonly objects: readonly MapObject[];
}

const LEGEND: Record<string, Tile> = {
  "#": "wall",
  ".": "floor",
  ",": "grass",
  "H": "hut",
  "G": "grove",
  "M": "meadow",
  "~": "water"
};

const RAW_MAP = [
  "################",
  "#....G....,,,,M#",
  "#..........,,,,#",
  "#..####........#",
  "#..#..#........#",
  "#..#..#..~~~~..#",
  "#..H.....~~~~..#",
  "#..............#",
  "#..............#",
  "################"
] as const;

export function parseAsciiMap(rows: readonly string[]): Pick<GameMap, "width" | "height" | "tiles"> {
  const width = rows[0]?.length ?? 0;
  if (width === 0) {
    throw new Error("Map must contain at least one row.");
  }
  const tiles = rows.flatMap((row, y) => {
    if (row.length !== width) {
      throw new Error(`Map row ${y} has width ${row.length}; expected ${width}.`);
    }
    return [...row].map((symbol) => {
      const tile = LEGEND[symbol];
      if (!tile) {
        throw new Error(`Unknown map tile symbol: ${symbol}`);
      }
      return tile;
    });
  });
  return { width, height: rows.length, tiles };
}

const parsed = parseAsciiMap(RAW_MAP);

export const HOME_MAP: GameMap = {
  ...parsed,
  start: { x: 2, y: 7 },
  objects: [
    {
      id: "professor",
      kind: "professor",
      position: { x: 5, y: 1 },
      message: "Professor Rowanbark offers you a Briarbrook starter."
    },
    {
      id: "healing-hut",
      kind: "healer",
      position: { x: 3, y: 6 },
      message: "The Healing Hut smells like mint and river tea."
    },
    {
      id: "meadow-gate",
      kind: "blocker",
      position: { x: 14, y: 1 },
      message: "A braided gate marks the path to Badge Meadow."
    },
    {
      id: "route-sign",
      kind: "sign",
      position: { x: 8, y: 2 },
      message: "Route 1: tall grass ahead. Step with care."
    }
  ]
};
