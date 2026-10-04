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

export interface GameState {
  readonly position: Position;
  readonly facing: Direction;
  readonly starterId: Starter["id"] | null;
  readonly dialogue: readonly string[];
}
