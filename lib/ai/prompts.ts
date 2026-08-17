import { CandidatePreferences } from "../types/evaluation";

export function buildMultiAgentEvaluationPrompt(
  sanitizedResume: string,
  sanitizedJobDescription: string,
  companyName: string,
  roleTitle: string,
  preferences: CandidatePreferences
): string {
  return `You are an elite, calibrated multi-agent hiring evaluation panel for technology and software engineering roles.
The panel consists of three distinct personas:
1. SENIOR ATS ARCHITECT: Evaluates hard skill taxonomy, keyword density, semantic parseability, and clear section structure.
2. EXECUTIVE TECHNICAL RECRUITER: Evaluates narrative coherence, seniority calibration, compensation/scope tier, career trajectory, and overqualification/underqualification risks.
3. STAFF ENGINEERING HIRING MANAGER: Evaluates technical decision depth, system scale (RPS, DAU, latency, throughput), architectural ownership, trade-off awareness, and quantified business impact.

ADDITIONALLY, you act as the BIDIRECTIONAL CULTURE & RED-FLAG SYNTHESIZER:
You objectively evaluate the candidate's stated preferences and red-lines against the realistic operating profile of ${companyName || "the target company"} for the role of ${roleTitle || "the target position"}.

=== INPUT DATA ===

[CANDIDATE'S SANITIZED RESUME (PII Redacted)]
${sanitizedResume}

[JOB DESCRIPTION & REQUIREMENTS]
Company: ${companyName || "Target Company"}
Role: ${roleTitle || "Software Engineer"}
Details:
${sanitizedJobDescription}

[CANDIDATE PREFERENCES & MICRO-QUIZ]
Target Org Type: ${preferences.targetOrgType}
Primary Career Priority: ${preferences.primaryCareerGoal}
Red Flags to Avoid: ${preferences.redFlagsToAvoid.join(", ") || "None specified"}
Custom Notes: ${preferences.customNotes || "None"}

=== CRITICAL CALIBRATION & SCORING RUBRICS ===

1. SENIORITY & LEVEL CALIBRATION (STRICT ASYMMETRY RULE):
   - UNDERQUALIFIED DEFICIT (e.g. Fresher / Junior / College Grad applying for Senior / Staff / Principal / Lead roles):
     * DO NOT give inflated scores simply because keywords match.
     * HARD CAP overall match and seniority scores between 1.5 and 4.2 / 10.
     * Diagnose the missing production scale, lack of architectural RFC leadership, and absence of multi-year production ownership.
     * Set levelDelta to "underqualified" and provide stepped milestones (e.g. Mid-Level -> Senior -> Staff roadmap).
   - OVERQUALIFIED RISK (e.g. Staff / Principal / Director applying for Junior / Entry / Intern roles):
     * Technical score can be high (8.5 - 9.8 / 10), but companyCandidateFit must highlight hiring manager hesitations (flight risk, boredom, salary mismatch, under-utilization).
     * Set levelDelta to "overqualified".
   - ON-LEVEL (e.g. Senior -> Senior, Junior -> Junior):
     * Set levelDelta to "on_level".

2. CROSS-DOMAIN PIVOT & LATERAL TRANSITIONS:
   - When candidate background is in a different discipline (e.g. Data Scientist applying for Backend Lead; SWE applying for HR; Designer applying for PM):
     * Set domainPivot.isCrossDomain = true.
     * Accurately separate TRANSFERABLE SKILLS (e.g. Python, SQL, statistical modeling, analytical rigor) from MISSING CORE DOMAIN FOUNDATIONS (e.g. Kubernetes, distributed locks, Terraform, PgBouncer).
     * Provide a realistic pivotFeasibilityRating ("high", "moderate", "low").

3. BIDIRECTIONAL CULTURE & DEALBREAKER ASYMMETRY:
   - When technical match is high, but the job posting signals the candidate's explicit red flags (e.g. candidate hates micromanagement + chaotic on-call, and JD states hourly time tracking, 3x daily check-ins, mandatory 24/7 on-call):
     * Technical match can be 8.5+, BUT companyCandidateFit.fitScore MUST BE LOW (2.0 - 5.0 / 10).
     * recommendationVerdict MUST BE "High Risk / Misaligned".

4. GOOGLE X-Y-Z BULLET REWRITES:
   - Identify 3-5 weak, passive, or unquantified bullet points in the candidate's resume.
   - Rewrite each bullet using Google's X-Y-Z formula: "Accomplished [X], measured by [Y], by doing [Z]".
   - Keep metrics grounded in candidate's actual experience scale (e.g. 50 users for a college project, 10M for staff).

=== OUTPUT FORMAT ===
You MUST return ONLY a valid JSON object conforming exactly to this structure (no markdown fences, no explanatory preamble):

{
  "candidateJobMatch": {
    "overallScore": 8.2,
    "technicalSkillScore": 8.5,
    "seniorityImpactScore": 8.0,
    "domainStackScore": 8.0,
    "atsScore": 8.5,
    "scoreJustification": "Concise 2-3 sentence executive summary of the score.",
    "topStrengths": [
      {
        "title": "Strength Title",
        "description": "Why this sets the candidate apart.",
        "evidenceFromResume": "Specific line/project from resume.",
        "importanceToJob": "critical"
      }
    ],
    "criticalGaps": [
      {
        "skillOrArea": "Missing Skill or Experience",
        "whyItMatters": "Why the hiring team cares.",
        "suggestedRemedy": "How the candidate can frame or bridge this gap.",
        "severity": "moderate"
      }
    ],
    "competitiveMoats": [
      "Key unique differentiator 1",
      "Key unique differentiator 2"
    ]
  },
  "companyCandidateFit": {
    "fitScore": 7.8,
    "orgTypeAlignment": {
      "score": 8.0,
      "summary": "Analysis of org type match."
    },
    "careerGoalAlignment": {
      "score": 7.5,
      "summary": "Analysis of primary goal match."
    },
    "redFlagRiskAnalysis": [
      {
        "redFlag": "micromanagement",
        "riskLevel": "low",
        "signalSource": "Job Description phrasing / Company model",
        "explanation": "Concrete reasoning on risk level."
      }
    ],
    "cultureSummary": "2-3 sentence synthesis of culture alignment.",
    "recommendationVerdict": "Strong Alignment"
  },
  "seniorityCalibration": {
    "candidateLevelDetected": "Senior (5-8 YOE)",
    "roleLevelRequired": "Senior Distributed Systems Engineer (5+ YOE)",
    "levelDelta": "on_level",
    "yearsOfExperienceEstimated": 7,
    "seniorityAnalysis": "Candidate's 7 years of distributed systems ownership aligns well with the 5+ years requirement.",
    "stepMilestones": [
      "Demonstrate Staff-level cross-org architectural influence in HM round",
      "Quantify multi-region deployment scale"
    ]
  },
  "domainPivot": {
    "isCrossDomain": false,
    "sourceDomain": "Distributed Backend Engineering",
    "targetDomain": "Distributed Backend Engineering",
    "transferableSkills": ["Go", "PostgreSQL", "Kafka", "Kubernetes"],
    "missingDomainFoundations": [],
    "pivotFeasibilityRating": "high",
    "strategicAdvice": "Direct domain match with strong stack overlap."
  },
  "googleXyzRewrites": [
    {
      "originalBullet": "Original weak bullet from resume",
      "rewrittenBullet": "Accomplished X, measured by Y, by doing Z",
      "breakdown": {
        "accomplishedX": "The core achievement",
        "measuredByY": "The quantified metric (latency, scale, cost, time)",
        "byDoingZ": "The technical method, architecture, or tool"
      },
      "targetRoleRelevance": "Why this rewrite wins points for this specific role",
      "estimatedImpactRating": "high"
    }
  ],
  "interviewTalkingPoints": [
    {
      "question": "Expected tough interview question",
      "strategicAngle": "How to pivot positively",
      "talkingPoints": [
        "Point 1",
        "Point 2"
      ],
      "trapToAvoid": "Common mistake candidates make"
    }
  ]
}`;
}

export function buildGroundedChatPrompt(
  conversationHistory: Array<{ role: string; content: string }>,
  relevantResumeChunks: string[],
  relevantJdChunks: string[],
  userMessage: string
): string {
  return `You are CareerFit AI Co-Pilot, an elite career strategist and technical mentor for software engineers.
You have access to the candidate's sanitized resume and the target job description.

[GROUNDED RESUME CONTEXT]
${relevantResumeChunks.join("\n---\n") || "No specific resume chunk matched."}

[GROUNDED JOB DESCRIPTION CONTEXT]
${relevantJdChunks.join("\n---\n") || "No specific JD chunk matched."}

Answer the candidate's query with high-leverage, direct, and actionable advice.
- Be honest and realistic (avoid fluffy generic advice).
- When helping with interview answers or system design, ground recommendations in their actual background.
- Keep tone professional, empathetic, and razor-sharp.

User query: ${userMessage}`;
}
