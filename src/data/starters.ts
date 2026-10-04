import type { CreatureSpecies, Starter } from "../domain/types";

export const STARTERS: readonly Starter[] = [
  {
    id: "sprigget",
    name: "Sprigget",
    type: "leaf",
    description: "A bright-eyed Leaf kitten that roots itself before striking."
  },
  {
    id: "cindillo",
    name: "Cindillo",
    type: "ember",
    description: "A warm-shelled Ember armadillo that sparks when it rolls."
  },
  {
    id: "otterune",
    name: "Otterune",
    type: "tide",
    description: "A riverwise Tide otter that hums before a wave."
  }
];

export const CREATURES: Record<string, CreatureSpecies> = {
  sprigget: {
    id: "sprigget",
    name: "Sprigget",
    type: "leaf",
    maxHp: 24,
    moves: [
      { id: "paw-tap", name: "Paw Tap", type: "neutral", power: 5 },
      { id: "sprout-arc", name: "Sprout Arc", type: "leaf", power: 8 }
    ]
  },
  cindillo: {
    id: "cindillo",
    name: "Cindillo",
    type: "ember",
    maxHp: 23,
    moves: [
      { id: "shell-bump", name: "Shell Bump", type: "neutral", power: 5 },
      { id: "cinder-roll", name: "Cinder Roll", type: "ember", power: 8 }
    ]
  },
  otterune: {
    id: "otterune",
    name: "Otterune",
    type: "tide",
    maxHp: 25,
    moves: [
      { id: "tail-slap", name: "Tail Slap", type: "neutral", power: 5 },
      { id: "ripple-note", name: "Ripple Note", type: "tide", power: 8 }
    ]
  },
  mossbit: {
    id: "mossbit",
    name: "Mossbit",
    type: "leaf",
    maxHp: 18,
    moves: [
      { id: "nibble", name: "Nibble", type: "neutral", power: 4 },
      { id: "leaf-flick", name: "Leaf Flick", type: "leaf", power: 6 }
    ]
  },
  flarabbit: {
    id: "flarabbit",
    name: "Flarabbit",
    type: "ember",
    maxHp: 17,
    moves: [
      { id: "hop-kick", name: "Hop Kick", type: "neutral", power: 4 },
      { id: "spark-ear", name: "Spark Ear", type: "ember", power: 6 }
    ]
  },
  brookfin: {
    id: "brookfin",
    name: "Brookfin",
    type: "tide",
    maxHp: 19,
    moves: [
      { id: "fin-swipe", name: "Fin Swipe", type: "neutral", power: 4 },
      { id: "stream-pop", name: "Stream Pop", type: "tide", power: 6 }
    ]
  },
  huskwing: {
    id: "huskwing",
    name: "Huskwing",
    type: "neutral",
    maxHp: 16,
    moves: [
      { id: "wing-dust", name: "Wing Dust", type: "neutral", power: 4 },
      { id: "husk-rattle", name: "Husk Rattle", type: "neutral", power: 5 }
    ]
  },
  petalark: {
    id: "petalark",
    name: "Petalark",
    type: "leaf",
    maxHp: 20,
    moves: [
      { id: "peck", name: "Peck", type: "neutral", power: 5 },
      { id: "petal-gust", name: "Petal Gust", type: "leaf", power: 7 }
    ]
  },
  bramblet: {
    id: "bramblet",
    name: "Bramblet",
    type: "leaf",
    maxHp: 22,
    moves: [
      { id: "tackle", name: "Tackle", type: "neutral", power: 5 },
      { id: "thorn-loop", name: "Thorn Loop", type: "leaf", power: 7 }
    ]
  }
};

export const ROUTE_ONE_CREATURE_IDS = ["mossbit", "flarabbit", "brookfin", "huskwing"] as const;
