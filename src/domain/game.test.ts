import { describe, expect, it } from "vitest";
import { chooseStarter, createInitialState, interact } from "./game";

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
});
