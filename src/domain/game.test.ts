import { describe, expect, it } from "vitest";
import { chooseStarter, createInitialState, interact, moveTrainer, useMove } from "./game";
import type { Rng } from "./rng";

const encounterRng: Rng = {
  next: () => 0
};

describe("starter selection and interaction", () => {
  it("adds the selected starter to journey state", () => {
    const state = chooseStarter(createInitialState(), "cindillo");

    expect(state.starterId).toBe("cindillo");
    expect(state.dialogue[0]).toContain("Cindillo joined");
  });

  it("reports empty facing interactions", () => {
    const state = interact(createInitialState());

    expect(state.dialogue[0]).toBe("Nothing responds.");
  });

  it("starts wild encounters from tall grass steps", () => {
    let state = chooseStarter(createInitialState(), "sprigget");
    state = moveTrainer(state, "east");
    state = moveTrainer(state, "east");
    state = moveTrainer(state, "east");
    state = moveTrainer(state, "east");
    state = moveTrainer(state, "east");
    state = moveTrainer(state, "east");
    state = moveTrainer(state, "north");
    state = moveTrainer(state, "north");
    state = moveTrainer(state, "north");
    state = moveTrainer(state, "north");
    state = moveTrainer(state, "north");
    state = moveTrainer(state, "east");
    state = moveTrainer(state, "east");
    state = moveTrainer(state, "east", encounterRng);

    expect(state.battle?.kind).toBe("wild");
    expect(state.dialogue[0]).toContain("Wild");
  });

  it("clears a won wild battle", () => {
    const state = {
      ...chooseStarter(createInitialState(), "cindillo"),
      battle: {
        kind: "wild" as const,
        player: chooseStarter(createInitialState(), "cindillo").party[0],
        opponent: { instanceId: "mossbit-test", speciesId: "mossbit", level: 3, hp: 1 },
        message: "Wild Mossbit appeared."
      }
    };

    const afterMove = useMove(state, 1);

    expect(afterMove.battle).toBeNull();
    expect(afterMove.dialogue[0]).toContain("Mossbit fainted");
  });
});
