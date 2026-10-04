# Build the first badge loop in five slices

We will implement the First Badge Loop in five verified MVP slices: project shell with map movement, collision, and starter selection; wild encounters, battle, and healing; capture, party, Field Guide, and save/load; trainer battle, badge, and win state; then responsive controls, audio toggle, browser tests, and README polish. This sequence keeps every slice independently playable while delaying polish until the core loop proves itself.

**Consequences**

Each slice should be committed and pushed after its own verification, and later slices should preserve earlier browser smoke paths rather than replacing them.
