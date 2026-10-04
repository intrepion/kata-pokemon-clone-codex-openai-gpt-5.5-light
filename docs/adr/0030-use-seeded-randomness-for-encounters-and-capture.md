# Use seeded randomness for encounters and capture

Encounter and capture randomness will go through a small seeded RNG service instead of calling `Math.random` directly. This makes battle, capture, and tall-grass behavior reproducible in tests and bug reports.

**Consequences**

Browser test hooks may set or inspect the seed, but game rules should still exercise the same RNG paths used during normal play.
