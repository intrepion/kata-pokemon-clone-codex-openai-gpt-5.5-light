import { describe, expect, it } from "vitest";
import { chooseStarter, createInitialState } from "./game";
import { parseSavedState, serializeState } from "./storage";

describe("versioned autosave", () => {
  it("round-trips journey state without restoring active battles", () => {
    const state = chooseStarter(createInitialState(), "otterune");

    const restored = parseSavedState(serializeState({ ...state, battle: { kind: "wild", player: state.party[0], opponent: state.party[0], message: "test" } }));

    expect(restored?.version).toBe(1);
    expect(restored?.starterId).toBe("otterune");
    expect(restored?.battle).toBeNull();
  });

  it("resets corrupt or incompatible saves", () => {
    expect(parseSavedState("not-json")).toBeNull();
    expect(parseSavedState(JSON.stringify({ version: 99 }))).toBeNull();
  });
});
