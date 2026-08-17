import { UserFeedbackSchema } from "../lib/types/evaluation";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function testFeedbackSchema() {
  console.log("\n🧪 Running SDET Test Suite: Live User Feedback Schema\n");

  const sampleFeedback = {
    evaluationId: "eval_test_12345",
    rating: "thumbs_up" as const,
    scoringHarshness: "spot_on" as const,
    actionability: "highly_actionable" as const,
    feedbackText: "The Google X-Y-Z rewrites were extremely sharp and helped me quantify my metrics.",
    targetRoleTitle: "Senior Distributed Systems Engineer",
    targetCompanyName: "CloudScale Technologies",
  };

  const parsed = UserFeedbackSchema.safeParse(sampleFeedback);
  assert(parsed.success, "UserFeedbackSchema parsed valid payload successfully");

  const invalidFeedback = {
    evaluationId: "eval_invalid",
    rating: "invalid_rating",
  };
  const invalidParse = UserFeedbackSchema.safeParse(invalidFeedback);
  assert(!invalidParse.success, "Rejected invalid feedback rating enum");

  console.log("\n🎉 ALL USER FEEDBACK TESTS PASSED!\n");
}

testFeedbackSchema();
