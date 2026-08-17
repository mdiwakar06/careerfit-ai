"use client";

import React, { useState } from "react";
import { GoogleXyzRewriteItem } from "@/lib/types/evaluation";
import { Sparkles, Copy, Check, ArrowRight, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";

interface RewriteCardProps {
  rewrites: GoogleXyzRewriteItem[];
}

export const RewriteCard: React.FC<RewriteCardProps> = ({ rewrites }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ratedMap, setRatedMap] = useState<Record<string, "up" | "down">>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleRate = (id: string, type: "up" | "down") => {
    setRatedMap((prev) => ({ ...prev, [id]: type }));
  };

  const getImpactBadge = (rating: GoogleXyzRewriteItem["estimatedImpactRating"]) => {
    switch (rating) {
      case "transformational":
        return "bg-[#e8f4f1] text-[#12715b] border-[#12715b]/30";
      case "high":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="rounded-2xl bg-[#ffffff] border border-[#e3e6e1] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f2ee] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#e8f4f1] text-[#12715b]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#17211d]">
                Google X-Y-Z Resume Bullet Rewriter
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#17211d] text-white">
                Formula Enforced
              </span>
            </div>
            <p className="text-xs text-[#52605b]">
              Accomplished <span className="font-semibold text-[#17211d]">[X]</span>, measured by{" "}
              <span className="font-semibold text-[#12715b]">[Y]</span>, by doing{" "}
              <span className="font-semibold text-[#17211d]">[Z]</span>. Zero fabricated credentials.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#52605b] px-3 py-1 rounded-full bg-[#f7f8f6] border border-[#e3e6e1]">
          {rewrites.length} High-Leverage Rewrites
        </span>
      </div>

      {/* Rewrites List */}
      <div className="space-y-5">
        {rewrites.map((item, idx) => {
          const cardId = item.id || `rewrite_${idx}`;
          const isCopied = copiedId === cardId;
          const userRating = ratedMap[cardId];

          return (
            <div
              key={cardId}
              className="rounded-xl border border-[#e3e6e1] bg-[#f7f8f6]/50 p-5 space-y-4 hover:border-[#12715b]/40 transition-all shadow-xs"
            >
              {/* Card Meta Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#52605b]">
                  Rewrite #{idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getImpactBadge(
                      item.estimatedImpactRating
                    )}`}
                  >
                    {item.estimatedImpactRating} impact
                  </span>

                  {/* Micro Feedback Thumbs */}
                  <div className="flex items-center gap-1 bg-[#ffffff] border border-[#e3e6e1] rounded-md p-0.5">
                    <button
                      type="button"
                      onClick={() => handleRate(cardId, "up")}
                      className={`p-1 rounded text-xs transition-all ${
                        userRating === "up"
                          ? "bg-[#e8f4f1] text-[#12715b]"
                          : "text-[#52605b] hover:text-[#17211d]"
                      }`}
                      title="Good rewrite"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRate(cardId, "down")}
                      className={`p-1 rounded text-xs transition-all ${
                        userRating === "down"
                          ? "bg-rose-50 text-rose-600"
                          : "text-[#52605b] hover:text-[#17211d]"
                      }`}
                      title="Needs improvement"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(item.rewrittenBullet, cardId)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ffffff] border border-[#e3e6e1] text-[#17211d] hover:border-[#12715b] hover:text-[#12715b] transition-all shadow-xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#12715b]" />
                        <span className="text-[#12715b]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Bullet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Before vs After Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* BEFORE */}
                <div className="p-3.5 rounded-lg bg-[#ffffff] border border-[#e3e6e1] space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#52605b] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    Original (Passive / Unquantified)
                  </span>
                  <p className="text-xs text-[#52605b] italic font-mono leading-relaxed">
                    "{item.originalBullet}"
                  </p>
                </div>

                {/* AFTER */}
                <div className="p-3.5 rounded-lg bg-[#e8f4f1]/50 border border-[#12715b]/30 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#12715b] flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#12715b]" />
                    Optimized Google X-Y-Z Rewrite
                  </span>
                  <p className="text-xs font-semibold text-[#17211d] leading-relaxed">
                    {item.rewrittenBullet}
                  </p>
                </div>
              </div>

              {/* Formula Breakdown Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-[#e3e6e1]">
                <div className="p-2 rounded-md bg-[#ffffff] border border-[#e3e6e1] text-[11px]">
                  <span className="font-bold text-[#17211d] block">
                    [X] Accomplishment:
                  </span>
                  <span className="text-[#52605b]">
                    {item.breakdown.accomplishedX}
                  </span>
                </div>

                <div className="p-2 rounded-md bg-[#ffffff] border border-[#12715b]/30 text-[11px]">
                  <span className="font-bold text-[#12715b] block">
                    [Y] Measured Impact:
                  </span>
                  <span className="text-[#17211d] font-medium">
                    {item.breakdown.measuredByY}
                  </span>
                </div>

                <div className="p-2 rounded-md bg-[#ffffff] border border-[#e3e6e1] text-[11px]">
                  <span className="font-bold text-[#17211d] block">
                    [Z] Methodology/Stack:
                  </span>
                  <span className="text-[#52605b]">{item.breakdown.byDoingZ}</span>
                </div>
              </div>

              {/* Target Role Relevance */}
              <div className="text-xs text-[#52605b] flex items-start gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-[#12715b] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#17211d]">Why this wins for this role:</strong>{" "}
                  {item.targetRoleRelevance}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
