# Render with canvas scenes and HTML interface

The game will render the map and Battle Scenes with Canvas 2D, while HUD, menus, dialogue, and controls use HTML. Canvas keeps tile movement, pixel art, and scene transitions coherent, while HTML keeps text, controls, and browser assertions accessible.

**Consequences**

The renderer should avoid putting core menu text exclusively inside canvas when it needs focus, accessibility, or reliable browser-test selection.
