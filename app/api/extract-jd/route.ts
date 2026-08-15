import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid job posting URL is required." },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format provided." },
        { status: 400 }
      );
    }

    // Tier 1: Direct HTTP fetch with polite browser-like headers
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        fallbackRequired: true,
        message: `Direct job extraction was challenged by the host (${response.status}). Please paste the job description text directly.`,
      });
    }

    const html = await response.text();

    // Clean HTML tags and extract readable text
    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    // Extract basic title & company heuristic
    let detectedCompany = parsedUrl.hostname.replace(/^www\./, "").split(".")[0];
    detectedCompany =
      detectedCompany.charAt(0).toUpperCase() + detectedCompany.slice(1);

    return NextResponse.json({
      success: true,
      text: cleanText.substring(0, 12000), // Sane length
      detectedCompany,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("URL extraction fallback:", message);
    return NextResponse.json({
      success: false,
      fallbackRequired: true,
      message:
        "Could not automatically fetch job description from this URL. Please paste the job description text directly.",
    });
  }
}
