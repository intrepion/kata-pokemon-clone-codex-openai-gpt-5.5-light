# Creature-Catching Adventure

This context defines the domain language for an original browser game inspired by early Pokemon's exploration, collection, battle, and badge progression loop.

## Language

**Creature**:
An original collectible battle companion that can appear in encounters, join the player's party, gain experience, and be recorded in the field guide.
_Avoid_: Pokemon, monster, pet

**Trainer**:
A human character who owns a party of creatures and can participate in scripted battles.
_Avoid_: Player character, NPC battler

**Party**:
The trainer's active roster of creatures available for battle and progression.
_Avoid_: Team, deck, bench

**Starter**:
The first creature selected by the player before route exploration begins.
_Avoid_: First Pokemon, default creature

**Route**:
A bounded top-down exploration area with walkable paths, landmarks, tall grass, and scripted progression.
_Avoid_: Level, zone, map

**Town**:
A safe top-down exploration area that teaches story context, starter selection, healing, and progression goals.
_Avoid_: Hub, menu base

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

**Field Guide**:
The player's record of seen and captured creatures.
_Avoid_: Pokedex, bestiary, collection screen

**Badge**:
A milestone reward for completing the first major trainer challenge.
_Avoid_: Gym badge, achievement

**First Badge Loop**:
The initial complete progression arc: choose a starter, explore a route, capture creatures, heal, defeat the first major trainer challenge, and earn a badge.
_Avoid_: Tutorial, vertical slice
