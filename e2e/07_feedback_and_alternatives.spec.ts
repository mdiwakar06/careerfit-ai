import { test, expect } from "@playwright/test";

test.describe("Bar-Raiser Alternative Roles & 30-Second Live Feedback Flow", () => {
  test("renders alternative higher-fit roles and submits live user feedback", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Select Fresher -> Staff scenario
    await page.locator('button:has-text("Test Scenarios")').click();
    await page.locator('button:has-text("Junior Fresher → Staff Architect")').click();

    // 2. Run evaluation
    await page.locator('button:has-text("Run Multi-Agent Evaluation")').click();
    await expect(page.locator("#evaluation-dashboard")).toBeVisible({
      timeout: 45000,
    });

    // 3. Verify Career Compass: Alternative High-Fit Roles
    await expect(
      page.locator("text=Career Compass: Alternative High-Fit Roles")
    ).toBeVisible();
    await expect(
      page.locator("text=Associate Full-Stack Software Engineer")
    ).toBeVisible();

    // 4. Test 30-Second Live Feedback Widget
    await expect(page.locator("text=30-Second Live Feedback")).toBeVisible();

    // Click "Accurate & Insightful"
    const thumbsUpButton = page.locator('button:has-text("Accurate & Insightful")');
    await expect(thumbsUpButton).toBeVisible();
    await thumbsUpButton.click();

    // Select MCQ options
    const spotOnOption = page.locator('button:has-text("🎯 Spot On Calibration")');
    await expect(spotOnOption).toBeVisible();
    await spotOnOption.click();

    const actionableOption = page.locator('button:has-text("⚡ Highly Actionable")');
    await expect(actionableOption).toBeVisible();
    await actionableOption.click();

    // Type optional feedback
    const feedbackInput = page.locator('input[placeholder*="What would make this 10x better"]');
    await expect(feedbackInput).toBeVisible();
    await feedbackInput.fill("The alternative role recommendations are extremely practical and accurate!");

    // Submit Feedback
    const submitButton = page.locator('button:has-text("Submit Feedback")');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Verify Thank You Confirmation Banner
    await expect(
      page.locator("text=Thank You for the 30-Second Feedback!")
    ).toBeVisible({ timeout: 5000 });
  });
});
