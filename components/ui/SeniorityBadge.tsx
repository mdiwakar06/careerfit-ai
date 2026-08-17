"use client";

import React from "react";
import { SeniorityCalibration } from "@/lib/types/evaluation";
import { Award, AlertTriangle, ArrowUpRight, CheckCircle2, Milestone } from "lucide-react";

interface SeniorityBadgeProps {
  calibration: SeniorityCalibration;
}

export const SeniorityBadge: React.FC<SeniorityBadgeProps> = ({ calibration }) => {
  const getDeltaBadge = (delta: SeniorityCalibration["levelDelta"]) => {
    switch (delta) {
      case "underqualified":
        return {
          label: "Seniority Deficit (Ramp-Up Required)",
          color: "bg-rose-50 text-rose-800 border-rose-200",
          icon: AlertTriangle,
        };
      case "overqualified":
        return {
          label: "Overqualification / Down-Leveling Risk",
          color: "bg-amber-50 text-amber-800 border-amber-200",
          icon: ArrowUpRight,
        };
      default:
        return {
          label: "On-Level Seniority Alignment",
          color: "bg-[#e8f4f1] text-[#12715b] border-[#12715b]/30",
          icon: CheckCircle2,
        };
    }
  };

  const badgeInfo = getDeltaBadge(calibration.levelDelta);
  const IconComponent = badgeInfo.icon;

  return (
    <div className="rounded-xl bg-[#ffffff] border border-[#e3e6e1] p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f2ee] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#e8f4f1] text-[#12715b]">
            <Award className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-sm text-[#17211d]">
            Seniority & Scope Calibration
          </h3>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeInfo.color}`}
        >
          <IconComponent className="h-3.5 w-3.5" />
          <span>{badgeInfo.label}</span>
        </span>
      </div>

      {/* Detected vs Required Levels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-[#f7f8f6] border border-[#e3e6e1]">
          <span className="text-[11px] font-semibold text-[#52605b] uppercase tracking-wider block">
            Detected Candidate Scope
          </span>
          <span className="text-sm font-bold text-[#17211d] mt-0.5 block">
            {calibration.candidateLevelDetected}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#f7f8f6] border border-[#e3e6e1]">
          <span className="text-[11px] font-semibold text-[#52605b] uppercase tracking-wider block">
            Target Role Seniority Needed
          </span>
          <span className="text-sm font-bold text-[#17211d] mt-0.5 block">
            {calibration.roleLevelRequired}
          </span>
        </div>
      </div>

      {/* Analysis Explanation */}
      <p className="text-xs text-[#52605b] leading-relaxed">
        {calibration.seniorityAnalysis}
      </p>

      {/* Stepped Milestones */}
      {calibration.stepMilestones && calibration.stepMilestones.length > 0 && (
        <div className="pt-2 border-t border-[#f0f2ee] space-y-2">
          <span className="text-[11px] font-bold text-[#17211d] flex items-center gap-1.5">
            <Milestone className="h-3.5 w-3.5 text-[#12715b]" />
            <span>Recommended Calibration & Interview Milestones:</span>
          </span>
          <ul className="space-y-1.5">
            {calibration.stepMilestones.map((milestone, idx) => (
              <li
                key={idx}
                className="text-xs text-[#52605b] flex items-start gap-2 bg-[#f7f8f6]/70 p-2 rounded-md"
              >
                <span className="font-bold text-[#12715b] shrink-0">{idx + 1}.</span>
                <span>{milestone}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
