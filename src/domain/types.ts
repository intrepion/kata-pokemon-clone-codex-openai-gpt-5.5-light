export type Direction = "north" | "south" | "west" | "east";

export type CreatureType = "leaf" | "ember" | "tide" | "neutral";

export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface Starter {
  readonly id: "sprigget" | "cindillo" | "otterune";
  readonly name: string;
  readonly type: CreatureType;
  readonly description: string;
}

export interface Move {
  readonly id: string;
  readonly name: string;
  readonly type: CreatureType;
  readonly power: number;
}

export interface CreatureSpecies {
  readonly id: string;
  readonly name: string;
  readonly type: CreatureType;
  readonly maxHp: number;
  readonly moves: readonly [Move, Move];
}

export interface CreatureInstance {
  readonly instanceId: string;
  readonly speciesId: string;
  readonly level: number;
  readonly hp: number;
}

export interface BattleState {
  readonly kind: "wild" | "trainer";
  readonly player: CreatureInstance;
  readonly opponent: CreatureInstance;
  readonly remainingOpponents?: readonly CreatureInstance[];
  readonly message: string;
}

export interface GameState {
  readonly version: 1;
  readonly position: Position;
  readonly facing: Direction;
  readonly starterId: Starter["id"] | null;
  readonly party: readonly CreatureInstance[];
  readonly captureCharms: number;
  readonly guide: Readonly<Record<string, "seen" | "captured">>;
  readonly meadowBadge: boolean;
  readonly pathOpen: boolean;
  readonly winPanel: boolean;
  readonly battle: BattleState | null;
  readonly dialogue: readonly string[];
}
