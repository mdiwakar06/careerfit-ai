import { executeEvaluation } from "../lib/ai/provider";
import { EvaluationResultSchema } from "../lib/types/evaluation";
import { SAMPLE_BACKEND_PROFILE } from "../lib/data/sampleProfiles";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runEvaluationSchemaTests() {
  console.log("\n🧪 Running SDET Test Suite: Evaluation Engine & Zod Schema Validation\n");

  const result = await executeEvaluation(
    SAMPLE_BACKEND_PROFILE.resumeText,
    SAMPLE_BACKEND_PROFILE.jobDescriptionText,
    SAMPLE_BACKEND_PROFILE.companyName,
    SAMPLE_BACKEND_PROFILE.roleTitle,
    SAMPLE_BACKEND_PROFILE.preferences,
    3,
    3
  );

  // Validate strictly with Zod schema
  const validation = EvaluationResultSchema.safeParse(result);
  assert(validation.success, `Result conforms 100% to EvaluationResultSchema: ${validation.error?.message || "OK"}`);

  // Validate Score boundaries
  assert(
    result.candidateJobMatch.overallScore >= 0 && result.candidateJobMatch.overallScore <= 10,
    `Overall match score is within [0, 10] range (${result.candidateJobMatch.overallScore})`
  );
  assert(
    result.companyCandidateFit.fitScore >= 0 && result.companyCandidateFit.fitScore <= 10,
    `Company fit score is within [0, 10] range (${result.companyCandidateFit.fitScore})`
  );

  // Validate Google X-Y-Z rewrites
  assert(result.googleXyzRewrites.length >= 2, `Generated at least 2 Google X-Y-Z rewrites (found ${result.googleXyzRewrites.length})`);
  for (const rw of result.googleXyzRewrites) {
    assert(Boolean(rw.breakdown.accomplishedX), "Accomplished [X] is populated");
    assert(Boolean(rw.breakdown.measuredByY), "Measured by [Y] is populated");
    assert(Boolean(rw.breakdown.byDoingZ), "By doing [Z] is populated");
  }

  console.log("\n🎉 ALL EVALUATION SCHEMA & GOOGLE X-Y-Z TESTS PASSED!\n");
}

runEvaluationSchemaTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
