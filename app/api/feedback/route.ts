import { NextRequest, NextResponse } from "next/server";
import { UserFeedbackSchema } from "@/lib/types/evaluation";
import { getSupabaseClient } from "@/lib/vector/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UserFeedbackSchema.parse(body);

    const feedbackEntry = {
      id: `fb_${Date.now()}`,
      evaluation_id: validated.evaluationId,
      rating: validated.rating,
      scoring_harshness: validated.scoringHarshness || null,
      actionability: validated.actionability || null,
      feedback_text: validated.feedbackText || "",
      target_role_title: validated.targetRoleTitle || "",
      target_company_name: validated.targetCompanyName || "",
      created_at: new Date().toISOString(),
    };

    // Save to Supabase if available
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from("evaluation_feedback").insert(feedbackEntry);
      }
    } catch (dbErr) {
      console.warn("Supabase feedback insert warning (non-blocking):", dbErr);
    }

    console.log("📝 Received User Feedback:", feedbackEntry);

    return NextResponse.json({
      success: true,
      data: feedbackEntry,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Feedback submission error:", message);
    return NextResponse.json(
      { error: message || "Failed to submit feedback" },
      { status: 400 }
    );
  }
}
