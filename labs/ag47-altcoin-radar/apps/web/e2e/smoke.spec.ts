import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("root redirects to dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test("sidebar navigation links exist and work", async ({ page }) => {
    await page.goto("/dashboard");

    // Check navigation items exist
    const oportunidadesLink = page.getByRole("link", { name: /oportunidades/i }).first();

    await expect(oportunidadesLink).toBeVisible();

    // Test navigation
    await oportunidadesLink.click();
    await expect(page).toHaveURL(/.*\/oportunidades/);
  });

  test("dashboard page loads successfully", async ({ page }) => {
    const response = await page.goto("/dashboard");
    expect(response?.status()).toBeLessThan(400);
  });
});
