import { ROUTE_ONE_CREATURE_IDS, STARTERS } from "../data/starters";
import { HOME_MAP } from "../data/maps";
import type { Direction, GameState, Starter } from "./types";
import { facedPosition, move, objectAt, tileAt } from "../world/map";
import { createCreature, healCreature, speciesName, usePlayerMove } from "./battle";
import { pickOne, type Rng } from "./rng";
import { captureChance } from "./capture";

export function createInitialState(): GameState {
  return {
    version: 1,
    position: HOME_MAP.start,
    facing: "north",
    starterId: null,
    party: [],
    captureCharms: 5,
    guide: {},
    meadowBadge: false,
    pathOpen: false,
    winPanel: false,
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
    guide: { ...state.guide, [starterId]: "captured" },
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
      captureCharms: Math.max(5, state.captureCharms),
      dialogue: ["Your party is restored at the Healing Hut.", ...state.dialogue].slice(0, 5)
    };
  }
  if (object.kind === "blocker") {
    return state.meadowBadge ? openBadgePath(state) : startTrainerBattle(state);
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
    guide: markSeen(state.guide, opponent.speciesId),
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
  if (battle.player.hp === 0 && battle.opponent.hp > 0) {
    return handlePlayerFaint(state, battle, party);
  }
  if (battle.opponent.hp === 0) {
    if (battle.kind === "trainer") {
      const nextOpponent = battle.remainingOpponents?.[0];
      if (nextOpponent) {
        return {
          ...state,
          battle: {
            kind: "trainer",
            player: battle.player,
            opponent: nextOpponent,
            remainingOpponents: battle.remainingOpponents?.slice(1) ?? [],
            message: `Badge Meadow sends out ${speciesName(nextOpponent)}.`
          },
          party,
          dialogue: [`Badge Meadow sends out ${speciesName(nextOpponent)}.`, battle.message, ...state.dialogue].slice(0, 5)
        };
      }
      return {
        ...state,
        battle: null,
        party,
        meadowBadge: true,
        pathOpen: true,
        winPanel: true,
        dialogue: ["You earned the Meadow Badge. The Briarbrook League begins.", battle.message, ...state.dialogue].slice(0, 5)
      };
    }
    return {
      ...state,
      battle: null,
      party,
      dialogue: [`${speciesName(battle.opponent)} fainted.`, battle.message, ...state.dialogue].slice(0, 5)
    };
  }
  return { ...state, battle, party, dialogue: [battle.message, ...state.dialogue].slice(0, 5) };
}

export function attemptCapture(state: GameState, rng: Rng): GameState {
  if (!state.battle || state.battle.kind !== "wild") {
    return state;
  }
  if (state.captureCharms <= 0) {
    return { ...state, dialogue: ["No Capture Charms remain.", ...state.dialogue].slice(0, 5) };
  }
  const captureCharms = state.captureCharms - 1;
  const speciesId = state.battle.opponent.speciesId;
  const chance = captureChance(state.battle, Boolean(state.guide[speciesId]));
  if (rng.next() <= chance) {
    const captured = { ...state.battle.opponent, hp: Math.max(1, state.battle.opponent.hp) };
    const party = state.party.length < 3 ? [...state.party, captured] : state.party;
    return {
      ...state,
      battle: null,
      party,
      captureCharms,
      guide: { ...state.guide, [speciesId]: "captured" },
      dialogue: [`${speciesName(captured)} joined your party.`, ...state.dialogue].slice(0, 5)
    };
  }
  const battle = usePlayerMove(state.battle, 0);
  const party = state.party.map((creature) => (creature.instanceId === battle.player.instanceId ? battle.player : creature));
  if (battle.player.hp === 0 && battle.opponent.hp > 0) {
    return handlePlayerFaint({ ...state, captureCharms }, battle, party);
  }
  return {
    ...state,
    battle,
    party,
    captureCharms,
    dialogue: [`Capture failed. ${battle.message}`, ...state.dialogue].slice(0, 5)
  };
}

export function cancelAction(state: GameState): GameState {
  if (!state.battle) {
    return { ...state, dialogue: ["Nothing to cancel.", ...state.dialogue].slice(0, 5) };
  }
  if (state.battle.kind === "trainer") {
    return { ...state, dialogue: ["Trainer battles cannot be cancelled.", ...state.dialogue].slice(0, 5) };
  }
  return { ...state, battle: null, dialogue: ["You backed away from the wild encounter.", ...state.dialogue].slice(0, 5) };
}

function markSeen(guide: GameState["guide"], speciesId: string): GameState["guide"] {
  return guide[speciesId] === "captured" ? guide : { ...guide, [speciesId]: "seen" };
}

function startTrainerBattle(state: GameState): GameState {
  const player = state.party.find((creature) => creature.hp > 0);
  if (!player) {
    return { ...state, dialogue: ["The Badge Meadow trainer waits until your party is restored.", ...state.dialogue].slice(0, 5) };
  }
  const firstOpponent = createCreature("petalark", 4);
  const secondOpponent = createCreature("bramblet", 5);
  return {
    ...state,
    battle: {
      kind: "trainer",
      player,
      opponent: firstOpponent,
      remainingOpponents: [secondOpponent],
      message: "Badge Meadow trainer Liora challenges you."
    },
    guide: markSeen(markSeen(state.guide, firstOpponent.speciesId), secondOpponent.speciesId),
    dialogue: ["Badge Meadow trainer Liora challenges you.", ...state.dialogue].slice(0, 5)
  };
}

function openBadgePath(state: GameState): GameState {
  return {
    ...state,
    pathOpen: true,
    winPanel: true,
    dialogue: ["The path beyond Badge Meadow is open.", ...state.dialogue].slice(0, 5)
  };
}

function handlePlayerFaint(state: GameState, battle: NonNullable<GameState["battle"]>, party: readonly GameState["party"][number][]): GameState {
  const nextCreature = party.find((creature) => creature.hp > 0 && creature.instanceId !== battle.player.instanceId);
  if (nextCreature) {
    return {
      ...state,
      party,
      battle: { ...battle, player: nextCreature, message: `${speciesName(battle.player)} fainted. ${speciesName(nextCreature)} steps in.` },
      dialogue: [`${speciesName(battle.player)} fainted. ${speciesName(nextCreature)} steps in.`, battle.message, ...state.dialogue].slice(0, 5)
    };
  }
  return {
    ...state,
    position: { x: 3, y: 7 },
    facing: "north",
    battle: null,
    party: party.map(healCreature),
    captureCharms: Math.max(0, state.captureCharms - 1),
    dialogue: ["Your party blacked out and returned to the Healing Hut.", battle.message, ...state.dialogue].slice(0, 5)
  };
}
