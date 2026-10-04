import { describe, expect, it } from "vitest";
import { attemptCapture, cancelAction, chooseStarter, createInitialState, interact, moveTrainer, useMove } from "./game";
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

  it("captures wild creatures into the active party and field guide", () => {
    const starterState = chooseStarter(createInitialState(), "cindillo");
    const state = {
      ...starterState,
      battle: {
        kind: "wild" as const,
        player: starterState.party[0],
        opponent: { instanceId: "mossbit-test", speciesId: "mossbit", level: 3, hp: 1 },
        message: "Wild Mossbit appeared."
      },
      guide: { ...starterState.guide, mossbit: "seen" as const }
    };

    const afterCapture = attemptCapture(state, encounterRng);

    expect(afterCapture.battle).toBeNull();
    expect(afterCapture.captureCharms).toBe(4);
    expect(afterCapture.party.map((creature) => creature.speciesId)).toContain("mossbit");
    expect(afterCapture.guide.mossbit).toBe("captured");
  });

  it("awards the Meadow Badge after the Badge Meadow trainer battle", () => {
    const starterState = chooseStarter(createInitialState(), "cindillo");
    const state = {
      ...starterState,
      battle: {
        kind: "trainer" as const,
        player: starterState.party[0],
        opponent: { instanceId: "petalark-test", speciesId: "petalark", level: 4, hp: 1 },
        remainingOpponents: [{ instanceId: "bramblet-test", speciesId: "bramblet", level: 5, hp: 1 }],
        message: "Badge Meadow trainer Liora challenges you."
      }
    };

    const afterFirst = useMove(state, 1);
    const afterSecond = useMove(afterFirst, 1);

    expect(afterSecond.meadowBadge).toBe(true);
    expect(afterSecond.pathOpen).toBe(true);
    expect(afterSecond.winPanel).toBe(true);
    expect(afterSecond.dialogue[0]).toContain("Meadow Badge");
  });

  it("backs out of wild encounters with Cancel Control", () => {
    const starterState = chooseStarter(createInitialState(), "cindillo");
    const state = {
      ...starterState,
      battle: {
        kind: "wild" as const,
        player: starterState.party[0],
        opponent: { instanceId: "mossbit-test", speciesId: "mossbit", level: 3, hp: 10 },
        message: "Wild Mossbit appeared."
      }
    };

    const cancelled = cancelAction(state);

    expect(cancelled.battle).toBeNull();
    expect(cancelled.dialogue[0]).toContain("backed away");
  });

  it("blackouts to the Healing Hut with charm loss when no party creature remains", () => {
    const starterState = chooseStarter(createInitialState(), "sprigget");
    const state = {
      ...starterState,
      captureCharms: 3,
      battle: {
        kind: "wild" as const,
        player: { ...starterState.party[0], hp: 1 },
        opponent: { instanceId: "flarabbit-test", speciesId: "flarabbit", level: 9, hp: 30 },
        message: "Wild Flarabbit appeared."
      },
      party: [{ ...starterState.party[0], hp: 1 }]
    };

    const afterMove = useMove(state, 0);

    expect(afterMove.battle).toBeNull();
    expect(afterMove.position).toEqual({ x: 3, y: 7 });
    expect(afterMove.captureCharms).toBe(2);
    expect(afterMove.party[0].hp).toBeGreaterThan(1);
  });

  it("Healing Hut restores party and restocks basic capture supplies", () => {
    const starterState = chooseStarter(createInitialState(), "sprigget");
    const state = {
      ...starterState,
      position: { x: 3, y: 7 },
      facing: "north" as const,
      captureCharms: 1,
      party: [{ ...starterState.party[0], hp: 1 }]
    };

    const healed = interact(state);

    expect(healed.party[0].hp).toBeGreaterThan(1);
    expect(healed.captureCharms).toBe(5);
  });
});
