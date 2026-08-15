import { NextRequest, NextResponse } from "next/server";
import { executeEvaluation } from "@/lib/ai/provider";
import { sanitizeResumePII } from "@/lib/sanitizer/pii";
import { chunkDocumentText } from "@/lib/vector/chunker";
import { storeEvaluationChunks, getSupabaseClient } from "@/lib/vector/supabase";
import { CandidatePreferencesSchema } from "@/lib/types/evaluation";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow sufficient duration for multi-agent LLM analysis

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      resumeText,
      jobDescriptionText,
      companyName = "Target Company",
      roleTitle = "Software Engineer",
      preferences,
    } = body;

    if (!resumeText || !jobDescriptionText) {
      return NextResponse.json(
        { error: "Both resume text and job description are required." },
        { status: 400 }
      );
    }

    // Validate candidate preferences with default fallbacks
    const validatedPreferences = CandidatePreferencesSchema.parse(
      preferences || {
        targetOrgType: "growth_scaleup",
        primaryCareerGoal: "technical_depth",
        redFlagsToAvoid: ["micromanagement"],
        customNotes: "",
      }
    );

    // 1. Sanitize Resume PII
    const piiResult = sanitizeResumePII(resumeText);
    const sanitizedResume = piiResult.sanitizedText;
    const sanitizedJd = jobDescriptionText.trim();

    // 2. Multi-Agent AI Evaluation
    const evaluationResult = await executeEvaluation(
      sanitizedResume,
      sanitizedJd,
      companyName,
      roleTitle,
      validatedPreferences,
      piiResult.redactedCount,
      piiResult.preservedLinks.length
    );

    const evaluationId = evaluationResult.id || `eval_${Date.now()}`;

    // 3. Chunk and Store for Grounded pgvector RAG
    try {
      const resumeChunks = chunkDocumentText(sanitizedResume, "resume");
      const jdChunks = chunkDocumentText(sanitizedJd, "job_description");
      const allChunks = [...resumeChunks, ...jdChunks];

      await storeEvaluationChunks(evaluationId, allChunks);

      // Store in Supabase if configured
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from("evaluations").insert({
          id: evaluationId,
          session_id: `anon_${Date.now()}`,
          target_role_title: roleTitle,
          target_company_name: companyName,
          overall_match_score: evaluationResult.candidateJobMatch.overallScore,
          technical_skill_score: evaluationResult.candidateJobMatch.technicalSkillScore,
          seniority_impact_score: evaluationResult.candidateJobMatch.seniorityImpactScore,
          domain_stack_score: evaluationResult.candidateJobMatch.domainStackScore,
          ats_score: evaluationResult.candidateJobMatch.atsScore,
          score_justification: evaluationResult.candidateJobMatch.scoreJustification,
          culture_fit_score: evaluationResult.companyCandidateFit.fitScore,
          org_type_alignment: evaluationResult.companyCandidateFit.orgTypeAlignment,
          career_goal_alignment: evaluationResult.companyCandidateFit.careerGoalAlignment,
          red_flag_risk_analysis: evaluationResult.companyCandidateFit.redFlagRiskAnalysis,
          culture_summary: evaluationResult.companyCandidateFit.cultureSummary,
          recommendation_verdict: evaluationResult.companyCandidateFit.recommendationVerdict,
          top_strengths: evaluationResult.candidateJobMatch.topStrengths,
          critical_gaps: evaluationResult.candidateJobMatch.criticalGaps,
          competitive_moats: evaluationResult.candidateJobMatch.competitiveMoats,
          google_xyz_rewrites: evaluationResult.googleXyzRewrites,
          interview_talking_points: evaluationResult.interviewTalkingPoints,
          sanitized_resume_metadata: {
            redactedCount: piiResult.redactedCount,
            preservedLinks: piiResult.preservedLinks,
          },
          candidate_preferences: validatedPreferences,
        });
      }
    } catch (vectorErr) {
      console.warn("Non-fatal vector indexing error:", vectorErr);
    }

    return NextResponse.json({
      success: true,
      data: evaluationResult,
      sanitization: {
        redactedCount: piiResult.redactedCount,
        detectedEntities: piiResult.detectedEntities,
        preservedLinks: piiResult.preservedLinks,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Evaluation execution error:", message);
    return NextResponse.json(
      { error: message || "Failed to complete evaluation" },
      { status: 500 }
    );
  }
}
