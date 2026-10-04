import { CREATURES } from "../data/starters";
import type { BattleState, CreatureInstance, Move } from "./types";

const ADVANTAGE: Record<string, string> = {
  leaf: "tide",
  tide: "ember",
  ember: "leaf"
};

export function createCreature(speciesId: string, level: number): CreatureInstance {
  const species = CREATURES[speciesId];
  if (!species) {
    throw new Error(`Unknown creature species: ${speciesId}`);
  }
  return {
    instanceId: `${speciesId}-${level}-${nextInstanceNumber++}`,
    speciesId,
    level,
    hp: species.maxHp + level * 2
  };
}

export function speciesName(creature: CreatureInstance): string {
  return CREATURES[creature.speciesId]?.name ?? creature.speciesId;
}

export function maxHp(creature: CreatureInstance): number {
  const species = CREATURES[creature.speciesId];
  if (!species) {
    throw new Error(`Unknown creature species: ${creature.speciesId}`);
  }
  return species.maxHp + creature.level * 2;
}

export function healCreature(creature: CreatureInstance): CreatureInstance {
  return { ...creature, hp: maxHp(creature) };
}

export function calculateDamage(attacker: CreatureInstance, defender: CreatureInstance, move: Move): number {
  const attackerSpecies = CREATURES[attacker.speciesId];
  const defenderSpecies = CREATURES[defender.speciesId];
  if (!attackerSpecies || !defenderSpecies) {
    throw new Error("Cannot calculate damage for unknown creature.");
  }
  const multiplier = move.type !== "neutral" && ADVANTAGE[move.type] === defenderSpecies.type ? 2 : 1;
  return move.power * multiplier + attacker.level;
}

export function usePlayerMove(battle: BattleState, moveIndex: 0 | 1): BattleState {
  const playerSpecies = CREATURES[battle.player.speciesId];
  const opponentSpecies = CREATURES[battle.opponent.speciesId];
  if (!playerSpecies || !opponentSpecies) {
    throw new Error("Cannot use move with unknown species.");
  }
  const playerMove = playerSpecies.moves[moveIndex];
  const opponentAfterHit = {
    ...battle.opponent,
    hp: Math.max(0, battle.opponent.hp - calculateDamage(battle.player, battle.opponent, playerMove))
  };
  if (opponentAfterHit.hp === 0) {
    return {
      ...battle,
      opponent: opponentAfterHit,
      message: `${playerSpecies.name} used ${playerMove.name}. ${opponentSpecies.name} fainted.`
    };
  }
  const opponentMove = opponentSpecies.moves[0];
  const playerAfterHit = {
    ...battle.player,
    hp: Math.max(0, battle.player.hp - calculateDamage(opponentAfterHit, battle.player, opponentMove))
  };
  return {
    ...battle,
    player: playerAfterHit,
    opponent: opponentAfterHit,
    message: `${playerSpecies.name} used ${playerMove.name}. ${opponentSpecies.name} used ${opponentMove.name}.`
  };
}
let nextInstanceNumber = 0;
