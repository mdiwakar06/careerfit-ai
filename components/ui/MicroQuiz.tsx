"use client";

import React from "react";
import {
  CandidatePreferences,
  OrgType,
  CareerGoal,
  RedFlag,
} from "@/lib/types/evaluation";
import { Building2, Compass, AlertTriangle, Sparkles, Check } from "lucide-react";

interface MicroQuizProps {
  preferences: CandidatePreferences;
  onChange: (updated: CandidatePreferences) => void;
}

export const MicroQuiz: React.FC<MicroQuizProps> = ({
  preferences,
  onChange,
}) => {
  const orgTypes: Array<{
    id: OrgType;
    title: string;
    description: string;
    badge: string;
  }> = [
    {
      id: "product_startup",
      title: "0-to-1 Product Startup",
      description: "Fast iteration, broad ownership, high ambiguity.",
      badge: "High Velocity",
    },
    {
      id: "growth_scaleup",
      title: "High-Growth Scaleup",
      description: "Scaling architecture, team growth, Series B-D.",
      badge: "Scaling Systems",
    },
    {
      id: "tech_enterprise",
      title: "Tech Enterprise",
      description: "High system scale, stability, deep domain specialization.",
      badge: "High Scale",
    },
    {
      id: "services_consulting",
      title: "Consulting / Agency",
      description: "Diverse client domains, rapid stack switching.",
      badge: "Cross-Domain",
    },
  ];

  const careerGoals: Array<{
    id: CareerGoal;
    title: string;
    description: string;
  }> = [
    {
      id: "technical_depth",
      title: "Technical Depth & Architecture",
      description: "Master complex distributed systems and core engineering.",
    },
    {
      id: "rapid_growth",
      title: "Rapid Growth & Leadership",
      description: "Lead technical RFCs, mentor peers, and advance seniority.",
    },
    {
      id: "work_life_balance",
      title: "Work-Life Balance & Stability",
      description: "Sustainable pace, predictable sprints, healthy boundaries.",
    },
    {
      id: "high_compensation",
      title: "High Compensation & Scale",
      description: "Top-of-market compensation packages and equity upside.",
    },
  ];

  const redFlags: Array<{
    id: RedFlag;
    title: string;
    description: string;
  }> = [
    {
      id: "micromanagement",
      title: "Heavy Micromanagement",
      description: "Excessive status calls, rigid tracking, low trust.",
    },
    {
      id: "legacy_tech",
      title: "Stagnant Legacy Codebases",
      description: "Maintenance-heavy monolithic apps with zero test coverage.",
    },
    {
      id: "chaotic_oncall",
      title: "Chaotic 24/7 On-Call",
      description: "Unstable production with frequent off-hours paging.",
    },
    {
      id: "unclear_strategy",
      title: "Vague Engineering Roadmap",
      description: "Constant abrupt pivots without architectural direction.",
    },
  ];

  const toggleRedFlag = (flag: RedFlag) => {
    const exists = preferences.redFlagsToAvoid.includes(flag);
    const updatedFlags = exists
      ? preferences.redFlagsToAvoid.filter((f) => f !== flag)
      : [...preferences.redFlagsToAvoid, flag];
    onChange({ ...preferences, redFlagsToAvoid: updatedFlags });
  };

  return (
    <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f2ee] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#e8f4f1] text-[#12715b]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#17211d]">
              30-Second Career & Culture Micro-Quiz
            </h3>
            <p className="text-xs text-[#52605b]">
              Calibrates the bidirectional evaluation engine against your personal career goals and dealbreakers.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f7f8f6] text-[#52605b] border border-[#e3e6e1]">
          Step 2 of 2
        </span>
      </div>

      {/* Question 1: Target Org Type */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#17211d]">
          <Building2 className="h-4 w-4 text-[#12715b]" />
          <span>1. What is your ideal company operating model?</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {orgTypes.map((org) => {
            const isSelected = preferences.targetOrgType === org.id;
            return (
              <button
                key={org.id}
                type="button"
                onClick={() =>
                  onChange({ ...preferences, targetOrgType: org.id })
                }
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#12715b] bg-[#e8f4f1]/40 ring-1 ring-[#12715b] shadow-xs"
                    : "border-[#e3e6e1] bg-[#ffffff] hover:border-[#12715b]/50 hover:bg-[#f7f8f6]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#12715b] uppercase tracking-wider">
                      {org.badge}
                    </span>
                    {isSelected && (
                      <div className="h-4 w-4 rounded-full bg-[#12715b] text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-[#17211d]">{org.title}</h4>
                  <p className="text-xs text-[#52605b] mt-1 line-clamp-2">
                    {org.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 2: Primary Career Goal */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#17211d]">
          <Compass className="h-4 w-4 text-[#12715b]" />
          <span>2. What is your top career priority for your next role?</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {careerGoals.map((goal) => {
            const isSelected = preferences.primaryCareerGoal === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() =>
                  onChange({ ...preferences, primaryCareerGoal: goal.id })
                }
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#12715b] bg-[#e8f4f1]/40 ring-1 ring-[#12715b] shadow-xs"
                    : "border-[#e3e6e1] bg-[#ffffff] hover:border-[#12715b]/50 hover:bg-[#f7f8f6]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#52605b]">
                      Priority
                    </span>
                    {isSelected && (
                      <div className="h-4 w-4 rounded-full bg-[#12715b] text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-[#17211d]">{goal.title}</h4>
                  <p className="text-xs text-[#52605b] mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 3: Red Flags to Avoid */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#17211d]">
          <AlertTriangle className="h-4 w-4 text-[#b45309]" />
          <span>3. What are your red lines or dealbreakers? (Select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {redFlags.map((flag) => {
            const isSelected = preferences.redFlagsToAvoid.includes(flag.id);
            return (
              <button
                key={flag.id}
                type="button"
                onClick={() => toggleRedFlag(flag.id)}
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#b45309] bg-[#fffbeb] ring-1 ring-[#b45309] shadow-xs"
                    : "border-[#e3e6e1] bg-[#ffffff] hover:border-[#b45309]/50 hover:bg-[#f7f8f6]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#b45309]">
                      Dealbreaker
                    </span>
                    {isSelected && (
                      <div className="h-4 w-4 rounded-full bg-[#b45309] text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-[#17211d]">{flag.title}</h4>
                  <p className="text-xs text-[#52605b] mt-1 line-clamp-2">
                    {flag.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
