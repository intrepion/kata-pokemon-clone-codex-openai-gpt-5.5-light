import { ROUTE_ONE_CREATURE_IDS, STARTERS } from "../data/starters";
import { HOME_MAP } from "../data/maps";
import type { Direction, GameState, Starter } from "./types";
import { facedPosition, move, objectAt, tileAt } from "../world/map";
import { createCreature, healCreature, speciesName, usePlayerMove } from "./battle";
import { pickOne, type Rng } from "./rng";

export function createInitialState(): GameState {
  return {
    position: HOME_MAP.start,
    facing: "north",
    starterId: null,
    party: [],
    battle: null,
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
    party: [createCreature(starterId, 5)],
    dialogue: [`${starter.name} joined your party.`, ...state.dialogue].slice(0, 5)
  };
}

export function moveTrainer(state: GameState, direction: Direction, rng?: Rng): GameState {
  if (state.battle) {
    return state;
  }
  const moved = move(state, HOME_MAP, direction);
  if (!rng || moved.position === state.position || tileAt(HOME_MAP, moved.position) !== "grass" || !state.starterId) {
    return moved;
  }
  return rng.next() < 0.35 ? startWildEncounter(moved, rng) : moved;
}

export function interact(state: GameState): GameState {
  const object = objectAt(HOME_MAP, facedPosition(state));
  if (!object) {
    return { ...state, dialogue: ["Nothing responds.", ...state.dialogue].slice(0, 5) };
  }
  if (object.kind === "healer") {
    return {
      ...state,
      party: state.party.map(healCreature),
      dialogue: ["Your party is restored at the Healing Hut.", ...state.dialogue].slice(0, 5)
    };
  }
  return { ...state, dialogue: [object.message, ...state.dialogue].slice(0, 5) };
}

export function startWildEncounter(state: GameState, rng: Rng): GameState {
  const opponentId = pickOne(ROUTE_ONE_CREATURE_IDS, rng);
  const player = state.party.find((creature) => creature.hp > 0);
  if (!player) {
    return { ...state, dialogue: ["You need a rested creature before entering Tall Grass.", ...state.dialogue].slice(0, 5) };
  }
  const opponent = createCreature(opponentId, 3);
  return {
    ...state,
    battle: {
      kind: "wild",
      player,
      opponent,
      message: `Wild ${speciesName(opponent)} appeared.`
    },
    dialogue: [`Wild ${speciesName(opponent)} appeared.`, ...state.dialogue].slice(0, 5)
  };
}

export function useMove(state: GameState, moveIndex: 0 | 1): GameState {
  if (!state.battle) {
    return state;
  }
  const battle = usePlayerMove(state.battle, moveIndex);
  const party = state.party.map((creature) => (creature.instanceId === battle.player.instanceId ? battle.player : creature));
  if (battle.opponent.hp === 0) {
    return {
      ...state,
      battle: null,
      party,
      dialogue: [`${speciesName(battle.opponent)} fainted.`, battle.message, ...state.dialogue].slice(0, 5)
    };
  }
  return { ...state, battle, party, dialogue: [battle.message, ...state.dialogue].slice(0, 5) };
}
