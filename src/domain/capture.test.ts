import { describe, expect, it } from "vitest";
import { createCreature } from "./battle";
import { captureChance } from "./capture";

describe("capture chance", () => {
  it("improves when the wild creature is weakened and already seen", () => {
    const player = createCreature("sprigget", 5);
    const healthyOpponent = createCreature("mossbit", 3);
    const weakOpponent = { ...healthyOpponent, hp: 1 };

    const healthyChance = captureChance({ kind: "wild", player, opponent: healthyOpponent, message: "" }, false);
    const weakSeenChance = captureChance({ kind: "wild", player, opponent: weakOpponent, message: "" }, true);

    expect(weakSeenChance).toBeGreaterThan(healthyChance);
    expect(weakSeenChance).toBeLessThanOrEqual(0.9);
  });
});
