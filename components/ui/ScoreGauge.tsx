"use client";

import React from "react";
import { CandidateJobMatch, CompanyCandidateFit } from "@/lib/types/evaluation";
import { Target, Compass, Award, CheckCircle } from "lucide-react";

interface ScoreGaugeProps {
  jobMatch: CandidateJobMatch;
  cultureFit: CompanyCandidateFit;
  targetRoleTitle: string;
  targetCompanyName: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  jobMatch,
  cultureFit,
  targetRoleTitle,
  targetCompanyName,
}) => {
  // SVG circular gauge calculation (radius: 42, circumference: 2 * PI * 42 = 263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const getStrokeColor = (score: number) => {
    if (score >= 8.0) return "#12715b"; // Emerald
    if (score >= 6.5) return "#d97706"; // Amber
    return "#e11d48"; // Coral
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8.5) return { label: "Exceptional Match", color: "bg-[#e8f4f1] text-[#12715b] border-[#12715b]/30" };
    if (score >= 7.0) return { label: "Strong Candidate", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    if (score >= 5.5) return { label: "Moderate with Gaps", color: "bg-amber-50 text-amber-800 border-amber-200" };
    return { label: "High Risk / Pivot Needed", color: "bg-rose-50 text-rose-800 border-rose-200" };
  };

  const matchOffset = circumference - (jobMatch.overallScore / 10) * circumference;
  const cultureOffset = circumference - (cultureFit.fitScore / 10) * circumference;

  const matchBadge = getScoreBadge(jobMatch.overallScore);
  const cultureBadge = getScoreBadge(cultureFit.fitScore);

  return (
    <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] p-6 shadow-xs space-y-6">
      {/* Header with Role & Company Target */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f2ee] pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#12715b]">
            Evaluation Executive Summary
          </span>
          <h2 className="text-lg font-bold text-[#17211d] mt-0.5">
            {targetRoleTitle} <span className="text-[#52605b] font-normal">at</span> {targetCompanyName}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${matchBadge.color}`}>
            {matchBadge.label}
          </span>
        </div>
      </div>

      {/* Dual Radial Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gauge 1: Candidate -> Job Match */}
        <div className="flex items-center gap-5 p-4 rounded-xl bg-[#f7f8f6]/80 border border-[#e3e6e1]">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-[#e3e6e1]"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={getStrokeColor(jobMatch.overallScore)}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={matchOffset}
                strokeLinecap="round"
                fill="transparent"
                className="gauge-circle"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#17211d] tracking-tight">
                {jobMatch.overallScore.toFixed(1)}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#52605b]">
                out of 10
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#17211d]">
              <Target className="h-4 w-4 text-[#12715b]" />
              <span>Role & Technical Match</span>
            </div>
            <p className="text-xs text-[#52605b] leading-relaxed line-clamp-3">
              {jobMatch.scoreJustification}
            </p>
          </div>
        </div>

        {/* Gauge 2: Company -> Candidate Culture & Career Fit */}
        <div className="flex items-center gap-5 p-4 rounded-xl bg-[#f7f8f6]/80 border border-[#e3e6e1]">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-[#e3e6e1]"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={getStrokeColor(cultureFit.fitScore)}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={cultureOffset}
                strokeLinecap="round"
                fill="transparent"
                className="gauge-circle"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#17211d] tracking-tight">
                {cultureFit.fitScore.toFixed(1)}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#52605b]">
                out of 10
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#17211d]">
              <Compass className="h-4 w-4 text-[#12715b]" />
              <span>Bidirectional Culture Fit</span>
            </div>
            <p className="text-xs text-[#52605b] leading-relaxed line-clamp-3">
              {cultureFit.cultureSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Category Sub-Scores Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-lg bg-[#ffffff] border border-[#e3e6e1] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#52605b] font-medium">Core Tech (40%)</span>
            <span className="font-bold text-[#17211d]">
              {jobMatch.technicalSkillScore.toFixed(1)}/10
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#e3e6e1] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#12715b] rounded-full transition-all duration-1000"
              style={{ width: `${(jobMatch.technicalSkillScore / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#ffffff] border border-[#e3e6e1] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#52605b] font-medium">Seniority/Scale (30%)</span>
            <span className="font-bold text-[#17211d]">
              {jobMatch.seniorityImpactScore.toFixed(1)}/10
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#e3e6e1] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#12715b] rounded-full transition-all duration-1000"
              style={{ width: `${(jobMatch.seniorityImpactScore / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#ffffff] border border-[#e3e6e1] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#52605b] font-medium">Domain Stack (20%)</span>
            <span className="font-bold text-[#17211d]">
              {jobMatch.domainStackScore.toFixed(1)}/10
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#e3e6e1] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#12715b] rounded-full transition-all duration-1000"
              style={{ width: `${(jobMatch.domainStackScore / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#ffffff] border border-[#e3e6e1] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#52605b] font-medium">ATS Clarity (10%)</span>
            <span className="font-bold text-[#17211d]">
              {jobMatch.atsScore.toFixed(1)}/10
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#e3e6e1] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#12715b] rounded-full transition-all duration-1000"
              style={{ width: `${(jobMatch.atsScore / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
