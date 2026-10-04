import { describe, expect, it } from "vitest";
import { HOME_MAP, parseAsciiMap } from "../data/maps";
import { createInitialState, moveTrainer } from "../domain/game";
import { isWalkable, tileAt } from "./map";

describe("Briarbrook map movement", () => {
  it("blocks wall movement while preserving facing", () => {
    const state = createInitialState();

    const moved = moveTrainer(moveTrainer(state, "west"), "west");

    expect(moved.position).toEqual({ x: 1, y: 7 });
    expect(moveTrainer(moved, "west").position).toEqual({ x: 1, y: 7 });
    expect(moveTrainer(moved, "west").facing).toBe("west");
  });

  it("parses known tiles and rejects unknown symbols", () => {
    expect(tileAt(HOME_MAP, { x: 1, y: 1 })).toBe("floor");
    expect(isWalkable(HOME_MAP, { x: 0, y: 0 })).toBe(false);
    expect(() => parseAsciiMap([".?"])).toThrow("Unknown map tile symbol");
  });
});
