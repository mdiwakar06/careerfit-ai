import { test, expect } from "@playwright/test";

test.describe("Google X-Y-Z Rewriter & Grounded AI Chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Load sample data & run evaluation
    await page.locator('button:has-text("Backend")').click();
    await page.locator('button:has-text("Run Multi-Agent Evaluation")').click();
    await expect(page.locator("#evaluation-dashboard")).toBeVisible({
      timeout: 25000,
    });
  });

  test("renders Google X-Y-Z formula rewrites with copy interaction", async ({
    page,
  }) => {
    // 1. Switch to Google X-Y-Z Rewrites tab
    const rewritesTab = page.locator('button:has-text("Google X-Y-Z Rewrites")');
    await rewritesTab.click();

    // 2. Verify Google X-Y-Z rewriter header
    await expect(
      page.locator("text=Google X-Y-Z Resume Bullet Rewriter")
    ).toBeVisible();

    // 3. Verify breakdown tags: Accomplished [X], Measured by [Y], By doing [Z]
    await expect(page.locator("text=Accomplished [X]").first()).toBeVisible();
    await expect(page.locator("text=Measured by [Y]").first()).toBeVisible();
    await expect(page.locator("text=By doing [Z]").first()).toBeVisible();

    // 4. Click the Copy button on the first rewrite card
    const copyButton = page.locator('button:has-text("Copy")').first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // Verify feedback state changed to "Copied!"
    await expect(page.locator("text=Copied!").first()).toBeVisible();
  });

  test("interacts with Grounded AI Chat using starter prompt", async ({
    page,
  }) => {
    // 1. Switch to Grounded AI Chat tab
    const chatTab = page.locator('button:has-text("Grounded AI Chat")');
    await chatTab.click();

    // 2. Verify chat welcome message
    await expect(page.locator("text=CareerFit AI Co-Pilot")).toBeVisible();

    // 3. Click a starter pill prompt
    const starterPill = page
      .getByRole("button", {
        name: "Draft a 3-bullet cold email to the Engineering Hiring Manager",
      })
      .first();
    await expect(starterPill).toBeVisible();
    await starterPill.click();

    // 4. Verify user message appears in chat bubbles
    const userBubble = page.locator(".whitespace-pre-wrap", {
      hasText: "Draft a 3-bullet cold email to the Engineering Hiring Manager",
    });
    await expect(userBubble).toBeVisible();

    // 5. Verify assistant message appears in chat transcript
    const chatContainer = page.locator("div.flex-1.overflow-y-auto");
    await expect(chatContainer).toBeVisible();
  });
});
