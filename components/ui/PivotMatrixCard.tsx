"use client";

import React from "react";
import { DomainPivot } from "@/lib/types/evaluation";
import { Shuffle, CheckCircle2, AlertOctagon, Lightbulb } from "lucide-react";

interface PivotMatrixCardProps {
  pivot: DomainPivot;
}

export const PivotMatrixCard: React.FC<PivotMatrixCardProps> = ({ pivot }) => {
  if (!pivot.isCrossDomain) return null;

  const getFeasibilityBadge = (rating: DomainPivot["pivotFeasibilityRating"]) => {
    switch (rating) {
      case "high":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "low":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-purple-50 text-purple-800 border-purple-200";
    }
  };

  return (
    <div className="rounded-xl bg-[#ffffff] border border-purple-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f2ee] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-100 text-purple-800">
            <Shuffle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#17211d]">
              Cross-Domain Career Pivot Analysis
            </h3>
            <span className="text-[11px] text-[#52605b]">
              {pivot.sourceDomain} → {pivot.targetDomain}
            </span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getFeasibilityBadge(
            pivot.pivotFeasibilityRating
          )}`}
        >
          <span>Pivot Feasibility: {pivot.pivotFeasibilityRating}</span>
        </span>
      </div>

      {/* Grid: Transferable Skills vs Missing Domain Foundations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transferable Competencies */}
        <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/60 space-y-2">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Transferable Competencies:</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pivot.transferableSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Domain Foundations */}
        <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200/60 space-y-2">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <AlertOctagon className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>Missing Core Domain Foundations:</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pivot.missingDomainFoundations.map((gap, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-800"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Advice */}
      <div className="p-3 rounded-lg bg-[#f7f8f6] border border-[#e3e6e1] flex items-start gap-2 text-xs text-[#52605b]">
        <Lightbulb className="h-4 w-4 text-[#12715b] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#17211d]">Strategic Pivot Advice: </span>
          <span>{pivot.strategicAdvice}</span>
        </div>
      </div>
    </div>
  );
};
