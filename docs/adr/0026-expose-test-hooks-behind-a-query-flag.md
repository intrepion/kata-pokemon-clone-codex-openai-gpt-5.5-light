# Expose test hooks behind a query flag

The game will expose deterministic test hooks only when launched with a test query flag such as `?test=1`. Hooks may seed encounters, force the next encounter, grant Capture Charms, and move the trainer to key map positions so browser tests can exercise the loop without flaky grinding.

**Consequences**

Test hooks must not be available during normal play, and browser tests should use them to verify behavior rather than to bypass the behavior being tested.
