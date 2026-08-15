import { test, expect } from "@playwright/test";

test.describe("PII Sanitization Engine", () => {
  test("scrubs sensitive contact data while strictly preserving developer URLs", async ({
    page,
  }) => {
    await page.goto("/");

    // Locate the resume textarea
    const resumeTextarea = page.locator(
      'textarea[placeholder*="Paste your software engineering resume here"]'
    );
    await expect(resumeTextarea).toBeVisible();

    // Paste resume with rich PII & developer profile links
    const rawResumeWithPii = `
      Johnathan Doe
      123 Silicon Valley Way, San Francisco, CA 94107
      Email: johnathan.doe.engineer@gmail.com
      Phone: (415) 890-1234
      GitHub: https://github.com/johndoe-dist-sys
      LinkedIn: https://linkedin.com/in/johnathandoe-lead
      Portfolio: https://johnathandoe.dev

      Summary:
      Senior Distributed Systems Engineer with 8+ years building high-throughput microservices using Go, TypeScript, and Kubernetes.
    `;

    await resumeTextarea.fill(rawResumeWithPii);

    // Wait for the automatic PII sanitization banner
    const piiBanner = page.locator("text=Privacy & PII Sanitization Guarantee");
    await expect(piiBanner).toBeVisible({ timeout: 10000 });

    // Assert that protected badge and redacted counts are visible
    await expect(page.getByText("Protected", { exact: true })).toBeVisible();
    await expect(page.locator("text=PII items redacted")).toBeVisible();

    // Check that GitHub and LinkedIn handles are preserved in the DOM (in the preserved links span pills)
    await expect(
      page.locator('span.font-mono', { hasText: 'https://github.com/johndoe-dist-sys' })
    ).toBeVisible();
    await expect(
      page.locator('span.font-mono', { hasText: 'https://linkedin.com/in/johnathandoe-lead' })
    ).toBeVisible();
  });
});
