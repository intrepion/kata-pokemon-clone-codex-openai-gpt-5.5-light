# Use strict tile-stepped map movement

Map movement will be strict tile-to-tile stepping rather than smooth free movement. This preserves the early creature-catching RPG feel and makes collision, tall grass checks, facing interactions, NPC blocking, and browser tests easier to reason about.

**Consequences**

The trainer's position should be modeled as tile coordinates, with animation layered on top of completed Steps rather than making pixel position the source of truth.
