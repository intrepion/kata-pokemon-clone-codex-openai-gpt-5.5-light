# Limit MVP audio to small WebAudio cues

MVP audio will be limited to short WebAudio cues for Step, Confirm Control, battle start, hit, capture attempt, badge win, and mute. Music is deferred because it can consume disproportionate implementation and testing attention before the core loop is proven.

**Consequences**

Audio must be optional and controlled by a visible mute setting, and the game should remain complete without background music.
