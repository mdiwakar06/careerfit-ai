import { z } from "zod";

// Helper for forgiving enum string normalizations
const normalizeSeverity = (val: unknown) => {
  if (typeof val !== "string") return "moderate";
  const lower = val.toLowerCase().trim();
  if (lower.includes("block") || lower.includes("crit") || lower.includes("high") || lower.includes("severe")) {
    return "blocking";
  }
  if (lower.includes("min") || lower.includes("low")) {
    return "minor";
  }
  return "moderate";
};

const normalizeRiskLevel = (val: unknown) => {
  if (typeof val !== "string") return "medium";
  const lower = val.toLowerCase().trim();
  if (lower.includes("high") || lower.includes("elevat") || lower.includes("crit")) {
    return "high";
  }
  if (lower.includes("low") || lower.includes("min") || lower.includes("none")) {
    return "low";
  }
  return "medium";
};

const normalizeImpactRating = (val: unknown) => {
  if (typeof val !== "string") return "high";
  const lower = val.toLowerCase().trim();
  if (lower.includes("trans") || lower.includes("huge") || lower.includes("game")) {
    return "transformational";
  }
  if (lower.includes("mod") || lower.includes("med")) {
    return "medium";
  }
  if (lower.includes("low")) {
    return "medium";
  }
  return "high";
};

const normalizeImportance = (val: unknown) => {
  if (typeof val !== "string") return "high";
  const lower = val.toLowerCase().trim();
  if (lower.includes("crit")) return "critical";
  if (lower.includes("med") || lower.includes("mod")) return "medium";
  return "high";
};

const normalizeVerdict = (val: unknown) => {
  if (typeof val !== "string") return "Strong Alignment";
  const lower = val.toLowerCase().trim();
  if (lower.includes("high risk") || lower.includes("misalign") || lower.includes("poor")) {
    return "High Risk / Misaligned";
  }
  if (lower.includes("mod") || lower.includes("trade") || lower.includes("partial")) {
    return "Moderate Fit with Tradeoffs";
  }
  return "Strong Alignment";
};

const normalizeLevelDelta = (val: unknown) => {
  if (typeof val !== "string") return "on_level";
  const lower = val.toLowerCase().trim();
  if (lower.includes("under") || lower.includes("gap") || lower.includes("deficit") || lower.includes("junior") || lower.includes("fresher")) {
    return "underqualified";
  }
  if (lower.includes("over") || lower.includes("down") || lower.includes("senior") || lower.includes("staff")) {
    return "overqualified";
  }
  return "on_level";
};

const normalizePivotFeasibility = (val: unknown) => {
  if (typeof val !== "string") return "moderate";
  const lower = val.toLowerCase().trim();
  if (lower.includes("high") || lower.includes("strong") || lower.includes("easy")) {
    return "high";
  }
  if (lower.includes("low") || lower.includes("hard") || lower.includes("steep") || lower.includes("difficult")) {
    return "low";
  }
  return "moderate";
};

// --- Candidate Micro-Quiz Preferences ---
export const OrgTypeEnum = z.enum([
  "product_startup",
  "growth_scaleup",
  "tech_enterprise",
  "services_consulting",
]);
export type OrgType = z.infer<typeof OrgTypeEnum>;

export const CareerGoalEnum = z.enum([
  "technical_depth",
  "rapid_growth",
  "work_life_balance",
  "high_compensation",
]);
export type CareerGoal = z.infer<typeof CareerGoalEnum>;

export const RedFlagEnum = z.enum([
  "micromanagement",
  "legacy_tech",
  "chaotic_oncall",
  "unclear_strategy",
]);
export type RedFlag = z.infer<typeof RedFlagEnum>;

export const CandidatePreferencesSchema = z.object({
  targetOrgType: OrgTypeEnum,
  primaryCareerGoal: CareerGoalEnum,
  redFlagsToAvoid: z.array(RedFlagEnum),
  customNotes: z.string().optional().default(""),
});
export type CandidatePreferences = z.infer<typeof CandidatePreferencesSchema>;

// --- PII Sanitization Metadata ---
export const RedactedEntitySchema = z.object({
  type: z.enum(["email", "phone", "name", "address"]),
  originalMasked: z.string(),
});

export const PiiSanitizationResultSchema = z.object({
  sanitizedText: z.string(),
  redactedCount: z.number(),
  detectedEntities: z.array(RedactedEntitySchema),
  preservedLinks: z.array(z.string()),
});
export type PiiSanitizationResult = z.infer<typeof PiiSanitizationResultSchema>;

// --- Seniority Calibration & Asymmetry ---
export const SeniorityCalibrationSchema = z.object({
  candidateLevelDetected: z.string(),
  roleLevelRequired: z.string(),
  levelDelta: z.preprocess(
    normalizeLevelDelta,
    z.enum(["underqualified", "on_level", "overqualified"])
  ),
  yearsOfExperienceEstimated: z.number().optional().default(0),
  seniorityAnalysis: z.string(),
  stepMilestones: z.array(z.string()).optional().default([]),
});
export type SeniorityCalibration = z.infer<typeof SeniorityCalibrationSchema>;

// --- Cross-Domain Pivot & Transferability ---
export const DomainPivotSchema = z.object({
  isCrossDomain: z.boolean(),
  sourceDomain: z.string(),
  targetDomain: z.string(),
  transferableSkills: z.array(z.string()).optional().default([]),
  missingDomainFoundations: z.array(z.string()).optional().default([]),
  pivotFeasibilityRating: z.preprocess(
    normalizePivotFeasibility,
    z.enum(["high", "moderate", "low"])
  ),
  strategicAdvice: z.string(),
});
export type DomainPivot = z.infer<typeof DomainPivotSchema>;

// --- Multi-Agent Evaluation Output Schema ---

export const StrengthItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  evidenceFromResume: z.string().optional().default("Demonstrated across technical project milestones."),
  importanceToJob: z.preprocess(normalizeImportance, z.enum(["critical", "high", "medium"])),
});
export type StrengthItem = z.infer<typeof StrengthItemSchema>;

export const GapItemSchema = z.object({
  skillOrArea: z.string(),
  whyItMatters: z.string(),
  suggestedRemedy: z.string(),
  severity: z.preprocess(normalizeSeverity, z.enum(["blocking", "moderate", "minor"])),
});
export type GapItem = z.infer<typeof GapItemSchema>;

export const CandidateJobMatchSchema = z.object({
  overallScore: z.number().min(0).max(10),
  technicalSkillScore: z.number().min(0).max(10),
  seniorityImpactScore: z.number().min(0).max(10),
  domainStackScore: z.number().min(0).max(10),
  atsScore: z.number().min(0).max(10),
  scoreJustification: z.string(),
  topStrengths: z.array(StrengthItemSchema),
  criticalGaps: z.array(GapItemSchema),
  competitiveMoats: z.array(z.string()).optional().default([]),
});
export type CandidateJobMatch = z.infer<typeof CandidateJobMatchSchema>;

export const RedFlagRiskItemSchema = z.object({
  redFlag: z.string(),
  riskLevel: z.preprocess(normalizeRiskLevel, z.enum(["low", "medium", "high"])),
  signalSource: z.string().optional().default("Job Description / Engineering Operating Model"),
  explanation: z.string(),
});
export type RedFlagRiskItem = z.infer<typeof RedFlagRiskItemSchema>;

export const CompanyCandidateFitSchema = z.object({
  fitScore: z.number().min(0).max(10),
  orgTypeAlignment: z.object({
    score: z.number().min(0).max(10),
    summary: z.string(),
  }),
  careerGoalAlignment: z.object({
    score: z.number().min(0).max(10),
    summary: z.string(),
  }),
  redFlagRiskAnalysis: z.array(RedFlagRiskItemSchema).optional().default([]),
  cultureSummary: z.string(),
  recommendationVerdict: z.preprocess(
    normalizeVerdict,
    z.enum([
      "Strong Alignment",
      "Moderate Fit with Tradeoffs",
      "High Risk / Misaligned",
    ])
  ),
});
export type CompanyCandidateFit = z.infer<typeof CompanyCandidateFitSchema>;

// Google X-Y-Z Formula: Accomplished [X], measured by [Y], by doing [Z]
export const GoogleXyzRewriteItemSchema = z.object({
  id: z.string().optional(),
  originalBullet: z.string(),
  rewrittenBullet: z.string(),
  breakdown: z.object({
    accomplishedX: z.string(),
    measuredByY: z.string(),
    byDoingZ: z.string(),
  }),
  targetRoleRelevance: z.string(),
  estimatedImpactRating: z.preprocess(
    normalizeImpactRating,
    z.enum(["transformational", "high", "medium"])
  ),
});
export type GoogleXyzRewriteItem = z.infer<typeof GoogleXyzRewriteItemSchema>;

export const InterviewTalkingPointSchema = z.object({
  question: z.string(),
  strategicAngle: z.string(),
  talkingPoints: z.array(z.string()),
  trapToAvoid: z.string(),
});
export type InterviewTalkingPoint = z.infer<typeof InterviewTalkingPointSchema>;

export const EvaluationResultSchema = z.object({
  id: z.string().optional(),
  targetRoleTitle: z.string(),
  targetCompanyName: z.string(),
  candidateJobMatch: CandidateJobMatchSchema,
  companyCandidateFit: CompanyCandidateFitSchema,
  seniorityCalibration: SeniorityCalibrationSchema.optional(),
  domainPivot: DomainPivotSchema.optional(),
  googleXyzRewrites: z.array(GoogleXyzRewriteItemSchema),
  interviewTalkingPoints: z.array(InterviewTalkingPointSchema),
  sanitizationMeta: z
    .object({
      redactedCount: z.number(),
      preservedLinksCount: z.number(),
    })
    .optional()
    .default({ redactedCount: 0, preservedLinksCount: 0 }),
  createdAt: z.string().optional(),
});
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

// --- Grounded Chat Workspace ---
export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.string(),
  citations: z
    .array(
      z.object({
        docType: z.enum(["resume", "job_description"]),
        snippet: z.string(),
      })
    )
    .optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
