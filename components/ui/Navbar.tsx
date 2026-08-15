"use client";

import React from "react";
import { ShieldCheck, Sparkles, RefreshCw, Cpu, Layers } from "lucide-react";

interface NavbarProps {
  onLoadSample: (sampleType: "backend" | "staff_fullstack") => void;
  onReset: () => void;
  hasActiveEvaluation: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadSample,
  onReset,
  hasActiveEvaluation,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e3e6e1] bg-[#f7f8f6]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#17211d] flex items-center justify-center text-white shadow-sm">
            <Cpu className="h-5 w-5 text-[#12715b]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg text-[#17211d]">
                CareerFit<span className="text-[#12715b]">.ai</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#e8f4f1] text-[#12715b] animate-glow-pulse">
                BETA
              </span>
            </div>
            <p className="text-xs text-[#52605b] hidden sm:block">
              Bidirectional Software Engineering Career Co-Pilot
            </p>
          </div>
        </div>

        {/* Privacy & Fast Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ffffff] border border-[#e3e6e1] text-xs text-[#52605b] shadow-xs">
            <ShieldCheck className="h-4 w-4 text-[#12715b]" />
            <span>Client & Server PII Protected</span>
          </div>

          {/* Quick Demo Preload Dropdown */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLoadSample("backend")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#ffffff] text-[#17211d] border border-[#e3e6e1] hover:border-[#12715b] hover:bg-[#e8f4f1]/50 transition-all shadow-xs"
              title="Load pre-configured Senior Distributed Systems Engineer sample"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#12715b]" />
              <span className="hidden sm:inline">Sample:</span> Senior Backend
            </button>

            <button
              onClick={() => onLoadSample("staff_fullstack")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#ffffff] text-[#17211d] border border-[#e3e6e1] hover:border-[#12715b] hover:bg-[#e8f4f1]/50 transition-all shadow-xs"
              title="Load pre-configured Staff Full-Stack Engineer sample"
            >
              <Layers className="h-3.5 w-3.5 text-[#12715b]" />
              <span className="hidden sm:inline">Sample:</span> Staff Full-Stack
            </button>

            {hasActiveEvaluation && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#52605b] hover:text-[#17211d] hover:bg-[#f0f2ee] transition-all"
                title="Start a new evaluation"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Analysis</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
