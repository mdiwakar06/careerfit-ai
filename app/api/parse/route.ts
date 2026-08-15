import { NextRequest, NextResponse } from "next/server";
import { parseDocumentBuffer } from "@/lib/parsers/document";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No document file was provided in the upload request." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await parseDocumentBuffer(buffer, file.name);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Document parsing error:", message);
    return NextResponse.json(
      { error: message || "Failed to parse document" },
      { status: 500 }
    );
  }
}
