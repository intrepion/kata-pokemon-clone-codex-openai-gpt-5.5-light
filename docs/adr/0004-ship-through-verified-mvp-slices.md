# Ship through verified MVP slices

We will implement the game through independently playable MVP slices, committing and pushing each meaningful breakpoint after verification. This keeps the project from becoming a large unverified batch and creates concrete evidence for the core interaction path before later systems depend on it.

**Consequences**

Each slice should include a real browser check of the user-facing path it claims to support, plus the relevant syntax, type, unit, build, and Git synchronization checks for that stage.
