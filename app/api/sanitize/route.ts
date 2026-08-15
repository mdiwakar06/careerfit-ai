import { NextRequest, NextResponse } from "next/server";
import { sanitizeResumePII } from "@/lib/sanitizer/pii";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text content is required for PII sanitization." },
        { status: 400 }
      );
    }

    const result = sanitizeResumePII(text);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PII sanitization error:", message);
    return NextResponse.json(
      { error: message || "Failed to sanitize text" },
      { status: 500 }
    );
  }
}
