# Creature-Catching Adventure

This context defines the domain language for an original browser game inspired by early Pokemon's exploration, collection, battle, and badge progression loop.

## Language

**Creature**:
An original collectible battle companion that can appear in encounters, join the player's party, gain experience, and be recorded in the field guide.
_Avoid_: Pokemon, monster, pet

**Briarbrook League**:
The original woodland-river creature-catching region and challenge circuit for this game.
_Avoid_: Pokemon League, region map

**Trainer**:
A human character who owns a party of creatures and can participate in scripted battles.
_Avoid_: Player character, NPC battler

**Party**:
The trainer's active roster of creatures available for battle and progression.
_Avoid_: Team, deck, bench

**Starter**:
The first creature selected by the player before route exploration begins.
_Avoid_: First Pokemon, default creature

**Leaf**:
A starter type associated with plants, growth, and meadow creatures.
_Avoid_: Grass

**Ember**:
A starter type associated with heat, sparks, and fire-adjacent creatures.
_Avoid_: Fire

**Tide**:
A starter type associated with water, rivers, and shore creatures.
_Avoid_: Water

**Sprigget**:
The Leaf starter creature.
_Avoid_: Bulbasaur-style starter

**Cindillo**:
The Ember starter creature.
_Avoid_: Charmander-style starter

**Otterune**:
The Tide starter creature.
_Avoid_: Squirtle-style starter

**Route**:
A bounded top-down exploration area with walkable paths, landmarks, tall grass, and scripted progression.
_Avoid_: Level, zone, map

**Town**:
A safe top-down exploration area that teaches story context, starter selection, healing, and progression goals.
_Avoid_: Hub, menu base

**Home Town**:
The opening town where the trainer starts the journey.
_Avoid_: Starting hub, Pallet Town

**Professor Grove**:
The story location where the trainer receives a starter.
_Avoid_: Lab, professor lab

**Route 1**:
The first route connecting the opening town to the badge challenge.
_Avoid_: First level

**Healing Hut**:
A safe location where the trainer restores the party and restocks basic capture supplies.
_Avoid_: Pokemon Center, shop

**Badge Meadow**:
The first major challenge location where the Meadow Badge is earned.
_Avoid_: Gym, boss arena

**Tall Grass**:
Route terrain that can trigger a wild encounter while the trainer moves through it.
_Avoid_: Random encounter tile, spawn area

**Encounter**:
A modal interaction that interrupts exploration and resolves through battle, capture, flee, or scripted trainer victory.
_Avoid_: Fight, event, combat screen

**Wild Encounter**:
An encounter against a creature that does not already belong to a trainer and may be captured.
_Avoid_: Random battle

**Trainer Battle**:
A scripted encounter against another trainer's party that tests player progression and cannot be solved by capture.
_Avoid_: Duel, PvP, boss fight

**Capture**:
The act of adding a wild creature to the player's collection through a battle item and probability check.
_Avoid_: Tame, recruit, catch Pokemon

**Capture Charm**:
A consumable item used to attempt capture during a wild encounter.
_Avoid_: Poke Ball, capture sphere

**Field Guide**:
The player's record of seen and captured creatures.
_Avoid_: Pokedex, bestiary, collection screen

**Badge**:
A milestone reward for completing the first major trainer challenge.
_Avoid_: Gym badge, achievement

**Meadow Badge**:
The first badge, earned by defeating the Leaf-favoring trainer challenge at Badge Meadow.
_Avoid_: Grass badge, gym badge

**First Badge Loop**:
The initial complete progression arc: choose a starter, explore a route, capture creatures, heal, defeat the first major trainer challenge, and earn a badge.
_Avoid_: Tutorial, vertical slice
