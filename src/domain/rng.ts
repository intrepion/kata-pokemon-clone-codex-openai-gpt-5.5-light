export interface Rng {
  next(): number;
}

export class SeededRng implements Rng {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0;
  }

  next(): number {
    this.seed = (1664525 * this.seed + 1013904223) >>> 0;
    return this.seed / 0x100000000;
  }
}

export function pickOne<T>(items: readonly T[], rng: Rng): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty list.");
  }
  return items[Math.floor(rng.next() * items.length)] ?? items[0];
}
