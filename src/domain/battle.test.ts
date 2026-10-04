import { describe, expect, it } from "vitest";
import { createCreature, usePlayerMove } from "./battle";

describe("battle turns", () => {
  it("uses simple alternating turns when the opponent survives", () => {
    const player = createCreature("sprigget", 5);
    const opponent = createCreature("mossbit", 3);

    const battle = usePlayerMove({ kind: "wild", player, opponent, message: "start" }, 0);

    expect(battle.opponent.hp).toBeLessThan(opponent.hp);
    expect(battle.player.hp).toBeLessThan(player.hp);
    expect(battle.message).toContain("used");
  });

  it("stops before the opponent turn when the player move faints it", () => {
    const player = createCreature("cindillo", 5);
    const opponent = { ...createCreature("mossbit", 3), hp: 1 };

    const battle = usePlayerMove({ kind: "wild", player, opponent, message: "start" }, 1);

    expect(battle.opponent.hp).toBe(0);
    expect(battle.player.hp).toBe(player.hp);
    expect(battle.message).toContain("fainted");
  });
});
