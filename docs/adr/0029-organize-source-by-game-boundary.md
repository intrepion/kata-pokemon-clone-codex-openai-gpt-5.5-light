# Organize source by game boundary

Implementation source will be organized by game boundary: `src/domain/` for battle, capture, and state rules; `src/world/` for maps, collision, and encounters; `src/render/` for Canvas drawing; `src/ui/` for DOM menus, dialogue, and controls; and `src/data/` for creatures, maps, moves, and other authored content. This keeps core game rules testable without requiring the browser renderer.

**Consequences**

Domain modules should not import rendering or DOM code, and browser integration should compose the boundaries rather than becoming the only place rules can run.
