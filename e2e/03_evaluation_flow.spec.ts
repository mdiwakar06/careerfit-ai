import { test, expect } from "@playwright/test";

test.describe("Multi-Agent 3-Persona Evaluation Flow", () => {
  test("loads sample data, triggers evaluation, and renders dual gauges & gaps", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Click sample profile in Navbar
    const sampleButton = page.locator('button:has-text("Senior Backend")');
    await sampleButton.click();

    // 2. Verify inputs are pre-populated
    const roleInput = page.locator('input[placeholder*="Senior Backend Engineer"]');
    await expect(roleInput).toHaveValue("Senior Distributed Systems Engineer");

    const companyInput = page.locator('input[placeholder*="Stripe, OpenAI, Datadog"]');
    await expect(companyInput).toHaveValue("CloudScale Technologies");

    // 3. Trigger evaluation
    const evalButton = page.locator('button:has-text("Run Multi-Agent Evaluation")');
    await expect(evalButton).toBeEnabled();
    await evalButton.click();

    // 4. Wait for results dashboard
    const dashboard = page.locator("#evaluation-dashboard");
    await expect(dashboard).toBeVisible({ timeout: 45000 });

    // 5. Verify Dual Radial Gauge Cards are present
    await expect(page.locator("text=Evaluation Executive Summary")).toBeVisible();
    await expect(page.locator("text=Role & Technical Match")).toBeVisible();
    await expect(page.locator("text=Bidirectional Culture Fit")).toBeVisible();

    // 6. Verify Score Dimension Breakdown Bars
    await expect(page.locator("text=Core Tech (40%)")).toBeVisible();
    await expect(page.locator("text=Seniority/Scale (30%)")).toBeVisible();
    await expect(page.locator("text=ATS Clarity (10%)")).toBeVisible();

    // 7. Switch to Strengths & Gaps tab
    const strengthsTab = page.locator('button:has-text("Strengths & Gaps")');
    await strengthsTab.click();

    // Verify strengths, gaps, and competitive moats
    await expect(page.locator("text=Candidate Competitive Moats")).toBeVisible();
    await expect(page.locator("text=Exceeding Areas & Proven Strengths")).toBeVisible();
    await expect(page.locator("text=Skill & Experience Gap Analysis")).toBeVisible();
  });
});
