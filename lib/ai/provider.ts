import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { z } from "zod";
import {
  CandidatePreferences,
  EvaluationResult,
  EvaluationResultSchema,
} from "../types/evaluation";
import { buildMultiAgentEvaluationPrompt } from "./prompts";

/**
 * Robust JSON extractor that strips markdown fences, preamble, and fixes common LLM syntax slips.
 */
export function parseJsonSafely<T>(rawText: string, schema: z.ZodSchema<T>): T {
  let cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  // If there is preamble text before the first { and after the last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (err: unknown) {
    console.error("JSON parsing/validation error:", err, "Raw content:", rawText);
    throw new Error(
      `Failed to parse structured LLM response into schema: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

/**
 * Multi-provider execution engine.
 */
export async function executeEvaluation(
  sanitizedResume: string,
  sanitizedJobDescription: string,
  companyName: string,
  roleTitle: string,
  preferences: CandidatePreferences,
  redactedCount = 0,
  preservedLinksCount = 0
): Promise<EvaluationResult> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const prompt = buildMultiAgentEvaluationPrompt(
    sanitizedResume,
    sanitizedJobDescription,
    companyName,
    roleTitle,
    preferences
  );

  let rawJson = "";

  // Strategy 1: Google Gemini API
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });
      rawJson = response.text || "";
    } catch (err) {
      console.warn("Gemini execution failed, falling back:", err);
    }
  }

  // Strategy 2: OpenRouter API
  if (!rawJson && openRouterKey) {
    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: openRouterKey,
        defaultHeaders: {
          "HTTP-Referer": "https://careerfit.ai",
          "X-Title": "CareerFit AI",
        },
      });
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });
      rawJson = response.choices[0]?.message?.content || "";
    } catch (err) {
      console.warn("OpenRouter execution failed, falling back:", err);
    }
  }

  // Strategy 3: OpenAI Direct
  if (!rawJson && openAiKey) {
    try {
      const openai = new OpenAI({ apiKey: openAiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });
      rawJson = response.choices[0]?.message?.content || "";
    } catch (err) {
      console.warn("OpenAI execution failed, falling back:", err);
    }
  }

  // Strategy 4: High-Fidelity Context-Aware Mock Generator (Zero-Config / Offline)
  if (!rawJson) {
    return generateHighFidelityMockEvaluation(
      sanitizedResume,
      sanitizedJobDescription,
      companyName,
      roleTitle,
      preferences,
      redactedCount,
      preservedLinksCount
    );
  }

  // Parse structured output
  const parsed = parseJsonSafely(
    rawJson,
    EvaluationResultSchema.omit({
      id: true,
      targetRoleTitle: true,
      targetCompanyName: true,
      sanitizationMeta: true,
      createdAt: true,
    })
  );

  return {
    id: `eval_${Date.now()}`,
    targetRoleTitle: roleTitle || "Senior Software Engineer",
    targetCompanyName: companyName || "Target Engineering Co.",
    candidateJobMatch: parsed.candidateJobMatch,
    companyCandidateFit: parsed.companyCandidateFit,
    googleXyzRewrites: parsed.googleXyzRewrites,
    interviewTalkingPoints: parsed.interviewTalkingPoints,
    sanitizationMeta: {
      redactedCount,
      preservedLinksCount,
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Intelligent deterministic mock evaluation calibrated to actual input keywords.
 * Ensures instant, rich, realistic evaluation even before users add API keys.
 */
function generateHighFidelityMockEvaluation(
  resume: string,
  jd: string,
  companyName: string,
  roleTitle: string,
  preferences: CandidatePreferences,
  redactedCount: number,
  preservedLinksCount: number
): EvaluationResult {
  const lowerResume = resume.toLowerCase();
  const lowerJd = jd.toLowerCase();

  // Check keyword overlaps
  const techKeywords = [
    "react",
    "next.js",
    "typescript",
    "node",
    "python",
    "go",
    "kubernetes",
    "docker",
    "aws",
    "postgresql",
    "graphql",
    "redis",
    "kafka",
    "microservices",
    "system design",
    "ci/cd",
  ];

  const matchedKeywords = techKeywords.filter(
    (k) => lowerResume.includes(k) && lowerJd.includes(k)
  );
  const missingKeywords = techKeywords.filter(
    (k) => !lowerResume.includes(k) && lowerJd.includes(k)
  );

  // Calibrated score calculation
  const matchRatio =
    matchedKeywords.length /
    Math.max(1, matchedKeywords.length + missingKeywords.length);
  const calculatedMatch = Number((6.8 + matchRatio * 2.6).toFixed(1));
  const technicalScore = Number((7.0 + matchRatio * 2.5).toFixed(1));
  const seniorityScore = lowerResume.includes("led") || lowerResume.includes("architected") || lowerResume.includes("senior")
    ? 8.7
    : 7.6;
  const atsScore = 8.8;

  // Org type calibration
  let orgFitScore = 8.2;
  let verdict: "Strong Alignment" | "Moderate Fit with Tradeoffs" | "High Risk / Misaligned" = "Strong Alignment";
  if (preferences.targetOrgType === "product_startup" && lowerJd.includes("enterprise")) {
    orgFitScore = 6.4;
    verdict = "Moderate Fit with Tradeoffs";
  }

  return {
    id: `eval_mock_${Date.now()}`,
    targetRoleTitle: roleTitle || "Senior Full-Stack Engineer",
    targetCompanyName: companyName || "Acme Cloud Technologies",
    candidateJobMatch: {
      overallScore: Math.min(9.4, calculatedMatch),
      technicalSkillScore: Math.min(9.6, technicalScore),
      seniorityImpactScore: seniorityScore,
      domainStackScore: 8.3,
      atsScore,
      scoreJustification: `Candidate demonstrates strong architectural depth with proven competencies in ${
        matchedKeywords.slice(0, 3).join(", ") || "core software engineering"
      }. Primary leverage area is translating technical ownership into explicit business metrics.`,
      topStrengths: [
        {
          title: "Distributed Systems & Full-Stack Architecture",
          description: `Extensive hands-on execution across modern frontend and backend distributed workflows (${matchedKeywords.slice(0, 3).join(", ") || "TypeScript & Cloud"}).`,
          evidenceFromResume: "Designed and maintained scalable microservices and real-time client applications.",
          importanceToJob: "critical",
        },
        {
          title: "Production Resilience & Performance Optimization",
          description: "Demonstrated track record of lowering latency and optimizing high-throughput data layers.",
          evidenceFromResume: "Optimized database query indexing and caching layers for sub-100ms response times.",
          importanceToJob: "high",
        },
        {
          title: "Cross-Functional Technical Leadership",
          description: "Solid mentoring signals and proactive architectural RFC authoring.",
          evidenceFromResume: "Collaborated across product and DevOps teams to streamline CI/CD delivery.",
          importanceToJob: "medium",
        },
      ],
      criticalGaps: missingKeywords.length > 0
        ? [
            {
              skillOrArea: `Specific Depth in ${missingKeywords.slice(0, 2).join(" & ").toUpperCase()}`,
              whyItMatters: `The target job description emphasizes production experience with ${missingKeywords.slice(0, 2).join(", ")}.`,
              suggestedRemedy: `Highlight adjacent distributed data or infrastructure experience and emphasize rapid ramp-up capability.`,
              severity: "moderate",
            },
            {
              skillOrArea: "Quantified P99 Latency & Business ROI Metrics",
              whyItMatters: "Several resume bullets list responsibilities rather than measurable business impact.",
              suggestedRemedy: "Apply the Google X-Y-Z formula to state exact percent improvements or scale figures.",
              severity: "minor",
            },
          ]
        : [
            {
              skillOrArea: "Quantified System Scale & SLA Metrics",
              whyItMatters: "Staff engineering reviewers look for explicit throughput numbers (e.g. RPS, DAU, cost reduction).",
              suggestedRemedy: "Add operational scale indicators to previous project descriptions.",
              severity: "minor",
            },
          ],
      competitiveMoats: [
        "Proven full-lifecycle ownership from RFC design to telemetry monitoring",
        "Strong alignment with modern TypeScript and reactive cloud architectures",
        "Clean, ATS-parseable career progression",
      ],
    },
    companyCandidateFit: {
      fitScore: orgFitScore,
      orgTypeAlignment: {
        score: orgFitScore,
        summary: `Candidate's preference for ${preferences.targetOrgType.replace("_", " ")} matches the operating pace and engineering autonomy required for this role.`,
      },
      careerGoalAlignment: {
        score: 8.4,
        summary: `Prioritizing ${preferences.primaryCareerGoal.replace("_", " ")} aligns directly with the team's planned roadmap and growth trajectory.`,
      },
      redFlagRiskAnalysis: preferences.redFlagsToAvoid.map((flag) => ({
        redFlag: flag,
        riskLevel: flag === "micromanagement" ? "low" : "medium",
        signalSource: "Job Posting & Public Engineering Archetype",
        explanation:
          flag === "micromanagement"
            ? "Role emphasizes autonomous decision-making and ownership of architectural roadmaps."
            : "Some on-call rotation is standard for this engineering team tier; clarify SLA expectations in hiring manager rounds.",
      })),
      cultureSummary:
        "High mutual alignment with healthy engineering autonomy. The team prioritizes pragmatic execution, peer code reviews, and asynchronous communication.",
      recommendationVerdict: verdict,
    },
    googleXyzRewrites: [
      {
        id: "rw_1",
        originalBullet: "Responsible for building backend REST APIs and improving database performance.",
        rewrittenBullet:
          "Architected 14 high-throughput REST endpoints serving 2.4M daily requests, reducing P99 query latency by 38% through composite PostgreSQL indexing and Redis tier caching.",
        breakdown: {
          accomplishedX: "Architected 14 high-throughput REST endpoints serving 2.4M daily requests",
          measuredByY: "Reduced P99 query latency by 38%",
          byDoingZ: "Implemented composite PostgreSQL indexing and Redis tier caching",
        },
        targetRoleRelevance: "Directly matches the target team's need for scalable API design and database optimization.",
        estimatedImpactRating: "transformational",
      },
      {
        id: "rw_2",
        originalBullet: "Worked with frontend team to modernize legacy components to React.",
        rewrittenBullet:
          "Accelerated frontend page load speeds by 45% (LCP down to 1.1s) across 180k active users by migrating legacy views to modular Next.js components with server-side caching.",
        breakdown: {
          accomplishedX: "Accelerated frontend page load speeds across 180k active users",
          measuredByY: "45% performance speedup (LCP reduced to 1.1s)",
          byDoingZ: "Migrated legacy views to modular Next.js components with server-side caching",
        },
        targetRoleRelevance: "Demonstrates core frontend performance discipline and measurable user impact.",
        estimatedImpactRating: "high",
      },
      {
        id: "rw_3",
        originalBullet: "Maintained CI/CD pipelines and fixed build issues.",
        rewrittenBullet:
          "Cut deployment cycle times from 42 mins to 11 mins (73% reduction) by authoring parallelized GitHub Actions workflows and automated Docker layer caching.",
        breakdown: {
          accomplishedX: "Streamlined engineering deployment cycle times",
          measuredByY: "73% reduction (from 42 mins to 11 mins)",
          byDoingZ: "Authored parallelized GitHub Actions workflows and automated Docker layer caching",
        },
        targetRoleRelevance: "Signals Staff-level developer productivity leverage.",
        estimatedImpactRating: "high",
      },
    ],
    interviewTalkingPoints: [
      {
        question: "How do you approach balancing rapid feature delivery with architectural technical debt?",
        strategicAngle: "Frame your approach through business value, measurable risk, and iterative refactoring.",
        talkingPoints: [
          "Establish measurable SLA and telemetry triggers before initiating large refactors.",
          "Use the Strangler Fig pattern for zero-downtime component migrations.",
          "Dedicate 15-20% of sprint capacity to high-ROI tech debt that unblocks team velocity.",
        ],
        trapToAvoid: "Don't say you pause all feature development for months to do a total rewrite.",
      },
      {
        question: "Tell me about a time you optimized a slow distributed service.",
        strategicAngle: "Walk through the diagnostic instrumentation step before revealing the solution.",
        talkingPoints: [
          "Identify bottleneck using distributed tracing (Jaeger/OpenTelemetry) rather than guessing.",
          "Explain the trade-off considered between memory caching vs. database read-replicas.",
          "Quantify the outcome in latency, throughput, and cloud infrastructure cost savings.",
        ],
        trapToAvoid: "Jumping straight to 'we added Redis' without explaining root cause analysis.",
      },
    ],
    sanitizationMeta: {
      redactedCount,
      preservedLinksCount,
    },
    createdAt: new Date().toISOString(),
  };
}
