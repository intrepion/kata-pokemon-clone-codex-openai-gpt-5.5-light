import type { GameState } from "./types";

export const SAVE_KEY = "briarbrook-league-v1";

export function serializeState(state: GameState): string {
  return JSON.stringify({ ...state, battle: null });
}

export function parseSavedState(raw: string | null): GameState | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (parsed.version !== 1 || !parsed.position || !parsed.facing || !Array.isArray(parsed.party)) {
      return null;
    }
    return {
      version: 1,
      position: parsed.position,
      facing: parsed.facing,
      starterId: parsed.starterId ?? null,
      party: parsed.party,
      captureCharms: parsed.captureCharms ?? 5,
      guide: parsed.guide ?? {},
      battle: null,
      dialogue: parsed.dialogue ?? ["Welcome back to Briarbrook League."]
    };
  } catch {
    return null;
  }
}
