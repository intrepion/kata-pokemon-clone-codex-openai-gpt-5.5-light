# Use simple alternating battle turns

Battles will use simple alternating Turns for the First Badge Loop, with the player acting first in Wild Encounters and Trainer Battles using fixed creature order. Speed, priority, and initiative systems are deferred because they obscure causality before the battle loop is playable and readable.

**Consequences**

Battle tests should be able to predict turn order without randomness beyond explicitly modeled capture and encounter checks.
