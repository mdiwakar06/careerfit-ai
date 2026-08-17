"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { PiiBanner } from "@/components/ui/PiiBanner";
import { DualIngestion } from "@/components/ui/DualIngestion";
import { MicroQuiz } from "@/components/ui/MicroQuiz";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { StrengthsGapsPanel } from "@/components/ui/StrengthsGapsPanel";
import { CultureFitCard } from "@/components/ui/CultureFitCard";
import { RewriteCard } from "@/components/ui/RewriteCard";
import { GroundedChat } from "@/components/ui/GroundedChat";
import { SeniorityBadge } from "@/components/ui/SeniorityBadge";
import { PivotMatrixCard } from "@/components/ui/PivotMatrixCard";
import { AlternativeRolesCard } from "@/components/ui/AlternativeRolesCard";
import { FeedbackWidget } from "@/components/ui/FeedbackWidget";
import { ExportModal } from "@/components/ui/ExportModal";
import {
  CandidatePreferences,
  EvaluationResult,
  PiiSanitizationResult,
} from "@/lib/types/evaluation";
import { PRESET_SCENARIOS, PresetScenario } from "@/lib/data/presets";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Building,
  Target,
  Download,
} from "lucide-react";

export default function HomePage() {
  // Input States
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [preferences, setPreferences] = useState<CandidatePreferences>({
    targetOrgType: "growth_scaleup",
    primaryCareerGoal: "technical_depth",
    redFlagsToAvoid: ["micromanagement"],
    customNotes: "",
  });

  // PII State
  const [piiResult, setPiiResult] = useState<PiiSanitizationResult | null>(null);

  // Evaluation & Processing States
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] =
    useState<EvaluationResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "strengths_gaps" | "culture" | "rewrites" | "chat"
  >("overview");
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Preset Scenario Loader
  const handleLoadPreset = (preset: PresetScenario) => {
    setResumeText(preset.resumeText);
    setJobDescriptionText(preset.jobDescriptionText);
    setCompanyName(preset.companyName);
    setRoleTitle(preset.roleTitle);
    setPreferences(preset.preferences);
    setEvalError(null);

    // Auto trigger PII scan for preset
    fetch("/api/sanitize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: preset.resumeText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPiiResult(data.data);
      })
      .catch(() => {});
  };

  const handleReset = () => {
    setResumeText("");
    setJobDescriptionText("");
    setCompanyName("");
    setRoleTitle("");
    setPiiResult(null);
    setEvaluationResult(null);
    setEvalError(null);
    setActiveTab("overview");
  };

  // Run Evaluation
  const handleRunEvaluation = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      setEvalError("Please provide both your resume and the target job description.");
      return;
    }

    setEvalError(null);
    setIsEvaluating(true);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText,
          companyName: companyName || "Target Engineering Co.",
          roleTitle: roleTitle || "Senior Software Engineer",
          preferences,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEvaluationResult(data.data);
        if (data.sanitization) {
          setPiiResult({
            sanitizedText: resumeText,
            redactedCount: data.sanitization.redactedCount,
            detectedEntities: data.sanitization.detectedEntities || [],
            preservedLinks: data.sanitization.preservedLinks || [],
          });
        }
        // Scroll smoothly to dashboard
        setTimeout(() => {
          document
            .getElementById("evaluation-dashboard")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        throw new Error(data.error || "Failed to complete evaluation.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setEvalError(msg);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8f6]">
      <Navbar
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
        hasActiveEvaluation={!!evaluationResult}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f4f1] text-[#12715b] text-xs font-semibold border border-[#12715b]/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Bar-Raiser Calibrated • Top 10% Benchmark • Career Compass</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17211d] tracking-tight">
            Stop Guessing. Know Your Exact{" "}
            <span className="text-[#12715b]">Role & Culture Fit.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#52605b] leading-relaxed">
            FAANG Bar-Raiser hiring panel simulating a Senior ATS Architect, Executive Recruiter, and Staff Hiring Manager with instant PII scrubbing and grounded career intelligence.
          </p>
        </section>

        {/* PII PRIVACY GUARANTEE BANNER */}
        <PiiBanner
          redactedCount={piiResult?.redactedCount || 0}
          preservedLinks={piiResult?.preservedLinks || []}
          isSanitized={!!piiResult}
        />

        {/* INGESTION & MICRO-QUIZ SECTION */}
        <section className="space-y-6">
          <DualIngestion
            resumeText={resumeText}
            onResumeTextChange={setResumeText}
            jobDescriptionText={jobDescriptionText}
            onJobDescriptionChange={setJobDescriptionText}
            companyName={companyName}
            onCompanyNameChange={setCompanyName}
            roleTitle={roleTitle}
            onRoleTitleChange={setRoleTitle}
            piiResult={piiResult}
            onPiiResultChange={setPiiResult}
          />

          <MicroQuiz
            preferences={preferences}
            onChange={setPreferences}
          />

          {/* ACTION BUTTON */}
          <div className="flex flex-col items-center justify-center gap-3 pt-2">
            {evalError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl max-w-xl text-center">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{evalError}</span>
              </div>
            )}

            <button
              onClick={handleRunEvaluation}
              disabled={isEvaluating || !resumeText.trim() || !jobDescriptionText.trim()}
              className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 rounded-xl bg-[#17211d] text-white font-bold text-sm hover:bg-[#12715b] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#a3e5d4]" />
                  <span>Evaluating with Bar-Raiser Panel...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-[#a3e5d4]" />
                  <span>Run Multi-Agent Evaluation</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-[#52605b]">
              Zero login required • Client-side PII scrubbed before transmission
            </span>
          </div>
        </section>

        {/* EVALUATION DASHBOARD SECTION */}
        {evaluationResult && (
          <section id="evaluation-dashboard" className="pt-8 space-y-6 border-t border-[#e3e6e1]">
            {/* Dashboard Header & Export Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Dashboard Navigation Tabs */}
              <div className="flex items-center gap-2 border-b sm:border-b-0 border-[#e3e6e1] pb-1 sm:pb-0 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all shrink-0 ${
                    activeTab === "overview"
                      ? "border-[#12715b] text-[#12715b] bg-[#e8f4f1]/50"
                      : "border-transparent text-[#52605b] hover:text-[#17211d]"
                  }`}
                >
                  <Target className="h-4 w-4" />
                  <span>Executive Summary</span>
                </button>

                <button
                  onClick={() => setActiveTab("strengths_gaps")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all shrink-0 ${
                    activeTab === "strengths_gaps"
                      ? "border-[#12715b] text-[#12715b] bg-[#e8f4f1]/50"
                      : "border-transparent text-[#52605b] hover:text-[#17211d]"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Strengths & Gaps ({evaluationResult.candidateJobMatch.criticalGaps.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("rewrites")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all shrink-0 ${
                    activeTab === "rewrites"
                      ? "border-[#12715b] text-[#12715b] bg-[#e8f4f1]/50"
                      : "border-transparent text-[#52605b] hover:text-[#17211d]"
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Google X-Y-Z Rewrites ({evaluationResult.googleXyzRewrites.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("culture")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all shrink-0 ${
                    activeTab === "culture"
                      ? "border-[#12715b] text-[#12715b] bg-[#e8f4f1]/50"
                      : "border-transparent text-[#52605b] hover:text-[#17211d]"
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>Culture & Red Flags</span>
                </button>

                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all shrink-0 ${
                    activeTab === "chat"
                      ? "border-[#12715b] text-[#12715b] bg-[#e8f4f1]/50"
                      : "border-transparent text-[#52605b] hover:text-[#17211d]"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Grounded AI Chat</span>
                </button>
              </div>

              {/* Export Full Report Button */}
              <button
                onClick={() => setIsExportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ffffff] border border-[#e3e6e1] text-[#17211d] hover:border-[#12715b] hover:bg-[#e8f4f1]/40 transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                <Download className="h-4 w-4 text-[#12715b]" />
                <span>Export Report (.md / PDF)</span>
              </button>
            </div>

            {/* TAB PANELS */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <ScoreGauge
                  jobMatch={evaluationResult.candidateJobMatch}
                  cultureFit={evaluationResult.companyCandidateFit}
                  targetRoleTitle={evaluationResult.targetRoleTitle}
                  targetCompanyName={evaluationResult.targetCompanyName}
                />

                {/* Seniority Calibration Badge & Milestones */}
                {evaluationResult.seniorityCalibration && (
                  <SeniorityBadge
                    calibration={evaluationResult.seniorityCalibration}
                  />
                )}

                {/* Alternative Higher-Fit Roles (Career Compass) */}
                {evaluationResult.alternativeRoles &&
                  evaluationResult.alternativeRoles.length > 0 && (
                    <AlternativeRolesCard
                      alternativeRoles={evaluationResult.alternativeRoles}
                      currentTargetRole={evaluationResult.targetRoleTitle}
                    />
                  )}

                {/* Cross-Domain Pivot Matrix Card (If applicable) */}
                {evaluationResult.domainPivot && (
                  <PivotMatrixCard pivot={evaluationResult.domainPivot} />
                )}

                {/* Quick Highlights Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl bg-[#ffffff] border border-[#e3e6e1] p-5 shadow-xs space-y-3">
                    <h4 className="font-bold text-sm text-[#17211d] flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#12715b]" />
                      <span>Key Competitive Moats</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-[#52605b]">
                      {evaluationResult.candidateJobMatch.competitiveMoats.map(
                        (moat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#12715b] font-bold">✓</span>
                            <span>{moat}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-[#ffffff] border border-[#e3e6e1] p-5 shadow-xs space-y-3">
                    <h4 className="font-bold text-sm text-[#17211d] flex items-center gap-2">
                      <Building className="h-4 w-4 text-[#12715b]" />
                      <span>Culture Recommendation Verdict</span>
                    </h4>
                    <p className="text-xs text-[#52605b] leading-relaxed">
                      {evaluationResult.companyCandidateFit.cultureSummary}
                    </p>
                    <div className="pt-2 border-t border-[#f0f2ee] flex items-center justify-between">
                      <span className="text-xs text-[#52605b]">Verdict:</span>
                      <span className="text-xs font-bold text-[#12715b] px-2.5 py-0.5 rounded-full bg-[#e8f4f1]">
                        {evaluationResult.companyCandidateFit.recommendationVerdict}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "strengths_gaps" && (
              <StrengthsGapsPanel
                strengths={evaluationResult.candidateJobMatch.topStrengths}
                gaps={evaluationResult.candidateJobMatch.criticalGaps}
                competitiveMoats={
                  evaluationResult.candidateJobMatch.competitiveMoats
                }
              />
            )}

            {activeTab === "rewrites" && (
              <RewriteCard rewrites={evaluationResult.googleXyzRewrites} />
            )}

            {activeTab === "culture" && (
              <CultureFitCard cultureFit={evaluationResult.companyCandidateFit} companyName={evaluationResult.targetCompanyName} />
            )}

            {activeTab === "chat" && (
              <GroundedChat
                evaluationId={evaluationResult.id}
                targetRoleTitle={evaluationResult.targetRoleTitle}
                targetCompanyName={evaluationResult.targetCompanyName}
              />
            )}

            {/* 30-SECOND LIVE FEEDBACK WIDGET */}
            <FeedbackWidget
              evaluationId={evaluationResult.id || "eval_active"}
              targetRoleTitle={evaluationResult.targetRoleTitle}
              targetCompanyName={evaluationResult.targetCompanyName}
            />

            {/* EXPORT MODAL */}
            <ExportModal
              isOpen={isExportOpen}
              onClose={() => setIsExportOpen(false)}
              evaluation={evaluationResult}
            />
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#e3e6e1] bg-[#ffffff] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#52605b]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#17211d]">CareerFit.ai Studio</span>
            <span>•</span>
            <span>Privacy-First Software Engineering Career Intelligence</span>
          </div>
          <div>100% Client & Server PII Sanitization • No Data Resale</div>
        </div>
      </footer>
    </div>
  );
}
