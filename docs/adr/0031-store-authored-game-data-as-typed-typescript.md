# Store authored game data as typed TypeScript

Creatures, moves, maps, and progression data will be authored as typed TypeScript modules for the MVP rather than external JSON. Typed data catches broken IDs, move/type mismatches, and map references earlier while the data model is still changing.

**Consequences**

External data formats can wait until the content scale justifies editor tooling or runtime loading.
