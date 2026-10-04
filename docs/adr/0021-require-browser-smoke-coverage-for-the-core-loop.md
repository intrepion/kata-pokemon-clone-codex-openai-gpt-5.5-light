# Require browser smoke coverage for the core loop

MVP completion requires browser smoke coverage for starter selection, tile movement and collision, tall-grass encounter, battle victory, capture, Autosave reload, Healing Hut restore, Trainer Battle, Meadow Badge win state, and mobile controls. Unit tests can protect mechanics, but only browser paths can prove the creature-catching loop feels coherent in the actual UI.

**Consequences**

Every MVP slice should preserve or extend the browser smoke path instead of waiting until the final polish slice to test the playable game.
