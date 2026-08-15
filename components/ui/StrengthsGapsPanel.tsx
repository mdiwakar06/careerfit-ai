"use client";

import React from "react";
import { StrengthItem, GapItem } from "@/lib/types/evaluation";
import { CheckCircle2, AlertOctagon, Sparkles, Shield, ArrowRight } from "lucide-react";

interface StrengthsGapsPanelProps {
  strengths: StrengthItem[];
  gaps: GapItem[];
  competitiveMoats: string[];
}

export const StrengthsGapsPanel: React.FC<StrengthsGapsPanelProps> = ({
  strengths,
  gaps,
  competitiveMoats,
}) => {
  const getImportanceBadge = (importance: StrengthItem["importanceToJob"]) => {
    switch (importance) {
      case "critical":
        return "bg-[#e8f4f1] text-[#12715b] border-[#12715b]/30";
      case "high":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityBadge = (severity: GapItem["severity"]) => {
    switch (severity) {
      case "blocking":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "moderate":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Competitive Moats Highlight */}
      {competitiveMoats && competitiveMoats.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-[#17211d] to-[#0f3a30] text-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 rounded-md bg-[#12715b] text-white">
              <Shield className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm tracking-wide uppercase text-[#a3e5d4]">
              Candidate Competitive Moats
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {competitiveMoats.map((moat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-start gap-2.5"
              >
                <Sparkles className="h-4 w-4 text-[#a3e5d4] shrink-0 mt-0.5" />
                <p className="text-xs text-white/90 leading-relaxed">{moat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Strengths vs Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STRENGTHS COLUMN */}
        <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0f2ee] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#e8f4f1] text-[#12715b]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-[#17211d]">
                Exceeding Areas & Proven Strengths ({strengths.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#12715b]">
              High Leverage
            </span>
          </div>

          <div className="space-y-3">
            {strengths.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#f7f8f6]/80 border border-[#e3e6e1] hover:border-[#12715b]/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#17211d]">
                    {item.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getImportanceBadge(
                      item.importanceToJob
                    )}`}
                  >
                    {item.importanceToJob}
                  </span>
                </div>
                <p className="text-xs text-[#52605b] leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 border-t border-[#e3e6e1]/60 flex items-start gap-1.5 text-[11px] text-[#17211d]">
                  <span className="font-semibold text-[#12715b] shrink-0">
                    Resume Evidence:
                  </span>
                  <span className="italic text-[#52605b] font-mono">
                    "{item.evidenceFromResume}"
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRITICAL GAPS COLUMN */}
        <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0f2ee] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-50 text-[#b45309]">
                <AlertOctagon className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-[#17211d]">
                Skill & Experience Gap Analysis ({gaps.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#b45309]">
              Actionable Remedies
            </span>
          </div>

          <div className="space-y-3">
            {gaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#fffbeb]/50 border border-amber-200/80 space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#17211d]">
                    {gap.skillOrArea}
                  </h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getSeverityBadge(
                      gap.severity
                    )}`}
                  >
                    {gap.severity}
                  </span>
                </div>

                <p className="text-xs text-[#52605b] leading-relaxed">
                  <span className="font-semibold text-[#17211d]">Hiring Concern:</span>{" "}
                  {gap.whyItMatters}
                </p>

                <div className="p-2.5 rounded-lg bg-[#ffffff] border border-amber-200 text-xs text-[#17211d] flex items-start gap-2 shadow-xs">
                  <ArrowRight className="h-3.5 w-3.5 text-[#b45309] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#b45309]">Strategic Pivot: </span>
                    <span>{gap.suggestedRemedy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
