import type { GameState } from "../domain/types";
import { HOME_MAP, type Tile } from "../data/maps";
import { objectAt } from "../world/map";

const TILE_SIZE = 24;

const TILE_COLORS: Record<Tile, string> = {
  floor: "#d7c98a",
  wall: "#314533",
  grass: "#5fa34d",
  hut: "#b56a3c",
  grove: "#74a83f",
  meadow: "#dcb84d",
  water: "#4a8cad"
};

export function drawScene(canvas: HTMLCanvasElement, state: GameState): void {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  canvas.width = HOME_MAP.width * TILE_SIZE;
  canvas.height = HOME_MAP.height * TILE_SIZE;
  context.imageSmoothingEnabled = false;
  for (let y = 0; y < HOME_MAP.height; y += 1) {
    for (let x = 0; x < HOME_MAP.width; x += 1) {
      const tile = HOME_MAP.tiles[y * HOME_MAP.width + x];
      context.fillStyle = TILE_COLORS[tile];
      context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      context.strokeStyle = "rgba(37, 39, 28, 0.18)";
      context.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      const object = objectAt(HOME_MAP, { x, y });
      if (object) {
        context.fillStyle = object.kind === "professor" ? "#efe5c5" : "#48392a";
        context.fillRect(x * TILE_SIZE + 6, y * TILE_SIZE + 6, 12, 12);
      }
    }
  }
  context.fillStyle = "#29314f";
  context.fillRect(state.position.x * TILE_SIZE + 5, state.position.y * TILE_SIZE + 4, 14, 16);
  context.fillStyle = "#f2dca1";
  context.fillRect(state.position.x * TILE_SIZE + 8, state.position.y * TILE_SIZE + 2, 8, 8);
}
