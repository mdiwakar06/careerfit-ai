"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles, RefreshCw, Cpu, ChevronDown, Check } from "lucide-react";
import { PRESET_SCENARIOS, PresetScenario } from "@/lib/data/presets";

interface NavbarProps {
  onLoadPreset: (preset: PresetScenario) => void;
  onReset: () => void;
  hasActiveEvaluation: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadPreset,
  onReset,
  hasActiveEvaluation,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("senior_backend");

  const handleSelect = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    onLoadPreset(preset);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e3e6e1] bg-[#f7f8f6]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[#17211d] flex items-center justify-center text-white shadow-sm">
            <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-[#12715b]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold tracking-tight text-base sm:text-lg text-[#17211d]">
                CareerFit<span className="text-[#12715b]">.ai</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-[#e8f4f1] text-[#12715b] animate-glow-pulse">
                STUDIO
              </span>
            </div>
            <p className="text-[11px] text-[#52605b] hidden md:block">
              Bidirectional Software Engineering Career Co-Pilot
            </p>
          </div>
        </div>

        {/* Privacy & Fast Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ffffff] border border-[#e3e6e1] text-xs text-[#52605b] shadow-xs">
            <ShieldCheck className="h-4 w-4 text-[#12715b]" />
            <span>Client & Server PII Protected</span>
          </div>

          {/* Scenarios Preset Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#ffffff] text-[#17211d] border border-[#e3e6e1] hover:border-[#12715b] hover:bg-[#e8f4f1]/50 transition-all shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#12715b]" />
              <span>Test Scenarios ({PRESET_SCENARIOS.length})</span>
              <ChevronDown className="h-3 w-3 text-[#52605b]" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-[#ffffff] border border-[#e3e6e1] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-[#f0f2ee] text-[11px] font-bold text-[#52605b] uppercase tracking-wider">
                    Select Calibration Edge-Case:
                  </div>

                  <div className="max-h-80 overflow-y-auto p-1 space-y-1">
                    {PRESET_SCENARIOS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelect(preset)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start justify-between gap-2 ${
                          selectedPresetId === preset.id
                            ? "bg-[#e8f4f1] text-[#12715b]"
                            : "hover:bg-[#f7f8f6] text-[#17211d]"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold">{preset.name}</span>
                          </div>
                          <p className="text-[11px] text-[#52605b] line-clamp-1">
                            {preset.description}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${preset.badgeColor}`}
                        >
                          {preset.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Backend shortcut for instant test */}
          <button
            onClick={() => handleSelect(PRESET_SCENARIOS[0])}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#ffffff] text-[#17211d] border border-[#e3e6e1] hover:border-[#12715b] transition-all shadow-xs"
          >
            Senior Backend
          </button>

          {hasActiveEvaluation && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#52605b] hover:text-[#17211d] hover:bg-[#f0f2ee] transition-all"
              title="Start a new evaluation"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
