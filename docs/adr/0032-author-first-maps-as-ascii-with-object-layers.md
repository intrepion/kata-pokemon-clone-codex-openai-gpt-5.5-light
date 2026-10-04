# Author first maps as ASCII with object layers

The first maps will be represented as ASCII tile maps plus typed object layers for NPCs, exits, tall grass, signs, blockers, and scripted triggers. This makes Home Town, Professor Grove, Route 1, Healing Hut, and Badge Meadow readable in code review and deterministic in tests.

**Consequences**

Map parsing should fail loudly on unknown tile symbols, missing object targets, or impossible coordinates.
