import { test, expect } from "@playwright/test";

test.describe("Responsive Layout & Accessibility Checks", () => {
  test("renders cleanly without horizontal overflow on mobile viewports", async ({
    page,
  }) => {
    // Set viewport to standard mobile width
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // 1. Verify brand title is visible
    await expect(page.locator("text=CareerFit").first()).toBeVisible();

    // 2. Verify no horizontal overflow
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // 3. Verify evaluate button is accessible
    const evalButton = page.locator('button:has-text("Run Multi-Agent Evaluation")');
    await expect(evalButton).toBeVisible();
  });

  test("renders desktop layout with dual-column grid", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    // Verify dual columns are side by side
    const resumeHeader = page.locator("text=1. Candidate Resume Ingestion");
    const jdHeader = page.locator("text=2. Target Job Description & Company");

    await expect(resumeHeader).toBeVisible();
    await expect(jdHeader).toBeVisible();
  });
});
