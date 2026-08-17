"use client";

import React, { useState } from "react";
import { EvaluationResult } from "@/lib/types/evaluation";
import { Download, Copy, Check, X, FileText, Printer } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: EvaluationResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  evaluation,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = (): string => {
    return `# CareerFit AI Studio — Comprehensive Candidate Fit Report

**Target Role:** ${evaluation.targetRoleTitle}  
**Target Company:** ${evaluation.targetCompanyName}  
**Generated:** ${new Date(evaluation.createdAt || Date.now()).toLocaleDateString()}  

---

## 1. Executive Summary & Match Scores
- **Candidate-to-Job Match:** ${evaluation.candidateJobMatch.overallScore.toFixed(1)} / 10
  - Technical Skills Depth (40%): ${evaluation.candidateJobMatch.technicalSkillScore.toFixed(1)} / 10
  - Seniority & Business Impact (30%): ${evaluation.candidateJobMatch.seniorityImpactScore.toFixed(1)} / 10
  - Domain & Stack Fit (20%): ${evaluation.candidateJobMatch.domainStackScore.toFixed(1)} / 10
  - ATS Semantic Clarity (10%): ${evaluation.candidateJobMatch.atsScore.toFixed(1)} / 10
- **Company-to-Candidate Culture Fit:** ${evaluation.companyCandidateFit.fitScore.toFixed(1)} / 10
- **Recommendation Verdict:** ${evaluation.companyCandidateFit.recommendationVerdict}

**Score Justification:**  
${evaluation.candidateJobMatch.scoreJustification}

---

## 2. Seniority & Level Calibration
${
  evaluation.seniorityCalibration
    ? `- **Detected Candidate Scope:** ${evaluation.seniorityCalibration.candidateLevelDetected}
- **Required Role Seniority:** ${evaluation.seniorityCalibration.roleLevelRequired}
- **Level Delta:** ${evaluation.seniorityCalibration.levelDelta.toUpperCase()}
- **Analysis:** ${evaluation.seniorityCalibration.seniorityAnalysis}
`
    : "Standard on-level match."
}

---

## 3. Top Technical Strengths & Competitive Moats
${evaluation.candidateJobMatch.topStrengths
  .map(
    (s, i) => `### ${i + 1}. ${s.title} [${s.importanceToJob.toUpperCase()}]
- **Impact:** ${s.description}
- **Evidence:** "${s.evidenceFromResume}"`
  )
  .join("\n\n")}

${
  evaluation.candidateJobMatch.competitiveMoats.length > 0
    ? `\n**Key Competitive Moats:**\n${evaluation.candidateJobMatch.competitiveMoats
        .map((m) => `- ${m}`)
        .join("\n")}`
    : ""
}

---

## 4. Critical Gaps & Actionable Remedies
${evaluation.candidateJobMatch.criticalGaps
  .map(
    (g, i) => `### ${i + 1}. ${g.skillOrArea} [Severity: ${g.severity.toUpperCase()}]
- **Why it matters:** ${g.whyItMatters}
- **Suggested Remedy:** ${g.suggestedRemedy}`
  )
  .join("\n\n")}

---

## 5. Google X-Y-Z Resume Bullet Rewrites
${evaluation.googleXyzRewrites
  .map(
    (rw, i) => `### Bullet #${i + 1}
- **Original:** "${rw.originalBullet}"
- **Rewritten (Google X-Y-Z):** "${rw.rewrittenBullet}"
  - *Accomplished [X]:* ${rw.breakdown.accomplishedX}
  - *Measured by [Y]:* ${rw.breakdown.measuredByY}
  - *By doing [Z]:* ${rw.breakdown.byDoingZ}`
  )
  .join("\n\n")}

---

## 6. Strategic Interview Preparation & Talking Points
${evaluation.interviewTalkingPoints
  .map(
    (tp, i) => `### Q${i + 1}: ${tp.question}
- **Strategic Angle:** ${tp.strategicAngle}
- **Key Talking Points:**
${tp.talkingPoints.map((p) => `  - ${p}`).join("\n")}
- **Trap to Avoid:** ${tp.trapToAvoid}`
  )
  .join("\n\n")}

---
*Report generated securely by CareerFit AI Studio (100% PII Sanitized).*
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownReport();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CareerFit_Report_${evaluation.targetCompanyName.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211d]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-2xl border border-[#e3e6e1] shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0f2ee] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#e8f4f1] text-[#12715b]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#17211d]">
                Export Evaluation Report
              </h3>
              <p className="text-xs text-[#52605b]">
                Save your scores, Google X-Y-Z bullet rewrites, and interview kit offline.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#52605b] hover:text-[#17211d] hover:bg-[#f0f2ee] transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Report Preview Snippet */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-[#f7f8f6] border border-[#e3e6e1] p-4 text-xs font-mono text-[#17211d] leading-relaxed select-all">
          <pre className="whitespace-pre-wrap font-sans">{generateMarkdownReport()}</pre>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f0f2ee]">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#ffffff] border border-[#e3e6e1] text-[#17211d] hover:bg-[#f7f8f6] transition-all"
          >
            <Printer className="h-4 w-4 text-[#52605b]" />
            <span>Print / Save as PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#ffffff] border border-[#e3e6e1] text-[#17211d] hover:border-[#12715b] hover:bg-[#e8f4f1]/50 transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[#12715b]" />
                  <span className="text-[#12715b]">Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#17211d] text-white hover:bg-[#12715b] transition-all shadow-xs"
            >
              <Download className="h-4 w-4 text-[#a3e5d4]" />
              <span>Download .md File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
