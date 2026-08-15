import { sanitizeResumePII } from "../lib/sanitizer/pii";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runPiiTests() {
  console.log("\n🧪 Running SDET Test Suite: PII Sanitization & Link Preservation\n");

  const sampleRawResume = `John Doe
johndoe.eng@gmail.com | +1 (415) 555-0199 | 123 Market Street, San Francisco, CA 94105
GitHub: https://github.com/johndoe-dev | LinkedIn: https://linkedin.com/in/johndoe-engineer | Portfolio: https://johndoe.dev

SUMMARY
Software engineer with 5 years experience in distributed systems. Reach me at personal.email@yahoo.com or call 555-432-1098.

EXPERIENCE
Software Engineer at Acme Corp (2021-2024)
- Built distributed payment services.
`;

  const result = sanitizeResumePII(sampleRawResume);

  // Assertions
  assert(!result.sanitizedText.includes("johndoe.eng@gmail.com"), "Email johndoe.eng@gmail.com is redacted");
  assert(!result.sanitizedText.includes("personal.email@yahoo.com"), "Email personal.email@yahoo.com is redacted");
  assert(!result.sanitizedText.includes("+1 (415) 555-0199"), "Phone +1 (415) 555-0199 is redacted");
  assert(!result.sanitizedText.includes("555-432-1098"), "Phone 555-432-1098 is redacted");
  assert(result.sanitizedText.includes("[REDACTED_EMAIL]"), "Contains [REDACTED_EMAIL] placeholder");
  assert(result.sanitizedText.includes("[REDACTED_PHONE]"), "Contains [REDACTED_PHONE] placeholder");

  // Critical check: Developer Links MUST be preserved
  assert(
    result.sanitizedText.includes("https://github.com/johndoe-dev"),
    "GitHub URL is strictly preserved"
  );
  assert(
    result.sanitizedText.includes("https://linkedin.com/in/johndoe-engineer"),
    "LinkedIn URL is strictly preserved"
  );
  assert(
    result.sanitizedText.includes("https://johndoe.dev"),
    "Portfolio domain URL is strictly preserved"
  );

  assert(result.redactedCount >= 4, `Redacted count is at least 4 (found ${result.redactedCount})`);
  assert(result.preservedLinks.length >= 3, `Preserved links count is at least 3 (found ${result.preservedLinks.length})`);

  console.log("\n🎉 ALL PII SANITIZATION TESTS PASSED!\n");
}

runPiiTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
