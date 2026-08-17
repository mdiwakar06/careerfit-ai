"use client";

import React from "react";
import { AlternativeRoleRecommendation } from "@/lib/types/evaluation";
import { Compass, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface AlternativeRolesCardProps {
  alternativeRoles: AlternativeRoleRecommendation[];
  currentTargetRole: string;
}

export const AlternativeRolesCard: React.FC<AlternativeRolesCardProps> = ({
  alternativeRoles,
  currentTargetRole,
}) => {
  if (!alternativeRoles || alternativeRoles.length === 0) return null;

  return (
    <div className="rounded-xl bg-[#ffffff] border border-[#e3e6e1] p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f2ee] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#e8f4f1] text-[#12715b]">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#17211d]">
              Career Compass: Alternative High-Fit Roles
            </h3>
            <p className="text-[11px] text-[#52605b]">
              Roles where your demonstrable background ranks in the top tier (8.5+ fit) right now.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8f4f1] text-[#12715b]">
          <Sparkles className="h-3 w-3" />
          <span>{alternativeRoles.length} Matches Found</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {alternativeRoles.map((alt, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-[#f7f8f6] border border-[#e3e6e1] hover:border-[#12715b]/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#17211d] line-clamp-1">
                  {alt.roleTitle}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#12715b] text-white shrink-0">
                  {alt.matchScore.toFixed(1)} / 10
                </span>
              </div>
              <p className="text-[11px] text-[#52605b] leading-relaxed">
                {alt.whyItFits}
              </p>
            </div>

            <div className="pt-2 border-t border-[#e3e6e1]/70 flex items-start gap-1.5 text-[11px] text-[#12715b]">
              <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="font-medium text-[#17211d]">
                <span className="font-bold text-[#12715b]">Action: </span>
                {alt.recommendedAction}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
