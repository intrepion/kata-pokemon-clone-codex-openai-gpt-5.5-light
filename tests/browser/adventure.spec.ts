import { expect, test } from "@playwright/test";

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
