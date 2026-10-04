import type { Direction, GameState, Position } from "../domain/types";
import type { GameMap, MapObject, Tile } from "../data/maps";

export const STEP_BY_DIRECTION: Record<Direction, Position> = {
  north: { x: 0, y: -1 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
  east: { x: 1, y: 0 }
};

export function tileAt(map: GameMap, position: Position): Tile | null {
  if (position.x < 0 || position.y < 0 || position.x >= map.width || position.y >= map.height) {
    return null;
  }
  return map.tiles[position.y * map.width + position.x] ?? null;
}

export function objectAt(map: GameMap, position: Position): MapObject | undefined {
  return map.objects.find((object) => object.position.x === position.x && object.position.y === position.y);
}

export function isWalkable(map: GameMap, position: Position): boolean {
  const tile = tileAt(map, position);
  if (!tile || tile === "wall" || tile === "water") {
    return false;
  }
  const object = objectAt(map, position);
  return object?.kind !== "professor" && object?.kind !== "blocker";
}

export function move(state: GameState, map: GameMap, direction: Direction): GameState {
  const delta = STEP_BY_DIRECTION[direction];
  const next = { x: state.position.x + delta.x, y: state.position.y + delta.y };
  if (!isWalkable(map, next)) {
    return { ...state, facing: direction };
  }
  return { ...state, facing: direction, position: next };
}

export function facedPosition(state: GameState): Position {
  const delta = STEP_BY_DIRECTION[state.facing];
  return { x: state.position.x + delta.x, y: state.position.y + delta.y };
}
