# Use Vite, TypeScript, and browser tests

We will use a Vite and TypeScript browser-game structure with automated browser coverage rather than a dependency-free static script. The extra tooling is justified because encounters, capture probability, party state, save recovery, and progression gates are easy to regress without typed domain code and Playwright smoke paths.

**Consequences**

The root game will be served through the Vite workflow during development, and any direct-file deliverable must be treated as an explicit packaging target rather than assumed from the source entrypoint.
