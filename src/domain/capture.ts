import { maxHp } from "./battle";
import type { BattleState } from "./types";

export function captureChance(battle: BattleState, alreadySeen: boolean): number {
  const hpRatio = battle.opponent.hp / maxHp(battle.opponent);
  const lowHpBonus = 1 - hpRatio;
  return Math.min(0.9, 0.3 + lowHpBonus * 0.45 + (alreadySeen ? 0.1 : 0));
}
