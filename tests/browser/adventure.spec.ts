import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

test.beforeEach(async ({ page }) => {
  await page.goto("/dev.html");
  await page.evaluate(() => window.localStorage.clear());
});

test("player can choose a starter and move on the tile map", async ({ page }) => {
  await page.goto("/dev.html");

  await expect(page.getByRole("heading", { name: "Briarbrook League" })).toBeVisible();
  await page.getByRole("button", { name: /Cindillo/ }).click();
  await expect(page.getByTestId("status")).toContainText("Starter: Cindillo");

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("status")).toContainText("Tile 3,7");

  await page.keyboard.press("Space");
  await expect(page.getByTestId("dialogue")).toContainText("Nothing responds.");
});

test("mobile controls expose movement and confirm actions", async ({ page }) => {
  await page.goto("/dev.html");

  await page.getByRole("button", { name: "Right", exact: true }).click();
  await expect(page.getByTestId("status")).toContainText("Tile 3,7");

  await page.getByRole("button", { name: "Muted" }).click();
  await expect(page.getByRole("button", { name: "Sound On" })).toBeVisible();

  await page.getByRole("button", { name: "A", exact: true }).click();
  await expect(page.getByTestId("dialogue")).toContainText("Nothing responds.");
});

test("visible reset clears autosaved progress", async ({ page }) => {
  await page.goto("/dev.html");
  await page.getByRole("button", { name: /Cindillo/ }).click();
  await expect(page.getByTestId("status")).toContainText("Starter: Cindillo");

  await page.getByRole("button", { name: "Reset" }).click();

  await expect(page.getByTestId("status")).toContainText("Starter: none");
  await page.reload();
  await expect(page.getByTestId("status")).toContainText("Starter: none");
});

test("test hooks are available only behind query flag", async ({ page }) => {
  await page.goto("/dev.html");
  await expect.poll(async () => page.evaluate(() => Boolean(window.__briarbrookTestHooks))).toBe(false);

  await page.goto("/dev.html?test=1");
  await page.getByRole("button", { name: /Sprigget/ }).click();
  await page.evaluate(() => {
    window.__briarbrookTestHooks?.grantCharms(9);
    window.__briarbrookTestHooks?.jumpTo(11, 2);
    window.__briarbrookTestHooks?.forceEncounter();
  });

  await expect(page.getByTestId("status")).toContainText("Capture Charms: 9");
  await expect(page.getByTestId("battle")).toContainText("Wild");
});

test("cancel controls back out of wild encounters", async ({ page }) => {
  await page.goto("/dev.html?test=1");
  await page.getByRole("button", { name: /Sprigget/ }).click();
  await page.evaluate(() => window.__briarbrookTestHooks?.forceEncounter());
  await expect(page.getByTestId("battle")).toContainText("Wild");

  await page.keyboard.press("Escape");

  await expect(page.getByTestId("battle")).toBeEmpty();
  await expect(page.getByTestId("dialogue")).toContainText("backed away");
});

test("tall grass can start and resolve a wild battle", async ({ page }) => {
  await page.goto("/dev.html?seed=1");

  await page.getByRole("button", { name: /Cindillo/ }).click();
  for (const key of ["ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowRight", "ArrowRight", "ArrowRight"]) {
    await page.keyboard.press(key);
  }

  await expect(page.getByTestId("battle")).toContainText("Battle Scene");
  await page.getByRole("button", { name: "Cinder Roll" }).click();
  await expect(page.getByTestId("dialogue")).toContainText(/fainted|used/);
});

test("player can capture a wild creature and restore autosave on reload", async ({ page }) => {
  await page.goto("/dev.html?seed=1");

  await page.getByRole("button", { name: /Cindillo/ }).click();
  for (const key of ["ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowRight", "ArrowRight", "ArrowRight"]) {
    await page.keyboard.press(key);
  }

  await page.getByRole("button", { name: "Capture Charm" }).click();
  await expect(page.getByTestId("field-guide")).toContainText("captured");

  await page.reload();
  await expect(page.getByTestId("field-guide")).toContainText("captured");
  await expect(page.getByTestId("status")).toContainText("Capture Charms: 4");
});

test("player can earn the Meadow Badge and see the win panel", async ({ page }) => {
  await page.goto("/dev.html?seed=999");

  await page.getByRole("button", { name: /Cindillo/ }).click();
  for (const key of ["ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "Space"]) {
    await page.keyboard.press(key);
  }

  await expect(page.getByTestId("battle")).toContainText("Badge Meadow");
  for (let i = 0; i < 4; i += 1) {
    await page.getByRole("button", { name: "Cinder Roll" }).click();
  }

  await expect(page.getByTestId("status")).toContainText("Meadow Badge: earned");
  await expect(page.getByTestId("win-panel")).toContainText("Briarbrook League begins");
});

test("root index works through direct file packaging", async ({ page }) => {
  await page.goto(pathToFileURL(`${process.cwd()}/index.html`).href);
  await page.evaluate(() => window.localStorage.clear());

  await expect(page.getByRole("heading", { name: "Briarbrook League" })).toBeVisible();
  await page.getByRole("button", { name: /Sprigget/ }).click();
  await expect(page.getByTestId("status")).toContainText("Starter: Sprigget");
});
