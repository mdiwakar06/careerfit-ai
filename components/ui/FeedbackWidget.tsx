"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Send, CheckCircle2, MessageSquareHeart } from "lucide-react";

interface FeedbackWidgetProps {
  evaluationId: string;
  targetRoleTitle?: string;
  targetCompanyName?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  evaluationId,
  targetRoleTitle,
  targetCompanyName,
}) => {
  const [rating, setRating] = useState<"thumbs_up" | "thumbs_down" | null>(null);
  const [scoringHarshness, setScoringHarshness] = useState<
    "spot_on" | "too_lenient" | "too_harsh" | null
  >(null);
  const [actionability, setActionability] = useState<
    "highly_actionable" | "somewhat_generic" | null
  >(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluationId,
          rating,
          scoringHarshness: scoringHarshness || undefined,
          actionability: actionability || undefined,
          feedbackText: feedbackText.trim() || undefined,
          targetRoleTitle: targetRoleTitle || "",
          targetCompanyName: targetCompanyName || "",
        }),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.warn("Feedback submission error:", err);
      // Still show thank-you for great UX
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl bg-[#e8f4f1]/80 border border-[#12715b]/30 p-5 text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center gap-2 text-[#12715b] font-bold text-sm">
          <CheckCircle2 className="h-5 w-5" />
          <span>Thank You for the 30-Second Feedback!</span>
        </div>
        <p className="text-xs text-[#52605b]">
          Your honest rating helps continuously calibrate our multi-agent career panel.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#ffffff] border border-[#e3e6e1] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f2ee] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#e8f4f1] text-[#12715b]">
            <MessageSquareHeart className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#17211d]">
              30-Second Live Feedback
            </h4>
            <p className="text-[11px] text-[#52605b]">
              Help us tune our Bar-Raiser scoring accuracy. Was this evaluation helpful?
            </p>
          </div>
        </div>

        {/* Quick Thumbs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRating("thumbs_up")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              rating === "thumbs_up"
                ? "bg-[#12715b] text-white border-[#12715b] shadow-xs"
                : "bg-[#f7f8f6] text-[#17211d] border-[#e3e6e1] hover:border-[#12715b]"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Accurate & Insightful</span>
          </button>

          <button
            type="button"
            onClick={() => setRating("thumbs_down")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              rating === "thumbs_down"
                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                : "bg-[#f7f8f6] text-[#17211d] border-[#e3e6e1] hover:border-rose-300"
            }`}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>Needs Tuning</span>
          </button>
        </div>
      </div>

      {/* Quick MCQ Chips (Visible once a thumb is selected or for quick micro-input) */}
      {rating && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* MCQ 1: Scoring Harshness */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#17211d] block">
              1. How was the match score calibration?
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "spot_on", label: "🎯 Spot On Calibration" },
                { id: "too_lenient", label: "😌 Too Lenient / Generous" },
                { id: "too_harsh", label: "🥊 Too Harsh / Strict" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScoringHarshness(opt.id as any)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    scoringHarshness === opt.id
                      ? "bg-[#e8f4f1] text-[#12715b] border-[#12715b] font-bold"
                      : "bg-[#f7f8f6] text-[#52605b] border-[#e3e6e1] hover:border-[#12715b]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* MCQ 2: Actionability */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#17211d] block">
              2. How actionable were the rewrites & interview points?
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "highly_actionable", label: "⚡ Highly Actionable" },
                { id: "somewhat_generic", label: "🤔 Somewhat Generic" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActionability(opt.id as any)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    actionability === opt.id
                      ? "bg-[#e8f4f1] text-[#12715b] border-[#12715b] font-bold"
                      : "bg-[#f7f8f6] text-[#52605b] border-[#e3e6e1] hover:border-[#12715b]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Textarea */}
          <div className="space-y-1 pt-1">
            <input
              type="text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Optional: What would make this 10x better for you?"
              className="w-full text-xs px-3 py-2 rounded-lg bg-[#f7f8f6] border border-[#e3e6e1] text-[#17211d] placeholder:text-[#52605b]/60 focus:outline-hidden focus:border-[#12715b]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#17211d] text-white hover:bg-[#12715b] disabled:opacity-50 transition-all shadow-xs"
            >
              <Send className="h-3 w-3" />
              <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
