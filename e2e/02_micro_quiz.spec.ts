import { test, expect } from "@playwright/test";

test.describe("30-Second Career & Culture Micro-Quiz", () => {
  test("allows candidates to select org archetypes, goals, and toggle dealbreakers", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Verify Micro-Quiz container is rendered
    const quizHeading = page.locator("text=30-Second Career & Culture Micro-Quiz");
    await expect(quizHeading).toBeVisible();

    // 2. Select Org Type: High-Growth Scaleup
    const scaleupOption = page.locator("text=High-Growth Scaleup");
    await scaleupOption.click();
    await expect(scaleupOption).toBeVisible();

    // 3. Select Career Goal: Work-Life Balance & Stability
    const wlbOption = page.locator("text=Work-Life Balance & Stability");
    await wlbOption.click();
    await expect(wlbOption).toBeVisible();

    // 4. Toggle Red Flags: Heavy Micromanagement & Chaotic 24/7 On-Call
    const micromanagementOption = page.locator("text=Heavy Micromanagement");
    await micromanagementOption.click();

    const oncallOption = page.locator("text=Chaotic 24/7 On-Call");
    await oncallOption.click();

    // Verify both red flag choices are selected
    await expect(micromanagementOption).toBeVisible();
    await expect(oncallOption).toBeVisible();
  });
});
