import { PRESET_SCENARIOS } from "../lib/data/presets";
import { executeEvaluation } from "../lib/ai/provider";
import { EvaluationResultSchema } from "../lib/types/evaluation";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runEdgeCaseCalibrationTests() {
  console.log("\n🧪 Running SDET Test Suite: High-Precision Edge-Case Calibration\n");

  for (const preset of PRESET_SCENARIOS) {
    console.log(`--- Testing Scenario: [${preset.name}] (${preset.badge}) ---`);
    const result = await executeEvaluation(
      preset.resumeText,
      preset.jobDescriptionText,
      preset.companyName,
      preset.roleTitle,
      preset.preferences
    );

    // Schema Validation
    const parsed = EvaluationResultSchema.safeParse(result);
    assert(parsed.success, `Schema conforms 100% for scenario ${preset.id}`);

    // Scenario-Specific Assertions
    if (preset.id === "senior_backend") {
      assert(
        result.candidateJobMatch.overallScore >= 7.5,
        `Senior match score is high (Received: ${result.candidateJobMatch.overallScore})`
      );
      assert(
        result.seniorityCalibration?.levelDelta === "on_level",
        `Senior match calibrated as on_level`
      );
      assert(
        result.companyCandidateFit.recommendationVerdict === "Strong Alignment",
        `Culture verdict is Strong Alignment`
      );
    }

    if (preset.id === "fresher_to_staff") {
      assert(
        result.candidateJobMatch.overallScore <= 4.5,
        `Fresher -> Staff score is properly penalized (Received: ${result.candidateJobMatch.overallScore})`
      );
      assert(
        result.seniorityCalibration?.levelDelta === "underqualified",
        `Fresher calibrated as underqualified for Staff role`
      );
      assert(
        (result.seniorityCalibration?.stepMilestones.length || 0) > 0,
        `Generated stepped milestones for career advancement`
      );
    }

    if (preset.id === "staff_to_junior") {
      assert(
        result.candidateJobMatch.technicalSkillScore >= 9.0,
        `Staff technical capability is rated high (Received: ${result.candidateJobMatch.technicalSkillScore})`
      );
      assert(
        result.seniorityCalibration?.levelDelta === "overqualified",
        `Staff calibrated as overqualified for Junior role`
      );
    }

    if (preset.id === "ds_to_swe") {
      assert(
        result.domainPivot?.isCrossDomain === true,
        `Data Scientist -> Backend Lead flagged as isCrossDomain`
      );
      assert(
        (result.domainPivot?.transferableSkills.length || 0) > 0,
        `Identified transferable skills (${result.domainPivot?.transferableSkills.join(", ")})`
      );
      assert(
        (result.domainPivot?.missingDomainFoundations.length || 0) > 0,
        `Identified missing domain foundations (${result.domainPivot?.missingDomainFoundations.join(", ")})`
      );
    }

    if (preset.id === "culture_mismatch") {
      assert(
        result.candidateJobMatch.technicalSkillScore >= 8.5,
        `Technical match remains high (Received: ${result.candidateJobMatch.technicalSkillScore})`
      );
      assert(
        result.companyCandidateFit.fitScore <= 5.5,
        `Culture fit score penalized for 24/7 oncall & micromanagement (Received: ${result.companyCandidateFit.fitScore})`
      );
      assert(
        result.companyCandidateFit.recommendationVerdict === "High Risk / Misaligned",
        `Culture verdict flagged as High Risk / Misaligned`
      );
    }

    console.log("");
  }

  console.log("🎉 ALL 5 HIGH-PRECISION EDGE-CASE CALIBRATION TESTS PASSED!\n");
}

runEdgeCaseCalibrationTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
