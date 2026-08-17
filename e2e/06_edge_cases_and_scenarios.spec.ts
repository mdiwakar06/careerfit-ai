import { test, expect } from "@playwright/test";

test.describe("Calibration Edge-Case Scenarios & Export Flow", () => {
  test("switches between scenario presets and validates seniority badges & export", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Open Scenarios Dropdown in Navbar
    const scenariosButton = page.locator('button:has-text("Test Scenarios")');
    await expect(scenariosButton).toBeVisible();
    await scenariosButton.click();

    // 2. Select "Junior Fresher → Staff Architect" scenario
    const fresherOption = page.locator('button:has-text("Junior Fresher → Staff Architect")');
    await expect(fresherOption).toBeVisible();
    await fresherOption.click();

    // 3. Trigger evaluation
    const evalButton = page.locator('button:has-text("Run Multi-Agent Evaluation")');
    await expect(evalButton).toBeEnabled();
    await evalButton.click();

    // 4. Wait for dashboard
    const dashboard = page.locator("#evaluation-dashboard");
    await expect(dashboard).toBeVisible({ timeout: 45000 });

    // 5. Verify Seniority Deficit Badge
    await expect(
      page.locator("text=Seniority Deficit (Ramp-Up Required)")
    ).toBeVisible();

    // 6. Test Export Modal
    const exportButton = page.locator('button:has-text("Export Report (.md / PDF)")');
    await expect(exportButton).toBeVisible();
    await exportButton.click();

    // Verify Modal appears with copy and download options
    await expect(page.locator("text=Export Evaluation Report")).toBeVisible();
    await expect(page.locator('button:has-text("Copy Markdown")')).toBeVisible();
    await expect(page.locator('button:has-text("Download .md File")')).toBeVisible();

    // Close Modal
    await page.locator("button:has(svg.lucide-x)").click();
    await expect(page.locator("text=Export Evaluation Report")).not.toBeVisible();
  });

  test("validates cross-domain pivot matrix rendering", async ({ page }) => {
    await page.goto("/");

    // 1. Select "Data Scientist → Backend Lead" scenario
    await page.locator('button:has-text("Test Scenarios")').click();
    await page.locator('button:has-text("Data Scientist → Backend Lead")').click();

    // 2. Run evaluation
    await page.locator('button:has-text("Run Multi-Agent Evaluation")').click();
    await expect(page.locator("#evaluation-dashboard")).toBeVisible({
      timeout: 45000,
    });

    // 3. Verify Cross-Domain Pivot Card
    await expect(
      page.locator("text=Cross-Domain Career Pivot Analysis")
    ).toBeVisible();
    await expect(page.locator("text=Transferable Competencies:")).toBeVisible();
    await expect(
      page.locator("text=Missing Core Domain Foundations:")
    ).toBeVisible();
  });
});
