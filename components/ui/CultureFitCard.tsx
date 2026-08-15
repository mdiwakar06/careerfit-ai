"use client";

import React from "react";
import { CompanyCandidateFit } from "@/lib/types/evaluation";
import { Building, Compass, AlertTriangle, ShieldCheck, CheckCircle } from "lucide-react";

interface CultureFitCardProps {
  cultureFit: CompanyCandidateFit;
  companyName: string;
}

export const CultureFitCard: React.FC<CultureFitCardProps> = ({
  cultureFit,
  companyName,
}) => {
  const getRiskBadge = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const getVerdictStyle = (verdict: CompanyCandidateFit["recommendationVerdict"]) => {
    switch (verdict) {
      case "Strong Alignment":
        return "bg-[#e8f4f1] text-[#12715b] border-[#12715b]/30";
      case "Moderate Fit with Tradeoffs":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "High Risk / Misaligned":
        return "bg-rose-50 text-rose-800 border-rose-200";
    }
  };

  return (
    <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f2ee] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#e8f4f1] text-[#12715b]">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#17211d]">
              Bidirectional Culture & Operating Fit Synthesis
            </h3>
            <p className="text-xs text-[#52605b]">
              Evaluates whether {companyName}'s pace, team structure, and autonomy align with your stated career priorities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#52605b]">Verdict:</span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${getVerdictStyle(
              cultureFit.recommendationVerdict
            )}`}
          >
            {cultureFit.recommendationVerdict}
          </span>
        </div>
      </div>

      {/* Alignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Org Type Alignment */}
        <div className="p-4 rounded-xl bg-[#f7f8f6]/80 border border-[#e3e6e1] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17211d]">
              <Building className="h-4 w-4 text-[#12715b]" />
              <span>Org Type & Scale Match</span>
            </div>
            <span className="text-xs font-bold text-[#12715b]">
              {cultureFit.orgTypeAlignment.score.toFixed(1)}/10
            </span>
          </div>
          <p className="text-xs text-[#52605b] leading-relaxed">
            {cultureFit.orgTypeAlignment.summary}
          </p>
        </div>

        {/* Career Goal Alignment */}
        <div className="p-4 rounded-xl bg-[#f7f8f6]/80 border border-[#e3e6e1] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17211d]">
              <Compass className="h-4 w-4 text-[#12715b]" />
              <span>Career Priority Alignment</span>
            </div>
            <span className="text-xs font-bold text-[#12715b]">
              {cultureFit.careerGoalAlignment.score.toFixed(1)}/10
            </span>
          </div>
          <p className="text-xs text-[#52605b] leading-relaxed">
            {cultureFit.careerGoalAlignment.summary}
          </p>
        </div>
      </div>

      {/* Anti-Pattern & Red-Flag Radar */}
      {cultureFit.redFlagRiskAnalysis && cultureFit.redFlagRiskAnalysis.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#52605b] flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-[#b45309]" />
            <span>Anti-Pattern Risk Radar (Candidate Dealbreakers)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cultureFit.redFlagRiskAnalysis.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#ffffff] border border-[#e3e6e1] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17211d] capitalize">
                    {item.redFlag.replace("_", " ")}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRiskBadge(
                      item.riskLevel
                    )}`}
                  >
                    {item.riskLevel} Risk
                  </span>
                </div>
                <p className="text-xs text-[#52605b] leading-relaxed">
                  {item.explanation}
                </p>
                <div className="text-[11px] text-[#52605b] italic font-mono pt-1">
                  Source: {item.signalSource}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
