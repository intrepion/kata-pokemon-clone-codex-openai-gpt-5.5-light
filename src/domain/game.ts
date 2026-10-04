import { STARTERS } from "../data/starters";
import { HOME_MAP } from "../data/maps";
import type { Direction, GameState, Starter } from "./types";
import { facedPosition, move, objectAt } from "../world/map";

export function createInitialState(): GameState {
  return {
    position: HOME_MAP.start,
    facing: "north",
    starterId: null,
    dialogue: ["Welcome to Briarbrook League."]
  };
}

export function chooseStarter(state: GameState, starterId: Starter["id"]): GameState {
  const starter = STARTERS.find((candidate) => candidate.id === starterId);
  if (!starter) {
    throw new Error(`Unknown starter: ${starterId}`);
  }
  return {
    ...state,
    starterId,
    dialogue: [`${starter.name} joined your party.`, ...state.dialogue].slice(0, 5)
  };
}

export function moveTrainer(state: GameState, direction: Direction): GameState {
  return move(state, HOME_MAP, direction);
}

export function interact(state: GameState): GameState {
  const object = objectAt(HOME_MAP, facedPosition(state));
  if (!object) {
    return { ...state, dialogue: ["Nothing responds.", ...state.dialogue].slice(0, 5) };
  }
  return { ...state, dialogue: [object.message, ...state.dialogue].slice(0, 5) };
}
