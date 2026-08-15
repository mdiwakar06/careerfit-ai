"use client";

import React from "react";
import { ShieldCheck, Lock, ExternalLink, Info } from "lucide-react";

interface PiiBannerProps {
  redactedCount: number;
  preservedLinks: string[];
  isSanitized: boolean;
}

export const PiiBanner: React.FC<PiiBannerProps> = ({
  redactedCount,
  preservedLinks,
  isSanitized,
}) => {
  return (
    <div className="rounded-xl bg-[#ffffff] border border-[#e3e6e1] p-4 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-[#e8f4f1] text-[#12715b] shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-[#17211d]">
                Privacy & PII Sanitization Guarantee
              </h4>
              {isSanitized && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#e8f4f1] text-[#12715b]">
                  <Lock className="h-3 w-3" /> Protected
                </span>
              )}
            </div>
            <p className="text-xs text-[#52605b] mt-0.5">
              Personal contact details (Full Name, Phone Numbers, Emails) are automatically scrubbed before AI processing.
              Technical links are preserved for architectural evaluation.
            </p>
          </div>
        </div>

        {/* Live Counters & Preserved Links */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="px-2.5 py-1 rounded-md bg-[#f7f8f6] border border-[#e3e6e1] text-xs font-medium text-[#17211d]">
            <span className="text-[#12715b] font-bold">{redactedCount}</span> PII items redacted
          </div>
          {preservedLinks.length > 0 && (
            <div className="px-2.5 py-1 rounded-md bg-[#f7f8f6] border border-[#e3e6e1] text-xs font-medium text-[#17211d] flex items-center gap-1">
              <ExternalLink className="h-3 w-3 text-[#12715b]" />
              <span>{preservedLinks.length} dev links preserved</span>
            </div>
          )}
        </div>
      </div>

      {/* Disclosed Preserved Links Preview */}
      {preservedLinks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#f0f2ee] flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#52605b] flex items-center gap-1">
            <Info className="h-3 w-3" /> Preserved Technical Links:
          </span>
          {preservedLinks.map((link, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[#f0f2ee] text-[#17211d] font-mono truncate max-w-xs"
            >
              {link}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
