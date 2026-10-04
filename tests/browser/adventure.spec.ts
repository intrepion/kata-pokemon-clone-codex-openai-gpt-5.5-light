import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("player can choose a starter and move on the tile map", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Briarbrook League" })).toBeVisible();
  await page.getByRole("button", { name: /Cindillo/ }).click();
  await expect(page.getByTestId("status")).toContainText("Starter: Cindillo");

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("status")).toContainText("Tile 3,7");

  await page.keyboard.press("Space");
  await expect(page.getByTestId("dialogue")).toContainText("Nothing responds.");
});

test("mobile controls expose movement and confirm actions", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Right", exact: true }).click();
  await expect(page.getByTestId("status")).toContainText("Tile 3,7");

  await page.getByRole("button", { name: "A", exact: true }).click();
  await expect(page.getByTestId("dialogue")).toContainText("Nothing responds.");
});

test("tall grass can start and resolve a wild battle", async ({ page }) => {
  await page.goto("/?seed=1");

  await page.getByRole("button", { name: /Cindillo/ }).click();
  for (const key of ["ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowRight", "ArrowRight", "ArrowRight"]) {
    await page.keyboard.press(key);
  }

  await expect(page.getByTestId("battle")).toContainText("Battle Scene");
  await page.getByRole("button", { name: "Cinder Roll" }).click();
  await expect(page.getByTestId("dialogue")).toContainText(/fainted|used/);
});

test("player can capture a wild creature and restore autosave on reload", async ({ page }) => {
  await page.goto("/?seed=1");

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
