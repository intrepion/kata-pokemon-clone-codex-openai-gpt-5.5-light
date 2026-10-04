import { STARTERS } from "../data/starters";
import type { Direction, Starter } from "../domain/types";
import { chooseStarter, createInitialState, interact, moveTrainer } from "../domain/game";
import { drawScene } from "../render/canvas";
import "./styles.css";

const DIRECTIONS: Record<string, Direction> = {
  ArrowUp: "north",
  KeyW: "north",
  ArrowDown: "south",
  KeyS: "south",
  ArrowLeft: "west",
  KeyA: "west",
  ArrowRight: "east",
  KeyD: "east"
};

export function mountApp(root: HTMLElement): void {
  let state = createInitialState();
  root.innerHTML = `
    <main class="shell">
      <section class="stage" aria-label="Briarbrook map">
        <canvas class="game-canvas" aria-label="Top-down Briarbrook route"></canvas>
      </section>
      <section class="panel" aria-label="Journey controls">
        <h1>Briarbrook League</h1>
        <p class="status" data-testid="status"></p>
        <div class="starter-grid" data-testid="starter-grid"></div>
        <div class="controls" aria-label="Movement controls">
          <button data-dir="north">Up</button>
          <button data-dir="west">Left</button>
          <button data-action="confirm">A</button>
          <button data-dir="east">Right</button>
          <button data-dir="south">Down</button>
          <button data-action="cancel">B</button>
        </div>
        <ol class="dialogue" data-testid="dialogue" aria-label="Dialogue Log"></ol>
      </section>
    </main>
  `;
  const canvasElement = root.querySelector<HTMLCanvasElement>("canvas");
  const statusElement = root.querySelector<HTMLElement>("[data-testid='status']");
  const starterGridElement = root.querySelector<HTMLElement>("[data-testid='starter-grid']");
  const dialogueElement = root.querySelector<HTMLElement>("[data-testid='dialogue']");
  if (!canvasElement || !statusElement || !starterGridElement || !dialogueElement) {
    throw new Error("Briarbrook UI failed to mount.");
  }
  const canvas = canvasElement;
  const status = statusElement;
  const starterGrid = starterGridElement;
  const dialogue = dialogueElement;

  function render(): void {
    drawScene(canvas, state);
    const starter = STARTERS.find((candidate) => candidate.id === state.starterId);
    status.textContent = `Tile ${state.position.x},${state.position.y} facing ${state.facing}. Starter: ${starter?.name ?? "none"}.`;
    starterGrid.innerHTML = STARTERS.map(starterOption).join("");
    dialogue.innerHTML = state.dialogue.map((line) => `<li>${line}</li>`).join("");
  }

  function choose(starterId: Starter["id"]): void {
    state = chooseStarter(state, starterId);
    render();
  }

  starterGrid.addEventListener("click", (event) => {
    const target = event.target;
    const button = target instanceof Element ? target.closest<HTMLButtonElement>("button[data-starter]") : null;
    if (button?.dataset.starter) {
      choose(button.dataset.starter as Starter["id"]);
    }
  });

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    if (target.dataset.dir) {
      state = moveTrainer(state, target.dataset.dir as Direction);
      render();
    }
    if (target.dataset.action === "confirm") {
      state = interact(state);
      render();
    }
  });

  window.addEventListener("keydown", (event) => {
    const direction = DIRECTIONS[event.code];
    if (direction) {
      event.preventDefault();
      state = moveTrainer(state, direction);
      render();
    }
    if (["Space", "Enter", "KeyZ"].includes(event.code)) {
      event.preventDefault();
      state = interact(state);
      render();
    }
  });

  render();
}

function starterOption(starter: Starter): string {
  return `
    <button class="starter-card" data-starter="${starter.id}">
      <strong>${starter.name}</strong>
      <span>${starter.type.toUpperCase()}</span>
      <small>${starter.description}</small>
    </button>
  `;
}
