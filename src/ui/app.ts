import { STARTERS } from "../data/starters";
import type { BattleState, Direction, Starter } from "../domain/types";
import { attemptCapture, chooseStarter, createInitialState, interact, moveTrainer, useMove } from "../domain/game";
import { SeededRng } from "../domain/rng";
import { CREATURES } from "../data/starters";
import { parseSavedState, SAVE_KEY, serializeState } from "../domain/storage";
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
  const params = new URLSearchParams(window.location.search);
  const rng = new SeededRng(Number(params.get("seed") ?? 7));
  let state = parseSavedState(window.localStorage.getItem(SAVE_KEY)) ?? createInitialState();
  root.innerHTML = `
    <main class="shell">
      <section class="stage" aria-label="Briarbrook map">
        <canvas class="game-canvas" aria-label="Top-down Briarbrook route"></canvas>
      </section>
      <section class="panel" aria-label="Journey controls">
        <h1>Briarbrook League</h1>
        <p class="status" data-testid="status"></p>
        <div class="win-panel" data-testid="win-panel"></div>
        <div class="battle" data-testid="battle"></div>
        <div class="field-guide" data-testid="field-guide"></div>
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
  const battleElement = root.querySelector<HTMLElement>("[data-testid='battle']");
  const guideElement = root.querySelector<HTMLElement>("[data-testid='field-guide']");
  const winElement = root.querySelector<HTMLElement>("[data-testid='win-panel']");
  if (!canvasElement || !statusElement || !starterGridElement || !dialogueElement || !battleElement || !guideElement || !winElement) {
    throw new Error("Briarbrook UI failed to mount.");
  }
  const canvas = canvasElement;
  const status = statusElement;
  const starterGrid = starterGridElement;
  const dialogue = dialogueElement;
  const battlePanel = battleElement;
  const fieldGuide = guideElement;
  const winPanel = winElement;

  function render(): void {
    drawScene(canvas, state);
    const starter = STARTERS.find((candidate) => candidate.id === state.starterId);
    const lead = state.party[0];
    const hpText = lead ? ` ${CREATURES[lead.speciesId]?.name ?? lead.speciesId} HP ${lead.hp}.` : "";
    status.textContent = `Tile ${state.position.x},${state.position.y} facing ${state.facing}. Starter: ${starter?.name ?? "none"}.${hpText} Capture Charms: ${state.captureCharms}. Meadow Badge: ${state.meadowBadge ? "earned" : "not yet"}.`;
    winPanel.innerHTML = state.winPanel ? "<strong>Briarbrook League begins.</strong><p>The path beyond Badge Meadow is open.</p>" : "";
    battlePanel.innerHTML = state.battle ? battleMarkup(state.battle) : "";
    fieldGuide.innerHTML = guideMarkup(state);
    starterGrid.innerHTML = STARTERS.map(starterOption).join("");
    dialogue.innerHTML = state.dialogue.map((line) => `<li>${line}</li>`).join("");
    window.localStorage.setItem(SAVE_KEY, serializeState(state));
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
      state = moveTrainer(state, target.dataset.dir as Direction, rng);
      render();
    }
    if (target.dataset.action === "confirm") {
      state = interact(state);
      render();
    }
    if (target.dataset.move === "0" || target.dataset.move === "1") {
      state = useMove(state, Number(target.dataset.move) as 0 | 1);
      render();
    }
    if (target.dataset.action === "capture") {
      state = attemptCapture(state, rng);
      render();
    }
  });

  window.addEventListener("keydown", (event) => {
    const direction = DIRECTIONS[event.code];
    if (direction) {
      event.preventDefault();
      state = moveTrainer(state, direction, rng);
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

function battleMarkup(battle: BattleState): string {
  const opponent = CREATURES[battle.opponent.speciesId];
  const player = CREATURES[battle.player.speciesId];
  return `
    <section class="battle-scene" aria-label="Battle Scene">
      <h2>Battle Scene</h2>
      <p>${battle.message}</p>
      <p>${player.name} HP ${battle.player.hp} vs ${opponent.name} HP ${battle.opponent.hp}</p>
      <button data-move="0">${player.moves[0].name}</button>
      <button data-move="1">${player.moves[1].name}</button>
      <button data-action="capture">Capture Charm</button>
    </section>
  `;
}

function guideMarkup(state: ReturnType<typeof createInitialState>): string {
  const entries = Object.entries(state.guide);
  const partyNames = state.party.map((creature) => CREATURES[creature.speciesId]?.name ?? creature.speciesId).join(", ") || "none";
  return `
    <h2>Field Guide</h2>
    <p>Party: ${partyNames}</p>
    <p>${entries.length} discovered</p>
    <ul>${entries.map(([speciesId, status]) => `<li>${CREATURES[speciesId]?.name ?? speciesId}: ${status}</li>`).join("")}</ul>
  `;
}
